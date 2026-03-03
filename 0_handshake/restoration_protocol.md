# Stables Restoration Protocol

This document defines how to restore the Stables project to any previous state using the Project Ledger and Git.

## 1. The Restoration Framework
The project uses a "Point-in-Time" restoration model. Every modification is assigned a unique **Point ID** in the Project Ledger.

- **Ledger Path**: `2_current/stream_3_governance/prod_project_ledger/ledger.md`
- **Engine**: Git (Local and Private Remote)

## 2. How to Restore a File
If a specific file needs to be reverted to a previous state:
1. Locate the **Point ID** or the **Restore ID (Git Hash)** in the Ledger.
2. Run the following command:
   ```powershell
   git checkout [Hash] -- [File_Path]
   ```

## 3. How to Restore the Entire Project
To roll back the entire project to a specific Point ID:
1. Identify the **Restore ID (Git Hash)** for that Point.
2. Run:
   ```powershell
   git reset --hard [Hash]
   ```
   *WARNING: This will discard all uncommitted changes.*

## 4. Continuity Rules
- **No Manual Deletion**: Never delete files to "restore." Use Git to revert.
- **Log Integrity**: The Ledger must never be edited retroactively. Only new entries are added.
