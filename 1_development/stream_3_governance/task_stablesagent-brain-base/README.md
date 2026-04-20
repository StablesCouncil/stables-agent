# StablesAgent Brain Base

## Overview
This repository contains the public **Knowledge Base** for the `@StablesAgentBot`. It serves as the single source of truth for the AI assistant running in the Stables ecosystem.

If a document or fact is not in this folder, the AI does not know it. This ensures complete control over what information is publicly disseminated and prevents the leaking of internal drafts or private working notes.

## Technical Architecture
The bot operates on a **100% Local, Private, and Cost-Free** Artificial Intelligence stack:
1. **Embeddings:** When these Markdown files are updated, `@xenova/transformers` (running locally via Node.js) converts the text into mathematical vectors (`vector_db.json`).
2. **Retrieval (RAG):** When a user asks a question on Telegram, the bot searches the Vector Database to find the most relevant paragraphs from this repository.
3. **Generation:** The context is fed into a local **Llama 3.2** model (via Ollama), which drafts a polite, concise reply based *strictly* on the retrieved text.

## Transparency & Logging
To maintain full transparency with the community:
- All interactions with the AI are logged anonymously into `interaction_logs.csv`. 
- No usernames or personal identifiers are stored. 
- The CSV file will be periodically pushed to this GitHub repository so anyone can review the questions being asked and verify the AI's responses.

## Files in this folder (quick index)

| File | Purpose |
|------|---------|
| **`core_definitions.md`** | Core terms and definitions. |
| **`comprehensive_knowledge_base.md`** | Long-form synthesis (protocol, philosophy, Academy, **website ship summary**). |
| **`github_pages_website_engineering.md`** | **Canonical ops doc** for the public site: folder layout, **`sync:site`**, ship steps, **`file://`** preview, pointers to **`handover_document.md`**. |
| **`website_button_hierarchy.md`** | **`btn-primary`** vs **`btn-secondary`** hierarchy for site and MiniDapp shell; points to **`web_component_spec.md`**. |
| **`council_minima_devtools.md`** | Public **Minima dev tools** URLs (`/devtools/`, archive + query subpages), links page rule (single Council row), site chrome expectations. |
| **`website_presentation.md`** | On-site marketing copy and StablesAgent / **`llms.txt`** links; points to the engineering doc for build and deploy. |
| **`charter_overview.md`**, **`banking_system_overview.md`**, **`circular_economy_diagram.md`** | Topic-specific public summaries. |

## Contribution
To correct an AI hallucination or update its knowledge, do **not** change the rigid prompt rules. Instead, update the Markdown files in this directory (such as `core_definitions.md`) with clearer, stronger facts and re-run the ingestion script.

## How to Use It (For Users)
There are two primary ways to interact with the Stables knowledge base:

### Option 1: The Telegram Bot 
You can interact with the official Stables assistant directly in the Stables community channel by tagging `@StablesAgentBot`. It uses the local Llama 3.2 pipeline (described above) to answer questions securely and privately based on this repository.

### Option 2: External AI Models (ChatGPT, Claude)
If you prefer to use your own LLM, we have formatted the entire knowledge base into a single, internet-standard file.
You can simply paste the following prompt into ChatGPT or Claude, providing the direct URL to our `llms.txt` file:

> *"Please read the official knowledge base at https://raw.githubusercontent.com/StablesCouncil/stables-agent/main/brain/llms.txt and answer the following question about Stables: [Your Question]"*

*(Note: The `llms.txt` file is auto-generated whenever the brain base is updated, ensuring ChatGPT always has the latest facts).*
