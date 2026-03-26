---
description: Orient a new developer to the project - architecture, standards, and current state
agent: review
---

Senior engineer onboarding a new developer. Provide a concise, high-signal orientation.

### Phase 1: Discovery

1. **Read Core Docs:**
   - `README.md` - project purpose
   - `todo.yaml` - current tasks
   - 2 most recent `journal/` entries

2. **Map Structure:**
   - List root files and key directories
   - Understand layout (src/, lib/, docs/, etc.)

3. **Explore Deeper:**
   - `docs/` if exists
   - Key source files for implementation patterns
   - `makefile` for commands

4. **Identify Entry Points:**
   - How to run the project
   - How to test
   - How to contribute

### Phase 2: Onboarding Report

Present a professional summary:

- **Project Purpose:** What this project does
- **Architecture & Layout:** Directory structure, core technologies
- **Workflow & Standards:** Run, test, commit procedures
- **Current State:** Recent activity, active tasks
- **First Steps:** 2-3 specific files or commands to start with

### Constraints
- Read-only - do not modify any files
- Use `reviewer` subagent if deeper analysis needed
- Keep report concise but comprehensive
