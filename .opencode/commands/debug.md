---
description: Test hypotheses using non-permanent code experiments
agent: build
---

Debug and hypothesis-testing workflow using the `coder` subagent.

### Purpose

When you need to verify assumptions, test theories, or explore code behavior without making permanent changes.

### Workflow

1. **Formulate Hypothesis**:
   - Clearly state what you're testing
   - Define success criteria

2. **Invoke Coder**:
   - Call `coder` subagent with:
     - The hypothesis to test
     - Available tools/languages
     - Success criteria

3. **Analyze Results**:
   - Report findings to user
   - Based on results, either:
     - Proceed with implementation
     - Formulate new hypothesis
     - Ask user for guidance

### Examples

```
Hypothesis: "The auth middleware is rejecting valid tokens"
Test: Write a script to send a valid token and inspect the response
Success: 200 response with user data

Hypothesis: "Python's list comprehension is faster than loop"
Test: Write a timing script comparing both approaches
Success: Clear timing difference showing which is faster
```

### Reporting

After test completion, report:
- Hypothesis tested
- Test code used
- Results obtained
- Verdict (validated/rejected/inconclusive)

### Notes
- All test code is non-permanent
- Clean up test files after verification
- Use for debugging, performance testing, API exploration
