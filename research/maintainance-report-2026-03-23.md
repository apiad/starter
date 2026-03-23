# Maintenance Report Card - 2026-03-23

## Executive Summary
This audit focused on the synchronization between implementation (commands and agents) and documentation (README and user guides), as well as the robustness of the test suite. While the core functionality is well-documented, there are notable inconsistencies in command naming and coverage across different documentation files. Additionally, the current test suite is overly brittle due to specific content matching.

---

## 🛠️ Command & Agent Inventory

### Commands (.gemini/commands/) - 15 Total
- `commit`, `cron`, `debug`, `document`, `draft`, `issues`, `learn`, `maintenance`, `onboard`, `plan`, `release`, `research`, `review`, `scaffold`, `task`.

### Agents (.gemini/agents/) - 6 Total
- `debugger`, `learner`, `planner`, `researcher`, `reviewer`, `writer`.

---

## 🔍 Synchronization Audit

### 1. Naming Inconsistencies
- **Critical Issue:** The command defined in `.gemini/commands/document.toml` is correctly referred to as `/document` in `README.md`, but incorrectly as `/docs` in `docs/index.md` and `docs/user-guide.md`.
- **Impact:** Users following the documentation will encounter errors if they attempt to run `/docs`.

### 2. Documentation Coverage Gaps
- **README.md:** Comprehensive. Mentions all 15 commands.
- **docs/user-guide.md:**
    - **Missing Commands:** `/scaffold`, `/onboard`.
    - **Naming Error:** Uses `/docs` instead of `/document`.
- **docs/index.md:**
    - **Naming Error:** Uses `/docs` instead of `/document`.

### 3. Agent Mentions
- Agents are generally well-represented, but `learner` and `debugger` are sometimes mentioned only through their respective commands (`/learn`, `/debug`) rather than being explicitly identified as subagents in all documentation sections.

---

## 🧪 Test Suite Analysis

### Observations on `tests/test_review_command.py`
The current tests are **overly strict** and prone to failure when the implementation details change. Specifically:
- `test_reviewer_agent_has_grep_search`: Asserts exact string `"grep_search"` in `reviewer.md`.
- `test_review_command_is_multiphase`: Asserts exact strings `"Phase 1"`, `"Phase 2"`, etc.
- `test_maintenance_command_is_audit`: Asserts exact output strings and internal agent names.
- `test_planner_agent_read_only`: Asserts lack of `"write_file"` and `"replace"` strings.

### Actionable Suggestion for Tests
Refactor the tests to be **dynamic and behavior-oriented**:
1.  **Dynamic Discovery:** Iterate through `.gemini/commands/*.toml` and `.gemini/agents/*.md`.
2.  **Sync Verification:** Ensure every command file found has a corresponding entry in `README.md` and `docs/user-guide.md`.
3.  **Reverse Sync:** Ensure every command mentioned in `docs/*.md` exists in `.gemini/commands/`.
4.  **Generic Validation:** Check for TOML validity and basic structure rather than specific wording.

---

## 📝 Actionable Recommendations

1.  **Standardize Command Names:** Rename `document.toml` to `docs.toml` OR update all documentation to use `/document`. (Recommendation: Rename to `docs.toml` for brevity and alignment with user expectations).
2.  **Harmonize Documentation:** Update `docs/user-guide.md` to include missing commands (`/scaffold`, `/onboard`) and fix the `/docs` vs `/document` discrepancy.
3.  **Refactor Tests:** Implement a new test file (e.g., `tests/test_sync.py`) that programmatically verifies the 1:1 mapping between implementation and documentation.
4.  **Leaner Assertions:** Remove specific content assertions from `tests/test_review_command.py` to prevent unnecessary maintenance overhead.

---

## 💡 Orchestration Tip
Use the `/plan` command, pointing to this report, to formulate a safe strategy for standardizing command names and refactoring the test suite to ensure long-term maintainability.
