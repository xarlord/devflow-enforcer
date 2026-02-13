/**
 * Format Converter
 *
 * Converts between Markdown and TOON formats
 * @version 1.0.0
 */

import { promises as fs } from 'fs';
import type { LoadedTemplate } from './loader';

/**
 * Converter options interface
 */
export interface ConverterOptions {
  preserveFormatting?: boolean;
  includeMetadata?: boolean;
}

/**
 * Conversion result interface
 */
export interface ConversionResult {
  content: string;
  format: 'toon' | 'markdown';
  tokens: number;
  warnings: string[];
}

/**
 * Format Converter class
 */
export class FormatConverter {
  private options: Required<ConverterOptions>;

  constructor(options?: ConverterOptions) {
    this.options = {
      preserveFormatting: options?.preserveFormatting !== false,
      includeMetadata: options?.includeMetadata !== false
    };
  }

  /**
   * Convert Markdown to TOON format
   * @param markdown - Markdown content
   * @returns TOON format content
   */
  mdToToon(markdown: string): ConversionResult {
    const warnings: string[] = [];
    let toon = '';
    const lines = markdown.split('\n');

    let inDocumentOverview = false;
    let bulletLevel = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      // Add document header
      if (trimmed.startsWith('#') && !inDocumentOverview) {
        toon += '# TOON Document\n\n';
        toon += '## Document Overview\n\n';
        inDocumentOverview = true;
        continue;
      }

      // Detect section headers
      if (trimmed.startsWith('#')) {
        toon += line + '\n';
        bulletLevel = 0;
        continue;
      }

      // Convert bullet lists to TOON format
      if (trimmed.startsWith('-')) {
        const toonItem = this.convertBulletToTOON(trimmed, bulletLevel);
        toon += toonItem + '\n';
        bulletLevel = 2; // Indent level after bullet
      } else if (trimmed === '') {
        toon += '\n';
        bulletLevel = 0;
      } else if (bulletLevel > 0) {
        // Convert nested content
        const indent = '  '.repeat(bulletLevel - 1);
        toon += `${indent}${trimmed}\n`;
      } else {
        toon += trimmed + '\n';
      }
    }

    return {
      content: toon,
      format: 'toon',
      tokens: toon.length,
      warnings
    };
  }

  /**
   * Convert TOON to Markdown format
   * @param toon - TOON content
   * @returns Markdown content
   */
  toonToMd(toon: string): ConversionResult {
    const warnings: string[] = [];
    let markdown = '';
    const lines = toon.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip document overview header in TOON
      if (trimmed === '## Document Overview') {
        continue;
      }

      // Convert TOON bullets to markdown
      if (trimmed.startsWith('- ')) {
        const mdBullet = this.convertTOONBulletToMarkdown(trimmed);
        markdown += mdBullet + '\n';
      } else if (trimmed === '') {
        markdown += '\n';
      } else {
        markdown += trimmed + '\n';
      }
    }

    // Add markdown header
    markdown = '# ' + this.extractTitle(toon) + '\n\n' + markdown;

    return {
      content: markdown,
      format: 'markdown',
      tokens: markdown.length,
      warnings
    };
  }

  /**
   * Convert content from one format to another
   * @param content - Content to convert
   * @param from - Source format
   * @param to - Target format
   * @returns Conversion result
   */
  convert(content: string, from: 'md' | 'toon', to: 'md' | 'toon'): ConversionResult {
    if (from === to) {
      // Same format - return as-is with content length as token count
      return {
        content,
        format: to,
        tokens: content.length,
        warnings: []
      };
    } else if (from === 'md') {
      return this.mdToToon(content);
    } else if (from === 'toon') {
      return this.toonToMd(content);
    } else {
      throw new Error(`Unsupported source format: ${from}`);
    }
  }

  /**
   * Convert file from one format to another
   * @param inputPath - Input file path
   * @param outputPath - Output file path
   * @param from - Source format
   * @param to - Target format
   */
  async convertFile(inputPath: string, outputPath: string, from: 'md' | 'toon', to: 'md' | 'toon'): Promise<void> {
    const content = await fs.readFile(inputPath, 'utf-8');
    const result = this.convert(content, from, to);

    await fs.writeFile(outputPath, result.content, 'utf-8');

    if (result.warnings.length > 0) {
      console.warn(`Conversion warnings:\n${result.warnings.join('\n')}`);
    }
  }

  /**
   * Convert bullet item to TOON format
   * @param bullet - Bullet line
   * @param level - Nesting level
   * @returns TOON formatted bullet
   */
  private convertBulletToTOON(bullet: string, level: number): string {
    const match = bullet.match(/^-\s*(\w+):\s*(.+)$/);

    if (!match) {
      return bullet;
    }

    const key = match[1];
    const value = match[2];

    // Convert to lowercase key with underscores
    const toonKey = key.toLowerCase().replace(/-/g, '_');

    return `- ${toonKey}: "${value}"`;
  }

  /**
   * Convert TOON bullet to Markdown format
   * @param toonBullet - TOON bullet line
   * @returns Markdown formatted bullet
   */
  private convertTOONBulletToMarkdown(toonBullet: string): string {
    const match = toonBullet.match(/^-\s*(\w+):\s*"(.+)"$/);

    if (!match) {
      return toonBullet;
    }

    const key = match[1];
    const value = match[2];

    // Convert to readable format (Title Case or keep as-is)
    const formattedKey = this.formatKeyForMarkdown(key);
    const formattedValue = this.formatValueForMarkdown(value);

    return `- **${formattedKey}:** ${formattedValue}`;
  }

  /**
   * Format key for markdown display
   * @param key - TOON key
   * @returns Formatted key
   */
  private formatKeyForMarkdown(key: string): string {
    // Convert underscores to spaces and title case
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Format value for markdown display
   * @param value - TOON value
   * @returns Formatted value
   */
  private formatValueForMarkdown(value: string): string {
    // Remove quotes if present
    return value.replace(/^"|"$/g, '');
  }

  /**
   * Extract title from TOON content
   * @param toon - TOON content
   * @returns Title string
   */
  private extractTitle(toon: string): string {
    // Look for name field
    const match = toon.match(/name:\s*"(.+?)"/i);
    if (match) {
      return match[1];
    }

    // Default title
    return 'Document';
  }
}

/**
 * Default converter instance
 */
let defaultConverter: FormatConverter | null = null;

/**
 * Get or create default converter instance
 * @returns FormatConverter instance
 */
export function getConverter(): FormatConverter {
  if (!defaultConverter) {
    defaultConverter = new FormatConverter();
  }
  return defaultConverter;
}

/**
 * Convert content using default converter
 * @param content - Content to convert
 * @param from - Source format
 * @param to - Target format
 * @returns Conversion result
 */
export function convertFormat(
  content: string,
  from: 'md' | 'toon',
  to: 'md' | 'toon'
): ConversionResult {
  return getConverter().convert(content, from, to);
}

/**
 * Convert file using default converter
 * @param inputPath - Input file path
 * @param outputPath - Output file path
 * @param from - Source format
 * @param to - Target format
 */
export async function convertFile(
  inputPath: string,
  outputPath: string,
  from: 'md' | 'toon',
  to: 'md' | 'toon'
): Promise<void> {
  return getConverter().convertFile(inputPath, outputPath, from, to);
}
