---
description: Deep research campaign with question inference and plan approval
agent: research
---

Deep research on a topic with structured planning and user approval.

### When to Use
- Before building something new (evaluate tools, approaches)
- To understand a domain, library, or technology
- After `/brainstorm` to formalize findings
- Any time structured external research is needed

### Workflow

1. **Context Discovery** (Read-Only)
   - Read last 3-5 journal entries
   - Check `research/` for existing work
   - If topic exists → treat as extension, add context, refine report
   - If partial match found → ask: "Related to X, continue or new angle?"

2. **Question Generation**
   - If topic provided: Break into 3-6 focused questions
   - If no topic: Propose 2-4 questions inferred from context
   - Present numbered list for confirmation
   - User can add, edit, or remove

3. **Research Plan** (Interactive)
   - Group into 1-3 logical threads
   - Each thread: name, questions covered, output filename
   - Estimate scope: Quick (5min) / Medium (20min) / Deep (1hr+)
   - Confirm before execution: "Ready to begin? [y/n]"

4. **Execute**
   - Create `research/<topic-slug>/`
   - For each thread, invoke scout:
     ```
     Invoke scout: [question]
     Include: [sub-points]
     Save to: research/<topic-slug>/scout-[name].md
     ```
   - Parallelize when independent

5. **Synthesis**
   - Write `research/<topic-slug>/research.md`:
     - Research Plan (questions, threads, scope)
     - Executive Summary (2-3 sentences)
     - Key Findings (grouped by thread)
     - Conclusions
     - Recommendations (if applicable)
   - Suggest follow-up based on context:
     - `/plan` if action-oriented
     - `/draft` if content/article-focused

### Output
```
research/<topic-slug>/
├── research.md      # Synthesized report (includes plan audit trail)
└── scout-*.md       # Individual thread findings
```

### Constraints
- Always get user approval before executing
- Check `research/` for duplicates/partial matches
- Treat existing topic dirs as extensions, don't overwrite
- Parallelize scouts for speed
- Synthesize into narrative, don't concatenate
