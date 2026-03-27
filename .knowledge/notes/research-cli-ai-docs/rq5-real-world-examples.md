---
id: rq5-real-world-examples
created: 2025-03-27
modified: 2025-03-27
type: research-note
status: active
related: cli-ai-docs
---

# RQ5: Real-World Examples and Case Studies

## Research Question
Which CLI tools are considered "gold standard" for documentation, what patterns do they use, and what can we learn from them?

## Context
Studying exemplary CLI tools reveals practical patterns that work in real-world scenarios.

## Subquestions to Address
1. Which CLI tools are consistently praised for excellent documentation?
2. What specific patterns do tools like git, kubectl, aws-cli, docker use?
3. How do these tools handle complex subcommand hierarchies?
4. What makes their help output AI-friendly?
5. How do they balance human and machine readability?
6. What anti-patterns exist in poorly documented tools?

## Expected Output Areas
- Analysis of 5-10 exemplary CLI tools
- Specific patterns and features that make them AI-friendly
- Comparison of different approaches
- Lessons learned and transferable patterns
- Warning examples of what not to do

## Scout Output

### Executive Summary

This research identifies 10 exemplary CLI tools that represent gold-standard documentation practices. These tools demonstrate patterns that make them both human-friendly and AI-friendly.

---

## 1. Git - The Classic Multi-Command CLI

**Source:** https://git-scm.com/docs/git

### Overview
Git is the canonical example of a complex multi-command CLI tool with extensive documentation.

### Key Documentation Patterns

**Hierarchical Command Structure:**
```
git <command> [<args>]
```

**Help System Design:**
- git --help - Shows main synopsis and command categories
- git help <command> - Opens man page for specific command
- git <command> --help - Alias for git help <command>
- Command categorization (porcelain vs plumbing)

### AI-Friendly Features

1. Consistent man page format - Standard NAME, SYNOPSIS, DESCRIPTION, OPTIONS sections
2. Versioned documentation - Each version has complete documentation at git-scm.com/docs
3. Cross-references - Commands link to related commands and concepts
4. Concept guides - Separate tutorial pages (gittutorial, giteveryday, gitworkflows)
5. Structured help output - git --list-cmds=<group> for programmatic discovery

### Transferable Patterns
- Use standard man page sections for documentation
- Categorize commands by use case in help text
- Provide both quick reference and detailed guides

---

## 2. kubectl - Kubernetes Command-Line Tool

**Source:** https://kubernetes.io/docs/reference/kubectl/

### Overview
kubectl manages Kubernetes clusters with a resource-oriented command structure.

### Key Documentation Patterns

**Resource-Verb Pattern:**
```
kubectl <action> <resource> <name> [flags]
```

### AI-Friendly Features

1. Structured output - JSON/YAML output via -o json|yaml
2. Explain command - kubectl explain <resource> provides schema documentation
3. Dry-run flag - Test commands without executing (server|client|none)
4. Consistent flags - Same flags work across all resources
5. Completion support - Bash, Zsh, Fish auto-completion

### Transferable Patterns
- Provide schema documentation via CLI (explain command)
- Support structured output formats (JSON/YAML)
- Include dry-run capability for destructive operations

---

## 3. AWS CLI - Comprehensive Service Coverage

**Source:** https://docs.aws.amazon.com/cli/latest/userguide/

### Overview
AWS CLI provides access to 200+ AWS services with consistent patterns.

### AI-Friendly Features

1. Consistent patterns - All 200+ services follow same structure
2. JSON input/output - Native support for structured data
3. Dry-run support - --dry-run flag for EC2 commands
4. Pagination control - --page-size, --max-items for large result sets
5. Query language - JMESPath query via --query flag
6. Wait commands - Built-in wait for resource states

### Transferable Patterns
- Use --query for filtering output (JMESPath)
- Support --cli-input-json for complex parameters
- Provide --generate-cli-skeleton for scripting

---

## 4. GitHub CLI (gh) - Modern Developer-Friendly CLI

**Source:** https://cli.github.com/manual/

### Overview
GitHub CLI provides GitHub operations from the command line with excellent UX.

### AI-Friendly Features

1. JSON output - --json flag with field selection
2. Template support - --template for custom output formatting
3. Exit codes - Documented exit codes for scripting
4. Environment variables - All config available as env vars
5. Shell completion - All major shells supported

### Transferable Patterns
- Support --json for all output with field selection
- Document exit codes explicitly
- Provide web manual alongside CLI help

---

## 5. Docker CLI - Container Management

### Overview
Docker CLI manages containers, images, networks, and volumes.

### AI-Friendly Features

1. Structured output - --format with Go templates
2. JSON output - --format using json template
3. Completion - Docker completion scripts
4. Context - Docker contexts for environment switching

### Transferable Patterns
- Use Go templates for flexible output formatting
- Group related commands under management commands

---

## 6. jq - JSON Processor

### Overview
jq is a lightweight JSON processor with excellent documentation.

### AI-Friendly Features

1. Structured by design - JSON in, JSON out
2. Online playground - jqplay.org for testing
3. Compact help - Concise but complete

---

## Comparison Table

| Tool | Pattern | JSON Output | Schema Docs | Dry-Run | Completion | Web Docs |
|------|---------|-------------|-------------|---------|------------|----------|
| git | Multi-command | No | No | Partial | Yes | Yes |
| kubectl | Resource-verb | Yes | Yes | Yes | Yes | Yes |
| aws | Service-action | Yes | No | Yes | Yes | Yes |
| gh | Object-action | Yes | No | No | Yes | Yes |
| docker | Management cmd | Via format | No | No | Yes | Yes |
| jq | Filter | Native | No | N/A | Yes | Yes |

---

## CLI Frameworks That Enable Good Documentation

### Cobra (Go)
**Source:** https://cobra.dev/

Used by: Kubernetes, Docker, GitHub CLI, Hugo, Helm

**Features:**
- Auto-generated help
- Man page generation
- Markdown docs generation
- Shell completion
- Pre/post run hooks

### Click (Python)
**Source:** https://click.palletsprojects.com/

**Features:**
- Arbitrary nesting of commands
- Automatic help page generation
- Lazy loading of subcommands
- Type validation

### Typer (Python)
**Source:** https://typer.tiangolo.com/

**Features:**
- Type hints for automatic validation
- Automatic help generation
- Shell completion
- Rich error messages

### Clap (Rust)
**Source:** https://docs.rs/clap/latest/clap/

**Features:**
- Derive macros for declarative CLI
- Auto-generated help
- Shell completion
- Man page generation
- Rich error messages

### Commander.js (Node.js)
**Source:** https://www.npmjs.com/package/commander

**Features:**
- 276M+ weekly downloads
- Automatic help generation
- TypeScript support
- Custom help text

---

## Anti-Patterns to Avoid

Based on clig.dev guidelines and industry best practices:

### 1. Inconsistent Flag Naming
**Bad:** Using -v for version in one command and verbose in another
**Good:** Reserve -v for one purpose, use --version consistently

### 2. No Structured Output
**Bad:** Only human-readable output with no JSON option
**Good:** Provide --json or -o json for all output

### 3. Undocumented Exit Codes
**Bad:** Returning 1 for all errors
**Good:** Document specific exit codes (0=success, 1=error, 2=misuse)

### 4. Ambiguous Arguments
**Bad:** Positional args without clear naming
**Good:** Use flags for clarity: --source and --dest

### 5. No Help Examples
**Bad:** Help text with only flag descriptions
**Good:** Include EXAMPLES section showing real usage

### 6. Missing Shell Completion
**Bad:** No completion support
**Good:** Provide completion scripts or auto-install

### 7. Poor Error Messages
**Bad:** Error: invalid input
**Good:** Error: --port must be a number between 1-65535

### 8. No Dry-Run Support
**Bad:** Destructive operations execute immediately
**Good:** Provide --dry-run flag to preview changes

---

## AI-Friendly Pattern Checklist

Based on analysis of exemplary tools:

- [ ] Structured Output: Support JSON/YAML output
- [ ] Schema Documentation: Provide command to explain data structures
- [ ] Dry-Run Support: Allow previewing destructive operations
- [ ] Consistent Help Format: Use standard sections NAME SYNOPSIS DESCRIPTION OPTIONS
- [ ] Examples in Help: Show real usage examples
- [ ] Exit Codes: Document all exit codes
- [ ] Shell Completion: Provide for Bash Zsh Fish
- [ ] Environment Variables: Support configuration via env vars
- [ ] Web Documentation: Comprehensive docs online
- [ ] Query Language: Support filtering output
- [ ] Pagination: Handle large result sets consistently
- [ ] Versioned Docs: Documentation for each version

---

## Key Insights

### What Makes Tools AI-Friendly

1. **Structured Output**: JSON/YAML output allows AI to parse and process command results
2. **Schema Documentation**: kubectl's explain command shows how to document data structures
3. **Consistent Patterns**: AWS CLI demonstrates 200+ services can share identical patterns
4. **Help Structure**: Git's man page format provides parseable documentation
5. **Examples**: Real usage examples in help text help AI understand intent
6. **Exit Codes**: Documented exit codes enable reliable scripting
7. **Completion**: Shell completion provides command discovery

### Transferable Patterns for New CLI Tools

1. Use established CLI frameworks (Cobra, Click, Typer, Clap, Commander.js)
2. Implement --json flag for all list output commands
3. Provide --dry-run for destructive operations
4. Document exit codes in help text
5. Use standard man page sections
6. Include EXAMPLES in every command help
7. Support shell completion
8. Maintain web documentation alongside CLI help

### Sources

- https://git-scm.com/docs/git
- https://kubernetes.io/docs/reference/kubectl/
- https://docs.aws.amazon.com/cli/latest/userguide/
- https://cli.github.com/manual/
- https://clig.dev/
- https://cobra.dev/
- https://click.palletsprojects.com/
- https://typer.tiangolo.com/
- https://docs.rs/clap/latest/clap/
- https://www.npmjs.com/package/commander
