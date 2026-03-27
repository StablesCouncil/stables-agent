const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const { TwitterApi } = require("twitter-api-v2");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const OpenAI = require("openai");

// 1. Initialize Twitter Client
const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
const twitterClient = client.readWrite;

// Data persistence for tracking processed tweets
const STATE_FILE = path.join(__dirname, "agent_state.json");
let lastProcessedId = null;

if (fs.existsSync(STATE_FILE)) {
    const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    lastProcessedId = state.lastProcessedId;
}

function saveState(sinceId) {
    fs.writeFileSync(STATE_FILE, JSON.stringify({ lastProcessedId: sinceId }));
}

// 2. Initialize Embeddings & Vector DB
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

const DB_FILE = path.join(__dirname, "vector_db.json");

async function loadVectorStore(embeddings) {
    if (!fs.existsSync(DB_FILE)) {
        throw new Error("Vector DB not found. Run ingest_knowledge.js first.");
    }
    const rawData = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const vectorStore = new MemoryVectorStore(embeddings);
    vectorStore.memoryVectors = rawData.memoryVectors;
    return vectorStore;
}

// 3. Initialize AI Brain
const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
    console.error("ERROR: GROQ_API_KEY is not set in .env.");
    process.exit(1);
}
const groq = new OpenAI({
    apiKey: groqApiKey,
    baseURL: "https://api.groq.com/openai/v1",
});

async function startAgent() {
    console.log("🤖 Loading Agent Brain...");
    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);

    // Get our own user ID to poll mentions
    const me = await twitterClient.v2.me();
    const myId = me.data.id;
    console.log(`✅ Authenticated on X as: @${me.data.username}`);

    console.log("📡 Listening for mentions on X...");

    // The Polling Loop
    setInterval(async () => {
        try {
            console.log("⏳ Checking for new mentions...");

            // Fetch Mentions
            const mentions = await twitterClient.v2.userMentionTimeline(myId, {
                since_id: lastProcessedId || undefined,
                "tweet.fields": ["created_at", "author_id"],
                max_results: 5,
            });

            if (mentions.meta.result_count === 0) {
                return;
            }

            // Process each new mention
            for (const tweet of mentions.data) {
                console.log(`\n💬 New Mention from User ID ${tweet.author_id}: "${tweet.text}"`);

                // 1. Clean the tweet text (remove our handle)
                const cleanQuery = tweet.text.replace(/@StablesAgent/g, "").trim();

                // 2. Search local vector database
                const results = await vectorStore.similaritySearch(cleanQuery, 3);
                let context = "";
                results.forEach((res, i) => context += `\n[Context ${i + 1}]: ${res.pageContent}\n`);

                // 3. Generate response via Groq
                console.log("🧠 Thinking...");
                const completion = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.3,
                    max_tokens: 100,
                    messages: [
                        {
                            role: "system",
                            content: `You are @StablesAgent, the official AI assistant for the Stables Council, a decentralized banking system built on Minima.
RULES:
- Answer ONLY using the context provided. Do not invent information.
- Answer in the EXACT SAME LANGUAGE as the user's question.
- Write a short, helpful reply under 280 characters.
- Do NOT use hashtags unless using #Stables.
- Do NOT use emojis, bullet points, or em-dashes.
- Do NOT greet the user. Jump straight into the answer.`
                        },
                        {
                            role: "user",
                            content: `Question: "${cleanQuery}"\n\nContext:\n${context}`
                        }
                    ]
                });
                let replyText = completion.choices[0].message.content.trim();
                replyText = replyText.replace(/"/g, "").trim();

                // Enforce length limit
                if (replyText.length > 280) {
                    replyText = replyText.substring(0, 277) + "...";
                }

                console.log(`📝 Replying: "${replyText}"`);

                // 5. Post the Reply to X
                await twitterClient.v2.tweet(replyText, {
                    reply: { in_reply_to_tweet_id: tweet.id }
                });

                console.log("✅ Reply posted successfully.");

                // Update State
                lastProcessedId = tweet.id;
                saveState(lastProcessedId);
            }

        } catch (error) {
            console.error("❌ Error in polling loop:", error.message);
        }
    }, 60000); // Check every 60 seconds
}

startAgent().catch(console.error);
