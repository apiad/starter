---
description: Automated release process - version bump, changelog update, git tag, GitHub release
agent: build
---

Automated release workflow for publishing new versions.

### Preconditions
- Worktree must be clean (all changes committed)
- Run `make` to ensure all tests pass before proceeding

### Workflow

1. **Version Analysis**:
   - Find latest git tag
   - Analyze commits since last tag
   - Propose version bump (major/minor/patch) based on commit types
   - Use `question` to confirm version

2. **Version Bump**:
   - Update `pyproject.toml` version
   - Update `uv.lock` if needed (run `uv lock`)
   - Update version references in source files if applicable

3. **CHANGELOG Update**:
   - Create new entry for version with date
   - Summarize changes since last release
   - Follow existing CHANGELOG format

4. **Finalization**:
   - Commit changes: `chore(release): version X.Y.Z`
   - Create git tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
   - Push to remote: `git push origin vX.Y.Z`
   - Create GitHub release via `gh release create`

5. **Report**:
   - Confirm successful release
   - Provide release URL
