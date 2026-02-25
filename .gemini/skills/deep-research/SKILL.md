---
name: deep-research
description: Conducts comprehensive, structured research by making a detailed plan, seeking user approval, invoking codebase_investigator and online_researcher as sub-agents iteratively, and generating a detailed markdown report. Use this skill when the user asks for deep research, comprehensive analysis, or a detailed report on a topic or codebase.
---

# Deep Research

## Overview

The Deep Research skill enables the Gemini CLI to perform exhaustive, multi-step research using both local codebase intelligence and online research capabilities. It structures the research process, iteratively gathers information, and produces a highly detailed, comprehensive markdown report.

## Workflow

When triggered, strictly follow this sequential workflow:

### 1. Plan Formulation
- Analyze the user's input to understand the core objective and specific criteria.
- Create a highly structured, comprehensive research plan. The plan should break down the topic into sub-topics and specify which sub-agents (`codebase_investigator` and/or `online_researcher`) will be used for each part.
- Include in the plan the expected structure of the final report.

### 2. User Approval
- **MANDATORY:** Present the structured research plan to the user.
- Use the `ask_user` tool (or standard conversational confirmation) to request explicit approval of the plan.
- Do not proceed until the user approves or modifications are made. Refine the plan if requested.

### 3. Iterative Research Execution
- Execute the approved plan by systematically invoking the necessary sub-agents:
  - Use `codebase_investigator` to perform focused searches on local files, architectural mapping, and system dependencies.
  - Use `online_researcher` to conduct deep web searches, gather external knowledge, and find citations.
- Invoke these sub-agents **as many times as necessary** to fully satisfy the research objectives.
- If new questions arise during the research, dynamically adjust your focus and invoke sub-agents again to dig deeper.
- Aggregate and synthesize all found information in your internal context.

### 4. Report Generation
- Produce a very good, comprehensive, and detailed `report.md` file.
- The report **must** be long and detailed, utilizing formatting such as tables, lists, and long-form text.
- The report **must** follow this strict structure:
  1. **Executive Summary:** A high-level overview of the entire research and its most critical takeaways.
  2. **Methodology:** A detailed explanation of how the research was conducted, including the queries run and sub-agents utilized.
  3. **Key Findings:** The most important discoveries, summarized with supporting data.
  4. **Detailed Analysis:** In-depth breakdown of the topic, incorporating long-form text, tables, and lists. Group this into logical sub-sections.
  5. **Citations:** Explicit references and links to all online sources and internal codebase files used.
  6. **Further Reading:** Recommendations for next steps, external articles, or related codebase areas for the user to explore.

## Sub-Agent Integration Guidelines

- **codebase_investigator**: Use for understanding local project context, discovering how features are implemented, finding bugs, or mapping architecture. Pass specific, focused objectives.
- **online_researcher**: Use for gathering external information, understanding third-party tools, finding best practices, or researching academic/industry standards. Pass small, verifiable questions to ensure high-quality results.

Remember: The key to this skill is thoroughness and the iterative use of sub-agents to build a massive, well-cited knowledge base before writing the final report.
