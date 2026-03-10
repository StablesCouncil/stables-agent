const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const readline = require("readline");
const { TwitterApi } = require("twitter-api-v2");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { Ollama } = require("@langchain/community/llms/ollama");

const DB_FILE = path.join(__dirname, "vector_db.json");

// Initialize Twitter Client (Read-Only Free Tier Endpoint)
// NOTE: While free tier blocks polling timelines, it MAY allow fetching a single specific tweet by ID if the keys are valid.
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
}).readOnly;

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

// Extract tweet ID from a URL
function extractTweetId(urlOrText) {
    const match = urlOrText.match(/(?:x\.com|twitter\.com)\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/);
    return match ? match[3] : null;
}

async function getTweetText(tweetId) {
    try {
        const tweet = await twitterClient.v2.singleTweet(tweetId, {
            "tweet.fields": ["text"]
        });
        return tweet.data.text;
    } catch (error) {
        console.error(`\n❌ Error fetching tweet from X API. Developer Free Tier may be blocking Read endpoints entirely. (${error.message})`);
        return null;
    }
}

async function startCopilot() {
    console.log("=========================================");
    console.log("🤖 STABLES X COPILOT TERMINAL 🤖");
    console.log("=========================================");
    console.log("Initializing local AI Brain (Xenova + Ollama Llama 3.2)...");

    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);

    const llm = new Ollama({
        baseUrl: "http://localhost:11434",
        model: "llama3.2",
        temperature: 0.3,
    });

    console.log("✅ Brain Loaded! 100% Local & Cost-Free.");
    console.log("Type any question OR paste an X URL, and I will draft the perfect reply.");
    console.log("Type 'exit' to quit.\n");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askQuestion = () => {
        rl.question("💬 Paste X URL or Question Text: ", async (input) => {
            if (input.toLowerCase() === 'exit') {
                rl.close();
                return;
            }

            if (!input.trim()) {
                askQuestion();
                return;
            }

            let question = input.trim();
            const tweetId = extractTweetId(question);

            if (tweetId) {
                console.log(`\n🔗 Detected X URL! Attempting to fetch tweet ${tweetId}...`);
                const fetchedText = await getTweetText(tweetId);
                if (fetchedText) {
                    console.log(`📄 Fetched Tweet: "${fetchedText}"`);
                    question = fetchedText; // Use the fetched tweet as the question
                } else {
                    console.log("⚠️ Could not fetch tweet. Please paste the direct text instead.\n");
                    askQuestion();
                    return;
                }
            }

            console.log("\n🔎 Searching Stables Constitution...");
            const results = await vectorStore.similaritySearch(question, 3);

            let context = "";
            results.forEach((res, i) => context += `\n[Context ${i + 1}]: ${res.pageContent}\n`);

            console.log("🤖 Drafting reply...");
            const prompt = `You are @StablesAgent, the official AI assistant for the Stables Council (a decentralized banking system on Minima).
A user on X/Twitter has asked the following question:
"${question}"

Using ONLY the official context provided below, write a short, polite, and helpful Twitter reply (under 280 characters). Do not use hashtags unless you use #Stables. Do not append AI markers like 🤖 and do not use em-dashes. Do not make up information that is not in the context.

CONTEXT:
${context}

DRAFT REPLY:`;

            let replyText = await llm.invoke(prompt);
            replyText = replyText.replace(/"/g, "").trim();

            console.log("\n=========================================");
            console.log("✨ DRAFT REPLY:");
            console.log(replyText);
            console.log("=========================================\n");

            askQuestion(); // Loop back for next question
        });
    };

    askQuestion();
}

startCopilot().catch(console.error);
