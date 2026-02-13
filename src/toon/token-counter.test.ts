/**
 * Token Counter Tests
 *
 * Unit tests for tiktoken-based token counting
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TokenCounter, countTokens, compare } from './token-counter';

describe('TokenCounter', () => {
  describe('constructor', () => {
    it('should create instance with default encoding', () => {
      const counter = new TokenCounter();
      expect(counter).toBeDefined();
    });

    it('should create instance with custom encoding', () => {
      const counter = new TokenCounter({ encoding: 'cl100k_base' });
      expect(counter).toBeDefined();
    });
  });

  describe('countTokens', () => {
    let counter: TokenCounter;

    beforeEach(() => {
      counter = new TokenCounter();
    });

    afterEach(() => {
      counter.free();
    });

    it('should count tokens for simple text', () => {
      const text = 'Hello, world!';
      const count = counter.countTokens(text);
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThan(10);
    });

    it('should count tokens for TOON document', () => {
      const toon = `# TOON Document

## Document Overview

- name: "test"
- description: "A test document"
`;
      const count = counter.countTokens(toon);
      expect(count).toBeGreaterThan(0);
    });

    it('should count tokens for JSON document', () => {
      const json = JSON.stringify({
        name: 'test',
        description: 'A test document',
        version: '1.0.0',
      });
      const count = counter.countTokens(json);
      expect(count).toBeGreaterThan(0);
    });

    it('should count tokens for markdown document', () => {
      const md = `# Test Document

This is a test document with **bold** and *italic* text.

## Section 1

- Item 1
- Item 2
`;
      const count = counter.countTokens(md);
      expect(count).toBeGreaterThan(0);
    });

    it('should handle empty string', () => {
      const count = counter.countTokens('');
      expect(count).toBe(0);
    });

    it('should handle unicode characters', () => {
      const text = 'Hello 世界 🌍';
      const count = counter.countTokens(text);
      expect(count).toBeGreaterThan(0);
    });

    it('should handle code blocks', () => {
      const code = `
\`\`\`typescript
function hello(): string {
  return "Hello, world!";
}
\`\`\`
`;
      const count = counter.countTokens(code);
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('compare', () => {
    let counter: TokenCounter;

    beforeEach(() => {
      counter = new TokenCounter();
    });

    afterEach(() => {
      counter.free();
    });

    it('should compare TOON vs JSON token counts', () => {
      const toon = `# TOON Document

## Document Overview

- name: "test"
- description: "A test document"
- version: "1.0.0"
`;

      const json = JSON.stringify({
        name: 'test',
        description: 'A test document',
        version: '1.0.0',
      }, null, 2);

      const result = counter.compare(toon, json, '');

      expect(result.toonTokens).toBeGreaterThan(0);
      expect(result.jsonTokens).toBeGreaterThan(0);
      expect(result.savings).toBeDefined();
      expect(typeof result.savingsPercent).toBe('number');
    });

    it('should show TOON token savings', () => {
      const toon = '- name: "test"\n- value: "123"';
      const json = JSON.stringify({ name: 'test', value: 123 }, null, 2);

      const result = counter.compare(toon, json, '');

      // TOON should be more token-efficient
      expect(result.toonTokens).toBeLessThan(result.jsonTokens);
      expect(result.savingsPercent).toBeGreaterThan(0);
    });

    it('should compare all three formats', () => {
      const toon = '- name: "test"';
      const json = JSON.stringify({ name: 'test' });
      const md = '# Test\n\nName: test';

      const result = counter.compare(toon, json, md);

      expect(result.toonTokens).toBeDefined();
      expect(result.jsonTokens).toBeDefined();
      expect(result.markdownTokens).toBeDefined();
    });
  });

  describe('free', () => {
    it('should free encoding resources', () => {
      const counter = new TokenCounter();
      expect(() => counter.free()).not.toThrow();
    });
  });
});

describe('countTokens', () => {
  it('should count tokens using default instance', () => {
    const text = 'Hello, world!';
    const count = countTokens(text);
    expect(count).toBeGreaterThan(0);
  });
});

describe('compare', () => {
  it('should compare formats using default instance', () => {
    const toon = '- name: "test"';
    const json = JSON.stringify({ name: 'test' });
    const md = '# Test';

    const result = compare(toon, json, md);

    expect(result.toonTokens).toBeDefined();
    expect(result.jsonTokens).toBeDefined();
    expect(result.markdownTokens).toBeDefined();
  });
});
