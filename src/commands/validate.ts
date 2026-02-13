/**
 * /validate Command
 *
 * Validates TOON documents
 * @version 1.0.0
 */

import { promises as fs } from 'fs';
import type { ValidationResult } from '../../toon';

/**
 * Validate TOON document
 * @param options - Validate options
 * @returns Command result
 */
export async function validateCommand(
  options?: { file?: string; strict?: boolean }
): Promise<{ success: boolean; message: string; data?: ValidationResult }> {
  try {
    console.log(`\n🔍 Validating TOON document...\n`);

    const { validateDocument, getValidator } = await import('../../toon');
    const fileName = options?.file || await findTOONFile('.');

    if (!fileName) {
      return {
        success: false,
        message: 'No TOON file found in current directory'
      };
    }

    console.log(`📄 Validating: ${fileName}\n`);

    // Read file content
    const content = await fs.readFile(fileName, 'utf-8');

    // Parse JSON if needed
    let document;
    try {
      document = JSON.parse(content);
    } catch {
      // Try parsing as TOON
      try {
        const { parseTOON } = await import('../../toon');
        const result = parseTOON(content);
        document = result.document;
      } catch {
        throw new Error('Could not parse document as JSON or TOON');
      }
    }

    // Validate
    const result: ValidationResult = validateDocument(document);

    if (result.valid) {
      console.log(`✅ Document is valid!\n`);
      console.log(`📊 Summary: ${result.summary.totalFields} fields, ${result.summary.validFields} valid\n`);
    } else {
      console.log(`❌ Document validation failed!\n`);
      console.log(`📊 Summary: ${result.summary.totalFields} fields, ${result.summary.invalidFields} invalid, ${result.summary.missingFields} missing\n`);

      // Display errors
      console.log(`\n❌ Validation Errors:\n`);
      for (const error of result.errors) {
        console.log(`  ${error.field}: ${error.message} (line ${error.line || '?'}) [${error.code}]`);
      }
    }

    // Display warnings
    if (result.warnings.length > 0) {
      console.log(`\n⚠️  Warnings:\n`);
      for (const warning of result.warnings) {
        console.log(`  ${warning.field}: ${warning.message}`);
      }
    }

    return {
      success: result.valid,
      message: result.valid ? 'Document validation passed' : `Document validation failed with ${result.errors.length} errors`,
      data: result
    };
  } catch (error) {
    const message = `Validation failed: ${(error as Error).message}`;
    console.error(`❌ ${message}\n`);
    return {
      success: false,
      message
    };
  }
}

/**
 * Find TOON file in current directory
 * @param dir - Directory to search
 * @returns Found file name or null
 */
async function findTOONFile(dir: string): Promise<string | null> {
  const files = await fs.readdir(dir);

  for (const file of files) {
    if (file.endsWith('.toon.md')) {
      return file;
    }
  }

  return null;
}
