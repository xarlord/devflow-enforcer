/**
 * TOON Parser Tests
 *
 * Unit tests for TOON format parsing
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TOONParser, parseTOON, extractSymbols, getParser } from './parser';
import type { TOONParseResult, ParsedSymbol } from './types';
import {
  VALID_MINIMAL_TOON,
  VALID_COMPLETE_TOON,
  TOON_WITH_SYMBOLS,
  TOON_WITH_REFS,
  TOON_WITH_CIRCULAR_REFS,
  INVALID_VERSION_FORMAT,
  INVALID_DATE_FORMAT,
  EMPTY_TOON,
  MALFORMED_TOON,
} from '../../test/fixtures';

describe('TOONParser', () => {
  let parser: TOONParser;

  beforeEach(() => {
    parser = new TOONParser();
  });

  describe('constructor', () => {
    it('should create parser instance', () => {
      const p = new TOONParser();
      expect(p).toBeDefined();
    });

    it('should create parser with options', () => {
      const p = new TOONParser({ strictMode: true });
      expect(p).toBeDefined();
    });
  });

  describe('parse', () => {
    it('should parse a valid minimal TOON document', () => {
      const result = parser.parse(VALID_MINIMAL_TOON);

      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
      expect(result.document.name).toBe('test-minimal');
      expect(result.document.description).toBe('A minimal valid TOON document');
      expect(result.document.version).toBe('1.0.0');
      expect(result.document.status).toBe('draft');
    });

    it('should parse a complete TOON document', () => {
      const result = parser.parse(VALID_COMPLETE_TOON);

      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
      expect(result.document.name).toBe('test-complete');
      expect(result.document.tags).toEqual(['test', 'fixture', 'complete']);
    });

    it('should parse TOON document with symbols', () => {
      const result = parser.parse(TOON_WITH_SYMBOLS);

      expect(result.success).toBe(true);
      expect(result.symbols).toBeDefined();
      expect(result.symbols.size).toBeGreaterThan(0);
    });

    it('should extract symbol definitions correctly', () => {
      const result = parser.parse(TOON_WITH_SYMBOLS);

      expect(result.success).toBe(true);
      expect(result.symbols.has('phase-requirements')).toBe(true);
      expect(result.symbols.has('phase-architecture')).toBe(true);
      expect(result.symbols.has('feature-parser')).toBe(true);
    });

    it('should parse nested sections correctly', () => {
      const toon = `# TOON Document

## Document Overview

- name: "test-nested"
- description: "Test nested sections"

## Features

### High Priority

- name: "Feature A"
- priority: "high"
`;

      const result = parser.parse(toon);

      expect(result.success).toBe(true);
      expect(result.sections).toBeDefined();
    });

    it('should handle empty document', () => {
      const result = parser.parse(EMPTY_TOON);

      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
    });

    it('should handle malformed document with errors', () => {
      const result = parser.parse(MALFORMED_TOON);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should track line numbers for error reporting', () => {
      const result = parser.parse(MALFORMED_TOON);

      if (!result.success && result.errors.length > 0) {
        expect(result.errors[0].line).toBeDefined();
        expect(result.errors[0].line).toBeGreaterThan(0);
      }
    });

    it('should count tokens in parsed document', () => {
      const result = parser.parse(VALID_MINIMAL_TOON);

      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.tokens).toBeGreaterThan(0);
    });

    it('should extract @ref references from content', () => {
      const result = parser.parse(TOON_WITH_REFS);

      expect(result.success).toBe(true);
      expect(result.references).toBeDefined();
      expect(result.references.length).toBeGreaterThan(0);
    });
  });

  describe('extractSymbols', () => {
    it('should extract symbol definitions from TOON content', () => {
      const symbols = parser.extractSymbols(TOON_WITH_SYMBOLS);

      expect(symbols).toBeDefined();
      expect(symbols.size).toBe(5);
      expect(symbols.has('phase-requirements')).toBe(true);
      expect(symbols.has('phase-architecture')).toBe(true);
      expect(symbols.has('feature-parser')).toBe(true);
      expect(symbols.has('user-story-parse')).toBe(true);
    });

    it('should extract symbol metadata', () => {
      const symbols = parser.extractSymbols(TOON_WITH_SYMBOLS);

      const phaseSymbol = symbols.get('phase-requirements');
      expect(phaseSymbol).toBeDefined();
      expect(phaseSymbol?.name).toBe('phase-requirements');
      expect(phaseSymbol?.type).toBe('phase');
      expect(phaseSymbol?.lineNumber).toBeDefined();
    });

    it('should extract symbol content', () => {
      const symbols = parser.extractSymbols(TOON_WITH_SYMBOLS);

      const featureSymbol = symbols.get('feature-parser');
      expect(featureSymbol).toBeDefined();
      expect(featureSymbol?.content).toBeDefined();
      expect(typeof featureSymbol?.content).toBe('string');
    });

    it('should return empty map for content without symbols', () => {
      const symbols = parser.extractSymbols(VALID_MINIMAL_TOON);

      expect(symbols).toBeDefined();
      expect(symbols.size).toBe(0);
    });
  });

  describe('validateStructure', () => {
    it('should validate correct TOON structure', () => {
      const result = parser.validateStructure(VALID_MINIMAL_TOON);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing document overview section', () => {
      const invalidToon = `# TOON Document

## Some Other Section

- name: "test"
`;

      const result = parser.validateStructure(invalidToon);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect missing required fields', () => {
      const invalidToon = `# TOON Document

## Document Overview

- name: "test"
`;

      const result = parser.validateStructure(invalidToon);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('parseField', () => {
    it('should parse simple text field', () => {
      const line = '- name: "test-document"';
      const result = parser.parseField(line);

      expect(result).toBeDefined();
      expect(result.key).toBe('name');
      expect(result.value).toBe('test-document');
    });

    it('should parse field with number value', () => {
      const line = '- effort: "2 weeks"';
      const result = parser.parseField(line);

      expect(result.key).toBe('effort');
      expect(result.value).toBe('2 weeks');
    });

    it('should parse array field', () => {
      const line = '- tags: [test, fixture]';
      const result = parser.parseField(line);

      expect(result.key).toBe('tags');
      expect(result.value).toEqual(['test', 'fixture']);
    });
  });
});

describe('parseTOON', () => {
  it('should parse TOON using default parser', () => {
    const result = parseTOON(VALID_MINIMAL_TOON);

    expect(result.success).toBe(true);
    expect(result.document).toBeDefined();
  });
});

describe('extractSymbols', () => {
  it('should extract symbols using default parser', () => {
    const symbols = extractSymbols(TOON_WITH_SYMBOLS);

    expect(symbols).toBeDefined();
    expect(symbols.size).toBeGreaterThan(0);
  });
});

describe('getParser', () => {
  it('should return singleton parser instance', () => {
    const parser1 = getParser();
    const parser2 = getParser();

    expect(parser1).toBe(parser2);
  });
});
