const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const OpenAI = require("openai");

const DB_FILE = path.join(__dirname, "vector_db.json");
const CSV_FILE = path.join(__dirname, "interaction_logs.csv");

// Only respond in this specific topic thread or in private messages
const AGENT_THREAD_ID = 256;
const AGENT_GROUP_ID = -1003504121731;

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
    const msg = err?.message ? String(err.message) : "";
    return (
        err?.code === "rate_limit_exceeded" ||
        err?.code === "insufficient_quota" ||
        msg.includes("rate_limit") ||
        msg.includes("quota")
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
            if (!isBusyError(err) || attempt === maxAttempts) throw err;
            const baseMs = 1200 * Math.pow(2, attempt - 1);
            const delayMs = Math.min(16000, baseMs + Math.floor(Math.random() * 800));
            console.warn(`OpenRouter busy (429), attempt ${attempt}/${maxAttempts}, waiting ${delayMs}ms`);
            await sleep(delayMs);
        }
    }
    throw lastErr;
}

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
    console.log("📡 Listening for Telegram messages on @StablesAgentBot...");

    bot.on("message", async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (!text) return;

        const botName = "@StablesAgentBot";
        const isPrivate = msg.chat.type === "private";
        const isAgentTopic = msg.chat.id === AGENT_GROUP_ID && msg.message_thread_id === AGENT_THREAD_ID;
        const isMention = text.includes(botName);

        if (!isPrivate && !isAgentTopic) return;
        if (!isPrivate && !isMention) return;

        const cleanQuery = text.replace(botName, "").trim();
        if (!cleanQuery) return;

        console.log(`\n💬 Received anonymous message: "${cleanQuery}"`);
        console.log("🔎 Searching Stables knowledge base...");

        bot.sendChatAction(chatId, "typing");

        try {
            // 1. Search Vector DB
            const results = await vectorStore.similaritySearch(cleanQuery, 3);
            let context = "";
            results.forEach((res, i) => context += `\n[Context ${i + 1}]: ${res.pageContent}\n`);

            // 2. Call OpenRouter
            console.log("🤖 Calling OpenRouter...");
            const replyTextRaw = await chatCompletionWithRetry({
                model: "openrouter/free",
                temperature: 0.3,
                max_tokens: 400,
                messages: [
                    {
                        role: "system",
                        content: `You are @StablesAgent, the official AI assistant for the Stables Council, a decentralized banking system built on Minima.
RULES:
- Answer ONLY using the context provided. Do not invent information.
- Answer in the EXACT SAME LANGUAGE as the user's question.
- Do NOT greet the user. Jump straight into the answer.
- Do NOT use the word "doctrine".
- Do NOT use emojis, bullet points, or em-dashes.
- Keep answers concise and conversational.`
                    },
                    {
                        role: "user",
                        content: `Question: "${cleanQuery}"\n\nContext:\n${context}`
                    }
                ]
            });

            let replyText = replyTextRaw.replace(/"/g, "").trim();

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
                : isBusyError(error)
                    ? "Sorry, I'm handling multiple requests at the same time. Please try again in a minute."
                    : "I'm currently undergoing maintenance. Please try again shortly.";
            const sendOptions = msg.message_thread_id ? { message_thread_id: msg.message_thread_id } : {};
            bot.sendMessage(chatId, errorMsg, sendOptions);
        }
    });
}

startAgent().catch(console.error);
