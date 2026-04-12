# Archived nested checkout: `stablescouncil.github.io`

**Moved here (2026-04-12)** from the Stables monorepo root per handshake **no permanent deletion**: full **`StablesCouncil/stablescouncil.github.io`** working tree. The nested repository directory is stored as **`_embedded_git/`** (not **`.git`**) so the parent Stables repo can commit every object as normal files instead of recording a submodule gitlink.

**Purpose:** Keep a recoverable **git** remote for the public Pages site without maintaining a second tree at **`C:\Users\Charles\Documents\Stables\stablescouncil.github.io`**.

**Active edits** happen only under:

`1_development/stream_1_app/task_stablescouncil_github_io/`

**Push example (PowerShell, adjust drive if needed):** use **`--git-dir`** / **`--work-tree`** because metadata lives in **`_embedded_git`**.

```powershell
$repo = "C:\Users\Charles\Documents\Stables\3_archive\stream_1_app\task_archived_nested_repo_stablescouncil_github_io_2026-04-12\stablescouncil.github.io"
$gd = Join-Path $repo "_embedded_git"
git --git-dir=$gd --work-tree=$repo status
git --git-dir=$gd --work-tree=$repo pull
# copy changed files from task_stablescouncil_github_io into $repo, then:
git --git-dir=$gd --work-tree=$repo add -A
git --git-dir=$gd --work-tree=$repo commit -m "Your message"
git --git-dir=$gd --work-tree=$repo push origin main
```

**Optional:** if you prefer the usual layout, rename **`_embedded_git`** to **`.git`** inside **`stablescouncil.github.io/`** on a machine that does not need this tree inside the Stables monorepo (for example after copying the folder elsewhere). Do not rename it back while this path stays inside the parent repo, or Git will treat it as an embedded repository again.

See **`handover_document.md`** in the monorepo root for the branding rollout and ship checklist.
