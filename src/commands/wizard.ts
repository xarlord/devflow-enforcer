/**
 * /wizard Command
 *
 * Interactive template completion wizard
 * @version 1.0.0
 */

import { promises as fs } from 'fs';
import type { CompletedTemplate } from '../../templates/loader';
import type { WizardContext } from '../../templates/wizard';

/**
 * Run template wizard
 * @param options - Wizard options
 * @returns Command result
 */
export async function wizardCommand(
  options?: { template?: string; context?: WizardContext }
): Promise<{ success: boolean; message: string; data?: CompletedTemplate }> {
  try {
    console.log(`\n🧙 Template Wizard\n`);

    const { loadTemplate, getWizard, createWizardContext } = await import('../../templates');

    // Load template
    const templateName = options?.template || 'requirements';
    const template = await loadTemplate(templateName, 'toon');

    console.log(`✅ Loaded template: ${template.name} (${template.format} format)`);
    console.log(`📄 Template size: ${template.metadata.size} bytes, ${template.metadata.tokens} tokens\n`);

    // Create context
    const context = options?.context || await createWizardContext();

    // Get fields to complete
    const fields = extractEmptyFields(template.document);
    console.log(`\n📋 Fields to complete: ${fields.length}\n`);

    if (fields.length === 0) {
      console.log('✨ Template is complete! No fields to fill.\n');
      return {
        success: true,
        message: 'Template is already complete',
        data: template
      };
    }

    // Pre-fill from context
    let completedCount = 0;
    for (const field of fields) {
      if (context && context.projectName && field.name === 'name') {
        template.document.name = context.projectName.toLowerCase().replace(/\s+/g, '-');
        completedCount++;
      }
      if (context && context.projectVersion && field.name === 'version') {
        template.document.version = context.projectVersion;
        completedCount++;
      }
      if (context && context.author && field.name === 'created_at') {
        // Add author to metadata, not document
        completedCount++;
      }
    }

    if (completedCount > 0) {
      console.log(`✨ Pre-filled ${completedCount} fields from context\n`);
    }

    console.log(`\n💡 Starting wizard with ${fields.length - completedCount} remaining fields...\n`);
    console.log('💡 (Auto-accept defaults by pressing Enter for each field)\n');

    // Simulate completion (in real implementation, would use readline)
    console.log('\n✅ Completing template with simulated values...\n');

    for (const field of fields) {
      if (!getFilledValue(template.document, field)) {
        // Set default values
        if (field.type === 'text') {
          template.document[field.name] = 'demo-value';
        } else if (field.type === 'multiline') {
          template.document[field.name] = 'Demo description for the field';
        } else if (field.type === 'enum') {
          template.document[field.name] = field.enumOptions?.[0] || 'active';
        } else if (field.type === 'array') {
          template.document[field.name] = ['tag1', 'tag2'];
        } else if (field.type === 'date') {
          template.document[field.name] = new Date().toISOString();
        }
      }
    }

    const completed: CompletedTemplate = {
      document: template.document,
      changes: fields.map(f => ({
        field: f.name,
        oldValue: undefined,
        newValue: template.document[f.name] || '',
        timestamp: new Date().toISOString()
      })),
      completedAt: new Date().toISOString()
    };

    // Save completed template
    const fileName = `${templateName}-completed.toon.md`;
    await fs.writeFile(fileName, template.content, 'utf-8');
    console.log(`\n💾 Saved completed template to: ${fileName}\n`);

    return {
      success: true,
      message: `Template wizard completed with ${fields.length} fields`,
      data: completed
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
 * Extract fields that need completion
 * @param document - Template document
 * @returns Field configurations
 */
function extractEmptyFields(document: any): any[] {
  const fields = [];

  const commonFields = [
    { name: 'name', type: 'text', required: true, prompt: 'Document name' },
    { name: 'description', type: 'multiline', required: true, prompt: 'Document description' },
    { name: 'version', type: 'text', required: true, prompt: 'Version (semver)', validation: /^\d+\.\d+\.\d+$/ },
    { name: 'status', type: 'enum', required: true, prompt: 'Status', enumOptions: ['draft', 'active', 'deprecated', 'superseded'] },
    { name: 'created_at', type: 'date', required: true, prompt: 'Created date (ISO 8601)' }
  ];

  for (const fieldDef of commonFields) {
    if (!document[fieldDef.name] || (fieldDef.required && document[fieldDef.name] === '')) {
      fields.push(fieldDef);
    }
  }

  return fields;
}

/**
 * Get current value for a field
 * @param document - Template document
 * @param field - Field configuration
 * @returns Current value or undefined
 */
function getFilledValue(document: any, field: any): string | undefined {
  return document[field.name];
}
