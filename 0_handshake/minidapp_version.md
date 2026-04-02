# MiniDapp version pointer (agents)

**Read this when touching MiniDapp code, zips, or `dapp.conf` / `runtime-config.js`.**

| | |
|--|--|
| **Active development** | `1_development/stream_1_app/prod_stables_app_v00.00.02/` |
| **Declared release label (policy format)** | **`v00.00.02`** |
| **Channel** | **showcase** (for this current line) |
| **Executable shell (CSS + pages)** | `prod_stables_app_v00.00.02/index.html` (`<style>` block) |
| **Change log (comms / releases)** | `prod_stables_app_v00.00.02/CHANGELOG.md` — update with every user-visible or release-worthy change; copy sections into posts when you ship. |
| **UI inventory** | `1_development/stream_1_app/ui_inventory/app_ui_inventory.md` (source path must match active folder in that file’s header) |
| **Frozen v0.01.01 (Showcase public baseline)** | `3_archive/stream_1_app/prod_stables_app_v0.01.01/` — see `FROZEN.md` inside. Published zip: `Stables_v0.01.01.mds.zip` on Pages `dapp/latest-version/`. |
| **Frozen v0.2.11** | `3_archive/stream_1_app/prod_stables_app_v0.2.11/` |
| **Frozen v0.2.10** | `3_archive/stream_1_app/prod_stables_app_v0.2.10/` + zip `…/build/Stables_v0.2.10.mds.zip` |
| **Dev zip (v00.00.02)** | `prod_stables_app_v00.00.02/build/Stables_v00.00.02.mds.zip` (version in filename; see `build/README.md`) |

## Versioning policy (prod / test / showcase)

- Release label format is **`vNN.NN.NN`** (example: `v00.00.02`).
- Every shipped package/release note should include:
  - **Channel** (`prod`, `test`, or `showcase`)
  - **Release label** (`vNN.NN.NN`)
  - **Source folder path** (current `prod_stables_app_*` path while folder migration is pending)
- Folder path, release label, and zip naming should stay aligned (`v00.00.02` for the active line).

**Rules**

- All agent edits go to **`prod_stables_app_v00.00.02`** until the next version bump.
- **`2_current`**: only the user promotes; agents do not move trees there without explicit approval.
- **Zip**: contents of the `prod_…` folder only — see `handshake.md` **Packaging Rule**.
- **Freeze workflow:** copy active folder → `3_archive/stream_1_app/prod_stables_app_vX.Y.Z/`, add `FROZEN.md`, bump new `prod_*` folder + `dapp.conf` / `APP_BUILD_VERSION`, append **Unreleased** section in `CHANGELOG.md`, then remove old active folder.

**Last bumped**: 2026-04-02 (active folder + declared release label aligned at **`v00.00.02`** / showcase channel).
