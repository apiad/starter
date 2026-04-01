# The Anatomy of AI Agents

---

You've been using AI coding agents for months. You've crafted elaborate system prompts. You've added a dozen skills. You've learned the dance of context window management. And somewhere around the third hour of work, something breaks. The agent starts forgetting things. Making wrong assumptions. Doing something close—but not quite—what you asked.

This isn't a failure of the model. This is a failure of architecture.

## The Skill Accumulation Problem

Here's what happens: you add a skill for code review. Then one for documentation. Then one for PR descriptions. Then three more for your company's specific stack. Each skill seems small. A few hundred tokens each. But they pile up as implicit context—always-on knowledge the agent carries but can't prioritize.

The result is context bloat. The agent can't tell what's relevant in any given moment. So it blends everything together, and hallucinations increase. I've watched this happen in real time: an agent that was brilliant at code review started forgetting our coding standards because we added eight other skills. More skills made it worse. Not better.

## The Plan/Build Oversimplification

Every agent framework implements the same pattern: analyze → plan → build. It's become a cliché. But here's the problem: "plan" is vague. What kind of planning? What scope? A five-minute task or a five-hour one?

Real work isn't linear. It branches. Loops. Requires backtracking when something fails. A single plan can't capture the context-sensitive decisions that happen mid-execution.

**The plan is a map. But terrain changes. The agent needs a compass, not just a destination.**

## The Context Drift Symptom

After about two hours of continuous work, you see the same pattern: the agent makes 95% of the progress, then fails on the last 5%. It nails the architecture, the logic, the core implementation. Then it stumbles on a detail because context has saturated. It forgot which environment it was in, which conventions matter, which constraints still apply.

I've seen this happen mid-sprint. The agent was building a feature beautifully—clean code, good structure, proper error handling. Then it added hardcoded credentials because it forgot about the `.env` pattern we used everywhere. Not malicious. Not careless. Just context loss.

The frustrating part: this wasn't a hard problem. The agent had all the knowledge it needed. But the context window had filled with everything else, and the important bits got pushed out. More tokens in, less signal out.

The solution isn't better prompts. It's better architecture.

---

Every AI agent system addresses four concerns. When you conflate them, the system breaks. When you separate them, the system scales.

I learned this the hard way. The first time I built an agent that mixed persona with workflow with domain knowledge, it worked for the happy path. Then users pushed on it, and everything tangled together like Christmas lights in storage. Mode logic leaking into commands. Skills stepping on each other. Subagents returning answers in the wrong voice. A mess.

The fix wasn't better prompts. The fix was principled separation.

## The Four Elements

Here's the breakdown. Every agent system you'll encounter (explicitly or implicitly) is managing these four things:

**Mode — the who.** A mode is the persona the AI adopts. It defines the thinking style, the permissions, the available tools. When you interact with a "code assistant," you're in a coding mode. When you switch to "creative writer," you're in a creative mode.

Here's the thing: modes are *implicit*. You don't say "now you're in analysis mode." The context tells the agent which mode to adopt. Mode = the who, not the what.

**Skill — the knowledge.** A skill is something the agent just *knows*. It doesn't get invoked—it gets applied. When you give an agent knowledge about SQL optimization, that skill is available whenever relevant. The agent doesn't need to be told to use it.

Unlike modes, skills can layer. An agent might have a SQL skill, a documentation skill, and a debugging skill—all active simultaneously, all contributing when relevant. Skills are implicit because the agent should just apply them naturally.

**Command — the workflow.** A command is a script. It tells the agent: do this, in this order, using these tools. "Refactor this function" is a command. "Run these tests and report results" is a command.

Commands are *explicit*—you invoke them. And here's the key: commands are intentionally simple. They orchestrate. They delegate. They don't contain knowledge. That's intentional separation of concerns.

**Subagent — the delegation.** A subagent is a spawned agent for background or parallel tasks. It handles isolated work, returns summarized results, then disappears.

Subagents are ephemeral. Their internal reasoning stays private. The main agent only sees the synthesis. You spawn a subagent when you need parallel processing, isolation, or both.

### The Anatomy at a Glance

| Element | Activation | Scope | Persistence |
|---------|------------|-------|-------------|
| Mode | Implicit | Global | Permanent until switched |
| Skill | Implicit | Contextual | Always available |
| Command | Explicit | Per-invocation | Runs once |
| Subagent | Implicit | Isolated | Temporary |

Notice the pattern: implicit vs explicit activation. Modes and skills are always there, applied contextually. Commands and subagents are triggered, run once or temporarily.

### Why This Separation Matters

A skill is something the agent just *knows*. A command is a script.

That distinction sounds simple. It's not. Most agent systems I've seen conflate these. They embed knowledge in commands. They make skills explicit and invocation-heavy. They mix persona into workflows.

The result: a system that works until you need to change something. Then you tear it all apart.

When you separate these concerns—modes for persona, skills for knowledge, commands for orchestration, subagents for delegation—you get something beautiful. You can swap skills without touching commands. You can change modes without rewriting workflows. You can spawn subagents without the main agent knowing or caring how they work internally.

The system scales because the pieces are independent. Change one without breaking the others.

That's the anatomy of AI agents. Four concerns, cleanly separated.

---

After three failed attempts at building an agent framework, I learned what works. Let me show you the architecture that actually scales.

The OpenCode implementation breaks down into five interconnected pieces: the three modes, the five subagents, the commands, the literate command innovation, and the directory structure that holds it all together. Each piece does exactly one job. When you understand how they fit, the whole system clicks.

## The Three Modes

Every agentic system needs boundaries. Not social contracts—enforced constraints. In OpenCode, those constraints come from **modes**.

I settled on three: `analyze`, `design`, and `create`. That third one—`create`—tells you where my priorities lie. Implementation matters most. But the other two matter too.

- **`analyze`**: Research, investigation, audits. This mode reads your codebase and writes summaries to `.knowledge/`. That's it. It cannot touch source files. Not "should not"—*cannot*.
- **`design`**: Architecture and planning. Still read-only on the project, but now it can write design documents, architecture diagrams, and implementation plans.
- **`create`**: The implementation mode. Full read-write access. This is where production code gets written.

Here's the key insight that took me three attempts to learn: **modes define permissions, not just persona**. You can't accidentally prompt your way into code generation during research. The agent literally lacks the capability. There's no "are you sure?" dialog. There's no flag to check. The agent simply cannot write code in analyze mode because that mode's configuration doesn't grant file write access to `src/`, `lib/`, or any other production directory.

This is enforced through the mode configuration:

```yaml
# analyze mode - no source file access
permissions:
  project: read-only
  .knowledge: read-write
  .playground: read-write
```

```yaml
# create mode - full access
permissions:
  project: read-write
  .knowledge: read-write
  .playground: read-write
```

The agent doesn't need to "understand" these constraints. It just operates within them. Same model, different operating envelope.

This was the breakthrough. Before this, I'd tried making agents "understand" when to write code. They'd mess up. They'd get confused. They'd implement during research or research during implementation. Mode-based permissions eliminate that entire class of bugs.

When you type `/research API design patterns`, the agent enters analyze mode. It reads your codebase to understand context. It spawns `scout` subagents to search the web. It writes summaries to `.knowledge/notes/`. But it never touches your source code. That's design.

## The Subagents

Now let's talk about how research actually happens. You don't want the main agent wading through 200 web pages. That's noise. You want synthesis.

OpenCode uses five subagents, each purpose-built:

- **`scout`**: Web research. It reads pages, synthesizes findings, returns summaries. Never touches your project.
- **`investigator`**: Codebase analysis. Answers "what does X do?" or "how is Y structured?"
- **`critic`**: Prose review. Structural feedback on documentation, comments, READMEs.
- **`tester`**: Hypothesis validation. Writes tests to verify assumptions.
- **`drafter`**: Content section drafting. Creates drafts in scratch space for review.

The critical design decision: **subagents never write to the project or `.knowledge/`**. They write to `.playground/`, which is gitignored scratch space. The parent agent decides what to keep.

Here's why this matters. The `scout` subagent spent 30 minutes reading 200 web pages. Its reasoning is private—the main context never sees those 200 pages. It returns: "Found 5 relevant sources, here's the synthesis." Clean context, deep research.

The main agent only sees the synthesis. This is how you get research depth without context explosion.

This pattern took me too long to discover. Early versions let subagents write everywhere. The context window filled with research noise. The agent got confused about what was important. Separating scratch space from project space—and letting the parent agent curate—solved both problems.

## The Commands

Modes define *who*. Subagents define *where*. Now we need *how*.

Commands are simple prompts in Markdown with YAML frontmatter. Each command defines its description, which agent mode to use, and which subagents to invoke. They're workflow *scripts*, not knowledge bases.

```yaml
---
description: Implement feature using TCR discipline
agent: create
subagents: [tester]
---
```

That's it. The command itself doesn't know *how* to build. It knows *when* to spawn `tester`, when to invoke `create` mode, when to commit. The knowledge lives in the mode and subagent configurations. The command just orchestrates.

This separation matters more than it sounds. You can change how tests run by updating the `tester` agent definition. You can change code style by updating `create` mode. Commands stay thin because they delegate to the right components.

When you run `/research`, it doesn't contain instructions for doing research. It says: "Use analyze mode. Spawn `scout` and `investigator` subagents. Write results to `.knowledge/`." The actual research logic lives in those components.

## The Literate Commands Innovation

Simple commands work for linear workflows. But real work isn't linear. You need variables, conditionals, and step-by-step execution with user input in the middle. That's where **literate commands** come in.

Literate commands are Markdown files with executable blocks. They transform commands from static prompts into actual scripts.

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

## Step 3: Test
${{test_command}}
```

The `literate: true` flag tells the system this isn't a simple prompt—it's an executable workflow. Variables collect user input mid-execution. Conditionals enable branching without breaking the workflow. The command becomes a *script* the user reviews before running.

Here's the insight I hadn't seen anywhere else: **the command is the user interface**. When you write `/build feature-X`, you're not just invoking a workflow—you're executing code that you'll review and approve. The Markdown structure makes the workflow readable before it runs. You see exactly what will happen.

Variables are the killer feature. Traditional commands are one-shot. Literate commands pause mid-execution to collect input. "What's the feature name?" "Which branch should I target?" "Do you want to run tests before commit?" The workflow adapts without breaking its structure.

Conditionals enable another pattern entirely: **branching workflows**. If the tests pass, commit. If they fail, run the linter and show the output. You express this logic in plain Markdown with simple `{{#if}}` blocks. The command becomes a state machine.

The result is self-documenting workflows that are also executable. Every step is visible. Every variable is named. Every branch is explicit. You can read a literate command and understand exactly what will happen—before you run it.

## Directory Structure

The architecture becomes concrete in the directory structure:

```
.opencode/
├── agents/           # Mode definitions (persona + permissions)
│   ├── analyze.md
│   ├── design.md
│   └── create.md
├── commands/         # Workflow definitions (simple prompts)
│   ├── research.md
│   ├── plan.md
│   └── build.md
├── skills/          # Domain knowledge (implicit)
└── tools/           # Utilities
```

Every piece has one job. Agents define *who*. Commands define *how*. Skills define *what*. Subagents define *where*.

I didn't plan this symmetry. It emerged from fixing things that did too much. Agents kept growing knowledge bases, so I moved knowledge to skills. Commands kept gaining permissions, so I moved permissions to modes. The separation created clarity.

You'll see this pattern throughout: the constraints aren't limitations, they're the architecture. Mode-based permissions prevent accidents. Scratch-space subagents prevent noise. Literate commands prevent magic. Each decision trades flexibility for reliability—and reliability is what scales.

---

Theory is nice. Let me show you how this actually works.

## Adding a Feature

You want to implement user authentication. Here's what happens:

1. You type: `opencode /plan implement user authentication`
2. The system shifts into `design` mode—suddenly it's thinking architecture, not code
3. `/plan` spawns an `investigator` subagent. This little agent reads your codebase, understands the existing patterns, and reports back
4. `/plan` writes `.knowledge/plans/auth-implementation.md`. A file. Not a memory, not a context injection—a file you can actually read
5. You review the plan. You approve it. Or you don't
6. You type: `opencode /build implement user authentication`
7. Now the system shifts to `create` mode—production mode, execution mode
8. `/build` runs its TCR loop (test, commit, revert). For each step, it might spawn a `tester` subagent to validate the work
9. Changes commit atomically. The journal logs everything

Here's what matters: **the plan is approved before code is written**. The agent never guesses. The workflow is explicit.

You're not watching a black box hallucinate solutions. You're reviewing a spec, then watching execution.

## Deep Research

You need to understand OAuth2 best practices. Here's what happens:

1. You type: `opencode /research OAuth2 best practices`
2. The system shifts into `analyze` mode—curiosity mode, synthesis mode
3. `/research` spawns 5 `scout` subagents in parallel
4. Each scout reads 50 pages from the web, returns summaries
5. The main agent synthesizes those 5 summaries into one coherent report
6. The report lands in `.knowledge/notes/oauth2-research.md`

Here's what matters: **30 minutes of research. 0 context bloat.** The main agent only sees the synthesis. The scouts are gone. The raw data is gone. What remains is insight.

If you asked a monolithic agent to "research OAuth2," you'd get a 200k token context full of scraped garbage. Instead, you get 5 pages of signal.

## Writing Documentation

You need to document a new API. Here's what happens:

1. You type: `opencode /draft API reference documentation`
2. The system shifts into `create` mode with `drafter` and `critic` subagents
3. `/draft` scans your codebase, extracts the API signatures and comments
4. It initializes a draft file with proper structure
5. The `drafter` subagent writes section by section
6. The `critic` subagent reviews each section for clarity and completeness
7. You review the draft, suggest changes, approve sections
8. Final documentation lands in `docs/api-reference.md`

Here's what matters: **you control the voice**. The agent generates, you refine. The critic catches gaps you might miss. But the narrative stays yours.

This is the difference between AI-assisted writing and AI-generated writing. Assisted means you're in charge. The agent produces material; you produce meaning.

---

After building and using agents this way, here's what I've learned:

**Modes define persona, not just behavior.** When the system shifts to `design`, it's not just different commands—it's a different *mindset*. Same model, different context, different output.

**Skills should be implicit.** Domain knowledge shouldn't be invoked. You shouldn't say "use your Python skill." The agent should just *know* Python patterns. Skills are knowledge, not tools.

**Commands are simple prompts that orchestrate.** `/plan` isn't a knowledge base. It's a prompt that says: "do this sequence of things." The complexity lives in the *orchestration*, not the command itself.

**Subagents keep context clean.** They're ephemeral. They spawn, they work, they die. The main agent never accumulates their noise.

**Separation enables scale.** These agents handle long, complex tasks because they're not trying to do everything at once. They divide the work.

---

Good AI agents are good *systems*.

Think about how a company works. You have departments (modes), specialists (skills), procedures (commands), and temporary contractors (subagents). Clear roles, delegated responsibilities, explicit processes. That's what makes human organizations work.

The parallels are direct. Departments define culture and capability—modes define persona and permissions. Specialists bring expertise without being told when to apply it—skills activate contextually. Procedures coordinate action—commands orchestrate execution. Contractors handle isolated work without learning the org chart—subagents stay ephemeral.

AI agents work the same way. They're not magic. They're systems. And systems need architecture.

---

Don't add more skills to your agent. Don't memorize more prompts.

Separate concerns. Define modes. Keep subagents ephemeral.

The framework I use is called OpenCode. It's what I built to practice what I preach. But the principles aren't proprietary. They're just principles.

You can build this yourself. Start with modes: define three—read, plan, write. Add subagents for isolation. Keep commands thin. Let skills be implicit.

It takes discipline. It's easier to dump everything into one prompt. But that's how you get agents that work until they don't.

Build for the long game. Your future self (and your context window) will thank you.
