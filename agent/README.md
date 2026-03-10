# StablesAgent

The official AI assistant for the Stables community. Built on Minima.

StablesAgent answers questions about how Stables works, its banking system, economic model, and philosophy. It runs on Telegram and is powered by a local knowledge base built from official Stables documents.

**Built on MINIMA**

---

## Use the knowledge base with any AI

You can feed the Stables knowledge base to any AI of your choice (ChatGPT, Grok, Claude, etc.) using this link:

```
https://raw.githubusercontent.com/StablesCouncil/stables-agent/main/brain/llms.txt
```

Paste that URL into your AI and ask it anything about Stables.

---

## Telegram bot

The agent is active on Telegram. You can talk to it directly:

- In any message to the community bot, mention `@StablesAgentBot` followed by your question.
- In a private conversation with `@StablesAgentBot`, just type your question directly.

---

## Transparency

All interactions are logged anonymously (no names, no identifiers) in `interaction_logs.csv` for full community transparency.

---

## How it works

- **Knowledge retrieval**: Local Xenova embeddings search the official brain documents for the most relevant context.
- **Text generation**: Groq API running `llama-3.3-70b-versatile` generates the reply in under 3 seconds.
- **Brain**: Markdown documents in the `brain/` folder are the single source of truth for the agent.

---

## Updating the knowledge base

When new content is published on `stablescouncil.github.io` or validated into `2_current`, the brain must be updated:

1. Edit or add markdown files in `brain/`.
2. Run `node ingest_knowledge.js` from `agent/` to rebuild the vector database and `llms.txt`.
3. Restart the agent: `pm2 restart stables-telegram-agent`.

---

Money that is truly yours. Secure, Pseudonymous and Unstoppable.

Built on MINIMA — [minima.global](https://minima.global)
