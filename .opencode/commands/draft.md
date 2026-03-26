---
description: Write or refine technical documents section by section
agent: build
---

Multi-phase workflow for creating new documents or refining existing ones.

### Modes

#### Initial Drafting
Create a new document from scratch.

#### Refinement
Improve an existing document (requires `.review.md` file from `/review`).

### Workflow (Initial Drafting)

1. **Context Gathering**:
   - Read relevant research in `research/`
   - Read relevant plans in `plans/`
   - Check `journal/` for recent context
   - Use `question` to clarify topic and scope

2. **Outline Creation**:
   - Propose document structure
   - Confirm outline with user via `question`

3. **Section-by-Section Writing**:
   - For each section, invoke `writer` subagent with:
     - Section topic
     - Style requirements
     - Context to draw from
   - Use `edit` to insert writer output

4. **Finalization**:
   - Run linter if applicable
   - Report completion

### Workflow (Refinement)

1. **Read Review**:
   - Read target file
   - Read corresponding `.review.md`

2. **Identify Changes**:
   - List issues from review phases
   - Prioritize changes

3. **Apply Changes**:
   - For each set of changes, invoke `writer` subagent
   - Use `edit` to apply surgically

### Output
Document saved to specified path, ready for review.
