/**
 * StablesAgent Moltbook Heartbeat
 * 1. Replies to comments on our posts
 * 2. Creates new posts from knowledge base (1 per 30 min max)
 * 3. Browses feed, comments on relevant posts from other agents
 * Run via cron every 30 min: (e.g. 0,30 * * * * ... node moltbook_agent.js)
 *
 * Requires: MOLTBOOK_API_KEY, and GROQ_API_KEY or OPENROUTER_API_KEY in .env
 * (Groq is the primary LLM provider, OpenRouter the fallback)
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
// Groq retired llama-3.3-70b-versatile for free/developer tiers on 2026-08-16.
// Official replacement: openai/gpt-oss-120b (or qwen/qwen3.6-27b). Override with GROQ_MODEL.
const GROQ_MODEL = String(process.env.GROQ_MODEL || "openai/gpt-oss-120b").trim();
const LLM_MODEL = process.env.OPENROUTER_API_KEY ? "openrouter/free" : GROQ_MODEL;
/** Daily cap for post upvotes (Moltbook has no separate "like" endpoint). */
const MAX_DAILY_UPVOTES = 4;
const MAX_DAILY_FOLLOWS = 1;
/** At most one reply to "activity on your posts" per run (reduces duplicate_comment risk). */
const MAX_NOTIFICATION_REPLIES_PER_RUN = 1;

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

/** Only treat comment create as success when API returns a comment id (avoids recording fingerprints on rejected dupes). */
function commentCreateSucceeded(res) {
    const c = res?.comment || res?.data?.comment;
    return !!(c && c.id);
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
    const completion = await llm.complete({
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
    const completion = await llm.complete({
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
    const completion = await llm.complete({
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
    const completion = await llm.complete({
        temperature: 0,
        max_tokens: 600,
        messages: [
            {
                role: "system",
                content: "You are a math solver. The user text is an obfuscated word problem (lobster-themed, duplicated letters, stray symbols, words may be split apart by spaces). Reconstruct the problem, solve it carefully, and END your reply with ONLY the final numeric answer with 2 decimal places on its own last line, e.g. 15.00.",
            },
            { role: "user", content: challengeText },
        ],
    });
    const txt = extractReplyText(completion);
    if (!txt) return null;
    // Take the LAST number in the reply: the model may restate problem numbers
    // while working; the final line carries the answer.
    const nums = txt.match(/-?\d+(?:\.\d+)?/g);
    if (!nums || !nums.length) return null;
    const num = parseFloat(nums[nums.length - 1]);
    return isNaN(num) ? null : num.toFixed(2);
}

/* ---------------------------------------------------------------------------
 * Deterministic "lobster math" solver.
 * Moltbook's verification challenges are obfuscated math (doubled/scattered
 * letters, e.g. "tWeNnTtY" = twenty, "tHiRrTtY" = thirty, with stray symbols
 * used as decoration). The LLM solver alone is unreliable (free-tier errors,
 * wrong answers) and a failed verify leaves the post/comment pending and
 * invisible. This solver recovers the arithmetic deterministically by
 * collapsing repeated letters and fuzzy-matching number words. Validated
 * against real captured challenges before deploy.
 * ------------------------------------------------------------------------- */
const VERIFY_NUM_WORDS = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
    ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
    seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
    sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const VERIFY_SCALES = { hundred: 100, thousand: 1000, million: 1000000, billion: 1000000000 };
const VERIFY_OP_WORDS = {
    plus: "+", add: "+", adds: "+", added: "+", adding: "+", sum: "+", sums: "+", combined: "+",
    increases: "+", increased: "+", increase: "+", rises: "+", grows: "+", gains: "+", gained: "+", more: "+",
    minus: "-", subtract: "-", subtracted: "-", less: "-", fewer: "-", remove: "-", removed: "-",
    decreases: "-", decreased: "-", decrease: "-", falls: "-", drops: "-", loses: "-", reduced: "-", reduces: "-",
    times: "*", multiplied: "*", multiply: "*", product: "*",
    divided: "/", divide: "/",
    percent: "%", percentage: "%",
};
// "per", "over", "ratio", "together", "total" are deliberately NOT operators here:
// in these natural-language challenges they are almost always units ("per second")
// or filler, not arithmetic. Verbs like "increases by" / "reduced by" are the real ops.
const verifyCollapse = (s) => s.replace(/(.)\1+/g, "$1");

function verifyLev(a, b) {
    const m = a.length, n = b.length;
    const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
}

function verifyMatchWord(token, dict) {
    const ct = verifyCollapse(token);
    let best = null, bestDist = 99;
    for (const word of Object.keys(dict)) {
        const cw = verifyCollapse(word);
        if (token === word || ct === cw) return word;
        const dist = verifyLev(ct, cw);
        const tol = cw.length <= 4 ? 0 : 1;
        if (dist <= tol && dist < bestDist) { best = word; bestDist = dist; }
    }
    return best;
}

function verifyComposeNumber(tokens) {
    let total = 0, current = 0, sawAny = false;
    for (const t of tokens) {
        if (t.kind === "digit" || t.kind === "num") { current += t.value; sawAny = true; }
        else if (t.kind === "scale") {
            sawAny = true;
            if (t.value >= 1000) { total += (current || 1) * t.value; current = 0; }
            else { current = (current || 1) * t.value; }
        }
    }
    return sawAny ? total + current : null;
}

/**
 * Try to reassemble 2-4 adjacent short fragments into one dictionary word.
 * Challenges now also split words apart ("tW eN tY" = twenty, "rEd uCeS" =
 * reduces, "SiX tEeN" = sixteen); without reassembly the tokenizer sees only
 * the intact words and computes the wrong arithmetic (the 2026-07-10 failure).
 * Exact collapse match only — fuzzy matching on joined fragments would invent
 * numbers from unrelated text.
 */
function verifyMatchJoined(joined) {
    const cj = verifyCollapse(joined);
    for (const [dict, kind] of [[VERIFY_NUM_WORDS, "num"], [VERIFY_SCALES, "scale"], [VERIFY_OP_WORDS, "op"]]) {
        for (const word of Object.keys(dict)) {
            if (cj === verifyCollapse(word)) {
                return kind === "op" ? { kind: "op", op: dict[word] } : { kind, value: dict[word] };
            }
        }
    }
    return null;
}

function verifyTokenize(text) {
    const cleaned = String(text || "").toLowerCase().replace(/[^a-z0-9%+\-*/.\s]/g, " ").replace(/\s+/g, " ").trim();
    const words = cleaned.split(" ").filter(Boolean);
    const toks = [];
    let i = 0;
    while (i < words.length) {
        const w = words[i];
        if (/^\d+(\.\d+)?$/.test(w)) { toks.push({ kind: "digit", value: parseFloat(w) }); i++; continue; }
        if (w === "%") { toks.push({ kind: "op", op: "%" }); i++; continue; }
        if (["+", "-", "*", "/"].includes(w)) { toks.push({ kind: "symop", op: w }); i++; continue; }
        let merged = null, mergedLen = 0;
        for (let len = 4; len >= 2; len--) {
            if (i + len > words.length) continue;
            const frags = words.slice(i, i + len);
            if (frags.some((f) => f.length > 6 || !/^[a-z]+$/.test(f))) continue;
            const tok = verifyMatchJoined(frags.join(""));
            if (tok) { merged = tok; mergedLen = len; break; }
        }
        if (merged) { toks.push(merged); i += mergedLen; continue; }
        const num = verifyMatchWord(w, VERIFY_NUM_WORDS);
        if (num != null) { toks.push({ kind: "num", value: VERIFY_NUM_WORDS[num] }); i++; continue; }
        const scale = verifyMatchWord(w, VERIFY_SCALES);
        if (scale != null) { toks.push({ kind: "scale", value: VERIFY_SCALES[scale] }); i++; continue; }
        const op = verifyMatchWord(w, VERIFY_OP_WORDS);
        if (op != null) { toks.push({ kind: "op", op: VERIFY_OP_WORDS[op] }); i++; continue; }
        toks.push({ kind: "word" });
        i++;
    }
    return toks;
}

/** Deterministically solve an obfuscated math challenge. Returns "NN.NN" or null. */
function solveMathChallenge(text) {
    const toks = verifyTokenize(text);
    const numKinds = new Set(["digit", "num", "scale"]);
    // Confidence guard: more than one arithmetic operator => multi-step word problem we
    // cannot reliably parse. Return null so the caller defers to the LLM.
    if (toks.filter((t) => t.kind === "op" && ["+", "-", "*", "/"].includes(t.op)).length > 1) return null;
    // Prefer a WORD operator; bare symbols count only when directly between two numbers.
    let opIdx = -1, op = null;
    for (let i = 0; i < toks.length; i++) {
        if (toks[i].kind === "op" && ["+", "-", "*", "/"].includes(toks[i].op)) { opIdx = i; op = toks[i].op; break; }
    }
    if (opIdx === -1) {
        // Prefer a symbol operator sitting directly between two number tokens.
        for (let i = 1; i < toks.length - 1; i++) {
            if (toks[i].kind === "symop" && numKinds.has(toks[i - 1].kind) && numKinds.has(toks[i + 1].kind)) {
                opIdx = i; op = toks[i].op; break;
            }
        }
    }
    if (opIdx === -1) {
        // Challenges often put units between the number and the "+"
        // ("thirty two Newtons + twenty three Newtons"). If there is exactly
        // one arithmetic symbol, still split left/right number groups.
        const symOps = toks
            .map((t, i) => (t.kind === "symop" && ["+", "-", "*", "/"].includes(t.op) ? i : -1))
            .filter((i) => i >= 0);
        if (symOps.length === 1) {
            opIdx = symOps[0];
            op = toks[opIdx].op;
        }
    }
    if (toks.some((t) => t.kind === "op" && t.op === "%")) {
        const pIdx = toks.findIndex((t) => t.kind === "op" && t.op === "%");
        const left = verifyComposeNumber(toks.slice(0, pIdx).filter((t) => numKinds.has(t.kind)));
        const right = verifyComposeNumber(toks.slice(pIdx + 1).filter((t) => numKinds.has(t.kind)));
        if (left != null && right != null) return ((left / 100) * right).toFixed(2);
        if (left != null) return (left / 100).toFixed(2);
    }
    if (opIdx !== -1) {
        const left = verifyComposeNumber(toks.slice(0, opIdx).filter((t) => numKinds.has(t.kind)));
        const right = verifyComposeNumber(toks.slice(opIdx + 1).filter((t) => numKinds.has(t.kind)));
        if (left != null && right != null) {
            const r = op === "+" ? left + right : op === "-" ? left - right : op === "*" ? left * right : left / right;
            return r.toFixed(2);
        }
    }
    const allNums = toks.filter((t) => numKinds.has(t.kind));
    if (allNums.length === 2) return (verifyComposeNumber([allNums[0]]) + verifyComposeNumber([allNums[1]])).toFixed(2);
    return null;
}

/**
 * Solve a verification challenge, submit it ONCE, and confirm it published.
 *
 * Moltbook allows only a SINGLE /verify attempt per challenge: once any answer
 * is submitted the code is consumed ("Already answered"), so the first answer
 * must be right. We compute both a deterministic answer and an LLM answer; when
 * they agree that is high confidence. We log the full challenge and both
 * candidate answers so real (and any failing) challenges are auditable from the
 * log to keep hardening the solver. Returns true only when Moltbook confirms
 * the content is published.
 */
async function attemptVerify(llm, v, label) {
    const code = v.verification_code;
    const challenge = v.challenge_text;
    const det = solveMathChallenge(challenge);
    // The LLM handles natural-language word problems better than the parser, but the free
    // model is often rate-limited; retry a few times within the verify window.
    let llmAns = null;
    for (let i = 0; i < 3 && !llmAns; i++) {
        try { llmAns = await solveVerification(llm, challenge); }
        catch (e) { console.warn(`Verify (${label}): LLM solve error: ${e.message}`); await sleep(4000); }
    }

    // Pick a single answer (one /verify attempt only). Agreement is strongest. On
    // disagreement prefer the deterministic parse when it produced a sane
    // (non-negative) answer: on 2026-07-10 the LLM twice echoed a number straight
    // from the challenge text and burned the post, while the parser is exact on
    // the formats it accepts and returns null (deferring to the LLM) on the
    // multi-step problems it cannot parse.
    let answer = null;
    let basis = "none";
    if (det && llmAns && det === llmAns) { answer = det; basis = "agree"; }
    else if (det && parseFloat(det) >= 0) { answer = det; basis = "deterministic"; }
    else if (llmAns) { answer = llmAns; basis = "llm"; }
    else if (det) { answer = det; basis = "deterministic"; }

    console.log(`Verify (${label}): challenge="${String(challenge).slice(0, 140)}" det=${det} llm=${llmAns} -> ${answer} (${basis})`);
    if (!answer) { console.warn(`Verify (${label}): no answer computed; content stays pending.`); return false; }

    let res = null;
    try { res = await moltbookPost("/verify", { verification_code: code, answer }); }
    catch (e) { console.warn(`Verify (${label}): /verify network error: ${e.message}`); return false; }
    const ok = res && (res.success === true || /verification successful|now published/i.test(String(res.message || "")));
    if (ok) { console.log(`Verify (${label}): PUBLISHED (answer ${answer}, ${basis}).`); return true; }
    console.warn(`Verify (${label}): NOT published. answer=${answer} basis=${basis} msg="${res?.message || "no response"}". Content stays pending.`);
    return false;
}

/**
 * True for provider errors worth failing over: rate-limit/quota (429), payment
 * (402), and upstream provider failures (OpenRouter "Provider returned error",
 * 5xx). 2026-07-10: OpenRouter surfaced 402 "Provider returned error" on free
 * routes; those must fail over, not abort the action.
 */
function isFailoverError(e) {
    const code = e?.code || e?.error?.code || "";
    const status = e?.status || e?.statusCode;
    const msg = String(e?.message || e?.error?.message || "");
    return (
        code === "rate_limit_exceeded" ||
        code === "insufficient_quota" ||
        code === "model_not_found" ||
        status === 429 ||
        status === 402 ||
        status === 404 ||
        (typeof status === "number" && status >= 500) ||
        /rate.?limit|quota|free-models-per|too many requests|provider returned error|no instances available|does not exist or you do not have access|model_not_found/i.test(msg)
    );
}

/**
 * Build an LLM handle with automatic provider fallback. Groq is the primary
 * (openai/gpt-oss-120b after the 2026-08-16 llama-3.3-70b-versatile shutdown).
 * GPT-OSS is a reasoning model, so requests use low effort, hide reasoning from
 * the content field, and keep a higher max_tokens floor so short posts still get
 * a visible answer. OpenRouter "openrouter/free" remains an opt-in fallback only.
 */
function buildLlm() {
    const providers = [];
    if (process.env.GROQ_API_KEY) {
        providers.push({
            name: "groq",
            model: GROQ_MODEL,
            // GPT-OSS spends some tokens on hidden reasoning; short max_tokens
            // (e.g. 120-150 for posts) can return empty content without this floor.
            minMaxTokens: 800,
            requestDefaults: {
                reasoning_effort: "low",
                include_reasoning: false,
            },
            client: new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" }),
        });
    }
    // 2026-08-01: this fallback was starving the public StablesAgent. Moltbook runs every 30 minutes
    // from cron and makes several calls per run. Whenever Groq was rate-limited it failed over to
    // OpenRouter, which shares ONE key and ONE free-tier daily allowance (about 50 requests) with the
    // Telegram and web agents. The result was observed on 2026-08-01: the whole day's allowance was
    // spent by 07:44Z with ZERO answers given to a person, because a posting bot had consumed it.
    //
    // A public support agent outranks an automated social bot. The fallback is therefore OFF unless
    // explicitly enabled, and enabling it is only sensible once the OpenRouter account has credits
    // (10 credits raises the daily ceiling to about 1,000) or moltbook has a key of its own.
    const allowOpenRouterFallback = String(process.env.MOLTBOOK_ALLOW_OPENROUTER || "").trim() === "1";
    if (process.env.OPENROUTER_API_KEY && allowOpenRouterFallback) {
        providers.push({
            name: "openrouter",
            model: "openrouter/free",
            // Reasoning models burn max_tokens on hidden reasoning before any
            // visible content; give them room so the final answer still appears.
            minMaxTokens: 2000,
            client: new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1" }),
        });
    } else if (process.env.OPENROUTER_API_KEY) {
        console.log("OpenRouter fallback disabled (protects the StablesAgent daily allowance). "
            + "Set MOLTBOOK_ALLOW_OPENROUTER=1 to re-enable.");
    }
    return {
        providers,
        async complete(params) {
            let lastErr = null;
            for (let i = 0; i < providers.length; i++) {
                const p = providers[i];
                const req = { ...(p.requestDefaults || {}), ...params, model: p.model };
                if (p.minMaxTokens && req.max_tokens) req.max_tokens = Math.max(req.max_tokens, p.minMaxTokens);
                try {
                    const completion = await p.client.chat.completions.create(req);
                    const txt = completion?.choices?.[0]?.message?.content;
                    if ((!txt || !String(txt).trim()) && i < providers.length - 1) {
                        console.warn(`LLM ${p.name} returned empty content; failing over to ${providers[i + 1].name}.`);
                        continue;
                    }
                    return completion;
                } catch (e) {
                    lastErr = e;
                    if (isFailoverError(e) && i < providers.length - 1) {
                        console.warn(`LLM ${p.name} unavailable (rate-limit/quota/provider error); failing over to ${providers[i + 1].name}.`);
                        continue;
                    }
                    throw e;
                }
            }
            throw lastErr || new Error("No LLM providers configured");
        },
    };
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

    const llm = buildLlm();
    if (!llm.providers.length) {
        console.error("No LLM provider keys set (OPENROUTER_API_KEY or GROQ_API_KEY).");
        return;
    }
    console.log("LLM providers (fallback order):", llm.providers.map((p) => p.name).join(" -> "));
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
                // Moltbook silently dedupes on title: reposting a title it has seen
                // returns the EXISTING old post object (success-shaped, no verification)
                // instead of creating anything. Detect it by created_at: a genuinely
                // new post is seconds old. Seen live 2026-07-10 ("How does
                // over-collateralization help" came back dated 2026-07-06).
                const createdAtMs = createdPost?.created_at ? new Date(createdPost.created_at).getTime() : null;
                if (createdPost?.id && createdAtMs && Date.now() - createdAtMs > 10 * 60 * 1000) {
                    console.log("Rejected post: Moltbook returned an existing post for this title (server-side duplicate), created_at:", createdPost.created_at);
                    state.recentPostTitles = [...prevTitles, tKey].slice(-60);
                    continue;
                }
                if (createdPost?.id) {
                    state.lastPostAt = new Date().toISOString();
                    state.recentPostAngleIds = [...(state.recentPostAngleIds || []), angleEntry.id].slice(-24);
                    state.recentPostTitles = [...prevTitles, tKey].slice(-60);
                    posted = true;
                    const v = postRes?.verification || postRes?.post?.verification || createdPost?.verification;
                    if (v?.verification_code && v?.challenge_text) {
                        const published = await attemptVerify(llm, v, `post "${title.slice(0, 40)}"`);
                        if (published) {
                            runStats.posts++;
                            console.log("Posted (published):", title);
                        } else {
                            console.warn("Posted but NOT published (pending verification):", title);
                            // The post stays invisible; don't spend the whole 3h
                            // window on it. Backdate so the next attempt comes in
                            // ~60 minutes (still gentle on Moltbook's own limits).
                            state.lastPostAt = new Date(Date.now() - 120 * 60 * 1000).toISOString();
                        }
                    } else {
                        runStats.posts++;
                        console.log("Posted:", title);
                    }
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

    // 2. Reply to comments on our posts (max one successful reply per run)
    const activity = home.activity_on_your_posts || [];
    let notificationRepliesThisRun = 0;
    for (const item of activity) {
        if (notificationRepliesThisRun >= MAX_NOTIFICATION_REPLIES_PER_RUN) break;
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
            await attemptVerify(llm, v, "reply comment");
        }

        if (!commentCreateSucceeded(commentRes)) {
            console.log("Comment not accepted (no id); skipping fingerprint. Raw:", JSON.stringify(commentRes).slice(0, 500));
            if (commentRes?.statusCode === 403) {
                const until = parseSuspendedUntil(commentRes?.message);
                if (until) {
                    state.suspendedUntil = until;
                    saveState(state);
                    console.log("Recorded suspension until", until);
                    return;
                }
            }
            continue;
        }

        state.commentFingerprints = [...(state.commentFingerprints || []), fp];
        runStats.replyComments++;
        notificationRepliesThisRun++;
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
                await attemptVerify(llm, v, "feed comment");
            }
            if (!commentCreateSucceeded(commentRes)) {
                console.log("Feed comment not accepted (no id); skipping fingerprint. Raw:", JSON.stringify(commentRes).slice(0, 500));
                if (commentRes?.statusCode === 403) {
                    const until = parseSuspendedUntil(commentRes?.message);
                    if (until) {
                        state.suspendedUntil = until;
                        saveState(state);
                        console.log("Recorded suspension until", until);
                        return;
                    }
                }
                continue;
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

if (require.main === module) {
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
}

// Exported for the offline solver regression test (test_verify_solver.js).
module.exports = { solveMathChallenge, verifyTokenize };
