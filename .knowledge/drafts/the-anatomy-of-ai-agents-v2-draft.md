# The Anatomy of AI Agents

You've been using AI coding agents for months. You've crafted elaborate system prompts. You've added a dozen skills. You've learned the dance of context window management. And somewhere around the third hour of work, something breaks. The agent starts forgetting things. Making wrong assumptions. Doing something close—but not quite—what you asked.

This isn't a failure of the model. This is a failure of the system.

To be sure, better models make things easier. And models are getting better by the day. But no matter how good a model is, bad systems lead to bad outputs. Even the smartest people produce junk when fed with incorrect assumptions or given incomplete instructions.

In contrast, a good system with clear boundaries and explicit rules, that leaves the exact amount of flexibility necessary, makes creativity and productivity thrive.

You see this day and night in teams (of real humans) in every industry. It's not often the smartest person in the room that solves the hard problem. It's when you combine the right kinds of intelligence with the right kind of system that things click.

In this article, I want to make the case for a structured way to think about Large Language Model (LLM)-based agentic systems (mostly for coding, but also for knowledge work in general) that fixes some of the greatest pains I (and I sure most of you) have been facing when trying to scale AI-assisted workflows to professional levels.

It's a system that puts the right constraints in the right places and leaves just enough space for creative exploration (or however you want to call what LLMs do when they hallucinate in your favor). It's also a system that makes it clear you are in charge.

Everything an AI agent does happens inside a context window. System prompt, user input, tool results, skill injections—they all live there. The agent's only mechanism for action is the ReAct (Reasoning + Acting) loop: think, call tools, observe results, repeat. Each cycle grows the context. Each skill activation injects more.

This creates a fundamental tension: context is power, but context is finite. Too little and the agent can't connect the dots. Too much and the important stuff drowns. The gap between those two failure modes is narrow—and most agent frameworks ignore it entirely.

I'll walk through why current systems fail, introduce a four-element framework for thinking about agentic architectures, show you how these principles apply across three domains, then present a vision for better AI harness engineering.

## Part I - The Symptoms

To understand the problems we first need to understand how a standard agentic loop works. The typical architecture is what's called a ReAct loop. The LLM runs in a loop that determines the next action given context, which can be read some files, ask the user, invoke a tool, inject a skill, etc. When the agent decides no more actions are necessary, the loop ends and the user is given control back to continue the prompt.

That's it. All the seemingly supersmart behaviours of Claude Code, Gemini CLI, and Codex are, under the hood, some form of the basic ReAct loop. There are of course nuances. For example, most systems decide that if the agent calls the same tool with the same args three times, it must be stuck in a loop and stop the turn. There are perhaps hard limits on how many tool calls the agent can do in each turn.

Context is the bottleneck. Not the model. Not the prompt. Context.

The agent doesn't have memory. It doesn't have state. It has context. Everything it knows about your project, your preferences, your conventions, all of it lives in the context window. When you add a skill, you're injecting more context. When you run a tool, the result goes into context. When you switch modes, you're switching which system prompt is active, all still in context.

This means context engineering *is* AI agent engineering. The agent's behavior isn't determined by the model alone, or even primarily, but by what context you give it, and how you structure that context over time.

Most tools treat context as a solved problem. They stuff everything in and hope the model figures it out. In-context learning seems almost magical, but it has limits—and those limits become visible fast.

When context is thin, the agent simply doesn't know enough about your project to make informed decisions. It relies on baked-in assumptions from training and falls back to consensus instead of following your style: it uses the common tools and practices it learned from pretraining. This often means it uses slightly old and outdated tools and practices.

So you do the sensible thing, and inject project-specific information into the context. But then if context grows too large, even if it doesn't technically exceed the model's capacity, things start to get lost in the middle. Moreover, failed tool calls, wrong assumptions the model had to correct, etc., start creeping up in context, not only taking up valuable space but also, and more importantly, _distracting_ the model and biasing it towards mediocre decisions.

Then there is context compaction: when the context fills in to about 85%, most systems will invoke a special prompt to instruct the agent to summarize the current state. These prompts vary in detail, but often involve asking the agent what it is immediately doing, where is it stuck, what has failed, etc. Clever, but a hack nonetheless. This hard context reset means the agent will forget important nuances in the current conversation and will repeat past mistakes. It's frustrating.

Let's look at how these problems surface in specific symptoms that _all_ LLM-based agents display at some point.

## Symptom One: Unstated Assumptions

The first failure mode isn't dramatic. It's quiet. You ask the agent to write a test, and it writes a `unittest.TestCase` instead of a `pytest` function. You ask it to add a dependency, and it edits `requirements.txt` instead of running `uv add`. You ask it to deploy, and it pushes directly to main.

These aren't model failures. They're assumption mismatches. The agent doesn't know how *your* team does things. There's no guardrail for "in this project, we always use pytest, we always use uv, we never commit directly to main." The agent improvises from general knowledge, and general knowledge is often wrong.

Skills are supposed to fix this. Add a skill document that says "use pytest" and the agent should know. But skills introduce a new problem.

You add a skill for code review. Then one for documentation. Then one for PR descriptions. Then three more for your company's specific stack. Each skill seems small. A few hundred tokens each. But they pile up—always-on knowledge the agent carries but can't prioritize.

The result is context bloat. The agent can't tell what's relevant in any given moment. So it blends everything together, and hallucinations increase. More skills made it worse—not better.

## Symptom Two: Permission Leakage

Every agent framework implements the same plan then build pattern. The idea is sound: think first, plan second, execute third. In practice, the boundaries leak.

Plan mode is supposed to be read-only. Design the change, review the approach, lock in the scope. Build mode is supposed to execute. Write the code, run the tests, commit the result.

But "plan mode" in most tools is just a prompt. There's no enforcement. The agent can write code in plan mode if it wants to. It can ignore the plan in build mode. It can skip straight to implementation if the prompt implies urgency. The modes are suggestions, not constraints.

This matters because a plan only works if it's actually followed. If the agent can deviate mid-execution—if "plan mode" and "build mode" are just prompts with different names—the plan becomes advisory. And advisory plans get ignored.

The second problem is structural: there's no artifact that passes from plan to build. The plan lives in the context. By the time build mode starts, the plan is mixed in with everything else the agent said. Which file was the plan? Which changes were approved? The agent has to re-read the conversation to remember. Context saturation accelerates.

## Symptom Three: Context Saturation

After extended work, you see the same pattern: the agent makes 95% of the progress, then fails on the last 5%. It nails the architecture. The logic is sound. The core implementation works. Then it stumbles on a detail—because context has saturated. It forgot which environment it was in, which conventions still apply, which constraints matter.

But the deeper problem is internal noise. The agent keeps everything in context: all internal reasoning, all tool calls, all results. This is fine for minute-to-minute action. But after four failed attempts to solve something, the old tool calls are just noise. These were attempts that went nowhere, just add cost and accelerate saturation.

The supposed solution for this is context compaction. But this creates a lossy summary problem. The agent is supposed to leave a trail for its future self. After context compaction, it should be able to pick up where it left off. But if agents struggle with long contexts, how are they supposed to build a good trail? The compaction report is only as good as the agent's ability to summarize. And summarization is lossy and injects back lots of unstated assumptions from pretraining.

The frustrating part: this wasn't a hard problem. The agent had all the knowledge it needed. But context filled with noise, and the important bits got pushed out. More tokens in, less signal out.

The solution isn't just better prompts or larger context windows. Yes, these help. But the symptoms are systemic, so the solution must be a system overhaul.

Let me show you how that system looks like.

## Part II - The System

Now that we understand the problem, let's look at how every agent system actually works. Every AI agent system addresses four concerns. When you conflate them, the system breaks. When you separate them, the system scales.

This taxonomy isn't original to me. It's a synthesis of how modern AI agentic systems work under the hood. Most explicitly, it's implemented in the OpenCode CLI (opencode.ai), but all other tools follow a similar pattern, even if they use different names.

Here's the breakdown. Every agent system you'll encounter (explicitly or implicitly) is managing these four things:

**Mode — the who.** A mode is the persona the AI adopts. It defines the thinking style, the permissions, the available tools. When you interact with a "code assistant," you're in a coding mode. When you switch to "creative writer," you're in a creative mode.

Modes are *explicit*. They're top-level system prompts that define behavior and permissions. You tell the agent: "This is how you should think and behave. These are the tools you can use. These are the parts of the filesystem you can write to."

**Skill — the knowledge.** A skill is knowledge the agent can recall when necessary. It doesn't get invoked explicitly, it gets applied _implicitly_ when necessary. When you give an agent knowledge about SQL optimization, that skill is available whenever relevant. The agent doesn't need to be told to use it. The ReAct cycle injects it when it deems suitable.

Unlike modes, skills can layer. An agent might have a SQL skill, a documentation skill, and a debugging skill, all active simultaneously, all contributing when relevant. Skills are implicit because the agent should just apply them naturally. They can also contradict or complement each other. In-context learning _should_ be capable of using them in a combined manner.

**Command — the workflow.** A command is a script. It tells the agent: do this, in this order, using these tools. "Refactor this function" is a command. "Run these tests and report results" is a command.

Commands are *explicit*: you invoke them. Under the hood, commands are just prompts. The difference is who injects them: the user. When you run `/build`, you're injecting a workflow prompt into the agent's context. That's it. The command tells the agent: do this sequence of things. The complexity lives in the orchestration of the ReAct cycle, not the command itself.

Commands are intentionally simple. They don't contain knowledge. That's intentional separation of concerns. The command itself shouldn't know *how* to build; it knows *when* to spawn subagents and which mode to use. This keeps commands thin and changeable without rewriting underlying knowledge.

**Subagent — the delegation.** A subagent is a spawned agent for background or parallel tasks. It handles isolated work, returns summarized results, then disappears. It is instantiated with a system prompt and specific instructions (synthesized by the primary agent that called it), and runs for one full ReAct turn.

Subagents are ephemeral. Their internal reasoning stays private. The main agent only sees the synthesis. You spawn a subagent when you need parallel processing, isolation, or both. They are the way to _fork_, solve a specific subtask, and return a result, but keep context clean. Kind of like subroutines.

### Why This Separation Matters

Understanding this distinction unlocks everything else. Once you see skills as implicit knowledge and commands as explicit scripts, the rest of the architecture clicks naturally. Most agent setups conflate these. They embed knowledge in commands. They make skills behave like workflows. They mix persona into everything else. And the massively underuse subagents.

When you separate these concerns--modes for persona, skills for knowledge, commands for orchestration, subagents for delegation--you get something that looks like good systems engineering. You can swap skills without touching commands. You can change modes without rewriting workflows. You can spawn subagents without the main agent knowing or caring how they work internally. The result is a system that works and adapts and _scales_ like good software should do.

The system scales because the pieces are independent. Change one without breaking the others. Each component has a single job, and the boundaries between them are meaningful. When context shifts, when requirements evolve, when a new skill needs adding, the system adapts incrementally rather than collapsing under the weight of accumulated complexity.

## Part III: The Practice

If so far this seems like abstract theory for you, in this section we will ground these concepts in actual practice. Let me show you how I'm using these ideas today to improve my AI-assisted coding practice. I'm using opencode.ai but I believe the following is easily adaptable to any agentic toolkit out there.

### My Three Modes

Every agentic system needs boundaries, not social contracts, but enforced constraints. In my setup, those constraints come from three modes: analyze, design, and create.

Each of these modes defines a thinking style---a persona---and a set of constraints for tool use and filesystem access.

**Analyze mode** is research and investigation. This mode reads your work and writes summaries to a knowledge base. It cannot touch production files. Not "should not" but *cannot*. The permissions are built into the mode itself, not enforced through prompts or warnings. The agent is incapable of writing outside of a `.playground` folder, and is incapable of doing anything that can harm the project or the system (more on how a bit later) but it is still capable of running arbitrary code, download anything from the internet, and play around as it needs.

**Design mode** is architecture and planning. This mode bridges analysis and implementation. It can read your project and write design documents, architecture diagrams, and implementation plans, but still cannot touch production code. It cannot run shell scripts either, at all. It can look at git status and logs, read folder contents, etc., but it can only write to a space where plans and design documents go.

**Create mode** is execution. Full read-write access. This is where production work happens. The agent can write code, create files, and modify the project directly. Again, it cannot do anything outside the project scope, though. It won't accidentally change `/etc/hosts` even if it tries to.

The key insight: **modes define permissions, not just persona**. You can't accidentally prompt your way into code generation during research. The agent literally lacks the capability. The agent doesn't need to "understand" these constraints, it simply operates within them.

Mode is the who, and it determines what the agent *can* do, not just how it thinks.

Let me show you how they work in three different domains that make the bread and butter of my daily job: software development, scientific research, and technical writing.

I chose these domains because they illustrate the simplicity and scalability of the system. Software development shows the framework under constraints: deadlines, production code, real stakes. Research shows it under complexity: synthesis, evaluation, structured output. Technical writing shows it under nuance: voice, audience, iterative refinement. Three different pressures, one consistent architecture that works in all three cases.

In each of these domains we have two layers to go through: first is the set of **implicit skills** that are available to the agents, and second is the set of **explicit commands** (each tied to a specific mode) that setup concrete workflows. I will show you one example workflow that cross-cuts across the three modes in each case. I will also tell you exactly where delegation occurs.

### Domain A: Software Development

Software development is where agentic systems face the harshest constraints. Production code has stakes. Deadlines are real. Mistakes cost money. Let's see how the framework applies.

#### Implicit Skills

A software development agent carries knowledge it never needs to be told to use. It knows language idioms and patterns like the idiomatic way to write a list comprehension in Python, or the conventions for error handling in Go. It knows testing conventions: where tests live in the directory structure, how they're named, what assertions to prefer. It knows architecture conventions: layered structure, dependency injection patterns, how error states propagate. It knows code review standards: what to flag, what to praise, when to ask for clarification.

#### Example Workflow: Bug Hunting

I use this workflow for finding and fixing bugs. It starts with investigation. The agent spawns dozens of subagents to try and break the system (either guided towards a purpose, or completely unbiased). Then you build a comprehensive plan to solve it. And then you execute that plan. Simple, right?

**Phase 1: /trace (analyze mode)** runs systematic experiments to detect and narrow down a bug's cause. The agent examines stack traces, compares behavior across commits, and pinpoints the exact files and functions that need attention. This mode is read-only by design, except for a `.playground` folder. Research happens here, not in the code itself.

Each experiment is run on a subagent that has the job of verifying one assumption. The main agent receives only experiment results, and constructs an executive report of findings. This means you can run dozens of different experiments autonomously to detect what breaks what.

**Phase 2: /plan (design mode)** takes the diagnosis and defines the changes needed, along with their architectural impact. The agent reviews the affected modules, considers alternative approaches, and documents the implementation plan before touching anything. This is where the scope gets locked in.

The result of this phase is a structured plan with step by step details on what files must be touched and what must be done in there (semantically, not code). For every phase, it defines success criteria: what must be validated before we can say we got that phase right.

**Phase 3: /build (create mode)** executes the plan step by step. The agent writes tests first (following Test-Driven Development (TDD) discipline) for the success criteria defined for that phase and watches them fail. Then it launches a coding subagent that has _read-only_ access to tests, so it cannot cheat and change the tests.

The subagent attempts to implement changes that make the test pass. If it succeeds, the main agent commits and moves on. If it doesn't, the main agent retries a few times. If there is no progress, the main agent resets the work tree (no harm done), and reports on failure. This usually means the plan needs revisions.

### Domain B: Research

Research is where agentic systems face the greatest complexity. Sources multiply, methodologies diverge, synthesis requires judgment. Let's see how the framework applies.

#### Implicit Skills

A research agent knows the conventions of academic writing without being reminded. It knows citation formats like APA, MLA, Chicago, and IEEE, and when to use each. It knows how to evaluate papers: methodology soundness, sample size adequacy, replicability claims, conflict of interest disclosures. It knows the structure of literature reviews: how to organize by theme, methodology, or chronological development. It knows domain-specific terminology, distinguishing between "accuracy" and "precision" in machine learning, or between "confounding" and "colliding" in causal inference.

#### Example Workflow: State-of-the-Art Report

**Phase 1: /research (analyze mode)** spawns subagents to gather sources in parallel. Each subagent reads a batch of papers, synthesizes findings, and returns summaries. The main agent synthesizes those summaries into structured notes. This phase can be run multiple times to collect batches of sources without overwhelming context. At the end, you get hundreds of sources summarized into clean research notes.

**Phase 2: /outline (design mode)** identifies patterns across the collected literature. The agent groups papers by methodology, extracts recurring findings, and maps the landscape of the field. It generates outline options for the final document, based on typical structures like problem-solution or paradigm-methods, highlighting gaps where the research is thin and consensus areas where findings align.

**Phase 3: /draft (create mode)** builds the document section by section, following the outline. Each section draws on the structured notes, weaving together sources into coherent narrative.

The agent launches subagents for writing each subsection because typically, agents write more or less the same length in a single `write` command, so if you ask it to fill in a large outline all at once you'll only get a mediocre extended outline. By launching independent writers for specific sections of the outline, you get all the attention of a single turn to read source material and write a good 4 or 5 paragraphs for a concrete section.

A cool idea I've been meaning to try is have the main agent can spawn several subagents to write the same section, with a high temperature, and then perform some sort of aggregation or evaluation before building the final draft for every section. This burns through 3x tokens but ensembles have been shown over and over to improve AI models outputs. If you try it, let me know.

### Domain C: Technical Writing

Technical writing is where agentic systems face the most nuance. Voice matters. Audience varies. Iterative refinement is the norm. Let's see how the framework applies.

#### Implicit Skills

A technical writing agent carries knowledge of prose style without being coached. It knows voice and tense conventions—active voice for clarity, past tense for completed processes, second person for direct instruction. It knows structural patterns: how documentation differs from blog posts, how reports differ from tutorials, how reference material differs from guides. It knows audience awareness: what to explain for newcomers, what to omit for experts, when to elaborate and when to abbreviate. It knows cross-referencing and linking norms: when to link, when to inline, how to name anchors for scannability.

#### Example Workflow: Paper Review

**Phase 1: /review (analyze mode)** performs detailed review in a specific order: structural issues first, then content, then style. The agent examines the narrative arc—how main points connect, whether the flow makes sense, before worrying about grammar or word choice. This ordering matters; reviewing low-level details when high-level problems exist wastes effort.

Each iteration is performed by spawning several subagents that focus on specific types of problems, like transitions, unverifiable claims, etc. Each subagent returns a structured list of issues, pointing back to exact line numbers and phrasing. Then, the main agent _edits_ the original paper and injects markdown comments in every marked issue, next to the paragraph, or under the header where it best fits.

**Phase 2: /revise (design mode)** plans changes to specific sections, prioritizing by review type. The agent maps structural fixes to particular paragraphs, content additions to thin sections, style improvements to verbose passages. It produces a concrete plan, section by section, change by change. Then it goes into the manuscript and writes markdown comments as replies to the existing review comments, thus grounding the revision plan in the exact context it must fit.

**Phase 3: /rewrite (create mode)** follows the plan. The agent revises sections in priority order, applying structural changes first, then content, then style. Again, each step is performed spawning a subagent tasked with just a change (for style changes we actually do it section by section).

The subagent doesn't edit; it produces a draft revision that the main agent is then tasked to paste into the document where it fits. Crucially, the main agent is instructed to _leave_ the editorial comments but mark them as solved, with a short trail of what was changed. This works wonders for a later human review phase.

## Part IV: A Look into the Future

These workflows work, but with some caveats. There's a gap between "working" and "working well." Three key pains remain in my implementation.

1. Long commands are hard to follow when given as a single prompt. The fourth step gets forgotten since it is buried at the beginning of the context.
2. Permissions as currently implemented are all-or-nothing. You either have shell access (destructive) or you don't. I want broad permissions (run whatever you want) with provable security (nothing you run can change this file).
3. Context saturation still happens even with delegation. After a while, the agent will have to compact context, and this usually means you lose important information.

I have three ideas for closing this gap. The first is about how commands work. The second is about security. The third is about context management. They are in different levels of implementation, so let me show you what I'm building toward.

### Idea One: Better Commands

Commands in most tools (Claude Code, Gemini CLI, Codex, Copilot) are one-shot interactions: you invoke the command, a single massive prompt is injected. The agent runs until it decides to stop.

To make commands truly useful, we need to be more like scripts. Here's what that means:

1. Commands that inject prompt instructions one step at a time, waiting for the agent to do a full turn each time. Instead of dumping a large prompt to run all steps at once, a command like `/review` could insert surgical mini prompts that say "read the file", wait for the agent, "analyze structure", wait for agent, and so on, until "write the report". This massively reduces the problem of lost-in-middle context saturation. Each turn the agent is focused on one specific step, and you get N times the compute power to solve an N-step workflow.

2. Commands that extract structured information from the agent response, and can later inject variables back into prompt. This allows to reinject important information into later prompts, keeping important information as a contextual variable, not just a string lost in the middle of the prompt. But it allows for something else.

3. Conditional branching based on context or user input. Once we have structured parsing and contextual variables, we can inject different prompts based on whether the agent succeeded or failed. If the plan reveals a breaking change, route to architectural review. If it's a bug fix, route directly to implementation. The command adapts its path based on what it discovers.

4. Finally, commands that embed and execute external scripts. Instead of asking the agent to run some script, the command can run arbitrary Python, JS, Bash, or whatever, to, for example, transform structured information. The command becomes an orchestrator of other processes.

Basically, what I'm asking for here is a Domain-Specific Language (DSL) for guiding agents in a far more structured manner, but still having the power of arbitrary prompts for flexibility. Mixing code and prompts in this way gives us the tools to find the precise balance between constraints and capabilities.

If this sounds exciting, I'm happy to tell you this is already doable, to some extent. Check out my [literate-commands](https://apiad.github.io/opencode-literate-commands) project for an OpenCode-specific implementation of these ideas. It's still a bit rough around the edges, but it works much better than plain, single-prompt commands.

### Idea Two: Sandboxed Security

Most agentic tools have very coarse permission settings. You can allow, deny, or set a specific tool to "ask" mode, which means the agent will pause and emit a notification for the user to give permission.

This works fine for coarse-grained permissions like read-only access, or write but no shell. In OpenCode, you can even define permissions for specific paths, or even specific shell commands (with simple glob patterns, so you can, e.g., allow `ls *` but reject all other shell commands).

However, even in this case, I find these permissions too restrictive. They are conflating two different dimensions into one--what tools the agent can use, and what side-effects can those tools have.

For example, say I want to give my agent `git` access but only for reading operations. How do you achieve that? You need to list all safe patterns like `git ls-tree *`, `git status`, `git log *`. But what about `git branch`? Depending on the arguments, this subcommand can have read-only or write side effects. And then think about pipes, shell substitution, custom bash scripts, or worse, `python *`.

If you want your agent to be capable, you need to give it access to a wide variety of tools. For example, my bug-hunting workflow depends on the agent being able to execute arbitrary code that it synthesizes on the fly. However, I want guardrails. There is simply no way to whitelist all possible commands. We need separation of permission to run a command and permission to modify the system.

The solution, of course, is some form of filesystem isolation. The most obvious one is wrapping all shell execution in Docker, so commands run in a container with proper constraints. This creates all sorts of other problems, which I can discuss in a future post, but for now, it remains my best (and simplest) solution to robust sandboxing.

And this isn't just about safety, though. When you know the agent can't accidentally wipe your home directory or exfiltrate your API keys, you can let it do more. Security enables capability. You can let the agent download arbitrary code from the internet, run arbitrary scripts, break things and observe changes. Everything happens inside a Docker container with precise constraints that enable maximum capability with absolute security.

As of now, I kind of implemented this as a plugin for OpenCode, but it's still in beta phase and not ready for widespread use. More on this idea in a future article.

### Idea Three: Context-Aware Execution

And finally, we need to rethink the whole oversimplistic ReAct loop that simply grows the context linearly. The agentic cycle doesn't have to be a straight line. Real work branches: you explore options, try things, backtrack when they fail. The context should reflect that.

I've been designing a system where the context never saturates. It branches when you're exploring, spawning parallel contexts for different approaches. It prunes old tool calls that went nowhere. It removes internal reasoning that no longer matters. It maintains a "trail" that actually works: a structured record of decisions, not a lossy summary.

The goal is simple: keep context between 40% and 60% saturation at all times. Not by compacting a 150K tokens context down to 10K---which kills all understanding the agent had achieved---but by never letting it grow unchecked.

Nothing like this exists yet, so I'm building it, but it's a story for another day.

## Conclusion

The main takeaway from this article is not that _my_ system is better. It's that _you_ can design your own system to adapt perfectly to your workflows if you clearly separate concerns. The main modes are for establishing an overall persona--inquisitive and critical, versus detailed and forward-looking, versus focused and action-biased--while skills incorporate domain knowledge, and commands act as precise workflows.

The workflows I described are real, based on actual commands and prompts I'm using in production code. But I have abstracted them a bit to make them easier to understand in the context of an arbitrary agent, not tied to specific idiosyncrasies of the tool I happen to be using at the moment. If you want to see and try for yourself a concrete implementation of these ideas---still imperfect, but working nonetheless---check out my [opencode toolkit](https://apiad.github.io/opencode) repository. It's still pretty much work in progress, so use it with care.

In future articles I will explore specific problems in more detail and discuss concrete strategies to implement powerful workflows that keep you, the user, in absolute control, while delegating the majority of the grunt work.

And, as a final remark, I'm seriously considering building my own CLI agent. I know, I know. Reinventing the wheel and all that. But my plan is not to compete with any of the professional tools out there. What I always care about is _understanding_ things deeply, and as my computer science career has taught me so far, there is no deeper understanding than the one you gain from actually building stuff.

So stay tuned for that. I will share progress as usual in the form of educational articles, so you'll get to see under the hood how to build a fully functional CLI agent with tool calling, context compaction, skills, commands (the powerful ones, not the cheap single-prompt injection), subagent delegation, sandboxing, and all the engineering design hurdles that come with it.

Until next time, stay curious.
