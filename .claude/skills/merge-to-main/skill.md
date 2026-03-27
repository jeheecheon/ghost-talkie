---
name: merge-to-main
description: Create a PR to merge develop into main for production release
triggers:
  - merge-to-main
  - release
  - deploy to main
---

# Merge to Main

Create a PR to merge `develop` into `main`.

## Steps

1. Ensure local `develop` is up to date: `git checkout develop && git pull origin develop`
2. Push develop if there are unpushed commits: `git push origin develop`
3. Build commit list and create PR:

```bash
COMMITS=$(git log origin/main..develop --oneline --no-merges | sed 's/^/- /')
gh pr create --title "Merge develop into main" --body "$(printf '# COMMITS\n%s' "$COMMITS")" --base main --head develop
```

4. Return the PR URL

## Rules

- Always merge `develop` → `main`
- Title is always `Merge develop into main`
- Do NOT squash — use merge commit to preserve history
- If an argument is provided, append it to the PR body as additional context
