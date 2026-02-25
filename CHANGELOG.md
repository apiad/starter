# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Created a comprehensive `deep-research` Gemini CLI skill for structured, iterative research using `codebase_investigator` and `online_researcher`.
- Packaged and installed the `deep-research` skill in the workspace scope.
- Updated the `.gemini/commands/research.toml` to explicitly invoke the `deep-research` skill.
- Added a new `online_researcher` agent definition in `.gemini/agents/`.
- Enabled `enableAgents` in `.gemini/settings.json`.

### Changed
- Refactored `GEMINI.md` to include a project overview, technical stack, and recent progress updates.
- Documented Skill Development & Distribution workflows in `GEMINI.md`.
- Updated `CHANGELOG.md` and `journal/2026-02-25.md` with recent documentation improvements.
