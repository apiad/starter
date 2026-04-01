# The Anatomy of AI Agents

---

You've been using AI coding agents for months. You've crafted elaborate system prompts. You've added a dozen skills. You've learned the dance of context window management. And somewhere around the third hour of work, something breaks. The agent starts forgetting things. Making wrong assumptions. Doing something close—but not quite—what you asked.

This isn't a failure of the model. This is a failure of architecture.

I'll walk through why current systems fail, introduce a four-element framework for thinking about agent architecture, then show you how these principles apply across software development, research, and technical writing.

## The Skill Accumulation Problem

Here's what happens: you add a skill for code review. Then one for documentation. Then one for PR descriptions. Then three more for your company's specific stack. Each skill seems small. A few hundred tokens each. But they pile up as implicit context—always-on knowledge the agent carries but can't prioritize.

The result is context bloat. The agent can't tell what's relevant in any given moment. So it blends everything together, and hallucinations increase. More skills made it worse. Not better. The agent can't tell what's relevant, so it blends everything together.

## The Plan/Build Oversimplification

Every agent framework implements the same pattern: analyze → plan → build. It's become a cliché. But here's the problem: "plan" is vague. What kind of planning? What scope? A five-minute task or a five-hour one?

Real work isn't linear. It branches. Loops. Requires backtracking when something fails. A single plan can't capture the context-sensitive decisions that happen mid-execution.

**The plan is a map. But terrain changes. The agent needs a compass, not just a destination.**

That's why context management matters so much—and why most agent frameworks are solving the wrong problem.

## The Context Drift Symptom

After about two hours of continuous work, you see the same pattern: the agent makes 95% of the progress, then fails on the last 5%. It nails the architecture, the logic, the core implementation. Then it stumbles on a detail because context has saturated. It forgot which environment it was in, which conventions matter, which constraints still apply.

I've seen this happen mid-sprint. The agent was building a feature beautifully—clean code, good structure, proper error handling. Then it added hardcoded credentials because it forgot about the `.env` pattern we used everywhere. Not malicious. Not careless. Just context loss.

The frustrating part: this wasn't a hard problem. The agent had all the knowledge it needed. But the context window had filled with everything else, and the important bits got pushed out. More tokens in, less signal out.

The solution isn't better prompts. It's better architecture—and that architecture has four elements.

---

I'll introduce a framework for thinking about agent systems, then show you how it applies across software development, research, and technical writing.

---

# The System

Now that we understand the problem, let's look at how every agent system actually works.

## The Four Elements

Every AI agent system addresses four concerns. When you conflate them, the system breaks. When you separate them, the system scales.

I learned this the hard way. The first time I built an agent that mixed persona with workflow with domain knowledge, it worked for the happy path. Then users pushed on it, and everything tangled together like Christmas lights in storage. Mode logic leaking into commands. Skills stepping on each other. Subagents returning answers in the wrong voice. A mess.

The fix wasn't better prompts. The fix was principled separation.

Here's the breakdown. Every agent system you'll encounter (explicitly or implicitly) is managing these four things:

**Mode — the who.** A mode is the persona the AI adopts. It defines the thinking style, the permissions, the available tools. When you interact with a "code assistant," you're in a coding mode. When you switch to "creative writer," you're in a creative mode.

Here's the thing: modes are *implicit*. You don't say "now you're in analysis mode." The context tells the agent which mode to adopt. Mode = the who, not the what.

**Skill — the knowledge.** A skill is something the agent just *knows*. It doesn't get invoked—it gets applied. When you give an agent knowledge about SQL optimization, that skill is available whenever relevant. The agent doesn't need to be told to use it.

Unlike modes, skills can layer. An agent might have a SQL skill, a documentation skill, and a debugging skill—all active simultaneously, all contributing when relevant. Skills are implicit because the agent should just apply them naturally.

**Command — the workflow.** A command is a script. It tells the agent: do this, in this order, using these tools. "Refactor this function" is a command. "Run these tests and report results" is a command.

Commands are *explicit*—you invoke them. And here's the key: commands are intentionally simple. They orchestrate. They delegate. They don't contain knowledge. That's intentional separation of concerns. The command itself shouldn't know *how* to build; it knows *when* to spawn subagents and which mode to use. This keeps commands thin and changeable without rewriting underlying knowledge.

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

Understanding this distinction unlocks everything else. Once you see skills as implicit knowledge and commands as explicit scripts, the rest of the architecture follows naturally. Most agent systems conflate these. They embed knowledge in commands. They make skills explicit and invocation-heavy. They mix persona into workflows.

When you separate these concerns—modes for persona, skills for knowledge, commands for orchestration, subagents for delegation—you get something beautiful. You can swap skills without touching commands. You can change modes without rewriting workflows. You can spawn subagents without the main agent knowing or caring how they work internally. The result is a system that works until you need to change something—and when you do, you only touch the piece that needs changing, not the whole tangled mess.

The system scales because the pieces are independent. Change one without breaking the others. Each component has a single job, and the boundaries between them are meaningful. When context shifts, when requirements evolve, when a new skill needs adding—the system adapts incrementally rather than collapsing under the weight of accumulated complexity.

These four elements aren't just theoretical categories. They're the building blocks for a practical system. Let me show you how.

---

# The Practice
