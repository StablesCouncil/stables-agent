const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const crypto = require("crypto");
const https = require("https");
const TelegramBot = require("node-telegram-bot-api");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { STABLES_AGENT_SCOPE_RULES } = require("./agent_scope_rules");
const { OUTPUT_ONLY_RULE, answerWithHygiene } = require("./agent_output_hygiene");
const { STABLES_CORE_FACTS, matchFaq, looksLikeRefusal, bestEffortAnswer } = require("./agent_faq");
const OpenAI = require("openai");

const DB_FILE = path.join(__dirname, "vector_db.json");
const CSV_FILE = path.join(__dirname, "interaction_logs.csv");
const BRAIN_STAMP_FILE = path.join(__dirname, "brain_loaded_telegram.json");

// ── Startup env validation ────────────────────────────────────────────────────
(function validateEnv() {
    const critical = { TELEGRAM_BOT_TOKEN: "Telegram auth", OPENROUTER_API_KEY: "LLM" };
    const optional = { MEXC_API_KEY: "liquidity reporting", MEXC_SECRET_KEY: "liquidity reporting", COUNCIL_GITHUB_TOKEN: "log sync" };
    const missingCritical = Object.keys(critical).filter(k => !process.env[k]);
    const missingOptional = Object.keys(optional).filter(k => !process.env[k]);
    if (missingOptional.length)
        console.warn(`[ENV] Optional vars not set (reduced functionality): ${missingOptional.map(k => `${k} (${optional[k]})`).join(", ")}`);
    if (missingCritical.length) {
        console.error(`[ENV] FATAL — missing critical vars: ${missingCritical.map(k => `${k} (${critical[k]})`).join(", ")} — exiting.`);
        process.exit(1);
    }
    console.log("[ENV] All required vars present.");
})();

// Only respond in this specific topic thread or in private messages
const AGENT_THREAD_ID = 256;
const AGENT_GROUP_ID = -1003504121731;

// MEXC liquidity reporting
const MEXC_API_KEY = process.env.MEXC_API_KEY;
const MEXC_SECRET_KEY = process.env.MEXC_SECRET_KEY;
const LIQUIDITY_THREAD_ID = AGENT_THREAD_ID; // change to a dedicated thread ID if preferred
const LIQUIDITY_INTERVAL_MS = 30 * 60 * 1000;

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error("ERROR: TELEGRAM_BOT_TOKEN is not set in .env.");
    process.exit(1);
}

const openRouterKey = process.env.OPENROUTER_API_KEY;
if (!openRouterKey) {
    console.error("ERROR: OPENROUTER_API_KEY is not set in .env.");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

const llm = new OpenAI({
    apiKey: openRouterKey,
    baseURL: "https://openrouter.ai/api/v1",
});

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function extractReplyText(completion) {
    const txt = completion?.choices?.[0]?.message?.content;
    return typeof txt === "string" ? txt.trim() : null;
}

function isQuotaError(err) {
    // OpenRouter reports an exhausted DAILY free-model allowance as a plain 429 whose message reads
    // "Rate limit exceeded: free-models-per-day", with metadata.limit_source
    // "openrouter_free_tier_daily". None of that matched the patterns below, so the caller fell
    // through to isBusyError and told the user to "try again in a minute" when the agent was
    // actually finished until the daily reset. A dormant backend has to refuse honestly.
    const msg = err?.message ? String(err.message).toLowerCase() : "";
    const limitSource = String(err?.error?.metadata?.limit_source || "").toLowerCase();
    return (
        err?.code === "rate_limit_exceeded" ||
        err?.code === "insufficient_quota" ||
        limitSource.includes("daily") ||
        msg.includes("rate_limit") ||
        msg.includes("quota") ||
        msg.includes("per-day") ||
        msg.includes("per day")
    );
}

function getErrorHttpStatus(err) {
    if (!err) return undefined;
    if (typeof err.status === "number") return err.status;
    if (typeof err.response?.status === "number") return err.response.status;
    if (typeof err.error?.status === "number") return err.error.status;
    const msg = String(err.message || err.error?.message || "");
    if (/\b429\b|rate limit|too many requests/i.test(msg)) return 429;
    return undefined;
}

function isBusyError(err) {
    return getErrorHttpStatus(err) === 429 || err?.code === 429;
}

function isEmptyCompletionError(err) {
    return String(err?.message || "").includes("Empty completion content");
}

async function chatCompletionWithRetry(payload) {
    const maxAttempts = 5;
    let lastErr;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const completion = await llm.chat.completions.create(payload);
            const reply = extractReplyText(completion);
            if (!reply) throw new Error("Empty completion content");
            return reply;
        } catch (err) {
            lastErr = err;
            // A daily-allowance 429 cannot succeed on a retry, and retrying it just spends another
            // rejected call. Only a transient 429 or an empty completion is worth a second attempt.
            const shouldRetry = (isBusyError(err) && !isQuotaError(err)) || isEmptyCompletionError(err);
            if (!shouldRetry || attempt === maxAttempts) throw err;
            const baseMs = 1200 * Math.pow(2, attempt - 1);
            const delayMs = Math.min(16000, baseMs + Math.floor(Math.random() * 800));
            const reason = isEmptyCompletionError(err) ? "empty completion" : "busy (429)";
            console.warn(`OpenRouter ${reason}, attempt ${attempt}/${maxAttempts}, waiting ${delayMs}ms`);
            await sleep(delayMs);
        }
    }
    throw lastErr;
}

// ── MEXC liquidity ────────────────────────────────────────────────────────────

async function fetchMexcBalances() {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = crypto.createHmac("sha256", MEXC_SECRET_KEY).update(queryString).digest("hex");
    const url = `https://api.mexc.com/api/v3/account?${queryString}&signature=${signature}`;

    return new Promise((resolve, reject) => {
        const req = https.request(url, { headers: { "X-MEXC-APIKEY": MEXC_API_KEY } }, (res) => {
            let raw = "";
            res.on("data", c => raw += c);
            res.on("end", () => {
                try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
            });
        });
        req.on("error", reject);
        req.end();
    });
}

function formatLiquidityMessage(balances) {
    const find = asset => balances.find(b => b.asset === asset) || { free: "0", locked: "0" };
    const usdt = find("USDT");
    const minima = find("MINIMA");
    const fmt = (n, dp = 2) => parseFloat(n || 0).toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
    const timeStr = new Date().toUTCString().replace(" GMT", " UTC");
    return [
        "Liquidity snapshot — MEXC",
        "",
        `USDT     available: ${fmt(usdt.free, 2)}   in orders: ${fmt(usdt.locked, 2)}`,
        `MINIMA   available: ${fmt(minima.free, 2)}   in orders: ${fmt(minima.locked, 2)}`,
        "",
        timeStr
    ].join("\n");
}

async function postLiquidityReport(chatId, threadId) {
    try {
        const data = await fetchMexcBalances();
        if (!data.balances) throw new Error(`MEXC error: ${JSON.stringify(data)}`);
        const msg = formatLiquidityMessage(data.balances);
        const opts = threadId ? { message_thread_id: threadId } : {};
        await bot.sendMessage(chatId, msg, opts);
        console.log("📊 Liquidity report sent.");
    } catch (err) {
        console.error("❌ Liquidity report error:", err.message || err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────

// 1. Initialize Embeddings & Vector DB
async function initXenova() {
    const { pipeline } = await import("@xenova/transformers");
    const generateEmbeddings = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

    return {
        embedDocuments: async (texts) => {
            const embeddings = [];
            for (const text of texts) {
                const output = await generateEmbeddings(text, { pooling: "mean", normalize: true });
                embeddings.push(Array.from(output.data));
            }
            return embeddings;
        },
        embedQuery: async (text) => {
            const output = await generateEmbeddings(text, { pooling: "mean", normalize: true });
            return Array.from(output.data);
        }
    };
}

async function loadVectorStore(embeddings) {
    if (!fs.existsSync(DB_FILE)) {
        throw new Error("Vector DB not found. Run ingest_knowledge.js first.");
    }
    const rawData = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const vectorStore = new MemoryVectorStore(embeddings);
    vectorStore.memoryVectors = rawData.memoryVectors;
    return vectorStore;
}

async function startAgent() {
    console.log("=========================================");
    console.log("🤖 STABLES TELEGRAM AGENT STARTING 🤖");
    console.log("=========================================");
    console.log("Initializing local Brain (Xenova embeddings + OpenRouter)...");

    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);

    console.log("✅ Brain Loaded! OpenRouter API active.");
    fs.writeFileSync(BRAIN_STAMP_FILE, JSON.stringify({ loaded: true, ts: Date.now() }));
    console.log("📡 Listening for Telegram messages on @StablesAgentBot...");

    bot.on("message", async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (!text) return;

        const botName = "@StablesAgentBot";
        const isPrivate = msg.chat.type === "private";
        const isAgentTopic = msg.chat.id === AGENT_GROUP_ID && msg.message_thread_id === AGENT_THREAD_ID;
        const isMention = text.includes(botName);

        // /liquidity command — works in agent topic or private chat, no mention needed
        if (text.startsWith("/liquidity")) {
            if (!isPrivate && !isAgentTopic) return;
            await postLiquidityReport(chatId, msg.message_thread_id || null);
            return;
        }

        if (!isPrivate && !isAgentTopic) return;
        if (!isPrivate && !isMention) return;

        const cleanQuery = text.replace(botName, "").trim();
        if (!cleanQuery) return;

        console.log(`\n💬 Received anonymous message: "${cleanQuery}"`);
        console.log("🔎 Searching Stables knowledge base...");

        bot.sendChatAction(chatId, "typing");

        try {
            /* The common questions are answered from prepared text at once (shared with the web
               agent, agent_faq.js); everything else goes through retrieval and the model. */
            const prepared = matchFaq(cleanQuery, "");
            if (prepared) {
                console.log("✨ PREPARED REPLY (" + prepared.id + ", " + prepared.lang + ")");
                const sendOptions0 = msg.message_thread_id ? { message_thread_id: msg.message_thread_id } : {};
                bot.sendMessage(chatId, prepared.answer, sendOptions0);
                const ts0 = new Date().toISOString();
                if (!fs.existsSync(CSV_FILE)) fs.writeFileSync(CSV_FILE, '"Timestamp","Anonymous Question","AI Response"\n', "utf-8");
                fs.appendFileSync(CSV_FILE, '"' + ts0 + '","' + cleanQuery.replace(/"/g, '""') + '","' + prepared.answer.replace(/"/g, '""') + '"\n', "utf-8");
                return;
            }
            // 1. Search Vector DB
            const results = await vectorStore.similaritySearch(cleanQuery, 5);
            /* The core facts are the floor under every answer: retrieval is probabilistic, they are not. */
            let context = "\n[Core facts]: " + STABLES_CORE_FACTS + "\n";
            results.forEach((res, i) => context += `\n[Context ${i + 1}]: ${res.pageContent}\n`);

            // 2. Call OpenRouter
            console.log("🤖 Calling OpenRouter...");
            const chatPayload = {
                model: "openrouter/free",
                temperature: 0.3,
                max_tokens: 400,
                reasoning: { exclude: true },
                messages: [
                    {
                        role: "system",
                        content: `You are @StablesAgent, the official AI assistant for the Stables Council, a decentralized banking system built on Minima.
${STABLES_AGENT_SCOPE_RULES}
RULES:
- Answer from the core facts and the context provided. Do not invent information beyond them.
- If they cover the question only in part, answer the part they cover and say in one sentence which part they do not, pointing to the Council's official channels for it. Never reply with a bare refusal and never say that you lack information or context.
- Answer in the EXACT SAME LANGUAGE as the user's question.
- Do NOT greet the user. Jump straight into the answer.
- Do NOT use the word "doctrine".
- Do NOT use emojis, bullet points, or em-dashes.
- Keep answers concise and conversational.
- ${OUTPUT_ONLY_RULE}`
                    },
                    {
                        role: "user",
                        content: `Question: "${cleanQuery}"\n\nContext:\n${context}`
                    }
                ]
            };
            const hygiene = await answerWithHygiene({
                ask: (p) => chatCompletionWithRetry(p),
                payload: chatPayload,
                source: "telegram",
                question: cleanQuery
            });
            if (hygiene.hit) console.warn(`[hygiene] scaffolding in the model reply (retried=${hygiene.retried}, salvaged=${!!hygiene.text})`);

            let replyText = String(hygiene.text || "").replace(/"/g, "").trim();
            /* A refusal is retried once from the core facts; a second refusal is replaced by them. */
            if (looksLikeRefusal(replyText)) {
                console.warn("[refusal] model declined; retrying from the core facts");
                const retryPayload = JSON.parse(JSON.stringify(chatPayload));
                retryPayload.messages[1].content = 'Question: "' + cleanQuery + '"' + "\n\nAnswer this from the core facts below. Say what they do say about it, plainly, in the language of the question; if they do not cover part of it, say which part in one sentence. Do not say that you lack information.\n\n" + STABLES_CORE_FACTS + "\n\nAdditional context:\n" + context;
                try {
                    const second = await answerWithHygiene({ ask: (p) => chatCompletionWithRetry(p), payload: retryPayload, source: "telegram-retry", question: cleanQuery });
                    const secondText = String(second.text || "").replace(/"/g, "").trim();
                    replyText = (secondText && secondText.length >= 12 && !looksLikeRefusal(secondText)) ? secondText : "";
                } catch (_) { replyText = ""; }
                if (!replyText) replyText = bestEffortAnswer(cleanQuery, "", "");
            }
            if (!replyText || replyText.length < 12) {
                console.warn("[fallback] empty model reply; answering from prepared text");
                replyText = bestEffortAnswer(cleanQuery, "", "");
            }

            console.log("✨ REPLY:");
            console.log(replyText);
            console.log("=========================================\n");

            const sendOptions = msg.message_thread_id ? { message_thread_id: msg.message_thread_id } : {};
            bot.sendMessage(chatId, replyText, sendOptions);

            // 3. Anonymous CSV log
            const timestamp = new Date().toISOString();
            const safeQuery = cleanQuery.replace(/"/g, '""');
            const safeReply = replyText.replace(/"/g, '""');
            const csvLine = `"${timestamp}","${safeQuery}","${safeReply}"\n`;

            if (!fs.existsSync(CSV_FILE)) {
                fs.writeFileSync(CSV_FILE, '"Timestamp","Anonymous Question","AI Response"\n', "utf-8");
            }
            fs.appendFileSync(CSV_FILE, csvLine, "utf-8");

        } catch (error) {
            console.error("❌ Error generating response:", error);
            const errorMsg = isQuotaError(error)
                ? "Sorry, I'm done for today. Heading for a break. Please come back a bit later."
                : bestEffortAnswer(cleanQuery, "", "I could not reach my language model just now.");
            const sendOptions = msg.message_thread_id ? { message_thread_id: msg.message_thread_id } : {};
            bot.sendMessage(chatId, errorMsg, sendOptions);
        }
    });

    // Scheduled liquidity reports every 30 minutes
    if (MEXC_API_KEY && MEXC_SECRET_KEY) {
        setInterval(() => postLiquidityReport(AGENT_GROUP_ID, LIQUIDITY_THREAD_ID), LIQUIDITY_INTERVAL_MS);
        console.log("📊 Liquidity report scheduled every 30 min.");
    } else {
        console.warn("⚠️  MEXC_API_KEY or MEXC_SECRET_KEY not set — liquidity reporting disabled.");
    }
}

startAgent().catch(console.error);
