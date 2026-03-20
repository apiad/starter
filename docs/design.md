# Architecture & Systems

The **Gemini CLI Opinionated Framework** is not just a collection of scripts; it is an integrated system designed to empower AI agents while enforcing rigorous engineering standards.

## 🏗️ The Core Architecture

The project's "brain" resides in the `.gemini/` directory, which is organized into four primary systems:

### 1. The Hook System (`.gemini/hooks/`)

Hooks are Python-based scripts that intercept the Gemini CLI turn lifecycle. They are the framework's primary enforcement mechanism.

- **`welcome.py`:** Initializes the session and provides a project summary to the agent. It also checks for the presence of the pre-commit hook and alerts the user if missing.
- **`pre-commit.py`:** Enforces the mandatory daily journaling and **timestamp-based validation** before any code changes are finalized.
- **`make.py`:** Automatically runs the `makefile` (tests/linting) to prevent regressions.
- **`notify.py`:** Sends a desktop notification after each agent turn is successfully completed and validated.
- **`utils.py`:** Provides a shared set of utilities for git status analysis and communication with the CLI.

### 2. The Script Utility System (`.gemini/scripts/`)

Helper scripts that standardize framework operations across different environments.

- **`journal.py`:** A dedicated script to correctly format and append new journal entries (`[timestamp ISO] - description`). This ensures consistency and prevents AI hallucinations of dates or formats.

### 3. The Command System (`.gemini/commands/`)

Commands define structured, multi-phase workflows that automate the development lifecycle. Each command is a TOML file containing specific instructions and context for the agent.

- **`/plan`:** An interactive workflow that transitions between clarification, analysis, and strategy generation.
- **`/research`:** A deep-dive exploration that produces exhaustive reports in the `research/` directory.
- **`/debug`:** Activates a forensic investigation mode for root-cause analysis.
- **`/document`:** Analyzes the codebase and project state to update the documentation suite.
- **`/task`:** The primary execution engine, managing `TASKS.md` and enforcing the strict TCR (Test-Commit-Revert) loop and feature branch isolation.

### 🔍 Deep Dive: Timestamp-Based Validation

The `pre-commit.py` hook implements a sophisticated cross-file validation strategy:

1.  **Change Detection:** Uses `git status --porcelain` to identify all modified files, excluding internal framework files (`.gemini/`) and the journal itself.
2.  **MTime Analysis:** Calculates the maximum modification time (`max(mtime)`) among all meaningful changes.
3.  **Audit Trail Check:** Parses the **last entry** in the current day's journal file (`journal/YYYY-MM-DD.md`) and extracts its ISO timestamp.
4.  **Temporal Consistency:** If the journal entry timestamp is **older** than the latest file change, the commit is blocked. This forces the agent (or user) to document the work *after* it is done but *before* it is finalized.

### 4. Specialized Agents (`.gemini/agents/`)

Instead of a single "do-it-all" AI, the framework delegates tasks to specialized sub-agents with restricted toolsets and focused personas (e.g., `planner`, `debugger`, `editor`, `reporter`). This ensures higher reliability and more consistent results.

### 4. State Management

The framework maintains internal state to optimize operations and ensure continuity:

- **`.gemini/last_make_run`**: Stores the timestamp of the last successful validation, allowing the framework to skip redundant tests.
- **`.gemini/last_journal_update`**: Tracks when the journal was last updated to intelligently enforce the journaling requirement.
- **`.gemini/settings.json`**: Configures the framework's global behavior and hook execution order.

## ⚙️ The Technology Stack

- **CLI Engine:** Gemini CLI (Interactive Node.js-based terminal).
- **Core Automation:** Python (Hooks and specialized scripts).
- **Validation & Health:** Make (Central source of truth for builds and tests).
- **State & Versioning:** Git (Change detection and history tracking).
- **Documentation:** Markdown (Universal format for journals, plans, and reports).

---

*Next: See [Development & Contribution](develop.md) for the rules of the road.*
