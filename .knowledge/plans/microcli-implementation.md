---
id: microcli-implementation
created: 2026-03-27
modified: 2026-03-27
type: plan
status: active
expires: 2026-04-03
---

# Plan: Build microcli

## Context

Create a single-file Python CLI framework (~400 lines) for AI-friendly micro CLI apps. Goals:
- Single `.py` file, standard library + pyyaml
- Annotated type hints for docs/args
- High-level `sh()` for shell commands
- `--dry-run` mode
- `command.explain()` for agent workflows

## Phases

### Phase 1: Core Framework
**Goal:** Build the command registration and argument parsing system

**Deliverable:** `microcli.py` with `@m.command` decorator

**Done when:**
- [ ] `@m.command` decorator registers functions
- [ ] Annotated type hints parsed into argparse
- [ ] Module docstring used as help text
- [ ] Function docstring printed before execution
- [ ] `m.Flag` type marker works
- [ ] `--help` works at module and command level
- [ ] `--dry-run` flag works globally

### Phase 2: Shell & Status
**Goal:** Implement `m.sh()` and status helpers

**Deliverable:** Working shell executor with Result object

**Done when:**
- [ ] `m.sh(cmd)` executes and returns `Result`
- [ ] `Result` has: ok, failed, stdout, stderr, returncode, duration
- [ ] `--dry-run` makes `sh()` print command instead of executing
- [ ] `m.ok()`, `m.fail()`, `m.info()`, `m.step()`, `m.warn()` work
- [ ] `m.fail()` exits with code 1

### Phase 3: Utilities
**Goal:** Implement file/path utilities

**Deliverable:** Core utility functions

**Done when:**
- [ ] `m.read(path)` returns file contents
- [ ] `m.write(path, content)` writes file
- [ ] `m.ls(path=".")` returns list of filenames
- [ ] `m.glob(pattern)` returns list of Paths
- [ ] `m.touch(path)`, `m.rm(path)`, `m.cp(src,dst)`, `m.mv(src,dst)`
- [ ] `m.cd(path)` works as context manager
- [ ] `m.which(cmd)` returns Path or None
- [ ] `m.env(name)` returns env var or None

### Phase 4: Command Explain
**Goal:** Implement `command.explain()` for agent workflows

**Deliverable:** Command invocation generator

**Done when:**
- [ ] `cmd.explain()` generates `python app.py cmd`
- [ ] `cmd.explain(arg=value)` includes positional args
- [ ] `cmd.explain(flag=True)` includes `--flag`
- [ ] Missing required args raises TypeError
- [ ] Optional args with defaults work

### Phase 5: YAML Support
**Goal:** Add YAML parsing utilities

**Deliverable:** `m.yaml` module

**Done when:**
- [ ] `m.yaml.load(text)` parses YAML
- [ ] `m.yaml.dump(data)` serializes to YAML

## Success Criteria

- [ ] Single file, ~400 lines
- [ ] Works with `python app.py --help`
- [ ] `m.sh()` works in both normal and dry-run modes
- [ ] `cmd.explain(arg=val)` generates correct invocation
- [ ] All utilities return values (not print)
- [ ] Status helpers print to stdout
- [ ] Annotated type hints become help text

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| argparse + dry-run interaction complex | Medium | Test both modes early |
| Type hint parsing edge cases | Medium | Start simple, add as needed |
| Single file too long | Low | Keep under 500 lines |

## Related

- Design: `.knowledge/notes/mode-command-tool-pattern.md`
