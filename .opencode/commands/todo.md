---
description: Manage tasks in todo.yaml - add, start, cancel, archive, list, attach-plan
agent: query
---

Task management commands using the `todo` tool.

### Actions

- **list**: `todo list` - Show all tasks (default if no action specified)
- **add**: `todo add --label "X" --description "Y" --category "Z"`
- **start**: `todo start --task-id X.X`
- **cancel**: `todo cancel --task-id X.X`
- **archive**: `todo archive --task-id X.X`
- **attach-plan**: `todo attach-plan --task-id X.X --plan-path plans/my-plan.md`
