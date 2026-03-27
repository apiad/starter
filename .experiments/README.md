# Experiments Directory

This folder is used by subagents (tester, drafter) for temporary work.

- **Never committed to git** — automatically ignored
- **Never auto-purged** — user decides when to clean up
- **Subagent-only writes** — parent agents never write here directly

## Subfolders

- `tests/` — tester subagent writes hypothesis validation tests here
- `drafts/` — drafter subagent writes content sections here

## Cleanup

To clean up experiment files:
```bash
rm -rf .experiments/*
```

Or keep them for reference — they do no harm.
