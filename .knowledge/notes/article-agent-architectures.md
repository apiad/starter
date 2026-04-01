# Article Brainstorm: Agent Architectures

**Created:** 2026-04-01  
**Target:** blog.apiad.net  
**Status:** Brainstorming

---

## Core Thesis

The article argues for a principled taxonomy of AI agent components:
- **Modes** (Primary Agents): Define the AI's *persona* and *permissions* — implicit, always active
- **Skills**: Extend capabilities with *domain knowledge* — implicit, activated by context
- **Commands**: Trigger *workflows* — explicit, user-initiated
- **Subagents**: Handle *background delegation* — implicit, spawned by commands

Key insight: **The distinction between implicit (automatic) and explicit (requested) is the fundamental design decision.**

---

## Target Audience

- Developers using AI coding agents (Claude Code, Gemini CLI, Copilot, etc.)
- AI practitioners building agentic systems
- Technical writers wanting to leverage AI effectively

**Assumed knowledge:** Basic familiarity with AI agents, prompts

---

## Key Points to Cover

### 1. The Problem: Agent Confusion

Current agents conflate three concerns:
- *Who* the AI is (mode/agent)
- *What* it knows (skills)
- *How* it works (commands)

This leads to brittle prompts that try to do everything at once.

### 2. The Taxonomy (Main Contribution)

#### Primary Agents = Modes
- Define *who* the AI is
- Affect permissions, available tools, thinking style
- Always active, implicitly determined
- Examples: `analyze`, `design`, `create`

#### Skills = Domain Knowledge
- Extend the agent with *implicit* capabilities
- Activated by context, not by user invocation
- Provide specialized knowledge or behavior
- Examples: `literate-commands`, `code-review`, `debugging`

#### Commands = Workflows
- Explicit user-triggered sequences
- Simple prompts that invoke a structured workflow
- Orchestrate agents, subagents, and skills
- Examples: `/build`, `/research`, `/plan`

#### Subagents = Delegation
- Spawned by commands for background tasks
- Keep main context clean
- Return summarized results only
- Examples: `scout`, `investigator`, `critic`

### 3. The Key Insight: Implicit vs Explicit

**Skills are implicit:**
- Always available in context
- Activated by relevance, not by request
- "The agent just knows how to do X"

**Commands are explicit:**
- User must invoke with `/command`
- Trigger a defined workflow
- "Do this specific thing, this specific way"

This distinction is crucial because:
- Implicit keeps the agent *aware*
- Explicit keeps the user *in control*

### 4. The Command Prompt Limitation

Commands are *simple prompts* — not full agents. They:
- Define *what* to do (the workflow)
- Invoke *who* to do it (agents/subagents)
- But don't embed domain knowledge (that's skills)

This separation allows:
- Commands to be workflow-agnostic
- Skills to be command-agnostic
- Composable, reusable pieces

### 5. Literate Commands: The Next Evolution

Commands that are Markdown files with YAML frontmatter:
- Self-documenting
- Declarative configuration
- Step-by-step execution with variable substitution
- Conditional logic for branching

Example:
```yaml
---
name: feature-workflow
variables:
  - name: feature
    type: string
    prompt: "Feature name?"
---
# Feature Implementation

## Step 1: Create Branch
git checkout -b feature/${{feature}}
```

### 6. The OpenCode Example

Present the full system as a case study:
- 3 modes: `analyze`, `design`, `create`
- 5 subagents: `scout`, `investigator`, `critic`, `tester`, `drafter`
- 1 skill: `literate-commands`
- 19+ commands orchestrating everything

Show how they compose:
- `/build` invokes `create` agent + `tester` subagent
- `/plan` invokes `design` agent + `investigator` subagent
- `/research` invokes `analyze` agent + `scout` subagent

---

## Potential Structure

### Option A: Conceptual First
1. Hook: "Everyone talks about AI agents, but nobody explains the *parts*"
2. The taxonomy (the four components)
3. The key insight (implicit vs explicit)
4. Why commands are simple prompts
5. Literate commands as evolution
6. Case study: OpenCode
7. Takeaways

### Option B: Problem-Solution
1. Hook: "Your AI agent does too much. Here's why."
2. The problem: monolithic agents
3. The solution: principled separation
4. The taxonomy explained
5. Literate commands demo
6. OpenCode implementation
7. Conclusion: build your own

### Option C: Tutorial-Style
1. Hook: "I built an agent framework. Let me show you the architecture."
2. Start with agents/modes
3. Add skills
4. Add commands
5. Add subagents
6. Put it together: OpenCode
7. The literate commands innovation
8. How to build your own

---

## Opening Hook Options

1. **Provocative:** "You think you're prompting an AI agent. You're not. You're designing a system."

2. **Confessional:** "I've built three different agent frameworks. Here's what I learned about the one thing everyone gets wrong."

3. **Question:** "What's the difference between a skill, a command, and an agent? If you don't know, keep reading."

4. **Statement:** "The biggest mistake in AI agent design is treating everything as a prompt."

---

## Closing Takeaways

1. **Modes define persona, skills extend knowledge, commands trigger workflows, subagents delegate**
2. **Implicit vs explicit is the fundamental design decision**
3. **Commands should be simple prompts, not knowledge dumps**
4. **Literate commands are the next evolution: self-documenting, declarative workflows**
5. **Composable systems beat monolithic prompts**

---

## Tone and Style

Based on previous blog posts:
- Direct address ("you")
- Short paragraphs, punchy sentences
- Clear opinions with justification
- Real-world examples
- Philosophical framing + practical implementation
- ~1500-2500 words

---

## Visual Elements to Consider

- Architecture diagram showing the four components
- Flowchart: how a command orchestrates agents/subagents
- Example literate command file
- OpenCode directory structure

---

## Related Posts

- "How I'm Using AI Today" (Mar 2026) - Previous article on the system
- "How to Train your Chatbot" series - Building agents from scratch

---

## Next Steps

1. [ ] Pick structure option
2. [ ] Draft opening hook
3. [ ] Write first draft
4. [ ] Add diagrams/visuals
5. [ ] Review against writing style guide
