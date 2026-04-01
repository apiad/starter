# The Anatomy of AI Agents

You've been using AI coding agents for months. You've crafted elaborate system prompts. You've added a dozen skills. You've learned the dance of context window management. And somewhere around the third hour of work, something breaks. The agent starts forgetting things. Making wrong assumptions. Doing something close—but not quite—what you asked.

This isn't a failure of the model. This is a failure of the system.

To be sure, better models make things easier. And models are getting better by the day. But no matter how good a model is, bad systems lead to bad outputs. Even the smartest people produce junk when fed with incorrect assumptions or given incomplete instructions.

In contrast, a good system with clear boundaries and explicit rules, that leaves the exact amount of flexibility necessary, makes creativity and productivity thrive.

You see this day and night in teams (of real humans) in every industry. It's not often the smartest person in the room that solves the hard problem. Is when you mix a right of combination of intelligence with a good system.

In this article, I want to make the case for a structured way to think about LLM-based agentic systems (mostly for coding, but also for knowledge work in general) that fixes some of the greatests pains I (and I sure most of you) have been facing when trying to scale AI-assisted workflows to professional levels.

It's a system that puts the right constraints in the right places and leaves just enough space for creative exploration (or however you want to call what LLMs do when they hallucinate in your favor). It's also a system that makes it clear you are in charge, for better or worse.

Everything an AI agent does happens inside a context window. System prompt, user input, tool results, skill injections—they all live there. The agent's only mechanism for action is the ReAct loop: think, call tools, observe results, repeat. Each cycle grows the context. Each skill activation injects more.

This creates a fundamental tension: context is power, but context is finite. Too little and the agent can't connect the dots. Too much and the important stuff drowns. The gap between those two failure modes is narrow—and most agent frameworks ignore it entirely.

I'll walk through why current systems fail, introduce a four-element framework for thinking about agentic architectures, show you how these principles apply across three domains, then present a vision for better AI harness engineering.

## Part I - The Symptoms

Context is the bottleneck. Not the model. Not the prompt. Context.

The agent doesn't have memory. It doesn't have state. It has context. Everything it knows about your project, your preferences, your conventions—all of it lives in the context window. When you add a skill, you're injecting more context. When you run a tool, the result goes into context. When you switch modes, you're switching which system prompt is active—all still in context.

This means context engineering *is* AI agent engineering. The agent's behavior isn't determined by the model alone—it's determined by what context you give it, and how you structure that context over time.

Most tools treat context as a solved problem. They stuff everything in and hope the model figures it out. But context has limits, and those limits become visible fast:

- **When context is short:** the agent can't connect distant pieces. It forgets what it did an hour ago. It makes inconsistent decisions.
- **When context is long:** important things get lost in the middle. The agent starts contradicting itself. Old tool calls become noise.
- **When context is unstructured:** the agent can't find what it needs. Skills pile up without priority. Assumptions go unspoken.

The solution isn't more context. It's better architecture—which brings us to the symptoms.

## Symptom One: Unstated Assumptions

The first failure mode isn't dramatic. It's quiet. You ask the agent to write a test, and it writes a `unittest.TestCase` instead of a `pytest` function. You ask it to add a dependency, and it edits `requirements.txt` instead of running `uv add`. You ask it to deploy, and it pushes directly to main.

These aren't model failures. They're assumption mismatches. The agent doesn't know how *your* team does things. There's no guardrail for "in this project, we always use pytest, we always use uv, we never commit directly to main." The agent improvises from general knowledge, and general knowledge is often wrong.

Skills are supposed to fix this. Add a skill document that says "use pytest" and the agent should know. But skills introduce a new problem.

You add a skill for code review. Then one for documentation. Then one for PR descriptions. Then three more for your company's specific stack. Each skill seems small. A few hundred tokens each. But they pile up—always-on knowledge the agent carries but can't prioritize.

The result is context bloat. The agent can't tell what's relevant in any given moment. So it blends everything together, and hallucinations increase. More skills made it worse. Not better.

## Symptom Two: Permission Leakage

Every agent framework implements the same pattern: analyze → plan → build. The idea is sound: think first, plan second, execute third. In practice, the boundaries leak.

Plan mode is supposed to be read-only. Design the change, review the approach, lock in the scope. Build mode is supposed to execute. Write the code, run the tests, commit the result.

But "plan mode" in most tools is just a prompt. There's no enforcement. The agent can write code in plan mode if it wants to. It can ignore the plan in build mode. It can skip straight to implementation if the prompt implies urgency. The modes are suggestions, not constraints.

This matters because a plan only works if it's actually followed. If the agent can deviate mid-execution—if "plan mode" and "build mode" are just prompts with different names—the plan becomes advisory. And advisory plans get ignored.

The second problem is structural: there's no artifact that passes from plan to build. The plan lives in context. By the time build mode starts, the plan is mixed in with everything else the agent said. Which file was the plan? Which changes were approved? The agent has to re-read the conversation to remember. Context saturation accelerates.

**The plan is a map. But terrain changes. The agent needs a compass, not just a destination.** Context—the information the agent carries—is that compass. And context has limits. After extended work, those limits become visible.

## Symptom Three: Context Saturation

After extended work, you see the same pattern: the agent makes 95% of the progress, then fails on the last 5%. It nails the architecture. The logic is sound. The core implementation works. Then it stumbles on a detail—because context has saturated. It forgot which environment it was in, which conventions still apply, which constraints matter.

I've seen this happen mid-sprint. The agent built a feature beautifully—clean code, good structure, proper error handling. Then it added hardcoded credentials because it forgot about the `.env` pattern we used everywhere. Not malicious. Not careless. Just context loss.

But the deeper problem is internal noise. The agent keeps everything in context: all internal reasoning, all tool calls, all results. This is fine for minute-to-minute action. But after four failed attempts to solve something, the old tool calls are just noise. These were attempts that went nowhere—they add cost and accelerate saturation.

And there's the Memento problem. The agent is supposed to leave a trail for its future self. After context compaction, it should be able to pick up where it left off. But if agents struggle with long contexts, how are they supposed to build a good trail? The compaction report is only as good as the agent's ability to summarize. And summarization is lossy.

The frustrating part: this wasn't a hard problem. The agent had all the knowledge it needed. But context filled with noise, and the important bits got pushed out. More tokens in, less signal out.

The solution isn't better prompts. It's better architecture—and that architecture has four elements.

## Part II - The System

This taxonomy isn't original to me. It's a synthesis of how modern AI agentic systems work under the hood. Most explicitly, it's implemented in the OpenCode CLI (opencode.ai), but all other tools follow a similar pattern—even if they use different names.

Now that we understand the problem, let's look at how every agent system actually works.

Every AI agent system addresses four concerns. When you conflate them, the system breaks. When you separate them, the system scales.

I learned this the hard way. The first time I built an agent that mixed persona with workflow with domain knowledge, it worked for the happy path. Then users pushed on it, and everything tangled together like Christmas lights in storage. Mode logic leaking into commands. Skills stepping on each other. Subagents returning answers in the wrong voice. A mess.

The fix wasn't better prompts. The fix was principled separation.

Here's the breakdown. Every agent system you'll encounter (explicitly or implicitly) is managing these four things:

**Mode — the who.** A mode is the persona the AI adopts. It defines the thinking style, the permissions, the available tools. When you interact with a "code assistant," you're in a coding mode. When you switch to "creative writer," you're in a creative mode.

Modes are *explicit*. They're top-level system prompts that define behavior and permissions. You tell the agent: "This is how you should think and behave. These are the tools you can use. These are the parts of the filesystem you can write to." The mode doesn't emerge from context—it overrides it. Mode = the who, enforced.

**Skill — the knowledge.** A skill is something the agent just *knows*. It doesn't get invoked—it gets applied. When you give an agent knowledge about SQL optimization, that skill is available whenever relevant. The agent doesn't need to be told to use it.

Unlike modes, skills can layer. An agent might have a SQL skill, a documentation skill, and a debugging skill—all active simultaneously, all contributing when relevant. Skills are implicit because the agent should just apply them naturally.

Skills aren't always-on in the way context is. Their short descriptions live in context, but the full content only injects when the agent decides it should. It's like tool activation: the trigger is contextual, the effect is an injection of relevant knowledge.

**Command — the workflow.** A command is a script. It tells the agent: do this, in this order, using these tools. "Refactor this function" is a command. "Run these tests and report results" is a command.

Commands are *explicit*—you invoke them. Under the hood, commands are just prompts. The difference is who injects them: the user. When you run `/build`, you're injecting a workflow prompt into the agent's context. That's it. The command tells the agent: do this sequence of things. The complexity lives in the orchestration, not the command itself.

Commands are intentionally simple. They orchestrate. They delegate. They don't contain knowledge. That's intentional separation of concerns. The command itself shouldn't know *how* to build; it knows *when* to spawn subagents and which mode to use. This keeps commands thin and changeable without rewriting underlying knowledge.

**Subagent — the delegation.** A subagent is a spawned agent for background or parallel tasks. It handles isolated work, returns summarized results, then disappears.

Subagents are ephemeral. Their internal reasoning stays private. The main agent only sees the synthesis. You spawn a subagent when you need parallel processing, isolation, or both.

Notice the pattern: implicit vs explicit activation. Modes and skills are always there, applied contextually. Commands and subagents are triggered, run once or temporarily.

### Why This Separation Matters

Understanding this distinction unlocks everything else. Once you see skills as implicit knowledge and commands as explicit scripts, the rest of the architecture follows naturally. Most agent systems conflate these. They embed knowledge in commands. They make skills explicit and invocation-heavy. They mix persona into workflows.

When you separate these concerns—modes for persona, skills for knowledge, commands for orchestration, subagents for delegation—you get something beautiful. You can swap skills without touching commands. You can change modes without rewriting workflows. You can spawn subagents without the main agent knowing or caring how they work internally. The result is a system that works until you need to change something—and when you do, you only touch the piece that needs changing, not the whole tangled mess.

The system scales because the pieces are independent. Change one without breaking the others. Each component has a single job, and the boundaries between them are meaningful. When context shifts, when requirements evolve, when a new skill needs adding—the system adapts incrementally rather than collapsing under the weight of accumulated complexity.

These four elements aren't just theoretical categories. They're the building blocks for a practical system. But anatomy without application is just taxonomy. Let me show you how.

## Part III: The Practice

The four-element framework isn't abstract. Here's how it works in practice—and why three domains illustrate it best. Software development shows the framework under constraints: deadlines, production code, real stakes. Research shows it under complexity: synthesis, evaluation, structured output. Technical writing shows it under nuance: voice, audience, iterative refinement. Three different pressures, one consistent architecture.

### The Three Modes

Every agentic system needs boundaries—not social contracts, but enforced constraints. In this framework, those constraints come from three modes: analyze, design, and create.

**Analyze mode** is research and investigation. This mode reads your work and writes summaries to a knowledge base. It cannot touch production files. Not "should not"—*cannot*. The permissions are built into the mode itself, not enforced through prompts or warnings.

**Design mode** is architecture and planning. This mode bridges analysis and implementation—it can read your project and write design documents, architecture diagrams, and implementation plans, but still cannot touch production code.

**Create mode** is execution. Full read-write access. This is where production work happens—the agent can write code, create files, and modify the project directly.

The key insight: **modes define permissions, not just persona**. You can't accidentally prompt your way into code generation during research. The agent literally lacks the capability. The agent doesn't need to "understand" these constraints—it simply operates within them. Mode is the who, and it determines what the agent *can* do, not just how it thinks.

Let me show you how they work in three different domains, software development, scientific research, and technical writing. In each of these domains we have two layers to go through: first is the set of implicit skills that are available to the agents, and second is the set of explicit commands (each tied to a specific mode) that setup concrete workflows.

### Domain A: Software Development

Software development is where agentic systems face the harshest constraints. Production code has stakes. Deadlines are real. Mistakes cost money. Let's see how the framework applies.

#### Implicit Skills

A software development agent carries knowledge it never needs to be told to use. It knows language idioms and patterns—the idiomatic way to write a list comprehension in Python, the convention for error handling in Go. It knows testing conventions: where tests live in the directory structure, how they're named, what assertions to prefer. It knows architecture conventions: layered structure, dependency injection patterns, how error states propagate. It knows code review standards: what to flag, what to praise, when to ask for clarification.

#### The trace/plan/build Workflow

Debugging a subtle regression requires a specific rhythm. **Phase 1: /trace (analyze mode)** runs systematic experiments to narrow down the bug's cause. The agent examines stack traces, compares behavior across commits, and pinpoints the exact files and functions that need attention. This mode is read-only by design—research happens here, not in the code itself.

**Phase 2: /plan (design mode)** takes the diagnosis and defines the changes needed, along with their architectural impact. The agent reviews the affected modules, considers alternative approaches, and documents the implementation plan before touching anything. This is where the scope gets locked in.

**Phase 3: /build (create mode)** executes the plan step by step. The agent writes tests first (following TDD discipline), watches them fail, then implements just enough to pass. It commits atomically, logs its changes, and validates that the regression is resolved. This is where sequential execution and structured parsing make the difference between a helpful workflow and a chaotic one.

### Domain B: Research

Research is where agentic systems face the greatest complexity. Sources multiply, methodologies diverge, synthesis requires judgment. Let's see how the framework applies.

#### Implicit Skills

A research agent knows the conventions of academic writing without being reminded. It knows citation formats—APA, MLA, Chicago, IEEE—and when to use each. It knows how to evaluate papers: methodology soundness, sample size adequacy, replicability claims, conflict of interest disclosures. It knows the structure of literature reviews: how to organize by theme, methodology, or chronological development. It knows domain-specific terminology, distinguishing between "accuracy" and "precision" in machine learning, or between "confounding" and "colliding" in causal inference.

#### The research/sota/draft Workflow

Synthesizing a research topic requires iterative collection and structured output. **Phase 1: /research (analyze mode)** spawns subagents to gather sources in parallel. Each subagent reads a batch of papers, synthesizes findings, and returns summaries. The main agent synthesizes those summaries into structured notes. This phase can be run multiple times to collect batches of sources without overwhelming context—the agent builds incrementally, not all at once.

**Phase 2: /sota (design mode)** identifies patterns across the collected literature. The agent groups papers by methodology, extracts recurring findings, and maps the landscape of the field. It generates outline options for the final document, highlighting gaps where the research is thin and consensus areas where findings align.

**Phase 3: /draft (create mode)** builds the document section by section, following the outline from /sota. Each section draws on the structured notes, weaving together sources into coherent narrative. The agent cites as it writes, maintaining consistency with the target citation format.

### Domain C: Technical Writing

Technical writing is where agentic systems face the most nuance. Voice matters. Audience varies. Iterative refinement is the norm. Let's see how the framework applies.

#### Implicit Skills

A technical writing agent carries knowledge of prose style without being coached. It knows voice and tense conventions—active voice for clarity, past tense for completed processes, second person for direct instruction. It knows structural patterns: how documentation differs from blog posts, how reports differ from tutorials, how reference material differs from guides. It knows audience awareness: what to explain for newcomers, what to omit for experts, when to elaborate and when to abbreviate. It knows cross-referencing and linking norms: when to link, when to inline, how to name anchors for scannability.

#### The review/apply-review/write Workflow

Refining existing text follows a review-then-apply pattern. **Phase 1: /review (analyze mode)** performs detailed review in a specific order: structural issues first, then content, then style. The agent examines the narrative arc—how main points connect, whether the flow makes sense—before worrying about grammar or word choice. This ordering matters; reviewing low-level details when high-level problems exist wastes effort.

**Phase 2: /apply-review (design mode)** plans changes to specific sections, prioritizing by review type. The agent maps structural fixes to particular paragraphs, content additions to thin sections, style improvements to verbose passages. It produces a concrete plan—section by section, change by change—before writing anything new.

**Phase 3: /write (create mode)** follows the plan. The agent revises sections in priority order, applying structural changes first, then content, then style. Each revision is tracked, and the agent maintains the document's voice throughout.

---

These workflows show the framework working. But there's a gap between "working" and "working well." I have three ideas for closing that gap. The first is about how commands work. The second is about security. The third is about context management. Let me show you what I'm building toward.

---

## Part IV: A Look into the Future

Here's where I want to take this. Three ideas, each addressing a different pain point.

### Idea One: Better Commands

Commands in most tools (Claude Code, Gemini CLI, Codex, Copilot) are one-shot interactions: you invoke, it runs, you get a result. Real work isn't like that. It's iterative, adaptive. It pauses to ask questions, makes decisions based on context, and sometimes needs to call other scripts.

Here's what commands need to become:

1. Commands that inject prompt instructions one step at a time, waiting for the agent to do a full turn each time. Instead of dumping a large prompt to run all steps at once, a command like `/review` could insert surgical mini prompts that say "read the file", wait for the agent, "analyze structure", wait for agent, and so on, until "write the report". This massively reduces the problem of lost-in-middle context saturation.

2. Commands that extract structured information from the agent response, and can later inject variables back into prompt. This allows to reinject important information into later prompts, keeping important information as a contextual variable, not just a string lost in the middle of the prompt. But it allows for something else.

3. Conditional branching based on context or user input. Once we have structured parsing and contextual variables, we can inject different prompts based on whether the agent succeeded or failed. If the plan reveals a breaking change, route to architectural review. If it's a bug fix, route directly to implementation. The command adapts its path based on what it discovers.

4. Finally, commands that embed and execute external scripts. Instead of asking the agent to run some script, the command can run arbitrary Python, JS, Bash, or whatever, to, for example, transform structured information. The command becomes an orchestrator of other processes.

Basically, what I'm asking for here is a DSL for guiding agents in a far more structured manner, but still having the power of arbitrary prompts for flexibility. Mixing code and prompts in this way gives us the tools to find the precise balance between constraints and capabilities.

If this sounds exciting, I'm happy to tell you this is already doable, to some extent. Check out my [literate-commands](https://apiad.github.io/opencode-literate-commands) project for an OpenCode-specific implementation of these ideas. It's still a bit rough around the edges, but it works much better than plain, single-prompt commands.

### Idea Two: Sandboxed Security

Most agentic tools give the agent filesystem access, network access, tool execution—all the power, none of the guardrails. This is fine for experiments. It's dangerous for production.

I've been building a sandboxed execution layer. The agent runs in isolation. Filesystem access is scoped. Network calls are proxied. Tool execution is audited. Nothing runs without explicit user approval.

This isn't just about safety, though. When you know the agent can't accidentally wipe your home directory or exfiltrate your API keys, you can let it do more. Security enables capability. You can let the agent download arbitrary code from the internet, run arbitrary scripts, break things and observe changes. Everything happens inside a Docker container with precise constraints that enable maximum capability with absolute security.

I also kind of already implemented this, but it's still in beta phase. More on this idea in a future article.

### Idea Three: Context-Aware Execution

And finally, we need to rethink the whole oversimplistic ReAct loop that simply grows the context linearly. The agentic cycle doesn't have to be a straight line. Real work branches: you explore options, try things, backtrack when they fail. The context should reflect that.

I've been designing a system where the context never saturates. It branches when you're exploring, spawning parallel contexts for different approaches. It prunes old tool calls that went nowhere. It removes internal reasoning that no longer matters. It maintains a "trail" that actually works: a structured record of decisions, not a lossy summary.

The goal is simple: keep context between 40% and 60% saturation at all times. Not by compacting a 150K context down to 10K--which kills all understanding the agent had achieved--but by never letting it grow unchecked.

Nothing like this exists yet, so I'm building it, but's a story for another day.

## Conclusion

The three modes are one expression of the four-element framework. But here's what surprised me: I didn't design this symmetry. It emerged.

Modes kept getting tangled with commands, so I pulled them apart. Skills kept leaking into workflows, so I isolated them. Subagents kept needing access to shared context, so I made them ephemeral. The separation created composability—and composability is what makes the whole thing work.

The insight isn't that Mode, Skill, Command, and Subagent *exist*. It's that separating them creates emergent properties you couldn't have planned. You define the boundaries once; the system handles everything between them. That's not organization—that's leverage.

Build for the long game. Your future self (and your context window) will thank you.
