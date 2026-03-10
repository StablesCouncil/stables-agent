const fs = require('fs');
const path = require('path');

const dir = __dirname;
const outputFile = path.join(dir, 'llms.txt');

console.log("🛠️ Building 'llms.txt' for external AIs...");

const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md');

let combinedContent = "# Stables Council Knowledge Base\n";
combinedContent += "> This file is generated for external AI models (like ChatGPT, Claude) to ingest the complete public knowledge base of the Stables ecosystem from a single URL.\n\n";

for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    combinedContent += `\n\n========================================\n`;
    combinedContent += `## SOURCE FILE: ${file}\n`;
    combinedContent += `========================================\n\n`;
    combinedContent += content;
    console.log(`- Added: ${file}`);
}

fs.writeFileSync(outputFile, combinedContent, 'utf-8');
console.log(`\n✅ Success! llms.txt generated at: ${outputFile}\n`);
console.log(`💡 Once you upload this folder to GitHub, you will be able to paste the raw URL of 'llms.txt' into ChatGPT, and it will instantly memorize everything about Stables!`);
