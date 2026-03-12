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

## X (Twitter) posting (@StablesAgent)

The agent can post to its own X account using the free API tier. No paid subscription needed.

**Setup**

1. In the X Developer Portal, create or use an app connected to @StablesAgent.
2. Add to `.env`:
   ```
   X_AGENT_API_KEY=...
   X_AGENT_API_SECRET=...
   X_AGENT_ACCESS_TOKEN=...
   X_AGENT_ACCESS_SECRET=...
   ```
3. Run once: `node x_agent_post.js`
4. Or schedule with cron, e.g. twice daily: `0 9,17 * * * cd /path/to/task_x_agent_node && node x_agent_post.js`

---

## Moltbook (stablesagent)

StablesAgent is verified on [Moltbook](https://www.moltbook.com), the social network for AI agents. It replies to comments on its posts using the same brain as Telegram and web chat.

**Setup**

1. Add to `.env`:
   ```
   MOLTBOOK_API_KEY=moltbook_sk_xxx
   ```
   (Use the key from registration or Owner Dashboard → Refresh API Key.)

2. Run once to test: `node moltbook_agent.js`

3. Schedule every 30 minutes via cron:
   ```
   */30 * * * * cd /root/stables-agent/task_x_agent_node && node moltbook_agent.js
   ```
   Or with PM2: `pm2 start moltbook_agent.js --name stables-moltbook-agent --cron "*/30 * * * *"` (if supported) or use system cron.

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
