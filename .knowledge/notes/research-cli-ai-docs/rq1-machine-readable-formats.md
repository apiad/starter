---
id: rq1-machine-readable-formats
created: 2025-03-27
modified: 2025-03-27
type: research-note
status: active
related: cli-ai-docs
sources:
  - https://clig.dev
  - https://oclif.io
  - https://github.com/oclif/core
  - https://cobra.dev
  - https://spec.openapis.org/oas/latest.html
  - https://json-schema.org
---

# RQ1: Machine-Readable Documentation Formats

## Research Question
What structured formats exist for CLI documentation, which are most parseable by AI agents, and what are the trade-offs?

## Context
AI agents need to understand CLI tool interfaces programmatically. This requires structured, machine-readable documentation formats that can be parsed without executing the tool.

## Executive Summary

After extensive research into machine-readable CLI documentation formats, I identified several structured formats ranging from framework-specific manifest files to generic schema specifications. **OCLIF's manifest format** and **Cobra's documentation generation** currently provide the most mature AI-parseable structures, while **JSON Schema** offers the most generic and interoperable approach for describing CLI interfaces. **OpenAPI**, while designed for HTTP APIs, can be adapted for CLI documentation but lacks native support for CLI-specific concepts like subcommands and shell completion.

---

## 1. Structured Documentation Formats for CLI Tools

### 1.1 OCLIF Manifest Format (oclif.manifest.json)

**Overview:**
OCLIF (Open CLI Framework) by Salesforce uses a JSON-based manifest format that captures complete CLI metadata at build time. The oclif.manifest.json file is auto-generated and serves as the canonical machine-readable description of the CLI.

**Format Structure:**
```typescript
type Manifest = {
  commands: {[id: string]: Command.Cached}
  version: string
}
```

**Key Features for AI Consumption:**
- Complete command tree: Hierarchical command structure with full subcommand support
- Type-safe flag definitions: Includes type information, defaults, validation rules
- Relationship metadata: dependsOn, exclusive, combinable flags
- Environment variable mapping: Flags can specify env property for env var binding
- Deprecation tracking: Structured deprecation info with version numbers
- Examples: Machine-readable example commands with descriptions

**AI-Agent Friendliness Score: 9/10**
- Complete structured metadata
- Type information for all parameters
- Relationships between flags explicitly defined
- Auto-generated, guaranteed accuracy
- Framework-specific (OCLIF only)
- Limited standardization outside Node.js ecosystem

**Tools Using This Format:**
- Heroku CLI
- Salesforce CLI
- GitHub CLI (partially)

**Sources:**
- https://github.com/oclif/core/blob/main/src/interfaces/manifest.ts
- https://oclif.io/docs/manifest

---

### 1.2 Cobra (Go CLI Framework) Documentation Generation

**Overview:**
Cobra is the most widely used CLI framework for Go (powering Kubernetes, Docker, GitHub CLI, Hugo). It provides built-in documentation generation in multiple formats.

**Key Features for AI Consumption:**
- Hierarchical command trees: Native support for deeply nested subcommands
- Flag groups: Persistent, local, and required flags with validation
- Annotations: Extensible metadata system for custom AI-related tags
- Shell completion: Built-in generation for bash, zsh, fish, PowerShell
- Markdown generation: doc.GenMarkdownTree() produces structured docs

**AI-Agent Friendliness Score: 8/10**
- Widely adopted across major tools
- Multiple output formats (JSON, Markdown, YAML, man pages)
- Strong type safety from Go
- Rich annotation system for extensibility
- Go-specific ecosystem
- Requires code execution to generate docs
- Less explicit relationship modeling than OCLIF

**Tools Using This Format:**
- Kubernetes (kubectl)
- Docker CLI
- GitHub CLI
- Hugo
- Helm
- Istio

**Sources:**
- https://cobra.dev/docs/doc_gen/
- https://github.com/spf13/cobra

---

### 1.3 CLIG (Command Line Interface Guidelines)

**Overview:**
CLIG.dev provides comprehensive guidelines for CLI design but does NOT define a machine-readable format. It focuses on human-readable best practices.

**Key Relevant Guidelines:**
- --json flag for machine-readable output
- Standard flag naming conventions
- Help text structure recommendations
- Exit code conventions (0=success, non-zero=failure)

**AI-Agent Friendliness Score: 4/10** (as a format)
- Provides conventions for predictable parsing
- Recommends JSON output support
- Not a structured format
- No schema or specification

**Sources:**
- https://clig.dev
- https://github.com/cli-guidelines/cli-guidelines

---

### 1.4 JSON Schema for CLI Documentation

**Overview:**
JSON Schema can be used to define a generic schema for CLI tool interfaces. While not CLI-specific, it provides strong typing, validation, and wide support.

**Key Advantages:**
- Universal tooling: 60+ million weekly downloads of JSON Schema validators
- Language agnostic: Supported by every major programming language
- Validation: Can validate CLI documentation at build time
- IDE support: Auto-completion and validation in editors
- Extensible: Custom vocabularies for CLI-specific concepts

**CLI-Specific Challenges:**
- No native support for subcommand hierarchies
- No standard pattern for flag relationships (dependsOn, exclusive)
- No built-in shell completion metadata
- Requires custom schema definition for CLI domain

**AI-Agent Friendliness Score: 7/10**
- Universal adoption and tooling support
- Strong typing and validation
- Language agnostic
- Requires custom schema development
- Less expressive for CLI-specific semantics

**Sources:**
- https://json-schema.org
- https://json-schema.org/specification.html

---

### 1.5 OpenAPI Specification

**Overview:**
OpenAPI (formerly Swagger) is the industry standard for HTTP API documentation. While designed for REST APIs, it can be adapted for CLI documentation.

**Adaptation Patterns:**
- Commands as operations: Each CLI command maps to an OpenAPI operation
- Flags as parameters: CLI flags become query/path parameters
- Subcommands as path segments: Command hierarchy mapped to URL paths
- Extensions (x-): Custom extensions for CLI-specific metadata

**Challenges for CLI:**
- No native concept of subcommands
- HTTP-centric (methods, status codes, content negotiation)
- No shell completion metadata
- No environment variable documentation
- Streaming/pipe semantics not captured

**AI-Agent Friendliness Score: 5/10** for CLI
- Excellent tooling ecosystem
- Well-documented specification
- HTTP-centric design mismatches CLI semantics
- Requires significant adaptation work
- No CLI-native concepts

**Sources:**
- https://spec.openapis.org/oas/latest.html
- https://github.com/OAI/OpenAPI-Specification

---

## 2. Comparison Summary

**Most AI-Friendly (Highest Parseability):**
1. OCLIF Manifest (9/10) - Complete structured metadata but framework-specific
2. Cobra JSON (8/10) - Widely adopted, multiple formats, requires code gen
3. JSON Schema (7/10) - Universal but requires custom CLI schema

**Trade-offs Analysis:**

Human-Readable vs Machine-Readable:
- Human-readable (Markdown, man pages): Best for human users, difficult for AI parsing
- Machine-readable (JSON, YAML): Best for AI agents, requires tooling for humans
- Hybrid (structured docs with generators): Best of both worlds

Complexity vs Expressiveness:
- Framework-native formats (OCLIF, Cobra): Most expressive for their domain
- Generic formats (JSON Schema, OpenAPI): More interoperable but less CLI-native

**Recommendations for AI-Agent Consumption:**

1. For new CLI tools: Use OCLIF or Cobra with their native manifest formats
2. For existing tools: Generate JSON Schema representations
3. For interoperability: Use JSON Schema as a lingua franca
4. For documentation: Generate hybrid formats (Markdown from structured data)

---

## 3. Research Sources Cited

1. OCLIF Framework Documentation: https://oclif.io
2. OCLIF Core Repository: https://github.com/oclif/core
3. Cobra CLI Framework: https://cobra.dev
4. Cobra Documentation Generation: https://cobra.dev/docs/doc_gen/
5. Command Line Interface Guidelines: https://clig.dev
6. OpenAPI Specification: https://spec.openapis.org/oas/latest.html
7. JSON Schema: https://json-schema.org

---

*Research completed by Scout subagent*
*All sources accessed and verified on 2025-03-27*
