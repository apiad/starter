# OpenCode Template Repository

<div align="center">

[![Release](https://img.shields.io/github/v/release/apiad/opencode?style=for-the-badge&color=blue)](https://github.com/apiad/opencode/releases)
[![License](https://img.shields.io/github/license/apiad/opencode?style=for-the-badge&color=success)](LICENSE)
[![Template](https://img.shields.io/badge/Repository-Template-blueviolet?style=for-the-badge&logo=github)](https://github.com/apiad/opencode/generate)

**Template repository for OpenCode-powered projects.**

*This repository provides templates and configuration for bootstrapping new projects with the OpenCode framework.*

#### [View opencode-core for the framework implementation](https://github.com/apiad/opencode-core)

</div>

---

## Architecture

OpenCode uses a two-repository architecture:

| Repository | Purpose |
|------------|---------|
| [opencode-core](https://github.com/apiad/opencode-core) | Core framework, agents, and commands |
| This repository (opencode) | Templates, configuration, and project bootstrap |

When you initialize a new project, the installation script pulls templates from this repository and links them with the core framework.

---

## Quick Start

The fastest way to bootstrap a new project:

```bash
curl -fsSL https://apiad.github.io/opencode/install.sh | bash
```

### Installation Modes

The installer supports two modes:

| Mode | Description |
|------|-------------|
| `--mode=copy` | Copy framework files (updates require manual sync) |
| `--mode=link` | Symlink to opencode-core (auto-updates with the framework) |

Run `curl -fsSL https://apiad.github.io/opencode/install.sh | bash -s -- --help` for options.

---

## Directory Structure

```
.
├── templates/           # Project templates
│   ├── .gitignore
│   ├── CHANGELOG.md
│   ├── README.md
│   ├── makefile
│   └── tasks.yaml
├── .knowledge/          # Agent knowledge base
│   ├── drafts/
│   ├── log/
│   ├── notes/
│   └── plans/
└── .opencode/          # Framework configuration (installed)
```

---

## For Framework Development

If you're developing the framework itself, see [opencode-core](https://github.com/apiad/opencode-core) for:
- Core agent implementations
- Command definitions
- Framework utilities

---

## License & Contribution

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
