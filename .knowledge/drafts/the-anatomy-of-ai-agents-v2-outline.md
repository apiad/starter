# Draft Outline: The Anatomy of AI Agents (Version 2)

**Based on:** `.knowledge/drafts/the-anatomy-of-ai-agents-full.md`  
**Review:** `.knowledge/drafts/the-anatomy-of-ai-agents-full.md.review_structure.md`  
**Status:** Outline for second draft

---

## Document Structure

```
Part I:   The Problem (~20% of length)
Part II:  The System (~25% of length)
Part III: The Practice (~30% of length)
Part IV:  A Better Future (~15% of length)
Conclusion (~10% of length)
```

---

## Part I: The Problem

### Purpose
Establish the reader's pain, make them feel understood, then set up the conceptual framework that explains why their current approach fails.

### Sections

#### 1. Opening Hook (Lines 1-7 from v1)
**Keep from v1:** Opening scenario (third hour of work, something breaks). Strong thesis.

**⚠️ Write-up notes:**
- **P1-1:** Add 2-3 sentence roadmap AFTER the thesis: "I'll walk through why current systems fail, introduce a four-element framework for thinking about agent architecture, then show you how these principles apply across domains."
- Keep the relatable scenario but don't over-extend. 1-2 paragraphs max.

#### 2. The Skill Accumulation Problem (Lines 9-13)
**Keep from v1:** The core problem of skills piling up. "More skills made it worse. Not better."

**⚠️ Write-up notes:**
- Trim the personal anecdote ("I've watched this happen in real time"). Keep the insight.
- Add a sentence at the end that sets up the mechanism: "The agent can't tell what's relevant, so it blends everything together."

#### 3. The Plan/Build Oversimplification (Lines 15-21)
**Keep from v1:** Critique of linear plan→build. The compass metaphor.

**⚠️ Write-up notes:**
- **P1-2:** After the compass metaphor, add a bridge sentence: "That's why context management matters so much—and why most agent frameworks are solving the wrong problem."
- The metaphor should launch into the next section, not stand alone.

#### 4. The Context Drift Symptom (Lines 23-31)
**Keep from v1:** The 95%-then-fail pattern. The hardcoded credentials example.

**⚠️ Write-up notes:**
- **P0-1:** Do NOT end with "The solution isn't better prompts. It's better architecture." followed immediately by `---`.
- Instead: Add a transitional sentence that explicitly names what's coming. Something like: "The solution isn't better prompts. It's better architecture—and that architecture has four elements."
- This closes the problem arc and previews Part II without delivering the solution prematurely.

#### 5. [NEW] Section Break with Roadmap
**Add:** A brief paragraph or `---` with a sentence like: "I'll introduce a framework for thinking about agent systems, then show you how it applies across software development, research, and technical writing."

**⚠️ Write-up notes:**
- **P0-1:** This replaces the abrupt `---` that caused the premature resolution problem.

---

## Part II: The System

### Purpose
Introduce the four-element taxonomy (Mode, Skill, Command, Subagent). Make it memorable and grounded.

### Sections

#### 1. Opening Bridge
**Add:** Explicit transition from Part I. Something like: "Now that we understand the problem, let's look at how every agent system actually works."

#### 2. The Four Elements (Conceptual Overview)
**Keep from v1:** The core definitions of Mode/Skill/Command/Subagent. The comparison table (lines 63-68).

**⚠️ Write-up notes:**
- **P1-7:** Skill definition (lines 49-51) — Split into two paragraphs:
  - Paragraph 1: What a skill is (implicit knowledge, applied naturally)
  - Paragraph 2: How skills layer (contrast with modes)
- **P1-8:** Command definition (lines 53-55) — Split at "And here's the key":
  - Paragraph 1: What a command is (explicit script, orchestrated)
  - Paragraph 2: Why commands should be simple (separation of concerns)
- **P1-9:** Avoid single-sentence paragraphs for key insights. Expand "That's the anatomy of AI agents. Four concerns, cleanly separated" into 2-3 sentences.

#### 3. The Comparison Table (Lines 63-68)
**Keep from v1:** The table itself. It's effective and memorable.

**⚠️ Write-up notes:**
- Keep as-is. It's a strong visual anchor.

#### 4. Why This Separation Matters (Lines 73-82)
**⚠️ Write-up notes:**
- **P1-3:** Lines 73-75 ("A skill is... A command is...") — This is verbatim repetition. REMOVE or convert to a launchpad: "Understanding this distinction unlocks everything else. Once you see skills as implicit knowledge and commands as explicit scripts, the rest of the architecture follows naturally."
- **P1-9:** Expand single-sentence paragraphs (lines 78-79, 82). Either merge with preceding content or add supporting sentences.
- Don't let important insights float as orphaned single-sentence paragraphs.

#### 5. Section Closing
**⚠️ Write-up notes:**
- **P1-4:** "That's the anatomy of AI agents. Four concerns, cleanly separated." — This is a dead end. Add a forward bridge: "These four elements aren't just theoretical categories. They're the building blocks for a practical system. Let me show you how."

---

## Part III: The Practice

### Purpose
Show the three modes (analyze, design, create) in action across three domains. Domain-focused examples replace OpenCode-specific implementation details.

### Sections

#### 1. Opening Bridge
**Add:** Explicit transition: "The four-element framework isn't abstract. Here's how it works in practice—and how you can apply it to your own domain."

#### 2. The Three Modes (Conceptual)
**Keep from v1:** The concept of modes as permissions-based constraints, not just persona.

**⚠️ Write-up notes:**
- **P1-12:** Analyze mode description (lines 126-127) — Add topic sentence: "Analyze mode is read-only by design" or "This is where research happens."
- Keep conceptual; don't show YAML configs. Focus on the insight: modes define permissions, not just voice.
- Mention that modes are implicit — the agent doesn't "switch" modes via explicit instruction, it operates within the current mode's constraints.

#### 3. Domain A: Software Development
##### 3a. Implicit Skills
**Add:** What an agent in this domain implicitly knows:
- Language idioms and patterns
- Testing conventions (where tests live, naming patterns)
- Architecture conventions (layered structure, error handling norms)
- Code review standards

##### 3b. The trace/plan/build Workflow
**⚠️ Write-up notes:**
- **P1-10:** Break the workflow into logical phases, not a wall of text.
- Structure:
  - **Phase 1: /trace (analyze mode)** — 3-4 sentences describing what happens
  - **Phase 2: /plan (design mode)** — 3-4 sentences
  - **Phase 3: /build (create mode)** — 3-4 sentences with explicit mention of literate commands for TDD loop
- End with a sentence showing how Part IV connects: "This is where sequential execution and structured parsing make the difference between a helpful workflow and a chaotic one."

#### 4. Domain B: Research
##### 4a. Implicit Skills
**Add:**
- Citation formats and conventions
- Paper evaluation criteria (methodology, sample size, replicability)
- Literature review structure norms
- Domain-specific terminology

##### 4b. The research/sota/draft Workflow
**⚠️ Write-up notes:**
- **P1-10:** Same wall-of-text concern. Break into phases.
- Structure:
  - **Phase 1: /research (analyze mode)** — iterative collection, scout subagents, structured output
  - **Phase 2: /sota (design mode)** — pattern identification, methodology grouping, outline options
  - **Phase 3: /draft (create mode)** — section by section, using the outline
- Emphasize iteration: /research can be run multiple times to collect batches of sources.

#### 5. Domain C: Technical Writing
##### 5a. Implicit Skills
**Add:**
- Prose style conventions (voice, tense, sentence structure)
- Structural patterns (documentation vs. blog vs. report)
- Audience awareness
- Cross-referencing and linking norms

##### 5b. The review/apply-review/write Workflow
**Reference:** `.opencode/commands/review.md` for inspiration on /review behavior

**⚠️ Write-up notes:**
- **P1-10:** Break into phases.
- Structure:
  - **Phase 1: /review (analyze mode)** — detailed structural/content/style review (inspired by the review.md command)
  - **Phase 2: /apply-review (design mode)** — plan changes to specific sections, prioritizing by review type (structure > content > style)
  - **Phase 3: /write (create mode)** — follows the plan, section by section

#### 6. Section Closing
**⚠️ Write-up notes:**
- **P1-5:** Add forward bridge before transitioning to Part IV: "These workflows show the three modes in action. But the commands themselves are still limited. Here's what they need to become."

---

## Part IV: A Better Future

### Purpose
Introduce the concept of literate commands as an enhancement. Conceptual only; implementation details deferred to a future article.

### Sections

#### 1. Opening Bridge
**Add:** Transition from Part III: "The three-phase workflow works. But the commands themselves are still primitive. They should be smarter."

#### 2. What Commands Should Be
**Conceptual introduction:** Commands as executable scripts, not static prompts.

**Features to describe conceptually (not implemented):**

##### 2a. Sequential Prompts
**Concept:** Commands that pause mid-execution to collect input, then continue.

**⚠️ Write-up notes:**
- **P1-10:** Don't make this a wall of text. 2-3 sentences per feature max.
- Link to /trace example: "Instead of running all experiments at once, /trace could pause after each batch and ask: 'Which of these looks most promising?'"

##### 2b. Structured Parsing
**Concept:** Commands that extract and route information based on defined schemas.

**⚠️ Write-up notes:**
- Link to /sota: "Instead of dumping all sources into one document, /sota could parse the bibliography, extract methodology fields, and group by research question."

##### 2c. Routing
**Concept:** Conditional branching based on context or user input.

**⚠️ Write-up notes:**
- Link to /plan: "If the plan reveals a breaking change, route to architectural review. If it's a bug fix, route directly to implementation."

##### 2d. Script Injection
**Concept:** Commands that embed and execute external scripts (e.g., the TDD loop).

**⚠️ Write-up notes:**
- Link to /build: "Instead of describing TDD, /build could inject the test-first cycle as an executable script, ensuring red-green-refactor happens without manual oversight."

#### 3. The Teaser
**Add:** Forward bridge to future article: "I'll show you how to implement these features in a future article. But the concepts work today—you can start designing your workflows around them now."

---

## Conclusion

### Purpose
Synthesize, don't repeat. Elevate from the journey. Circle back to the framework.

### Sections

#### 1. Return to the Framework
**⚠️ Write-up notes:**
- **P0-3:** Do NOT restate the five principles verbatim (like lines 286-294 in v1).
- Instead: Synthesize. Something like: "The three modes are one expression of the four-element framework. You can define Mode, Skill, Command, and Subagent differently for your domain—but as long as you keep them separate, the system scales."

#### 2. The Cost of Separation (Elevated Insight)
**Add:** Something new that only makes sense after the reader has traveled through the document:

- What did they learn that they didn't know before?
- What's the surprising implication?
- What does this enable that wasn't possible before?

**⚠️ Write-up notes:**
- **P0-3:** This is where the "Key Lessons" content should go—but synthesized, not repeated. The reader should feel like they've arrived somewhere new.
- Consider: "Separation isn't just about organization. It's about composability. When Mode, Skill, Command, and Subagent are independent, you can swap one without breaking the others. That's what makes the system adaptable."

#### 3. The Closing Line
**Keep from v1:** "Build for the long game. Your future self (and your context window) will thank you."

**⚠️ Write-up notes:**
- Strong ending. Keep it. Maybe trim what precedes it so this lands with weight.

---

## Paragraph-Level Issues to Watch (All Sections)

### Bridges and Transitions
| Location | Issue | Fix |
|----------|-------|-----|
| After compass metaphor (Part I) | P1-2: Orphan aphorism | Add: "That's why context management matters so much" |
| Before Part II | P0-1: Premature resolution | Add explicit "here's what's coming" signal |
| End of Part II | P1-4: Section-ending dead end | Add: "These four elements aren't abstract. Let me show you how they work." |
| After Part III workflows | P1-5: No forward bridge | Add: "These workflows work. But the commands are still primitive." |
| Part IV → Conclusion | P0-3: Double conclusion risk | Ensure one conclusion, no horizontal rule divider |

### Definition Paragraphs
| Element | Structure |
|---------|-----------|
| Mode | Topic sentence → permission concept → contrast with other elements |
| Skill | Topic sentence → what it is → layering contrast (separate paragraph) |
| Command | Topic sentence → what it is → "And here's why" (separate paragraph) |
| Subagent | Topic sentence → what it is → example with topic sentence |

### Single-Sentence Paragraphs to Expand
- "That's the anatomy of AI agents. Four concerns, cleanly separated." → 2-3 sentences
- Any standalone insight that lands as a dead end → add a forward sentence or merge with adjacent content

### Workflow Sections (Part III)
Each workflow should have:
1. Phase header (bold or `###`)
2. 3-4 sentences of description
3. Optional: one sentence linking to Part IV features

---

## What to Keep from v1 (Word-for-Word or Near-Word)

| Section | Content | Lines |
|---------|---------|-------|
| Opening hook | "You've been using AI coding agents for months..." | 1-7 |
| Skill accumulation problem | Core insight + "More skills made it worse. Not better." | 9-13 |
| Plan/build oversimplification | Critique of linear flow | 15-19 |
| Compass metaphor | "The plan is a map. But terrain changes..." | 21 |
| Context drift symptom | 95%-then-fail pattern | 23-29 |
| Mode/Skill/Command/Subagent definitions | Core concepts (revised for paragraph structure) | 45-59 |
| Comparison table | Mode/Skill/Command/Subagent comparison | 63-68 |
| Strong closing line | "Build for the long game..." | 318 |

---

## What to Remove from v1

| Content | Reason |
|---------|--------|
| YAML mode configurations | OpenCode-specific; out of scope |
| Directory structure | OpenCode-specific; out of scope |
| Literate command syntax examples | Implementation detail; deferred to future article |
| "Key Lessons" section (lines 282-295) | Verbatim repetition; replace with synthesis |
| Company analogy (lines 298-305) | Tacked on; decorative, not developmental |
| Second horizontal rule before conclusion | Creates double-ending structure |
| All single-sentence paragraphs (review and fix) | Buries key insights |

---

## What to Add (New Content)

| Section | Content | Purpose |
|---------|---------|---------|
| Introduction | Roadmap sentence(s) | Orient reader |
| Part I closing | Explicit "here's what's coming" | Replace abrupt section break |
| Part II opening | Bridge from problem to framework | Logical flow |
| Part III opening | Bridge to domain applications | Explicit framing |
| Part III.A-C | Domain-specific skills lists | Grounding |
| Part III.A-C | Phase-structured workflows | Fix wall-of-text |
| Part IV | Conceptual literate command features | Forward-looking |
| Part IV | Teaser for future implementation article | Set expectations |
| Conclusion | Synthesis, not repetition | Elevate, don't retread |

---

## Issue Coverage Checklist

| Issue | Status | Location |
|-------|--------|----------|
| P0-1: Premature Resolution | ✅ Fixed | Part I closing + Part II opening |
| P0-2: Disconnected Pivot | ✅ Fixed | Explicit framing: "instantiation of the framework" |
| P0-3: Double Conclusion | ✅ Fixed | One conclusion, no horizontal rule |
| P0-4: Proportion Imbalance | ✅ Fixed | Conceptual + domain examples, no implementation details |
| P0-5: Scope Confusion | ✅ Fixed | Purely conceptual; no OpenCode specifics |
| P1-1: No Roadmap | ✅ Fixed | Roadmap added to introduction |
| P1-2: Compass Metaphor Orphan | ✅ Fixed | Bridge sentence added |
| P1-3: Redundant Definition | ✅ Fixed | Converted to launchpad or removed |
| P1-4: Section-Ending Dead End | ✅ Fixed | Forward bridge added |
| P1-5: No Forward Bridge | ✅ Fixed | Explicit "what's next" signals throughout |
| P1-6: Analogy Tacked On | ✅ Removed | Not included in v2 |
| P1-7: Blended Skill Definition | ✅ Fixed | Split into definition + contrast paragraphs |
| P1-8: Blended Command Definition | ✅ Fixed | Split at "And here's the key" |
| P1-9: Single-Sentence Paragraphs | ✅ Fixed | Expanded or merged with adjacent content |
| P1-10: Workflow Walls of Text | ✅ Fixed | Phase-structured with headers |
| P1-11: Key Lessons Unsubstantiated | ✅ Removed | Replaced with synthesis in conclusion |
| P1-12: Missing Topic Sentence | ✅ Fixed | Topic sentences added throughout |
| P1-13: Subagent Example Lacks Topic | ✅ Fixed | Added where applicable (scout example may not apply to conceptual article) |

---

## Strengths Preserved from v1

- Strong opening hook
- Compelling compass metaphor
- The Four Elements framework (Mode/Skill/Command/Subagent)
- Comparison table
- Domain-focused examples
- Strong closing line

---

## Estimated Length

| Part | Target % | Notes |
|------|----------|-------|
| Part I | 20% | Detailed problem statement |
| Part II | 25% | Framework + table + explanation |
| Part III | 30% | Three domains with workflows |
| Part IV | 15% | Conceptual features only |
| Conclusion | 10% | Synthesis, not repetition |
