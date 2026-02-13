/**
 * @ref Resolver
 *
 * Resolves symbol references within TOON documents
 * @version 1.0.0
 */

import type { ParsedSymbol } from './parser';

/**
 * Resolved reference interface
 */
export interface ResolvedReference {
  from: {
    symbol: string;
    line: number;
  };
  to: {
    symbol: string;
    line: number;
    type: string;
  };
}

/**
 * Circular chain interface
 */
export interface CircularChain {
  symbols: string[];
  path: ResolvedReference[];
  cycleDetectedAt: number; // Line number where cycle was detected
}

/**
 * Resolved document interface
 */
export interface ResolvedDocument {
  document: any;
  resolved: boolean;
  resolvedRefs: Map<string, ResolvedReference>;
  unresolvedRefs: string[];
  cycles: CircularChain[];
  resolvedPaths?: string[];
}

/**
 * Symbol table interface
 */
export interface SymbolTable {
  has(symbol: string): boolean;
  get(symbol: string): ParsedSymbol | undefined;
  getAll(): Map<string, ParsedSymbol>;
  size(): number;
}

/**
 * Resolver options interface
 */
export interface ResolverOptions {
  maxDepth?: number;             // Default: 100
  allowExternalRefs?: boolean;    // Default: false
}

/**
 * Symbol table implementation
 */
class SymbolTableImpl implements SymbolTable {
  constructor(private symbols: Map<string, ParsedSymbol>) {}

  has(symbol: string): boolean {
    return this.symbols.has(symbol);
  }

  get(symbol: string): ParsedSymbol | undefined {
    return this.symbols.get(symbol);
  }

  getAll(): Map<string, ParsedSymbol> {
    return new Map(this.symbols);
  }

  size(): number {
    return this.symbols.size;
  }
}

/**
 * @ref Resolver class
 * Resolves symbol references within TOON documents
 */
export class RefResolver {
  private readonly MAX_REF_DEPTH = 100;
  private options: Required<ResolverOptions>;

  constructor(options?: ResolverOptions) {
    this.options = {
      maxDepth: options?.maxDepth || 100,
      allowExternalRefs: options?.allowExternalRefs || false
    };
  }

  /**
   * Resolve all @ref references in document
   * @param document - Parsed TOON document
   * @param symbols - Symbol table from parser
   * @returns Document with resolved references
   */
  resolve(
    document: any,
    symbols: Map<string, ParsedSymbol>
  ): ResolvedDocument {
    const symbolTable = this.buildSymbolTable(symbols);
    const resolvedRefs = new Map<string, ResolvedReference>();
    const unresolvedRefs: string[] = [];

    // Resolve all references
    this.resolveReferences(document, symbolTable, resolvedRefs, unresolvedRefs);

    // Detect cycles
    const cycles = this.detectCycles(document, symbols);

    // Build resolved paths
    const resolvedPaths = Array.from(resolvedRefs.keys());

    return {
      document,
      resolved: unresolvedRefs.length === 0,
      resolvedRefs,
      unresolvedRefs,
      cycles,
      resolvedPaths
    };
  }

  /**
   * Detect circular reference chains
   * @param document - Document with references
   * @param symbols - Optional symbols Map for finding symbol content
   * @returns List of circular chains found
   */
  detectCycles(document: any, symbols?: Map<string, ParsedSymbol>): CircularChain[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const cycles: CircularChain[] = [];
    const path: string[] = [];

    const visit = (symbol: string, depth: number = 0): void => {
      // Prevent infinite loops and excessive depth
      if (depth > this.options.maxDepth) {
        return;
      }

      if (visiting.has(symbol)) {
        // Found a cycle
        const cycleStart = path.indexOf(symbol);
        if (cycleStart !== -1) {
          const cycleSymbols = path.slice(cycleStart);
          cycles.push({
            symbols: [...cycleSymbols, symbol],
            path: this.buildPath(cycleSymbols, symbol),
            cycleDetectedAt: this.findLineNumber(document, symbol)
          });
        }
        return;
      }

      if (visited.has(symbol)) {
        return; // Already processed, no cycle here
      }

      visiting.add(symbol);
      path.push(symbol);

      // Visit references
      const refs = this.getReferences(symbol, document, symbols);
      for (const ref of refs) {
        visit(ref, depth + 1);
      }

      visiting.delete(symbol);
      visited.add(symbol);
      path.pop();
    };

    // Start DFS from each symbol
    // Use symbols Map keys if available, otherwise extract from document
    let allSymbols: string[] = [];
    if (symbols && symbols.size > 0) {
      allSymbols = Array.from(symbols.keys());
    } else {
      allSymbols = this.extractAllSymbols(document);
    }

    for (const symbol of allSymbols) {
      if (!visited.has(symbol)) {
        visit(symbol);
      }
    }

    return cycles;
  }

  /**
   * Build symbol table from parsed symbols
   * @param symbols - Parsed symbols
   * @returns Symbol table for lookups
   */
  buildSymbolTable(symbols: Map<string, ParsedSymbol>): SymbolTable {
    return new SymbolTableImpl(new Map(symbols));
  }

  /**
   * Extract @ref references from text string
   * @param text - Text to extract references from
   * @returns Array of reference symbols (without @ref: prefix)
   */
  extractReferences(text: string): string[] {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const refs: string[] = [];
    // Match both @ref:name and @ref(name) formats
    const regex = /@ref[:\(]([a-zA-Z0-9_-]+)\)?/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      refs.push(match[1]);
    }

    return refs;
  }

  /**
   * Extract @ref references from object values
   * @param obj - Object to extract references from
   * @returns Array of reference symbols
   */
  extractObjectReferences(obj: any): string[] {
    const refs = new Set<string>();

    const extractFromValue = (value: any): void => {
      if (!value) return;

      if (typeof value === 'string' && (value.startsWith('@ref:') || value.startsWith('@ref('))) {
        // Match both @ref:name and @ref(name) formats
        const regex = /@ref[:\(]([a-zA-Z0-9_-]+)\)?/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(value)) !== null) {
          refs.add(match[1]);
        }
      } else if (Array.isArray(value)) {
        for (const item of value) {
          extractFromValue(item);
        }
      } else if (typeof value === 'object' && value !== null) {
        for (const v of Object.values(value)) {
          extractFromValue(v);
        }
      }
    };

    extractFromValue(obj);
    return Array.from(refs);
  }

  /**
   * Resolve references in document
   * @param document - Document to resolve
   * @param symbolTable - Available symbols
   * @param resolvedRefs - Map to store resolved references
   * @param unresolvedRefs - Array to store unresolved references
   */
  private resolveReferences(
    document: any,
    symbolTable: SymbolTable,
    resolvedRefs: Map<string, ResolvedReference>,
    unresolvedRefs: string[]
  ): void {
    const refs = this.extractAllReferences(document);

    for (const ref of refs) {
      const symbol = ref.symbol;

      if (symbolTable.has(symbol)) {
        const targetSymbol = symbolTable.get(symbol)!;
        resolvedRefs.set(`@ref:${symbol}`, {
          from: {
            symbol: ref.refName, // The @ref name (e.g., "phases")
            line: ref.line
          },
          to: {
            symbol: symbol,
            line: targetSymbol.line,
            type: targetSymbol.type
          }
        });
      } else {
        if (!unresolvedRefs.includes(symbol)) {
          unresolvedRefs.push(symbol);
        }
      }
    }
  }

  /**
   * Extract all @ref references from document
   * @param document - Document to extract from
   * @returns Array of extracted references
   */
  private extractAllReferences(document: any): ExtractedReference[] {
    const refs: ExtractedReference[] = [];

    const extractFromObject = (obj: any, path: string = ''): void => {
      if (!obj || typeof obj !== 'object') {
        return;
      }

      for (const [key, value] of Object.entries(obj)) {
        const fieldPath = path ? `${path}.${key}` : key;

        if (typeof value === 'string' && (value.startsWith('@ref:') || value.startsWith('@ref('))) {
          // Match both @ref:name and @ref(name) formats
          const regex = /@ref[:\(]([a-zA-Z0-9_-]+)\)?/;
          const match = value.match(regex);
          if (match) {
            const symbol = match[1];
            const lineNumber = this.findLineNumber(document, symbol) || 0;

            refs.push({
              refName: key, // The field name (e.g., "phases")
              symbol: symbol, // The symbol being referenced
              path: fieldPath,
              line: lineNumber
            });
          }
        } else if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === 'string' && (item.startsWith('@ref:') || item.startsWith('@ref('))) {
              const regex = /@ref[:\(]([a-zA-Z0-9_-]+)\)?/;
              const match = item.match(regex);
              if (match) {
                const symbol = match[1];
                refs.push({
                  refName: key,
                  symbol: symbol,
                  path: fieldPath,
                  line: 0 // Can't determine exact line for arrays
                });
              }
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          extractFromObject(value, fieldPath);
        }
      }
    };

    extractFromObject(document);
    return refs;
  }

  /**
   * Get references for a specific symbol
   * @param symbol - Symbol name
   * @param document - Document to search
   * @param symbols - Optional symbols Map for finding symbol content
   * @returns Array of referenced symbols
   */
  private getReferences(symbol: string, document: any, symbols?: Map<string, ParsedSymbol>): string[] {
    const refs: string[] = [];

    // Find where this symbol is defined and extract its @refs
    const extractRefsFromValue = (value: any): void => {
      if (!value) return;

      if (typeof value === 'string') {
        // Match both @ref:name and @ref(name) formats anywhere in the string
        const regex = /@ref[:\(]([a-zA-Z0-9_-]+)\)?/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(value)) !== null) {
          const refSymbol = match[1];
          if (refSymbol !== symbol) {
            refs.push(refSymbol);
          }
        }
      } else if (Array.isArray(value)) {
        for (const item of value) {
          extractRefsFromValue(item);
        }
      } else if (typeof value === 'object') {
        for (const v of Object.values(value)) {
          extractRefsFromValue(v);
        }
      }
    };

    // First try to find symbol content from symbols Map
    if (symbols) {
      const parsedSymbol = symbols.get(symbol);
      if (parsedSymbol && parsedSymbol.content) {
        extractRefsFromValue(parsedSymbol.content);
        return refs;
      }
    }

    // Otherwise look for symbol content in document
    const findSymbolContent = (obj: any, depth = 0): void => {
      if (depth > 10 || !obj) return; // Limit search depth

      for (const [key, value] of Object.entries(obj)) {
        if (key === symbol && typeof value === 'object') {
          extractRefsFromValue(value);
        } else if (typeof value === 'object' && value !== null) {
          findSymbolContent(value, depth + 1);
        }
      }
    };

    findSymbolContent(document);
    return refs;
  }

  /**
   * Extract all symbol names from document
   * @param document - Document to extract from
   * @returns Array of symbol names
   */
  private extractAllSymbols(document: any): string[] {
    const symbols = new Set<string>();

    const extractSymbolsFromValue = (value: any, key?: string): void => {
      if (!value) return;

      if (typeof value === 'string') {
        // Extract symbols from @ref references (both formats)
        const regex = /@ref[:\(]([a-zA-Z0-9_-]+)\)?/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(value)) !== null) {
          symbols.add(match[1]);
        }
        // Also extract from the old @ref: format
        if (value.startsWith('@ref:')) {
          symbols.add(value.substring(5));
        }
      } else if (Array.isArray(value)) {
        for (const item of value) {
          extractSymbolsFromValue(item);
        }
      } else if (typeof value === 'object' && value !== null) {
        for (const [k, v] of Object.entries(value)) {
          // Add object keys as potential symbols (except common metadata fields)
          if (k !== 'name' && k !== 'type' && k !== 'description' && k !== 'version') {
            symbols.add(k);
          }
          extractSymbolsFromValue(v, k);
        }
      }
    };

    extractSymbolsFromValue(document);
    return Array.from(symbols);
  }

  /**
   * Build path from symbols
   * @param symbols - Array of symbols in path
   * @param lastSymbol - Last symbol in cycle
   * @returns Array of resolved references
   */
  private buildPath(symbols: string[], lastSymbol: string): ResolvedReference[] {
    const path: ResolvedReference[] = [];

    for (let i = 0; i < symbols.length; i++) {
      const current = symbols[i];
      const next = symbols[i + 1] || lastSymbol;

      path.push({
        from: { symbol: current, line: 0 },
        to: { symbol: next, line: 0, type: 'reference' }
      });
    }

    return path;
  }

  /**
   * Find line number for symbol (best effort)
   * @param document - Document to search
   * @param symbol - Symbol name to find
   * @returns Line number or 0
   */
  private findLineNumber(document: any, symbol: string): number {
    // This is a best-effort implementation
    // In a real scenario, we'd track line numbers during parsing
    return 0;
  }
}

/**
 * Extracted reference interface (internal)
 */
interface ExtractedReference {
  refName: string;
  symbol: string;
  path: string;
  line: number;
}

/**
 * Default resolver instance
 */
let defaultResolver: RefResolver | null = null;

/**
 * Get or create default resolver instance
 * @returns RefResolver instance
 */
export function getResolver(): RefResolver {
  if (!defaultResolver) {
    defaultResolver = new RefResolver();
  }
  return defaultResolver;
}

/**
 * Resolve references in document using default resolver
 * @param document - Document with @ref references
 * @param symbols - Symbol table
 * @returns Resolution result
 */
export function resolveRefs(
  document: any,
  symbols: Map<string, ParsedSymbol>
): ResolvedDocument {
  return getResolver().resolve(document, symbols);
}

/**
 * Detect circular references in document using default resolver
 * @param document - Document to check for cycles
 * @returns Array of circular chains found
 */
export function detectCycles(document: any, symbols?: Map<string, ParsedSymbol>): CircularChain[] {
  return getResolver().detectCycles(document, symbols);
}
