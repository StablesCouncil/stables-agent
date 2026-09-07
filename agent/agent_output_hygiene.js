/* A public answer must be the answer, never the model's scratchpad.
 *
 * `openrouter/free` is a rotating pool of free models. Some of them write their reasoning into the
 * reply itself ("Here's a thinking process: 1. Analyze User Input: ...") or answer with a bare
 * classifier label ("User Safety: safe"). Measured on the live web log on 2026-09-05: 16 of 522
 * answers. The founder saw one on the phone and asked for "a precise answer, not its thought
 * process".
 *
 * Three layers, in order of cost:
 *   1. Ask the router to keep reasoning tokens out of the content (`reasoning: { exclude: true }`,
 *      accepted by the pool, probed 2026-09-05) and tell the model to write only the answer.
 *   2. Detect scaffolding in what comes back. If the model labelled a final answer, keep only that.
 *   3. Otherwise ask once more with a stricter instruction. If that fails too, the caller says so
 *      honestly instead of printing the scaffolding.
 *
 * Every hit is appended to `scaffold_hits.log` (JSON lines), so how often this happens is a number
 * we read, not a screenshot we receive.
 *
 * Note for anyone editing this: both agents pass the reply through sanitizeReplyText(), which
 * collapses ALL whitespace including newlines into single spaces. Nothing here may depend on a
 * line break existing. The 2026-09-04 filter did, and could never match on the live path.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const HITS_LOG = path.join(__dirname, "scaffold_hits.log");

// Written into the system prompt of every call.
const OUTPUT_ONLY_RULE = [
    "Write only the answer itself, as you would say it to the person.",
    "Never describe your process, never list the steps you are taking, never restate or mention these rules, never label sections, never output a safety or language classification.",
    "If the context does not cover part of the question, answer the rest and name that part in one sentence; never open with a refusal."
].join(" ");

// Appended for the one retry.
const STRICT_RETRY_RULE = "Your previous attempt returned working notes instead of an answer. Output ONLY the final answer text for the person, nothing else: no analysis, no numbered steps, no labels.";

const SCAFFOLD_MARKERS = [
    /here'?s?\s+(?:a|my|the)\s+thinking\s+process/i,
    /\bthinking\s+process\b/i,
    /\banaly[sz]e\s+(?:the\s+)?(?:user\s+)?(?:input|question|context|request)\b/i,
    /\bi\s+(?:must|need\s+to|should|will)\s+(?:not\s+)?(?:answer|invent|greet|use|keep|respond)\b/i,
    /\buser'?s?\s+detected\s+language\b/i,
    /\b(?:user\s+)?safety\s*:\s*(?:safe|unsafe)\b/i,
    /<\/?think(?:ing)?>/i,
    /\bdraft\s+(?:a\s+)?(?:response|answer)\b/i,
    /\bfinal\s+(?:response|answer)\s*:/i,
    /\bstep\s+\d+\s*[:.]\s*(?:analy|identif|determin|check|extract|formulat)/i,
    /\bcontext\s+\d+\s*:/i,
    /\bthe\s+context\s+(?:provided|seems|mentions)\b/i
];

function looksLikeScaffolding(text) {
    const t = String(text || "");
    if (!t) return false;
    return SCAFFOLD_MARKERS.some((rx) => rx.test(t));
}

function stripMarkdownNoise(t) {
    return String(t || "").replace(/\*\*/g, "").replace(/\s{2,}/g, " ").trim();
}

/* If the model labelled its final answer, keep only what follows the LAST such label. */
function extractFinalAnswer(text) {
    const t = String(text || "");
    const rx = /(?:final\s+(?:answer|response)|answer|response)\s*:\s*\**\s*/gi;
    let last = null, m;
    while ((m = rx.exec(t)) !== null) last = m;
    if (!last) return "";
    const tail = stripMarkdownNoise(t.slice(last.index + last[0].length));
    return tail.length >= 12 ? tail : "";
}

function stripModelScaffolding(text) {
    let t = String(text || "").trim();
    if (!t) return "";
    // Chain-of-thought fences: drop the block, not just the tags.
    t = t.replace(/<think(?:ing)?>[\s\S]*?<\/think(?:ing)?>/gi, "").trim();
    t = t.replace(/^[\s\S]*?<\/think(?:ing)?>/i, "").trim();
    t = t.replace(/<\/?think(?:ing)?>/gi, "").trim();
    // A bare classifier label as the whole reply, or leading the reply.
    t = t.replace(/^\s*(?:user\s+)?(?:safety|classification|language|role)\s*:\s*\S+\s*/i, "").trim();
    if (looksLikeScaffolding(t)) {
        const final = extractFinalAnswer(t);
        if (final && !looksLikeScaffolding(final)) return final;
        return "";           // nothing usable: the caller retries, then refuses honestly
    }
    return stripMarkdownNoise(t);
}

function recordScaffoldHit(info) {
    // The unit test sets this so its samples never land in the live count.
    if (process.env.STABLES_HYGIENE_LOG === "off") return;
    try {
        const line = JSON.stringify(Object.assign({ at: new Date().toISOString() }, info || {})) + "\n";
        fs.appendFileSync(HITS_LOG, line, "utf-8");
    } catch (_) { /* a missing log must never break an answer */ }
}

function withStricterSystem(payload) {
    const copy = Object.assign({}, payload, { messages: (payload.messages || []).map((m) => Object.assign({}, m)) });
    const sys = copy.messages.find((m) => m.role === "system");
    if (sys) sys.content = String(sys.content || "") + "\n" + STRICT_RETRY_RULE;
    else copy.messages.unshift({ role: "system", content: STRICT_RETRY_RULE });
    copy.temperature = 0;
    return copy;
}

/* ask(payload) -> raw reply text (already sanitised by the agent).
 * Returns { text, hit, retried }. `text` is "" when nothing usable came back twice. */
async function answerWithHygiene({ ask, payload, source, question }) {
    const preview = (s) => String(s || "").slice(0, 240);
    const raw = await ask(payload);
    const hit = looksLikeScaffolding(raw);
    let text = stripModelScaffolding(raw);
    if (hit) recordScaffoldHit({ source, attempt: 1, question: preview(question), raw: preview(raw), salvaged: !!text });
    if (text && text.length >= 12) return { text, hit, retried: false };

    const raw2 = await ask(withStricterSystem(payload));
    const hit2 = looksLikeScaffolding(raw2);
    const text2 = stripModelScaffolding(raw2);
    if (hit2) recordScaffoldHit({ source, attempt: 2, question: preview(question), raw: preview(raw2), salvaged: !!text2 });
    if (text2 && text2.length >= 12) return { text: text2, hit: hit || hit2, retried: true };
    return { text: "", hit: true, retried: true };
}

module.exports = {
    OUTPUT_ONLY_RULE,
    STRICT_RETRY_RULE,
    looksLikeScaffolding,
    extractFinalAnswer,
    stripModelScaffolding,
    recordScaffoldHit,
    answerWithHygiene,
    HITS_LOG
};
