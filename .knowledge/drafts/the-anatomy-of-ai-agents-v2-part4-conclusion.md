# Part IV: A Better Future

The three-phase workflow works. But the commands themselves are still primitive. They should be smarter.

Commands as currently defined are one-shot interactions: you invoke, you get a result. But that's a limitation, not a feature. Real work isn't a single prompt and response. It's iterative. Adaptive. It pauses to ask questions, makes decisions based on context, and sometimes needs to call other scripts to get things done.

Here are four capabilities that would transform how commands operate.

### Sequential Prompts

Commands that pause mid-execution to collect input, then continue. Instead of running all experiments at once, `/trace` could pause after each batch and ask: "Which of these looks most promising?" The command becomes a conversation that guides toward better outcomes.

### Structured Parsing

Commands that extract and route information based on defined schemas. Instead of dumping all sources into one document, `/sota` could parse the bibliography, extract methodology fields, and group by research question. The command becomes a router for structured data.

### Routing

Conditional branching based on context or user input. If the plan reveals a breaking change, route to architectural review. If it's a bug fix, route directly to implementation. The command adapts its path based on what it discovers.

### Script Injection

Commands that embed and execute external scripts. Instead of describing TDD, `/build` could inject the test-first cycle as an executable script, ensuring red-green-refactor happens without manual oversight. The command becomes an orchestrator of other processes.

I'll show you how to implement these features in a future article. But the concepts work today—you can start designing your workflows around them now.

---

# Conclusion

The three modes are one expression of the four-element framework. You can define Mode, Skill, Command, and Subagent differently for your domain—but as long as you keep them separate, the system scales.

Separation isn't just about organization. It's about composability. When Mode, Skill, Command, and Subagent are independent, you can swap one without breaking the others. That's what makes the system adaptable—and that adaptability is what scales.

I didn't plan this symmetry. It emerged from fixing things that did too much. Modes kept getting tangled with commands, so I pulled them apart. Skills kept leaking into workflows, so I isolated them. Subagents kept needing access to shared context, so I made them ephemeral. The separation created composability, and composability is what makes the whole thing work.

Build for the long game. Your future self (and your context window) will thank you.
