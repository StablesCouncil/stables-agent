/**
 * Build ./site/ (full public tree) from:
 *   - ./webpages/pages/<slug>/
 *   - ../dapp/ (MiniDapp: same tree as https://stablescouncil.org/dapp/ — lives beside this task folder under stream_1_app/dapp/)
 *   - ./static/ (stables.css, assets/, brand/, CNAME, …)
 * Nothing is written to the task folder root. Ship: copy ./site/* to the Pages repo root.
 *   npm run sync:site
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STREAM1_APP = path.join(ROOT, "..");
const DAPP_SRC = path.join(STREAM1_APP, "dapp");
const WP = path.join(ROOT, "webpages");
const STATIC = path.join(ROOT, "static");
const SITE = path.join(ROOT, "site");

const FILE_MAP = [
  ["pages/index/index.html", "index.html"],
  ["pages/links/index.html", "links.html"],
  ["pages/playing_field/index.html", "playing_field.html"],
  ["pages/qr-code/index.html", "qr-code.html"],
  ["pages/ambassadorsprogramdesc/index.html", "ambassadorsprogramdesc.html"],
];

const DIR_MAP = [
  ["pages/circulareconomy", "circulareconomy"],
  ["pages/bankingsystem", "bankingsystem"],
  ["pages/minima-archive", "minima-archive"],
];

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dest) {
  rmrf(dest);
  fs.cpSync(src, dest, { recursive: true });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function clearSiteExceptReadme() {
  if (!fs.existsSync(SITE)) {
    ensureDir(SITE);
    return;
  }
  const trackedReadme = path.join(SITE, "README.md");
  let readmeBuf = null;
  if (fs.existsSync(trackedReadme)) {
    readmeBuf = fs.readFileSync(trackedReadme);
  }
  for (const ent of fs.readdirSync(SITE, { withFileTypes: true })) {
    const p = path.join(SITE, ent.name);
    if (ent.name === "README.md") continue;
    rmrf(p);
  }
  if (readmeBuf) {
    fs.writeFileSync(trackedReadme, readmeBuf);
  }
}

function copyStaticIntoSite() {
  if (!fs.existsSync(STATIC)) {
    console.error("Missing ./static folder (stables.css, assets/, brand/, …).");
    process.exit(1);
  }
  for (const name of fs.readdirSync(STATIC)) {
    if (name === "README.md") continue; /* dev-only; do not ship to site root */
    const src = path.join(STATIC, name);
    const dest = path.join(SITE, name);
    const st = fs.statSync(src);
    if (st.isDirectory()) {
      copyDir(src, dest);
      console.log("static -> site", name, "/");
    } else {
      copyFile(src, dest);
      console.log("static -> site", name);
    }
  }
}

function main() {
  if (!fs.existsSync(WP)) {
    console.error("Missing ./webpages folder.");
    process.exit(1);
  }

  ensureDir(SITE);
  clearSiteExceptReadme();
  copyStaticIntoSite();

  for (const [fromRel, toRel] of FILE_MAP) {
    const src = path.join(WP, fromRel);
    const dest = path.join(SITE, toRel);
    if (!fs.existsSync(src)) {
      console.error("Missing source file:", path.relative(ROOT, src));
      process.exit(1);
    }
    copyFile(src, dest);
    console.log("copy", path.relative(ROOT, src), "->", path.relative(ROOT, dest));
  }

  for (const [fromRel, toRel] of DIR_MAP) {
    const src = path.join(WP, fromRel);
    const dest = path.join(SITE, toRel);
    if (!fs.existsSync(src)) {
      console.error("Missing source dir:", path.relative(ROOT, src));
      process.exit(1);
    }
    copyDir(src, dest);
    console.log("copy dir", path.relative(ROOT, src), "->", path.relative(ROOT, dest));
  }

  const dappDest = path.join(SITE, "dapp");
  if (!fs.existsSync(DAPP_SRC)) {
    console.error("Missing MiniDapp source dir (mirror of live /dapp/):", DAPP_SRC);
    process.exit(1);
  }
  copyDir(DAPP_SRC, dappDest);
  console.log("copy dir", path.relative(ROOT, DAPP_SRC), "->", path.relative(ROOT, dappDest));

  console.log("\nsync-site: OK (output is ./site/ only)");
}

main();
