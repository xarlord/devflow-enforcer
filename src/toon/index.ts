/**
 * TOON Module Exports
 *
 * Public API for TOON parsing, validation, and utilities
 * @version 1.0.0
 */

// Type definitions
export * from './types';

// Parser
export {
  TOONParser,
  getParser,
  parseTOON,
  extractTOONSymbols,
  type TOONParseResult,
  type ParseError,
  type ParseWarning,
  type SymbolLocation,
  type ParsedSymbol,
  type ParserOptions,
  type StructureValidationResult
} from './parser';

// Resolver
export {
  RefResolver,
  getResolver,
  resolveRefs,
  type ResolvedDocument,
  type ResolvedReference,
  type CircularChain,
  type SymbolTable,
  type ResolverOptions
} from './resolver';

// Token counter
export * from './token-counter';

// Validator
export {
  TOONValidator,
  getValidator,
  validateDocument,
  DocumentType,
  ErrorCode,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ReferenceValidationResult,
  type SymbolTable,
  type ParsedSymbol
} from './validator';

// Validation utilities
export * from './utils/validation';

// Schemas
export * from './schemas';

// Templates
export {
  loadTemplate,
  getLoader,
  listTemplates,
  hasTemplate,
  getTemplateMetadata,
  type LoadedTemplate,
  type TemplateInfo,
  type TemplateMetadata,
  type LoaderOptions
} from '../templates/loader';

export {
  TemplateWizard,
  getWizard,
  guideTemplate,
  createWizardContext,
  type SimpleFieldConfig,
  type WizardContext,
  type CompletedTemplate,
  type FieldChange,
  type FieldValidationResult,
  type WizardOptions
} from '../templates/wizard';

export {
  FormatConverter,
  getConverter,
  convertFormat,
  convertFile,
  type ConversionResult,
  type ConverterOptions
} from '../templates/converter';
