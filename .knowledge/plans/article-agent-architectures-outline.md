# Article Outline: The Anatomy of AI Agents

**Target:** 3,000 words  
**Structure:** Problem → Solution (conceptual) → Implementation (case study)  
**Tone:** Direct, opinionated, technical but accessible

---

## Thesis

Modern AI agent frameworks fail because they conflate four orthogonal concerns—*persona*, *knowledge*, *workflow*, and *delegation*—into monolithic prompts. The solution is principled separation: explicit modes for persona, implicit skills for knowledge, simple prompt commands for workflows, and ephemeral subagents for delegation. This separation enables agents that remain coherent over long, complex tasks without losing context or drifting from intent.

---

## I. The Problem: Monolithic Agents (400 words)

### Opening Hook

**Hook type:** Provocative observation  
**Tone:** "Let me show you what's broken"

> You've been using AI coding agents for months. You've crafted elaborate system prompts. You've added a dozen skills. And yet, somewhere around the third hour of work, the agent starts forgetting things, making wrong assumptions, or doing something close—but not quite—what you asked.

### The Skill Accumulation Problem

**Talking points:**
- Skills pile up as implicit context
- Every skill is "always on" → context bloat
- Agent can't tell what's relevant → hallucinations increase
- The more skills, the worse the agent performs

**Concrete example:**
- "The agent that was great at code review started forgetting our coding standards because we added 8 other skills"
- Skills compete for attention in the context window

### The Plan/Build Oversimplification

**Talking points:**
- Everyone implements: analyze → plan → build
- But "plan" is vague: what kind of planning? What scope?
- Long tasks aren't linear—they branch, loop, require backtracking
- A single plan can't capture context-sensitive decisions
- The agent needs guidance *during* execution, not just before

**Key insight:**
> "The plan is a map. But terrain changes. The agent needs a compass, not just a destination."

### The Context Drift Symptom

**Talking points:**
- After ~2 hours: agent makes 95% of progress, then fails on 5%
- Root cause: context saturation from implicit skills
- Symptoms: forgotten requirements, wrong assumptions, "hallucinated" instructions

**Transition:**
> "The solution isn't better prompts. It's better architecture."

---

## II. The Solution: Principled Separation (600 words)

### The Four Concerns

**Thesis statement:**

> Every AI agent system addresses four concerns. When you conflate them, the system breaks. When you separate them, the system scales.

### The Four Elements (Conceptual Introduction)

#### 1. Mode (Primary Agent)

**What it is:** The persona the AI adopts  
**What it does:** Defines thinking style, permissions, available tools  
**Activation:** Implicit—determined by current context, not user command  
**Example:** "You are in analyze mode" vs "You are in create mode"

**Talking points:**
- Mode = the *who*, not the *what*
- Different modes have different permissions
- Modes are mutually exclusive (you're in one mode at a time)
- Modes are implicit because you shouldn't need to say "now you're analyzing"

#### 2. Skill (Domain Knowledge)

**What it is:** Specialized knowledge or behavior the agent can apply  
**What it does:** Extends capabilities without explicit invocation  
**Activation:** Implicit—triggered by context relevance  
**Example:** "You know how to write Python" vs "You know how to debug Python"

**Talking points:**
- Skills = the *knowledge* the agent has
- Unlike modes, skills can layer (multiple skills active simultaneously)
- Skills are implicit because you shouldn't need to say "now use your Python skill"
- Skills compete for relevance—curation is the art

**Key insight:**
> "A skill is something the agent just *knows*. It doesn't get invoked—it gets applied."

#### 3. Command (Workflow)

**What it is:** A structured sequence of actions the agent performs  
**What it does:** Orchestrates the workflow, invokes agents/subagents/skills  
**Activation:** Explicit—triggered by user invocation  
**Example:** `/build`, `/research`, `/plan`

**Talking points:**
- Commands are *prompts*, not agents
- Commands define *what* to do, not *who* does it
- Commands are simple—they orchestrate, they don't contain knowledge
- The restriction is intentional: separation of concerns

**Key insight:**
> "A command is a script. It tells the agent: do this, in this order, using these tools."

#### 4. Subagent (Delegation)

**What it is:** A spawned agent for background or parallel tasks  
**What it does:** Handles isolated work, returns summarized results  
**Activation:** Implicit—spawned by commands when needed  
**Example:** `scout` for web research, `investigator` for code analysis

**Talking points:**
- Subagents are *ephemeral*—they don't persist in main context
- Their internal reasoning stays private—maintains context purity
- Subagents return *summaries*, not raw data
- Enables parallel execution without context bloat

### The Key Insight: Implicit vs Explicit

**Table:**

| Element | Activation | Scope | Persistence |
|---------|------------|-------|-------------|
| Mode | Implicit | Global | Permanent until switched |
| Skill | Implicit | Contextual | Always available |
| Command | Explicit | Per-invocation | Runs once |
| Subagent | Implicit | Isolated | Temporary |

**Talking points:**
- Implicit = the agent just *has* it
- Explicit = the user *requests* it
- Good design: knowledge is implicit, workflows are explicit
- Bad design: knowledge in prompts (explicit) + workflows as skills (implicit)

---

## III. The Implementation: OpenCode (1,400 words)

### Opening

**Tone:** "Here's how I built it"

> After three failed attempts at building an agent framework, I learned what works. Let me show you the architecture that actually scales.

### The Three Modes

**Talking points:**
- `analyze`: Research, investigation, audits. Read-only on project.
- `design`: Architecture, planning. Read-only on project, write to plans.
- `create`: Implementation. Full read-write.

**Key design decision:**
- Modes define *permissions*, not just persona
- The agent literally *cannot* write code in analyze mode
- This prevents "oops I implemented during research"

**Example scenario:**
> "When you type `/research API design patterns`, the agent enters analyze mode. It reads your codebase to understand context. It spawns `scout` subagents to search the web. It writes summaries to `.knowledge/notes/`. But it never touches your source code. That's design."

### The Subagents

**Talking points:**
- `scout`: Web research, returns summaries
- `investigator`: Codebase analysis, answers "what does X?"
- `critic`: Prose review, structural feedback
- `tester`: Hypothesis validation, writes tests
- `drafter`: Content section drafting

**Key design decision:**
- Subagents never write to project or `.knowledge/`
- They write to `.playground/` (gitignored scratch space)
- Parent agent decides what to keep

**Example:**
> "The `scout` subagent spent 30 minutes reading 200 web pages. Its reasoning is private—main context never sees those 200 pages. It returns: 'Found 5 relevant sources, here's the synthesis.' Clean context, deep research."

### The Commands

**Talking points:**
- Commands are simple prompts in Markdown with YAML frontmatter
- Each command defines: description, agent mode, subagents to use
- Commands are workflow *scripts*, not knowledge bases

**Example command structure:**
```yaml
---
description: Implement feature using TCR discipline
agent: create
subagents: [tester]
---
```

**Key insight:**
> "The `/build` command doesn't know *how* to build. It knows *when* to spawn `tester`, when to invoke `create` mode, when to commit. The knowledge is in the mode and subagent—the command just orchestrates."

### The Literate Commands Innovation

**Talking points:**
- Commands as Markdown files with executable blocks
- Variables, conditionals, step-by-step execution
- Self-documenting workflows

**Example:**
```yaml
---
literate: true
variables:
  - name: feature
    type: string
    prompt: "Feature name?"
---
# Feature Implementation

## Step 1: Create Branch
git checkout -b feature/${{feature}}

## Step 2: Implement
{{implementation_steps}}
```

**Talking points:**
- Literate commands solve the "context-sensitive task" problem
- Variables collect user input mid-execution
- Conditionals enable branching without breaking the workflow
- The command becomes a *script* the user reviews before running

### Directory Structure

```
.opencode/
├── agents/           # Mode definitions (persona + permissions)
│   ├── analyze.md    # "You are a researcher"
│   ├── design.md    # "You are an architect"
│   └── create.md    # "You are a builder"
├── commands/         # Workflow definitions (simple prompts)
│   ├── research.md  # "Do research, spawn scout"
│   ├── plan.md      # "Analyze, write plan"
│   └── build.md     # "TCR loop, spawn tester"
├── skills/          # Domain knowledge (implicit)
│   └── literate-commands/
└── tools/           # Utilities
```

**Key insight:**
> "Every piece has one job. Agents define who. Commands define how. Skills define what. Subagents define where."

---

## IV. The Workflow in Practice (400 words)

### Example: Adding a Feature

**Talking points:**
1. User: `opencode /plan implement user authentication`
2. System: Switches to `design` mode, invokes `/plan`
3. `/plan` spawns `investigator` subagent to analyze codebase
4. `/plan` writes `.knowledge/plans/auth-implementation.md`
5. User reviews and approves plan
6. User: `opencode /build implement user authentication`
7. System: Switches to `create` mode, invokes `/build`
8. `/build` runs TCR loop, spawns `tester` for each step
9. Changes committed atomically, logged to journal

**Key point:**
> "The plan is approved before code is written. The agent never guesses. The workflow is explicit."

### Example: Deep Research

**Talking points:**
1. User: `opencode /research OAuth2 best practices`
2. System: Switches to `analyze` mode, invokes `/research`
3. `/research` spawns 5 `scout` subagents in parallel
4. Each scout reads 50 pages, returns summaries
5. Main agent synthesizes 5 summaries into coherent report
6. Report written to `.knowledge/notes/oauth2-research.md`

**Key point:**
> "30 minutes of research. 0 context bloat. The main agent only sees the synthesis."

---

## V. Conclusion: What This Enables (200 words)

### Key Takeaways

1. **Modes define persona, not just behavior**
2. **Skills should be implicit—domain knowledge you don't invoke**
3. **Commands are simple prompts that orchestrate, not knowledge bases**
4. **Subagents keep context clean by being ephemeral**
5. **Separation enables agents that scale to long, complex tasks**

### The Philosophical Point

> "Good AI agents are good *systems*. The principles that make human organizations work—clear roles, delegated responsibilities, explicit processes—also make AI agents work."

### Call to Action

> "Don't add more skills. Separate concerns. Your agent will thank you."

---

## Word Count Distribution

| Section | Words |
|---------|-------|
| I. Problem | 400 |
| II. Solution (conceptual) | 600 |
| III. Implementation | 1,400 |
| IV. Workflow examples | 400 |
| V. Conclusion | 200 |
| **Total** | **3,000** |

---

## Tone & Style Notes

- **Voice:** First person, direct ("I learned", "you'll see")
- **Opinions:** Strong, stated confidently
- **Metaphors:** Systems thinking, organizational structure
- **Technical depth:** Conceptual, not code-heavy
- **Jargon:** Explain on first use, use consistently
- **Rhetorical questions:** Use sparingly for emphasis
- **Transitions:** Problem → Solution → Implementation → Practice → Takeaway

---

## Key Phrases to Land

1. "The agent can't tell what's relevant"
2. "The plan is a map. But terrain changes."
3. "A skill is something the agent just *knows*"
4. "A command is a script"
5. "The main agent only sees the synthesis"
6. "Don't add more skills. Separate concerns."

---

## Visual Elements Needed

1. **Architecture diagram:** Modes, skills, commands, subagents with arrows showing relationships
2. **Command file structure:** YAML frontmatter + Markdown body
3. **Workflow flowchart:** `/plan` → investigator → plan file → `/build` → tester → commits
4. **Directory tree:** `.opencode/` structure

---

## Next Steps

1. User approves outline
2. Draft introduction + Problem section (400 words)
3. Draft Solution section (600 words)
4. Draft Implementation section (1,400 words)
5. Draft Workflow + Conclusion (600 words)
6. Add diagrams
7. Review against style guide
8. Final polish
