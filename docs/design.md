# Architecture & Systems

The **Gemini CLI Opinionated Framework** is not just a collection of scripts; it is an integrated system designed to empower AI agents while enforcing rigorous engineering standards.

## 🏗️ The Core Architecture

The project's "brain" resides in the `.gemini/` directory, which is organized into four primary systems:

### 1. The Hook System (`.gemini/hooks/`)

The framework uses a dual-layer hook system to enforce standards and automate workflows.

#### **A. Gemini CLI Lifecycle Hooks**
These scripts are registered in `.gemini/settings.json` and intercept the turn-by-turn lifecycle of the agent.

- **`session.py` / `welcome.py`:** Initialize the session, provide a project summary, and check for environment readiness (e.g., verifying if Git hooks are installed).
- **`log.py`:** Provides a comprehensive audit trail of every interaction, logging structured markers for `BeforeAgent`, `AfterModel`, and `AfterTool` events.
- **`notify.py`:** Sends a desktop notification and plays a system sound once the agent completes its turn, ensuring the user is alerted when the agent is waiting for input.
- **`cron.py`:** Synchronizes the `cron.toml` task definitions with **systemd user timers** for background execution.

#### **B. Git Hooks**
These are linked to the repository's `.git/hooks/` directory and manage the finality of changes.

- **`pre-commit.py`:** The primary enforcement mechanism. It performs **timestamp-based validation**, ensuring that a journal entry exists for the current date and that its timestamp is newer than any modified files. It also serves as the trigger for project-wide health checks.
- **`utils.py`:** A shared Python library providing common functions for git analysis, hook decisions, and communication with the Gemini CLI.

### 2. The Script Utility System (`.gemini/scripts/`)

Helper scripts that standardize framework operations across different environments.

- **`journal.py`:** A dedicated script to correctly format and append new journal entries (`[timestamp ISO] - description`). This is the **only recommended way** to update the journal, as it ensures temporal consistency for the `pre-commit.py` hook.

### 3. The Command System (`.gemini/commands/`)

Commands define structured, multi-phase workflows that automate the development lifecycle. Each command is a TOML file containing specific instructions and context for the agent.

- **`/plan`:** An interactive workflow that transitions between clarification, analysis, and strategy generation.
- **`/research`:** A deep-dive exploration that produces exhaustive reports in the `research/` directory.
- **`/debug`:** Activates a **forensic investigation mode** using a scientific, hypothesis-driven workflow.
- **`/learn`:** A grounded learning lifecycle for mastering new technologies and codifying them into project skills.
- **`/document`:** Analyzes the codebase and project state to update the documentation suite.
- **`/task`:** The primary execution engine, managing `TASKS.md` and enforcing the **strict TCR (Test-Commit-Revert) loop** and feature branch isolation.

### 🔍 Deep Dive: Scientific Debugging

The `/debug` command implements a principled approach to problem-solving, moving through four distinct phases:

1.  **Status & Context Analysis:** The agent gathers all relevant error logs, stack traces, and recent changes.
2.  **Hypothesis Formulation:** Instead of guessing, the agent must propose a specific hypothesis for the root cause and obtain user approval.
3.  **Isolated Hypothesis Testing:** The agent creates a temporary **diagnostic branch** (`debug/hyp-*`) and is granted restricted `write_file` access *only* for diagnostic code (logs, reproduction scripts).
4.  **Synthesis & RCA Report:** Once verified, the agent synthesizes the findings into a structured Root Cause Analysis (RCA) report, ensuring the "fix" is understood before it is implemented.

### 🔍 Deep Dive: TCR (Test-Commit-Revert) Protocol

The `/task work` command enforces a high-discipline development lifecycle through a strict TCR loop:

1.  **Pre-flight Verification:** Ensures a clean `main` branch and passing tests.
2.  **Isolation:** All work occurs on an auto-generated, kebab-case feature branch.
3.  **The Loop (Red-Green-Verify):**
    - **Red:** A failing test is written to define the step's goal.
    - **Green:** Minimal code is written to pass the test.
    - **Verify:** If the test fails, the agent is allowed **one quick fix**. If it fails again, the change is **automatically reverted** (`git checkout .`), preserving the last known stable state.
4.  **Integration:** Upon completion, the feature branch is merged, the roadmap is updated, and the branch is deleted.

### 🔍 Deep Dive: Timestamp-Based Validation

The `pre-commit.py` hook implements a sophisticated cross-file validation strategy:

1.  **Change Detection:** Uses `git status --porcelain` to identify all modified files, excluding internal framework files (`.gemini/`) and the journal itself.
2.  **MTime Analysis:** Calculates the maximum modification time (`max(mtime)`) among all meaningful changes.
3.  **Audit Trail Check:** Parses the **last entry** in the current day's journal file (`journal/YYYY-MM-DD.md`) and extracts its ISO timestamp.
4.  **Temporal Consistency:** If the journal entry timestamp is **older** than the latest file change, the commit is blocked. This forces the agent (or user) to document the work *after* it is done but *before* it is finalized.

### 4. Specialized Agents (`.gemini/agents/`)

Instead of a single "do-it-all" AI, the framework delegates tasks to specialized sub-agents with restricted toolsets and focused personas.

- **`planner`:** Responsible for high-level architectural design and roadmap generation.
- **`debugger`:** A forensic investigation specialist using a scientific, hypothesis-driven workflow.
- **`learner`:** A "Grounded Learning Specialist" who masters new technologies by writing, executing, and documenting code experiments.
- **`researcher`:** Optimized for deep information gathering and multi-source synthesis.
- **`writer` / `reviewer`:** Content generation and refinement specialists.

### 5. The Skill System (`.gemini/skills/`)

The framework's permanent knowledge base. Each skill is a directory containing:
- **`SKILL.md`:** The entry point with mandatory YAML frontmatter (`name` and `description`) for autonomous activation.
- **`reference-*.md`:** Granular documentation for specific learning objectives.
- **`assets/`:** Idiomatic, verified code examples and experiment scripts.

### 6. State Management

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
