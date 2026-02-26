# Gemini CLI Starter Pack

This is a specialized starter repository for building new projects with a focus on **safe and coherent AI-assisted coding**. It's pre-configured for the **Gemini CLI** with advanced hooks, commands, agents, and skills to ensure a high-quality engineering lifecycle.

## Why Use This Starter Pack?

*   **Strategic Planning:** Forces a "Research -> Strategy -> Execution" cycle for non-trivial changes.
*   **Validation-First:** Integrated `makefile` hooks ensure code passes linting and tests before being committed.
*   **Deep Context:** Pre-configured with a robust `deep-research` skill for complex technical investigations.
*   **Auditability:** Automated journaling (`journal/`) and changelog (`CHANGELOG.md`) management.
*   **Specialized Agents:** Includes sub-agents like `online_researcher` for high-signal web investigations.

---

## Getting Started

### 1. Fork and Clone
Fork this repository and clone it to your local machine:
```bash
git clone https://github.com/your-username/your-new-project.git
cd your-new-project
```

### 2. Initialize the Project
Update the `GEMINI.md` and `package.json` (or equivalent) with your specific project details.
```bash
# Example: Run the onboard command
gemini /onboard
```

### 3. Usage
Use the Gemini CLI to interact with the repository.
```bash
gemini /research "how to implement X in this stack"
gemini /commit
```

---

## Core Features

### 1. Advanced Commands (`.gemini/commands/`)
*   **/commit:** Analyzes changes, groups them into logical features/bugfixes, and commits with Conventional Commits.
*   **/research:** Invokes the `deep-research` skill for exhaustive online and codebase investigations.
*   **/onboard:** Assists in setting up the project and understanding its structure.
*   **/maintainance:** Deep analysis and planning for codebase refactoring or cleanup.
*   **/release:** Handles version bumping and release documentation.
*   **/docs:** Automates the generation and maintenance of project documentation.

### 2. Specialized Agents (`.gemini/agents/`)
*   **online_researcher:** A senior research specialist that decomposes complex queries, performs deep web searches, and synthesizes data with full citations.

### 3. Agent Skills (`.gemini/skills/`)
*   **deep-research:** A robust, iterative skill that tracks progress via `research.plan.md`, aggregates raw data in `research.dump.md`, and synthesizes it into a section-by-section `report.md`.

---

## Workflow & Hooks Lifecycle

The project enforces a strict engineering standard through its **Hook System** (`.gemini/hooks/`):

1.  **Session Start (`session_start.py`):** Orchestrates session initialization and greets the developer.
2.  **Welcome & Context (`welcome.py`):** Provides a high-level summary of the current project state.
3.  **Journal Enforcement (`enforce_journal.py`):** Ensures that a journal entry exists for the current date, maintaining an audit trail of decisions.
4.  **Make Validation (`check_make.py`):** Automatically runs `make lint` and `make test` before critical AI actions to prevent regressions.
5.  **Audit Logging (`log_model_output.py`):** Records agent outputs for debugging and session review.

---

## Development Standards

As defined in `GEMINI.md`, the AI agent acts as a **Senior Architect and Critical Thinking Partner**. It is mandate-bound to:
*   Critique unsafe or flawed proposals before implementation.
*   Present a detailed strategy and seek approval for non-trivial changes.
*   Enforce a clean "Research -> Strategy -> Execution" lifecycle.
*   Prioritize modular, maintainable code over "just-in-case" complexity.

---

## License
MIT (or as specified in your fork).
