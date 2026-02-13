/**
 * /convert Command
 *
 * Converts between TOON and Markdown formats
 * @version 1.0.0
 */

import { promises as fs } from 'fs';
import type { ConversionResult } from '../../templates/converter';

/**
 * Convert file format
 * @param options - Convert options
 * @returns Command result
 */
export async function convertCommand(
  options?: { input?: string; output?: string; format?: 'toon' | 'markdown' }
): Promise<{ success: boolean; message: string; data?: ConversionResult }> {
  try {
    console.log(`\n🔄 Converting document format...\n`);

    const { convertFormat } = await import('../../templates/converter');

    const input = options?.input || await findInputFile('.');
    const output = options?.output || generateOutputPath(input, options?.format);
    const format = options?.format || 'markdown';

    if (!input) {
      return {
        success: false,
        message: 'No input file found'
      };
    }

    console.log(`📄 Input: ${input}`);
    console.log(`📄 Output: ${output} (${format})\n`);

    const result: ConversionResult = convertFormat(input, 'markdown', format);

    await fs.writeFile(output, result.content, 'utf-8');

    const stats = await fs.stat(output);
    console.log(`✅ Conversion complete!\n`);
    console.log(`💾 Output size: ${stats.size} bytes\n`);

    if (result.warnings.length > 0) {
      console.log(`\n⚠️  Conversion Warnings:\n`);
      for (const warning of result.warnings) {
        console.log(`  ${warning}`);
      }
    }

    return {
      success: true,
      message: `Successfully converted to ${format}`,
      data: result
    };
  } catch (error) {
    const message = `Conversion failed: ${(error as Error).message}`;
    console.error(`❌ ${message}\n`);
    return {
      success: false,
      message
    };
  }
}

/**
 * Find input file in directory
 * @param dir - Directory to search
 * @returns Found file path or null
 */
async function findInputFile(dir: string): Promise<string | null> {
  const files = await fs.readdir(dir);

  for (const file of files) {
    if (file.endsWith('.toon.md') || file.endsWith('.md')) {
      return file;
    }
  }

  return null;
}

/**
 * Generate output file path
 * @param input - Input file path
 * @param format - Target format
 * @returns Output file path
 */
function generateOutputPath(input: string, format?: 'toon' | 'markdown'): string {
  const basename = input.replace(/\.(toon\.)?md$/, '');
  const ext = format === 'toon' ? '.toon.md' : '.md';
  return `${basename}${ext}`;
}
