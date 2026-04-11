require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { Document } = require("langchain/document");

async function initXenova() {
    // Dynamic import is required for ES modules in CommonJS
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

// Supports multiple layouts:
// - Optional override: STABLES_BRAIN_DIR
// - Full repo: promoted brain in 2_current (handshake source of truth)
// - Server: task_x_agent_node sits next to task_stablesagent-brain-base
// - Laptop sandbox: 1_development/.../task_stablesagent-brain-base
const BRAIN_SIBLING = path.resolve(__dirname, "..", "task_stablesagent-brain-base");
const BRAIN_PROD_IN_REPO = path.resolve(__dirname, "..", "..", "..", "2_current", "stream_3_governance", "prod_stablesagent-brain-base");
const BRAIN_IN_REPO = path.resolve(__dirname, "..", "..", "..", "1_development", "stream_3_governance", "task_stablesagent-brain-base");

function pickBrainDir() {
    if (process.env.STABLES_BRAIN_DIR && fs.existsSync(process.env.STABLES_BRAIN_DIR)) {
        return path.resolve(process.env.STABLES_BRAIN_DIR);
    }
    if (fs.existsSync(BRAIN_PROD_IN_REPO)) {
        return BRAIN_PROD_IN_REPO;
    }
    if (fs.existsSync(BRAIN_SIBLING)) {
        return BRAIN_SIBLING;
    }
    return BRAIN_IN_REPO;
}

const DOC_DIR = pickBrainDir();
const DB_FILE = path.join(__dirname, "vector_db.json");

function findMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findMarkdownFiles(filePath, fileList);
        } else if (file.endsWith(".md")) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

async function runIngest() {

    console.log(`🔍 Scanning for official Stables Markdown files in: ${DOC_DIR}`);
    const mdFiles = findMarkdownFiles(DOC_DIR);

    if (mdFiles.length === 0) {
        console.log("⚠️ No Markdown files found. Exiting.");
        return;
    }

    const docs = [];
    for (const filePath of mdFiles) {
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            docs.push(new Document({
                pageContent: content,
                metadata: { source: filePath }
            }));
        } catch (error) {
            console.error(`Error reading ${filePath}: ${error.message}`);
        }
    }
    console.log(`📄 Found ${docs.length} Stables documents.`);

    console.log("✂️ Cracking documents into smaller semantic chunks...");
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log(`🧩 Created ${splitDocs.length} chunks.`);

    console.log("🧠 Initializing Xenova local model (100% Free & Open Source)...");
    const embeddings = await initXenova();

    console.log("🚀 Generating embeddings locally... (This may take a minute based on your CPU)");
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

    console.log("💾 Saving Memory Store to JSON disk...");
    const rawData = {
        memoryVectors: vectorStore.memoryVectors
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(rawData));

    console.log(`✅ Success! Stables Knowledge Base built and saved to JSON at: ${DB_FILE}`);

    // Auto-generate the llms.txt file when build script is present (promoted brain folder)
    try {
        const buildScript = path.join(DOC_DIR, "build_llms_txt.js");
        if (fs.existsSync(buildScript)) {
            const { execSync } = require("child_process");
            console.log("\n🔄 Automatically building llms.txt for external AIs...");
            execSync(`node "${buildScript}"`, { stdio: "inherit" });
        } else {
            console.log("\n⚠️ No build_llms_txt.js next to brain docs; skip llms.txt auto-build.");
        }
    } catch (err) {
        console.error("❌ Failed to auto-generate llms.txt:", err.message);
    }
}

runIngest().catch(console.error);
