# OpenCode Agents

This file defines the project-specific instructions and configuration for OpenCode agents.

## Project Overview

This is a personal starter project using OpenCode for AI-assisted development.

## Agent Architecture

### Primary Agents (Thinking Modes)
- **plan**: Planning workflow - analyzes codebase, generates plans saved to `plans/`
- **build**: TCR (Test-Commit-Revert) coding workflow - manages tasks and delegates to builder
- **query**: Default agent for repo Q&A - invokes subagents as needed
- **research**: Research campaigns - parallel scout work with writer summaries
- **brainstorm**: Critical thinking and risk assessment
- **write**: Prose composition and refinement
- **review**: Multi-phase editorial review

### Subagents (Specialized Tasks)
- **builder**: TCR grunt coding (test-driven implementation)
- **scout**: Web research (parallelizable)
- **investigator**: Codebase architectural analysis
- **writer**: Prose refinement
- **reviewer**: Editorial audits
- **debugger**: RCA investigation

## Workflow Conventions

### Task Management
- Use the `task` tool to manage tasks in `tasks.yaml`
- All task modifications must go through the tool
- Storage: `tasks.yaml` (YAML format)
- Actions: `add`, `start`, `cancel`, `archive`, `attach-plan`, `list`

### Journaling
- Use the `journal` tool to add daily entries
- Storage: `journal/YYYY-MM-DD.yaml` (YAML format)
- Actions: `add`, `list`

### Planning
- Plans are saved to `plans/` directory
- Filenames: kebab-case (e.g., `plans/implement-auth.md`)
- Link plans to tasks via `task attach-plan` action

### Pre-commit Validation
- Run `git_precommit` tool before committing
- Validates: tests pass + journal is current

## Directory Structure
```
.opencode/
├── agents/          # Agent definitions
├── commands/        # High-level commands
├── tools/           # Custom tools (TypeScript)
└── style-guide.md   # Prose style rules

plans/               # Saved plans
journal/             # Daily journal entries (YAML)
research/           # Research assets
tasks.yaml          # Project roadmap (YAML)
```
