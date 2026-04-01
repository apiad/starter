# Review Report: The Anatomy of AI Agents

**Document:** `.knowledge/drafts/the-anatomy-of-ai-agents-full.md`  
**Review Type:** General (Holistic) — Structure, Content, Style  
**Reviewer:** critic subagent  
**Date:** 2026-04-01

---

## Executive Summary

This document makes a compelling case for architectural separation in AI agent systems, and its core framework—Mode/Skill/Command/Subagent—is valuable and clearly articulated. The practical examples effectively ground the theory, and the personal voice is engaging throughout. However, the document has a significant structural flaw: **Skills are central in theory but absent from the implementation discussion**, creating a broken promise that undermines credibility. Additionally, abrupt transitions, informal phrasing, and repetitive word choice create rough edges that distract from an otherwise solid piece. With targeted fixes—particularly addressing the Skills implementation gap and smoothing transitions—this document could be genuinely excellent.

**Overall Grade: Acceptable — Needs Targeted Fixes to Reach Strong**

---

## 1. Structural Review

### Summary

The document has a strong narrative arc moving from problem diagnosis to framework introduction to implementation details to practical examples, ending with principles and a call to action. However, the `---` section breaks create discrete "chunks" that don't always flow smoothly into each other, and the transition at line 88 ("After three failed attempts...") feels abrupt. The document is organized by concept type (problems → theory → implementation → examples → principles), which works well for a technical audience, but the transitions between major sections need work.

### Issues Found

1. **Abrupt transition into implementation section (line 88)**  
   > "After three failed attempts at building an agent framework, I learned what works. Let me show you the architecture that actually scales."  
   
   This line follows immediately after the theoretical framework explanation ends, with only a `---` separator. The shift from abstract theory to personal narrative feels jarring. There is no bridging paragraph to guide the reader from "here's the theory" to "here's how I applied it."  
   **Fix:** Add 2-3 sentences before line 88 that acknowledge the theory is complete and now transition to practical application. Example: "Theory is useful, but architecture lives in implementation. Here's how I built this."

2. **Missing "Skills" from implementation section (lines 88-227)**  
   The Four Elements framework (lines 42-84) prominently features Mode, Skill, Command, and Subagent. But the entire implementation section (lines 88-227) never mentions Skills again—not in "The Three Modes," "The Subagents," "The Commands," "The Literate Commands Innovation," or "Directory Structure." The section headings in the implementation block are:
   - "The Three Modes" (lines 92-127)
   - "The Subagents" (lines 128-146)
   - "The Commands" (lines 148-167)
   - "The Literate Commands Innovation" (lines 168-202)
   - "Directory Structure" (lines 204-227)
   
   Notice: no "The Skills" section. The author says at line 288: "Skills should be implicit," but never shows how OpenCode implements them.  
   **Fix:** Either add a "The Skills" section explaining how Skills are actually implemented in OpenCode, or explicitly state that Skills are handled differently and explain how.

3. **Directory structure omits `subagents/` (lines 208-220)**  
   > ```
   > .opencode/
   > ├── agents/           # Mode definitions (persona + permissions)
   > ├── commands/         # Workflow definitions (simple prompts)
   > ├── skills/          # Domain knowledge (implicit)
   > └── tools/           # Utilities
   > ```
   
   The conceptual framework defines Subagents as one of the four elements, but the directory structure diagram shows no `subagents/` directory. This inconsistency will confuse readers who expect a 1:1 mapping between the framework and the implementation.  
   **Fix:** Either add `subagents/` to the directory structure, or explain why subagents don't live in `.opencode/`.

4. **Company/organization analogy placed too late (lines 298-304)**  
   > "Think about how a company works. You have departments (modes), specialists (skills), procedures (commands), and temporary contractors (subagents)..."  
   
   This analogy is genuinely insightful and provides an intuitive entry point into the framework. However, it appears at line 298—near the very end of a 318-line document. The reader has already consumed the entire framework without this anchor.  
   **Fix:** Move this analogy to appear right after the Four Elements explanation (around line 85) as a "here's how to remember this" section.

5. **Excessive `---` section breaks**  
   Horizontal rule dividers appear at lines 33, 86, 228, 282, 296, and 306. That's 6 section breaks in 318 lines—averaging one every 53 lines. While some breaks are necessary, others fragment the reading experience. Specifically:
   - Line 33 breaks after "The solution isn't better prompts. It's better architecture." but before the Four Elements explanation that was just teased.
   - Line 86 breaks after the table, but the next section (line 88) directly continues the same thought.
   **Fix:** Remove the `---` at line 33 and consider removing the one at line 86 if the Four Elements and implementation sections are meant to flow together.

6. **First section ends anti-climactically (line 31)**  
   > "The solution isn't better prompts. It's better architecture."  
   
   This is a strong closing for the first section, but immediately after (line 35), the document shifts to explaining "The Four Elements" without acknowledging this transition. The hook at line 7 ("This isn't a failure of the model. This is a failure of architecture") sets up an expectation of a solution, but the solution doesn't arrive until line 35—"Every AI agent system addresses four concerns."  
   **Fix:** Consider adding a bridging sentence between lines 31 and 35: "What are those concerns? Let me break it down."

7. **Two "final thoughts" sections compete (lines 284-295 and 298-317)**  
   Lines 284-295 ("After building and using agents this way, here's what I've learned") and lines 298-317 (the company analogy + call to action) both feel like conclusions. The second one is stronger, but the first one precedes it, diluting impact.  
   **Fix:** Consolidate into one conclusion. Merge the key lessons into the company analogy section or move the company analogy up (see issue #4 above).

### Patterns to Address

- **Inconsistent section depth:** The problem diagnosis gets ~23 lines, the theoretical framework ~42 lines, the implementation section ~139 lines, the practical examples ~50 lines, and the lessons/conclusion ~34 lines. Consider whether this balance serves the reader's journey.
- **Transitions are consistently weak:** Nearly every major section break suffers from abrupt shifts. This is a systemic pattern, not an isolated issue.

### Strengths

- **Excellent narrative hook** (lines 5-7): Creates immediate empathy and establishes a clear thesis.
- **Clear problem → theory → practice → principles arc**: Logical progression for the intended audience.
- **The table at lines 63-68 is excellent**: Visually breaks up text and crystallizes the four-element distinction.
- **Practical walkthroughs are strong**: "Adding a Feature," "Deep Research," and "Writing Documentation" ground the theory in concrete examples.
- **The closing is memorable**: "Build for the long game. Your future self (and your context window) will thank you." lands well.

### Recommendations

1. **[High Priority]** Address the missing Skills implementation. Either add a "The Skills" section or revise the Four Elements framework to accurately reflect what was built.
2. **[High Priority]** Smooth the transition between the theoretical framework (ending ~line 84) and the implementation section (starting ~line 88). Add a bridging paragraph.
3. **[High Priority]** Add `subagents/` to the directory structure or explain why it's absent.
4. **[Medium Priority]** Move the company/organization analogy to appear right after the Four Elements explanation (~line 85).
5. **[Medium Priority]** Reduce the number of `---` breaks. Remove the ones that fragment related content.
6. **[Low Priority]** Consolidate the two conclusion sections into one.

---

## 2. Content Review

### Summary

The document makes a compelling case for architectural separation in AI agent systems, and the core arguments (Modes define permissions, Commands orchestrate, Subagents isolate, Skills are implicit knowledge) are logically sound and well-supported by the author's experience. However, there are some factual gaps, thin claims, and a significant broken promise regarding Skills in the implementation section.

### Issues Found

1. **Unsubstantiated experiential claims (lines 13, 27)**  
   > Line 13: "I've watched this happen in real time: an agent that was brilliant at code review started forgetting our coding standards because we added eight other skills."  
   > Line 27: "I've seen this happen mid-sprint."  
   
   These are presented as eyewitness testimony but lack specificity. When did this happen? What was the project? What were the eight skills? Without context, these read as unverifiable assertions that weaken the argument for readers who might be skeptical.  
   **Fix:** Add minimal detail to make these credible: "In a project last year, an agent that was brilliant at code review started forgetting our coding standards after we added eight other skills." Or reframe as general patterns: "This commonly happens when skills pile up without architectural separation."

2. **Overstatement at line 17**  
   > "Every agent framework implements the same pattern: analyze → plan → build. It's become a cliché."  
   
   This is an overstatement. Some frameworks (like LangChain agents, AutoGPT, CrewAI, Microsoft's Semantic Kernel) implement variations that don't follow this linear pattern. LangChain, for example, uses agent types with tool use and reflection loops.  
   **Fix:** Qualify the claim: "Many simple agent frameworks implement the same pattern: analyze → plan → build. It's become a cliché in starter tutorials."

3. **Skills are central in theory but absent in practice (structural gap)**  
   The document's own framework defines four elements (Mode, Skill, Command, Subagent), but the implementation discussion covers only three (Mode, Command, Subagent). The `skills/` directory appears in the directory structure diagram (line 218) but is never explained in the implementation section. The author says (line 288) "Skills should be implicit," but never shows how OpenCode implements them. This is a broken promise to the reader.  
   **Fix:** Add a "The Skills" section explaining how Skills are implemented in OpenCode (even if brief).

4. **Mode enforcement mechanism missing (lines 102-104)**  
   > "The agent literally lacks the capability. There's no 'are you sure?' dialog. There's no flag to check. The agent simply cannot write code in analyze mode because that mode's configuration doesn't grant file write access to `src/`, `lib/`, or any other production directory."  
   
   The claim is strong but the mechanism is absent. How does this configuration actually work? Is it:
   - System prompt engineering (the mode description restricts behavior)?
   - Tool access controls (the agent API keys don't have write access)?
   - Runtime permission checks (the orchestrator checks before executing)?
   - Something else?
   
   Without this explanation, the claim reads as aspirational rather than implemented.  
   **Fix:** Add a brief explanation of how mode-based permissions are enforced (even one sentence: "Enforced through mode-specific tool configurations in the agent orchestrator").

5. **Literate command conditionals not demonstrated (lines 200-201)**  
   > "Conditionals enable another pattern entirely: branching workflows. If the tests pass, commit. If they fail, run the linter and show the output. You express this logic in plain Markdown with simple `{{#if}}` blocks."  
   
   The document never shows a working example of `{{#if}}` blocks. The only literate command example (lines 174-192) shows variables but no conditionals. This leaves the reader with "trust me, it works" rather than evidence.  
   **Fix:** Add a second literate command example showing conditionals in action, or at minimum show the `{{#if}}` syntax in a code block.

6. **Arbitrary "200 pages" claim (line 130)**  
   > "Now let's talk about how research actually happens. You don't want the main agent wading through 200 web pages. That's noise."  
   
   This specific number appears arbitrary. Is this based on actual experience? An estimate?  
   **Fix:** Justify the number ("Research tasks typically surface 200+ pages of results, which would saturate context") or use a general phrasing ("dozens of pages" or "hundreds of pages").

7. **OpenCode introduced too late (line 312)**  
   > "The framework I use is called OpenCode."  
   
   This is surprisingly late for a document that describes a specific implementation in detail. The reader has consumed 312 lines without knowing what to call the system being described.  
   **Fix:** Introduce "OpenCode" by name when the implementation section begins (around line 88-90).

8. **Thin claim about company analogy at line 298**  
   > "Think about how a company works. You have departments (modes), specialists (skills), procedures (commands), and temporary contractors (subagents)."  
   
   This analogy is excellent, but it only mentions the parallel without explaining the mechanism. The analogy works at a surface level but could be deeper. What makes each parallel meaningful?  
   **Fix:** Expand the analogy slightly to show how the parallel creates insight, not just memorability.

### Patterns to Address

- **Vague personal testimony:** Several "I've seen/watched" claims lack specifics. While the document benefits from a personal voice, claims need enough detail to be credible.
- **Mechanism explanations missing:** Several claims about HOW things work are asserted but not explained (mode enforcement, literate command conditionals, skill implementation).
- **Scope mismatch:** The theoretical framework promises four elements, but the implementation covers only three.

### Strengths

- **Core argument is sound:** The separation of Mode/Skill/Command/Subagent is a valid architectural principle that the author has clearly internalized and applied.
- **The permission-based mode insight is valuable:** Lines 102-104 explain mode-based permissions as enforced constraints rather than behavioral guidelines. This is a genuinely useful insight.
- **The scratch-space subagent pattern is well-explained:** The explanation of `.playground/` as gitignored scratch space (lines 140-146) is clear and demonstrates thoughtful design.
- **Practical examples are concrete:** The three walkthroughs ("Adding a Feature," "Deep Research," "Writing Documentation") ground abstract principles in specific workflows.
- **No logical fallacies detected:** The arguments follow logically, and counterarguments are implicitly addressed through the practical demonstrations.

### Recommendations

1. **[High Priority]** Add a "The Skills" section explaining how Skills are actually implemented in OpenCode, or explicitly state that Skills are handled differently and explain how.
2. **[High Priority]** Add a brief explanation of HOW mode-based permissions are enforced.
3. **[Medium Priority]** Qualify the "every agent framework" claim at line 17.
4. **[Medium Priority]** Add an example of literate command conditionals to make the "state machine" claim concrete.
5. **[Low Priority]** Introduce "OpenCode" by name earlier in the implementation section.
6. **[Low Priority]** Add minimal specificity to experiential claims ("I've watched this happen").

---

## 3. Style Review

### Summary

The document maintains a consistent semi-formal, confident tone with a clear personal voice. Prose is generally crisp and direct, with good use of metaphor and concrete language. However, there are scattered issues with repetition, a few informal phrases that break tone, and some potential clarity problems.

### Issues Found

1. **"Context bloat" repeated three times (lines 13, 29, 261)**  
   > Line 13: "...they pile up, and hallucinations increase. I've watched this happen in real time..."  
   > Line 29: "The context window had filled with everything else..."  
   > Line 261: "Here's what matters: 30 minutes of research. 0 context bloat."  
   
   While repetition can be a rhetorical device, it reads more like oversight here. These three uses are spread across the document with no apparent intentionality.  
   **Fix:** Consider synonyms: "context saturation," "context overload," "context pollution."

2. **"That's it" is too casual (line 162)**  
   > "That's it. The command itself doesn't know how to build."  
   
   This casual dismissal after a code block breaks the professional tone.  
   **Fix:** "The configuration is straightforward" or simply remove "That's it."

3. **"Implicit/explicit" overused**  
   These terms are used frequently (lines 45-55, 63-70) to describe Mode/Skill vs. Command/Subagent activation. This is intentional and effective in the framework section, but the words appear too often outside that context. Lines 47-48 use "implicit" three times in four sentences:  
   > "Here's the thing: modes are *implicit*. You don't say 'now you're in analysis mode.' The context tells the agent which mode to adopt. Mode = the who, not the what."  
   
   **Fix:** Vary word choice: "Modes operate in the background" instead of "modes are implicit."

4. **"Curiosity mode" is informal (line 256)**  
   > "The system shifts into `analyze` mode—curiosity mode, synthesis mode"  
   
   "Curiosity mode" uses colloquial phrasing that doesn't match the clinical tone elsewhere.  
   **Fix:** "analysis mode—research mode, synthesis mode" or similar clinical phrasing.

5. **Pronoun ambiguity (line 237)**  
   > "The system shifts into `design` mode—suddenly it's thinking architecture, not code."  
   
   The pronoun "it" could refer to either "the system" or "the agent." Context implies the agent, but clarity would improve.  
   **Fix:** "the agent shifts into design mode—suddenly it's thinking architecture..."

6. **Mixed metaphor at line 248**  
   > "You're not watching a black box hallucinate solutions."  
   
   "Black box" and "hallucinate" are both AI-specific terms, but mixing them creates slight cognitive dissonance. "Black box" implies opacity; "hallucinate" implies creativity gone wrong.  
   **Fix:** "You're not watching a black box" works; consider "generate wrong solutions" instead of "hallucinate."

7. **Em-dash construction slightly awkward at line 12**  
   > "But they pile up as implicit context—always-on knowledge the agent carries but can't prioritize."  
   
   The em-dash construction is slightly clunky.  
   **Fix:** "But they pile up, creating implicit context—always-on knowledge the agent carries but can't prioritize." (use commas instead of em-dash after "pile up").

8. **Inconsistent capitalization of "command"**  
   The section headings use title case ("The Commands," "The Literate Commands Innovation"), but the body text occasionally refers to "Command" as a proper noun.  
   **Fix:** Use lowercase "command" in body text when referring to the general concept, title case only in headings.

9. **"Black box hallucinate" at line 248**  
   See issue #6 above. Flagged separately because it's a compound issue.

10. **"I haven't seen anywhere else" at line 196**  
    > "Here's the insight I hadn't seen anywhere else: the command is the user interface."  
    
    This phrasing is slightly awkward. "I hadn't seen anywhere else" implies the author searched for it and didn't find it, which is a strong claim.  
    **Fix:** "This is the key insight: the command is the user interface" or "Unlike in other systems, the command is the user interface."

### Patterns to Address

- **Repetitive word choice:** Words like "implicit," "explicit," and "context" appear very frequently. While they're central to the framework, variation would improve readability.
- **Tone consistency:** Some casual phrases ("That's it," "curiosity mode") interrupt the professional tone.

### Strengths

- **Strong use of metaphor:** "The plan is a map. But terrain changes. The agent needs a compass, not just a destination" (line 21) is excellent. The company/organization analogy (lines 298-304) is also strong.
- **Clear, direct prose:** Sentences are generally short and punchy. "This isn't a failure of the model. This is a failure of architecture." is a model of clear writing.
- **Good code block presentation:** YAML examples are clean and readable, with appropriate comments.
- **Table is well-formatted:** The comparison table (lines 63-68) is a highlight—clean, readable, and genuinely useful for understanding.
- **Consistent voice throughout:** The personal "I" voice is maintained consistently, and the tone is appropriate for the target audience.

### Recommendations

1. **[Medium Priority]** Review for unintentional repetition: "context bloat" (3x), "implicit" (overused), "explicit" (overused).
2. **[Medium Priority]** Remove or rephrase "That's it" (line 162) and "curiosity mode" (line 256) for tone consistency.
3. **[Low Priority]** Clarify pronoun reference at line 237.
4. **[Low Priority]** Consider softening the metaphor at line 248.
5. **[Low Priority]** Fix the em-dash construction at line 12.

---

## 4. General / Holistic Review

### Summary

This document succeeds as a piece of technical communication that explains a useful architectural framework for AI agents. The core insight—that agent systems should cleanly separate Mode (persona/permissions), Skill (domain knowledge), Command (workflow), and Subagent (delegation)—is valuable and clearly articulated. The practical examples effectively ground the theory. However, the document has a structural gap (Skills are central in theory but absent in implementation) and some rough edges (abrupt transitions, informal phrasing, repetitive word choice) that prevent it from being excellent. With targeted fixes, this could be a genuinely outstanding piece.

### Issues Found

1. **The Skills implementation gap is the document's most significant flaw**  
   The Four Elements framework positions Skills as a core component, but the implementation section never explains how OpenCode implements Skills. The directory structure shows a `skills/` directory but doesn't explain it. This disconnect undermines the document's credibility—the author advocates for principled separation but apparently doesn't apply it to Skills.  
   **Fix:** See Structural Issue #2 and Content Issue #3.

2. **The document is implicitly promotional but doesn't own it**  
   The document describes OpenCode in detail and ends with "The framework I use is called OpenCode. It's what I built to practice what I preach." The author is clearly promoting a tool, but this isn't stated up front. The document would be more honest if it acknowledged: "This document describes the architecture of OpenCode, the agent framework I built. The principles apply broadly, but the implementation details are specific to OpenCode."  
   **Fix:** Add a brief acknowledgment in the introduction or at the start of the implementation section.

3. **Quality inconsistency across sections**  
   - Problem diagnosis (lines 9-31): Excellent—vivid, specific, empathetic.
   - Four Elements framework (lines 42-84): Clear and well-structured.
   - Implementation section (lines 88-227): Detailed but missing Skills.
   - Practical examples (lines 232-281): Strong.
   - Conclusion (lines 298-317): Excellent.
   
   But the transitions between sections are weak, creating a choppy reading experience. The reader feels they are moving between "rooms" rather than flowing through a narrative.  
   **Fix:** Add bridging paragraphs between major sections.

4. **The OpenCode name should appear earlier**  
   The framework is named only at line 312, despite being the central example throughout the implementation section. This forces readers to wait too long to attach a name to the described system.  
   **Fix:** Introduce "OpenCode" by name around line 88-90.

5. **The "literate commands" section may overpromise**  
   Lines 169-202 describe literate commands as a significant innovation with variables, conditionals, and state-machine capabilities. Without working code examples or a link to the actual implementation, these claims feel like marketing copy rather than documentation.  
   **Fix:** Add a link to the actual implementation or show more working examples.

### Patterns to Address

- **Structural inconsistency:** The document has a clear arc but inconsistent transitions and uneven section depth.
- **Ownership clarity:** The document should explicitly state its relationship to OpenCode upfront rather than revealing it only at the end.
- **Over-promise without proof:** Several claims (literate commands, mode enforcement) assert capabilities without evidence.

### Strengths

- **The core framework is genuinely useful:** Mode/Skill/Command/Subagent is a clean mental model that developers can apply to their own agent systems.
- **The permission-based mode insight is original and valuable:** Framing modes as enforced constraints (via permissions) rather than behavioral guidelines is a meaningful distinction.
- **Practical examples are excellent:** "Adding a Feature," "Deep Research," and "Writing Documentation" show the framework in action and make abstract principles concrete.
- **The company analogy is excellent:** Lines 298-304 connect AI agent architecture to organizational design, providing an intuitive entry point into the framework.
- **The closing lands well:** "Build for the long game. Your future self (and your context window) will thank you." is memorable and actionable.
- **No unresolved contradictions:** The document doesn't contradict itself. Claims are consistent even if some are thin.

### Recommendations

1. **[High Priority]** Fix the Skills implementation gap: either add a "The Skills" section explaining how OpenCode implements skills, or revise the Four Elements framework to accurately reflect what was built.
2. **[High Priority]** Introduce OpenCode by name in the implementation section introduction (around line 88-90).
3. **[Medium Priority]** Add a brief acknowledgment of the document's dual purpose (educational + promotional) either in the introduction or in the implementation section.
4. **[Medium Priority]** Add working code examples for literate command conditionals to support the claims in lines 200-201.
5. **[Medium Priority]** Smooth transitions between major sections to create a more cohesive reading experience.
6. **[Low Priority]** Address informal phrasing ("That's it," "curiosity mode").

---

## Overall Verdict

**Grade: Acceptable — Needs Targeted Fixes to Reach Strong**

This document makes a strong case for architectural separation in AI agent systems, and its core framework (Mode/Skill/Command/Subagent) is valuable and well-explained. The practical examples and personal voice are engaging, and the company/organization analogy provides an intuitive anchor. However, the document has a significant structural flaw: **Skills are central to the theoretical framework but absent from the implementation discussion**, creating a broken promise that undermines credibility. Additionally, abrupt transitions, informal phrasing that breaks tone, and repetitive word choice create rough edges that distract from an otherwise solid piece.

With targeted fixes—particularly addressing the Skills implementation gap and smoothing transitions—this document could be genuinely excellent. The foundation is strong; the execution needs refinement.

### Quick Wins (Low Effort, High Impact)

1. Introduce "OpenCode" by name at line 88
2. Remove "That's it" at line 162
3. Replace "curiosity mode" at line 256 with "analysis mode"
4. Remove one or two `---` breaks to reduce fragmentation
5. Add a bridging paragraph before line 88

### Major Work (High Effort, High Impact)

1. Add a "The Skills" section to the implementation
2. Add a working example of literate command conditionals
3. Explain how mode-based permissions are enforced
4. Move the company analogy to appear after the Four Elements
5. Add specificity to experiential claims ("I've watched this happen")

---

## Red Flags Summary

Regardless of review type, the following red flags were checked and results noted:

- [x] **Factual errors or unverifiable claims** — The "every agent framework" claim (line 17) is overbroad; experiential claims (lines 13, 27) lack specificity; "200 pages" (line 130) is arbitrary
- [x] **Logical fallacies in arguments** — None detected; arguments are logically consistent
- [x] **Missing source citations for data/quotes** — No external data or quotes used; this is original work
- [x] **Broken internal links or references** — No broken links detected
- [x] **Inconsistent terminology** — Minor inconsistency: "implicit/explicit" overused; capitalization of "command" inconsistent
- [x] **Mixed citation styles** — Not applicable; no citations
- [x] **Pronoun reference ambiguity** — Line 237 has ambiguous "it"
- [x] **Repeated words or phrases** — "context bloat" repeated 3x; "implicit" and "explicit" overused
- [x] **Buried or missing thesis** — Thesis is clear and well-stated in introduction
- [x] **Unresolved contradictions** — No contradictions detected
- [x] **Formatting inconsistencies** — `---` breaks are uneven; code blocks are well-formatted
- [x] **Acronyms used without introduction** — None detected

---

*End of Review Report*
