/**
 * Concatenate every *.md in this directory into llms.txt for external AIs
 * (same rollup shape as StablesCouncil/stables-agent brain/llms.txt).
 * Run from this folder: node build_llms_txt.js
 * Also invoked automatically by task_x_agent_node/ingest_knowledge.js when present.
 */
const fs = require("fs");
const path = require("path");

const HERE = __dirname;
const HEADER = `# Stables Council Knowledge Base
> This file is generated for external AI models (like ChatGPT, Claude) to ingest the complete public knowledge base of the Stables ecosystem from a single URL.

`;

function main() {
    const names = fs
        .readdirSync(HERE)
        .filter(
            (f) =>
                f.endsWith(".md") &&
                f.toLowerCase() !== "readme.md" &&
                fs.statSync(path.join(HERE, f)).isFile()
        )
        .sort((a, b) => a.localeCompare(b, "en"));

    if (names.length === 0) {
        console.error("No .md files found in", HERE);
        process.exit(1);
    }

    let body = "";
    for (const name of names) {
        const text = fs.readFileSync(path.join(HERE, name), "utf8");
        body += "\n\n========================================\n## SOURCE FILE: " + name + "\n========================================\n\n";
        body += text.replace(/\r\n/g, "\n");
    }

    const outPath = path.join(HERE, "llms.txt");
    fs.writeFileSync(outPath, HEADER + body, "utf8");
    console.log("Wrote", outPath, "from", names.length, "markdown sources:", names.join(", "));
}

main();
