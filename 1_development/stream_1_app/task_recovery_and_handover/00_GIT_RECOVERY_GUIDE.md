# Git Recovery Guide for Stablesworks

## Quick Recovery Commands

### Recover a Single File
```powershell
# See recent changes to a file
git log --oneline -- "path/to/file.html"

# Restore a file to its last committed state
git restore "path/to/file.html"

# Restore a file to a specific commit
git restore --source=COMMIT_HASH "path/to/file.html"
```

### Recover Multiple Files
```powershell
# Restore entire directory to last commit
git restore "1_development/docs/Presentations V01/"

# Restore everything to last commit
git restore .
```

### Undo Last Change Completely
```powershell
# See what the last commit did
git show HEAD

# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit AND discard changes (DANGEROUS)
git reset --hard HEAD~1
```

### View File History
```powershell
# See all commits that modified a file
git log --follow -- "path/to/file.html"

# See diff of a file in last commit
git show HEAD:"path/to/file.html"

# Show file content from specific commit
git show COMMIT_HASH:"path/to/file.html" > recovered_file.html
```

## Before AI Work Session
```powershell
# Create checkpoint before AI modifies anything
cd "H:\My Drive\Stablesworks"
git add -A
git commit -m "Pre-AI checkpoint - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
```

## After AI Work Session
```powershell
# Save AI changes
cd "H:\My Drive\Stablesworks"
git add -A
git commit -m "Post-AI: [describe what was done]"
```

## Emergency Recovery
If something goes wrong:
1. **Don't panic** - Git has everything
2. **Check status**: `git status`
3. **Check log**: `git log --oneline -10`
4. **Restore**: `git restore <file>` or `git reset --hard HEAD~1`

## Current Status
- ✅ Full repository backup created: 2026-01-05 14:23
- ✅ All `1_development/` files now tracked
- ✅ All `2_current/` files tracked
- ✅ Complete version history available

---
**Last Updated**: 2026-01-05 14:23



