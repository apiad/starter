/**
 * Literate Commands Plugin
 * 
 * A plugin that executes commands defined as long-form markdown
 * with step-by-step execution.
 */

// Import at top level
import yaml from "yaml";

// ============================================================================
// Types
// ============================================================================

export interface StepConfig {
  step: string;
  next?: string;
  parse?: Record<string, string>;
  question?: {
    title: string;
    options: Record<string, string>;
  };
  maxIter?: number;
}

export interface CodeBlock {
  language: string;
  meta: string[];
  code: string;
}

export interface Step {
  config: StepConfig;
  prompt: string;
  codeBlocks: CodeBlock[];
}

export interface CommandState {
  steps: Step[];
  currentStep: number;
  variables: Record<string, string>;
  sessionID: string;
  commandName: string;
  arguments: string;
}

// ============================================================================
// Markdown Parsing
// ============================================================================

export function parseLiterateMarkdown(content: string): Step[] {
  // Remove frontmatter if present
  let body = content;
  if (body.startsWith('---')) {
    const endOfFrontmatter = body.indexOf('\n---', 3);
    if (endOfFrontmatter !== -1) {
      body = body.slice(endOfFrontmatter + 4);
    }
  }
  
  // Split by --- separators (with optional whitespace)
  const sections = body.split(/\n---\n/);
  const steps: Step[] = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;
    
    const step = parseStep(trimmed);
    if (step) {
      steps.push(step);
    }
  }

  return steps;
}

export function parseStep(section: string): Step | null {
  // Look for config block at the start
  const configMatch = section.match(/```yaml\s*\{config\}\n([\s\S]*?)```/);
  
  let config: StepConfig = { step: `step-${Date.now()}` };
  let remaining = section;

  if (configMatch) {
    try {
      const parsedConfig = yaml.parse(configMatch[1]);
      if (parsedConfig) {
        config = { ...config, ...parsedConfig };
      }
    } catch (e) {
      console.error('Failed to parse YAML config:', e);
    }
    // Remove the config block from section
    remaining = section.replace(configMatch[0], '').trim();
  }

  // Extract code blocks with metadata
  const codeBlocks: CodeBlock[] = [];
  const codeBlockRegex = /```(\w+)\s*\{([^}]+)\}\n([\s\S]*?)```/g;
  let match;
  while ((match = codeBlockRegex.exec(remaining)) !== null) {
    codeBlocks.push({
      language: match[1],
      meta: match[2].split(/\s+/).filter(m => m),
      code: match[3].trim(),
    });
  }

  // Remove code blocks from remaining to get prompt
  const prompt = remaining
    .replace(/```\w+\s*\{[^}]+\}\n[\s\S]*?```/g, '')
    .trim();

  if (!prompt && codeBlocks.length === 0) {
    return null;
  }

  // Also return null for whitespace-only prompts
  if (!prompt.trim() && codeBlocks.length === 0) {
    return null;
  }

  return { config, prompt, codeBlocks };
}

// ============================================================================
// Variable Substitution
// ============================================================================

export function substituteVariables(text: string, state: CommandState): string {
  let result = text;
  
  // Replace $ARGUMENTS
  result = result.replace(/\$ARGUMENTS/g, state.arguments);
  
  // Replace known variables
  for (const [key, value] of Object.entries(state.variables)) {
    result = result.replace(new RegExp(`\\$${key}\\b`, 'g'), value);
  }
  
  return result;
}

// ============================================================================
// Step Execution
// ============================================================================

export function executeStep(state: CommandState): string | null {
  if (state.currentStep >= state.steps.length) {
    return null; // All steps complete
  }

  const step = state.steps[state.currentStep];
  return substituteVariables(step.prompt, state);
}

export function advanceStep(state: CommandState): Step | null {
  state.currentStep++;
  
  // Check for explicit next
  const currentStep = state.steps[state.currentStep - 1];
  if (currentStep?.config.next) {
    const nextIndex = state.steps.findIndex(s => s.config.step === currentStep.config.next);
    if (nextIndex !== -1) {
      state.currentStep = nextIndex;
    }
  }
  
  if (state.currentStep >= state.steps.length) {
    return null;
  }
  
  return state.steps[state.currentStep];
}

// ============================================================================
// Variable Expansion Functions
// ============================================================================

/**
 * Extract parsed variables from LLM response
 * Looks for JSON block with the expected variable names
 */
export function extractParsedVariables(
  llmResponse: string,
  parseConfig: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Try to find JSON block
  const jsonMatch = llmResponse.match(/```(?:json)?\s*\n?({[\s\S]*?})\n?```/);
  if (!jsonMatch) {
    return result;
  }
  
  try {
    const parsed = JSON.parse(jsonMatch[1]);
    for (const key of Object.keys(parseConfig)) {
      if (parsed[key] && typeof parsed[key] === 'string') {
        result[key] = parsed[key];
      }
    }
  } catch (e) {
    console.error('[LiterateCommands] Failed to parse JSON from LLM response:', e);
  }
  
  return result;
}

/**
 * Expand $GLOB(pattern) to list of matching files
 */
export async function expandFileGlob(pattern: string): Promise<string[]> {
  try {
    const { Glob } = Bun;
    const glob = new Glob(pattern);
    const files: string[] = [];
    
    for await (const file of glob.scan({ onlyFiles: true })) {
      files.push(file);
    }
    
    return files.sort();
  } catch (e) {
    console.error('[LiterateCommands] GLOB error:', e);
    return [];
  }
}

/**
 * Expand $FILES(path1, path2, ...) to concatenated file contents
 */
export async function expandFileContents(paths: string[]): Promise<string> {
  const contents: string[] = [];
  
  for (const path of paths) {
    try {
      const file = Bun.file(path);
      if (await file.exists()) {
        const content = await file.text();
        contents.push(`=== ${path} ===\n${content}`);
      }
    } catch (e) {
      console.error(`[LiterateCommands] Failed to read ${path}:`, e);
    }
  }
  
  return contents.join('\n\n');
}

/**
 * Enhanced variable substitution with special functions
 */
export async function expandVariables(text: string, state: CommandState): Promise<string> {
  let result = text;
  
  // Replace $ARGUMENTS
  result = result.replace(/\$ARGUMENTS/g, state.arguments);
  
  // Replace known variables
  for (const [key, value] of Object.entries(state.variables)) {
    result = result.replace(new RegExp(`\\$${key}\\b`, 'g'), value);
  }
  
  // Expand $GLOB(pattern)
  result = await replaceAsync(result, /\$GLOB\(([^)]+)\)/g, async (match, pattern) => {
    const files = await expandFileGlob(pattern);
    return files.join('\n');
  });
  
  // Expand $FILES(path1, path2, ...)
  result = await replaceAsync(result, /\$FILES\(([^)]+)\)/g, async (match, paths) => {
    const pathList = paths.split(',').map(p => p.trim());
    return await expandFileContents(pathList);
  });
  
  return result;
}

/**
 * Helper for async regex replacements
 */
async function replaceAsync(
  str: string,
  regex: RegExp,
  replacer: (match: string, ...args: string[]) => Promise<string>
): Promise<string> {
  const matches = [...str.matchAll(regex)];
  const results = await Promise.all(matches.map(m => replacer(m[0], ...m.slice(1))));
  let i = 0;
  return str.replace(regex, () => results[i++]);
}

// ============================================================================
// State Management
// ============================================================================

const commandStates = new Map<string, CommandState>();

export function getState(sessionID: string): CommandState | undefined {
  return commandStates.get(sessionID);
}

export function setState(sessionID: string, state: CommandState): void {
  commandStates.set(sessionID, state);
}

export function deleteState(sessionID: string): void {
  commandStates.delete(sessionID);
}

// ============================================================================
// Plugin
// ============================================================================

export const LiterateCommandsPlugin = async (ctx: any) => {
  console.log('[LiterateCommands] Plugin initialized');
  
  return {
    // Intercept command execution
    "command.execute.before": async (input: any, output: any) => {
      const { command, sessionID, arguments: args } = input;
      console.log(`[LiterateCommands] Intercepting command: ${command} with args: ${args}`);
      
      // Try to load command markdown
      const commandPath = `.opencode/commands/${command}.md`;
      let content: string;
      
      try {
        const file = Bun.file(commandPath);
        if (await file.exists()) {
          content = await file.text();
        } else {
          console.log(`[LiterateCommands] Command file not found: ${commandPath}`);
          return; // Let opencode handle normally
        }
      } catch (e) {
        console.error(`[LiterateCommands] Error loading command: ${e}`);
        return;
      }
      
      // Parse markdown into steps
      const steps = parseLiterateMarkdown(content);
      console.log(`[LiterateCommands] Parsed ${steps.length} steps:`, steps.map(s => s.config.step));
      
      if (steps.length === 0) {
        console.log('[LiterateCommands] No steps found in command');
        return;
      }
      
      // Initialize state
      const state: CommandState = {
        steps,
        currentStep: 0,
        variables: {},
        sessionID,
        commandName: command,
        arguments: args || '',
      };
      
      setState(sessionID, state);
      
      // Substitute variables in first step
      const firstPrompt = executeStep(state);
      if (firstPrompt) {
        // Inject prompt into output parts
        output.parts = [{
          type: 'text',
          text: firstPrompt,
        }];
        console.log(`[LiterateCommands] Injected step 0: ${state.steps[0].config.step}`);
      }
      
      // Abort normal execution - we control it now
      return { ...output, abort: true };
    },
    
    // Handle session idle - advance to next step
    event: async ({ event }: { event: { type: string; properties?: { sessionID?: string } } }) => {
      if (event.type !== 'session.idle') return;
      
      const sessionID = event.properties?.sessionID;
      if (!sessionID) return;
      
      const state = getState(sessionID);
      if (!state) return;
      
      console.log(`[LiterateCommands] Session idle: ${sessionID}, current step: ${state.currentStep}`);
      
      // Check if current step has a question - handle separately
      const currentStep = state.steps[state.currentStep];
      if (currentStep?.config.question) {
        console.log('[LiterateCommands] Current step has question, waiting for user response');
        return;
      }
      
      // Advance to next step
      const nextStep = advanceStep(state);
      
      if (!nextStep) {
        console.log('[LiterateCommands] All steps complete, cleaning up');
        deleteState(sessionID);
        return;
      }
      
      // Inject next step prompt
      const prompt = substituteVariables(nextStep.prompt, state);
      console.log(`[LiterateCommands] Advancing to step: ${nextStep.config.step}`);
      
      // We can't directly inject here - we need to use a different mechanism
      // For now, just log it
    },
  };
};

// Default export for the plugin
export default LiterateCommandsPlugin;
