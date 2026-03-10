require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { Ollama } = require("@langchain/community/llms/ollama");

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

async function runQuery(question) {
    console.log(`🤔 Question: "${question}"`);
    console.log("🧠 Initializing Xenova local model for embeddings...");
    const embeddings = await initXenova();

    console.log("💾 Loading local Vector Database...");
    const vectorStore = await loadVectorStore(embeddings);

    console.log("🔎 Searching for relevant knowledge...");
    const results = await vectorStore.similaritySearch(question, 3);

    let context = "";
    results.forEach((res, i) => {
        context += `\n--- Context Snapshot ${i + 1} ---\n${res.pageContent}\n`;
    });

    console.log("=========================================");
    console.log("Found Context:");
    console.log(context);
    console.log("=========================================\n");

    console.log("🤖 Asking Local Llama 3.2 via Ollama to generate a response...");

    const llm = new Ollama({
        baseUrl: "http://localhost:11434", // Default Ollama URL
        model: "llama3.2",
        temperature: 0.3,
    });

    const prompt = `You are @StablesAgent, the official AI assistant for the Stables Council (a decentralized banking system on Minima).
A user on X/Twitter has asked the following question:
"${question}"

Using ONLY the official context provided below, write a short, polite, and helpful Twitter reply (under 280 characters). Do not use emojis unless appropriate. Do not make up information that is not in the context.

CONTEXT:
${context}

DRAFT REPLY:`;

    const response = await llm.invoke(prompt);

    console.log("=========================================");
    console.log("✅ Final LLM Response:");
    console.log(response);
    console.log("=========================================");
}

const userQuery = process.argv[2] || "What is the mission of the Stables Council?";
runQuery(userQuery).catch(console.error);
