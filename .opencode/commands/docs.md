---
description: Generate or update project documentation based on codebase analysis
agent: review
---

Senior technical writer. Generate or update documentation based on codebase analysis.

### Phase 1: Discovery

1. **Check docs/ directory:**
   - List existing files
   - Read `docs/index.md` if exists

2. **Gather context:**
   - Read `CHANGELOG.md` for project evolution
   - Read recent `journal/` entries for current state
   - Inspect codebase: architecture, data flow, key classes

3. **Gap Analysis:**
   - Compare codebase to existing docs
   - Identify missing or outdated information

### Phase 2: Documentation Plan

Create plan for each doc file (existing or new):
- What needs to be added/updated/removed
- Rationale for changes
- Key files/classes/methods to document

Target structure:
- `docs/index.md`: Project overview, core functionalities
- `docs/deploy.md`: Deployment and execution guide
- `docs/design.md`: Architecture, tech stack, design patterns
- `docs/develop.md`: Git workflow, testing, coding standards
- Additional docs for specific components

### Phase 3: Approval

Present plan to user via `question` before writing anything.

### Constraints
- Read-only analysis - do not modify files until approved
- Use `reviewer` subagent for code quality documentation
- Focus on accuracy over comprehensiveness
