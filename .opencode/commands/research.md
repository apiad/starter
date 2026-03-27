---
description: Deep research on a topic using parallel scouts
agent: analyze
subagents: [scout]
---

# /research [topic]

Execute comprehensive research on [topic] using parallel scouts.

## Workflow

### Phase 1: Scout Deployment
Launch 3-5 scout subagents with different angles:

1. **Scout 1: Official Documentation**
   - Official docs, specs, authoritative sources

2. **Scout 2: Community Best Practices**
   - Popular patterns, community consensus

3. **Scout 3: Common Pitfalls**
   - Mistakes to avoid, edge cases

4. **Scout 4: Recent Developments** (if applicable)
   - New versions, emerging patterns

5. **Scout 5: Implementation Examples**
   - Real-world code, tutorials

### Phase 2: Synthesis
Collect scout findings and synthesize:
- Merge overlapping insights
- Resolve contradictions (note conflicts)
- Identify consensus vs. debate
- Extract actionable recommendations

### Phase 3: Documentation
Write structured research to `.knowledge/insights/research/{slug}.md`:

```yaml
---
id: {kebab-case-topic}
created: {date}
type: research
status: active
sources: [list all scout sources]
---

# Research: [Topic]

## Executive Summary
[2-3 paragraphs maximum]

## Key Findings
1. **[Finding 1]**
   - Evidence: [from which scout]
   - Implication: [what this means]

2. **[Finding 2]**
   ...

## Recommendations
- [Specific, actionable recommendation]
- [Specific, actionable recommendation]

## Scout Reports
[Summaries from each scout]
```

## Key Constraints
- Maximum 5 scouts (token efficiency)
- 60s timeout per scout
- Must synthesize, not just aggregate
- Include conflicting viewpoints if found
