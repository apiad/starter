---
description: Full TCR workflow for implementing plans with test-driven development
agent: build
---

Autonomous TCR workflow for implementing tasks from a plan.

### Preconditions
- Requires a plan (linked to task via `task.planPath` OR passed as argument)
- If no plan exists → stop and instruct: "Use /plan first to create a plan"

### Workflow

1. **Branch Setup**:
   - Generate branch name: `feature/<task-id>-<slug>` (e.g., `feature/G.1-implement-auth`)
   - Create and switch to branch: `git checkout -b <branch-name>`

2. **Step Execution** (for each step in plan):
   - Invoke `builder` subagent with the step details
   - Builder does: write test → implement → verify
   - If builder succeeds → commit step with "Step N: <description>"
   - If builder fails once → builder retries one fix
   - If builder fails again → ASK USER for guidance

3. **Completion**:
   - Merge branch to main
   - Run final `make test`
   - Archive task via `task archive --task-id X.X`
   - Report success summary

### Reporting
- Report progress after each step
- Only interrupt for user input on builder failure after retry
