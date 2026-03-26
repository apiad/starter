---
description: Full TCR workflow for implementing plans with test-driven development
agent: build
---

Autonomous TCR workflow for implementing tasks from a plan.

### Preconditions
- Requires a plan (linked to task via `todo.planPath` OR passed as argument)
- If no plan exists → stop and instruct: "Use /plan first to create a plan"

### Workflow

1. **Branch Setup**:
   - Generate branch name: `feature/<task-id>-<slug>` (e.g., `feature/G.1-implement-auth`)
   - Create and switch to branch: `git checkout -b <branch-name>`

2. **Step Execution** (for each step in plan):
   - Invoke `writer` subagent if step involves document writing
   - Invoke `coder` subagent if step involves testing hypotheses
   - If step is code implementation:
     - Write failing test
     - Implement minimal code to pass
     - Verify with tests
   - If step succeeds → commit: "Step N: <description>"
   - If step fails once → retry one fix
   - If step fails again → ASK USER for guidance

3. **Completion**:
   - Run final `make test`
   - If tests pass, merge branch to main
   - Archive task via `todo archive --task-id X.X`
   - Report success summary

### Reporting
- Report progress after each step
- Only interrupt for user input on builder failure after retry
