# Gemini CLI Opinionated Framework

This is a highly opinionated repository framework designed to transform how developers work with AI agents, specifically optimized for the [Gemini CLI](https://github.com/google/gemini-cli). It’s not just a collection of files; it’s a **cognitive partnership model** that enforces rigorous engineering standards, strategic planning, and continuous validation.

While tailored for Gemini CLI, the core philosophy—folders like `.gemini/`, files like `GEMINI.md`, and the journaling/task-tracking workflow—can be adapted to any AI agent by simply renaming the relevant files and folders (e.g., to `.cursor/` or `.aider/`).

## The Core Philosophy: AI as a Senior Partner

In this framework, the AI agent is not a "code generator" or a "copilot". It is a **Senior Architect and Critical Thinking Partner**.

*   **Critical Feedback First:** The agent is instructed to challenge unsafe, redundant, or poorly conceived ideas *before* writing a single line of code.
*   **Research -> Plan -> Execute:** Every non-trivial change follows a strict lifecycle. The agent first researches the context, proposes a detailed plan, waits for your explicit approval, and only then begins implementation.
*   **Validation-Always:** The framework uses `make` as a source of truth. The agent is hooked into the `makefile` to ensure that every change is validated (linted and tested) before being finalized.

## Powerful Commands

The `.gemini/commands/` directory defines specialized workflows that automate the entire development lifecycle:

### Project Management & Discovery
*   **/onboard**: Summarizes the project's architecture, standards, and current state to quickly orient a new developer (or the agent itself).
*   **/task**: Manages the project roadmap in `TASKS.md`. Use it to `create` new tasks, `work` on existing ones (marks as In Progress), `report` on priorities, or `update` the roadmap based on recent progress.
*   **/issues**: Integrates with the GitHub CLI (`gh`) to list, create, or update issues. It can even transition from an issue directly into a implementation **Plan**.

### Development & Maintenance
*   **/scaffold**: Initializes a new project from scratch using modern, standard tooling (Python/uv, TS/npm, Rust/cargo, etc.) and sets up a compatible `makefile`.
*   **/research <topic>**: A deep, 3-phase investigation workflow (Planning -> Data Gathering -> Reporting) that produces exhaustive Markdown reports in the `research/` directory.
*   **/maintenance**: Performs a deep scan of the codebase to identify refactoring opportunities, improve documentation, and increase test coverage without changing functionality.
*   **/docs**: Analyzes the codebase and journals to generate or update comprehensive project documentation in the `docs/` folder.
*   **/cron**: Manages repetitive background tasks (e.g., daily reports, health checks) using **systemd user timers**. Tasks are defined in `cron.toml` using `OnCalendar` expressions.

### Shipping & Quality
*   **/commit**: Analyzes your changes, groups them into logical features or fixes, and guides you through committing them individually using **Conventional Commits**.
*   **/release**: Automates the final shipping steps: running tests, determining the next version (semver), updating the `CHANGELOG.md`, tagging the release, and creating a GitHub release.

## Common Workflows

This framework shines when you combine these commands into cohesive workflows:

### 1. Feature Lifecycle: From Idea to Ship
1.  **Discovery:** `/research "best way to implement X"` to explore architectural options.
2.  **Planning:** `/task create "Implement X based on research"` to add it to the roadmap.
3.  **Implementation:** `/task work "Implement X"` to set the context and start the plan-act-validate cycle.
4.  **Refining:** `/docs` to ensure the new feature is properly documented.
5.  **Committing:** `/commit` to logically group and commit your changes.
6.  **Releasing:** `/release` to bump the version, update the changelog, and tag the code.

### 2. Routine Maintenance & Health
1.  **Investigation:** `/maintenance` once a week to identify technical debt or missing documentation.
2.  **Automation:** `/cron "daily maintenance"` to have the agent automatically run linting or small refactorings during off-hours.
3.  **Reporting:** `/task report` to see what maintenance tasks are still pending on the roadmap.

### 3. Collaboration & Issue Tracking
1.  **Triage:** `/issues summary` to see what needs attention on GitHub.
2.  **Deep Dive:** `/issues work 42` to automatically research the context of issue #42 and propose a fix.
3.  **Onboarding:** If a new collaborator joins, they run `/onboard` to get up to speed in seconds.

### 4. Starting a New App
1.  **Initialization:** `/scaffold` to set up the repo, stack, and `makefile`.
2.  **Roadmapping:** `/task create "MVP: Feature A"` to define the first milestone.
3.  **Development:** Follow the **Feature Lifecycle** above.

## The Hook System: Staying in Sync

The framework uses a robust hook system (`.gemini/hooks/`) that synchronizes the agent with your project state:

*   **`session.py`**: Initializes the environment and provides a high-level summary of the project state and available commands.
*   **`journal.py`**: Ensures a journal entry exists for the current date (`journal/YYYY-MM-DD.md`), maintaining an audit trail of decisions and progress.
*   **`make.py`**: Automatically runs `make` (minimal lint+test) after critical agent actions to prevent regressions.
*   **`cron.py`**: Synchronizes `cron.toml` tasks with **systemd user timers**.

---

## License

MIT
