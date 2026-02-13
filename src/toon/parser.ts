/**
 * TOON Parser
 *
 * Parses .toon.md files into TypeScript objects
 * @version 1.0.0
 */

import { countTokens } from './token-counter';

/**
 * Parse error interface
 */
export interface ParseError {
  code: string;
  message: string;
  line: number;
  column?: number;
}

/**
 * Parse warning interface
 */
export interface ParseWarning {
  code: string;
  message: string;
  line: number;
}

/**
 * Symbol location interface
 */
export interface SymbolLocation {
  symbol: string;
  line: number;
  type: 'phase' | 'feature' | 'user-story' | 'acceptance-criteria' | 'document' | 'timeline' | 'release';
}

/**
 * Parsed symbol interface
 */
export interface ParsedSymbol extends SymbolLocation {
  value?: any;
  children?: ParsedSymbol[];
}

/**
 * TOON parse result interface
 */
export interface TOONParseResult {
  document: any;
  symbols: Map<string, ParsedSymbol>;
  metadata: {
    lineCount: number;
    tokenCount: number;
    parsedAt: string;
  };
  errors: ParseError[];
  warnings: ParseWarning[];
}

/**
 * Document header interface
 */
interface DocumentHeader {
  title?: string;
  name?: string;
  description?: string;
  version?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
}

/**
 * Section interface
 */
interface Section {
  type: string;
  level: number;
  title: string;
  symbol?: string;
  line: number;
  content: any;
}

/**
 * Parser options interface
 */
export interface ParserOptions {
  maxFileSize?: number;
  maxDepth?: number;
  strictMode?: boolean;
}

/**
 * Structure validation result interface
 */
export interface StructureValidationResult {
  valid: boolean;
  errors: ParseError[];
  warnings: ParseWarning[];
}

/**
 * TOON Parser class
 * Parses TOON markdown files into structured objects
 */
export class TOONParser {
  private options: Required<ParserOptions>;

  constructor(options?: ParserOptions) {
    this.options = {
      maxFileSize: options?.maxFileSize || 100 * 1024, // 100KB default
      maxDepth: options?.maxDepth || 100,
      strictMode: options?.strictMode !== false
    };
  }

  /**
   * Parse TOON document content into TypeScript objects
   * @param content - The .toon.md file content
   * @returns Parsed TOON document with metadata
   * @throws ParseError if document is malformed
   */
  parse(content: string): TOONParseResult {
    const errors: ParseError[] = [];
    const warnings: ParseWarning[] = [];

    // Check file size
    if (content.length > this.options.maxFileSize) {
      errors.push({
        code: 'FILE_TOO_LARGE',
        message: `File size ${content.length} exceeds maximum ${this.options.maxFileSize}`,
        line: 0
      });
      return this.createErrorResult(errors, warnings);
    }

    const lines = content.split('\n');

    // Extract document header
    const header = this.parseHeader(lines, errors, warnings);

    // Extract symbols
    const symbols = this.extractSymbols(content, lines);

    // Parse sections
    const sections = this.parseSections(lines, symbols, errors, warnings);

    // Build document object
    const document = this.buildDocument(header, sections);

    // Count tokens
    const tokenCount = countTokens(content);

    return {
      document,
      symbols,
      metadata: {
        lineCount: lines.length,
        tokenCount,
        parsedAt: new Date().toISOString()
      },
      errors,
      warnings
    };
  }

  /**
   * Extract all symbol definitions from document
   * @param content - The .toon.md file content
   * @param lines - Split content lines
   * @returns Map of symbol names to their locations
   */
  extractSymbols(content: string, lines: string[]): Map<string, ParsedSymbol> {
    const symbols = new Map<string, ParsedSymbol>();
    const symbolRegex = /^## Symbol: (\S+)$/m;

    let match: RegExpExecArray | null;
    while ((match = symbolRegex.exec(content)) !== null) {
      const symbol = match[1];
      const lineNumber = content.substring(0, match.index).split('\n').length;

      // Detect symbol type from context
      const type = this.detectSymbolType(lines, lineNumber);

      symbols.set(symbol, {
        symbol,
        line: lineNumber + 1,
        type
      });
    }

    return symbols;
  }

  /**
   * Validate document structure before parsing
   * @param content - The .toon.md file content
   * @returns Validation result with any errors
   */
  validateStructure(content: string): StructureValidationResult {
    const errors: ParseError[] = [];
    const warnings: ParseWarning[] = [];

    // Check for document header
    if (!content.includes('#')) {
      errors.push({
        code: 'NO_HEADER',
        message: 'Document must have a header (#)',
        line: 0
      });
    }

    // Check for document overview section
    if (!content.includes('## Document Overview')) {
      warnings.push({
        code: 'NO_OVERVIEW',
        message: 'Document should have "## Document Overview" section',
        line: 0
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Parse document header from lines
   * @param lines - Content lines
   * @param errors - Errors array to populate
   * @param warnings - Warnings array to populate
   * @returns Parsed header object
   */
  private parseHeader(
    lines: string[],
    errors: ParseError[],
    warnings: ParseWarning[]
  ): DocumentHeader {
    const header: DocumentHeader = {};

    let inOverview = false;
    let bulletDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Detect Document Overview section
      if (line.startsWith('##') && line.toLowerCase().includes('overview')) {
        inOverview = true;
        continue;
      }

      // Exit overview when next section starts
      if (inOverview && line.startsWith('##') && !line.toLowerCase().includes('overview')) {
        break;
      }

      // Parse bullet items in overview
      if (inOverview && line.startsWith('-')) {
        const match = this.matchBulletItem(line);
        if (match) {
          const key = match.key.toLowerCase().replace(/-/g, '_');

          if (match.key === 'name') header.name = match.value;
          else if (match.key === 'description') header.description = match.value;
          else if (match.key === 'version') header.version = match.value;
          else if (match.key === 'status') header.status = match.value;
          else if (match.key === 'created_at') header.created_at = match.value;
          else if (match.key === 'updated_at') header.updated_at = match.value;
          else if (match.key === 'tags') header.tags = this.parseArrayValue(match.value);
        }
      }
    }

    // Validate required fields
    if (this.options.strictMode && !header.name) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Document name is required',
        line: 0
      });
    }

    return header;
  }

  /**
   * Parse sections from content
   * @param lines - Content lines
   * @param symbols - Extracted symbols
   * @param errors - Errors array to populate
   * @param warnings - Warnings array to populate
   * @returns Array of parsed sections
   */
  private parseSections(
    lines: string[],
    symbols: Map<string, ParsedSymbol>,
    errors: ParseError[],
    warnings: ParseWarning[]
  ): Section[] {
    const sections: Section[] = [];
    let currentSection: Section | null = null;
    let content: any = {};
    let bulletDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Detect section header
      if (trimmed.startsWith('#')) {
        // Save previous section
        if (currentSection) {
          currentSection.content = content;
          sections.push(currentSection);
        }

        // Start new section
        const level = trimmed.match(/^#+/g)?.[0].length || 1;
        const title = trimmed.replace(/^#+\s*/, '');

        currentSection = {
          type: this.detectSectionType(title),
          level,
          title,
          symbol: this.extractSymbolName(title),
          line: i + 1,
          content: {}
        };
        content = {};
        bulletDepth = 0;
        continue;
      }

      // Parse bullet items
      if (trimmed.startsWith('-')) {
        const newDepth = line.search(/\S/);
        bulletDepth = newDepth;

        const match = this.matchBulletItem(trimmed);
        if (match && currentSection) {
          const key = match.key.toLowerCase().replace(/-/g, '_');
          const value = this.parseValue(match.value);

          // Build nested structure for bullets
          this.setNestedValue(content, key, value, bulletDepth);
        }
      } else if (trimmed === '' && bulletDepth > 0) {
        bulletDepth = 0;
      }
    }

    // Don't forget last section
    if (currentSection) {
      currentSection.content = content;
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * Build final document object from header and sections
   * @param header - Parsed header
   * @param sections - Parsed sections
   * @returns Combined document object
   */
  private buildDocument(header: DocumentHeader, sections: Section[]): any {
    const document: any = {
      ...header,
      created_at: header.created_at || new Date().toISOString(),
      updated_at: header.updated_at || new Date().toISOString(),
      version: header.version || '1.0.0',
      status: header.status || 'draft',
      tags: header.tags || []
    };

    // Merge sections content
    for (const section of sections) {
      if (section.symbol) {
        document[section.symbol] = section.content;
      }
    }

    return document;
  }

  /**
   * Match bullet item pattern
   * @param line - Bullet line to match
   * @returns Match result or null
   */
  private matchBulletItem(line: string): { key: string; value: string } | null {
    const match = line.match(/^-\s*(\w+):\s*(.+)$/);
    if (match) {
      return {
        key: match[1],
        value: match[2].trim()
      };
    }
    return null;
  }

  /**
   * Parse value (handle @ref, arrays, etc.)
   * @param value - Raw value string
   * @returns Parsed value
   */
  private parseValue(value: string): any {
    // Handle @ref references
    if (value.startsWith('@ref:')) {
      return value; // Keep as string for resolver
    }

    // Handle arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      return this.parseArrayValue(value);
    }

    // Handle booleans
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Handle numbers
    const num = Number(value);
    if (!isNaN(num)) return num;

    return value;
  }

  /**
   * Parse array value from bracket notation
   * @param value - Array value string
   * @returns Parsed array
   */
  private parseArrayValue(value: string): string[] {
    const content = value.slice(1, -1);
    return content.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
  }

  /**
   * Detect section type from title
   * @param title - Section title
   * @returns Section type
   */
  private detectSectionType(title: string): string {
    const lower = title.toLowerCase();

    if (lower.includes('phase')) return 'phase';
    if (lower.includes('feature')) return 'feature';
    if (lower.includes('user story')) return 'user-story';
    if (lower.includes('acceptance criteria')) return 'acceptance-criteria';
    if (lower.includes('timeline')) return 'timeline';
    if (lower.includes('release')) return 'release';
    if (lower.includes('success criteria')) return 'success-criteria';

    return 'section';
  }

  /**
   * Detect symbol type from context
   * @param lines - Content lines
   * @param lineNumber - Line number of symbol
   * @returns Symbol type
   */
  private detectSymbolType(lines: string[], lineNumber: number): 'phase' | 'feature' | 'user-story' | 'acceptance-criteria' | 'document' | 'timeline' | 'release' {
    if (lineNumber >= lines.length) return 'document';

    // Look at surrounding lines for context
    const start = Math.max(0, lineNumber - 5);
    const end = Math.min(lines.length, lineNumber + 5);
    const context = lines.slice(start, end).join(' ').toLowerCase();

    if (context.includes('phase')) return 'phase';
    if (context.includes('feature')) return 'feature';
    if (context.includes('user story') || context.includes('given')) return 'user-story';
    if (context.includes('acceptance criteria')) return 'acceptance-criteria';
    if (context.includes('timeline')) return 'timeline';
    if (context.includes('release')) return 'release';

    return 'document';
  }

  /**
   * Extract symbol name from title
   * @param title - Section title
   * @returns Symbol name if present
   */
  private extractSymbolName(title: string): string | undefined {
    const match = title.match(/^Symbol:\s*(\S+)/i);
    return match ? match[1] : undefined;
  }

  /**
   * Set nested value in object
   * @param obj - Object to modify
   * @param key - Key to set
   * @param value - Value to set
   * @param depth - Nesting depth
   */
  private setNestedValue(obj: any, key: string, value: any, depth: number): void {
    if (depth <= 2) {
      obj[key] = value;
    } else {
      // Handle nested bullets (not typical in TOON but possible)
      if (!Array.isArray(obj[key])) {
        obj[key] = [];
      }
      obj[key].push(value);
    }
  }

  /**
   * Create error result
   * @param errors - Parse errors
   * @param warnings - Parse warnings
   * @returns Error parse result
   */
  private createErrorResult(errors: ParseError[], warnings: ParseWarning[]): TOONParseResult {
    return {
      document: {},
      symbols: new Map(),
      metadata: {
        lineCount: 0,
        tokenCount: 0,
        parsedAt: new Date().toISOString()
      },
      errors,
      warnings
    };
  }
}

/**
 * Default parser instance
 */
let defaultParser: TOONParser | null = null;

/**
 * Get or create default parser instance
 * @returns TOONParser instance
 */
export function getParser(): TOONParser {
  if (!defaultParser) {
    defaultParser = new TOONParser();
  }
  return defaultParser;
}

/**
 * Parse TOON document using default parser
 * @param content - TOON markdown content
 * @returns Parsed document result
 */
export function parseTOON(content: string): TOONParseResult {
  return getParser().parse(content);
}

/**
 * Extract symbols from TOON document
 * @param content - TOON markdown content
 * @returns Map of symbols to locations
 */
export function extractTOONSymbols(content: string): Map<string, ParsedSymbol> {
  const lines = content.split('\n');
  return getParser().extractSymbols(content, lines);
}
