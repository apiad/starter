---
description: Group and commit uncommitted changes individually using Conventional Commits
agent: build
---

Analyze all current uncommitted changes (including untracked files), group them into logical features, bugfixes, etc., and commit them one by one.

**Procedure:**
1. **Analyze Changes:**
   - Use `git status` and `git diff` to identify all modified and untracked files
   - Group files that are related to a single logical change
2. **Proposal:**
   - Present proposed commit groups with Conventional Commits format: `<type>(<scope>): <subject>`
   - Use `question` to confirm before proceeding
3. **Execution:**
   - For each group: stage files, commit with proposed message
   - Use `journal add` to update journal after commits

If no changes to commit, inform the user.
