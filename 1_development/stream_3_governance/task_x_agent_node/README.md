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

## Discord pub radio (self-hosted DJ bot)

Optional 24/7 voice bot that loops a **YouTube playlist** (including `music.youtube.com` playlist URLs; `play-dl` normalises them). Use a **dedicated Discord bot user** (recommended: not the same application as Telegram or X). You can name the bot and avatar “DJ” or “StablesAgent” style in the Discord Developer Portal.

**Requirements**

- Node 18+ on the host (your Vultr box or any always-on machine).
- Bot invited with **Connect**, **Speak**, **View Channels**, **Use Voice Activity** (and **Send Messages** in the pub text channel if you enable now-playing posts).
- Environment variables (for example in the same `.env` you use for other agents, or a separate file loaded with `dotenv`):

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_DJ_TOKEN` | Yes | Bot token from the Discord Developer Portal. |
| `DISCORD_GUILD_ID` | Yes | Server (guild) snowflake ID. |
| `DISCORD_VOICE_CHANNEL_ID` | Yes | Voice (or stage) channel the bot should join and stay in. |
| `YOUTUBE_PLAYLIST_URL` | Yes | Full playlist URL with `list=...` (YouTube or YouTube Music). |
| `DISCORD_TEXT_CHANNEL_ID` | No | If set and `DISCORD_ANNOUNCE_NOW_PLAYING=true`, posts “now playing” lines. |
| `DISCORD_ANNOUNCE_NOW_PLAYING` | No | Default `false`. Set `true` to announce each track in text. |
| `DJ_SHUFFLE_PLAYLIST` | No | Default `false`. Set `true` to shuffle order after each full playlist load. |

**Run (foreground test)**

```bash
cd 1_development/stream_3_governance/task_x_agent_node
npm run discord-dj
```

**Run with PM2 (example)**

```bash
cd /root/stables-agent/task_x_agent_node
pm2 start discord_dj_bot.js --name stables-discord-dj
pm2 save
```

**Notes**

- Playback uses `play-dl` plus bundled `ffmpeg-static` when possible. If YouTube returns captcha or blocks the datacenter IP, you may need cookies or a different egress; see `play-dl` docs for `setToken` / YouTube cookie flows.
- This is for **your** playlist and **your** server; respect YouTube and Discord terms and only stream content you have rights to use in that context.

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

### Moltbook health check (for new sessions)

When a new AI session starts, or if Moltbook looks quiet:

1. Confirm keys exist in `1_development/stream_3_governance/task_stablesagent-brain-base/.env`:
   - `OPENROUTER_API_KEY=...`
   - `MOLTBOOK_API_KEY=...`
2. From the server in `task_x_agent_node`, run: `node moltbook_agent.js`
3. Interpret output:
   - `MOLTBOOK_API_KEY not set in .env` → add `MOLTBOOK_API_KEY` to the brain `.env`.
   - `No vector DB. Run ingest_knowledge.js first.` → from `task_x_agent_node`, run `node ingest_knowledge.js` then retry.
   - `Not claimed yet. Skipping.` → complete claim flow on Moltbook, then retry.

---

## Transparency

All interactions are logged anonymously (no names, no identifiers) in `interaction_logs.csv` for full community transparency.

---

## How it works

- **Knowledge retrieval**: Local Xenova embeddings search the official brain documents for the most relevant context.
- **Text generation**: OpenRouter API (Llama 3.1 8B or similar free model) generates the reply.
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
