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

interface StepConfig {
  step: string;
  next?: string;
  parse?: Record<string, string>;
  question?: {
    title: string;
    options: Record<string, string>;
  };
  maxIter?: number;
  'max-iter'?: number; // YAML uses kebab-case
}

interface CodeBlock {
  language: string;
  meta: string[];
  code: string;
}

interface Step {
  config: StepConfig;
  prompt: string;
  codeBlocks: CodeBlock[];
}

interface CommandState {
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

function parseLiterateMarkdown(content: string): Step[] {
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

function parseStep(section: string): Step | null {
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

function substituteVariables(text: string, state: CommandState): string {
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

function executeStep(state: CommandState): string | null {
  if (state.currentStep >= state.steps.length) {
    return null; // All steps complete
  }

  const step = state.steps[state.currentStep];
  return substituteVariables(step.prompt, state);
}

function advanceStep(state: CommandState): Step | null {
  // Guard against empty steps
  if (!state.steps || state.steps.length === 0) {
    return null;
  }

  state.currentStep++;

  // Check for explicit next from previous step
  const prevIndex = state.currentStep - 1;
  if (prevIndex >= 0 && prevIndex < state.steps.length) {
    const currentStep = state.steps[prevIndex];
    if (currentStep?.config.next) {
      const nextIndex = state.steps.findIndex(s => s.config.step === currentStep.config.next);
      if (nextIndex !== -1) {
        state.currentStep = nextIndex;
      }
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
function extractParsedVariables(
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
async function expandFileGlob(pattern: string): Promise<string[]> {
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
async function expandFileContents(paths: string[]): Promise<string> {
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
async function expandVariables(text: string, state: CommandState): Promise<string> {
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
// Question & Routing
// ============================================================================

interface QuestionConfig {
  title: string;
  options: Record<string, string>; // "Yes" -> "collect", "No*" -> "refine"
}

/**
 * Parse question config from step config
 */
function parseQuestionConfig(config: StepConfig): QuestionConfig | null {
  if (!config.question) return null;

  return {
    title: config.question.title || 'Confirm?',
    options: config.question.options || {},
  };
}

/**
 * Route to next step based on user response
 * Handles both "No*" (editable) and "No" responses
 */
function routeFromQuestion(config: StepConfig, response: string): string | null {
  const question = parseQuestionConfig(config);
  if (!question) return null;

  // Normalize response (remove trailing * if present)
  const normalized = response.trim().replace(/\*$/, '');

  // Try exact match first
  if (question.options[normalized]) {
    return question.options[normalized];
  }

  // Try matching with * appended (for editable options)
  if (question.options[normalized + '*']) {
    return question.options[normalized + '*'];
  }

  // Try matching keys with * (option is editable)
  for (const [key, value] of Object.entries(question.options)) {
    if (key.endsWith('*') && normalized.startsWith(key.replace('*', ''))) {
      return value;
    }
  }

  return null;
}

/**
 * Check if step should loop (based on maxIter)
 */
function shouldLoopStep(config: StepConfig, currentIteration: number): boolean {
  const maxIter = config.maxIter || config['max-iter'];
  if (!maxIter) return false;
  return currentIteration < maxIter;
}

/**
 * Get the next step index based on routing
 */
function getNextStepIndex(
  steps: Step[],
  currentIndex: number,
  response?: string
): number | null {
  const current = steps[currentIndex];
  if (!current) return null;

  // Check if there's a question to route
  if (response !== undefined) {
    const routedStep = routeFromQuestion(current.config, response);
    if (routedStep) {
      const index = steps.findIndex(s => s.config.step === routedStep);
      if (index !== -1) return index;
    }
  }

  // Check for explicit next
  if (current.config.next) {
    const index = steps.findIndex(s => s.config.step === current.config.next);
    if (index !== -1) return index;
  }

  // Default: next sequential step
  const nextIndex = currentIndex + 1;
  if (nextIndex >= steps.length) return null;

  return nextIndex;
}

// ============================================================================
// Code Execution
// ============================================================================

interface CodeBlockMeta {
  type: 'exec' | 'subagent' | 'exec-subagent' | 'unknown';
  name: string | null;
  subagent: string | null;
}

/**
 * Parse code block metadata
 */
function parseCodeBlockMeta(meta: string[]): CodeBlockMeta {
  let type: CodeBlockMeta['type'] = 'unknown';
  let name: string | null = null;
  let subagent: string | null = null;

  for (const m of meta) {
    if (m === 'exec') {
      if (type === 'subagent') {
        type = 'exec-subagent';
      } else {
        type = 'exec';
      }
    } else if (m.startsWith('exec=')) {
      type = 'exec';
      name = m.replace('exec=', '');
    } else if (m.startsWith('subagent=')) {
      subagent = m.replace('subagent=', '');
      if (type === 'exec') {
        type = 'exec-subagent';
      } else {
        type = 'subagent';
      }
    } else if (m.startsWith('name=')) {
      name = m.replace('name=', '');
    }
  }

  return { type, name, subagent };
}

interface ExecutionResult {
  success: boolean;
  output: any;
  error?: string;
}

/**
 * Execute code and return result
 */
async function executeCode(
  language: string,
  code: string,
  input: any
): Promise<ExecutionResult> {
  try {
    if (language === 'javascript' || language === 'js') {
      return await executeJavaScript(code, input);
    } else if (language === 'python' || language === 'py') {
      return await executePython(code, input);
    } else {
      return {
        success: false,
        output: null,
        error: `Unsupported language: ${language}`,
      };
    }
  } catch (e) {
    return {
      success: false,
      output: null,
      error: String(e),
    };
  }
}

/**
 * Execute JavaScript code
 */
async function executeJavaScript(code: string, input: any): Promise<ExecutionResult> {
  try {
    // Create the wrapper code
    const wrapper = `
      ${code}
      try {
        const result = main(input);
        log(JSON.stringify({ success: true, result }));
      } catch (e) {
        log(JSON.stringify({ success: false, error: e.message }));
      }
    `;

    // Write to temp file and run
    const tempFile = `/tmp/literate_exec_${Date.now()}.js`;
    await Bun.write(tempFile, wrapper);

    const output = await Bun.$`node ${tempFile}`.text();

    // Cleanup
    await Bun.$`rm ${tempFile}`.nothrow();

    // Try to parse the JSON output
    const lines = output.trim().split('\n');
    const lastLine = lines[lines.length - 1];

    try {
      const parsed = JSON.parse(lastLine);
      return {
        success: parsed.success,
        output: parsed.result,
        error: parsed.error,
      };
    } catch {
      return {
        success: true,
        output: output,
      };
    }
  } catch (e) {
    return {
      success: false,
      output: null,
      error: String(e),
    };
  }
}

/**
 * Execute Python code
 */
async function executePython(code: string, input: any): Promise<ExecutionResult> {
  try {
    // Check if python is available
    const check = await Bun.$`which python3 || which python`.nothrow().text();
    if (!check.trim()) {
      return {
        success: false,
        output: null,
        error: 'Python not found',
      };
    }

    // Create a temp file with the code
    const wrapper = `import json
import sys

input_data = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}

${code}

if __name__ == "__main__":
    try:
        result = main(input_data)
        print(json.dumps({"success": True, "result": result}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
`;

    const tempFile = `/tmp/literate_exec_${Date.now()}.py`;
    await Bun.write(tempFile, wrapper);

    const inputJson = JSON.stringify(input);
    const output = await Bun.$`python3 ${tempFile} "${inputJson}"`.text();

    // Cleanup
    await Bun.$`rm ${tempFile}`.nothrow();

    // Try to parse the JSON output
    const lines = output.trim().split('\n');
    const lastLine = lines[lines.length - 1];

    try {
      const parsed = JSON.parse(lastLine);
      return {
        success: parsed.success,
        output: parsed.result,
        error: parsed.error,
      };
    } catch {
      return {
        success: true,
        output: output,
      };
    }
  } catch (e) {
    return {
      success: false,
      output: null,
      error: String(e),
    };
  }
}

/**
 * Extract input from structured LLM output
 */
function extractStructuredInput(llmResponse: string): any | null {
  // Look for JSON block
  const jsonMatch = llmResponse.match(/```(?:json)?\s*\n?({[\s\S]*?})\n?```/);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[1]);
  } catch {
    return null;
  }
}

/**
 * Run generator code and collect yields
 */
async function runGenerator(
  language: string,
  code: string,
  input: any
): Promise<string[]> {
  // For MVP, we'll use a simple approach:
  // Run the code with input, collect output
  // In production, this would need proper generator support

  if (language === 'javascript') {
    const wrapper = `${code}
const results = [];
const gen = collect(input);
if (gen[Symbol.iterator]) {
  for (const item of gen) {
    results.push(item);
  }
}
log(JSON.stringify(results));
`;

    const tempFile = `/tmp/literate_gen_${Date.now()}.js`;
    await Bun.write(tempFile, wrapper);

    try {
      const output = await Bun.$`node ${tempFile}`.text();
      await Bun.$`rm ${tempFile}`.nothrow();
      return JSON.parse(output.trim());
    } catch {
      await Bun.$`rm ${tempFile}`.nothrow();
      return [];
    }
  }

  // Python generator support would be similar
  return [];
}

// ============================================================================
// State Management
// ============================================================================

const commandStates = new Map<string, CommandState>();

// Store client reference for use in event handler
let pluginClient: any = null;

function getState(sessionID: string): CommandState | undefined {
  return commandStates.get(sessionID);
}

function setState(sessionID: string, state: CommandState): void {
  commandStates.set(sessionID, state);
}

function deleteState(sessionID: string): void {
  commandStates.delete(sessionID);
}

// ============================================================================
// Plugin
// ============================================================================

async function log(client, msg: string) {
  // console.log(msg);

  await client.app.log({
    body: {
      service: "literate-commands",
      level: "info",
      message: msg,
    },
  })
}

export const LiterateCommandsPlugin = async ({ client }) => {
  pluginClient = client; // Store for use in event handler
  await log(client, '[LiterateCommands] Plugin initialized');

  return {
    // Intercept command execution - just set up state, don't modify output
    "command.execute.before": async (input: any, output: any) => {
      const { command, sessionID, arguments: args } = input;
      await log(client, `[LiterateCommands] Intercepting command: ${command} with args: ${args}`);

      // Try to load command markdown
      const commandPath = `.opencode/commands/${command}.md`;
      let content: string;

      try {
        const file = Bun.file(commandPath);
        if (await file.exists()) {
          content = await file.text();
        } else {
          await log(client, `[LiterateCommands] Command file not found: ${commandPath}`);
          return; // Let opencode handle normally
        }
      } catch (e) {
        console.error(`[LiterateCommands] Error loading command: ${e}`);
        return;
      }

      // Check for literate: true in frontmatter
      const literateMatch = content.match(/^---\n([\s\S]*?)\n---/);
      let isLiterate = false;

      if (literateMatch) {
        try {
          const frontmatter = yaml.parse(literateMatch[1]);
          isLiterate = frontmatter?.literate === true;
        } catch (e) {
          // Ignore YAML parse errors
        }
      }

      if (!isLiterate) {
        await log(client, `[LiterateCommands] Command ${command} does not have literate: true, skipping`);
        return; // Let normal command execution happen
      }

      // Parse markdown into steps
      const steps = parseLiterateMarkdown(content);
      await log(client, `[LiterateCommands] Parsed ${steps.length} steps: ${steps.map(s => s.config.step)}`);

      if (steps.length === 0) {
        await log(client, '[LiterateCommands] No steps found in command');
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
      await log(client, `[LiterateCommands] State set up for ${state.steps[0].config.step}`);

      output.parts[0] = {type: "text", text: `We are preparing to run /${command} command. For now, just acknowledge and await for next instruction.`}
    },

    // Handle session idle - inject first step or advance to next
    event: async ({ event }: { event: { type: string; properties?: { sessionID?: string } } }) => {
      if (event.type !== 'session.idle') return;

      const sessionID = event.properties?.sessionID;
      if (!sessionID) return;

      const state = getState(sessionID);
      if (!state) return;

      await log(pluginClient, `[LiterateCommands] Session idle: ${sessionID}, current step: ${state.currentStep}`);

      // Get current step
      const currentStep = state.steps[state.currentStep];
      if (!currentStep) {
        await log(pluginClient, '[LiterateCommands] No more steps, cleaning up');
        deleteState(sessionID);
        return;
      }

      // Check if current step has a question - skip for now
      if (currentStep.config.question) {
        await log(pluginClient, '[LiterateCommands] Current step has question, waiting for user response');
        return;
      }

      // Inject current step's prompt
      const prompt = substituteVariables(currentStep.prompt, state);
      await log(pluginClient, `[LiterateCommands] Injecting step ${state.currentStep}: ${currentStep.config.step}`);

      // Inject prompt via promptAsync
      await pluginClient.session.promptAsync({
        path: { id: sessionID },
        body: {
          parts: [{ type: 'text', text: prompt }],
        },
      });

      // Advance to next step for next idle
      state.currentStep++;
    },
  };
};
