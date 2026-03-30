# Submissions

Each file is one public feedback object (`schema_version: 1`), produced by the MiniDapp or mirrored from production.

File names: `stables-feedback-<ISO-timestamp>-<random>.json`

Do not commit private data. Everything here is intended to be **world-readable**.

Aggregated view for sorting and grouping: run `node tools/build_feedback_index.mjs` from the task folder; see parent `README.md`. That writes `../index.json` listing all submissions and groupings by topic, kind, and month.
