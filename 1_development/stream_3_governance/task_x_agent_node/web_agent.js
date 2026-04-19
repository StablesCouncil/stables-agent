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
            const address     = (qs.get("address") || "").trim();
            const dateFrom    = qs.get("date_from") || null;
            const dateTo      = qs.get("date_to")   || null;
            const intervalRaw = (qs.get("interval_type") || "DAY").toUpperCase();
            const interval    = ["DAY","WEEK","MONTH","QUARTER","YEAR"].includes(intervalRaw)
                ? intervalRaw : "DAY";

            if (!address || !/^0x[0-9A-Fa-f]+$/i.test(address)) {
                res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({ ok: false, error: "Valid Minima address required (0x…)" }));
            }

            const pool = getDbPool();
            if (!pool) {
                res.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
                return res.end(JSON.stringify({ ok: false, error: "DB not configured (MINIMA_DB_USER missing)" }));
            }

            (async () => {
                try {
                    /* Latest synced block for metadata */
                    const [[metaRow]] = await pool.query(
                        "SELECT MAX(block) AS block_db, MAX(timemilli) AS last_ts FROM syncblock"
                    );
                    const block_db        = metaRow.block_db != null ? Number(metaRow.block_db) : null;
                    const db_refreshed_at = metaRow.last_ts
                        ? new Date(Number(metaRow.last_ts)).toISOString()
                        : null;

                    /* Holdings time series */
                    const rows = await queryHoldings(pool, address, dateFrom, dateTo, interval);

                    const series      = [];
                    const utxo_series = [];
                    let   hasUtxo     = false;

                    for (const r of rows) {
                        const x = String(r.x);
                        const y = parseFloat(r.y) || 0;
                        series.push({ x, y });
                        if (r.utxo_count != null) {
                            utxo_series.push({ x, y: Number(r.utxo_count) });
                            hasUtxo = true;
                        }
                    }

                    const body = {
                        address,
                        block_live:      block_db,   /* TODO: replace with Minima RPC tip if available */
                        block_db,
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
 * Returns time-series rows { x: 'YYYY-MM-DD', y: balanceFloat, utxo_count: int }
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
    const sql = `
        WITH

        /* One canonical MMR state per coin for this address (Minima 0x00 token only) */
        latest_coins AS (
          SELECT c.coinid, c.amountdouble, c.spent, c.blockcreated, c.blockspent
          FROM minima_archive.coins c
          JOIN (
            SELECT coinid, MAX(mmrentrynumber) AS maxmmr
            FROM minima_archive.coins
            WHERE tokenid = '0x00'
              AND address = ?
            GROUP BY coinid
          ) m ON m.coinid = c.coinid AND m.maxmmr = c.mmrentrynumber
          WHERE c.tokenid = '0x00'
            AND c.address = ?
        ),

        /* Global block timeline — one max block per calendar day across all 0x00 coins.
           No date filter here: we always build the full timeline so that addresses
           whose coins were created outside the requested range still appear correctly.
           coins.date format: 'DD/MM/YYYY HH:MM:SS'. */
        day_max_block AS (
          SELECT
            DATE(STR_TO_DATE(\`date\`, '%d/%m/%Y %H:%i:%s')) AS snap_date,
            MAX(blockcreated)                                AS max_block
          FROM minima_archive.coins
          WHERE tokenid = '0x00'
          GROUP BY snap_date
        ),

        /* Roll daily snapshots into the requested interval bucket.
           Date range is applied here so the output is scoped without affecting
           the block→date mapping built above. */
        bucketed AS (
          SELECT
            CASE ?
              WHEN 'DAY'     THEN snap_date
              WHEN 'WEEK'    THEN DATE(DATE_SUB(snap_date, INTERVAL WEEKDAY(snap_date) DAY))
              WHEN 'MONTH'   THEN DATE(DATE_FORMAT(snap_date, '%Y-%m-01'))
              WHEN 'QUARTER' THEN DATE(CONCAT(YEAR(snap_date), '-',
                                 LPAD((QUARTER(snap_date)-1)*3+1, 2, '0'), '-01'))
              WHEN 'YEAR'    THEN DATE(DATE_FORMAT(snap_date, '%Y-01-01'))
              ELSE snap_date
            END            AS period_start,
            MAX(max_block) AS period_max_block
          FROM day_max_block
          WHERE (? IS NULL OR snap_date >= ?)
            AND (? IS NULL OR snap_date <= ?)
          GROUP BY period_start
        )

        SELECT
          DATE_FORMAT(b.period_start, '%Y-%m-%d') AS x,
          COALESCE(SUM(lc.amountdouble), 0)       AS y,
          COUNT(lc.coinid)                         AS utxo_count
        FROM bucketed b
        LEFT JOIN latest_coins lc
          ON  lc.blockcreated <= b.period_max_block
          AND (lc.spent = 0 OR lc.blockspent > b.period_max_block)
        GROUP BY b.period_start
        ORDER BY b.period_start ASC
    `;

    /*
     * Positional params for the 7 ? placeholders above:
     *   1  address        latest_coins JOIN subquery: address = ?
     *   2  address        latest_coins WHERE:         c.address = ?
     *   3  interval       bucketed: CASE ? WHEN …
     *   4  dateFrom       bucketed: IS NULL check  (? IS NULL OR snap_date >= ?)
     *   5  dateFrom       bucketed: actual >= comparison
     *   6  dateTo         bucketed: IS NULL check  (? IS NULL OR snap_date <= ?)
     *   7  dateTo         bucketed: actual <= comparison
     */
    const params = [
        address, address,
        interval,
        dateFrom, dateFrom,
        dateTo,   dateTo,
    ];

    const [rows] = await pool.query(sql, params);
    return rows;
}

/**
 * Returns { latest_block, db_refreshed_at, file_size_mb }.
 * latest_block and db_refreshed_at come from syncblock MAX scan.
 * file_size_mb comes from fs.stat on MINIMA_ARCHIVE_FILE_PATH.
 */
async function queryArchiveMeta(pool) {
    const [rows] = await pool.query(`
        SELECT
            MAX(block)      AS latest_block,
            MAX(timemilli)  AS last_timemilli
        FROM syncblock
    `);
    const row = rows[0] || {};
    const latest_block = row.latest_block != null ? Number(row.latest_block) : null;
    const exported_at  = row.last_timemilli
        ? new Date(Number(row.last_timemilli)).toISOString()
        : null;

    let file_size_mb = null;
    const archivePath = process.env.MINIMA_ARCHIVE_FILE_PATH;
    if (archivePath) {
        try {
            const stat = await fs.promises.stat(archivePath);
            file_size_mb = Math.round((stat.size / (1024 * 1024)) * 10) / 10;
        } catch (_) { /* file not accessible from this process — skip */ }
    }

    return { latest_block, exported_at, file_size_mb };
}

// ─────────────────────────────────────────────────────────────────────────────

startWebAgent().catch((err) => {
    console.error("Fatal error starting web agent:", err);
    process.exit(1);
});

