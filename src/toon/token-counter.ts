/**
 * TOON Token Counter
 *
 * Provides accurate token counting using tiktoken library
 * @version 1.0.0
 */

import { get_encoding, Tiktoken } from 'tiktoken';

/**
 * Token comparison result
 */
export interface TokenComparison {
  toonTokens: number;
  jsonTokens: number;
  markdownTokens: number;
  savings: number;
  savingsPercent: number;
}

/**
 * Token counter options
 */
export interface TokenCounterOptions {
  /** Encoding to use (default: cl100k_base for GPT-4) */
  encoding?: string;
}

/**
 * Token Counter class using tiktoken
 * Provides accurate token counting for TOON documents
 */
export class TokenCounter {
  private encoding: Tiktoken;

  constructor(options?: TokenCounterOptions) {
    // Initialize tiktoken with cl100k_base encoding (GPT-4)
    this.encoding = get_encoding(options?.encoding || 'cl100k_base');
  }

  /**
   * Count tokens in content using tiktoken
   * @param content - Content to count tokens
   * @returns Number of tokens
   */
  countTokens(content: string): number {
    if (!content || content.length === 0) {
      return 0;
    }

    // Use tiktoken for accurate tokenization
    const tokens = this.encoding.encode(content);
    return tokens.length;
  }

  /**
   * Compare token counts between formats
   * @param toon - TOON content
   * @param json - Equivalent JSON content
   * @param markdown - Equivalent Markdown content
   * @returns Comparison result with savings
   */
  compare(
    toon: string,
    json: string,
    markdown: string
  ): TokenComparison {
    const toonTokens = this.countTokens(toon);
    const jsonTokens = this.countTokens(json);
    const markdownTokens = this.countTokens(markdown);

    const vsJsonTokens = jsonTokens - toonTokens;
    const vsMarkdownTokens = markdownTokens - toonTokens;

    return {
      toonTokens,
      jsonTokens,
      markdownTokens,
      savings: vsJsonTokens,
      savingsPercent: jsonTokens > 0 ? (vsJsonTokens / jsonTokens) * 100 : 0
    };
  }

  /**
   * Free encoding resources
   */
  free(): void {
    this.encoding.free();
  }
}

/**
 * Default token counter instance
 */
let defaultCounter: TokenCounter | null = null;

/**
 * Get or create default token counter instance
 * @returns TokenCounter instance
 */
export function getTokenCounter(): TokenCounter {
  if (!defaultCounter) {
    defaultCounter = new TokenCounter();
  }
  return defaultCounter;
}

/**
 * Count tokens in content using default counter
 * @param content - Content to count tokens
 * @returns Number of tokens
 */
export function countTokens(content: string): number {
  return getTokenCounter().countTokens(content);
}

/**
 * Compare token counts between formats
 * @param toon - TOON format content
 * @param json - JSON format content
 * @param markdown - Markdown format content
 * @returns Token comparison result
 */
export function compare(toon: string, json: string, markdown: string): TokenComparison {
  return getTokenCounter().compare(toon, json, markdown);
}
