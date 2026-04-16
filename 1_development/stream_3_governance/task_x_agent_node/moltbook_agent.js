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
const fs = require("fs");
const dotenv = require("dotenv");
const ENV_CANDIDATES = [
    path.join(__dirname, "..", "task_stablesagent-brain-base", ".env"),
    path.join(__dirname, ".env"),
    path.join(process.cwd(), ".env"),
];
for (const envPath of ENV_CANDIDATES) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        break;
    }
}
const crypto = require("crypto");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const OpenAI = require("openai");

const API_BASE = "https://www.moltbook.com/api/v1";
const DB_FILE = path.join(__dirname, "vector_db.json");
const STATE_FILE = path.join(__dirname, "moltbook_state.json");
const LLM_MODEL = process.env.OPENROUTER_API_KEY ? "openrouter/free" : "llama-3.3-70b-versatile";
/** Daily cap for post upvotes (Moltbook has no separate "like" endpoint). */
const MAX_DAILY_UPVOTES = 4;
const MAX_DAILY_FOLLOWS = 1;

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function extractReplyText(completion) {
    const txt = completion?.choices?.[0]?.message?.content;
    return typeof txt === "string" ? txt.trim() : null;
}

function parseSuspendedUntil(message) {
    if (!message || typeof message !== "string") return null;
    const m = message.match(/suspended until\s+(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/i);
    return m ? m[1] : null;
}

function normalizeForFingerprint(text) {
    return String(text || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .trim();
}

function commentFingerprint(text) {
    const normalized = normalizeForFingerprint(text);
    return crypto.createHash("sha256").update(normalized).digest("hex");
}

/** Diverse posting angles (id used for rotation / cooldown). */
const POST_ANGLE_SEEDS = [
    { id: "structure", prompt: "How Stables fits together structurally: stablecoins, validation, and banking mechanics in plain terms." },
    { id: "cr", prompt: "Coverage Ratio: what it measures and why it matters for solvency." },
    { id: "merchants", prompt: "Merchant network and the everyday price peg — how real commerce relates to the design." },
    { id: "transition", prompt: "Transition doctrine and stages: how the system is meant to evolve over time." },
    { id: "minima", prompt: "Why Minima and many validating nodes matter for this banking model." },
    { id: "mint_burn", prompt: "Minting and burning USDs: when it happens and what backs it." },
    { id: "oracle", prompt: "Oracle or price signals: how external prices feed into the protocol." },
    { id: "self_custody", prompt: "Self-custody and keys: who controls funds in this setup." },
    { id: "governance", prompt: "Governance or council: factual role, not a sales pitch." },
    { id: "xminima", prompt: "xMinima and liquidity: factual bridge role, no jargon dump." },
    { id: "balance_sheet", prompt: "Balance sheet or reserve picture in simple language." },
    { id: "peg", prompt: "What keeps the peg credible in practice (mechanics, not hype)." },
    { id: "minidapp", prompt: "MiniDapps or on-chain apps users might touch." },
    { id: "pseudonymous", prompt: "Pseudonymous or privacy-oriented participation where the docs support it." },
    { id: "stages_ops", prompt: "Operational stages: what is live vs planned, without promising dates." },
    { id: "usd_vs_collateral", prompt: "How USDs relate to collateral or backing concepts in the docs." },
    { id: "risk_limits", prompt: "Risk limits, thresholds, or guardrails described in the knowledge base." },
];

function pickPostAngle(state) {
    const recent = state.recentPostAngleIds || [];
    const lastN = recent.slice(-8);
    let pool = POST_ANGLE_SEEDS.filter((s) => !lastN.includes(s.id));
    if (!pool.length) pool = [...POST_ANGLE_SEEDS];
    return pool[Math.floor(Math.random() * pool.length)];
}

/** Strip model junk like "Title: ..." from the first line. */
function sanitizeMoltbookTitle(raw) {
    let t = String(raw || "").trim();
    t = t.replace(/^#+\s*/, "");
    t = t.replace(/^title\s*:\s*/i, "").trim();
    return t.slice(0, 80);
}

function textMentionsFees(s) {
    const x = String(s || "").toLowerCase();
    if (/\bfees?\b/.test(x)) return true;
    if (/transaction\s+fees?/.test(x)) return true;
    if (/what\s+happens\s+to\s+fees/.test(x)) return true;
    if (/\bfee\s+manag/.test(x)) return true;
    if (/miner\s+fees?/.test(x)) return true;
    return false;
}

/** Block fee-themed posts unless we explicitly allow (we no longer use a fee angle). */
function postViolatesFeeGuard(title, content) {
    return textMentionsFees(title) || textMentionsFees(content);
}

function normalizeTitleKey(title) {
    return normalizeForFingerprint(title).replace(/\s+/g, " ").slice(0, 120);
}

function utcDayKey(d = new Date()) {
    return d.toISOString().slice(0, 10);
}

function postTopicSignal(post) {
    const text = `${post?.title || ""} ${post?.content || ""}`.toLowerCase();
    if (!text.trim()) return false;
    return /\b(minima|stables|stablecoin|bank|banking|merchant|payment|liquidity|coverage|ratio|peg|mint|burn|custody|wallet)\b/.test(text);
}

function shouldLikePost(post) {
    if (!postTopicSignal(post)) return false;
    return Math.random() < 0.4;
}

function shouldFollowAuthor(post) {
    if (!postTopicSignal(post)) return false;
    return Math.random() < 0.25;
}

function isLikelyApiSuccess(res) {
    if (!res || typeof res !== "object") return false;
    const code = typeof res.statusCode === "number" ? res.statusCode : null;
    if (code != null && code >= 400) return false;
    if (res.success === false) return false;
    if (res.success === true) return true;
    const msg = String(res.message || res.error || "");
    if (/(not found|invalid|error|failed|suspended|unauthorized|forbidden|duplicate)/i.test(msg)) return false;
    if (res.post || res.comment || res.agent) return true;
    if (code != null && code >= 200 && code < 300) return true;
    return false;
}

/** Moltbook follow uses agent login name, e.g. "someagent" (not numeric id). */
function normalizeAgentNameForFollow(raw) {
    let s = String(raw || "").trim();
    if (!s) return "";
    s = s.replace(/^u\//i, "").trim();
    return s;
}

async function tryPostAction(endpointCandidates, body = null) {
    for (const ep of endpointCandidates) {
        try {
            const res = body ? await moltbookPost(ep, body) : await moltbookPost(ep, {});
            if (isLikelyApiSuccess(res)) return { ok: true, endpoint: ep, res };
        } catch {
            // Try next endpoint variant.
        }
    }
    return { ok: false };
}

async function tryUpvotePost(postId) {
    return tryPostAction([`/posts/${postId}/upvote`, `/posts/${postId}/upvotes`]);
}

async function tryFollowAgent(agentName) {
    const name = normalizeAgentNameForFollow(agentName);
    if (!name) return { ok: false };
    const enc = encodeURIComponent(name);
    return tryPostAction([`/agents/${enc}/follow`]);
}

function loadState() {
    if (!fs.existsSync(STATE_FILE)) return { lastPostAt: null, commentedPostIds: [], suspendedUntil: null };
    try {
        const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
        return {
            lastPostAt: null,
            commentedPostIds: [],
            suspendedUntil: null,
            commentFingerprints: [],
            recentPostAngleIds: [],
            recentPostTitles: [],
            likedPostIds: [],
            followedAuthorIds: [],
            likesToday: 0,
            followsToday: 0,
            lastEngagementDay: utcDayKey(),
            ...raw,
        };
    } catch {
        return { lastPostAt: null, commentedPostIds: [], suspendedUntil: null };
    }
}

function saveState(state) {
    const kept = (state.commentedPostIds || []).slice(-100);
    const keptFps = (state.commentFingerprints || []).slice(-200);
    const keptAngles = (state.recentPostAngleIds || []).slice(-24);
    const keptTitles = (state.recentPostTitles || []).slice(-20);
    const keptLiked = (state.likedPostIds || []).slice(-300);
    const keptFollowed = (state.followedAuthorIds || []).slice(-300);
    fs.writeFileSync(
        STATE_FILE,
        JSON.stringify({
            ...state,
            commentedPostIds: kept,
            commentFingerprints: keptFps,
            recentPostAngleIds: keptAngles,
            recentPostTitles: keptTitles,
            likedPostIds: keptLiked,
            followedAuthorIds: keptFollowed,
        }),
        "utf-8"
    );
}

function checkEnv() {
    if (!process.env.MOLTBOOK_API_KEY) {
        console.error("MOLTBOOK_API_KEY not set in .env");
        process.exit(1);
    }
    if (!process.env.OPENROUTER_API_KEY && !process.env.GROQ_API_KEY) {
        console.error("Set OPENROUTER_API_KEY or GROQ_API_KEY in .env");
        process.exit(1);
    }
}

async function moltbookFetch(endpoint, options = {}) {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
    // Basic timeout + retry to reduce transient ETIMEDOUT failures.
    for (let attempt = 1; attempt <= 2; attempt++) {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 15000);
        try {
            const res = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}`,
                    "Content-Type": "application/json",
                    ...options.headers,
                },
            });
            let data = {};
            try {
                const text = await res.text();
                if (text) data = JSON.parse(text);
            } catch {
                data = {};
            }
            if (data && typeof data === "object" && !Array.isArray(data)) {
                data.statusCode = res.status;
            }
            return data;
        } catch (e) {
            if (attempt === 2) throw e;
            await sleep(1500);
        } finally {
            clearTimeout(t);
        }
    }
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
        model: LLM_MODEL,
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
    const txt = extractReplyText(completion);
    if (!txt) throw new Error("Empty completion content");
    return txt.replace(/^["']|["']$/g, "");
}

async function generatePost(vectorStore, llm, angleEntry) {
    const seed = angleEntry.prompt;
    // Bias retrieval toward structural topics so chunks are less often fee-centric.
    const query = `${seed} solvency reserves merchants mint burn custody validation peg Coverage Ratio`;
    const results = await vectorStore.similaritySearch(query, 4);
    const context = results.map((r, i) => `[${i + 1}] ${r.pageContent}`).join("\n\n");
    const completion = await llm.chat.completions.create({
        model: LLM_MODEL,
        temperature: 0.55,
        max_tokens: 150,
        messages: [
            {
                role: "system",
                content: `You are StablesAgent. Write one short Moltbook post (title + 1-2 sentence body), using ONLY the context.

You will be given an ASSIGNED ANGLE. The title and body MUST stay on that angle.

HARD RULE: Do not use the words "fee", "fees", "transaction fee", or "miner fee" in the title or body. Do not ask "what happens to fees" or any fee question. If the context only talks about fees, pick the nearest non-fee detail (nodes, peg, minting, Coverage Ratio, merchants).

CRITICAL: Brief factual reflection, neutral observation, or a simple question. NOT an ad or promo.
FORBIDDEN words and phrases: zero, instant, guarantee, rewards, yield-bearing, strengthens, backbone, 100% control, simple and powerful, secure transactions, superlatives, benefit-pitch. Never use markdown (#) in the title.
Good title examples: "How does minting show up on the balance sheet?" / "Why does Coverage Ratio matter for solvency?"
No emojis. No em-dashes. No "decentralized" or "DeFi". Title max 80 chars (no #), body max 200 chars.

Output format: Line 1 is ONLY the title text — no "Title:" prefix, no quotes around the title.`,
            },
            {
                role: "user",
                content: `ASSIGNED ANGLE: ${angleEntry.prompt}

Context:
${context}

Write one post: line 1 = title only (no prefix), following lines = body.`,
            },
        ],
    });
    let text = extractReplyText(completion);
    if (!text) throw new Error("Empty completion content");
    text = text.replace(/^#+\s*/, "");
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const rawTitle = lines[0] || text;
    const title = sanitizeMoltbookTitle(rawTitle);
    let content = (lines.slice(1).join(" ") || title).replace(/^#+\s*/, "").trim().slice(0, 400);
    return { title, content };
}

async function shouldCommentAndGenerate(post, vectorStore, llm) {
    const text = `${post.title || ""} ${post.content || ""}`.slice(0, 800);
    const completion = await llm.chat.completions.create({
        model: LLM_MODEL,
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
    const out = extractReplyText(completion);
    if (!out) return null;
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
        model: LLM_MODEL,
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
    const txt = extractReplyText(completion);
    if (!txt) return null;
    const ans = txt.replace(/[^0-9.\-]/g, "");
    const num = parseFloat(ans);
    return isNaN(num) ? null : num.toFixed(2);
}

async function main() {
    checkEnv();
    const runStats = {
        posts: 0,
        replyComments: 0,
        feedComments: 0,
        upvotes: 0,
        follows: 0,
    };

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

    const llm = process.env.OPENROUTER_API_KEY
        ? new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1" })
        : new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);
    if (!vectorStore) {
        console.log("No vector DB. Run ingest_knowledge.js first.");
        return;
    }

    const state = loadState();
    console.log("Loaded state:", JSON.stringify(state));
    const day = utcDayKey();
    if (state.lastEngagementDay !== day) {
        state.lastEngagementDay = day;
        state.likesToday = 0;
        state.followsToday = 0;
        saveState(state);
    }

    const suspendedUntilMs = state.suspendedUntil ? new Date(state.suspendedUntil).getTime() : 0;
    if (suspendedUntilMs && Date.now() < suspendedUntilMs) {
        console.log("Agent is suspended until", state.suspendedUntil, "Skipping all Moltbook actions.");
        return;
    }

    // 1. Create new post (rate-limited)
    const now = Date.now();
    const lastPost = state.lastPostAt ? new Date(state.lastPostAt).getTime() : 0;
    if (now - lastPost >= 180 * 60 * 1000) {
        console.log("Post window open. lastPostAt=", state.lastPostAt, "now=", new Date().toISOString());
        try {
            const MAX_POST_ATTEMPTS = 5;
            let title;
            let content;
            let angleEntry;
            let posted = false;
            for (let attempt = 0; attempt < MAX_POST_ATTEMPTS; attempt++) {
                angleEntry = pickPostAngle(state);
                console.log("Post angle:", angleEntry.id, attempt > 0 ? `(retry ${attempt})` : "");
                ({ title, content } = await generatePost(vectorStore, llm, angleEntry));
                if (title.length < 6) {
                    console.log("Rejected post: title too short");
                    continue;
                }
                if (postViolatesFeeGuard(title, content)) {
                    console.log("Rejected post (fee theme):", title.slice(0, 60));
                    continue;
                }
                const tKey = normalizeTitleKey(title);
                const prevTitles = state.recentPostTitles || [];
                if (prevTitles.includes(tKey)) {
                    console.log("Rejected post: duplicate title fingerprint");
                    continue;
                }
                const postRes = await moltbookPost("/posts", { submolt_name: "general", title, content });
                const createdPost = postRes.post || postRes.data?.post || postRes;
                if (createdPost?.id) {
                    state.lastPostAt = new Date().toISOString();
                    state.recentPostAngleIds = [...(state.recentPostAngleIds || []), angleEntry.id].slice(-24);
                    state.recentPostTitles = [...prevTitles, tKey].slice(-20);
                    posted = true;
                    runStats.posts++;
                    const v = postRes?.verification || postRes?.post?.verification;
                    if (v?.verification_code && v?.challenge_text) {
                        const answer = await solveVerification(llm, v.challenge_text);
                        if (answer) await moltbookPost("/verify", { verification_code: v.verification_code, answer });
                    }
                    console.log("Posted:", title);
                    break;
                }
                console.log("Post response without id:", JSON.stringify(postRes));
                if (postRes?.statusCode === 403) {
                    const until = parseSuspendedUntil(postRes?.message);
                    if (until) {
                        state.suspendedUntil = until;
                        saveState(state);
                        console.log("Recorded suspension until", until);
                        return;
                    }
                }
            }
            if (!posted) {
                state.lastPostAt = new Date().toISOString();
                console.warn("No acceptable post after retries (or API errors); deferring next window.");
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

        const fp = commentFingerprint(reply);
        if ((state.commentFingerprints || []).includes(fp)) {
            console.log("Skipping duplicate reply fingerprint.");
            await moltbookPost(`/notifications/read-by-post/${item.post_id}`);
            continue;
        }

        // Small jitter to avoid bot-like rhythm and reduce duplicate detection.
        await sleep(10_000 + Math.floor(Math.random() * 25_000));

        const commentRes = await moltbookPost(`/posts/${item.post_id}/comments`, { content: reply });
        const v = commentRes?.verification || commentRes?.comment?.verification;
        if (v?.verification_code && v?.challenge_text) {
            const answer = await solveVerification(llm, v.challenge_text);
            if (answer) {
                await moltbookPost("/verify", { verification_code: v.verification_code, answer });
                console.log("Verified comment.");
            }
        }

        state.commentFingerprints = [...(state.commentFingerprints || []), fp];
        runStats.replyComments++;
        saveState(state);

        await moltbookPost(`/notifications/read-by-post/${item.post_id}`);
    }

    // 3. Browse feed and comment on relevant posts from others
    const commented = new Set(state.commentedPostIds || []);
    const liked = new Set(state.likedPostIds || []);
    const followed = new Set(state.followedAuthorIds || []);
    try {
        const feedRes = await moltbookGet("/feed?sort=new&limit=15");
        const posts = feedRes.posts || feedRes.data || [];
        let commentsAdded = 0;
        for (const post of posts) {
            if (commentsAdded >= 1) break;
            const postId = post.id || post.post_id;
            const authorAgentName = normalizeAgentNameForFollow(
                post.author?.name || post.author_name || post.author?.username || post.username
            );
            const authorName = authorAgentName.toLowerCase();
            if (!postId || authorName === "stablesagent" || commented.has(postId)) continue;

            if (state.likesToday < MAX_DAILY_UPVOTES && !liked.has(postId) && shouldLikePost(post)) {
                await sleep(7_000 + Math.floor(Math.random() * 12_000));
                const voteRes = await tryUpvotePost(postId);
                if (voteRes.ok) {
                    liked.add(postId);
                    state.likedPostIds = [...liked];
                    state.likesToday = (state.likesToday || 0) + 1;
                    runStats.upvotes++;
                    console.log("Upvoted post", postId, "via", voteRes.endpoint);
                    saveState(state);
                }
            }

            if (
                state.followsToday < MAX_DAILY_FOLLOWS &&
                authorAgentName &&
                !followed.has(authorAgentName) &&
                shouldFollowAuthor(post)
            ) {
                await sleep(9_000 + Math.floor(Math.random() * 12_000));
                const followRes = await tryFollowAgent(authorAgentName);
                if (followRes.ok) {
                    followed.add(authorAgentName);
                    state.followedAuthorIds = [...followed];
                    state.followsToday = (state.followsToday || 0) + 1;
                    runStats.follows++;
                    console.log("Followed agent", authorAgentName, "via", followRes.endpoint);
                    saveState(state);
                }
            }

            const comment = await shouldCommentAndGenerate(post, vectorStore, llm);
            if (!comment) continue;

            const fp = commentFingerprint(comment);
            if ((state.commentFingerprints || []).includes(fp)) {
                console.log("Skipping duplicate feed comment fingerprint.");
                commented.add(postId);
                state.commentedPostIds = [...commented];
                saveState(state);
                continue;
            }

            // Small jitter to avoid bot-like rhythm and reduce duplicate detection.
            await sleep(10_000 + Math.floor(Math.random() * 25_000));

            const commentRes = await moltbookPost(`/posts/${postId}/comments`, { content: comment });
            const v = commentRes?.verification || commentRes?.comment?.verification;
            if (v?.verification_code && v?.challenge_text) {
                const answer = await solveVerification(llm, v.challenge_text);
                if (answer) await moltbookPost("/verify", { verification_code: v.verification_code, answer });
            }
            commented.add(postId);
            state.commentedPostIds = [...commented];
            state.commentFingerprints = [...(state.commentFingerprints || []), fp];
            commentsAdded++;
            runStats.feedComments++;
            console.log("Commented on", authorName, ":", comment.slice(0, 50) + "...");
            saveState(state);
            await new Promise((r) => setTimeout(r, 25000));
        }
        saveState(state);
    } catch (e) {
        console.log("Feed/comment error:", e.message);
    }

    console.log(
        `engagement: posts=${runStats.posts} upvotes=${runStats.upvotes}/${MAX_DAILY_UPVOTES} follows=${runStats.follows}/${MAX_DAILY_FOLLOWS} feed_comments=${runStats.feedComments} replies=${runStats.replyComments}`
    );
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
