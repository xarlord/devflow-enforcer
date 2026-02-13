/**
 * TOON Validator
 *
 * Provides runtime validation for TOON documents using Zod schemas
 * @version 1.0.0
 */

import { z } from 'zod';
import {
  toonDocumentSchema,
  toonPhaseSchema,
  toonFeatureSchema,
  toonUserStorySchema,
  toonAcceptanceCriteriaSchema
} from './schemas';

/**
 * Document types for validation
 */
export enum DocumentType {
  REQUIREMENTS = 'requirements',
  ARCHITECTURE = 'architecture',
  DETAILED_DESIGN = 'detailed-design',
  TEST_SPECIFICATION = 'test-specification',
  ROADMAP = 'roadmap'
}

/**
 * Error codes for validation errors
 */
export enum ErrorCode {
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_ENUM = 'INVALID_ENUM',
  INVALID_FORMAT = 'INVALID_FORMAT',
  REF_NOT_FOUND = 'REF_NOT_FOUND',
  CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE'
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code: ErrorCode;
  line?: number;
  severity: 'error' | 'warning';
}

/**
 * Validation warning interface
 */
export interface ValidationWarning {
  field: string;
  message: string;
  code?: string;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: {
    totalFields: number;
    validFields: number;
    invalidFields: number;
    missingFields: number;
  };
}

/**
 * Reference validation result interface
 */
export interface ReferenceValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  summary: {
    totalReferences: number;
    resolvedReferences: number;
    unresolvedReferences: number;
  };
}

/**
 * Symbol table interface for reference validation
 */
export interface SymbolTable {
  has(symbol: string): boolean;
  get(symbol: string): ParsedSymbol | undefined;
  getAll(): Map<string, ParsedSymbol>;
}

/**
 * Parsed symbol interface
 */
export interface ParsedSymbol {
  symbol: string;
  line: number;
  type: string;
}

/**
 * TOON Validator class
 * Validates TOON documents against schemas
 */
export class TOONValidator {
  private schemas: Map<DocumentType, z.ZodSchema>;

  constructor() {
    this.schemas = this.loadSchemas();
  }

  /**
   * Validate TOON document against base schema
   * @param document - Document to validate
   * @returns Validation result with errors and warnings
   */
  validate(document: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate against base schema first
    const baseResult = this.validateBaseSchema(document);
    errors.push(...baseResult.errors);
    warnings.push(...baseResult.warnings);

    // Detect document type for specific validation
    const docType = this.detectDocumentType(document);

    // Validate against specific schema
    if (docType) {
      const typeResult = this.validateType(document, docType);
      errors.push(...typeResult.errors);
      warnings.push(...typeResult.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: this.buildSummary(errors, warnings, document)
    };
  }

  /**
   * Validate document against specific type schema
   * @param document - Document to validate
   * @param type - Document type
   * @returns Validation result
   */
  validateType(document: unknown, type: DocumentType): ValidationResult {
    const schema = this.schemas.get(type);

    if (!schema) {
      return {
        valid: false,
        errors: [{
          field: 'document',
          message: `No schema found for type: ${type}`,
          code: ErrorCode.INVALID_FORMAT,
          severity: 'error'
        }],
        warnings: [],
        summary: { totalFields: 0, validFields: 0, invalidFields: 0, missingFields: 0 }
      };
    }

    return this.validateWithSchema(document, schema);
  }

  /**
   * Validate @ref references in document
   * @param document - Document to validate
   * @param symbolTable - Available symbols
   * @returns Reference validation result
   */
  validateReferences(
    document: any,
    symbolTable: SymbolTable
  ): ReferenceValidationResult {
    const refs = this.extractReferences(document);
    const errors: ValidationError[] = [];

    for (const ref of refs) {
      if (!symbolTable.has(ref.symbol)) {
        errors.push({
          field: ref.symbol,
          message: `Unresolved reference: @ref:${ref.symbol}`,
          code: ErrorCode.REF_NOT_FOUND,
          line: ref.line,
          severity: 'error'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
      summary: {
        totalReferences: refs.length,
        resolvedReferences: refs.length - errors.length,
        unresolvedReferences: errors.length
      }
    };
  }

  /**
   * Load Zod schemas for all document types
   * @returns Map of document types to schemas
   */
  private loadSchemas(): Map<DocumentType, z.ZodSchema> {
    const schemas = new Map<DocumentType, z.ZodSchema>();

    // Base document schema
    schemas.set(DocumentType.REQUIREMENTS, toonDocumentSchema);
    schemas.set(DocumentType.ARCHITECTURE, toonDocumentSchema);
    schemas.set(DocumentType.DETAILED_DESIGN, toonDocumentSchema);
    schemas.set(DocumentType.TEST_SPECIFICATION, toonDocumentSchema);
    schemas.set(DocumentType.ROADMAP, toonDocumentSchema);

    return schemas;
  }

  /**
   * Validate document against base TOON schema
   * @param document - Document to validate
   * @returns Validation result
   */
  private validateBaseSchema(document: unknown): ValidationResult {
    return this.validateWithSchema(document, toonDocumentSchema);
  }

  /**
   * Validate document with specific Zod schema
   * @param document - Document to validate
   * @param schema - Zod schema
   * @returns Validation result
   */
  private validateWithSchema(document: unknown, schema: z.ZodSchema): ValidationResult {
    const result = schema.safeParse(document);

    if (result.success) {
      return {
        valid: true,
        errors: [],
        warnings: [],
        summary: {
          totalFields: Object.keys(result.data as object).length,
          validFields: Object.keys(result.data as object).length,
          invalidFields: 0,
          missingFields: 0
        }
      };
    }

    const errors: ValidationError[] = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: this.mapZodErrorToErrorCode(err),
      severity: 'error'
    }));

    return {
      valid: false,
      errors,
      warnings: [],
      summary: {
        totalFields: result.error.errors.length,
        validFields: 0,
        invalidFields: result.error.errors.length,
        missingFields: 0
      }
    };
  }

  /**
   * Detect document type from content
   * @param document - Document to analyze
   * @returns Detected document type
   */
  private detectDocumentType(document: any): DocumentType | null {
    if (!document || typeof document !== 'object') {
      return null;
    }

    const content = JSON.stringify(document).toLowerCase();

    if (content.includes('functional requirements') || content.includes('user stories')) {
      return DocumentType.REQUIREMENTS;
    }
    if (content.includes('component') || content.includes('architecture')) {
      return DocumentType.ARCHITECTURE;
    }
    if (content.includes('implementation') || content.includes('detailed design')) {
      return DocumentType.DETAILED_DESIGN;
    }
    if (content.includes('test case') || content.includes('test specification')) {
      return DocumentType.TEST_SPECIFICATION;
    }
    if (content.includes('phase') || content.includes('roadmap')) {
      return DocumentType.ROADMAP;
    }

    return DocumentType.REQUIREMENTS; // Default
  }

  /**
   * Extract all @ref references from document
   * @param document - Document to extract from
   * @returns Array of extracted references
   */
  private extractReferences(document: any): ExtractedReference[] {
    const refs: ExtractedReference[] = [];

    const extractFromObject = (obj: any, prefix = '') => {
      if (!obj || typeof obj !== 'object') return;

      for (const [key, value] of Object.entries(obj)) {
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string' && (value.startsWith('@ref:') || value.startsWith('@ref('))) {
          // Match both @ref:name and @ref(name) formats
          const regex = /@ref[:\(]([a-zA-Z0-9_-]+)\)?/;
          const match = value.match(regex);
          if (match) {
            refs.push({
              symbol: match[1], // Extract the symbol name
              path: fieldPath
            });
          }
        } else if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === 'string' && (item.startsWith('@ref:') || item.startsWith('@ref('))) {
              const regex = /@ref[:\(]([a-zA-Z0-9_-]+)\)?/;
              const match = item.match(regex);
              if (match) {
                refs.push({
                  symbol: match[1],
                  path: fieldPath
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
   * Map Zod error to our error code
   * @param err - Zod error
   * @returns Mapped error code
   */
  private mapZodErrorToErrorCode(err: z.ZodIssue): ErrorCode {
    switch (err.code) {
      case 'invalid_type':
        return ErrorCode.INVALID_TYPE;
      case 'invalid_enum_value':
        return ErrorCode.INVALID_ENUM;
      case 'invalid_string':
      case 'invalid_date':
        return ErrorCode.INVALID_FORMAT;
      default:
        return ErrorCode.MISSING_REQUIRED_FIELD;
    }
  }

  /**
   * Build validation summary
   * @param errors - Validation errors
   * @param warnings - Validation warnings
   * @param document - Document being validated
   * @returns Summary object
   */
  private buildSummary(
    errors: ValidationError[],
    warnings: ValidationWarning[],
    document: any
  ): { totalFields: number; validFields: number; invalidFields: number; missingFields: number } {
    const totalFields = document && typeof document === 'object'
      ? Object.keys(document).length
      : 0;

    return {
      totalFields,
      validFields: totalFields - errors.length,
      invalidFields: errors.filter(e => e.code !== ErrorCode.MISSING_REQUIRED_FIELD).length,
      missingFields: errors.filter(e => e.code === ErrorCode.MISSING_REQUIRED_FIELD).length
    };
  }
}

/**
 * Extracted reference interface
 */
interface ExtractedReference {
  symbol: string;
  path: string;
  line?: number;
}

/**
 * Default validator instance
 */
let defaultValidator: TOONValidator | null = null;

/**
 * Get or create default validator instance
 * @returns TOONValidator instance
 */
export function getValidator(): TOONValidator {
  if (!defaultValidator) {
    defaultValidator = new TOONValidator();
  }
  return defaultValidator;
}

/**
 * Validate TOON document using default validator
 * @param document - Document to validate
 * @returns Validation result
 */
export function validateDocument(document: unknown): ValidationResult {
  return getValidator().validate(document);
}

/**
 * Validate TOON document by type using default validator
 * @param document - Document to validate
 * @param type - Document type to validate against
 * @returns Validation result
 */
export function validateType(document: unknown, type: string): ValidationResult {
  return getValidator().validateType(document, type);
}
