const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const http = require("http");
const https = require("https");
const OpenAI = require("openai");

const DB_FILE = path.join(__dirname, "vector_db.json");
const CSV_FILE = path.join(__dirname, "interaction_logs_web.csv");

const openRouterKey = process.env.OPENROUTER_API_KEY;
if (!openRouterKey) {
    console.error("ERROR: OPENROUTER_API_KEY is not set in .env.");
    process.exit(1);
}

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

function isBusyError(err) {
    return err?.status === 429 || err?.code === 429;
}

async function chatCompletionWithRetry(payload) {
    try {
        const completion = await llm.chat.completions.create(payload);
        const reply = extractReplyText(completion);
        if (!reply) throw new Error("Empty completion content");
        return reply;
    } catch (err) {
        if (isBusyError(err)) {
            await sleep(1500);
            const completion = await llm.chat.completions.create(payload);
            const reply = extractReplyText(completion);
            if (!reply) throw new Error("Empty completion content");
            return reply;
        }
        throw err;
    }
}

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
    const { MemoryVectorStore } = await import("langchain/vectorstores/memory");

    if (!fs.existsSync(DB_FILE)) {
        throw new Error("Vector DB not found. Run ingest_knowledge.js first.");
    }
    const rawData = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const vectorStore = new MemoryVectorStore(embeddings);
    vectorStore.memoryVectors = rawData.memoryVectors;
    return vectorStore;
}

async function startWebAgent() {
    console.log("=========================================");
    console.log("🖥️  STABLES WEB AGENT STARTING");
    console.log("=========================================");
    console.log("Initializing local Brain (Xenova embeddings + OpenRouter)...");

    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);

    console.log("✅ Brain Loaded! OpenRouter API active.");
    console.log("🌐 Ready for browser chat sessions.");

    const PORT     = process.env.WEB_AGENT_PORT || 8080;
    const SSL_CERT = "/etc/letsencrypt/live/agent.stablescouncil.org/fullchain.pem";
    const SSL_KEY  = "/etc/letsencrypt/live/agent.stablescouncil.org/privkey.pem";
    const useSSL   = fs.existsSync(SSL_CERT) && fs.existsSync(SSL_KEY);

    async function requestHandler(req, res) {
        // Simple CORS + JSON
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            res.writeHead(204);
            return res.end();
        }

        if (req.method === "GET" && req.url === "/health") {
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            return res.end(JSON.stringify({ status: "ok", ts: Date.now() }));
        }

        // Serve static assets (stables.css, images) from the same directory
        if (req.method === "GET" && /\.(css|png|jpg|jpeg|svg|ico|webp)$/i.test(req.url.split("?")[0])) {
            const assetPath = path.join(__dirname, req.url.split("?")[0]);
            if (fs.existsSync(assetPath)) {
                const ext = path.extname(assetPath).toLowerCase();
                const mime = { ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg",
                               ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
                               ".ico": "image/x-icon", ".webp": "image/webp" };
                res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
                return res.end(fs.readFileSync(assetPath));
            }
        }

        if (req.method === "GET" && (req.url === "/" || req.url.split("?")[0] === "/chat")) {
            const chatPath = path.join(__dirname, "web_chat.html");
            if (!fs.existsSync(chatPath)) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                return res.end("web_chat.html not found. Deploy file next to web_agent.js.");
            }
            const html = fs.readFileSync(chatPath, "utf-8");
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            return res.end(html);
        }

        if (req.method === "POST" && req.url === "/api/chat") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString("utf-8");
                if (body.length > 1_000_000) req.socket.destroy();
            });

            req.on("end", async () => {
                try {
                    const data = JSON.parse(body || "{}");
                    const cleanQuery = (data.message || "").toString().trim();
                    if (!cleanQuery) {
                        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                        return res.end(JSON.stringify({ error: "Message is required." }));
                    }

                    console.log(`\n💬 Web chat question: "${cleanQuery}"`);
                    console.log("🔎 Searching Stables knowledge base...");

                    const results = await vectorStore.similaritySearch(cleanQuery, 3);
                    let context = "";
                    results.forEach((resDoc, i) => {
                        context += `\n[Context ${i + 1}]: ${resDoc.pageContent}\n`;
                    });

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
- When writing in French, always use proper accents and diacritics (é, è, ê, à, â, ù, ô, û, î, ï, ü, ç, etc.). Never use ASCII-only spellings (e.g. write "élément" not "element", "écosystème" not "ecosysteme").
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

                    console.log("✨ WEB REPLY:");
                    console.log(replyText);
                    console.log("=========================================\n");

                    const timestamp = new Date().toISOString();
                    const safeQuery = cleanQuery.replace(/"/g, '""');
                    const safeReply = replyText.replace(/"/g, '""');
                    const csvLine = `"${timestamp}","${safeQuery}","${safeReply}"\n`;

                    if (!fs.existsSync(CSV_FILE)) {
                        fs.writeFileSync(CSV_FILE, '"Timestamp","Anonymous Question","AI Response"\n', "utf-8");
                    }
                    fs.appendFileSync(CSV_FILE, csvLine, "utf-8");

                    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ reply: replyText }));
                } catch (err) {
                    console.error("❌ Error in /api/chat:", err);
                    const replyMsg = isQuotaError(err)
                        ? "Sorry, I'm done for today. Heading for a break. Please come back a bit later."
                        : isBusyError(err)
                            ? "Sorry, I'm handling multiple requests at the same time. Please try again in a minute."
                            : "I'm currently undergoing maintenance. Please try again shortly.";
                    res.writeHead(isQuotaError(err) || isBusyError(err) ? 200 : 500, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ reply: replyMsg }));
                }
            });

            return;
        }

        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
    }

    if (useSSL) {
        const sslOptions = {
            cert: fs.readFileSync(SSL_CERT),
            key:  fs.readFileSync(SSL_KEY),
        };
        https.createServer(sslOptions, requestHandler).listen(443, () => {
            console.log(`🔒 Web agent listening on https://agent.stablescouncil.org/chat`);
        });
        // Redirect HTTP → HTTPS
        http.createServer((req, res) => {
            res.writeHead(301, { Location: `https://agent.stablescouncil.org${req.url}` });
            res.end();
        }).listen(80, () => {
            console.log(`↪  HTTP redirect active on port 80`);
        });
    } else {
        http.createServer(requestHandler).listen(PORT, () => {
            console.log(`🌍 Web agent listening on http://localhost:${PORT}/chat`);
        });
    }
}

startWebAgent().catch((err) => {
    console.error("Fatal error starting web agent:", err);
    process.exit(1);
});

