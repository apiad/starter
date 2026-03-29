---
id: literate-commands-multi-step-injection
created: 2026-03-29
modified: 2026-03-29
type: plan
status: active
---

# Plan: Multi-Step Command Injection (MVP)

Simplify literate-commands to just demonstrate multi-part message injection. No code execution yet - just getting opencode to process sequential prompts.

## Phase 1: Fix `command.execute.before`

**Goal**: Inject only the first step's prompt, not abort.

**Changes**:
- [ ] Remove `return { ...output, abort: true }`
- [ ] Replace `output.parts` with first step's substituted prompt
- [ ] Store state with `currentStep: 0` (already done)

**Before**:
```typescript
if (firstPrompt) {
  output.parts = [{ type: 'text', text: firstPrompt }];
}
return { ...output, abort: true }; // WRONG
```

**After**:
```typescript
if (firstPrompt) {
  output.parts = [{ type: 'text', text: firstPrompt }];
}
// Don't return abort - just let the hook end naturally
// The modified output.parts will be used
```

## Phase 2: Implement `session.idle` Injection

**Goal**: Use `client.session.promptAsync()` to inject subsequent steps.

**Changes**:
- [ ] Add `client` to plugin state (store it during init)
- [ ] In `event` handler, use `client.session.promptAsync()` to inject next step
- [ ] Increment `currentStep` in state
- [ ] When no more steps, clean up state

**Code**:
```typescript
event: async ({ event }) => {
  if (event.type !== 'session.idle') return;
  
  const sessionID = event.properties?.sessionID;
  if (!sessionID) return;
  
  const state = getState(sessionID);
  if (!state) return;
  
  // Check if current step has a question - skip for now
  const currentStep = state.steps[state.currentStep];
  if (currentStep?.config.question) return;
  
  // Advance to next step
  state.currentStep++;
  
  // No more steps?
  if (state.currentStep >= state.steps.length) {
    deleteState(sessionID);
    return;
  }
  
  // Inject next step's prompt
  const nextStep = state.steps[state.currentStep];
  const prompt = substituteVariables(nextStep.prompt, state);
  
  await client.session.promptAsync({
    path: { id: sessionID },
    body: {
      parts: [{ type: 'text', text: prompt }],
    },
  });
}
```

## Phase 3: Store Client Reference

**Goal**: Make `client` available in event handler.

**Changes**:
- [ ] Create module-level `client` variable
- [ ] Set it in plugin initialization
- [ ] Use it in event handler

**Code**:
```typescript
let pluginClient: any = null;

export const LiterateCommandsPlugin = async ({ client }) => {
  pluginClient = client; // Store for later use
  // ... rest of init
};

event: async ({ event }) => {
  // Use pluginClient instead of client from closure
  await pluginClient.session.promptAsync(...);
}
```

## Phase 4: Test Command File

**Goal**: Create a simple test command with 3 text-only steps.

**File**: `.opencode/commands/test.md`
```markdown
---
step: Step 1
---

This is the first prompt.

---
step: Step 2
---

This is the second prompt.

---
step: Step 3
---

This is the third and final prompt.
```

## Expected Behavior

1. User runs `/test`
2. `command.execute.before` intercepts, replaces output with "This is the first prompt."
3. LLM processes first prompt, session goes idle
4. `session.idle` fires, injects "This is the second prompt." via `promptAsync`
5. LLM processes second prompt, session goes idle
6. `session.idle` fires, injects "This is the third and final prompt."
7. LLM processes final prompt, session goes idle
8. `session.idle` fires, no state found, does nothing

## Files to Modify

- `.experiments/literate-commands/literate-commands.ts`

## Out of Scope (for now)

- Code block execution
- Variable substitution (`$1`, `$ARGUMENTS`)
- Question/response handling
- Parallel steps
- Return chains

## Verification

Run `/test` and verify:
- [ ] First prompt appears and LLM responds
- [ ] After idle, second prompt is injected
- [ ] After second idle, third prompt is injected
- [ ] After third idle, no more prompts (session ends naturally)
