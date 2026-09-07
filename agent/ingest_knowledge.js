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

// ONE brain, chosen out loud (2026-08-01).
//
// This used to prefer a promoted copy in `2_current/` over the development brain, silently. Three
// copies had drifted apart, the promoted one was six weeks stale and described the frozen demo as
// the current build, and an ingest run on a full repo indexed it without saying so. The resolver now
// has one order, never uses the retired promoted copy, and always prints the directory it chose.
//
// Layouts, in order:
// - explicit override: STABLES_BRAIN_DIR
// - beside this script: the deployed server layout, and the same directory in the repo
// - full repo path, for a caller running from somewhere else
const BRAIN_SIBLING = path.resolve(__dirname, "..", "task_stablesagent-brain-base");
const BRAIN_IN_REPO = path.resolve(__dirname, "..", "..", "..", "1_development", "stream_3_governance", "task_stablesagent-brain-base");
/** Retired 2026-08-01. Never a source. Only detected so the operator is told it is being ignored. */
const BRAIN_RETIRED_PROMOTED = path.resolve(__dirname, "..", "..", "..", "2_current", "stream_3_governance", "prod_stablesagent-brain-base");

function pickBrainDir() {
    if (fs.existsSync(BRAIN_RETIRED_PROMOTED)) {
        console.warn("\n⚠️  Ignoring the retired promoted brain at:\n   " + BRAIN_RETIRED_PROMOTED
            + "\n   The single source is the development brain. That copy is no longer read by this script.\n");
    }
    if (process.env.STABLES_BRAIN_DIR) {
        const override = path.resolve(process.env.STABLES_BRAIN_DIR);
        if (!fs.existsSync(override)) {
            throw new Error("STABLES_BRAIN_DIR is set but does not exist: " + override);
        }
        return override;
    }
    if (fs.existsSync(BRAIN_SIBLING)) return BRAIN_SIBLING;
    if (fs.existsSync(BRAIN_IN_REPO)) return BRAIN_IN_REPO;
    throw new Error("No brain directory found. Looked for:\n  " + BRAIN_SIBLING + "\n  " + BRAIN_IN_REPO
        + "\nSet STABLES_BRAIN_DIR to point at the knowledge base.");
}

const DOC_DIR = pickBrainDir();
console.log("🧭 Brain source: " + DOC_DIR);
const DB_FILE = path.join(__dirname, "vector_db.json");

/* The brain's README is how OPERATORS are told to deploy the brain: rsync the folder, run
 * ingest_knowledge.js, restart pm2. `build_llms_txt.js` has always excluded it from the public
 * rollup for that reason, but the ingest took every .md it could find, so those instructions sat in
 * the vector database the public agent answers from. Measured 2026-09-04: asked "How do I resync my
 * node if it is stuck on Updating?", the live agent replied "Run the rsync command from the Stables
 * agent brain base folder... then execute node ingest_knowledge.js and restart the telegram and web
 * agents with pm2". A person with a stale node was handed our deployment procedure.
 *
 * The two tools now agree on what is public. Anything operator-facing goes in README.md and stays
 * out of both. */
const INGEST_EXCLUDES = new Set(["readme.md"]);

function findMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findMarkdownFiles(filePath, fileList);
        } else if (file.endsWith(".md") && !INGEST_EXCLUDES.has(file.toLowerCase())) {
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
