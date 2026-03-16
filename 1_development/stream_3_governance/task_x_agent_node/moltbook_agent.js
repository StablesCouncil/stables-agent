/**
 * StablesAgent Moltbook Heartbeat
 * 1. Replies to comments on our posts
 * 2. Creates new posts from knowledge base (1 per 30 min max)
 * 3. Browses feed, comments on relevant posts from other agents
 * Run via cron every 30 min: (e.g. 0,30 * * * * ... node moltbook_agent.js)
 *
 * Requires: MOLTBOOK_API_KEY, OPENROUTER_API_KEY in .env
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const OpenAI = require("openai");

const API_BASE = "https://www.moltbook.com/api/v1";
const DB_FILE = path.join(__dirname, "vector_db.json");
const STATE_FILE = path.join(__dirname, "moltbook_state.json");

function loadState() {
    if (!fs.existsSync(STATE_FILE)) return { lastPostAt: null, commentedPostIds: [] };
    try {
        return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    } catch { return { lastPostAt: null, commentedPostIds: [] }; }
}

function saveState(state) {
    const kept = (state.commentedPostIds || []).slice(-100);
    fs.writeFileSync(STATE_FILE, JSON.stringify({ ...state, commentedPostIds: kept }), "utf-8");
}

function checkEnv() {
    if (!process.env.MOLTBOOK_API_KEY) {
        console.error("MOLTBOOK_API_KEY not set in .env");
        process.exit(1);
    }
    if (!process.env.OPENROUTER_API_KEY) {
        console.error("OPENROUTER_API_KEY not set in .env");
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

async function generateReply(query, vectorStore, llm) {
    const results = await vectorStore.similaritySearch(query, 3);
    const context = results.map((r, i) => `[${i + 1}] ${r.pageContent}`).join("\n\n");
    const completion = await llm.chat.completions.create({
        model: "openrouter/free",
        temperature: 0.3,
        max_tokens: 200,
        messages: [
            {
                role: "system",
                content: `You are StablesAgent on Moltbook. Reply helpfully using ONLY the context. Keep it short (1-3 sentences). No emojis. No em-dashes. Same language as the question. Avoid crypto or DeFi jargon like "decentralized" or "DeFi" — use simple, plain language instead.`,
            },
            { role: "user", content: `Question: "${query}"\n\nContext:\n${context}` },
        ],
    });
    return completion.choices[0].message.content.trim().replace(/^["']|["']$/g, "");
}

async function generatePost(vectorStore, llm) {
    const seed = [
        "how Stables works structurally",
        "Coverage Ratio what it means",
        "merchant network why it matters",
        "transition doctrine stages",
        "why Minima was chosen",
    ][Math.floor(Math.random() * 5)];
    const results = await vectorStore.similaritySearch(seed, 4);
    const context = results.map((r, i) => `[${i + 1}] ${r.pageContent}`).join("\n\n");
    const completion = await llm.chat.completions.create({
        model: "openrouter/free",
        temperature: 0.6,
        max_tokens: 150,
        messages: [
            {
                role: "system",
                content: `You are StablesAgent. Write one short Moltbook post (title + 1-2 sentence body) about Stables, using ONLY the context.

CRITICAL: Write like a brief factual reflection, neutral observation, or a simple question. NOT like an ad or promo.
FORBIDDEN words and phrases: zero, instant, guarantee, rewards, yield-bearing, strengthens, backbone, 100% control, simple and powerful, secure transactions, superlatives, benefit-pitch. Never use markdown (#) in the title.
OK: What Stables is, how it works, why Minima, structural concepts. Prefer plain descriptive sentences. A short question (e.g. "What happens to fees in Stables?") is fine and often better than a declarative pitch.
No emojis. No em-dashes. No "decentralized" or "DeFi". Title max 80 chars (no #), body max 200 chars.`,
            },
            { role: "user", content: `Context:\n${context}\n\nWrite one post.` },
        ],
    });
    let text = completion.choices[0].message.content.trim();
    text = text.replace(/^#+\s*/, "");
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const title = (lines[0] || text).replace(/^#+\s*/, "").slice(0, 80);
    const content = (lines.slice(1).join(" ") || lines[0] || "").replace(/^#+\s*/, "").slice(0, 400);
    return { title, content };
}

async function shouldCommentAndGenerate(post, vectorStore, llm) {
    const text = `${post.title || ""} ${post.content || ""}`.slice(0, 800);
    const completion = await llm.chat.completions.create({
        model: "openrouter/free",
        temperature: 0.2,
        max_tokens: 120,
        messages: [
            {
                role: "system",
                content: `Stables is a banking system built on Minima (stablecoins, self-custody).

Your job is to decide whether to comment on another agent's post.

Very strict rules:
- COMMENT RARELY. Most of the time you should reply exactly "NO".
- Only comment when the post is clearly about money, banking, stablecoins, Minima, protocol design, or something Stables can add real value to.
- When you do comment, talk about THEIR idea, not about Stables. One short, concrete observation is enough.
- Do NOT describe Stables' community energy, tools, outreach, or "what Stables is" unless the post directly asks.
- FORBIDDEN words: innovative, empowering, strong community energy, amplify, aggressive outreach, frustrated with traditional banking, vibrant community, marketing-style phrases.
- Reply with ONLY the final comment text (1-2 sentences, helpful, neutral, no promo) or exactly "NO" if we should skip.
- No emojis. No em-dashes. Avoid crypto/DeFi jargon like "decentralized" or "DeFi".`,
            },
            { role: "user", content: `Post: "${text}"\n\nCan we add a useful comment? If yes, write it. If no, reply NO.` },
        ],
    });
    const out = completion.choices[0].message.content.trim();
    return out.toUpperCase() === "NO" ? null : out.slice(0, 2000);
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

async function solveVerification(llm, challengeText) {
    const completion = await llm.chat.completions.create({
        model: "openrouter/free",
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
        console.log("Status not claimed, raw status:", JSON.stringify(status));
        return;
    }
    console.log("Agent status OK:", JSON.stringify(status));

    const home = await moltbookGet("/home");
    if (!home.your_account) {
        console.log("No home data from /home, raw response:", JSON.stringify(home));
        return;
    }
    console.log("Home data OK, your_account:", JSON.stringify(home.your_account));

    const llm = new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1" });
    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);
    if (!vectorStore) {
        console.log("No vector DB. Run ingest_knowledge.js first.");
        return;
    }

    const state = loadState();
    console.log("Loaded state:", JSON.stringify(state));

    // 1. Create new post (rate-limited)
    const now = Date.now();
    const lastPost = state.lastPostAt ? new Date(state.lastPostAt).getTime() : 0;
    if (now - lastPost >= 180 * 60 * 1000) {
        console.log("Post window open. lastPostAt=", state.lastPostAt, "now=", new Date().toISOString());
        try {
            const { title, content } = await generatePost(vectorStore, llm);
            const postRes = await moltbookPost("/posts", { submolt_name: "general", title, content });
            const createdPost = postRes.post || postRes.data?.post || postRes;
            if (createdPost?.id) {
                state.lastPostAt = new Date().toISOString();
                const v = postRes?.verification || postRes?.post?.verification;
                if (v?.verification_code && v?.challenge_text) {
                    const answer = await solveVerification(llm, v.challenge_text);
                    if (answer) await moltbookPost("/verify", { verification_code: v.verification_code, answer });
                }
                console.log("Posted:", title);
            } else {
                console.log("Post response without id:", JSON.stringify(postRes));
            }
        } catch (e) {
            console.log("Post failed:", e.message);
        } finally {
            saveState(state);
        }
    } else {
        console.log(
            "Skipping post due to rate limit. lastPostAt=",
            state.lastPostAt,
            "now=",
            new Date().toISOString()
        );
    }

    // 2. Reply to comments on our posts
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
        let reply = await generateReply(query, vectorStore, llm);
        if (reply.length > 2000) reply = reply.slice(0, 1997) + "...";

        const commentRes = await moltbookPost(`/posts/${item.post_id}/comments`, { content: reply });
        const v = commentRes?.verification || commentRes?.comment?.verification;
        if (v?.verification_code && v?.challenge_text) {
            const answer = await solveVerification(llm, v.challenge_text);
            if (answer) {
                await moltbookPost("/verify", { verification_code: v.verification_code, answer });
                console.log("Verified comment.");
            }
        }

        await moltbookPost(`/notifications/read-by-post/${item.post_id}`);
    }

    // 3. Browse feed and comment on relevant posts from others
    const commented = new Set(state.commentedPostIds || []);
    try {
        const feedRes = await moltbookGet("/feed?sort=new&limit=15");
        const posts = feedRes.posts || feedRes.data || [];
        let commentsAdded = 0;
        for (const post of posts) {
            if (commentsAdded >= 1) break;
            const postId = post.id || post.post_id;
            const authorName = (post.author?.name || post.author_name || "").toLowerCase();
            if (!postId || authorName === "stablesagent" || commented.has(postId)) continue;

            const comment = await shouldCommentAndGenerate(post, vectorStore, llm);
            if (!comment) continue;

            const commentRes = await moltbookPost(`/posts/${postId}/comments`, { content: comment });
            const v = commentRes?.verification || commentRes?.comment?.verification;
            if (v?.verification_code && v?.challenge_text) {
                const answer = await solveVerification(llm, v.challenge_text);
                if (answer) await moltbookPost("/verify", { verification_code: v.verification_code, answer });
            }
            commented.add(postId);
            state.commentedPostIds = [...commented];
            commentsAdded++;
            console.log("Commented on", authorName, ":", comment.slice(0, 50) + "...");
            await new Promise((r) => setTimeout(r, 25000));
        }
        saveState(state);
    } catch (e) {
        console.log("Feed/comment error:", e.message);
    }

    console.log("Moltbook heartbeat done.");
}

main().catch((err) => {
    const isRateLimit =
        err?.code === "rate_limit_exceeded" ||
        err?.code === "insufficient_quota" ||
        err?.error?.code === "rate_limit_exceeded" ||
        (err?.message && (String(err.message).includes("rate_limit") || String(err.message).includes("quota")));
    if (isRateLimit) {
        console.log("LLM rate limit or quota reached. Exiting gracefully.");
        process.exit(0);
    }
    console.error(err);
    process.exit(1);
});
