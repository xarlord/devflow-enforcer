/**
 * Template Wizard
 *
 * Interactive template completion guidance
 * @version 1.0.0
 */

import * as readline from 'readline';
import { promises as fs } from 'fs';
import type { LoadedTemplate } from './loader';

/**
 * Simple field configuration
 */
export interface SimpleFieldConfig {
  name: string;
  type: 'text' | 'multiline' | 'enum' | 'array' | 'date';
  required: boolean;
  prompt: string;
  defaultValue?: string;
  enumOptions?: string[];
  validation?: RegExp;
  placeholder?: string;
  helpText?: string;
}

/**
 * Wizard context interface
 */
export interface WizardContext {
  projectName?: string;
  projectVersion?: string;
  author?: string;
  tags?: string[];
  previousAnswers?: Map<string, string>;
}

/**
 * Completed template interface
 */
export interface CompletedTemplate {
  document: any;
  changes: FieldChange[];
  completedAt: string;
}

/**
 * Field change interface
 */
export interface FieldChange {
  field: string;
  oldValue: string | undefined;
  newValue: string;
  timestamp: string;
}

/**
 * Field validation result interface
 */
export interface FieldValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Wizard options interface
 */
export interface WizardOptions {
  interactive?: boolean;
  autoFill?: boolean;
}

/**
 * Template Wizard class
 * Guides users through interactive template completion
 */
export class TemplateWizard {
  private rl: readline.Interface;
  private options: Required<WizardOptions>;

  constructor(options?: WizardOptions) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.options = {
      interactive: options?.interactive !== false,
      autoFill: options?.autoFill !== false
    };
  }

  /**
   * Guide user through template completion
   * @param template - Template to complete
   * @param context - Project context for pre-filling
   * @returns Completed template
   */
  async guide(template: LoadedTemplate, context?: WizardContext): Promise<CompletedTemplate> {
    const fields = this.extractFields(template);
    const document = template.document || {};
    const changes: FieldChange[] = [];

    for (const field of fields) {
      const currentValue = this.getFieldValue(document, field);
      let newValue = currentValue;

      // Auto-fill from context if enabled
      if (this.options.autoFill && !currentValue && context) {
        newValue = this.getAutoFillValue(field, context);
        if (newValue) {
          this.setFieldValue(document, field, newValue);
          changes.push({
            field: field.name,
            oldValue: currentValue,
            newValue,
            timestamp: new Date().toISOString()
          });
          continue;
        }
      }

      // Skip if value exists and not required
      if (currentValue && !field.required) {
        continue;
      }

      // Interactive prompt
      if (this.options.interactive) {
        newValue = await this.prompt(field, currentValue);
        const validation = this.validateField(field, newValue);

        if (!validation.valid) {
          console.log(`Validation errors: ${validation.errors.join(', ')}`);
          // Re-prompt on validation failure
          let retryCount = 0;
          while (retryCount < 3 && !validation.valid) {
            newValue = await this.prompt(field, newValue);
            validation = this.validateField(field, newValue);
            retryCount++;
          }

          if (!validation.valid) {
            throw new Error(`Field ${field.name} failed validation after 3 attempts`);
          }
        }

        this.setFieldValue(document, field, newValue);
        changes.push({
          field: field.name,
          oldValue: currentValue,
          newValue,
          timestamp: new Date().toISOString()
        });
      }
    }

    return {
      document,
      changes,
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Prompt user for specific field
   * @param field - Field configuration
   * @param currentValue - Current value (if any)
   * @returns User input
   */
  async prompt(field: SimpleFieldConfig, currentValue?: string): Promise<string> {
    return new Promise((resolve) => {
      const prompt = this.buildPrompt(field, currentValue);

      this.rl.question(prompt, (answer) => {
        // Use default value if empty input and default exists
        if (!answer && field.defaultValue) {
          resolve(field.defaultValue);
        } else {
          resolve(answer || '');
        }
      });
    });
  }

  /**
   * Validate user input for field
   * @param field - Field configuration
   * @param value - User input
   * @returns Validation result
   */
  validateField(field: SimpleFieldConfig, value: string): FieldValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required
    if (field.required && (!value || value.trim() === '')) {
      errors.push(`${field.name} is required`);
    }

    // Check type-specific validation
    if (value) {
      switch (field.type) {
        case 'enum':
          if (field.enumOptions && !field.enumOptions.includes(value)) {
            errors.push(`Must be one of: ${field.enumOptions.join(', ')}`);
          }
          break;

        case 'array':
          if (value && !value.startsWith('[')) {
            errors.push('Array must start with [');
          }
          break;

        case 'date':
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors.push('Invalid date format');
          }
          break;
      }

      // Apply regex validation
      if (field.validation) {
        if (!field.validation.test(value)) {
          errors.push(`Format validation failed`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Extract fields from template
   * @param template - Loaded template
   * @returns Array of field configurations
   */
  private extractFields(template: LoadedTemplate): SimpleFieldConfig[] {
    const fields: SimpleFieldConfig[] = [];
    const document = template.document || {};

    // Define common TOON fields
    const commonFields: SimpleFieldConfig[] = [
      {
        name: 'name',
        type: 'text',
        required: true,
        prompt: 'Document name (lowercase, alphanumeric, hyphens):',
        validation: /^[a-z0-9-]+$/,
        helpText: 'Unique identifier for the document'
      },
      {
        name: 'description',
        type: 'multiline',
        required: true,
        prompt: 'Document description:',
        helpText: 'Human-readable description of the document'
      },
      {
        name: 'version',
        type: 'text',
        required: true,
        prompt: 'Version (semver format, e.g., 1.0.0):',
        validation: /^\d+\.\d+\.\d+$/,
        defaultValue: '1.0.0',
        helpText: 'Semantic version following MAJOR.MINOR.PATCH'
      },
      {
        name: 'status',
        type: 'enum',
        required: true,
        prompt: 'Document status (draft, active, deprecated, superseded):',
        enumOptions: ['draft', 'active', 'deprecated', 'superseded'],
        defaultValue: 'draft',
        helpText: 'Current lifecycle status of the document'
      },
      {
        name: 'created_at',
        type: 'date',
        required: true,
        prompt: 'Created date (ISO 8601 format):',
        defaultValue: new Date().toISOString(),
        helpText: 'When the document was created'
      },
      {
        name: 'tags',
        type: 'array',
        required: false,
        prompt: 'Tags (comma-separated, max 10):',
        helpText: 'Optional tags for categorization'
      }
    ];

    // Add fields that exist in template
    for (const fieldDef of commonFields) {
      if (fieldDef.name in document && document[fieldDef.name] !== undefined) {
        fields.push(fieldDef);
      }
    }

    return fields;
  }

  /**
   * Get field value from document
   * @param document - Document object
   * @param field - Field configuration
   * @returns Current value or undefined
   */
  private getFieldValue(document: any, field: SimpleFieldConfig): string | undefined {
    return document[field.name];
  }

  /**
   * Set field value in document
   * @param document - Document object
   * @param field - Field configuration
   * @param value - Value to set
   */
  private setFieldValue(document: any, field: SimpleFieldConfig, value: string): void {
    // Parse value based on type
    if (field.type === 'array') {
      document[field.name] = this.parseArrayValue(value);
    } else if (field.type === 'date') {
      // Keep as string, validation happens elsewhere
      document[field.name] = value;
    } else if (field.name === 'tags') {
      document[field.name] = this.parseArrayValue(value);
    } else {
      document[field.name] = value;
    }
  }

  /**
   * Parse array value from input
   * @param value - Input string
   * @returns Parsed array
   */
  private parseArrayValue(value: string): string[] {
    if (!value) return [];

    const content = value.trim();
    if (content.startsWith('[') && content.endsWith(']')) {
      const inner = content.slice(1, -1);
      return inner.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    }

    return [value];
  }

  /**
   * Get auto-fill value from context
   * @param field - Field configuration
   * @param context - Wizard context
   * @returns Auto-filled value or undefined
   */
  private getAutoFillValue(field: SimpleFieldConfig, context?: WizardContext): string | undefined {
    if (!context) return undefined;

    switch (field.name) {
      case 'name':
        if (context.projectName) {
          return context.projectName.toLowerCase().replace(/\s+/g, '-');
        }
        break;
      case 'version':
        if (context.projectVersion) {
          return context.projectVersion;
        }
        break;
      case 'tags':
        if (context.tags && context.tags.length > 0) {
          return context.tags.join(',');
        }
        break;
      case 'author':
        // For created_at field, not a direct match but useful
        if (context.author) {
          // Could be used for commit attribution
        }
        break;
    }

    return undefined;
  }

  /**
   * Build prompt string for field
   * @param field - Field configuration
   * @param currentValue - Current value
   * @returns Formatted prompt string
   */
  private buildPrompt(field: SimpleFieldConfig, currentValue?: string): string {
    let prompt = '';

    if (field.helpText) {
      prompt += `\n  ${field.helpText}\n`;
    }

    if (field.type === 'enum' && field.enumOptions) {
      prompt += `\n  Options: ${field.enumOptions.join(', ')}\n`;
    }

    prompt += `\n  ${field.prompt}`;

    if (currentValue) {
      prompt += ` [default: ${currentValue}]`;
    } else if (field.defaultValue) {
      prompt += ` [default: ${field.defaultValue}]`;
    }

    prompt += ': ';
    return prompt;
  }

  /**
   * Close the wizard interface
   */
  close(): void {
    this.rl.close();
  }

  /**
   * Save completed template to file
   * @param completed - Completed template result
   * @param outputPath - Output file path
   */
  async saveToFile(completed: CompletedTemplate, outputPath: string): Promise<void> {
    // Convert document to TOON format
    const toonContent = this.documentToTOON(completed.document);

    await fs.writeFile(outputPath, toonContent, 'utf-8');
    console.log(`\nTemplate saved to: ${outputPath}`);
  }

  /**
   * Convert document object to TOON format
   * @param document - Document object
   * @returns TOON markdown string
   */
  private documentToTOON(document: any): string {
    const lines: string[] = [];

    lines.push('# TOON Document');
    lines.push('');
    lines.push('## Document Overview');
    lines.push('');

    for (const [key, value] of Object.entries(document)) {
      if (Array.isArray(value)) {
        lines.push(`- ${key}: [${value.join(', ')}]`);
      } else if (typeof value === 'object' && value !== null) {
        // Skip nested objects for now
        lines.push(`- ${key}: [object]`);
      } else if (typeof value === 'string') {
        lines.push(`- ${key}: "${value}"`);
      } else {
        lines.push(`- ${key}: ${value}`);
      }
    }

    return lines.join('\n');
  }
}

/**
 * Default wizard instance
 */
let defaultWizard: TemplateWizard | null = null;

/**
 * Get or create default wizard instance
 * @returns TemplateWizard instance
 */
export function getWizard(): TemplateWizard {
  if (!defaultWizard) {
    defaultWizard = new TemplateWizard();
  }
  return defaultWizard;
}

/**
 * Guide user through template completion using default wizard
 * @param template - Template to complete
 * @param context - Wizard context
 * @returns Completed template
 */
export async function guideTemplate(
  template: LoadedTemplate,
  context?: WizardContext
): Promise<CompletedTemplate> {
  return getWizard().guide(template, context);
}

/**
 * Create wizard context from project info
 * @param projectName - Project name
 * @param projectVersion - Project version
 * @param author - Author name
 * @param tags - Project tags
 * @returns Wizard context object
 */
export function createWizardContext(
  projectName?: string,
  projectVersion?: string,
  author?: string,
  tags?: string[]
): WizardContext {
  const context: WizardContext = {};

  if (projectName) context.projectName = projectName;
  if (projectVersion) context.projectVersion = projectVersion;
  if (author) context.author = author;
  if (tags) context.tags = tags;

  return context;
}
