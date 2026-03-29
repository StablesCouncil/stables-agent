# Deploy web agent tonight (minimal steps)

You only do this **once** to configure SSH, then one command after each code change.

## One-time setup (5 minutes)

1. Install **OpenSSH Client** on Windows if needed: *Settings → Apps → Optional features → OpenSSH Client*.

2. In this folder (`task_x_agent_node`), copy **`deploy.local.ps1.example`** → **`deploy.local.ps1`**.

3. Edit **`deploy.local.ps1`** with your real server user, host, path to `web_agent.js` on the server, and the same restart command you already use (`pm2 restart …` or `systemctl restart …`).

4. Test SSH once: `ssh YOUR_USER@YOUR_SERVER` (accept host key).

## Every deploy (when you’re tired — this is the whole thing)

From PowerShell:

```powershell
cd "C:\Users\Charles\Documents\Stables\1_development\stream_3_governance\task_x_agent_node"
.\scripts\Deploy-WebAgent.ps1
```

Optional: also commit + push `web_agent.js` from the repo root in the same run:

```powershell
.\scripts\Deploy-WebAgent.ps1 -GitPush -Message "agent: feedback API"
```

## If you don’t want SCP

Push your repo, SSH in, `cd` to the agent folder, `git pull`, run your restart command. The script is only there to save you typing.

## Smoke test

```text
https://agent.stablescouncil.org/health
```

Then submit once from the MiniDapp Feedback page, or use `tools/example_payload.json` with `curl` against `https://agent.stablescouncil.org/api/feedback` (see main feedback ledger README).
