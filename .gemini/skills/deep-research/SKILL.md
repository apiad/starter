---
name: deep-research
description: Conducts comprehensive, structured research by making a detailed plan, seeking user approval, tracking progress via research.plan.md, collecting intermediate data in research.dump.md, and generating a detailed section-by-section report. Use this skill when the user asks for deep research, comprehensive analysis, or a detailed report on a topic or codebase.
---

# Deep Research

## Overview

The Deep Research skill enables the Gemini CLI to perform exhaustive, multi-step research using both local codebase intelligence and online research capabilities. It structures the research process, iteratively gathers information, and produces a highly detailed, comprehensive markdown report through a robust, section-by-section drafting process.

## Workflow

When triggered, strictly follow this sequential workflow:

### 1. Plan Formulation
- Analyze the user's input to understand the core objective and specific criteria.
- Create a highly structured, comprehensive research plan. The plan should break down the topic into sub-topics and specify which sub-agents (`codebase_investigator` and/or `online_researcher`) will be used for each part.
- Include in the plan the expected structure of the final report.

### 2. User Approval & Initialization
- **MANDATORY:** Present the structured research plan to the user.
- Use the `ask_user` tool (or standard conversational confirmation) to request explicit approval of the plan.
- Do not proceed until the user approves or modifications are made. Refine the plan if requested.
- **Initialization:** Once approved, write the full plan into `research.plan.md` using a checklist format (`- [ ]`). Initialize an empty `research.dump.md` file.

### 3. Iterative Research Execution
Execute the approved plan systematically, step by step:
- For **every step** in `research.plan.md`:
  1. Invoke the necessary sub-agents (`codebase_investigator` and/or `online_researcher`) with specific, focused objectives for that step.
  2. Gather the context, data, and citations provided by the sub-agents.
  3. Append all relevant intermediate information, findings, and raw data to `research.dump.md`. Ensure clear headers are used to separate findings from different steps.
  4. Once sufficient context is gathered for the step, mark it as completed in `research.plan.md` (e.g., `- [x]`).
- If new leads or critical questions emerge, update `research.plan.md` with additional sub-tasks.

### 4. Robust Report Generation
Produce the final `research.md` (or `report.md`) by iteratively processing the collected data:
1. Read the complete `research.dump.md`.
2. For **every section** defined in the report structure:
   - Perform a comprehensive rewrite and synthesis of the relevant data from the dump.
   - Draft the section in the final report file one at a time. This ensures maximum depth and prevents context-loss during generation.
3. The report **must** follow this strict structure:
   - **Executive Summary:** High-level overview and critical takeaways.
   - **Methodology:** Detailed explanation of the process, queries, and agents used.
   - **Key Findings:** Most important discoveries summarized with data.
   - **Detailed Analysis:** In-depth breakdown (tables, lists, long-form text) grouped into logical sub-sections.
   - **Citations:** Explicit references and links to all sources and codebase files.
   - **Further Reading:** Recommendations for next steps or related areas.

## Sub-Agent Integration Guidelines

- **codebase_investigator**: Use for internal context, architecture mapping, and implementation details.
- **online_researcher**: Use for external information, best practices, and verifiable data points.

Remember: Thoroughness is achieved through the iterative collection of raw data into the dump and the surgical, section-by-section synthesis of the final report.
