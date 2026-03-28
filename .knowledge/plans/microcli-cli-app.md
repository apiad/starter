---
id: microcli-cli-app
created: 2026-03-28
modified: 2026-03-28
type: plan
status: done
expires: 2026-04-04
---

# Plan: microcli CLI App (new + learn commands)

## Context

Transform microcli into a self-contained CLI tool with two main features:
- `microcli new` → Bootstrap new microapps
- `microcli learn` → Learning workflow for microcli framework

## Phases

### Phase 1: Entry Points ✅
**Goal:** Set up dual entry points (CLI app vs library)

**Deliverables:**
- [x] `__main__.py` entry point for `python -m microcli`
- [x] `core.main()` remains unchanged for user scripts

### Phase 2: CLI App Structure ✅
**Goal:** Create the CLI app that handles `new` and `learn`

**Deliverables:**
- [x] `cli.py` as a microcli microapp using @command decorators
- [x] `new` command: name, title, commands (positional args)
- [x] `learn` command with optional --topic flag

### Phase 3: Template Generator ✅
**Goal:** Generate scaffolded microapps from templates

**Deliverables:**
- [x] Template generator with `///script` header
- [x] Module docstring with `microcli learn` prompt
- [x] One `@command` per item in commands list
- [x] Each command has `ok("TODO: ...")` body
- [x] Extensive comments with `microcli learn <topic>` breadcrumbs

### Phase 4: Learn Content ✅
**Goal:** Curated learn topics for framework education

**Deliverables:**
- [x] Topics: principles, parameters, ok-fail, utilities, patterns, complex-inputs, reference
- [x] Each topic has rich formatted content
- [x] `learn` without args lists available topics
- [x] `learn --topic <name>` shows topic content

### Phase 5: Integration Tests ✅
**Goal:** Verify everything works end-to-end

**Deliverables:**
- [x] Tests for new and learn commands
- [x] Template generates valid Python
- [x] Full workflow test: new → run → learn

## Technical Approach

### File Structure
```
src/microcli/
├── __init__.py          # Library exports (unchanged)
├── __main__.py          # Entry: python -m microcli
├── core.py              # Library (unchanged)
├── learn.py             # Auto-discover (unchanged)
├── stdin.py             # Stdin support (unchanged)
├── cli.py               # NEW: microcli app (new/learn)
├── learn_content.py     # NEW: Curated learn topics
└── templates/
    └── skeleton.py      # NEW: Template generator
```

### Entry Points
- `python -m microcli` → `__main__.py` → `cli.main()`
- `microcli` command → `cli.main()` (via pyproject.toml)
- User scripts with `m.main()` → `core.main()` (unchanged!)

## Success Criteria

- [x] `python -m microcli --help` shows CLI help
- [x] `microcli new notes "Notes" create,list` creates notes.py
- [x] Generated notes.py runs: `python notes.py list`
- [x] `microcli learn` lists available topics
- [x] `microcli learn --topic principles` shows principles content
- [x] User scripts continue to work unchanged (core.main() unchanged)
- [x] 48 tests pass

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing user scripts | Keep core.main() unchanged |
| Template generation edge cases | Test with various inputs |
| Learn content completeness | Start with essential topics, expand later |

## Notes

- Global `--learn` flag renamed to `--tour` to avoid conflict with `learn` command
- CLI app (`cli.py`) is itself a microcli microapp using `@command` decorators
- User scripts use `--tour` for auto-discovered command tours
