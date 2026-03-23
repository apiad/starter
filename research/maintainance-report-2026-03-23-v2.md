# Maintenance Report Card - 2026-03-23 (v2)

## Executive Summary
This second audit focused on the **lenient structural testing** of all commands and agents. While the initial synchronization tests (`tests/test_sync.py`) were a significant improvement, many commands and agents still lack basic structural verification. Furthermore, some tests remain brittle by asserting on specific prompt content.

---

## 🛠️ Testing Inventory & Gaps

### Commands (.gemini/commands/) - 15 Total
- **Covered (5):** `review`, `maintenance`, `draft`, `plan`, `document`. (Through `test_review_command.py` and `test_sync.py`)
- **Missing (10):** `commit`, `cron`, `debug`, `issues`, `learn`, `onboard`, `release`, `research`, `scaffold`, `task`.
- **Gaps:** No basic TOML validity or key presence (`description`, `prompt`) checks for these commands.

### Agents (.gemini/agents/) - 6 Total
- **Covered (3):** `reviewer`, `planner`, `writer`. (Through `test_review_command.py`)
- **Missing (3):** `debugger`, `learner`, `researcher`.
- **Gaps:** No basic Markdown structure (e.g., presence of a title or specific name in frontmatter) checks for these agents.

---

## 🔍 Synchronization Issues

### 1. Brittle Documentation Skips
- **Issue:** `tests/test_sync.py` contains hardcoded skips for `scaffold` and `onboard` regarding their presence in `docs/user-guide.md`.
- **Impact:** If these commands are ever removed or renamed, the tests won't catch it. The documentation should be updated, and the skips removed.

### 2. Brittle Content Matching
- **Issue:** `tests/test_review_command.py` still checks for specific strings like `"codebase_investigator"` or `"Maintenance Report Card"`.
- **Impact:** Small wording changes in the prompts will break the tests unnecessarily.

---

## 📝 Actionable Recommendations

### 1. Unified Dynamic Testing Strategy
Implement a new test file, `tests/test_structure.py`, that uses `pytest.mark.parametrize` to dynamically discover and test all files in `.gemini/commands/` and `.gemini/agents/`.

#### **Command Requirements (Lenient):**
- Must be valid TOML.
- Must contain `description` (string) and `prompt` (string) keys.
- Prompt must not be empty.

#### **Agent Requirements (Lenient):**
- Must be valid Markdown.
- Must contain the agent's name (case-insensitive) in the content or as a header.
- Should contain a `tools` section (if relevant to the framework's schema).

### 2. Cleanup `tests/test_review_command.py`
- Move generalized structural tests to the new dynamic suite.
- Keep only migration-specific tests (e.g., checking that `editor.md` or `revise.toml` no longer exist).

### 3. Finalize Documentation Sync
- Ensure `scaffold` and `onboard` are fully documented in `docs/user-guide.md`.
- Remove the hardcoded skips from `tests/test_sync.py`.

---

## 💡 Orchestration Tip
Use the `/plan` command, pointing to this report, to formulate a strategy for implementing `tests/test_structure.py`. This will provide "blanket" coverage for all current and future commands/agents with minimal maintenance overhead.
