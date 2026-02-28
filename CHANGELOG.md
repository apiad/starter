# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-02-28

### Added
- Refactored the `/research` command into a robust 3-phase workflow using specialized `researcher` and `reporter` subagents.
- Rewrote the `README.md` to explain the opinionated framework, the agent's behavior, hooks, commands, journaling, and the project initialization workflow.

### Changed
- Improved the `/release` command logic to include `README.md` updates and fix formatting issues.

## [0.2.0] - 2026-02-28

### Added
- Added a new `/scaffold` command for project initialization with modern tooling (e.g., Python/uv, JS/npm).

### Changed
- Updated the `/release` command to include updating `README.md` and fixed a minor typo.

## [0.1.0] - 2026-02-28

### Added
- Consolidated `/task/*` commands into a single `/task` command in `.gemini/commands/task.toml`.
- Enhanced `/release` command to include version update steps.
- Initial project task tracking with `TASKS.md`.
- Daily journal tracking in `journal/`.

### Changed
- Refactored `.gemini/hooks/welcome.py` to include new commands.
- Simplified `GEMINI.md` to a cleaner starter template.
- Updated `.gemini/commands/release.toml` to include dependency and source version updates.

### Fixed
- Typo in `release.toml` formatting.
