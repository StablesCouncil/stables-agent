# `stream_1_app` — MiniDapp + public site (dev)

All **active** work for the app and the **stablescouncil.org** static site lives under **`1_development/stream_1_app/`**. **`2_current`** is updated only when **you** promote after ship (see **`0_handshake/handshake.md`** §1 **Publication parity**).

## Folder map (aligns with live URLs and handshake)

| Path | Role | Parity |
|------|------|--------|
| **`task_stablescouncil_github_io/`** | Pages sandbox: **`webpages/pages/`**, **`static/`**, **`tools/sync-site.mjs`**, built **`site/`** | **`site/`** contents = GitHub Pages **root** after ship. Run **`npm run sync:site`** from this folder. |
| **`dapp/`** | Public **`/dapp/`** mirror (same paths as **`https://stablescouncil.org/dapp/`**) | Root **`dapp.conf`**, **`assets/`**, **`1-showcase/`**, **`2-demo/`**, **`3-test/`**, **`4-prod/`**. Current showcase zip: **`1-showcase/latest-version/`**. Older showcase **`.mds.zip`** files: **`3_archive/stream_1_app/task_archived_dapp_showcase_previous_mds_2026-04-16/`**. Retired **previous-versions** docs: **`3_archive/stream_1_app/task_archived_dapp_channel_previous_versions_2026-04-16/dapp/`** (not in active **`dapp/`**). **Parity READMEs:** **`2_current/stream_1_app/dapp/`**, **`3_archive/stream_1_app/dapp/`**. Copied into **`task_stablescouncil_github_io/site/dapp/`** on sync. |
| **`dapp/`** ( **`1-showcase/`** + root **`assets/`**, **`dapp.conf`** ) | Showcase **channel** + Pages **`/dapp/1-showcase/`** + hub **`.mds.zip`** (staging recipe **`dapp/build/README.md`**) | Author here; log user-visible work in **`dapp/CHANGELOG.md`**. Former **`prod_stables_app_v00.00.00.00.03/`** moved to **`3_archive/stream_1_app/task_archived_prod_stables_app_v00_00_00_00_03_2026-04-15/`** ( **`FROZEN.md`** ). |
| **`dapp/2-demo/`** | Demo **channel** (default new feature work + **`/dapp/2-demo/`** shell) | Author here; log in **`dapp/2-demo/CHANGELOG.md`**. Demo **`.mds.zip`**: **`dapp/2-demo/build/README.md`**. Former **`prod_stables_app_demo/`** moved to **`3_archive/stream_1_app/task_archived_prod_stables_app_demo_2026-04-15/`** ( **`FROZEN.md`** ). |
| **`dapp/3-test/`**, **`dapp/4-prod/`** | **Test** and **prod** channel placeholders on Pages until those lines ship | **`dapp/3-test/CHANGELOG.md`**, **`dapp/4-prod/CHANGELOG.md`**. |
| **`ui_inventory/`** | UI ↔ docs parity | See **`app_ui_inventory.md`**. |

## Ship demo + Pages mirror

Edit **`dapp/2-demo/`** in place. Then **`cd`** **`task_stablescouncil_github_io`** and **`npm run sync:site`** so **`site/dapp/2-demo/`** matches.

## Doc index

- **`handover_document.md`** (repo root): ship checklist, **`C:\`** paths, archive clone.
- **`0_handshake/minidapp_version.md`**: versions, routing, **`dapp/MINIDAPP_VERSIONING.md`** pointer.
- **`dapp/PORTING_GAP.md`**: one-file **lead vs downstream** gap tracker (prod → test → demo → showcase); use when you want a single place to record what still needs porting.
- **`dapp/README.md`**: short reminder for this tree.
