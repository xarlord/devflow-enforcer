/**
 * CLI Commands
 *
 * Slash commands for Claude Code DevFlow workflow
 * @version 1.0.0
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import type { LoadedTemplate } from '../templates/loader';
import type { WizardContext } from '../templates/wizard';
import type { ValidationResult } from '../toon';

/**
 * Start options interface
 */
export interface StartOptions {
  format?: 'toon' | 'markdown';
  template?: string;
}

/**
 * Validate options interface
 */
export interface ValidateOptions {
  file?: string;
  strict?: boolean;
}

/**
 * Convert options interface
 */
export interface ConvertOptions {
  input?: string;
  output?: string;
  format?: 'toon' | 'markdown';
}

/**
 * Wizard options interface
 */
export interface WizardCliOptions {
  template?: string;
  context?: WizardContext;
}

/**
 * Command result interface
 */
export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * DevFlow Commands class
 * Implements slash commands for Claude Code
 */
export class DevFlowCommands {
  private commandsDir: string;

  constructor(commandsDir: string = './src/commands') {
    this.commandsDir = commandsDir;
  }

  /**
   * Start a new DevFlow phase with template
   * @param phase - Phase name (e.g., 'requirements', 'architecture')
   * @param options - Start options
   */
  async start(phase: string, options?: StartOptions): Promise<CommandResult> {
    try {
      console.log(`\n🚀 Starting DevFlow Phase: ${phase}\n`);

      // Map phase to template name
      const templateName = this.getTemplateName(phase, options?.template);

      // Load template
      const { loadTemplate } = await import('../templates');
      const template = await loadTemplate(templateName, options?.format);

      console.log(`✅ Loaded template: ${template.name} (${template.format} format)`);
      console.log(`📄 Template size: ${template.metadata.size} bytes, ${template.metadata.tokens} tokens\n`);

      // Create context from git info if available
      const { gitUserName } = await import('../utils/git');
      const author = await gitUserName();
      const context = await this.createWizardContext();

      // Guide user through completion
      const completed = await this.guideTemplate(template, context);

      console.log(`\n✅ Template completed with ${completed.changes.length} changes\n`);

      // Save to file
      const fileName = options?.format === 'toon'
        ? `${phase}-toon-integration.md`
        : `${phase}-toon-integration.md`;

      await fs.writeFile(fileName, template.content, 'utf-8');
      console.log(`💾 Saved to: ${fileName}\n`);

      // Update progress file
      await this.updateProgress(phase, completed);

      return {
        success: true,
        message: `Successfully initialized ${phase} phase`,
        data: { fileName, changes: completed.changes }
      };
    } catch (error) {
      const message = `Failed to start DevFlow phase: ${(error as Error).message}`;
      console.error(`❌ ${message}\n`);
      return {
        success: false,
        message
      };
    }
  }

  /**
   * Validate TOON document
   * @param options - Validate options
   */
  async validate(options?: ValidateOptions): Promise<CommandResult> {
    try {
      console.log(`\n🔍 Validating TOON document...\n`);

      const { validateDocument } = await import('../toon');
      const fileName = options?.file || await this.findTOONFile('.');

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
        const { parseTOON } = await import('../toon');
        const result = parseTOON(content);
        document = result.document;
      }

      // Validate
      const result: ValidationResult = validateDocument(document);

      if (result.valid) {
        console.log(`✅ Document is valid!\n`);
        console.log(`📊 Summary: ${result.summary.totalFields} fields, ${result.summary.validFields} valid\n`);
        return {
          success: true,
          message: 'Document validation passed',
          data: result.summary
        };
      } else {
        console.log(`❌ Document validation failed!\n`);
        console.log(`📊 Summary: ${result.errors.length} errors\n`);

        // Display errors
        console.log(`\n❌ Validation Errors:\n`);
        for (const error of result.errors) {
          console.log(`  ${error.field}: ${error.message} (line ${error.line || '?'})`);
        }

        return {
          success: false,
          message: `Document validation failed with ${result.errors.length} errors`,
          data: result.errors
        };
      }
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
   * Convert between TOON and Markdown formats
   * @param options - Convert options
   */
  async convert(options?: ConvertOptions): Promise<CommandResult> {
    try {
      console.log(`\n🔄 Converting document format...\n`);

      const { convertFile } = await import('../templates');

      const input = options?.input || await this.findTOONFile('.');
      const format = options?.format || 'markdown';
      const output = options?.output || this.generateOutputPath(input, format);

      if (!input) {
        return {
          success: false,
          message: 'No input file found'
        };
      }

      console.log(`📄 Input: ${input}`);
      console.log(`📄 Output: ${output} (${format})\n`);

      // Detect input format from extension
      const from = input.endsWith('.toon.md') ? 'toon' : 'md';

      await convertFile(input, output, from, format);

      const stats = await fs.stat(output);
      console.log(`✅ Conversion complete!\n`);
      console.log(`💾 Output size: ${stats.size} bytes\n`);

      return {
        success: true,
        message: `Successfully converted to ${format}`,
        data: { input, output }
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
   * Run template wizard interactively
   * @param options - Wizard options
   */
  async wizard(options?: WizardCliOptions): Promise<CommandResult> {
    try {
      console.log(`\n🧙 Template Wizard\n`);

      const { loadTemplate, getWizard } = await import('../templates');

      // Load template
      const templateName = options?.template || 'requirements';
      const template = await loadTemplate(templateName, 'toon');

      console.log(`✅ Loaded template: ${template.name}\n`);

      // Create context
      const context = options?.context || await this.createWizardContext();

      // Run wizard
      const completed = await getWizard().guide(template, context);

      console.log(`\n✅ Wizard completed with ${completed.changes.length} changes\n`);

      // Save completed template
      const fileName = `${templateName}-completed.toon.md`;
      await fs.writeFile(fileName, template.document, 'utf-8');
      console.log(`💾 Saved to: ${fileName}\n`);

      return {
        success: true,
        message: 'Template completion successful',
        data: { fileName, changes: completed.changes }
      };
    } catch (error) {
      const message = `Wizard failed: ${(error as Error).message}`;
      console.error(`❌ ${message}\n`);
      return {
        success: false,
        message
      };
    }
  }

  /**
   * Get template name for phase
   * @param phase - Phase name
   * @param template - Override template name
   * @returns Template name
   */
  private getTemplateName(phase: string, template?: string): string {
    if (template) {
      return template;
    }

    const phaseMap: Record<string, string> = {
      'requirements': 'requirements',
      'architecture': 'architecture',
      'architecture-design': 'architecture',
      'detailed-design': 'detailed-design',
      'test-specification': 'test-specification',
      'test-plan': 'test-plan',
      'findings': 'findings',
      'progress': 'progress'
    };

    return phaseMap[phase.toLowerCase()] || 'requirements';
  }

  /**
   * Create wizard context from environment
   * @returns Wizard context object
   */
  private async createWizardContext(): Promise<WizardContext> {
    const context: WizardContext = {};

    // Get project name from git or package.json
    try {
      const { gitUserName } = await import('../utils/git');
      context.author = await gitUserName();
    } catch {
      // Use defaults
    }

    // Try to get from package.json
    try {
      const packagePath = path.join('.', 'package.json');
      if (await fs.access(packagePath).then(() => true).catch(() => false)) {
        const pkg = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
        context.projectName = pkg.name;
        context.projectVersion = pkg.version;
      }
    } catch {
      // Ignore errors
    }

    return context;
  }

  /**
   * Guide user through template completion
   * @param template - Loaded template
   * @param context - Wizard context
   * @returns Completed template result
   */
  private async guideTemplate(template: any, context: WizardContext): Promise<{ changes: any[] }> {
    // For now, just return the template as-is without interactive prompting
    // In production, this would use the TemplateWizard to guide the user
    return {
      changes: []
    };
  }

  /**
   * Find TOON file in directory
   * @param dir - Directory to search
   * @returns Found file path or null
   */
  private async findTOONFile(dir: string): Promise<string | null> {
    const files = ['requirements-toon-integration.md', 'architecture-toon-integration.md', 'detailed-design-toon-integration.md', 'test-specification-toon-integration.md'];

    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        await fs.access(filePath);
        return filePath;
      } catch {
        // Continue
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
  private generateOutputPath(input: string, format: 'toon' | 'markdown'): string {
    const basename = path.basename(input, '.md') || path.basename(input, '.toon.md');
    const name = basename.replace(/\.(toon\.)?md$/, '');

    const ext = format === 'toon' ? '.toon.md' : '.md';
    return `${name}${ext}`;
  }

  /**
   * Update progress file
   * @param phase - Phase name
   * @param completed - Completed template
   */
  private async updateProgress(phase: string, completed: any): Promise<void> {
    const progressFile = 'devflow-progress.md';

    try {
      let content = await fs.readFile(progressFile, 'utf-8');

      // Add completion entry
      const entry = `\n- ${new Date().toISOString()}: ${phase} document created via Template Wizard\n`;
      content += entry;

      await fs.writeFile(progressFile, content, 'utf-8');
    } catch {
      // Ignore if progress file doesn't exist
    }
  }
}

/**
 * Default commands instance
 */
let defaultCommands: DevFlowCommands | null = null;

/**
 * Get or create default commands instance
 * @returns DevFlowCommands instance
 */
export function getCommands(): DevFlowCommands {
  if (!defaultCommands) {
    defaultCommands = new DevFlowCommands();
  }
  return defaultCommands;
}

/**
 * Execute start command
 * @param phase - Phase name
 * @param options - Start options
 */
export async function executeStart(phase: string, options?: StartOptions): Promise<CommandResult> {
  return getCommands().start(phase, options);
}

/**
 * Execute validate command
 * @param options - Validate options
 */
export async function executeValidate(options?: ValidateOptions): Promise<CommandResult> {
  return getCommands().validate(options);
}

/**
 * Execute convert command
 * @param options - Convert options
 */
export async function executeConvert(options?: ConvertOptions): Promise<CommandResult> {
  return getCommands().convert(options);
}

/**
 * Execute wizard command
 * @param options - Wizard options
 */
export async function executeWizard(options?: WizardCliOptions): Promise<CommandResult> {
  return getCommands().wizard(options);
}
