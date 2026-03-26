---
description: Formalize discussions into an actionable plan
agent: plan
---

Formalize discussions, research findings, or brainstorming into a concrete plan.

### When to Use

- After `/brainstorm` to turn insights into action
- After `/research` to formalize findings into next steps
- After `/onboard` or `/audit` to plan improvements
- Any time user wants to create a structured plan

### Workflow

1. **Gather Context**:
   - Read relevant `research/` files if available
   - Read relevant `journal/` entries for recent discussions
   - Check `plans/` for existing related plans

2. **Invoke investigator** (if needed):
   - Use `investigator` subagent to understand codebase parts relevant to the plan
   - Ask specific questions: "What files handle X?", "How does Y work?"

3. **Formalize Plan**:
   Create `plans/<descriptive-name>.md` with:
   - **Objective:** Clear goal statement
   - **Context:** What we know, what prompted this
   - **Phases:** Logical groupings of steps
   - **Steps:** Numbered, actionable items
   - **Testing:** How to validate completion

4. **Link to Task** (optional):
   - Offer to attach plan to `todo.yaml` task
   - Use `todo add --label X --plan-path plans/X.md`

### Constraints
- Read-only on business logic - focus on architecture
- Use investigator to understand codebase without reading files
- Plans go to `plans/` directory only
