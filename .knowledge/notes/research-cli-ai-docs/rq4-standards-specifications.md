---
id: rq4-standards-specifications
created: 2025-03-27
modified: 2025-03-27
type: research-note
status: active
related: cli-ai-docs
sources:
  - https://www.gnu.org/prep/standards/standards.html
  - https://clig.dev/
  - https://en.wikipedia.org/wiki/Command-line_interface
  - https://modelcontextprotocol.io/specification
  - https://ietf.org/blog/agentic-ai-standards
  - https://man7.org/linux/man-pages/man3/getopt.3.html
  - https://json-schema.org/
  - https://cobra.dev/
  - https://opentelemetry.io/docs/
---

# RQ4: Standards and Specifications

## Research Question
What industry standards exist for CLI documentation, are there AI-specific standards emerging, and what tools help generate compliant docs?

## Context
Standards ensure consistency and interoperability. Understanding existing standards helps identify gaps for AI agent compatibility.

---

## Scout Output - Complete Research Findings

### 1. POSIX and GNU Standards

#### POSIX.1-2008/2017 Command-Line Interface Standards

**Key Specifications:**
- **POSIX.1-2008** (IEEE Std 1003.1-2008) defines standard command-line interface conventions
- **Utility Syntax Guidelines** (Guidelines 1-10): Standard conventions for utilities
  - Utility names: 2-9 characters, lowercase alphanumeric
  - Options: single-dash with single character (`-a`), may be grouped (`-abc`)
  - Arguments: required vs optional, positioning
  - Option-argument separators: space or no space (`-o arg` or `-oarg`)
  - Special argument `--` terminates option processing
  - Source: [The Open Group](https://pubs.opengroup.org/onlinepubs/9699919799/)

**getopt() Standard Behavior:**
- POSIX-compliant option parsing
- Environment variable `POSIXLY_CORRECT` enforces strict POSIX behavior
- From man pages: "POSIX specifies that the argv array argument should be const"
- Source: [Linux Man Pages](https://man7.org/linux/man-pages/man3/getopt.3.html)

#### GNU Coding Standards (2025 Update)

**Critical CLI Requirements:**

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| `--version` | Print program name, version, copyright, license | Mandatory for all GNU programs |
| `--help` | Display usage info, then exit | Must ignore other options when present |
| Long options | Full word equivalents to short options | Via getopt_long() |
| Exit codes | 0=success, non-zero=failure | Scripts depend on this |
| Error messages | "program: file:line: message" format | Machine-parseable |

**GNU Extension Highlights:**
- Options can appear anywhere in command line (not just before arguments)
- `getopt_long()` and `getopt_long_only()` for long option support
- `+` and `-` prefixes in optstring for special parsing modes
- Source: [GNU Coding Standards](https://www.gnu.org/prep/standards/standards.html)

#### Table of GNU Standard Long Options

Common long options from GNU standards:
- `--all` (equivalent to `-a`)
- `--append` (equivalent to `-a`)
- `--backup` (make backups)
- `--directory` (equivalent to `-d`)
- `--exclude` (exclude patterns)
- `--force` (equivalent to `-f`)
- `--help` (help message)
- `--interactive` (prompt before action)
- `--quiet` (equivalent to `-q`)
- `--recursive` (equivalent to `-r`)
- `--verbose` (equivalent to `-v`)
- `--version` (version information)

---

### 2. Modern CLI Guidelines (clig.dev)

**The Command Line Interface Guidelines** ([clig.dev](https://clig.dev/)) is the most authoritative modern CLI design standard, authored by Aanand Prasad (Docker Compose), Ben Firshman (Replicate), Carl Tashian (Smallstep), and Eva Parish (Squarespace).

**Core Philosophy:**
- **Human-first design**: "If a command is going to be used primarily by humans, it should be designed for humans first"
- **Simple parts that work together**: Composability via pipes, stdin/stdout/stderr
- **Consistency across programs**: Users should be able to guess functionality
- **Conversation as the norm**: CLI as a conversation, not a one-shot interaction

**Documentation Requirements:**

```
1. Built-in help text (concise by default, extensive with --help)
2. Web-based documentation (searchable, linkable)
3. Terminal-based documentation (man pages via help subcommand)
4. Man pages (traditional Unix standard)
5. Examples first in help text
6. Common flags displayed first
7. Spelling suggestions for typos
8. Support path/link to web docs in help
```

**Standard Flag Names (Industry Conventions):**

| Flag | Meaning | Example Tools |
|------|---------|-----------------|
| `-a`, `--all` | Include all files/targets | `ps`, `ls` |
| `-d`, `--debug` | Debug output | Various |
| `-f`, `--force` | Force action without prompts | `rm -f` |
| `-h`, `--help` | Help message | Universal |
| `-n`, `--dry-run` | Show what would happen | `rsync`, `git` |
| `-o`, `--output` | Output file | `sort`, `gcc` |
| `-p`, `--port` | Network port | `psql`, `ssh` |
| `-q`, `--quiet` | Suppress output | Various |
| `-u`, `--user` | Username | `ps`, `ssh` |
| `-v`, `--verbose` | Verbose output | Various |
| `--version` | Version info | Universal |
| `--json` | JSON output | Modern tools |
| `--no-input` | Non-interactive mode | CI/automation |

**Recommended CLI Frameworks by Language:**

| Language | Framework | Notable Users |
|----------|-----------|---------------|
| Go | Cobra, urfave/cli | Kubernetes, Docker, GitHub CLI |
| Rust | clap | fd, bat, ripgrep |
| Python | Click, Typer, Argparse | Flask, Black, Modern Python CLI |
| Node.js | oclif, commander | Heroku CLI, ESLint |
| Java | picocli | Spring Boot CLI |
| Kotlin | clikt | Detekt, Gradle plugins |
| Swift | swift-argument-parser | Swift Package Manager |
| Haskell | optparse-applicative | Stack, Pandoc |
| Bash | argbash | - |

---

### 3. AI-Specific Standards and Emerging Initiatives

#### Model Context Protocol (MCP)

**Status:** Active specification (2025-11-25 is current version)

**Purpose:** "An open protocol that standardizes how applications provide context to LLMs"

**Relevant to CLI Documentation:**
- MCP defines schemas for tool descriptions
- Tools include "description" field for AI consumption
- JSON Schema-based type definitions
- Server capabilities discovery mechanism

**Key Schema Elements for CLI-like Tools:**
```typescript
// MCP Tool definition includes:
interface Tool {
  name: string;
  description?: string;  // <-- Critical for AI
  inputSchema: object;   // JSON Schema for arguments
}
```

**Resources:**
- Spec: [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification)
- GitHub: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
- Schema: JSON Schema in TypeScript with JSON export

#### IETF Agentic AI Communications Standards Initiative

**Blog Post:** "Agentic AI communications: Identifying the standards we need" (IETF, Feb 2025)

**Key Points:**
- IETF has identified need for standards in AI agent communication
- Focus on "interoperability between AI systems"
- Agent-to-agent communication protocols under consideration
- Security and identity for AI agents being discussed
- Source: [IETF Blog](https://www.ietf.org/blog/agentic-ai-standards/)

#### IETF AIPREF Working Group

**Focus:** "Enabling Publishers to Express Preferences for AI Crawlers"
- Machine-readable preferences for AI access
- Robots.txt extensions for AI crawlers
- Related to documentation discoverability

**Status:** Active working group (2025)

#### OpenTelemetry Semantic Conventions

**Gen AI Attributes:**
- `gen_ai.system`: AI system identifier
- `gen_ai.request.model`: Model name
- `gen_ai.usage.input_tokens`: Token counts
- `gen_ai.response.finish_reason`: Completion status

**Implication for CLI:** If CLI tools interact with AI, should expose these attributes
- Source: [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/)

#### No Existing CLI-for-AI Standard

**Gap Identified:** As of March 2025, there is **no industry-wide standard** specifically for:
- Machine-readable CLI documentation
- AI-consumable command descriptions
- Structured help output formats
- Tool description schemas for AI agents

**Opportunity:** This is an emerging area with no established dominant standard.

---

### 4. Documentation Generation Tools by Ecosystem

#### Language-Specific Documentation Generators

**Go Ecosystem:**
| Tool | Output | Features |
|------|--------|----------|
| Cobra | Markdown, Man pages, Bash/Zsh/Fish completion | Automatic help generation, doc.GenMarkdownTree() |
| urfave/cli | Markdown, Man pages | Basic help generation |

**Cobra Example:**
```go
doc.GenMarkdownTree(rootCmd, "./docs")
// Generates markdown docs from CLI structure
// Also generates shell completions automatically
```

**Python Ecosystem:**
| Tool | Output | Features |
|------|--------|----------|
| Sphinx + Click | HTML, Markdown, Man pages | Autodoc extension for Click |
| Typer | Rich help, Markdown | Rich text, automatic help |
| Argparse | Plain text | Built-in help formatter |
| docopt | Usage strings | Parses from docstrings |

**Rust Ecosystem:**
| Tool | Output | Features |
|------|--------|----------|
| clap | Markdown, Man pages, Shell completion | Built-in with `clap_complete` |
| structopt | Same as clap | Derive macros |
| argh | Minimal | Minimal help |

**Node.js Ecosystem:**
| Tool | Output | Features |
|------|--------|----------|
| oclif | Markdown, Man pages, README | Auto-generated docs |
| commander.js | Plain text | Basic help |
| yargs | Plain text, JSON | Completion support |

#### Cross-Platform Solutions

**ronn** - Man page generator from Markdown
- Converts Markdown to man pages (nroff)
- Also generates HTML
- Used by: Homebrew, many GitHub projects

**help2man** - Auto-generate man pages from --help output
- Reads `--help` and `--version` output
- Generates man pages automatically
- Good for legacy projects

**asciinema** - Terminal session recorder
- Records and replays terminal sessions
- ASCII cast format
- Good for creating interactive documentation

#### Modern Doc Generation Patterns

**LLM-Ready Documentation (Cobra Pattern):**
- Markdown generation from command tree
- Structured format with examples
- Links to web documentation
- Schema-aware output

**Pattern emerging from AI compatibility:**
```markdown
## Command Reference

### `command-name`

**Description:** Clear description of what this does

**Usage:** `app command-name [flags] [args]`

**Flags:**
| Flag | Type | Description |
|------|------|-------------|
| `-f`, `--file` | string | Input file path |

**Examples:**
\`\`\`bash
# Basic usage
app command-name input.txt

# With flags
app command-name -f input.txt --verbose
\`\`\`
```

---

### 5. Schemas and Ontologies

#### JSON Schema

**Current Version:** Draft 2020-12

**Relevance:** 
- Can describe CLI argument structures
- Type-safe documentation
- Validation of CLI inputs
- Tool: [json-schema.org](https://json-schema.org/)

**Example CLI Schema:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "input": {"type": "string", "description": "Input file path"},
    "verbose": {"type": "boolean", "description": "Enable verbose output"},
    "count": {"type": "integer", "description": "Number of items"}
  },
  "required": ["input"]
}
```

#### Model Context Protocol Schema

**TypeScript-first, JSON Schema export:**
```typescript
// Defined in TypeScript, exported as JSON Schema
// Schema version: 2025-11-25 (current)
// Location: schema/2025-11-25/schema.json
```

**Key for CLI Tools:** MCP schema includes structured tool definitions that could be adapted for CLI documentation.

#### OpenAPI/Swagger

**Status:** OAS 3.1 (OpenAPI Specification)
- Used for API documentation
- Could be adapted for CLI documentation
- Supports external documentation links
- JSON Schema compatible

#### No CLI-Specific Ontology Found

**Research Finding:** No widely-adopted formal ontology specifically for CLI interfaces exists. Closest equivalents:
- POSIX utility conventions (informal grammar)
- docopt usage pattern syntax
- man page markup (troff/nroff macros)

---

### 6. Standards Organizations

| Organization | Role | Contact |
|--------------|------|---------|
| **IETF** | Internet standards, emerging AI agent comms | [ietf.org](https://www.ietf.org/) |
| **The Open Group** | POSIX standards | [opengroup.org](https://opengroup.org/) |
| **ISO/IEC JTC 1/SC 22** | Programming language standards | [iso.org](https://iso.org/) |
| **GNU Project** | GNU coding standards | [gnu.org](https://gnu.org/) |
| **JSON Schema Org** | JSON Schema specification | [json-schema.org](https://json-schema.org/) |
| **Anthropic (MCP)** | Model Context Protocol | [modelcontextprotocol.io](https://modelcontextprotocol.io/) |
| **OpenTelemetry** | Observability standards | [opentelemetry.io](https://opentelemetry.io/) |

**Key Contacts for AI Standards:**
- IETF: Working groups via [datatracker.ietf.org](https://datatracker.ietf.org/)
- MCP: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) (Discord, GitHub Discussions)
- OpenTelemetry: Community meetings listed at [opentelemetry.io](https://opentelemetry.io/)

---

### 7. Compliance Checkers and Validators

#### POSIX Compliance

**Checkers:**
- `checkposix` - POSIX compliance checker (part of POSIX test suites)
- Manual verification against POSIX.1-2017
- Most practical: Test with `POSIXLY_CORRECT=1` environment variable

**getopt compliance:**
```c
// Set to test POSIX-only behavior
setenv("POSIXLY_CORRECT", "1", 1);
```

#### GNU Standards Compliance

**Checkers:**
- **Gnulib** - GNU portability library with standard conformance
- **hello** - GNU Hello is the reference example of GNU standards
- Manual checklist from GNU Coding Standards

#### CLI Guidelines Compliance (clig.dev)

**No automated checker exists** - Manual verification required against:
- Help text formatting
- Flag naming conventions
- Exit code usage
- Error message formatting

**Test approach:**
1. Run `--help` - verify it displays
2. Run `-h` - verify it displays same help
3. Run `--version` - verify format matches GNU
4. Run with bad arguments - verify helpful error
5. Test exit codes (0 vs non-zero)

#### Documentation Quality Checkers

**markdownlint** - Markdown linting
**Vale** - Prose linting (style guide enforcement)
**write-good** - English prose suggestions
**alex** - Insensitive language checker

#### JSON Schema Validation

**Tools:**
- **ajv** (Another JSON Schema Validator) - JavaScript
- **jsonschema** - Python
- **go-jsonschema** - Go
- **jsonschema-rs** - Rust
- Online: [jsonschemavalidator.net](https://www.jsonschemavalidator.net/)

---

### 8. Ecosystem-Specific CLI Conventions

#### Go Conventions

**Cobra (most popular):**
- Commands organized in tree structure
- Persistent flags vs local flags
- Pre/post-run hooks
- Automatic help generation
- Shell completion support
- Markdown documentation generation

**Standard pattern:**
```go
rootCmd.AddCommand(subCmd)
rootCmd.PersistentFlags().StringP("config", "c", "", "config file")
subCmd.Flags().StringP("input", "i", "", "input file")
```

#### Python Conventions

**Click (Pallets project):**
- Decorator-based commands
- Automatic help generation
- Type conversion
- Progress bars (Click-Progress)
- Shell completion

**Typer (modern):**
- Python type hints define CLI
- Automatic --help from docstrings
- Rich text output support

**Standard pattern:**
```python
import typer

app = typer.Typer()

@app.command()
def hello(name: str, verbose: bool = False):
    """Say hello to NAME."""  # <- Becomes help text
    ...
```

#### Rust Conventions

**clap (most popular):**
- Derive macros for declarative CLI
- Built-in help generation
- Shell completion generation
- Man page generation
- Error message formatting
- YAML config support

**Standard pattern:**
```rust
use clap::Parser;

#[derive(Parser)]
#[command(about, version)]
struct Cli {
    #[arg(short, long)]
    input: String,
}
```

#### Node.js Conventions

**oclif (Heroku/Slack):**
- Plugin architecture
- TypeScript support
- Automatic README generation
- Help documentation
- Testing utilities

**Standard pattern:**
```typescript
import {Command, Flags} from '@oclif/core'

export default class MyCommand extends Command {
  static description = 'describe the command here'
  static flags = {
    file: Flags.string({char: 'f', description: 'file to read'}),
  }
}
```

---

### 9. Gaps and Opportunities for AI-Compatible CLI Documentation

#### Identified Gaps:

1. **No Machine-Readable Help Standard**
   - `--help` output is human-readable, not structured
   - No standard JSON/XML/YAML help output format
   - Opportunity: Define `--help-json` or similar convention

2. **No CLI Capability Discovery**
   - No standard way to discover what a CLI can do programmatically
   - Compare to: MCP server capability discovery
   - Opportunity: Define `--capabilities` flag or similar

3. **No Semantic Documentation Standard**
   - Descriptions in help are unstructured text
   - No standard for parameter semantics
   - Opportunity: Structured descriptions with examples

4. **No Execution Schema**
   - No standard way to describe "this command runs a build"
   - Missing: input/output contracts, side effects
   - Opportunity: Command taxonomy/schema

5. **Limited AI Training Data**
   - CLIs are not typically documented in AI-consumable ways
   - Opportunity: Generate MCP-compatible tool definitions from CLI structure

#### Emerging Solutions:

1. **Cobra's LLM-Ready Generation**
   - Pattern: `doc.GenMarkdownTree()` for structured output
   - Could be extended to generate MCP tool definitions

2. **MCP Tool Definition Pattern**
   - JSON Schema-based
   - Description + input schema
   - Could be adapted for CLI documentation

3. **OpenAPI for CLIs**
   - Some projects mapping CLI to OpenAPI
   - Provides machine-readable structure

---

### 10. Key Citations and References

**Primary Sources:**

1. GNU Coding Standards (2025 update)
   - URL: https://www.gnu.org/prep/standards/standards.html
   - Sections: 4.8 (Command Line Interfaces), 4.10 (Table of Long Options)

2. Command Line Interface Guidelines (clig.dev)
   - Authors: Aanand Prasad, Ben Firshman, Carl Tashian, Eva Parish
   - URL: https://clig.dev/
   - Sections: The Basics, Help, Documentation, Arguments and flags

3. POSIX.1-2008 Base Specifications
   - URL: https://pubs.opengroup.org/onlinepubs/9699919799/
   - Section: Base Definitions, Chapter 12 (Utility Conventions)

4. getopt(3) Linux Manual Page
   - URL: https://man7.org/linux/man-pages/man3/getopt.3.html
   - Details: getopt_long, getopt_long_only, POSIXLY_CORRECT behavior

5. Model Context Protocol Specification
   - URL: https://modelcontextprotocol.io/specification
   - Current version: 2025-11-25
   - Schema: TypeScript with JSON Schema export

6. IETF Agentic AI Communications Blog
   - URL: https://www.ietf.org/blog/agentic-ai-standards/
   - Date: February 2025

7. JSON Schema
   - URL: https://json-schema.org/
   - Current draft: 2020-12

8. Cobra CLI Framework
   - URL: https://cobra.dev/
   - GitHub: https://github.com/spf13/cobra
   - Users: Kubernetes, Docker, GitHub CLI

9. OpenTelemetry Semantic Conventions
   - URL: https://opentelemetry.io/docs/specs/semconv/
   - Relevant: Gen AI attributes, CLI semantic conventions

10. Command Line Interface - Wikipedia
    - URL: https://en.wikipedia.org/wiki/Command-line_interface
    - History, conventions, option syntax

---

## Summary

**Current State of CLI Standards:**
- POSIX/GNU standards are mature but focused on human readability, not AI consumption
- Modern CLI guidelines (clig.dev) provide excellent human-first principles
- **No existing standard specifically for AI-consumable CLI documentation**
- MCP provides a potential pattern for how AI-compatible CLI docs could work

**Documentation Tools Ecosystem:**
- Mature per-language frameworks (Cobra, Click, clap, oclif)
- All generate human-readable help, few generate structured/machine-readable
- Markdown is the common denominator for documentation

**AI-Specific Standards:**
- MCP is the most relevant emerging standard
- IETF is exploring agentic AI communications
- Gap exists for CLI-to-AI bridge standards

**Recommendation:** 
The opportunity exists to define a new standard or convention for AI-consumable CLI documentation, potentially by:
1. Extending existing tools to generate structured output (JSON schema of commands)
2. Following MCP's pattern for tool definitions
3. Proposing a new `--help` format (e.g., `--help-json`) convention
