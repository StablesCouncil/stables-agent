/**
 * StablesAgent X Post Script
 * Posts to @StablesAgent on X (Twitter) using the free API tier.
 * Run once manually or via cron for scheduled posting.
 *
 * Required .env vars:
 *   X_AGENT_API_KEY, X_AGENT_API_SECRET
 *   X_AGENT_ACCESS_TOKEN, X_AGENT_ACCESS_SECRET
 *   GROQ_API_KEY
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const { TwitterApi } = require("twitter-api-v2");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const OpenAI = require("openai");

const DB_FILE = path.join(__dirname, "vector_db.json");

function checkEnv() {
    const required = ["X_AGENT_API_KEY", "X_AGENT_API_SECRET", "X_AGENT_ACCESS_TOKEN", "X_AGENT_ACCESS_SECRET", "GROQ_API_KEY"];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
        console.error("Missing env vars:", missing.join(", "));
        console.error("Add them to task_stablesagent-brain-base/.env");
        process.exit(1);
    }
}

async function initXenova() {
    const { pipeline } = await import("@xenova/transformers");
    const generateEmbeddings = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    return {
        embedQuery: async (text) => {
            const output = await generateEmbeddings(text, { pooling: "mean", normalize: true });
            return Array.from(output.data);
        },
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

async function main() {
    checkEnv();

    const client = new TwitterApi({
        appKey: process.env.X_AGENT_API_KEY,
        appSecret: process.env.X_AGENT_API_SECRET,
        accessToken: process.env.X_AGENT_ACCESS_TOKEN,
        accessSecret: process.env.X_AGENT_ACCESS_SECRET,
    });
    const twitterClient = client.readWrite;

    const groq = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });

    console.log("Loading brain...");
    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);

    const seedQueries = [
        "What is Stables",
        "self-custody",
        "Minima",
        "stablecoin",
        "Be your bank",
    ];
    const seed = seedQueries[Math.floor(Math.random() * seedQueries.length)];
    const results = await vectorStore.similaritySearch(seed, 4);
    const context = results.map((r, i) => `[${i + 1}] ${r.pageContent}`).join("\n\n");

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 100,
        messages: [
            {
                role: "system",
                content: `You are @StablesAgent posting on X. Write ONE tweet under 280 characters.
Rules:
- Use ONLY the context provided. Do not invent.
- ALWAYS include #Minima at the end. Add #Stables and other relevant hashtags (e.g. #Stablecoins #Crypto #DeFi #SelfCustody) when they fit. Keep 2-4 hashtags total.
- No emojis. Sound human. One clear idea per tweet.
- Do NOT use em-dashes. Use commas or periods.`,
            },
            {
                role: "user",
                content: `Context:\n${context}\n\nWrite one tweet that shares something useful about Stables.`,
            },
        ],
    });

    let tweet = completion.choices[0].message.content.trim();
    tweet = tweet.replace(/^["']|["']$/g, "").trim();
    if (!tweet.includes("#Minima")) tweet = tweet.trimEnd() + " #Minima";
    if (tweet.length > 280) tweet = tweet.substring(0, 277) + "...";

    console.log("Posting:", tweet);

    const me = await twitterClient.v2.me();
    console.log("Authenticated as:", me.data.username);

    await twitterClient.v2.tweet(tweet);
    console.log("Posted.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
