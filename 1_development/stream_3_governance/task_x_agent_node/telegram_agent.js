const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const OpenAI = require("openai");

const DB_FILE = path.join(__dirname, "vector_db.json");
const CSV_FILE = path.join(__dirname, "interaction_logs.csv");

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error("ERROR: TELEGRAM_BOT_TOKEN is not set in .env.");
    process.exit(1);
}

const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
    console.error("ERROR: GROQ_API_KEY is not set in .env.");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

const groq = new OpenAI({
    apiKey: groqApiKey,
    baseURL: "https://api.groq.com/openai/v1",
});

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
    console.log("Initializing local Brain (Xenova embeddings + Groq API)...");

    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);

    console.log("✅ Brain Loaded! Groq API active.");
    console.log("📡 Listening for Telegram messages on @StablesAgentBot...");

    bot.on("message", async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (!text) return;

        const botName = "@StablesAgentBot";
        const isMention = text.includes(botName) || msg.chat.type === "private";
        if (!isMention) return;

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

            // 2. Call Groq API
            console.log("🤖 Calling Groq API...");
            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
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

            let replyText = completion.choices[0].message.content.trim();
            replyText = replyText.replace(/"/g, "").trim();

            console.log("✨ REPLY:");
            console.log(replyText);
            console.log("=========================================\n");

            bot.sendMessage(chatId, replyText);

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
            bot.sendMessage(chatId, "I'm currently undergoing maintenance. Please try again shortly.");
        }
    });
}

startAgent().catch(console.error);
