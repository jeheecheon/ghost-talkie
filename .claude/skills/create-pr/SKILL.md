---
name: create-pr
description: Create a GitHub pull request using the project's PR template (WHY/WHAT format)
triggers:
  - create-pr
  - pr
  - pull request
argument-hint: "<title>"
---

# Create Pull Request

Create a PR for the current branch using the project template.

## Steps

1. Run `git log develop..HEAD --oneline` and `git diff develop...HEAD --stat` to understand all changes
2. Check remote tracking: push if needed (`git push -u origin <branch>`)
3. Draft PR body following the template:

```
# WHY
- Why this change is needed (problem, motivation)

# WHAT
- What was changed (implementation details)

Closes #<issue-number>
```

4. Create PR:

```bash
gh pr create --title "<type>: <summary>" --body "<body>" --base develop
```

## Rules

- Title format: `<type>: <summary>` (feat, fix, refactor, chore)
- If an argument is provided, use it as the title
- Link related issues with `Closes #N` or `Refs #N`
- Keep WHY focused on the problem/motivation
- Keep WHAT focused on implementation decisions
- Write PR body (WHY/WHAT content) in Korean
- Infer `<type>` from branch name prefix (e.g., `feature/` → `feat`, `fix/` → `fix`, `refactor/` → `refactor`)
