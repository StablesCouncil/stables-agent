/**
 * Minima holdings query UI — calls Council API when deployed.
 *
 * Expected GET (same-origin or STABLES_MINIMA_HOLDINGS_API):
 *   /api/devtools/minima-holdings?address=0x...&date_from=YYYY-MM-DD&date_to=YYYY-MM-DD&interval_type=DAY
 *
 * interval_type: DAY | WEEK | MONTH | QUARTER | YEAR
 * Omit date_from / date_to when range is "all" (server interprets full history).
 *
 * Optional preset list override (before this script):
 *   window.STABLES_MINIMA_HOLDINGS_PRESETS = [ { label: "…", address: "0x…" }, … ];
 *
 * JSON response (example):
 * {
 *   "address": "0x...",
 *   "block_live": 1234567,
 *   "block_db": 1234500,
 *   "db_refreshed_at": "2026-04-18T12:00:00.000Z",
 *   "series": [ { "x": "2026-04-01", "y": 1.23 }, ... ]
 * }
 *
 * Override API root: set window.STABLES_MINIMA_HOLDINGS_API before this file.
 */
(function () {
  var DEFAULT_PRESETS = [
    {
      label: "MEXC (hot)",
      address: "0x4AD25252814256BEDDF7EA6F0CF75E48FC10E8D11FE3FC70551BB427A2BBA84A",
    },
    {
      label: "Exchange 2 (replace in JS)",
      address:
        "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    },
    {
      label: "Exchange 3 (replace in JS)",
      address:
        "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    },
  ];

  function presets() {
    if (Array.isArray(window.STABLES_MINIMA_HOLDINGS_PRESETS)) {
      return window.STABLES_MINIMA_HOLDINGS_PRESETS;
    }
    return DEFAULT_PRESETS;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function apiBase() {
    if (typeof window.STABLES_MINIMA_HOLDINGS_API === "string" && window.STABLES_MINIMA_HOLDINGS_API.trim()) {
      return window.STABLES_MINIMA_HOLDINGS_API.replace(/\/$/, "");
    }
    return "";
  }

  function localYMD(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function getRangePresetValue() {
    var el = document.querySelector('input[name="holdings-range-preset"]:checked');
    return el ? el.value : "1m";
  }

  /** @returns {{ from: string, to: string } | { from: null, to: null } | null} */
  function computedRangeForPreset(mode) {
    if (mode === "all") return { from: null, to: null };
    if (mode === "custom") return null;
    var to = new Date();
    to.setHours(0, 0, 0, 0);
    var from = new Date(to);
    if (mode === "1y") from.setFullYear(from.getFullYear() - 1);
    else from.setMonth(from.getMonth() - 1);
    return { from: localYMD(from), to: localYMD(to) };
  }

  function applyRangePresetToFields() {
    var mode = getRangePresetValue();
    var df = document.getElementById("date-from");
    var dt = document.getElementById("date-to");
    if (!df || !dt) return;
    if (mode === "custom") {
      df.removeAttribute("readonly");
      dt.removeAttribute("readonly");
      if (!df.value && !dt.value) {
        var r = computedRangeForPreset("1m");
        if (r && r.from && r.to) {
          df.value = r.from;
          dt.value = r.to;
        }
      }
      return;
    }
    df.setAttribute("readonly", "readonly");
    dt.setAttribute("readonly", "readonly");
    if (mode === "all") {
      df.value = "";
      dt.value = "";
      return;
    }
    var range = computedRangeForPreset(mode);
    if (range && range.from && range.to) {
      df.value = range.from;
      dt.value = range.to;
    }
  }

  function buildQueryParams(address) {
    var q = { address: address.trim() };
    var intervalEl = document.getElementById("interval-type");
    q.interval_type = (intervalEl && intervalEl.value) || "DAY";
    var mode = getRangePresetValue();
    if (mode === "all") {
      return q;
    }
    if (mode === "custom") {
      var df = document.getElementById("date-from");
      var dt = document.getElementById("date-to");
      if (df && df.value) q.date_from = df.value;
      if (dt && dt.value) q.date_to = dt.value;
      return q;
    }
    var r = computedRangeForPreset(mode);
    if (r && r.from) q.date_from = r.from;
    if (r && r.to) q.date_to = r.to;
    return q;
  }

  function holdingsUrl(params) {
    var base = apiBase();
    var search = new URLSearchParams();
    Object.keys(params).forEach(function (k) {
      var v = params[k];
      if (v != null && v !== "") search.set(k, String(v));
    });
    var path = "/api/devtools/minima-holdings?" + search.toString();
    if (base) return base + path;
    try {
      return new URL(path, window.location.origin).toString();
    } catch (e) {
      return path;
    }
  }

  function normalizeSeries(raw) {
    if (!raw || !raw.series) return [];
    var s = raw.series;
    if (!Array.isArray(s)) return [];
    return s
      .map(function (p) {
        if (p == null) return null;
        if (typeof p.y === "number" && (typeof p.x === "string" || typeof p.x === "number")) {
          return { x: String(p.x), y: p.y };
        }
        if (typeof p.balance === "number" && p.block != null) {
          return { x: String(p.block), y: p.balance };
        }
        return null;
      })
      .filter(Boolean);
  }

  function demoSeries() {
    var out = [];
    var v = 1000;
    for (var i = 0; i < 36; i++) {
      v += (Math.random() - 0.45) * 40;
      out.push({ x: "W" + (i + 1), y: Math.max(0, Math.round(v * 100) / 100) });
    }
    return out;
  }

  var chartInstance = null;

  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  function renderChart(canvas, points, label) {
    destroyChart();
    if (!canvas || typeof Chart === "undefined") return;
    var labels = points.map(function (p) {
      return p.x;
    });
    var data = points.map(function (p) {
      return p.y;
    });
    var ctx = canvas.getContext("2d");
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: label || "Balance",
            data: data,
            borderColor: "rgba(103, 232, 249, 0.95)",
            backgroundColor: "rgba(103, 232, 249, 0.12)",
            fill: true,
            tension: 0.25,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#9fb0c0", font: { family: "Inter, system-ui, sans-serif" } },
          },
        },
        scales: {
          x: {
            ticks: { color: "#9fb0c0", maxRotation: 45, autoSkip: true, maxTicksLimit: 12 },
            grid: { color: "rgba(103,232,249,0.08)" },
          },
          y: {
            ticks: { color: "#9fb0c0" },
            grid: { color: "rgba(103,232,249,0.08)" },
          },
        },
      },
    });
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function fmtBlock(n) {
    if (n == null || n === "" || Number.isNaN(Number(n))) return "—";
    return String(n);
  }

  function setStatusBanner(el, kind, message) {
    if (!el) return;
    el.className = "devtools-holdings-status devtools-holdings-status--" + kind;
    el.textContent = message;
  }

  async function fetchHoldings(queryParams) {
    var url = holdingsUrl(queryParams);
    var ctrl = new AbortController();
    var t = setTimeout(function () {
      ctrl.abort();
    }, 12000);
    try {
      var r = await fetch(url, {
        method: "GET",
        signal: ctrl.signal,
        headers: { Accept: "application/json" },
        credentials: "omit",
      });
      clearTimeout(t);
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } catch (e) {
      clearTimeout(t);
      throw e;
    }
  }

  function metaSuffixFromForm() {
    var parts = [];
    var mode = getRangePresetValue();
    if (mode === "all") parts.push("range: all");
    else {
      var df = document.getElementById("date-from");
      var dt = document.getElementById("date-to");
      if (df && df.value) parts.push("from " + df.value);
      if (dt && dt.value) parts.push("to " + dt.value);
    }
    var iv = document.getElementById("interval-type");
    if (iv && iv.value) parts.push(iv.value);
    return parts.length ? parts.join(" · ") : "";
  }

  async function loadHoldings(address) {
    var canvas = document.getElementById("holdings-chart");
    var statusEl = document.getElementById("holdings-status");
    var btn = document.getElementById("run-query-btn");

    var queryParams = buildQueryParams(address);

    if (btn) {
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
    }
    setStatusBanner(statusEl, "loading", "Loading…");

    var usedDemo = false;
    var payload = null;

    try {
      payload = await fetchHoldings(queryParams);
    } catch (err) {
      usedDemo = true;
      payload = {
        address: address,
        block_live: null,
        block_db: null,
        db_refreshed_at: null,
        series: demoSeries(),
      };
    }

    var series = normalizeSeries(payload);
    if (!series.length && payload && Array.isArray(payload.series)) {
      series = demoSeries();
      usedDemo = true;
    }
    if (!series.length) {
      series = demoSeries();
      usedDemo = true;
    }

    setText("holdings-block-live", fmtBlock(payload.block_live));
    setText("holdings-block-db", fmtBlock(payload.block_db));

    var metaEl = document.getElementById("holdings-cache-meta");
    if (metaEl) {
      var extra = metaSuffixFromForm();
      if (usedDemo) {
        metaEl.textContent =
          "Demo series (API unreachable or empty). Deploy holdings API on origin or set STABLES_MINIMA_HOLDINGS_API." +
          (extra ? " Query: " + extra + "." : "");
      } else {
        var parts = [];
        if (payload.db_refreshed_at) parts.push("DB snapshot: " + payload.db_refreshed_at);
        if (payload.cache_ttl_seconds != null) parts.push("Cache TTL: " + payload.cache_ttl_seconds + "s");
        if (extra) parts.push(extra);
        metaEl.textContent = parts.length ? parts.join(" · ") : "Council API." + (extra ? " " + extra : "");
      }
    }

    var label = usedDemo ? "Demo balance (API offline)" : "Balance (cached)";
    renderChart(canvas, series, label);

    if (usedDemo) {
      setStatusBanner(statusEl, "warn", "Demo chart (API offline or empty).");
    } else {
      setStatusBanner(statusEl, "ok", "Loaded.");
    }

    window.__lastHoldingsPayload = payload;
    window.__lastHoldingsSeries = series;
    window.__lastHoldingsQuery = queryParams;

    if (btn) {
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
    }
  }

  function exportCsv() {
    var series = window.__lastHoldingsSeries;
    if (!series || !series.length) return;
    var rows = [["x", "y"].join(",")].concat(
      series.map(function (p) {
        return [JSON.stringify(p.x), p.y].join(",");
      })
    );
    var blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    var q = window.__lastHoldingsQuery || {};
    var name = "minima-holdings";
    if (q.date_from) name += "-" + q.date_from;
    if (q.date_to) name += "_" + q.date_to;
    if (q.interval_type) name += "-" + String(q.interval_type).toLowerCase();
    a.download = name + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function populatePresetSelect() {
    var sel = document.getElementById("minima-addr-preset");
    if (!sel) return;
    var list = presets();
    var opts = '<option value="">Custom…</option>';
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      if (!p || !p.address) continue;
      opts +=
        '<option value="' +
        escapeHtml(p.address) +
        '">' +
        escapeHtml(p.label || p.address.slice(0, 10) + "…") +
        "</option>";
    }
    sel.innerHTML = opts;
  }

  function syncPresetDropdownFromAddress(addr) {
    var sel = document.getElementById("minima-addr-preset");
    if (!sel) return;
    var normalized = addr.trim().toUpperCase();
    if (!normalized) {
      sel.value = "";
      return;
    }
    var list = presets();
    for (var i = 0; i < list.length; i++) {
      if (list[i].address && list[i].address.toUpperCase() === normalized) {
        sel.value = list[i].address;
        return;
      }
    }
    sel.value = "";
  }

  function wirePresetAndAddress() {
    var sel = document.getElementById("minima-addr-preset");
    var input = document.getElementById("minima-addr");
    if (sel && input) {
      sel.addEventListener("change", function () {
        if (sel.value) input.value = sel.value;
      });
      input.addEventListener("input", function () {
        syncPresetDropdownFromAddress(input.value);
      });
    }
  }

  function wireRangePresets() {
    var nodes = document.querySelectorAll('input[name="holdings-range-preset"]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener("change", applyRangePresetToFields);
    }
  }

  function init() {
    populatePresetSelect();
    wirePresetAndAddress();
    wireRangePresets();

    var addrInput = document.getElementById("minima-addr");
    var presetSel = document.getElementById("minima-addr-preset");
    var btn = document.getElementById("run-query-btn");
    var csvBtn = document.getElementById("export-csv-btn");

    var list = presets();
    if (presetSel && list.length && presetSel.options.length > 1) {
      presetSel.selectedIndex = 1;
      if (addrInput) addrInput.value = list[0].address;
    } else if (addrInput && !addrInput.value.trim() && list[0]) {
      addrInput.value = list[0].address;
    }

    applyRangePresetToFields();

    if (btn) {
      btn.addEventListener("click", function () {
        var a = addrInput ? addrInput.value.trim() : "";
        if (!a) return;
        loadHoldings(a);
      });
    }
    if (csvBtn) {
      csvBtn.addEventListener("click", exportCsv);
    }

    var initial = addrInput && addrInput.value.trim() ? addrInput.value.trim() : list[0] ? list[0].address : "";
    if (initial) loadHoldings(initial);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
