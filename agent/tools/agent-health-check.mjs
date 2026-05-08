#!/usr/bin/env node
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";

const execFileAsync = promisify(execFile);

const DEFAULT_HOST = process.env.STABLES_AGENT_SSH_HOST || "linuxuser@70.34.244.170";
const LOCAL_MODE = process.env.STABLES_AGENT_HEALTH_LOCAL === "1" ||
  (!process.env.STABLES_AGENT_SSH_HOST && fs.existsSync("/home/linuxuser/stables-agent/task_x_agent_node"));
const ARCHIVE_META_URL = process.env.STABLES_ARCHIVE_META_URL || "https://agent.stablescouncil.org/api/devtools/archive-meta";
const HOLDINGS_URL = process.env.STABLES_HOLDINGS_URL || "https://agent.stablescouncil.org/api/devtools/minima-holdings?address=0x4AD25252814256BEDDF7EA6F0CF75E48FC10E8D11FE3FC70551BB427A2BBA84A&range=30d";
const MAX_BLOCK_BEHIND = Number(process.env.STABLES_MAX_BLOCK_BEHIND || 5000);
const TELEGRAM_POLLING_WARN = Number(process.env.STABLES_TELEGRAM_POLLING_WARN || 12);
const EMPTY_COMPLETION_WARN = Number(process.env.STABLES_EMPTY_COMPLETION_WARN || 3);

const checks = [];
let pm2Processes = [];

function addCheck(name, status, details) {
  checks.push({ name, status, details });
}

function statusRank(status) {
  return { OK: 0, WARN: 1, FAIL: 2 }[status] ?? 2;
}

async function run(command, args, options = {}) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    timeout: options.timeout ?? 30000,
    maxBuffer: options.maxBuffer ?? 1024 * 1024 * 8,
  });
  return `${stdout || ""}${stderr || ""}`;
}

async function ssh(remoteCommand, options = {}) {
  if (LOCAL_MODE) {
    return run("sh", ["-lc", remoteCommand], options);
  }
  return run("ssh", ["-o", "BatchMode=yes", "-o", "ConnectTimeout=20", DEFAULT_HOST, remoteCommand], options);
}

async function checkPm2() {
  const output = await ssh("pm2 jlist", { timeout: 30000, maxBuffer: 1024 * 1024 * 4 });
  const processes = JSON.parse(output);
  pm2Processes = processes;
  const expected = ["stables-telegram-agent", "stables-web-agent"];
  for (const name of expected) {
    const proc = processes.find((item) => item?.name === name);
    if (!proc) {
      addCheck(`PM2 ${name}`, "FAIL", "Process is missing from pm2.");
      continue;
    }
    const status = proc.pm2_env?.status;
    const restarts = proc.pm2_env?.restart_time ?? 0;
    const uptimeMs = Date.now() - (proc.pm2_env?.pm_uptime ?? Date.now());
    const details = `status=${status}, restarts=${restarts}, uptime=${Math.max(0, Math.round(uptimeMs / 1000))}s`;
    addCheck(`PM2 ${name}`, status === "online" ? "OK" : "FAIL", details);
  }
}

function shQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

async function checkLogs() {
  const webProc = pm2Processes.find((item) => item?.name === "stables-web-agent");
  const telegramProc = pm2Processes.find((item) => item?.name === "stables-telegram-agent");
  const webStartSec = Math.floor((webProc?.pm2_env?.pm_uptime ?? Date.now()) / 1000);
  const telegramStartSec = Math.floor((telegramProc?.pm2_env?.pm_uptime ?? Date.now()) / 1000);
  const webErrPath = webProc?.pm2_env?.pm_err_log_path || "/home/linuxuser/.pm2/logs/stables-web-agent-error.log";
  const telegramErrPath = telegramProc?.pm2_env?.pm_err_log_path || "/home/linuxuser/.pm2/logs/stables-telegram-agent-error.log";
  const webOutPath = webProc?.pm2_env?.pm_out_log_path || "/home/linuxuser/.pm2/logs/stables-web-agent-out.log";
  const telegramOutPath = telegramProc?.pm2_env?.pm_out_log_path || "/home/linuxuser/.pm2/logs/stables-telegram-agent-out.log";

  const logData = JSON.parse(await ssh(`node -e "const fs=require('fs'); const paths=${JSON.stringify([webErrPath, telegramErrPath, webOutPath, telegramOutPath]).replaceAll('"', '\\"')}; const out={}; for (const p of paths){try{const st=fs.statSync(p); out[p]={mtime:Math.floor(st.mtimeMs/1000), tail:fs.readFileSync(p,'utf8').split(/\\\\r?\\\\n/).slice(-180).join('\\\\n')};}catch(e){out[p]={mtime:0,tail:'',error:e.message};}} console.log(JSON.stringify(out));"`, { timeout: 30000, maxBuffer: 1024 * 1024 * 4 }));

  const webErr = logData[webErrPath] || { mtime: 0, tail: "" };
  const telegramErr = logData[telegramErrPath] || { mtime: 0, tail: "" };
  const webOut = logData[webOutPath] || { mtime: 0, tail: "" };
  const telegramOut = logData[telegramOutPath] || { mtime: 0, tail: "" };

  const webErrIsCurrent = webErr.mtime >= webStartSec;
  const telegramErrIsCurrent = telegramErr.mtime >= telegramStartSec;
  const emptyCompletions = webErrIsCurrent ? countMatches(webErr.tail, /Empty completion content/g) : 0;
  addCheck(
    "OpenRouter empty completions",
    emptyCompletions >= EMPTY_COMPLETION_WARN ? "WARN" : "OK",
    webErrIsCurrent
      ? `${emptyCompletions} empty completion errors since current web-agent start, warn threshold=${EMPTY_COMPLETION_WARN}.`
      : `0 errors since current web-agent start; error log mtime is older than process start.`
  );

  const pollingErrors = telegramErrIsCurrent ? countMatches(telegramErr.tail, /polling_error/g) : 0;
  addCheck(
    "Telegram polling errors",
    pollingErrors >= TELEGRAM_POLLING_WARN ? "WARN" : "OK",
    telegramErrIsCurrent
      ? `${pollingErrors} polling errors since current Telegram-agent start, warn threshold=${TELEGRAM_POLLING_WARN}.`
      : `0 errors since current Telegram-agent start; error log mtime is older than process start.`
  );

  const brainLoaded = /Brain Loaded/i.test(webOut.tail) && /Brain Loaded/i.test(telegramOut.tail);
  addCheck("Agent brain load", brainLoaded ? "OK" : "WARN", brainLoaded ? "Both recent logs include Brain Loaded." : "Brain Loaded marker missing from one recent log window.");
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return { response, text, json };
  } finally {
    clearTimeout(timer);
  }
}

async function checkArchiveMeta() {
  const { response, json, text } = await fetchJson(ARCHIVE_META_URL);
  if (!response.ok || !json?.ok) {
    addCheck("Archive metadata endpoint", "FAIL", `HTTP ${response.status}: ${text.slice(0, 160)}`);
    return;
  }
  const behind = Number(json.block_behind ?? 0);
  addCheck(
    "Minima DB lag",
    behind > MAX_BLOCK_BEHIND ? "WARN" : "OK",
    `block_behind=${behind}, latest_block=${json.latest_block}, block_db=${json.block_db}, warn threshold=${MAX_BLOCK_BEHIND}.`
  );
}

async function checkHoldingsEndpoint() {
  const { response, json, text } = await fetchJson(HOLDINGS_URL);
  if (!response.ok || !json) {
    addCheck("Holdings endpoint", "FAIL", `HTTP ${response.status}: ${text.slice(0, 160)}`);
    return;
  }
  const hasSeries = Array.isArray(json.points) || Array.isArray(json.series) || Array.isArray(json.data);
  const pointCount = json.points?.length ?? json.series?.length ?? json.data?.length ?? "unknown";
  addCheck("Holdings endpoint", hasSeries ? "OK" : "WARN", `HTTP ${response.status}, point_count=${pointCount}.`);
}

async function main() {
  console.log(`StablesAgent health check`);
  console.log(LOCAL_MODE ? "Mode: local server" : `SSH host: ${DEFAULT_HOST}`);
  console.log(`Archive meta: ${ARCHIVE_META_URL}`);
  console.log("");

  const tasks = [
    ["PM2", checkPm2],
    ["Logs", checkLogs],
    ["Archive metadata", checkArchiveMeta],
    ["Holdings endpoint", checkHoldingsEndpoint],
  ];

  for (const [label, fn] of tasks) {
    try {
      await fn();
    } catch (error) {
      addCheck(label, "FAIL", error?.message || String(error));
    }
  }

  const worst = checks.reduce((acc, check) => (statusRank(check.status) > statusRank(acc) ? check.status : acc), "OK");
  for (const check of checks) {
    console.log(`[${check.status}] ${check.name}: ${check.details}`);
  }
  console.log("");
  console.log(`Overall: ${worst}`);
  process.exitCode = worst === "FAIL" ? 1 : 0;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
