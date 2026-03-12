/**
 * StablesAgent Moltbook Heartbeat
 * Checks Moltbook every run: status, home, notifications, replies to comments.
 * Run via cron every 30 min: (e.g. 0,30 * * * * ... node moltbook_agent.js)
 *
 * Requires: MOLTBOOK_API_KEY, GROQ_API_KEY in .env
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const OpenAI = require("openai");

const API_BASE = "https://www.moltbook.com/api/v1";
const DB_FILE = path.join(__dirname, "vector_db.json");

function checkEnv() {
    if (!process.env.MOLTBOOK_API_KEY) {
        console.error("MOLTBOOK_API_KEY not set in .env");
        process.exit(1);
    }
    if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY not set in .env");
        process.exit(1);
    }
}

async function moltbookFetch(endpoint, options = {}) {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    return res.json();
}

async function moltbookGet(path) {
    return moltbookFetch(path, { method: "GET" });
}

async function moltbookPost(path, body) {
    return moltbookFetch(path, { method: "POST", body: JSON.stringify(body) });
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
    if (!fs.existsSync(DB_FILE)) return null;
    const rawData = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const vs = new MemoryVectorStore(embeddings);
    vs.memoryVectors = rawData.memoryVectors;
    return vs;
}

async function generateReply(query, vectorStore, groq) {
    const results = await vectorStore.similaritySearch(query, 3);
    const context = results.map((r, i) => `[${i + 1}] ${r.pageContent}`).join("\n\n");
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 200,
        messages: [
            {
                role: "system",
                content: `You are StablesAgent on Moltbook. Reply helpfully using the context. Keep it short (1-3 sentences). No emojis. No em-dashes. Same language as the question.`,
            },
            { role: "user", content: `Question: "${query}"\n\nContext:\n${context}` },
        ],
    });
    return completion.choices[0].message.content.trim().replace(/^["']|["']$/g, "");
}

function parseMathChallenge(challengeText) {
    const cleaned = challengeText
        .replace(/[^a-zA-Z0-9\s.\-+*/]/g, " ")
        .replace(/\s+/g, " ")
        .toLowerCase();
    const numWords = {
        one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
        eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
        thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
        hundred: 100, thousand: 1000,
    };
    let a, b, op;
    const parts = cleaned.split(/\s+/);
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "at" || parts[i] === "of") {
            const n = numWords[parts[i + 1]] || parseInt(parts[i + 1], 10);
            if (!isNaN(n)) a = a ?? n;
        }
        if (parts[i] === "by" || parts[i] === "and") {
            const n = numWords[parts[i + 1]] || parseInt(parts[i + 1], 10);
            if (!isNaN(n)) b = b ?? n;
        }
        if (parts[i] === "plus" || parts[i] === "and" && !op) op = "+";
        if (parts[i] === "minus" || parts[i] === "subtract") op = "-";
        if (parts[i] === "times" || parts[i] === "multiplied") op = "*";
        if (parts[i] === "divided" || parts[i] === "over") op = "/";
    }
    if (a != null && b != null && op) {
        const result = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
        return result.toFixed(2);
    }
    return null;
}

async function solveVerification(groq, challengeText) {
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        max_tokens: 20,
        messages: [
            {
                role: "system",
                content: "You are a math solver. Extract the math problem from this obfuscated text (lobster-themed, scattered symbols). Return ONLY the numeric answer with 2 decimal places, e.g. 15.00. No explanation.",
            },
            { role: "user", content: challengeText },
        ],
    });
    const ans = completion.choices[0].message.content.trim().replace(/[^0-9.\-]/g, "");
    const num = parseFloat(ans);
    return isNaN(num) ? null : num.toFixed(2);
}

async function main() {
    checkEnv();

    const status = await moltbookGet("/agents/status");
    if (status.status !== "claimed") {
        console.log("Not claimed yet. Skipping.");
        return;
    }

    const home = await moltbookGet("/home");
    if (!home.your_account) {
        console.log("No home data.");
        return;
    }

    const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);
    if (!vectorStore) {
        console.log("No vector DB. Run ingest_knowledge.js first.");
        return;
    }

    const activity = home.activity_on_your_posts || [];
    for (const item of activity) {
        if ((item.new_notification_count || 0) === 0) continue;

        const commentsRes = await moltbookGet(`/posts/${item.post_id}/comments?sort=new&limit=20`);
        const comments = commentsRes.comments || commentsRes.data || [];
        const latest = Array.isArray(comments) ? comments[0] : null;
        const authorName = (latest?.author?.name || latest?.author_name || "").toLowerCase();
        if (!latest || authorName === "stablesagent") continue;

        const query = (latest.content || latest.text || latest.body || "").slice(0, 500);
        if (!query.trim()) continue;

        console.log(`Replying to ${latest.author_name} on post ${item.post_id}: "${query.slice(0, 60)}..."`);
        let reply = await generateReply(query, vectorStore, groq);
        if (reply.length > 2000) reply = reply.slice(0, 1997) + "...";

        const commentRes = await moltbookPost(`/posts/${item.post_id}/comments`, { content: reply });
        const v = commentRes?.verification || commentRes?.comment?.verification;
        if (v?.verification_code && v?.challenge_text) {
            const answer = await solveVerification(groq, v.challenge_text);
            if (answer) {
                await moltbookPost("/verify", { verification_code: v.verification_code, answer });
                console.log("Verified comment.");
            }
        }

        await moltbookPost(`/notifications/read-by-post/${item.post_id}`);
    }

    console.log("Moltbook heartbeat done.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
