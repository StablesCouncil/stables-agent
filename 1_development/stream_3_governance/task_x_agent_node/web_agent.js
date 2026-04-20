const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "task_stablesagent-brain-base", ".env") });
const fs = require("fs");
const http = require("http");
const https = require("https");
const OpenAI = require("openai");
const mysql = require("mysql2/promise");

const DB_FILE = path.join(__dirname, "vector_db.json");
const CSV_FILE = path.join(__dirname, "interaction_logs_web.csv");

const openRouterKey = process.env.OPENROUTER_API_KEY;
if (!openRouterKey) {
    console.error("ERROR: OPENROUTER_API_KEY is not set in .env.");
    process.exit(1);
}

const llm = new OpenAI({
    apiKey: openRouterKey,
    baseURL: "https://openrouter.ai/api/v1",
});

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function extractReplyText(completion) {
    const txt = completion?.choices?.[0]?.message?.content;
    return typeof txt === "string" ? txt.trim() : null;
}

function isQuotaError(err) {
    const msg = err?.message ? String(err.message) : "";
    return (
        err?.code === "rate_limit_exceeded" ||
        err?.code === "insufficient_quota" ||
        msg.includes("rate_limit") ||
        msg.includes("quota")
    );
}

function getErrorHttpStatus(err) {
    if (!err) return undefined;
    if (typeof err.status === "number") return err.status;
    if (typeof err.response?.status === "number") return err.response.status;
    if (typeof err.error?.status === "number") return err.error.status;
    const msg = String(err.message || err.error?.message || "");
    if (/\b429\b|rate limit|too many requests/i.test(msg)) return 429;
    return undefined;
}

function isBusyError(err) {
    return getErrorHttpStatus(err) === 429 || err?.code === 429;
}

/** Serialize LLM calls so parallel browser tabs do not all hit OpenRouter free tier at once. */
let llmRequestTail = Promise.resolve();
function withLlmQueue(fn) {
    const run = () => fn();
    const p = llmRequestTail.then(run, run);
    llmRequestTail = p.catch(() => {});
    return p;
}

async function chatCompletionWithRetry(payload) {
    const maxAttempts = 5;
    let lastErr;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const completion = await llm.chat.completions.create(payload);
            const reply = extractReplyText(completion);
            if (!reply) throw new Error("Empty completion content");
            return reply;
        } catch (err) {
            lastErr = err;
            if (!isBusyError(err) || attempt === maxAttempts) throw err;
            const baseMs = 1200 * Math.pow(2, attempt - 1);
            const delayMs = Math.min(16000, baseMs + Math.floor(Math.random() * 800));
            console.warn(`OpenRouter busy (429), attempt ${attempt}/${maxAttempts}, waiting ${delayMs}ms`);
            await sleep(delayMs);
        }
    }
    throw lastErr;
}

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
    const { MemoryVectorStore } = await import("langchain/vectorstores/memory");

    if (!fs.existsSync(DB_FILE)) {
        throw new Error("Vector DB not found. Run ingest_knowledge.js first.");
    }
    const rawData = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    const vectorStore = new MemoryVectorStore(embeddings);
    vectorStore.memoryVectors = rawData.memoryVectors;
    return vectorStore;
}

async function startWebAgent() {
    console.log("=========================================");
    console.log("🖥️  STABLES WEB AGENT STARTING");
    console.log("=========================================");
    console.log("Initializing local Brain (Xenova embeddings + OpenRouter)...");

    const embeddings = await initXenova();
    const vectorStore = await loadVectorStore(embeddings);

    console.log("✅ Brain Loaded! OpenRouter API active.");
    console.log("🌐 Ready for browser chat sessions.");

    const PORT     = process.env.WEB_AGENT_PORT || 8080;
    const SSL_CERT = "/etc/letsencrypt/live/agent.stablescouncil.org/fullchain.pem";
    const SSL_KEY  = "/etc/letsencrypt/live/agent.stablescouncil.org/privkey.pem";
    const useSSL   = fs.existsSync(SSL_CERT) && fs.existsSync(SSL_KEY);

    async function requestHandler(req, res) {
        // Simple CORS + JSON
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            res.writeHead(204);
            return res.end();
        }

        function normalizePath(url) {
            let p = (url && url.split("?")[0]) || "";
            if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
            return p;
        }
        const reqPath = normalizePath(req.url);

        /** Public MiniDapp feedback ledger (JSON v1). Same contract as task_x_public_feedback_ledger server. */
        if (req.method === "POST" && reqPath === "/api/feedback") {
            const MAX_BODY = 120_000;
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString("utf-8");
                if (body.length > MAX_BODY) req.socket.destroy();
            });
            req.on("end", () => {
                (async () => {
                    try {
                        const parsed = JSON.parse(body || "{}");
                        if (parsed.consent_public_ledger !== true) {
                            res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                            return res.end(JSON.stringify({ ok: false, error: "consent_public_ledger must be true" }));
                        }
                        const dir =
                            process.env.FEEDBACK_SUBMISSIONS_DIR ||
                            path.join(__dirname, "feedback_submissions");
                        await fs.promises.mkdir(dir, { recursive: true });
                        const slug = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
                        const rnd = Math.random().toString(36).slice(2, 8);
                        const fname = `stables-feedback-${slug}-${rnd}.json`;
                        const fp = path.join(dir, fname);
                        const pretty = JSON.stringify(parsed, null, 2);
                        await fs.promises.writeFile(fp, pretty, "utf-8");
                        console.log(`📝 Feedback saved: ${fname}`);
                        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                        return res.end(
                            JSON.stringify({
                                ok: true,
                                id: fname,
                                storage: "agent_disk",
                                path: fname,
                            })
                        );
                    } catch (e) {
                        console.error("❌ /api/feedback:", e);
                        const isParse = e instanceof SyntaxError;
                        res.writeHead(isParse ? 400 : 500, { "Content-Type": "application/json; charset=utf-8" });
                        return res.end(
                            JSON.stringify({ ok: false, error: e.message || (isParse ? "Invalid JSON" : "Write failed") })
                        );
                    }
                })();
            });
            return;
        }

        if (req.method === "GET" && reqPath === "/health") {
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            return res.end(JSON.stringify({ status: "ok", ts: Date.now() }));
        }

        // Serve static assets (stables.css, images) from the same directory
        if (req.method === "GET" && /\.(css|png|jpg|jpeg|svg|ico|webp)$/i.test(req.url.split("?")[0])) {
            const assetPath = path.join(__dirname, req.url.split("?")[0]);
            if (fs.existsSync(assetPath)) {
                const ext = path.extname(assetPath).toLowerCase();
                const mime = { ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg",
                               ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
                               ".ico": "image/x-icon", ".webp": "image/webp" };
                res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
                return res.end(fs.readFileSync(assetPath));
            }
        }

        if (req.method === "GET" && (reqPath === "/" || reqPath === "/chat")) {
            const chatPath = path.join(__dirname, "web_chat.html");
            if (!fs.existsSync(chatPath)) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                return res.end("web_chat.html not found. Deploy file next to web_agent.js.");
            }
            const html = fs.readFileSync(chatPath, "utf-8");
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            return res.end(html);
        }

        if (req.method === "POST" && reqPath === "/api/chat") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString("utf-8");
                if (body.length > 1_000_000) req.socket.destroy();
            });

            req.on("end", async () => {
                try {
                    const data = JSON.parse(body || "{}");
                    const cleanQuery = (data.message || "").toString().trim();
                    if (!cleanQuery) {
                        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                        return res.end(JSON.stringify({ error: "Message is required." }));
                    }

                    console.log(`\n💬 Web chat question: "${cleanQuery}"`);
                    console.log("🔎 Searching Stables knowledge base...");

                    const results = await vectorStore.similaritySearch(cleanQuery, 3);
                    let context = "";
                    results.forEach((resDoc, i) => {
                        context += `\n[Context ${i + 1}]: ${resDoc.pageContent}\n`;
                    });

                    console.log("🤖 Calling OpenRouter...");
                    const replyTextRaw = await withLlmQueue(() =>
                        chatCompletionWithRetry({
                            model: "openrouter/free",
                            temperature: 0.3,
                            max_tokens: 400,
                            messages: [
                                {
                                    role: "system",
                                    content: `You are @StablesAgent, the official AI assistant for the Stables Council, a decentralized banking system built on Minima.
RULES:
- Answer ONLY using the context provided. Do not invent information.
- Answer in the EXACT SAME LANGUAGE as the user's question.
- When writing in French, always use proper accents and diacritics (é, è, ê, à, â, ù, ô, û, î, ï, ü, ç, etc.). Never use ASCII-only spellings (e.g. write "élément" not "element", "écosystème" not "ecosysteme").
- Do NOT greet the user. Jump straight into the answer.
- Do NOT use the word "doctrine".
- Do NOT use emojis, bullet points, or em-dashes.
- Keep answers concise and conversational.`
                                },
                                {
                                    role: "user",
                                    content: `Question: "${cleanQuery}"\n\nContext:\n${context}`
                                }
                            ]
                        })
                    );

                    let replyText = replyTextRaw.replace(/"/g, "").trim();

                    console.log("✨ WEB REPLY:");
                    console.log(replyText);
                    console.log("=========================================\n");

                    const timestamp = new Date().toISOString();
                    const safeQuery = cleanQuery.replace(/"/g, '""');
                    const safeReply = replyText.replace(/"/g, '""');
                    const csvLine = `"${timestamp}","${safeQuery}","${safeReply}"\n`;

                    if (!fs.existsSync(CSV_FILE)) {
                        fs.writeFileSync(CSV_FILE, '"Timestamp","Anonymous Question","AI Response"\n', "utf-8");
                    }
                    fs.appendFileSync(CSV_FILE, csvLine, "utf-8");

                    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ reply: replyText }));
                } catch (err) {
                    console.error("❌ Error in /api/chat:", err);
                    const replyMsg = isQuotaError(err)
                        ? "Sorry, I'm done for today. Heading for a break. Please come back a bit later."
                        : isBusyError(err)
                            ? "Sorry, I'm handling multiple requests at the same time. Please try again in a minute."
                            : "I'm currently undergoing maintenance. Please try again shortly.";
                    res.writeHead(isQuotaError(err) || isBusyError(err) ? 200 : 500, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ reply: replyMsg }));
                }
            });

            return;
        }

        // ── GET /api/devtools/minima-holdings ────────────────────────────────
        if (req.method === "GET" && reqPath === "/api/devtools/minima-holdings") {
            const qs = new URLSearchParams((req.url || "").split("?")[1] || "");
            const addressRaw  = (qs.get("address") || "").trim();
            const dateFrom    = qs.get("date_from") || null;
            const dateTo      = qs.get("date_to")   || null;
            const intervalRaw = (qs.get("interval_type") || "DAY").toUpperCase();
            const interval    = ["DAY","WEEK","MONTH","QUARTER","YEAR"].includes(intervalRaw)
                ? intervalRaw : "DAY";

            if (!addressRaw || !isValidMinimaAddressInput(addressRaw)) {
                res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({ ok: false, error: "Valid Minima address required (0x… or Mx…)" }));
            }

            const pool = getDbPool();
            if (!pool) {
                res.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({ ok: false, error: "DB not configured (MINIMA_DB_USER missing)" }));
            }

            (async () => {
                try {
                    const address = await resolveAddressTo0x(addressRaw);
                    if (!address) {
                        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                        return res.end(JSON.stringify({ ok: false, error: "Could not resolve address to canonical 0x format." }));
                    }

                    /* Latest synced block + live chain tip (parallel fetch). */
                    const [[metaRows], block_live] = await Promise.all([
                        pool.query("SELECT block AS block_db, timemilli AS last_ts FROM syncblock ORDER BY block DESC LIMIT 1"),
                        fetchMinimaTip(),
                    ]);
                    const metaRow         = metaRows[0] || {};
                    const block_db        = metaRow.block_db != null ? Number(metaRow.block_db) : null;
                    const db_refreshed_at = metaRow.last_ts
                        ? new Date(Number(metaRow.last_ts)).toISOString()
                        : null;
                    const block_behind    = (block_live != null && block_db != null)
                        ? (block_live - block_db)
                        : null;

                    /* Holdings time series */
                    const rows = await queryHoldings(pool, address, dateFrom, dateTo, interval);

                    const series      = [];
                    const utxo_series = [];
                    let   hasUtxo     = false;

                    for (const r of rows) {
                        const x = String(r.x);
                        const y = parseFloat(r.y) || 0;
                        const point = { x, y };
                        if (r.block_db_snapshot != null) {
                            point.block_db_snapshot = Number(r.block_db_snapshot);
                        }
                        series.push(point);
                        if (r.utxo_count != null) {
                            utxo_series.push({ x, y: Number(r.utxo_count) });
                            hasUtxo = true;
                        }
                    }

                    const body = {
                        address,          /* canonical 0x used for SQL */
                        address_input: addressRaw, /* what user entered (Mx or 0x) */
                        block_live,
                        block_db,
                        block_behind,
                        db_refreshed_at,
                        series,
                    };
                    if (hasUtxo) body.utxo_series = utxo_series;

                    console.log(`📊 Holdings query: ${address.slice(0, 10)}… → ${series.length} points`);
                    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify(body));
                } catch (err) {
                    console.error("❌ /api/devtools/minima-holdings:", err.message);
                    const isConfig = err.message && err.message.startsWith("SQL_NOT_CONFIGURED");
                    res.writeHead(isConfig ? 501 : 500, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ ok: false, error: err.message }));
                }
            })();
            return;
        }

        // ── GET /api/devtools/archive-meta ───────────────────────────────────
        if (req.method === "GET" && reqPath === "/api/devtools/archive-meta") {
            const pool = getDbPool();
            if (!pool) {
                res.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({ ok: false, error: "DB not configured" }));
            }
            (async () => {
                try {
                    const meta = await queryArchiveMeta(pool);
                    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ ok: true, ...meta }));
                } catch (err) {
                    console.error("❌ /api/devtools/archive-meta:", err.message);
                    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
                    return res.end(JSON.stringify({ ok: false, error: err.message }));
                }
            })();
            return;
        }

        // ── GET /api/devtools/archive-download ───────────────────────────────
        if (req.method === "GET" && reqPath === "/api/devtools/archive-download") {
            const archivePath = process.env.MINIMA_ARCHIVE_FILE_PATH;
            if (!archivePath) {
                res.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({ ok: false, error: "Archive path not configured" }));
            }
            let stat;
            try {
                stat = fs.statSync(archivePath);
                if (!stat.isFile()) throw new Error("Archive path is not a file");
            } catch (err) {
                console.error("❌ /api/devtools/archive-download:", err.message);
                res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({ ok: false, error: "Archive file not found" }));
            }

            const filename = path.basename(archivePath);
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Length": String(stat.size),
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            });
            const stream = fs.createReadStream(archivePath);
            stream.on("error", (err) => {
                console.error("❌ archive stream error:", err.message);
                try { res.destroy(err); } catch (_) {}
            });
            return stream.pipe(res);
        }

        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
    }

    if (useSSL) {
        const sslOptions = {
            cert: fs.readFileSync(SSL_CERT),
            key:  fs.readFileSync(SSL_KEY),
        };
        https.createServer(sslOptions, requestHandler).listen(443, () => {
            console.log(`🔒 Web agent listening on https://agent.stablescouncil.org/chat`);
        });
        // Redirect HTTP → HTTPS (best-effort: skip if port 80 is already held by nginx or another proxy)
        const httpRedirect = http.createServer((req, res) => {
            res.writeHead(301, { Location: `https://agent.stablescouncil.org${req.url}` });
            res.end();
        });
        httpRedirect.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.log(`↪  Port 80 already in use (nginx/proxy present) — HTTP redirect skipped.`);
            } else {
                console.error(`HTTP redirect server error: ${err.message}`);
            }
        });
        httpRedirect.listen(80, () => {
            console.log(`↪  HTTP redirect active on port 80`);
        });
    } else {
        http.createServer(requestHandler).listen(PORT, () => {
            console.log(`🌍 Web agent listening on http://localhost:${PORT}/chat`);
        });
    }
}

// ─── Minima archive DB layer ─────────────────────────────────────────────────

/** Lazy mysql2 connection pool. Created only when MINIMA_DB_USER is present in env. */
let _dbPool = null;
function getDbPool() {
    if (_dbPool) return _dbPool;
    if (!process.env.MINIMA_DB_USER || !process.env.MINIMA_DB_PASS) return null;
    _dbPool = mysql.createPool({
        host:             process.env.MINIMA_DB_HOST || "127.0.0.1",
        port:             parseInt(process.env.MINIMA_DB_PORT || "3306", 10),
        database:         process.env.MINIMA_DB_NAME || "minima_archive",
        user:             process.env.MINIMA_DB_USER,
        password:         process.env.MINIMA_DB_PASS,
        connectionLimit:  5,
        waitForConnections: true,
        connectTimeout:   8000,
        dateStrings:      true,   /* DATE columns → 'YYYY-MM-DD' strings, not JS Date objects */
    });
    console.log("🗄️  Minima DB pool created (host: " + (process.env.MINIMA_DB_HOST || "127.0.0.1") + ")");
    return _dbPool;
}

/**
 * Returns time-series rows
 * { x: 'YYYY-MM-DD', y: balanceFloat, utxo_count: int, block_db_snapshot: int }
 * for the given Minima address over the requested date range and interval.
 *
 * Query logic (adapted from tested SQL):
 *   1. latest_coins  — one canonical row per coinid (highest MMR entry) for the address
 *   2. day_max_block — global date→block mapping from coins.date (network-wide)
 *   3. bucketed      — rolls day_max_block into the requested interval
 *   4. Final JOIN    — for each bucket, sum unspent amountdouble and count UTXOs
 *
 * dateFrom / dateTo may be null → full history, no date filter applied.
 * interval must be one of DAY | WEEK | MONTH | QUARTER | YEAR.
 */
async function queryHoldings(pool, address, dateFrom, dateTo, interval) {
    /*
     * Two-query approach: MySQL can't do a range join efficiently when the range
     * boundaries come from a materialized CTE (no index seek, only full-address scan).
     * Instead we fetch the two datasets separately and aggregate in JS:
     *
     * Q1 — Period buckets (fast: ~1100 rows in day_blocks, PRIMARY KEY range scan).
     * Q2 — Canonical coin state for this address (fast: idx_coins_token_addr_coin_mmr).
     *
     * JS aggregation: O(N_buckets × N_coins) comparisons in memory — typically < 5 ms
     * even for the heaviest addresses (32k coins × 30 buckets = 960k simple comparisons).
     */

    /* Q1 – bucketed period list */
    const sqlBuckets = `
        SELECT
          DATE_FORMAT(
            CASE ?
              WHEN 'DAY'     THEN snap_date
              WHEN 'WEEK'    THEN DATE(DATE_SUB(snap_date, INTERVAL WEEKDAY(snap_date) DAY))
              WHEN 'MONTH'   THEN DATE(DATE_FORMAT(snap_date, '%Y-%m-01'))
              WHEN 'QUARTER' THEN DATE(CONCAT(YEAR(snap_date), '-',
                                 LPAD((QUARTER(snap_date)-1)*3+1, 2, '0'), '-01'))
              WHEN 'YEAR'    THEN DATE(DATE_FORMAT(snap_date, '%Y-01-01'))
              ELSE snap_date
            END,
            '%Y-%m-%d'
          ) AS period_start,
          MAX(max_block) AS period_max_block
        FROM minima_archive.day_blocks
        WHERE (? IS NULL OR snap_date >= ?)
          AND (? IS NULL OR snap_date <= ?)
        GROUP BY period_start
        ORDER BY period_start ASC
    `;
    const [bucketRows] = await pool.query(sqlBuckets, [
        interval,
        dateFrom, dateFrom,
        dateTo,   dateTo,
    ]);

    if (bucketRows.length === 0) return [];

    /* Derive block range from Q1 results to pre-filter Q2.
       Coins created after the last period, or spent before the first period,
       contribute zero balance to every bucket — skip them entirely. */
    const firstMaxBlock = Number(bucketRows[0].period_max_block);
    const lastMaxBlock  = Number(bucketRows[bucketRows.length - 1].period_max_block);

    /* Q2 – canonical coin state per coinid for this address.
       idx_coins_token_addr_coin_mmr covers (tokenid, address, coinid, mmrentrynumber).
       Pre-filter: only coins active in at least one bucket in the requested range. */
    const sqlCoins = `
        SELECT c.coinid, c.amountdouble, c.spent, c.blockcreated, c.blockspent
        FROM minima_archive.coins c
        JOIN (
          SELECT coinid, MAX(mmrentrynumber) AS maxmmr
          FROM minima_archive.coins
          WHERE tokenid   = '0x00'
            AND address   = ?
            AND blockcreated <= ?
          GROUP BY coinid
        ) m ON m.coinid = c.coinid AND m.maxmmr = c.mmrentrynumber
        WHERE c.tokenid = '0x00'
          AND c.address = ?
          AND c.blockcreated <= ?
          AND (c.spent = 0 OR c.blockspent > ?)
    `;
    const [coinRows] = await pool.query(sqlCoins, [
        address, lastMaxBlock,
        address, lastMaxBlock, firstMaxBlock,
    ]);

    /* JS aggregation: for each bucket, sum coins active at that period's max block. */
    return bucketRows.map(({ period_start, period_max_block }) => {
        const maxBlock = Number(period_max_block);
        let balance = 0;
        let utxo = 0;
        for (const coin of coinRows) {
            const created = Number(coin.blockcreated);
            if (created > maxBlock) continue;
            const spent   = coin.spent === 1 || coin.spent === true;
            const spentAt = spent ? Number(coin.blockspent) : Infinity;
            if (spentAt > maxBlock) {
                balance += Number(coin.amountdouble);
                utxo++;
            }
        }
        return { x: period_start, y: balance, utxo_count: utxo, block_db_snapshot: maxBlock };
    });
}

/**
 * Fetches the current chain tip from the local Minima node RPC via curl.
 * Node.js's built-in https fails against Minima's self-signed + HTTP/2 setup;
 * curl handles it correctly with -sk (insecure, silent).
 * Env vars: MINIMA_RPC_URL (e.g. https://127.0.0.1:9005)
 *           MINIMA_RPC_USER / MINIMA_RPC_PASS (basic auth)
 */
function fetchMinimaTip() {
    const rpcUrl  = process.env.MINIMA_RPC_URL;
    const rpcUser = process.env.MINIMA_RPC_USER;
    const rpcPass = process.env.MINIMA_RPC_PASS;
    if (!rpcUrl || !rpcUser || !rpcPass) return Promise.resolve(null);

    const { execFile } = require("child_process");
    const endpoint = rpcUrl.replace(/\/$/, "") + "/status";
    return new Promise((resolve) => {
        execFile(
            "curl",
            ["-sk", "--max-time", "4", "-u", `${rpcUser}:${rpcPass}`, endpoint],
            { timeout: 5000 },
            (err, stdout) => {
                if (err) return resolve(null);
                try {
                    const json  = JSON.parse(stdout);
                    const block = json?.response?.chain?.block ?? null;
                    resolve(block != null ? Number(block) : null);
                } catch (_) { resolve(null); }
            }
        );
    });
}

/** Accept canonical Minima address inputs from UI/API. */
function isValidMinimaAddressInput(address) {
    const s = String(address || "").trim();
    if (!s) return false;
    if (/^0x[0-9A-Fa-f]+$/.test(s)) return true;
    if (/^Mx[0-9A-Za-z]+$/.test(s)) return true;
    return false;
}

/**
 * Resolves user input address to canonical 0x format for SQL queries.
 * - 0x... input -> returned as-is (uppercased)
 * - Mx... input -> resolved through Minima RPC checkaddress
 */
async function resolveAddressTo0x(addressInput) {
    const raw = String(addressInput || "").trim();
    if (!raw) return null;
    if (/^0x[0-9A-Fa-f]+$/.test(raw)) return "0x" + raw.slice(2).toUpperCase();
    if (!/^Mx[0-9A-Za-z]+$/.test(raw)) return null;

    const rpcUrl  = process.env.MINIMA_RPC_URL;
    const rpcUser = process.env.MINIMA_RPC_USER;
    const rpcPass = process.env.MINIMA_RPC_PASS;
    if (!rpcUrl || !rpcUser || !rpcPass) return null;

    const { execFile } = require("child_process");
    const cmd = "checkaddress address:" + raw;
    const endpoint = rpcUrl.replace(/\/$/, "") + "/" + encodeURIComponent(cmd);

    return await new Promise((resolve) => {
        execFile(
            "curl",
            ["-sk", "--max-time", "4", "-u", `${rpcUser}:${rpcPass}`, endpoint],
            { timeout: 5000 },
            (err, stdout) => {
                if (err) return resolve(null);
                try {
                    const json = JSON.parse(stdout);
                    const resolved = json?.response?.["0x"] || json?.response?.original || null;
                    if (resolved && /^0x[0-9A-Fa-f]+$/.test(String(resolved).trim())) {
                        const cleaned = String(resolved).trim();
                        return resolve("0x" + cleaned.slice(2).toUpperCase());
                    }
                    return resolve(null);
                } catch (_) {
                    return resolve(null);
                }
            }
        );
    });
}

/**
 * Returns { block_db, block_live, block_behind, exported_at, file_size_mb }.
 *   block_db    – highest block indexed in the archive MySQL DB
 *   block_live  – current chain tip from the Minima node RPC (null if unavailable)
 *   block_behind – block_live - block_db (null if either is unavailable)
 *   latest_block – alias for block_db (kept for backward compat)
 */
async function queryArchiveMeta(pool) {
    /* ORDER BY block DESC LIMIT 1 uses the block index (no full-table scan). */
    const [rows] = await pool.query(`
        SELECT block AS latest_block, timemilli AS last_timemilli
        FROM syncblock
        ORDER BY block DESC
        LIMIT 1
    `);
    const row = rows[0] || {};
    const block_db    = row.latest_block != null ? Number(row.latest_block) : null;
    const exported_at = row.last_timemilli
        ? new Date(Number(row.last_timemilli)).toISOString()
        : null;

    const block_live   = await fetchMinimaTip();
    const block_behind = (block_live != null && block_db != null)
        ? (block_live - block_db)
        : null;

    let file_size_mb = null;
    const archivePath = process.env.MINIMA_ARCHIVE_FILE_PATH;
    if (archivePath) {
        try {
            const stat = await fs.promises.stat(archivePath);
            file_size_mb = Math.round((stat.size / (1024 * 1024)) * 10) / 10;
        } catch (_) { /* file not accessible from this process — skip */ }
    }

    return {
        latest_block: block_db,   /* backward compat */
        block_db,
        block_live,
        block_behind,
        exported_at,
        file_size_mb,
    };
}

// ─────────────────────────────────────────────────────────────────────────────

startWebAgent().catch((err) => {
    console.error("Fatal error starting web agent:", err);
    process.exit(1);
});

