# Gemini CLI Opinionated Framework

This is a highly opinionated repository framework designed to transform how developers work with AI agents, specifically optimized for the [Gemini CLI](https://github.com/google/gemini-cli). It’s not just a collection of files; it’s a **cognitive partnership model** that enforces rigorous engineering standards, strategic planning, and continuous validation.

While tailored for Gemini CLI, the core philosophy—folders like `.gemini/`, files like `GEMINI.md`, and the journaling/task-tracking workflow—can be adapted to any AI agent by simply renaming the relevant files and folders (e.g., to `.cursor/` or `.aider/`).

## The Core Philosophy: AI as a Senior Partner

In this framework, the AI agent is not a "code generator" or a "copilot". It is a **Senior Architect and Critical Thinking Partner**.

*   **Critical Feedback First:** The agent is instructed to challenge unsafe, redundant, or poorly conceived ideas *before* writing a single line of code.
*   **Research -> Plan -> Execute:** Every non-trivial change follows a strict lifecycle. The agent first researches the context, proposes a detailed plan, waits for your explicit approval, and only then begins implementation.
*   **Validation-Always:** The framework uses `make` as a source of truth. The agent is hooked into the `makefile` to ensure that every change is validated (linted and tested) before being finalized.

## The Workflow: Start Fresh, Move Fast

To use this framework for a new project, follow these steps:

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/apiad/starter.git my-new-project
    cd my-new-project
    ```
2.  **Reset for a New Project:**
    Remove the existing history and documentation to start with a blank slate:
    ```bash
    rm -rf .git README.md CHANGELOG.md journal/*.md
    git init
    ```
3.  **Scaffold Your Stack:**
    Use the built-in `/scaffold` command to initialize your project with modern tooling (Python/uv, TS/npm, Rust/cargo, etc.):
    ```bash
    gemini /scaffold
    ```
    The agent will ask you about your preferred stack, architecture, and tools, then generate the project structure and a compatible `makefile`.

## The Hook System: Staying in Sync

The framework uses a robust hook system (`.gemini/hooks/`) that synchronizes the agent with your project state:

*   **`session_start.py`**: Initializes the environment and greets you.
*   **`welcome.py`**: Provides a high-level summary of the current project state and available commands.
*   **`enforce_journal.py`**: Ensures a journal entry exists for the current date, maintaining an audit trail of decisions and progress.
*   **`check_make.py`**: Automatically runs `make` (minimal lint+test) after critical agent actions to prevent regressions.
*   **`log_model_output.py`**: Records agent outputs for debugging and session review.

## Powerful Commands

The `.gemini/commands/` directory defines specialized workflows:

*   **/scaffold**: Initializes a new project from scratch with modern standard practices.
*   **/task**: A unified command to `create`, `work` on, `report`, or `update` your project roadmap (`TASKS.md`).
*   **/research**: A robust 3-phase workflow (Planning -> Data Gathering via `researcher` agent -> Reporting via `reporter` agent) for exhaustive investigations.
*   **/commit**: Analyzes changes, groups them logically, and commits them one-by-one using Conventional Commits.
*   **/release**: Automates version bumping, `CHANGELOG.md` updates, and git tagging.
*   **/maintainance**: Performs deep analysis and proposes step-by-step refactoring plans.
*   **/docs**: Generates and maintains project documentation.
*   **/onboard**: Helps new developers (or the agent itself) understand the project structure.

## The Journaling Idea

Journaling is central to this framework. Every day you work on the project, a new entry is created in `journal/YYYY-MM-DD.md`.

*   **Why?** It provides a persistent "memory" for the agent and a clear audit trail for you. When you start a new session, the agent reads the recent journals to understand exactly where you left off.
*   **Enforcement:** The `enforce_journal.py` hook ensures you never forget to document your progress.

## Engineering Standards (GEMINI.md)

The `GEMINI.md` file is the **"Soul" of the Agent**. It contains the core mandates that the agent must follow, including:
*   Critical cognitive partnership.
*   Strategic planning and approval.
*   Modern engineering standards (DRY, documentation, testing).
*   Rigorous tool validation.

---

## License

MIT
