# Development & Contribution

The **Gemini CLI Opinionated Framework** enforces a high-discipline development lifecycle. Whether you are a human or an AI contributor, adherence to these standards is mandatory.

## 🔄 The Mandatory Workflow Lifecycle

Every non-trivial change must follow this strict four-phase process:

### 1. Research & Analysis

Before proposing a change, use the `/research` command to gather context, analyze the current codebase, and identify potential risks.

### 2. Strategic Planning

A feature is not considered "active" until a persistent Markdown plan has been created in the `plans/` directory. Use the `/plan` command to generate this strategy and synchronize it with `TASKS.md`.

### 3. Execution & Validation (The TCR Protocol)

The `/task` command is the primary tool for repository execution. It supports multiple actions to manage the project roadmap:

- **`/task create`**: Adds a new task to `TASKS.md`.
- **`/task work on ...`**: Implements a strict **TCR (Test-Commit-Revert)** protocol to ensure high-velocity, high-quality code.
- **`/task report`**: Provides a summary of the roadmap and current priorities.
- **`/task update`**: Updates the status of an existing task.

#### **The TCR Loop (Work Action)**

1.  **Phase 1 (Pre-flight Verification):** The agent verifies that the working tree is clean, the current branch is `main`, and `make test` passes as a baseline.
2.  **Phase 2 (Task Isolation):** A dedicated feature branch (e.g., `feature/task-name`) is auto-generated and checked out. All work occurs on this isolated branch.
3.  **Phase 3 (The Red-Green-Verify Loop):** For every granular step of the implementation:
    - **Red:** Write a failing test and verify failure with `make test`.
    - **Green:** Implement the minimal code to pass the test.
    - **Verify:** Run `make test`.
        - **Pass:** `git commit` the step.
        - **Fail:** Attempt **one quick fix**. If it fails again, the change is **automatically reverted** (`git checkout .`).
4.  **Phase 4 (Integration):** Once all steps are complete, the agent performs a final test run. Upon approval, the branch is merged into `main` and deleted.

### 4. Forensic Investigation (The Scientific Debugging Discipline)

When a bug is detected, the `/debug` command enforces a structured, scientific investigation:

1.  **Phase 1 (Status & Context):** Analyze the current environment and gather reproduction information.
2.  **Phase 2 (Hypothesis Formulation):** Formulate a specific hypothesis for the root cause.
3.  **Phase 3 (Isolated Testing):** Test the hypothesis on a temporary diagnostic branch (`debug/hyp-*`). Diagnostic code should be minimal and focused.
4.  **Phase 4 (Synthesis & RCA):** Summarize the investigation into a **Root Cause Analysis (RCA)** report. This report serves as the documentation for the subsequent fix.

### 5. Audit & Documentation (NEW)

Before merging or committing any final change, the work **must** be documented in the daily journal. This is enforced by a **timestamp-based git hook**. Use the following tool to satisfy the requirement:

```bash
python3 .gemini/scripts/journal.py 'one-line description of the work'
```

Failure to do this will block your commit or turn execution.

## ✅ Testing & Quality Standards

- **Source of Truth:** The `makefile` is the central definition of project health.
- **Mandatory Commands:** Ensure `make test`, `make lint`, and `make format` pass before committing.
- **Documentation-as-Code:** Any new feature must be accompanied by relevant updates to the `docs/` directory.

## 🌲 Git & Source Control

### 1. Clean Working Tree

The framework requires a clean working tree for critical actions. Commit often to avoid merge conflicts or large, unmanageable diffs.

### 2. Conventional Commits

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

- **`feat:`**: A new feature for the user (e.g., `feat(hooks): add notify-send alert`).
- **`fix:`**: A bug fix for the user.
- **`docs:`**: Documentation-only changes.
- **`chore:`**: Maintenance, dependencies, or internal tooling updates (e.g., `chore(release): version 0.17.1`).
- **`refactor:`**: Code changes that neither fix a bug nor add a feature.

### 3. Commit Scoping

When possible, provide a scope to the commit message (e.g., `feat(onboard): add documentation discovery`).

## ✍️ Documentation Style

- **Markdown:** All documentation and logs must be in GitHub-flavored Markdown.
- **Kebab-case:** Use kebab-case for all filenames in the `docs/`, `plans/`, and `research/` directories.
- **Direct & Technical:** Documentation should be concise, high-signal, and technically rigorous.

---

*Return to the [Project Overview](index.md).*
