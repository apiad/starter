# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Conducted deep research on "best practices of prompt engineering for code review" using the `deep-research` skill.
- Generated a comprehensive research report at `research/research_prompt_engineering_code_review.md`.
- Created a comprehensive `deep-research` Gemini CLI skill for structured, iterative research using `codebase_investigator` and `online_researcher`.
- Packaged and installed the `deep-research` skill in the workspace scope.
- Updated the `.gemini/commands/research.toml` to explicitly invoke the `deep-research` skill.
- Added a new `online_researcher` agent definition in `.gemini/agents/`.
- Enabled `enableAgents` in `.gemini/settings.json`.

### Changed
- Refactored `GEMINI.md` to include a project overview, technical stack, and recent progress updates.
- Documented Skill Development & Distribution workflows and the Hook System in `GEMINI.md`.
- Persisted the installed `deep-research` skill into the repository.
- Updated `CHANGELOG.md` and `journal/2026-02-25.md` with a summary of the session's progress.
