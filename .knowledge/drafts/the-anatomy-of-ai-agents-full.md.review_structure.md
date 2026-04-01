# Structural Review Report

**File:** `.knowledge/drafts/the-anatomy-of-ai-agents-full.md`  
**Review Type:** Structure  
**Date:** 2026-04-01

---

## Overall Assessment

The document has strong fundamentals — a compelling hook, clear voice, a memorable taxonomy (Mode/Skill/Command/Subagent), and effective walkthroughs that show application rather than assertion. However, the macro-structure suffers from three systemic problems: the problem section delivers the solution before the reader has context to appreciate it, the implementation section dominates at 44% of total length creating severe proportion imbalance, and the conclusion retreads rather than synthesizes. The reader finishes feeling like they've been given a detailed tour but aren't sure they've arrived anywhere new.

---

## Critical Issues

### 1. Premature Resolution — Solution Delivered Before Framework

**Section:** "The Context Drift Symptom" → horizontal rule → "The Four Elements"

**Text:**
> "The solution isn't better prompts. It's better architecture."
>
> ---
>
> "Every AI agent system addresses four concerns. When you conflate them, the system breaks. When you separate them, the system scales."

**Problem:** The problem section concludes with the answer at line 31, but the horizontal rule and the Four Elements section that follows make the reader wait to learn what that architecture actually is. This collapses the problem-solution arc prematurely — the reader is told "better architecture" is the fix but must wait through a section break before discovering the framework. A transitional sentence after line 31 (e.g., "That architecture has four elements...") would close this gap.

---

### 2. Disconnected Pivot to Implementation — Theory vs. Practice Treated as Separate

**Section:** Transition from "The Four Elements" to "The OpenCode Implementation"

**Text:**
> "That's the anatomy of AI agents. Four concerns, cleanly separated."
>
> "After three failed attempts at building an agent framework, I learned what works. Let me show you the architecture that actually scales."

**Problem:** Line 84 provides closure on the Four Elements section, but line 88 treats the subsequent content as if nothing was just explained. The phrase "what works" implies the Four Elements section *didn't* show what works — creating a logical disconnect. The reader just learned the anatomy of AI agents but is now told they'll see "the architecture that actually scales," as if these are different things. The Four Elements reads as a standalone universal theory, yet the meat of the article is OpenCode-specific implementation. The pivot should explicitly frame what follows as *instantiation* of the framework, not a different solution.

---

### 3. Scope Confusion — General Principles vs. OpenCode Specifics Oscillate

**Problem:** Throughout the implementation section, the document oscillates between general principles and OpenCode-specific details without clear signals about which mode the reader is in. This creates cognitive load: when is the author describing how agents *work* versus how OpenCode *implements* them? For example, the YAML mode configurations (lines 106–121) are clearly OpenCode-specific, but the framing around them ("The agent doesn't need to 'understand' these constraints") reads as general principle. The document should clearly delineate: "Here's the general principle → here's how OpenCode implements it."

---

### 4. Double Conclusion — Two Endings with No Synthesis

**Section:** "Key Lessons" (lines 282–295) → horizontal rule → Conclusion (lines 296–318)

**Text (first conclusion):**
> "Modes define persona, not just behavior. When the system shifts to `design`, it's not just different commands—it's a different *mindset*. Same model, different context, different output. **Skills should be implicit.** Domain knowledge shouldn't be invoked... **Commands are simple prompts that orchestrate.** `/plan` isn't a knowledge base... **Subagents keep context clean.** They're ephemeral. They spawn, they work, they die... **Separation enables scale.** These agents handle long, complex tasks..."

**Problem:** This section presents five bullet-point takeaways that are largely verbatim restatements of earlier claims:

| Earlier Statement | Conclusion Statement |
|-------------------|----------------------|
| "Modes define persona, not just behavior" (lines 97–103) | "Modes define persona, not just behavior" (line 286) |
| "Skills should be implicit" (lines 49–51) | "Skills should be implicit" (line 288) |
| "Commands are simple prompts that orchestrate" (lines 153–166) | "Commands are simple prompts that orchestrate" (line 290) |
| Subagents keep context clean (lines 140–146) | "Subagents keep context clean" (line 292) |
| "Separation enables scale" (lines 80–82) | "Separation enables scale" (line 294) |

A conclusion should *synthesize* or *elevate*, not repeat. The reader expects new insight at the end; instead, they get a checklist. The second conclusion (lines 296–318) compounds this by adding the company analogy (lines 298–305), which feels tacked on and decorative, followed by a return to frustration-framing ("Don't add more skills to your agent") that echoes the opening without building on the journey the reader just took.

---

### 5. Section Proportion Imbalance — Implementation Overwhelms

**Section:** "The OpenCode Implementation" (lines 86–227)

**Breakdown by section:**

| Section | Approximate Lines | % of Document |
|---------|-------------------|---------------|
| Problem (Skill Accumulation + Context Drift) | ~32 | 10% |
| Theory (Four Elements + table + Why Separation Matters) | ~52 | 16% |
| Implementation (Modes + Subagents + Commands + Literate Commands + Directory Structure) | ~140 | 44% |
| Examples (Adding a Feature + Deep Research + Writing Documentation) | ~54 | 17% |
| Key Lessons | ~14 | 4% |
| Conclusion | ~22 | 7% |

**Problem:** The Implementation section alone accounts for roughly 44% of the document. This makes the piece feel backend-heavy — the reader spends more than two-fifths of their time in architecture details before seeing a single practical example. Meanwhile, the Problem and Theory sections combined get only 26% of the space, despite being the conceptual foundation. The Examples section (the most engaging part) gets 17%, which feels short given its value.

---

## Structural Issues

### 6. Introduction Lacks Document Roadmap

**Section:** Introduction (lines 1–7)

**Text:**
> "You've been using AI coding agents for months. You've crafted elaborate system prompts. You've added a dozen skills. You've learned the dance of context window management. And somewhere around the third hour of work, something breaks."

**Problem:** The opening effectively sets a relatable scenario and delivers a strong thesis ("This isn't a failure of the model. This is a failure of architecture"), but it doesn't preview the document's roadmap. Readers don't know whether they'll get theory first, implementation first, or a mix. A sentence like "I'll walk through why current systems fail, introduce a four-element framework for thinking about agent architecture, then show you how I implemented it in OpenCode" would orient the reader and set expectations.

---

### 7. Orphan Conceptual Paragraph — Compass Metaphor Doesn't Bridge

**Section:** "The Plan/Build Oversimplification" (lines 17–21)

**Text:**
> "The plan is a map. But terrain changes. The agent needs a compass, not just a destination."

**Problem:** This elegant aphorism stands alone as a conceptual peak rather than functioning as a bridge. It summarizes the section's point but provides no connective tissue to "The Context Drift Symptom" that follows. The reader must manually infer the link between "compass metaphor" and context drift. The paragraph doesn't *explain* what comes next — it simply *reflects* on what was said. A bridge sentence like "That's why context management matters so much" would restore momentum.

---

### 8. Redundant Definition Without Bridge

**Section:** "Why This Separation Matters" (lines 73–75)

**Text:**
> "A skill is something the agent just *knows*. A command is a script."

**Problem:** This is a verbatim repetition of the definitions given at lines 49 and 53–54. The section begins by restating definitions the reader just learned, with no bridge explaining *why* this restatement is necessary or what new angle it introduces. The paragraph feels like a recap that interrupts the flow of argument rather than advancing it. It should become a launchpad: "Understanding this distinction unlocks everything else. Once you see skills as implicit knowledge and commands as explicit scripts, the rest of the architecture follows naturally."

---

### 9. Section-Ending Aphorism as Dead End

**Section:** End of "The Four Elements" (line 84)

**Text:**
> "That's the anatomy of AI agents. Four concerns, cleanly separated."

**Problem:** This conclusion to the theoretical section is self-contained and final-sounding. It echoes the document title but provides no bridge to the next major section. The reader gets no signal that the focus is about to shift from *theory* ("what every agent system manages") to *implementation* ("how I built OpenCode"). Compare this to the strong transition at lines 228–230: "Theory is nice. Let me show you how this actually works." — that one explicitly names the shift. Line 84 needs a "coming up" signal.

---

### 10. Section-Ending Phrase Without Forward Bridge

**Section:** End of "Directory Structure" (lines 224–227)

**Text:**
> "You'll see this pattern throughout: the constraints aren't limitations, they're the architecture. Mode-based permissions prevent accidents. Scratch-space subagents prevent noise. Literate commands prevent magic. Each decision trades flexibility for reliability—and reliability is what scales."

**Problem:** This is a strong concluding sentence, but it's followed immediately by a section break and a new section ("Adding a Feature"). There's no bridge signal that the next section will demonstrate these principles in action. The reader doesn't know whether to expect more architectural detail or a shift to examples. A sentence like "But architecture is abstract. Let me show you what it looks like when it runs" would prime the transition.

---

### 11. Analogy Section Tacked On

**Section:** Company Analogy (lines 298–305)

**Text:**
> "Think about how a company works. You have departments (modes), specialists (skills), procedures (commands), and temporary contractors (subagents). Clear roles, delegated responsibilities, explicit processes. That's what makes human organizations work."

**Problem:** This analogy arrives without preparation, after the conclusion has already begun ("Good AI agents are good systems"), and doesn't integrate with the preceding content. It reframes concepts the reader already understands, offering no new functional insight. It's decorative rather than developmental. If kept, it should appear earlier — perhaps as part of the Theory section, before the implementation details, to make the Four Elements more concrete before diving into YAML configurations.

---

## Paragraph Structure Issues

### 12. Blended Topic in Skill Definition — Definition Bleeds Into Contrast Mid-Paragraph

**Section:** "The Four Elements" — Skill definition (lines 49–51)

**Text:**
> "A skill is something the agent just *knows*. It doesn't get invoked—it gets applied. When you give an agent knowledge about SQL optimization, that skill is available whenever relevant. The agent doesn't need to be told to use it. Unlike modes, skills can layer. An agent might have a SQL skill, a documentation skill, and a debugging skill—all active simultaneously, all contributing when relevant. Skills are implicit because the agent should just apply them naturally."

**Problem:** This paragraph addresses three distinct ideas: (1) what a skill is, (2) how skills layer differently than modes, and (3) that skills are implicit. The shift from explaining the basic concept to contrasting with modes mid-paragraph breaks unity. The final sentence restates the first idea, suggesting the middle content is parenthetical. This paragraph should be split: one paragraph for the definition, a separate one for the layering contrast.

---

### 13. Blended Topic in Command Definition — Definition Bleeds Into Rationale

**Section:** "The Four Elements" — Command definition (lines 53–55)

**Text:**
> "A command is a script. It tells the agent: do this, in this order, using these tools. 'Refactor this function' is a command. 'Run these tests and report results' is a command. Commands are *explicit*—you invoke them. And here's the key: commands are intentionally simple. They orchestrate. They delegate. They don't contain knowledge. That's intentional separation of concerns."

**Problem:** The paragraph begins defining what a command is, provides examples, then pivots to explaining why commands are simple and what separation of concerns means. The phrase "And here's the key" signals a new idea, but it remains in the same paragraph. "That's intentional separation of concerns" is a standalone insight that deserves its own paragraph to land properly.

---

### 14. Single-Sentence Paragraphs Bury Key Insights

**Location:** Multiple — lines 78–79, 82, and throughout

**Text:**
> "When you separate these concerns—modes for persona, skills for knowledge, commands for orchestration, subagents for delegation—you get something beautiful."
>
> "The system scales because the pieces are independent. Change one without breaking the others."
>
> "That's the anatomy of AI agents. Four concerns, cleanly separated."

**Problem:** These single-sentence paragraphs contain some of the document's most important takeaways, but their brevity undermines impact. "That's the anatomy of AI agents. Four concerns, cleanly separated" is the thesis payoff of the entire first section — it deserves more space to resonate. Either expand each into a 2–3 sentence paragraph with a concrete implication, or merge it with the preceding paragraph so it lands as a closing thought rather than a floating statement.

---

### 15. Workflow Lists as Walls of Text — No Internal Structure

**Section:** "Adding a Feature" (lines 234–245)

**Text:**
> "You want to implement user authentication. Here's what happens: 1. You type: `opencode /plan implement user authentication` 2. The system shifts into `design` mode—suddenly it's thinking architecture, not code 3. `/plan` spawns an `investigator` subagent. This little agent reads your codebase, understands the existing patterns, and reports back 4. `/plan` writes `.knowledge/plans/auth-implementation.md`. A file. Not a memory, not a context injection—a file you can actually read 5. You review the plan. You approve it. Or you don't 6. You type: `opencode /build implement user authentication` 7. Now the system shifts to `create` mode—production mode, execution mode 8. `/build` runs its TCR loop (test, commit, revert). For each step, it might spawn a `tester` subagent to validate the work 9. Changes commit atomically. The journal logs everything"

**Problem:** Nine steps presented as one monolithic paragraph. Steps 1–5 address the `/plan` phase; steps 6–9 address the `/build` phase, but there's no visual or structural break between them. The reader must parse the entire block before understanding the two-phase structure. Grouping steps 1–5 and 6–9 into separate paragraphs with a transitional sentence ("Once approved, implementation begins") would dramatically improve scannability.

---

### 16. Same Problem in "Deep Research" Workflow

**Section:** "Deep Research" (lines 252–260)

**Text:**
> "You need to understand OAuth2 best practices. Here's what happens: 1. You type: `opencode /research OAuth2 best practices` 2. The system shifts into `analyze` mode—curiosity mode, synthesis mode 3. `/research` spawns 5 `scout` subagents in parallel 4. Each scout reads 50 pages from the web, returns summaries 5. The main agent synthesizes those 5 summaries into one coherent report 6. The report lands in `.knowledge/notes/oauth2-research.md`"

**Problem:** Six steps crammed into a single paragraph. The transition from steps 1–3 (initiation) to steps 4–6 (execution/results) could be clearer with paragraph breaks and transitional language.

---

### 17. Same Problem in "Writing Documentation" Workflow

**Section:** "Writing Documentation" (lines 267–278)

**Text:**
> "You need to document a new API. Here's what happens: 1. You type: `opencode /draft API reference documentation` 2. The system shifts into `create` mode with `drafter` and `critic` subagents 3. `/draft` scans your codebase, extracts the API signatures and comments 4. It initializes a draft file with proper structure 5. The `drafter` subagent writes section by section 6. The `critic` subagent reviews each section for clarity and completeness 7. You review the draft, suggest changes, approve sections 8. Final documentation lands in `docs/api-reference.md`"

**Problem:** Same structural issue as the other walkthroughs. Eight steps, no internal paragraph breaks.

---

### 18. Key Lessons Section — Bold Claims Without Evidence

**Section:** "Key Lessons" (lines 284–294)

**Text:**
> "**Modes define persona, not just behavior.** When the system shifts to `design`, it's not just different commands—it's a different *mindset*. Same model, different context, different output. **Skills should be implicit.** Domain knowledge shouldn't be invoked. You shouldn't say 'use your Python skill.' The agent should just *know* Python patterns. Skills are knowledge, not tools. **Commands are simple prompts that orchestrate.** `/plan` isn't a knowledge base. It's a prompt that says: 'do this sequence of things.' The complexity lives in the *orchestration*, not the command itself. **Subagents keep context clean.** They're ephemeral. They spawn, they work, they die. The main agent never accumulates their noise. **Separation enables scale.** These agents handle long, complex tasks because they're not trying to do everything at once. They divide the work."

**Problem:** Five principle statements formatted as bold headers with 2–3 sentences each. While the bold headers make them scannable, the brevity leaves each principle under-explained. The audience (developers dealing with AI agent frustration) would benefit from at least one supporting detail per principle — a quick example of what "implicit skills" looks like in practice, or concrete evidence that separation enables scale. The walkthroughs earlier in the document provide this evidence; these principles would be stronger if they explicitly referenced it.

---

### 19. Missing Topic Sentence in Analyze Mode Entry

**Section:** "The Three Modes" — Analyze mode description (lines 126–127)

**Text:**
> "When you type `/research API design patterns`, the agent enters analyze mode. It reads your codebase to understand context. It spawns `scout` subagents to search the web. It writes summaries to `.knowledge/notes/`. But it never touches your source code. That's design."

**Problem:** This paragraph describes what happens in analyze mode but has no explicit topic sentence. The reader must infer the topic from context. A sentence like "Analyze mode is read-only by design" or "This is how research actually works" would anchor the paragraph and provide a clearer entry point.

---

### 20. Subagent Example Paragraph Lacks Topic

**Section:** "The Subagents" — scout example (lines 142–144)

**Text:**
> "The `scout` subagent spent 30 minutes reading 200 web pages. Its reasoning is private—the main context never sees those 200 pages. It returns: 'Found 5 relevant sources, here's the synthesis.' Clean context, deep research."

**Problem:** "Clean context, deep research" is an excellent closing statement, but there's no topic sentence explaining what this example illustrates. The paragraph would benefit from opening with something like "This isolation is the key to scalable research" before diving into the scout example.

---

## Patterns to Address

| Pattern | Instances | Impact |
|---------|-----------|--------|
| **Section-ending aphorisms** | Lines 22, 84, 123, 227 | Creates "end of thought" feeling rather than "onward to next point" feeling |
| **Repetitive restatements** | Lines 74–75, 286–294 | Signals structural dead-end; reader expects forward movement |
| **Missing "what's next" signals** | Lines 31–33, 84–88, 227–228 | Readers have no preparation for major topic shifts |
| **Workflow lists as walls of text** | Lines 234–245, 252–260, 267–278 | Dense blocks without breathing room or internal structure |
| **Definition-then-contrast blending** | Lines 49–51, 53–55 | Breaks paragraph unity; contrast material bleeds mid-paragraph |
| **Key insights in single-sentence paragraphs** | Lines 78–79, 82, and others | Undermines impact; sentences float without supporting context |
| **Principle statements lacking evidence** | Lines 286–294 | Bold claims stand alone without referencing the walkthroughs that support them |

---

## Strengths

- **Strong opening hook** — The scenario of agent failure after hours of work is immediately relatable and specific (lines 5–7). The thesis ("This isn't a failure of the model. This is a failure of architecture") is direct and memorable.
- **Effective use of contrast** — "More skills made it worse. Not better." (line 13) lands hard because it contradicts expectation.
- **Compelling metaphor** — "The plan is a map. But terrain changes. The agent needs a compass, not just a destination." (line 21) crystallizes a key insight.
- **The Four Elements framework** — Mode/Skill/Command/Subagent is a clean, memorable taxonomy. The comparison table (lines 63–68) efficiently distills complex concepts into comparable dimensions.
- **Major section transitions are exemplary** — "Theory is nice. Let me show you how this actually works." (lines 228–230) and lines 86–90 are textbook examples of signposting: they name what changed, what comes next, and why.
- **Concrete code examples** — YAML mode configurations (lines 106–121) make the abstract concrete and demonstrate actual implementation.
- **The literate commands innovation** — This is the document's most original contribution, explained with clear rationale and code examples.
- **The walkthroughs are the document's most engaging content** — "Adding a Feature," "Deep Research," and "Writing Documentation" show *application* rather than *assertion*.
- **Visual breaks are excellent** — Horizontal rules properly segment the document into digestible sections. Bold element headers make skimming easy. The comparison table provides clear visual contrast.
- **Paragraph length is generally appropriate** — Most paragraphs are 3–6 sentences — long enough to develop an idea, short enough to maintain energy.
- **Strong closing line** — "Build for the long game. Your future self (and your context window) will thank you." — memorable, personal, actionable.

---

## Recommendations (Prioritized)

### P0 — Fix Before Anything Else

1. **Restructure the pivot at line 88** — Frame the Four Elements as "conceptual foundation for what follows," not a standalone theory. Line 88 should say: "Here's how I applied this framework to build OpenCode." The reader should never feel that the theory and implementation are separate solutions.

2. **Eliminate the double conclusion** — Merge "Key Lessons" into the Conclusion as prose synthesis, not bullet-point repetition. The conclusion should answer: "Given the implementation examples above, what *new* insight emerges?" — e.g., the cost of separation (the discipline it requires), or the surprise of emergent properties (line 224: "I didn't plan this symmetry"). Remove the horizontal rule at line 296.

3. **Add a document roadmap to the introduction** — After the thesis (line 7), add 2–3 sentences previewing the structure: "I'll walk through why current systems fail, introduce a four-element framework for thinking about agent architecture, then show you how I implemented it in OpenCode."

### P1 — Major Improvements

4. **Balance section proportions** — Target 15–25% of length per major section. Condense Commands and Directory Structure into a combined subsection (~20 lines each), or trim the Implementation section's depth. Alternatively, expand Problem and Theory to provide more depth before diving into implementation details.

5. **Break up workflow lists** — Group steps in "Adding a Feature," "Deep Research," and "Writing Documentation" into logical phases with paragraph breaks and transitional sentences. For "Adding a Feature": split steps 1–5 (the `/plan` phase) from steps 6–9 (the `/build` phase) with a sentence like: "Once approved, implementation begins."

6. **Replace repetitive definitions with forward bridges** — Lines 74–75 should become a launchpad rather than a recap: "Understanding this distinction unlocks everything else. Once you see skills as implicit knowledge and commands as explicit scripts, the rest of the architecture follows naturally."

### P2 — Polish Pass

7. **Expand key single-sentence paragraphs** — "That's the anatomy of AI agents. Four concerns, cleanly separated" and the five principle statements deserve 2–3 sentences each to land properly. Add a concrete implication, a contrast with the broken alternative, or a brief consequence of ignoring the principle.

8. **Standardize definition paragraphs** — Create a consistent structure for Mode, Skill, Command, and Subagent definitions: (1) topic sentence — what it is; (2) 2–3 sentences of explanation with concrete examples; (3) optional contrast with adjacent elements; (4) closing sentence reinforcing the role. This resolves the blending issues in Skill and Command definitions.

9. **Add bridge sentences after key aphorisms** — Every time you write a standalone insight like "The plan is a map..." or "That's the anatomy of AI agents," add one sentence that explicitly links to the next topic.

10. **Standardize walkthrough depth** — "Adding a Feature" is the most detailed walkthrough. "Deep Research" and "Writing Documentation" are abbreviated. Bring them to comparable depth, or acknowledge explicitly that one serves as the detailed example and the others are shorthand.

---

## Checklist

- [ ] Clear thesis or purpose statement in introduction — **Yes, but no roadmap**
- [ ] Logical progression of main points — **Partial — premature solution delivery breaks arc**
- [ ] Each paragraph focused on a single main idea — **Partial — blending issues in definition paragraphs**
- [ ] Effective transitions between paragraphs and sections — **Partial — major transitions strong, micro-transitions weak**
- [ ] Appropriate use of headings and subheadings — **Yes**
- [ ] Conclusion summarizes and provides closure (not repetition) — **No — double conclusion with verbatim repetition**
- [ ] No gaps in logic or missing supporting information — **No — scope confusion between general principles and OpenCode specifics**
- [ ] Balance of section lengths — **No — Implementation at 44%, others underweight**
- [ ] Reader can follow the argument without confusion — **Partial — scope oscillation causes friction**
- [ ] Structure appropriate for intended purpose and audience — **Yes**
- [ ] No buried main points — **Yes — thesis is clear and early**
- [ ] No orphaned or dead-end paragraphs — **Partial — several aphorisms land as dead ends**
