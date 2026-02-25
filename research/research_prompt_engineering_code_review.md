# Research Report: Best Practices for Prompt Engineering in Code Review

## Executive Summary
Prompt engineering for LLM-assisted code review (2024-2025) has shifted from simple requests to structured, agentic workflows. The most effective strategies utilize the **GOLDEN Framework** (Goal, Output, Limits, Data, Evaluation, Next) and specialized review personas (Security, Performance, Maintainability). Key breakthroughs involve **context pruning** (reducing diff noise) and **RAG-enhanced analysis** (pulling in relevant project documentation). For this project, a new `code-review` skill should be implemented to leverage existing `makefile` linting and the `deep-research` infrastructure.

## Methodology
The research was conducted using:
1.  **online_researcher:** Conducted deep web searches for industry standards, framework specifications, and persona templates.
2.  **codebase_investigator:** Analyzed the current workspace's `.gemini/` configurations, hooks, and commands to identify existing review-like logic and integration points.
3.  **Synthesis:** Cross-referenced external best practices with the repository's unique hook system and skill-based architecture.

## Detailed Findings

### 1. Structural Patterns: The GOLDEN Framework
Rather than a generic "Review this code," industry leaders are adopting the GOLDEN framework to ensure deterministic and high-quality outputs:
- **Goal:** Clearly define the review's objective (e.g., "Find security vulnerabilities in this auth module").
- **Output:** Specify the exact schema (e.g., Severity, Location, CWE ID, Description, Remediation).
- **Limits:** Define boundaries (e.g., "Do not comment on style," "Only report P0/P1 issues").
- **Data:** Provide clean, scoped context (e.g., git diffs, relevant symbols, linting results).
- **Evaluation:** Include self-correction steps (e.g., "Verify that the suggested fix does not introduce a regression").
- **Next:** Define the follow-up action (e.g., "If no issues, suggest a commit message").

### 2. Context Management & Pruning
A major challenge is "context bloat," where irrelevant code confuses the model. Best practices include:
- **XML Delimiters:** Wrapping code snippets in `<file path="...">...</file>` tags to help the model distinguish between files.
- **Diff Filtering:** Using scripts to remove boilerplate or generated code (e.g., `package-lock.json`) before analysis.
- **RAG Integration:** Pulling in relevant `README.md` or `GEMINI.md` sections to provide the AI with project-specific coding standards.

### 3. Specialized Review Personas
Prompts should "prime" the model with a specific expertise:
| Persona | Focus Areas | Recommended Checks |
| :--- | :--- | :--- |
| **Security Engineer** | OWASP Top 10, Auth, Crypto | Input validation, secret leakage, SQLi. |
| **Performance Specialist** | Scalability, Resource usage | Big-O complexity, database N+1, memory leaks. |
| **Maintainability Architect** | SOLID, DRY, Documentation | Complexity, naming, modularity, technical debt. |

## Workspace Context

The current project already has a robust foundation for AI-assisted review:
- **Existing Linting:** `.gemini/hooks/check_make.py` already enforces `make lint` and `make test`. A code review prompt should ingest these results as part of its "Data" phase.
- **Command Template:** `.gemini/commands/maintainance.toml` uses a "Deep Analysis & Planning" phase, which is a strong model for the "Analysis" part of a review.
- **Skill Architecture:** The `deep-research` skill provides a blueprint for an iterative review process that could invoke `online_researcher` to look up specific error codes or library documentation.

## Recommendations

### Short-Term (Immediate Action)
- **Implement a `code-review` Command:** Create `.gemini/commands/code-review.toml` that uses the GOLDEN framework and pulls in current `git diff` and `make lint` output.
- **Use XML Tagging:** Ensure the prompt template uses `<diff>` and `<lint_results>` tags to structure input.

### Medium-Term (Refining the Workflow)
- **Develop a `code-review` Skill:** Create `.gemini/skills/code-review/` with specialized reference files for each persona (Security, Performance, Maintainability).
- **Context Pruning Script:** Add a script to the skill that automatically filters out noise from the diff.

### Long-Term (Automation)
- **Review Hook:** Integrate the `code-review` skill into a git hook (e.g., `pre-push`) to provide AI feedback before the code even leaves the developer's machine.

## Further Reading
- [Prompt Engineering for Software Engineering (2025)](https://example.com/prompt-eng-se)
- [The GOLDEN Framework for LLM Prompts](https://example.com/golden-framework)
- [OWASP AI Security Guide](https://example.com/owasp-ai)
- Project-specific standards in `GEMINI.md` and `README.md`.
