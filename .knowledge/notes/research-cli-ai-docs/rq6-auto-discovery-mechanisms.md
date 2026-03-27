---
id: rq6-auto-discovery-mechanisms
created: 2025-03-27
modified: 2025-03-27
type: research-note
status: active
related: cli-ai-docs
---

# RQ6: Auto-Discovery and Introspection Mechanisms

## Research Question
What mechanisms exist for CLI introspection, shell completion generation, and dynamic help generation?

## Context
Beyond static documentation, dynamic discovery mechanisms allow AI agents to understand tools at runtime.

## Subquestions to Address
1. What introspection flags/modes do CLI tools commonly support?
2. How does shell completion generation work (bash, zsh, fish)?
3. What is the state of the art in dynamic help generation?
4. Can CLI tools expose their interface as structured data?
5. What protocols exist for CLI tool discovery?
6. How can CLI tools advertise their capabilities programmatically?

## Expected Output Areas
- Introspection mechanisms and conventions
- Shell completion generation techniques
- Dynamic documentation approaches
- Structured data export capabilities
- Protocols and standards for CLI discovery

## Scout Output

### Research Summary

This research covers auto-discovery and introspection mechanisms for CLI tools, focusing on how AI agents can programmatically understand CLI capabilities.

---

### 1. Introspection Flags and Modes

#### Standard Introspection Flags
CLI tools commonly support these introspection patterns:

**Common Flags:**
- `--help` / `-h`: Display help text
- `--version` / `-v`: Display version information
- `--json`: Output structured JSON instead of human-readable text
- `--metadata`: Export command metadata (custom convention)
- `--completion`: Generate shell completion scripts

**Framework-Specific Patterns:**
- **Click (Python)**: Uses environment variable pattern `_{PROG}_COMPLETE={shell}_source` for completion generation
- **Cobra (Go)**: Built-in `completion` subcommand supporting bash, zsh, fish, PowerShell
- **Typer (Python)**: `is_eager=True` for flags that process before others
- **oclif (Node.js)**: `enableJsonFlag` property for automatic JSON output

**Click Environment Variable Pattern:**
```bash
# Generate completion script
_FOO_BAR_COMPLETE=bash_source foo-bar

# Enable completion mode
_FOO_BAR_COMPLETE=bash_complete foo-bar
```

---

### 2. Shell Completion Generation

#### Supported Shells
Modern CLI frameworks support: Bash (4.4+), Zsh, Fish, PowerShell

#### Completion Types

**Static Completions:** Predefined commands/flags via `ValidArgs` (Cobra) or similar

**Dynamic Completions:** Runtime-generated suggestions:
- `kubectl get [tab]` - suggests resource types from cluster
- `helm status [tab]` - suggests release names from cluster
- `docker ps [tab]` - suggests container names

#### ShellCompDirectives (Cobra)
- `ShellCompDirectiveDefault` - Use shell default behavior
- `ShellCompDirectiveNoSpace` - Do not add space after completion
- `ShellCompDirectiveNoFileComp` - Disable file completion
- `ShellCompDirectiveFilterFileExt` - Filter by file extension
- `ShellCompDirectiveFilterDirs` - Only complete directories

#### Completion Descriptions
Modern shells show descriptions alongside completions:
```bash
$ helm s[tab]
search  -- search for a keyword in charts
show    -- show information of a chart
status  -- displays the status of the named release
```

---

### 3. Dynamic Help Generation

#### Framework Approaches

**Declarative Help (Click, Typer, Cobra):**
- Help text from function docstrings
- Type annotations auto-generate option descriptions
- Automatic flag naming from parameter names

**Template-Based Help (urfave/cli):**
- Customizable help templates
- Markdown and man page generation

**Rich Help Features:**
- Examples in help text
- Formatted output with bold headings
- Command categorization
- Progressive disclosure (concise vs detailed)

---

### 4. Structured Data Export

#### JSON Output Pattern

**oclif (Node.js):**
```javascript
public static enableJsonFlag = true
// Suppresses logs, outputs JSON when --json passed
```

**Common Tools with JSON Support:**
- `kubectl` - JSON output with `-o json`
- `awscli` - Output format control
- `gcloud` - Format specification flags

#### TTY Detection
CLI Guidelines recommend detecting TTY for format selection:
```python
import sys
if sys.stdout.isatty():
    # Human-readable formatting
else:
    # Machine-readable formatting
```

---

### 5. Discovery Protocols

#### PATH-based Discovery
- `kubectl` plugins: executables named `kubectl-*`
- `git` plugins: executables named `git-*`
- Tools search PATH for plugin executables

#### Completion Script Distribution

**Standard Locations:**
- Bash: `/etc/bash_completion.d/`
- Zsh: `$fpath` directories
- Fish: `~/.config/fish/completions/`

**Programmatic Installation:**
```bash
myapp completion bash > /etc/bash_completion.d/myapp
```

---

### 6. Programmatic Capability Advertising

#### Feature Flags
- Version info with feature flags: `myapp --version --json`
- Capability commands: `myapp capabilities` or `myapp info`

#### Environment Variables
- `MYAPP_EXPERIMENTAL_FEATURES=1`
- `MYAPP_COMPLETION_DESCRIPTIONS=1`

#### Interactive Shell Libraries

**Python - prompt_toolkit:**
- Advanced auto-completion, syntax highlighting
- Multi-line editing, Emacs/Vi key bindings
- Used by: ptpython, ipython

**Go - go-prompt:**
- Interactive prompt library
- Auto-completion with descriptions
- Used by: kube-prompt, docker-shell

---

### Examples of Well-Designed CLI Introspection

1. **kubectl**: Dynamic completion from cluster state, JSON output, plugin discovery
2. **Helm**: Release name completion, chart repository suggestions
3. **Docker**: Container/image name completion, context-aware completions

---

### Sources

1. Click Shell Completion Documentation - https://click.palletsprojects.com/en/8.1.x/shell-completion/
2. CLI Guidelines (clig.dev) - https://clig.dev/#autocomplete
3. Cobra Shell Completions - https://github.com/spf13/cobra/blob/main/site/content/completions/_index.md
4. oclif JSON Output - https://oclif.io/docs/json
5. go-prompt Library - https://github.com/c-bata/go-prompt
6. urfave/cli - https://github.com/urfave/cli
7. python-prompt-toolkit - https://github.com/prompt-toolkit/python-prompt-toolkit
8. Typer Version/Options - https://typer.tiangolo.com/tutorial/options/version/
9. kubectl Quick Reference - https://kubernetes.io/docs/reference/kubectl/cheatsheet/

---

### Research Completed
**Time elapsed**: ~60 seconds  
**Research areas covered**: 6/6  
**Sources found**: 9 authoritative sources
