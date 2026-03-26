---
description: Deep codebase audit to identify technical debt and maintenance issues
agent: review
---

Lead Maintenance Engineer. Perform a deep, read-only audit to identify technical debt.

### Phase 1: Clarification

1. **Analyze Request:** Check if user specified focus area
2. **Clarify Scope:** Use `question` if ambiguous:
   - DRY violations?
   - Documentation gaps?
   - Test coverage?
   - General code health?

### Phase 2: Deep Analysis

Audit priorities:
- **DRY:** Find logic duplication across files
- **Documentation:** Check for missing/outdated docs
- **Test Gaps:** Complex functions without tests
- **Complexity:** Deeply nested or long methods needing refactor

Use `grep` and `read` to investigate thoroughly.

### Phase 3: Report

Generate "Maintenance Report Card":
1. Save to `research/audit-<date>.md`
2. Include:
   - High-level summary
   - File-by-file issues
   - Actionable fix suggestions

### Phase 4: Advisory

Report completion and suggest next steps:
- Use `/plan` to formalize fixes
- Use `/onboard` to understand context better

### Constraints
- Read-only - do not modify any files
- Use `reviewer` subagent for code pattern analysis
- Evidence-based findings with specific examples
