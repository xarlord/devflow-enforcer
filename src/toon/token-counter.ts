/**
 * TOON Token Counter
 *
 * Provides accurate token counting using tiktoken library
 * @version 1.0.0
 */

import { encoding_for_model, Tiktoken } from 'tiktoken';

/**
 * Token comparison result
 */
export interface TokenComparison {
  toon: { tokens: number; chars: number };
  json: { tokens: number; chars: number };
  markdown: { tokens: number; chars: number };
  savings: {
    vsJson: { tokens: number; percentage: number };
    vsMarkdown: { tokens: number; percentage: number };
  };
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
    this.encoding = encoding_for_model(options?.encoding || 'cl100k_base');
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
      toon: { tokens: toonTokens, chars: toon.length },
      json: { tokens: jsonTokens, chars: json.length },
      markdown: { tokens: markdownTokens, chars: markdown.length },
      savings: {
        vsJson: {
          tokens: vsJsonTokens,
          percentage: jsonTokens > 0 ? (vsJsonTokens / jsonTokens) * 100 : 0
        },
        vsMarkdown: {
          tokens: vsMarkdownTokens,
          percentage: markdownTokens > 0 ? (vsMarkdownTokens / markdownTokens) * 100 : 0
        }
      }
    };
  }

  /**
   * Free encoding resources
   */
  dispose(): void {
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
