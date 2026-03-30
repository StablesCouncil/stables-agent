/**
 * POST /api/feedback — body: raw JSON (v1 feedback submission).
 * - Without GITHUB_TOKEN: writes to ../feedback/submissions/ (local test).
 * - With GITHUB_TOKEN + owner/repo env: creates file via GitHub Contents API.
 *
 * Env:
 *   FEEDBACK_SUBMIT_PORT (default 8788)
 *   GITHUB_TOKEN (optional)
 *   GITHUB_FEEDBACK_OWNER (default StablesCouncil)
 *   GITHUB_FEEDBACK_REPO (default StablesCouncil.github.io)
 *   GITHUB_FEEDBACK_PATH (default feedback/submissions)
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEDGER_ROOT = path.join(__dirname, '..');
const LOCAL_DIR = path.join(LEDGER_ROOT, 'feedback', 'submissions');
const PORT = parseInt(process.env.FEEDBACK_SUBMIT_PORT || '8788', 10);
const MAX_BODY = 120_000;

const GH_TOKEN = process.env.GITHUB_TOKEN || '';
const GH_OWNER = process.env.GITHUB_FEEDBACK_OWNER || 'StablesCouncil';
const GH_REPO = process.env.GITHUB_FEEDBACK_REPO || 'StablesCouncil.github.io';
const GH_PATH_PREFIX = (process.env.GITHUB_FEEDBACK_PATH || 'feedback/submissions').replace(/^\/+|\/+$/g, '');

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  });
  res.end(body);
}

function filenameFromPayload(parsed) {
  const slug = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const rnd = Math.random().toString(36).slice(2, 8);
  return `stables-feedback-${slug}-${rnd}.json`;
}

async function writeLocal(contentStr, fname) {
  await fs.promises.mkdir(LOCAL_DIR, { recursive: true });
  const fp = path.join(LOCAL_DIR, fname);
  await fs.promises.writeFile(fp, contentStr, 'utf8');
  return { storage: 'local', path: path.relative(LEDGER_ROOT, fp).replace(/\\/g, '/') };
}

async function writeGithub(contentStr, fname) {
  const apiPath = `${GH_PATH_PREFIX}/${fname}`;
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${apiPath}`;
  const content = Buffer.from(contentStr, 'utf8').toString('base64');
  const title = (() => {
    try {
      const j = JSON.parse(contentStr);
      return (j.title || 'feedback').slice(0, 72);
    } catch {
      return 'feedback';
    }
  })();
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `feedback: ${title}`,
      content
    })
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    const err = new Error(data.message || text || `GitHub ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return {
    storage: 'github',
    path: data.content?.path || apiPath,
    html_url: data.content?.html_url
  };
}

/** Path only, no query; strip trailing slash (match web_agent.js routing). */
function requestPath(url) {
  let p = (url && url.split('?')[0]) || '/';
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  const reqPath = requestPath(req.url);
  if (req.method !== 'POST' || reqPath !== '/api/feedback') {
    sendJson(res, 404, { ok: false, error: 'Not found' });
    return;
  }

  let raw = '';
  let size = 0;
  try {
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BODY) {
        sendJson(res, 413, { ok: false, error: 'Body too large' });
        return;
      }
      raw += chunk;
    }
  } catch {
    sendJson(res, 400, { ok: false, error: 'Read error' });
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    sendJson(res, 400, { ok: false, error: 'Invalid JSON' });
    return;
  }

  if (parsed.consent_public_ledger !== true) {
    sendJson(res, 400, { ok: false, error: 'consent_public_ledger must be true' });
    return;
  }

  const fname = filenameFromPayload(parsed);
  const pretty = JSON.stringify(parsed, null, 2);

  try {
    let result;
    if (GH_TOKEN) {
      result = await writeGithub(pretty, fname);
    } else {
      result = await writeLocal(pretty, fname);
    }
    sendJson(res, 200, {
      ok: true,
      id: fname,
      ...result
    });
  } catch (e) {
    console.error('[feedback_submit]', e);
    sendJson(res, e.status && e.status >= 400 && e.status < 600 ? e.status : 500, {
      ok: false,
      error: e.message || 'Write failed'
    });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Feedback submit server http://127.0.0.1:${PORT}/api/feedback`);
  console.log(GH_TOKEN ? `GitHub mode: ${GH_OWNER}/${GH_REPO}/${GH_PATH_PREFIX}/` : `Local mode: ${LOCAL_DIR}`);
});
