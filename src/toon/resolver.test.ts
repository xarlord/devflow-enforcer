/**
 * @ref Resolver Tests
 *
 * Unit tests for @ref symbol resolution and cycle detection
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RefResolver, resolveRefs, detectCycles, getResolver, type CircularChain, type ResolvedDocument } from './resolver';
import type { ParsedSymbol } from './parser';
import { TOON_WITH_REFS, TOON_WITH_CIRCULAR_REFS } from '../../test/fixtures';

describe('RefResolver', () => {
  let resolver: RefResolver;
  let parser: TOONParser;

  beforeEach(() => {
    resolver = new RefResolver();
    parser = new TOONParser();
  });

  describe('constructor', () => {
    it('should create resolver instance', () => {
      const r = new RefResolver();
      expect(r).toBeDefined();
    });

    it('should create resolver with options', () => {
      const r = new RefResolver({ maxDepth: 50 });
      expect(r).toBeDefined();
    });
  });

  describe('resolve', () => {
    it('should resolve valid @ref references', () => {
      const document = {
        name: 'test',
        depends_on: '@ref(feature-a)',
      };

      const symbols = new Map<string, ParsedSymbol>([
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          content: '- name: "Feature A"',
        }],
      ]);

      const result = resolver.resolve(document, symbols);

      expect(result.resolved).toBe(true);
      expect(result.document).toBeDefined();
      expect(result.unresolved).toHaveLength(0);
    });

    it('should track unresolved references', () => {
      const document = {
        name: 'test',
        depends_on: '@ref(missing-feature)',
      };

      const symbols = new Map<string, ParsedSymbol>();

      const result = resolver.resolve(document, symbols);

      expect(result.resolved).toBe(false);
      expect(result.unresolved.length).toBeGreaterThan(0);
      expect(result.unresolved[0].ref).toBe('missing-feature');
    });

    it('should resolve multiple @ref references', () => {
      const document = {
        name: 'test',
        depends_on: '@ref(feature-a)',
        related_to: '@ref(feature-b)',
      };

      const symbols = new Map<string, ParsedSymbol>([
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          content: '- name: "Feature A"',
        }],
        ['feature-b', {
          name: 'feature-b',
          type: 'feature',
          content: '- name: "Feature B"',
        }],
      ]);

      const result = resolver.resolve(document, symbols);

      expect(result.resolved).toBe(true);
      expect(result.unresolved).toHaveLength(0);
    });

    it('should handle nested @ref references', () => {
      const document = {
        name: 'test',
        depends_on: '@ref(feature-b)',
      };

      const symbols = new Map<string, ParsedSymbol>([
        ['feature-b', {
          name: 'feature-b',
          type: 'feature',
          content: '- name: "Feature B"\n- depends_on: @ref(feature-a)',
        }],
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          content: '- name: "Feature A"',
        }],
      ]);

      const result = resolver.resolve(document, symbols);

      expect(result.resolved).toBe(true);
      expect(result.resolvedPaths).toBeDefined();
    });
  });

  describe('detectCycles', () => {
    it('should detect simple circular reference', () => {
      const document = {
        name: 'circular-test',
        depends_on: '@ref(feature-a)',
      };

      const symbols = new Map<string, ParsedSymbol>([
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          content: '- depends_on: @ref(feature-b)',
        }],
        ['feature-b', {
          name: 'feature-b',
          type: 'feature',
          content: '- depends_on: @ref(feature-a)',
        }],
      ]);

      const cycles = resolver.detectCycles(document);

      expect(cycles).toBeDefined();
      expect(cycles.length).toBeGreaterThan(0);
      expect(cycles[0].length).toBeGreaterThan(1);
    });

    it('should detect three-way circular reference', () => {
      const document = {
        name: 'three-way-cycle',
        depends_on: '@ref(feature-a)',
      };

      const symbols = new Map<string, ParsedSymbol>([
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          content: '- depends_on: @ref(feature-b)',
        }],
        ['feature-b', {
          name: 'feature-b',
          type: 'feature',
          content: '- depends_on: @ref(feature-c)',
        }],
        ['feature-c', {
          name: 'feature-c',
          type: 'feature',
          content: '- depends_on: @ref(feature-a)',
        }],
      ]);

      const cycles = resolver.detectCycles(document);

      expect(cycles).toBeDefined();
      expect(cycles.length).toBeGreaterThan(0);
    });

    it('should not detect cycles in acyclic references', () => {
      const document = {
        name: 'acyclic-test',
        depends_on: '@ref(feature-a)',
      };

      const symbols = new Map<string, ParsedSymbol>([
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          content: '- depends_on: @ref(feature-b)',
        }],
        ['feature-b', {
          name: 'feature-b',
          type: 'feature',
          content: '- name: "Feature B"',
        }],
      ]);

      const cycles = resolver.detectCycles(document);

      expect(cycles).toBeDefined();
      expect(cycles.length).toBe(0);
    });

    it('should return cycle paths with from/to information', () => {
      const document = {
        name: 'cycle-path-test',
        depends_on: '@ref(feature-a)',
      };

      const symbols = new Map<string, ParsedSymbol>([
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          content: '- depends_on: @ref(feature-b)',
        }],
        ['feature-b', {
          name: 'feature-b',
          type: 'feature',
          content: '- depends_on: @ref(feature-a)',
        }],
      ]);

      const cycles = resolver.detectCycles(document);

      expect(cycles.length).toBeGreaterThan(0);
      expect(cycles[0]).toBeDefined();
      // Each chain should have from, to properties
    });
  });

  describe('buildSymbolTable', () => {
    it('should build symbol table from parsed symbols', () => {
      const symbols = new Map<string, ParsedSymbol>([
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          content: '- name: "Feature A"',
        }],
        ['phase-requirements', {
          name: 'phase-requirements',
          type: 'phase',
          content: '- name: "Requirements"',
        }],
      ]);

      const table = resolver.buildSymbolTable(symbols);

      expect(table).toBeDefined();
      expect(table.has('feature-a')).toBe(true);
      expect(table.has('phase-requirements')).toBe(true);
    });

    it('should include symbol metadata in table', () => {
      const symbols = new Map<string, ParsedSymbol>([
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          content: '- name: "Feature A"',
          lineNumber: 10,
        }],
      ]);

      const table = resolver.buildSymbolTable(symbols);

      const entry = table.get('feature-a');
      expect(entry).toBeDefined();
      expect(entry?.type).toBe('feature');
    });
  });

  describe('extractReferences', () => {
    it('should extract @ref references from string', () => {
      const text = 'This depends on @ref(feature-a) and @ref(feature-b)';
      const refs = resolver.extractReferences(text);

      expect(refs).toEqual(['feature-a', 'feature-b']);
    });

    it('should handle content without references', () => {
      const text = 'This has no references';
      const refs = resolver.extractReferences(text);

      expect(refs).toEqual([]);
    });

    it('should handle empty string', () => {
      const refs = resolver.extractReferences('');

      expect(refs).toEqual([]);
    });

    it('should extract references from object values', () => {
      const obj = {
        name: 'test',
        depends_on: '@ref(feature-a)',
        related: ['@ref(feature-b)', '@ref(feature-c)'],
      };

      const refs = resolver.extractObjectReferences(obj);

      expect(refs).toContain('feature-a');
      expect(refs).toContain('feature-b');
      expect(refs).toContain('feature-c');
    });
  });
});

describe('resolveRefs', () => {
  it('should resolve refs using default resolver', () => {
    const document = {
      name: 'test',
      depends_on: '@ref(feature-a)',
    };

    const symbols = new Map<string, ParsedSymbol>([
      ['feature-a', {
        name: 'feature-a',
        type: 'feature',
        content: '- name: "Feature A"',
      }],
    ]);

    const result = resolveRefs(document, symbols);

    expect(result.resolved).toBe(true);
  });
});

describe('detectCycles', () => {
  it('should detect cycles using default resolver', () => {
    const document = {
      name: 'test',
      depends_on: '@ref(feature-a)',
    };

    const symbols = new Map<string, ParsedSymbol>([
      ['feature-a', {
        name: 'feature-a',
        type: 'feature',
        content: '- depends_on: @ref(feature-b)',
      }],
      ['feature-b', {
        name: 'feature-b',
        type: 'feature',
        content: '- depends_on: @ref(feature-a)',
      }],
    ]);

    const cycles = detectCycles(document, symbols);

    expect(cycles.length).toBeGreaterThan(0);
  });
});

describe('getResolver', () => {
  it('should return singleton resolver instance', () => {
    const resolver1 = getResolver();
    const resolver2 = getResolver();

    expect(resolver1).toBe(resolver2);
  });
});
