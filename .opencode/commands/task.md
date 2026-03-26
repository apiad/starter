---
description: Manage tasks in tasks.yaml - add, start, cancel, archive, list, attach-plan
agent: query
---

Task management commands using the `task` tool.

### Actions

- **list**: `task list` - Show all tasks (default if no action specified)
- **add**: `task add --label "X" --description "Y" --category "Z"`
- **start**: `task start --task-id X.X`
- **cancel**: `task cancel --task-id X.X`
- **archive**: `task archive --task-id X.X`
- **attach-plan**: `task attach-plan --task-id X.X --plan-path plans/my-plan.md`
