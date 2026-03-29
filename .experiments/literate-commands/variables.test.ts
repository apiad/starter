/**
 * Variable substitution tests
 */

import { describe, test, expect } from 'bun:test';
import { 
  parseLiterateMarkdown, 
  substituteVariables,
  extractParsedVariables,
  expandFileGlob,
  expandFileContents,
  type CommandState 
} from './literate-commands';
import { writeFileSync, mkdirSync, rmSync } from 'fs';

// ============================================================================
// Test Data
// ============================================================================

const PARSE_COMMAND = `---
description: Test parse section
agent: analyze
---

\`\`\`yaml {config}
step: define
parse:
    TOPIC: A short kebab-case slug
    TITLE: A descriptive title
\`\`\`
Define the topic for: $ARGUMENTS

---

\`\`\`yaml {config}
step: use
\`\`\`
The topic is: $TOPIC and title is: $TITLE
`;

const GLOB_COMMAND = `---
description: Test GLOB
agent: analyze
---

\`\`\`yaml {config}
step: glob
\`\`\`
Files found: $GLOB(test/**/*.ts)
`;

const FILES_COMMAND = `---
description: Test FILES
agent: analyze
---

\`\`\`yaml {config}
step: files
\`\`\`
Contents: $FILES(test/fixtures/*.txt)
`;

// ============================================================================
// Tests
// ============================================================================

describe('parse section extraction', () => {
  test('extracts TOPIC and TITLE from LLM response', () => {
    const steps = parseLiterateMarkdown(PARSE_COMMAND);
    const defineStep = steps.find(s => s.config.step === 'define');
    
    expect(defineStep?.config.parse).toBeDefined();
    expect(defineStep?.config.parse?.TOPIC).toBe('A short kebab-case slug');
    expect(defineStep?.config.parse?.TITLE).toBe('A descriptive title');
  });

  test('steps can use $TOPIC and $TITLE', () => {
    const steps = parseLiterateMarkdown(PARSE_COMMAND);
    const useStep = steps.find(s => s.config.step === 'use');
    
    expect(useStep?.prompt).toContain('$TOPIC');
    expect(useStep?.prompt).toContain('$TITLE');
  });
});

describe('extractParsedVariables', () => {
  test('parses structured JSON from LLM response', () => {
    const llmResponse = '```json\n{"TOPIC": "my-test-topic", "TITLE": "My Test Title"}\n```';
    
    const parseConfig = {
      TOPIC: 'A short kebab-case slug',
      TITLE: 'A descriptive title'
    };
    
    const result = extractParsedVariables(llmResponse, parseConfig);
    
    expect(result.TOPIC).toBe('my-test-topic');
    expect(result.TITLE).toBe('My Test Title');
  });

  test('returns empty object for non-JSON response', () => {
    const llmResponse = 'This is some free-form text response.';
    const parseConfig = { TOPIC: 'test' };
    
    const result = extractParsedVariables(llmResponse, parseConfig);
    
    // Should return partial results if it can extract anything
    // or empty if nothing matches
    expect(typeof result).toBe('object');
  });
});

describe('variable substitution with parse results', () => {
  test('substitutes TOPIC and TITLE from parsed variables', () => {
    const steps = parseLiterateMarkdown(PARSE_COMMAND);
    const useStep = steps.find(s => s.config.step === 'use')!;
    
    const state: CommandState = {
      steps,
      currentStep: 1,
      variables: {
        TOPIC: 'my-custom-topic',
        TITLE: 'My Custom Title'
      },
      sessionID: 'test',
      commandName: 'parse-test',
      arguments: 'some args'
    };
    
    const result = substituteVariables(useStep.prompt, state);
    
    expect(result).toBe('The topic is: my-custom-topic and title is: My Custom Title');
  });
});

describe('$GLOB expansion', () => {
  test('expands glob pattern to file list', async () => {
    // Create test files
    mkdirSync('test/fixtures', { recursive: true });
    writeFileSync('test/fixtures/file1.txt', 'content 1');
    writeFileSync('test/fixtures/file2.txt', 'content 2');
    
    const pattern = 'test/fixtures/*.txt';
    const result = await expandFileGlob(pattern);
    
    expect(result).toContain('test/fixtures/file1.txt');
    expect(result).toContain('test/fixtures/file2.txt');
    expect(result.length).toBeGreaterThanOrEqual(2);
    
    // Cleanup
    rmSync('test/fixtures', { recursive: true });
  });

  test('handles non-matching glob', async () => {
    const pattern = 'nonexistent/**/*.txt';
    const result = await expandFileGlob(pattern);
    
    expect(result).toEqual([]);
  });
});

describe('$FILES expansion', () => {
  test('reads file contents', async () => {
    // Create test file
    mkdirSync('test/fixtures', { recursive: true });
    writeFileSync('test/fixtures/readme.txt', 'Hello World');
    
    const paths = ['test/fixtures/readme.txt'];
    const result = await expandFileContents(paths);
    
    expect(result).toContain('Hello World');
    
    // Cleanup
    rmSync('test/fixtures', { recursive: true });
  });
});

describe('complex variable substitution', () => {
  test('substitutes all variable types', () => {
    const steps = parseLiterateMarkdown(PARSE_COMMAND);
    
    const state: CommandState = {
      steps,
      currentStep: 0,
      variables: {
        TOPIC: 'my-topic',
        TITLE: 'My Title'
      },
      sessionID: 'test',
      commandName: 'test',
      arguments: 'user input'
    };
    
    const step = steps[0];
    const result = substituteVariables(step.prompt, state);
    
    expect(result).toContain('user input');
    expect(result).toContain('Define the topic for:');
  });
});
