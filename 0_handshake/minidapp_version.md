# MiniDapp version pointer (agents)

**Read this when touching MiniDapp code, zips, or `dapp.conf` / `runtime-config.js`.**

| | |
|--|--|
| **Active development** | `1_development/stream_1_app/prod_stables_app_v0.2.12/` |
| **Executable shell (CSS + pages)** | `prod_stables_app_v0.2.12/index.html` (`<style>` block) |
| **UI inventory** | `0_handshake/app_ui_inventory.md` (source path must match active folder) |
| **Frozen v0.2.11** | `3_archive/stream_1_app/prod_stables_app_v0.2.11/` |
| **Frozen v0.2.10** | `3_archive/stream_1_app/prod_stables_app_v0.2.10/` + zip `…/build/Stables_v0.2.10.mds.zip` |
| **Dev zip (v0.2.12)** | `prod_stables_app_v0.2.12/build/Stables.mds.zip` (and `Stables_v0.2.12.mds.zip`) |

**Rules**

- All agent edits go to **`prod_stables_app_v0.2.12`** until the next version bump.
- **`2_current`**: only the user promotes; agents do not move trees there without explicit approval.
- **Zip**: contents of the `prod_…` folder only — see `handshake.md` **Packaging Rule**.

**Last bumped**: 2026-03-30 (v0.2.11 → v0.2.12).
