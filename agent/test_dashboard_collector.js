/* The Test Channel collector: GET /test-dashboard on the web agent.
 *
 * test-dashboard.html had been online since July pointing at this endpoint, which did not exist,
 * so the page said "collector offline" to everyone. Founder 2026-09-05: "the test-dashboard.html
 * should now be put online and the available stat should be reflected in there", then "it seems I
 * performed much more actions, could we also add the explorer link with the transaction's hash".
 *
 * Two sources, each used for what it is good at:
 *
 *   - The Minima archive database (`minima_archive.coins`) holds every coin the network ever made,
 *     but it is Minima's own MySQL archive: a block reaches it only when it falls out of the
 *     node's cascade window, about 2,000 blocks (a day) behind the tip. So the archive supplies
 *     the LONG history: every coin the faucet and the par vault ever held, with the canonical row
 *     per coin (max `mmrentrynumber`), the same way `queryHoldings` reads it.
 *   - The node itself (`txpow block:N`, ~25 ms a block, every block still readable because the
 *     node stores all TxPoW) supplies the LAST DAY and the transaction hashes. A background
 *     scanner walks blocks forward, keeps its place on disk, and records every transaction whose
 *     outputs touch the faucet or the vault: the hash, the block, the time, the new pool coin, the
 *     amount and the tester address. Archive events get their hash the same way, lazily, once.
 *   - Current pool sizes come from the node's live `coins address:` read.
 *
 * How the covenants leave their marks (verified against archive rows and live blocks, 2026-09-05):
 *   - Faucet: every claim spends the pool coin at the faucet address and creates one 1,000 Winiwa
 *     smaller. Claims = distinct Winiwa pool coins minus the seed; pool now = the unspent one.
 *   - Par vault: every mint or burn spends the vault's Winiwa pool coin and creates a new one;
 *     larger means a mint (W Winiwa in, W xWiniwa out), smaller means a burn. The pool size IS the
 *     xWiniwa in circulation, by construction (par).
 * Addresses are not people: a Minima wallet rotates receive addresses, so "addresses holding"
 * runs higher than the number of testers. The page says so.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const V9 = {
    winiwa:  "0xD4F5DD3546F25D327CBF2B6867E193CE5DB6491AC9C65BBDCECACA1A6688063F",
    xwiniwa: "0xEFA53EFF58616DDBDF0B6D6DBB4E18F041C4509FB3DB3B7E5482B99ABC72F127",
    faucet:  "0x5E08C5DCD965B9460C4734DC6113AE747C98DFEC31B13FEADF5805D464F49930",
    vault:   "0xF4B1826C2AC2F94C5C1DEB99E1DA560DAD98471B3C5BAF58E4B6FB1083EDFF3C",
    /* The lane vault, live 2026-09-07: the same par vault sharded into four independent lanes at one
       address, so a mint and a burn can share a block. Both vaults are read together: V1 is not
       retired, it drains. The lane a transaction operates is port 35 of its own state. */
    vaultV2: "0x0C402031CE74B8C4F65CDC19F9E12AC00526091920C76E72AC90FAD7C57D5606",
    vaultV2Lanes: 4,
    faucetSeed: 1000000000,
    claimAmount: 1000,
    firstBlock: 2224831          // the faucet's first coin; nothing of ours is older
};

/* System addresses that hold test tokens without being testers: the two covenants, the Cold
   custody wallet's known receive addresses, the issuer, and the token-creation addresses. */
const SYSTEM_ADDRESSES = new Set([
    V9.faucet, V9.vault, V9.vaultV2,
    "0xE96B68366997A3B7F6B38E7367BC94170BBD5099F9B34A9D8F1B277DCFEF8B2C",   // Cold, xWiniwa reserve
    "0x80B214F99CC1EBEC6105ACABB7D3D64BB7E544FBF74ECF4187B6AA84EB5B3547",   // Cold receive
    "0x45D81D69F20790A3F59665351801F756B0FD175CEA8E09B6ECD5573187EEE09E",   // issuer
    "0x45A4714D590A02FDF082C7C0A58536A1E91C018A4016CC82B40AB9A4B016C9DA",   // Winiwa creation
    "0x6FAD3E47E6610EE62BAB7AC946B369C413FC5E0D23763B5A225EA6598375C873"    // xWiniwa creation
].map((a) => a.toUpperCase()));

/* Compare hex ids only in one case. toUpperCase() turns the "0x" prefix into "0X", so a node
   address uppercased never equalled the "0x..." constants above (measured: a 600-block scan over
   known events recorded none). Everything below compares through `up()` on BOTH sides. */
const K = {
    faucet: V9.faucet.toUpperCase(), vault: V9.vault.toUpperCase(), vaultV2: V9.vaultV2.toUpperCase(),
    winiwa: V9.winiwa.toUpperCase(), xwiniwa: V9.xwiniwa.toUpperCase()
};
const VAULTS = [V9.vault, V9.vaultV2];
function isVaultAddress(a) { const u = up(a); return u === K.vault || u === K.vaultV2; }
/* Which lane a vault transaction operates. Port 35 is the lane the transaction claims, and every
   input it spends asserts its own lane equals it, so one transaction is one lane. V1 has no lane. */
function laneOfTxn(tx) {
    const st = tx && tx.body && tx.body.txn && tx.body.txn.state;
    if (!Array.isArray(st)) return null;
    const e = st.find((x) => x && Number(x.port) === 35);
    return e ? String(e.data) : null;
}
function coinAmount(c) { return Number(c.tokenamount != null ? c.tokenamount : c.amount); }

const CACHE_MS = 60 * 1000;
const SCAN_FILE = path.join(__dirname, "test_channel_scan.json");
const SCAN_TICK_MS = 60 * 1000;
const SCAN_BLOCKS_PER_TICK = 600;          // ~15 s of RPC at 25 ms a block
const up = (s) => String(s || "").toUpperCase();

let cache = { at: 0, body: null };

// ------------------------------------------------------------------------------- node RPC
function minimaRpc(command) {
    const rpcUrl = process.env.MINIMA_RPC_URL, user = process.env.MINIMA_RPC_USER, pass = process.env.MINIMA_RPC_PASS;
    if (!rpcUrl || !user || !pass) return Promise.resolve(null);
    const endpoint = rpcUrl.replace(/\/$/, "") + "/" + encodeURIComponent(command);
    return new Promise((resolve) => {
        execFile("curl", ["-sk", "--max-time", "20", "-u", `${user}:${pass}`, endpoint], { timeout: 25000, maxBuffer: 16 * 1024 * 1024 }, (err, stdout) => {
            if (err) return resolve(null);
            try { const j = JSON.parse(stdout); resolve(j && j.status ? j.response : null); } catch (_) { resolve(null); }
        });
    });
}

async function liveTip() {
    const s = await minimaRpc("status");
    const b = s && s.chain && s.chain.block;
    return b != null ? Number(b) : null;
}

/* The current unspent Winiwa coin at a covenant address, from the node. */
async function liveWiniwaCoin(address) {
    const coins = await minimaRpc(`coins address:${address} tokenid:${V9.winiwa}`);
    if (!Array.isArray(coins)) return null;
    const c = coins.filter((x) => !x.spent).sort((a, b) => Number(b.created) - Number(a.created))[0];
    return c ? { coinid: up(c.coinid), amount: Number(c.tokenamount != null ? c.tokenamount : c.amount), created: Number(c.created) } : null;
}

/* Both vaults together. The pool is one coin at V1 and one per used lane at V2, so the pooled
   Winiwa (= xWiniwa in circulation, at par) is their sum, not the newest single coin. */
async function liveVaultPoolTotal() {
    let total = null;
    for (const address of VAULTS) {
        const coins = await minimaRpc(`coins address:${address} tokenid:${V9.winiwa}`);
        if (!Array.isArray(coins)) continue;
        for (const c of coins.filter((x) => !x.spent)) total = (total || 0) + coinAmount(c);
    }
    return total == null ? null : { amount: total };
}

/* Unissued reserve across both vaults: every unspent xWiniwa coin they hold (four lanes at V2). */
async function liveVaultReserveTotal() {
    let total = null;
    for (const address of VAULTS) {
        const coins = await minimaRpc(`coins address:${address} tokenid:${V9.xwiniwa}`);
        if (!Array.isArray(coins)) continue;
        for (const c of coins.filter((x) => !x.spent)) total = (total || 0) + coinAmount(c);
    }
    return total == null ? null : { amount: total };
}

/* The vault's unissued xWiniwa reserve: the largest unspent xWiniwa coin at the vault address. */
async function liveXwiniwaReserve(address) {
    const coins = await minimaRpc(`coins address:${address} tokenid:${V9.xwiniwa}`);
    if (!Array.isArray(coins)) return null;
    const c = coins.filter((x) => !x.spent).sort((a, b) => Number(b.tokenamount || b.amount) - Number(a.tokenamount || a.amount))[0];
    return c ? { coinid: up(c.coinid), amount: Number(c.tokenamount != null ? c.tokenamount : c.amount), created: Number(c.created) } : null;
}

// ------------------------------------------------------------------------------- scanner
function loadScan() {
    try { return JSON.parse(fs.readFileSync(SCAN_FILE, "utf8")); } catch (_) { return { lastBlock: null, vaultPool: null, faucetPool: null, events: [], hashes: {} }; }
}
function saveScan(scan) {
    try { fs.writeFileSync(SCAN_FILE, JSON.stringify(scan)); } catch (e) { console.warn("[test-dashboard] scan state not saved:", e.message); }
}

/* Every transaction in one block whose outputs touch the faucet or the vault, as events. */
async function eventsInBlock(blockNo, scan) {
    const block = await minimaRpc(`txpow block:${blockNo}`);
    const list = block && block.body && Array.isArray(block.body.txnlist) ? block.body.txnlist : [];
    const out = [];
    for (const txid of list) {
        const tx = await minimaRpc(`txpow txpowid:${txid}`);
        const outputs = tx && tx.body && tx.body.txn && Array.isArray(tx.body.txn.outputs) ? tx.body.txn.outputs : [];
        const inputs = tx && tx.body && tx.body.txn && Array.isArray(tx.body.txn.inputs) ? tx.body.txn.inputs : [];
        const t = block.header && block.header.timemilli ? new Date(Number(block.header.timemilli)).toISOString() : null;
        const faucetOut = outputs.find((o) => up(o.address) === K.faucet && up(o.tokenid) === K.winiwa);
        const vaultWiniwa = (list) => list.filter((o) => isVaultAddress(o.address) && up(o.tokenid) === K.winiwa);
        /* The covenant lets a transaction spend ONE lane, so a vault's pool change is simply what its
           pool coins held going in against what the new ones hold coming out. The lane id is read
           from the TRANSACTION's state, never from an output coin: an output in a txpow carries no
           state of its own (only inputs do), so keying on the coin's state read a partial burn as a
           burn of the whole pool. */
        const txLane = laneOfTxn(tx);
        const poolBefore = new Map(), poolAfter = new Map(), poolCoin = new Map();
        for (const c of vaultWiniwa(inputs)) poolBefore.set(up(c.address), (poolBefore.get(up(c.address)) || 0) + coinAmount(c));
        for (const c of vaultWiniwa(outputs)) { poolAfter.set(up(c.address), (poolAfter.get(up(c.address)) || 0) + coinAmount(c)); poolCoin.set(up(c.address), c); }
        if (faucetOut) {
            const pool = Number(faucetOut.tokenamount != null ? faucetOut.tokenamount : faucetOut.amount);
            const claimed = outputs.find((o) => up(o.address) !== K.faucet && up(o.tokenid) === K.winiwa);
            out.push({ type: "faucet", amount: V9.claimAmount, ccy: "Winiwa", block: blockNo, t, txpowid: txid, coinid: up(faucetOut.coinid), pool, address: claimed ? up(claimed.address) : null });
            scan.faucetPool = pool;
        }
        /* A block can carry a mint on one lane and a burn on another, in separate transactions, so
           each is measured on its own: what the vault's pool coins held going in against what the
           new ones hold coming out. A lane's first mint has no pool coin to spend (before 0); a burn
           that empties a lane creates none (after 0). Both are counted. */
        for (const key of new Set([...poolBefore.keys(), ...poolAfter.keys()])) {
            const before = poolBefore.get(key) || 0;
            const pool = poolAfter.get(key) || 0;
            const vaultOut = poolCoin.get(key) || vaultWiniwa(inputs).find((c) => up(c.address) === key);
            if (Math.abs(pool - before) > 1e-9) {
                const delta = pool - before;
                const other = outputs.find((o) => !isVaultAddress(o.address) && (up(o.tokenid) === K.xwiniwa || up(o.tokenid) === K.winiwa));
                out.push({ type: delta > 0 ? "mint_xwiniwa" : "burn_xwiniwa", lane: txLane, amount: Math.abs(delta), ccy: "xWiniwa", block: blockNo, t, txpowid: txid, coinid: up(vaultOut.coinid), pool, address: other ? up(other.address) : null });
            }
            if (up(vaultOut.address) === K.vault) scan.vaultPool = pool;
        }
    }
    return out;
}

let scanning = false;
async function scanForward(maxBlocks) {
    if (scanning) return;
    scanning = true;
    try {
        const scan = loadScan();
        const tip = await liveTip();
        if (tip == null) return;
        if (scan.lastBlock == null) {
            /* First run: start a little before the archive's reach ends, so the two sources
               overlap and nothing falls between them; older history is the archive's job. */
            scan.lastBlock = Math.max(V9.firstBlock, tip - 2600);
            scan.vaultPool = null; scan.faucetPool = null;
        }
        const to = Math.min(tip, scan.lastBlock + maxBlocks);
        for (let b = scan.lastBlock + 1; b <= to; b++) {
            const evs = await eventsInBlock(b, scan);
            evs.forEach((e) => { if (!scan.events.some((x) => x.txpowid === e.txpowid)) scan.events.push(e); scan.hashes[e.coinid] = e.txpowid; });
            scan.lastBlock = b;
        }
        if (scan.events.length > 5000) scan.events = scan.events.slice(-5000);
        saveScan(scan);
        if (to < tip) console.log(`[test-dashboard] scanned to ${to}, tip ${tip}, ${tip - to} to go`);
    } catch (e) {
        console.warn("[test-dashboard] scan failed:", e.message);
    } finally {
        scanning = false;
    }
}

let scannerTimer = null;
function startTestDashboardScanner() {
    if (scannerTimer) return;
    scanForward(SCAN_BLOCKS_PER_TICK);
    scannerTimer = setInterval(() => scanForward(SCAN_BLOCKS_PER_TICK), SCAN_TICK_MS);
    scannerTimer.unref && scannerTimer.unref();
}

/* The hash of the transaction that created a coin at a block: read the block, match the output.
   Resolved once and kept on disk (archive events do not carry it). */
async function hashForCoin(scan, coinid, blockNo) {
    const key = up(coinid);
    if (scan.hashes[key]) return scan.hashes[key];
    if (!blockNo) return null;
    const block = await minimaRpc(`txpow block:${blockNo}`);
    const list = block && block.body && Array.isArray(block.body.txnlist) ? block.body.txnlist : [];
    for (const txid of list) {
        const tx = await minimaRpc(`txpow txpowid:${txid}`);
        const outputs = tx && tx.body && tx.body.txn && Array.isArray(tx.body.txn.outputs) ? tx.body.txn.outputs : [];
        if (outputs.some((o) => up(o.coinid) === key)) { scan.hashes[key] = txid; return txid; }
    }
    scan.hashes[key] = null;      // looked, not found: do not look again
    return null;
}

// ------------------------------------------------------------------------------- archive
function archiveDateToIso(s) {
    const m = String(s || "").match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
    if (!m) return null;
    return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +m[6])).toISOString();
}

async function coinHistory(pool, address, tokenid) {
    const [rows] = await pool.query(
        `SELECT c.coinid, c.tokenamount, c.spent, c.blockcreated, c.blockspent, c.date
           FROM minima_archive.coins c
           JOIN (SELECT coinid, MAX(mmrentrynumber) AS maxmmr FROM minima_archive.coins
                  WHERE address = ? AND tokenid = ? GROUP BY coinid) m
             ON m.coinid = c.coinid AND m.maxmmr = c.mmrentrynumber
          WHERE c.address = ? AND c.tokenid = ?
          ORDER BY c.blockcreated ASC, c.coinid ASC`,
        [address, tokenid, address, tokenid]
    );
    return rows;
}

async function creationDates(pool, address, tokenid) {
    const [rows] = await pool.query(
        `SELECT coinid, MIN(date) AS created FROM minima_archive.coins WHERE address = ? AND tokenid = ? GROUP BY coinid`,
        [address, tokenid]
    );
    const out = new Map();
    rows.forEach((r) => out.set(r.coinid, r.created));
    return out;
}

async function unspentByAddress(pool, tokenid) {
    const [rows] = await pool.query(
        `SELECT c.address, SUM(c.tokenamount) AS amount, COUNT(*) AS coins
           FROM minima_archive.coins c
           JOIN (SELECT coinid, MAX(mmrentrynumber) AS maxmmr FROM minima_archive.coins WHERE tokenid = ? GROUP BY coinid) m
             ON m.coinid = c.coinid AND m.maxmmr = c.mmrentrynumber
          WHERE c.tokenid = ? AND c.spent = 0
          GROUP BY c.address`,
        [tokenid, tokenid]
    );
    return rows;
}

async function latestArchiveBlock(pool) {
    const [rows] = await pool.query("SELECT block, timemilli FROM minima_archive.syncblock ORDER BY block DESC LIMIT 1");
    return rows[0] ? { block: Number(rows[0].block), timemilli: Number(rows[0].timemilli) } : { block: null, timemilli: null };
}

function isSystem(address) { return SYSTEM_ADDRESSES.has(up(address)); }

// ------------------------------------------------------------------------------- snapshot
async function buildSnapshot(pool) {
    const [faucetCoins, faucetDates, vaultCoins, vaultDates, winiwaHeld, xwiniwaHeld, archive, tip, liveFaucet, liveVault, liveReserve] = await Promise.all([
        coinHistory(pool, V9.faucet, V9.winiwa),
        creationDates(pool, V9.faucet, V9.winiwa),
        coinHistory(pool, V9.vault, V9.winiwa),
        creationDates(pool, V9.vault, V9.winiwa),
        unspentByAddress(pool, V9.winiwa),
        unspentByAddress(pool, V9.xwiniwa),
        latestArchiveBlock(pool),
        liveTip(),
        liveWiniwaCoin(V9.faucet),
        liveVaultPoolTotal(),
        liveVaultReserveTotal().catch(() => null)
    ]);
    const scan = loadScan();

    // Archive events (the long history), keyed by the new pool coin.
    const archiveEvents = [];
    for (let i = 1; i < vaultCoins.length; i++) {
        const before = Number(vaultCoins[i - 1].tokenamount), after = Number(vaultCoins[i].tokenamount);
        const delta = after - before;
        if (Math.abs(delta) < 1e-9) continue;
        archiveEvents.push({ type: delta > 0 ? "mint_xwiniwa" : "burn_xwiniwa", amount: Math.abs(delta), ccy: "xWiniwa", block: Number(vaultCoins[i].blockcreated), t: archiveDateToIso(vaultDates.get(vaultCoins[i].coinid)), coinid: up(vaultCoins[i].coinid), pool: after, source: "archive" });
    }
    for (let i = 1; i < faucetCoins.length; i++) {
        archiveEvents.push({ type: "faucet", amount: V9.claimAmount, ccy: "Winiwa", block: Number(faucetCoins[i].blockcreated), t: archiveDateToIso(faucetDates.get(faucetCoins[i].coinid)), coinid: up(faucetCoins[i].coinid), pool: Number(faucetCoins[i].tokenamount), source: "archive" });
    }

    // Node events (the last day and more, with hashes), merged by coin id.
    const byCoin = new Map();
    archiveEvents.forEach((e) => byCoin.set(e.coinid, e));
    (scan.events || []).forEach((e) => byCoin.set(e.coinid, Object.assign({}, byCoin.get(e.coinid) || {}, e, { source: byCoin.has(e.coinid) ? "both" : "node" })));
    const events = Array.from(byCoin.values()).sort((a, b) => b.block - a.block);

    // Hashes for the events shown, resolved once each.
    const shown = events.slice(0, 12);
    const mapEvent = (e) => ({ type: e.type, amount: e.amount, ccy: e.ccy, block: e.block, t: e.t, txpowid: e.txpowid || null, source: e.source });
    let hashesAdded = false;
    for (const e of shown) {
        if (!e.txpowid) {
            const before = scan.hashes[e.coinid];
            e.txpowid = await hashForCoin(scan, e.coinid, e.block);
            if (scan.hashes[e.coinid] !== before) hashesAdded = true;
        }
    }
    if (hashesAdded) saveScan(scan);

    const claims = events.filter((e) => e.type === "faucet").length;
    const mints = events.filter((e) => e.type === "mint_xwiniwa").length;
    const burns = events.filter((e) => e.type === "burn_xwiniwa").length;

    // Current pools: the node now, else the newest event, else the archive.
    const poolNow = liveFaucet ? liveFaucet.amount : (events.find((e) => e.type === "faucet") || {}).pool;
    const vaultPool = liveVault ? liveVault.amount : (events.find((e) => e.type !== "faucet") || {}).pool;
    const distributed = poolNow != null ? Math.max(0, V9.faucetSeed - poolNow) : null;
    const claimsByPool = poolNow != null ? Math.round((V9.faucetSeed - poolNow) / V9.claimAmount) : null;

    // Holders: the archive's unspent balances, custody excluded by list and by size.
    const CUSTODY_MIN = 1000000;
    const isCustody = (r) => isSystem(r.address) || Number(r.amount) >= CUSTODY_MIN;
    const winiwaHolders = winiwaHeld.filter((r) => !isCustody(r) && Number(r.amount) > 0);
    const xwiniwaHolders = xwiniwaHeld.filter((r) => !isCustody(r) && Number(r.amount) > 0);
    const xwiniwaOutsideCustody = xwiniwaHolders.reduce((s, r) => s + Number(r.amount), 0);

    // Daily history, last 14 days, from every event we know.
    const byDay = new Map();
    events.forEach((a) => {
        if (!a.t) return;
        const day = a.t.slice(0, 10);
        const d = byDay.get(day) || { claims: 0, mints: 0, burns: 0 };
        if (a.type === "faucet") d.claims++; else if (a.type === "mint_xwiniwa") d.mints++; else d.burns++;
        byDay.set(day, d);
    });
    const history = [];
    for (let i = 13; i >= 0; i--) {
        const day = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
        const d = byDay.get(day) || { claims: 0, mints: 0, burns: 0 };
        history.push({ t: day + "T00:00:00Z", claims: d.claims, mints: d.mints, burns: d.burns });
    }
    const last7 = history.slice(-7);
    const successfulActions7d = last7.reduce((s, d) => s + d.claims + d.mints + d.burns, 0);
    const sevenDaysAgoBlock = archive.block != null ? archive.block - 12096 : null;
    let activeRecipients7d = null;
    if (sevenDaysAgoBlock != null) {
        const [rows] = await pool.query(`SELECT DISTINCT address FROM minima_archive.coins WHERE tokenid IN (?, ?) AND blockcreated >= ?`, [V9.winiwa, V9.xwiniwa, sevenDaysAgoBlock]);
        activeRecipients7d = rows.filter((r) => !isSystem(r.address)).length;
    }
    const holderAddresses = new Set([...winiwaHolders, ...xwiniwaHolders].map((r) => up(r.address))).size;

    return {
        outcomes: { successful_actions_7d: successfulActions7d, active_recipient_addresses_7d: activeRecipients7d, holder_addresses: holderAddresses },
        schema: "stables.test-channel-monitor.snapshot.v3",
        mode: "live",
        generated: new Date().toISOString(),
        network: "Minima mainnet",
        channel: "Test",
        block: tip != null ? tip : archive.block,
        archive_block: archive.block,
        archive_behind: (tip != null && archive.block != null) ? Math.max(0, tip - archive.block) : null,
        archive_time: archive.timemilli ? new Date(archive.timemilli).toISOString() : null,
        node_scanned_to: scan.lastBlock,
        node_events: (scan.events || []).length,
        winiwa_usd: null,
        scope: { usdw: false, coverage: false, leverage: false, note: "USDw, coverage and leverage are not part of this test (Council decision TV81-D23). Winiwa and xWiniwa are valueless test tokens." },
        assets_usd: null, liabilities_usd: null, cr: null, leverage: null, usdw_circulating: null,
        faucet_pool_winiwa: poolNow,
        faucet_initial_winiwa: V9.faucetSeed,
        winiwa_distributed: distributed,
        faucet_claims: claimsByPool != null ? claimsByPool : claims,
        faucet_claims_listed: claims,
        xwiniwa_circulating: vaultPool,
        xwiniwa_outside_custody: xwiniwaOutsideCustody,
        xwiniwa_vault_pool_winiwa: vaultPool,
        xwiniwa_vault_reserve: liveReserve ? liveReserve.amount : null,
        xwiniwa_vault_reserve_seed: 104000000,
        supply: { winiwa: 1000000000, xwiniwa: 1000000000 },
        onchain: { winiwa_token: V9.winiwa, xwiniwa_token: V9.xwiniwa, faucet_covenant: V9.faucet, vault_covenant: V9.vault, vault_covenant_v2: V9.vaultV2, vault_v2_lanes: V9.vaultV2Lanes },
        tx_total: (claimsByPool != null ? claimsByPool : claims) + mints + burns,
        holders: { usdw: null, xwiniwa: xwiniwaHolders.length, winiwa: winiwaHolders.length },
        breakdown: { faucet: claimsByPool != null ? claimsByPool : claims, mint_usdw: null, burn_usdw: null, mint_xwiniwa: mints, burn_xwiniwa: burns },
        history,
        activity: shown.map(mapEvent),
        activity_total: events.length,
        // Every event since the start, for ?activity=all (hashes only where already resolved).
        activity_all: events.map(mapEvent),
        explorer_tx_base: "https://explorer.minima.global/search?q=",
        sources: { archive: "minima_archive.coins, canonical row per coin (max mmrentrynumber); archive lags the tip by the cascade window", node: "txpow block:N and coins address: on the Council node, scanned forward and kept on disk", faucet: V9.faucet, vault: V9.vault, winiwa: V9.winiwa, xwiniwa: V9.xwiniwa, system_addresses_excluded: SYSTEM_ADDRESSES.size }
    };
}

/* getPool() -> mysql2 pool or null. The tip is read here from the node directly. */
/* opts.activityAll: answer with every event since the start instead of the latest twelve; the
   public 30 s response stays small, the full list is sent only when a page asks for it. */
async function testDashboardSnapshot(getPool, _fetchTip, opts) {
    let full;
    if (cache.body && (Date.now() - cache.at) < CACHE_MS) full = cache.body;
    else {
        const pool = getPool();
        if (!pool) throw new Error("archive database not configured");
        full = await buildSnapshot(pool);
        cache = { at: Date.now(), body: full };
    }
    const { activity_all, ...body } = full;
    if (opts && opts.activityAll) return Object.assign({}, body, { activity: activity_all });
    return body;
}

module.exports = { testDashboardSnapshot, startTestDashboardScanner, V9, SYSTEM_ADDRESSES };
