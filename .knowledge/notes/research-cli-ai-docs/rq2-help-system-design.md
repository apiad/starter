---
id: rq2-help-system-design
created: 2025-03-27
modified: 2025-03-27
type: research-note
status: active
related: cli-ai-docs
---

# RQ2: Help System Design Patterns

## Research Question
What are best practices for --help output structure, organization of commands/flags/options, and the role of exit codes and error messages?

## Context
The help system is often the primary interface AI agents use to discover CLI capabilities. Well-structured help output is crucial for AI comprehension.

## Scout Output

### Executive Summary

Help system design patterns center on POSIX.1-2017 guidelines and GNU Coding Standards, with modern best practices from clig.dev emphasizing human-first design. Key findings:

- **Help output** should follow a standard structure: NAME, SYNOPSIS, DESCRIPTION, OPTIONS, EXAMPLES, EXIT STATUS sections
- **Exit codes** follow either POSIX (0=success, non-zero=failure) or BSD sysexits.h (64-78 for specific errors)
- **Flag documentation** requires: short/long forms, descriptions, default values, and whether required
- **AI-parseable patterns** include: consistent section headers, tabular flag formatting, machine-readable `--json` output flags, and predictable synopsis notation
- **Subcommands** should be discoverable through grouped help output and support hierarchical help (`cmd help subcmd`)

---

### 1. POSIX and GNU Standards

#### POSIX.1-2017 Utility Conventions (IEEE Std 1003.1-2017)

**Utility Argument Syntax Notation:**
```
utility_name[-a][-b][-c option_argument][-d|-e][-f[option_argument]][operand...]
```

**Key POSIX Requirements:**
- Options are single alphanumeric characters preceded by `-` (Guideline 3)
- All options must precede operands (Guideline 9)
- `--` serves as delimiter indicating end of options (Guideline 10)
- Order of different options should not matter (Guideline 11)
- Options without option-arguments can be grouped: `-abc` equivalent to `-a -b -c` (Guideline 5)

**14 Utility Syntax Guidelines (Section 12.2):**

| Guideline | Requirement |
|-----------|-------------|
| 1 | Utility names: 2-9 characters |
| 2 | Lowercase letters and digits only |
| 3 | Single alphanumeric character options |
| 4 | `-` delimiter before options |
| 5 | Grouping options without arguments |
| 6 | Separate arguments for options |
| 7 | Option-arguments should not be optional |
| 8 | Multiple option-arguments as comma-separated |
| 9 | Options precede operands |
| 10 | `--` as end-of-options delimiter |
| 11 | Option order independence |
| 12 | Operand order may matter |
| 13 | `-` operand means stdin/stdout |
| 14 | Arguments starting with `-` treated as options |

#### GNU Coding Standards

**Required Standard Options:**
- `--version`: Display version information
- `--help`: Display help text

**GNU-Specific Conventions:**
- Provide long-named options equivalent to single-letter options
- Use `getopt_long` for parsing
- Permits options anywhere among arguments (GNU extension, not POSIX)
- Output files should be specified via options (`-o`, `--output`), not operands
- Consistency across GNU programs (e.g., `--verbose` always means verbose)

---

### 2. Help Output Structure

#### Standard Sections (per clig.dev and POSIX)

**1. Header/NAME**
- Command name and brief one-line description
- Version information (optional)

**2. SYNOPSIS**
- Formal syntax using POSIX notation
- Shows all options and operands
- Indicates option-arguments and optional elements

**3. DESCRIPTION**
- What the command does
- Key concepts and terminology
- When to use it

**4. OPTIONS/FLAGS**
- All available flags with descriptions
- Short and long forms
- Default values
- Required flags marked explicitly

**5. ARGUMENTS/OPERANDS**
- Positional parameters
- Required vs optional
- Value constraints

**6. EXAMPLES**
- Common use cases first
- Show both input and expected output
- Build complexity progressively

**7. EXIT STATUS**
- List of exit codes and meanings
- Reference to sysexits.h if applicable

**8. ENVIRONMENT**
- Environment variables that affect behavior

**9. FILES**
- Configuration files used
- Related files

**10. SEE ALSO**
- Related commands
- Documentation links

#### Best Practice Example (Heroku CLI):

```
$ heroku apps --help
list your apps

USAGE
  $ heroku apps

OPTIONS
  -A, --all          include apps in all teams
  -p, --personal     list apps in personal account
  -s, --space=space  filter by space
  --json             output in json format

EXAMPLES
  $ heroku apps
  === My Apps
  example
  example2

COMMANDS
  apps:create     creates a new app
  apps:destroy    permanently destroy an app
```

#### Display Behavior

- **Concise help**: Show when no arguments provided (unless interactive by default)
- **Full help**: Show with `-h` or `--help` flags
- Should be able to add `-h` to any command and get help
- Use formatting (bold headings) for scannability
- Disable formatting when piped (check for TTY)

---

### 3. Subcommand Organization

#### Hierarchical Structure Patterns

**Git-style Organization:**
```
git [global-options] <command> [command-options] [args]
```

Commands grouped by workflow:
- **Start a working area**: clone, init
- **Work on current change**: add, mv, reset, rm
- **Examine history**: bisect, grep, log, show, status

#### Cobra Library Patterns

**Directory Structure:**
```
▾ appName/
  ▾ cmd/
      add.go
      commands.go
  main.go
```

**Help Generation:**
- Automatic `help` command for subcommands
- `app help subcommand` pattern
- `--help` flag on every command automatically
- Support for command grouping via `AddGroup()`

#### Discovery Mechanisms

1. **Primary commands first**: Display most common commands at top
2. **Grouped by function**: Organize related commands together
3. **Consistent naming**: Use standard verbs (get, list, create, delete, update)
4. **Hierarchical help access**:
   - `myapp help` → top-level help
   - `myapp help subcmd` → subcommand help
   - `myapp subcmd --help` → same as above

#### Example: Git Help Organization

```
$ git
usage: git [--version] [--help] [-C <path>] ...
           <command> [<args>]

These are common Git commands used in various situations:

start a working area (see also: git help tutorial)
   clone      Clone a repository into a new directory
   init       Create an empty Git repository

work on the current change (see also: git help everyday)
   add        Add file contents to the index
   mv         Move or rename a file
   reset      Reset current HEAD
   rm         Remove files from working tree
```

---

### 4. Flag Documentation

#### Required Information per Flag

**Standard Flag Template:**
```
-F, --flag-name=<value>   Description of what it does [default: value]
```

**Components:**
1. **Short form** (single letter): `-f`
2. **Long form** (descriptive): `--flag-name`
3. **Argument indicator**: `=<value>` or `[=<value>]` for optional
4. **Description**: Clear explanation
5. **Default value**: Shown in brackets
6. **Required indicator**: Marked explicitly if required

#### Flag Naming Conventions

**Standard Short Flags (clig.dev):**

| Flag | Meaning | Examples |
|------|---------|----------|
| `-a`, `--all` | All items | `ps`, `fetchmail` |
| `-d`, `--debug` | Debug output | many tools |
| `-f`, `--force` | Force operation | `rm`, `cp` |
| `-h`, `--help` | Help | universal |
| `-n`, `--dry-run` | Simulate without changing | `rsync`, `git` |
| `-o`, `--output` | Output file | `sort`, `gcc` |
| `-p`, `--port` | Port number | `psql`, `ssh` |
| `-q`, `--quiet` | Suppress output | many tools |
| `-u`, `--user` | Username/UID | `ps`, `ssh` |
| `-v`, `--verbose` | Verbose output | (or `--version`) |
| `--version` | Version info | universal |
| `--json` | JSON output | modern tools |

#### Flag Types and Documentation

**Boolean Flags:**
```
-v, --verbose    Enable verbose output
--no-color       Disable colored output
```

**Value Flags:**
```
-o, --output=FILE    Write output to FILE [default: stdout]
-p, --port=PORT      Port to listen on [default: 8080]
```

**Required Flags:**
```
-r, --region=REGION   AWS region (required)
```

**Repeated Flags:**
```
-v, --verbose    Verbose output (can be repeated: -v, -vv, -vvv)
-i, --input=FILE Input file (can be specified multiple times)
```

#### Flag Groups (Cobra Pattern)

**Mutually Exclusive:**
```
--json    Output in JSON format
--yaml    Output in YAML format
```
(Mutually exclusive: specify only one)

**Required Together:**
```
-u, --username=USER   Username (required if password is set)
-p, --password=PASS   Password (required if username is set)
```

---

### 5. Exit Code Conventions

#### POSIX Standard

**Basic Convention:**
- `0` = Success
- Non-zero = Failure (specific values implementation-defined)

#### BSD sysexits.h (FreeBSD/NetBSD/OpenBSD)

| Code | Symbol | Meaning | When to Use |
|------|--------|---------|-------------|
| 0 | EX_OK | Success | Command completed successfully |
| 64 | EX_USAGE | Command line usage error | Wrong arguments, bad flags, syntax errors |
| 65 | EX_DATAERR | Data format error | Invalid input data (user data, not system) |
| 66 | EX_NOINPUT | Cannot open input | Input file doesn't exist or unreadable |
| 67 | EX_NOUSER | Addressee unknown | User doesn't exist (mail, remote login) |
| 68 | EX_NOHOST | Host name unknown | Host doesn't exist |
| 69 | EX_UNAVAILABLE | Service unavailable | Required service/program missing |
| 70 | EX_SOFTWARE | Internal software error | Non-OS software bugs |
| 71 | EX_OSERR | System error | OS-related errors (fork, pipe failures) |
| 72 | EX_OSFILE | Critical OS file missing | /etc/passwd, system files errors |
| 73 | EX_CANTCREAT | Can't create output | Cannot create user-specified output file |
| 74 | EX_IOERR | I/O error | Read/write failures |
| 75 | EX_TEMPFAIL | Temporary failure | Retry may succeed (network timeout) |
| 76 | EX_PROTOCOL | Remote error in protocol | Protocol exchange failure |
| 77 | EX_NOPERM | Permission denied | Insufficient permissions |
| 78 | EX_CONFIG | Configuration error | Misconfigured state |

**Note:** sysexits.h is deprecated but retained for compatibility. Use is discouraged in new code but widely supported.

#### Exit Code Best Practices

1. **Always return 0 on success** - Scripts depend on this
2. **Map non-zero codes to failure modes** - Document what each code means
3. **Use consistent codes** across your application
4. **Support `EX_USAGE` (64)** for argument errors
5. **Consider sysexits.h** for Unix-like portability
6. **Document exit codes** in help/man pages

---

### 6. Error Messages

#### Structure and Content

**Error Message Formula (clig.dev):**
```
Error: <what went wrong>. <why it matters>. <how to fix it>.
```

**Example:**
```
Error: Can't write to file.txt. The file is read-only. 
You might need to make it writable by running 'chmod +w file.txt'.
```

#### Best Practices

**1. Human-Readable First:**
- Catch errors and rewrite them for humans
- Avoid raw exceptions/stack traces in production
- Explain what the user should do differently

**2. Signal-to-Noise Ratio:**
- Group similar errors under single header
- Put most important information last (user looks there first)
- Use color intentionally (red for errors)

**3. Suggest Corrections:**
- Detect typos and suggest fixes (Levenshtein distance)
- Suggest next commands in workflow
- Show similar valid options

**4. Error Prefix Convention:**
```
Error: <message>
Warning: <message>
```

**5. Debug Information:**
- Write debug logs to file, not stdout/stderr
- Provide `--verbose` or `--debug` flag for details
- Include bug report URL when appropriate

#### Example Error Patterns

**Unknown Command with Suggestion:**
```
$ hugo srever
Error: unknown command "srever" for "hugo"

Did you mean this?
        server

Run 'hugo --help' for usage.
```

**Invalid Flag:**
```
$ myapp --invalid
Error: unknown flag: --invalid
Usage:
  myapp [command]

Use "myapp --help" for more information.
```

**Required Flag Missing:**
```
Error: required flag(s) "region" not set
Run with --help for usage information.
```

---

### 7. AI-Parseable Patterns

#### Structured Output Formats

**1. Machine-Readable Formats:**
- Support `--json` flag for structured output
- Support `--plain` or `--no-color` for piping
- Separate data (stdout) from messages (stderr)

**Example (Heroku):**
```
$ heroku apps --json
[
  {"name": "example", "team": "personal"},
  {"name": "example2", "team": "personal"}
]
```

**2. Tabular Data:**
- Use consistent column delimiters when not in TTY
- Header rows for column identification
- Handle special characters appropriately

#### Documentation Structure

**Consistent Section Headers:**
Help output should use standard, easily parseable headers:
```
NAME
SYNOPSIS
DESCRIPTION
OPTIONS
EXAMPLES
EXIT STATUS
ENVIRONMENT
FILES
SEE ALSO
```

**Command Lists:**
Subcommands should be consistently formatted:
```
  command-name    Brief description
```

**Flag Lists:**
Flags should follow predictable patterns:
```
  -s, --long=VALUE   Description [default: x]
```

#### Shell Completion Support

**1. Generate Completions:**
Modern CLI frameworks (Cobra, Click, clap) support generating shell completions:
```
myapp completion bash > /etc/bash_completion.d/myapp
myapp completion zsh > /usr/local/share/zsh/site-functions/_myapp
myapp completion fish > ~/.config/fish/completions/myapp.fish
```

**2. Completion Metadata:**
- Provide `ValidArgs` for positional arguments
- Support `ValidArgsFunction` for dynamic completion
- Include descriptions in completions (Fish, Zsh)

#### Man Page Generation

**Automated Documentation:**
- Generate man pages from code annotations
- Use tools like `ronn` (Ruby) or framework built-ins
- Keep in sync with `--help` output

**Example (npm):**
```
$ npm help ls
# Displays man page for npm-ls
```

#### AI-Friendly Design Principles

**1. Predictable Structure:**
- Same sections in same order
- Consistent indentation and spacing
- No arbitrary text wrapping

**2. Explicit Over Implicit:**
- Document all flags, even obvious ones
- Show all possible values for enums
- Include type information in descriptions

**3. Discoverability:**
- List related commands
- Cross-reference documentation URLs
- Include examples showing common patterns

**4. Version Information:**
- `--version` should output parseable format
- Include in help header
- Semantic versioning preferred

**5. Error Help Integration:**
- Link errors to documentation
- Suggest `--help` in error messages
- Provide `--verbose` for debugging

---

### Sources

1. **POSIX.1-2017 (IEEE Std 1003.1-2017)**
   - Section 12: Utility Conventions
   - URL: https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html

2. **GNU Coding Standards**
   - Section 4.8: Standards for Command Line Interfaces
   - URL: https://www.gnu.org/prep/standards/html_node/Command_002dLine-Interfaces.html

3. **Command Line Interface Guidelines (clig.dev)**
   - Authors: Aanand Prasad, Ben Firshman, Carl Tashian, Eva Parish
   - URL: https://clig.dev/
   - Sections: Help, Documentation, Output, Errors, Arguments and flags, Subcommands

4. **FreeBSD sysexits.h Manual**
   - sysexits(3) - Legacy exit status codes
   - URL: https://man.freebsd.org/cgi/man.cgi?query=sysexits&sektion=3

5. **Cobra CLI Library Documentation**
   - User Guide and Help Command documentation
   - URL: https://github.com/spf13/cobra/blob/main/site/content/user_guide.md

6. **12 Factor CLI Apps**
   - Author: Jeff Dickey
   - URL: https://medium.com/@jdxcode/12-factor-cli-apps-dd3c227a0e46

---

## Research Summary

This research reveals that effective CLI help systems balance:

1. **Standards compliance** (POSIX/GNU) with **modern usability**
2. **Human readability** with **machine parseability**
3. **Comprehensive documentation** with **brevity**

For AI agents specifically, the most important patterns are:
- Consistent, predictable output structure
- Machine-readable formats (`--json`)
- Standard exit codes for error handling
- Clear flag documentation with types and defaults
- Hierarchical command discovery

The convergence of POSIX standards, GNU conventions, and modern frameworks like Cobra provides a solid foundation for designing CLI tools that work well for both humans and AI systems.
