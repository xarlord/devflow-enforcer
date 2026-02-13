# TOON Integration Test Feature - Detailed Design

**Version:** 1.0.0
**Created:** 2026-02-13
**Architect:** System/Software Architect Agent
**Status:** Draft
**Related Docs:** [requirements-toon-integration.md](./requirements-toon-integration.md) | [architecture-toon-integration.md](./architecture-toon-integration.md)

---

## 1. Design Overview

### Purpose

This document provides detailed design specifications for the TOON Integration Test Feature, including component design, data models, API specifications, business logic flows, and implementation guidelines.

### Design Principles

| Principle | Description | Application |
|-----------|-------------|-------------|
| Separation of Concerns | Each component has single responsibility | Parser parses, resolver resolves, validator validates |
| DRY | Don't Repeat Yourself | Shared types in types.ts, shared utilities in utils/ |
| SOLID | Object-oriented design principles | Interfaces for all components, dependency injection |
| API First | API contracts before implementation | All modules expose clear interfaces |
| Type Safety | Leverage TypeScript strict mode | All functions have explicit types |

---

## 2. Component Design

### Component Hierarchy

```
┌──────────────────────────────────────────────────────────────────┐
│                        TOON Core Module                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Parser     │  │  Resolver    │  │  Validator   │        │
│  │              │  │              │  │              │        │
│  │ parseToON()  │  │ resolveRefs()│  │ validate()   │        │
│  │ extractSymbols()│  │ detectCycles()│  │ checkSchema()│        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                          │
│  │ TokenCounter │  │  Converter   │                          │
│  │              │  │              │                          │
│  │ countTokens()│  │ mdToToon()  │                          │
│  │ compare()    │  │  toonToMd()  │                          │
│  └──────────────┘  └──────────────┘                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    Template System Module                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Loader      │  │   Wizard     │  │ Framework    │        │
│  │              │  │              │  │              │        │
│  │ loadTemplate()│  │ guide()     │  │ validate()   │        │
│  │ listTemplates()│  │ prompt()    │  │ report()     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### TOON Parser

**Purpose:** Parse .toon.md files into TypeScript objects

**Responsibilities:**
- Read and tokenize .toon.md content
- Extract document metadata
- Parse section headers and symbols
- Parse bullet lists into objects
- Maintain line number information for error reporting

**Interfaces:**

```typescript
interface TOONParser {
  /**
   * Parse TOON document content into TypeScript objects
   * @param content - The .toon.md file content
   * @returns Parsed TOON document with metadata
   * @throws ParseError if document is malformed
   */
  parse(content: string): TOONParseResult;

  /**
   * Extract all symbol definitions from document
   * @param content - The .toon.md file content
   * @returns Map of symbol names to their locations
   */
  extractSymbols(content: string): Map<string, SymbolLocation>;

  /**
   * Validate document structure before parsing
   * @param content - The .toon.md file content
   * @returns Validation result with any errors
   */
  validateStructure(content: string): StructureValidationResult;
}

interface TOONParseResult {
  document: TOONDocument;
  symbols: Map<string, ParsedSymbol>;
  metadata: {
    lineCount: number;
    tokenCount: number;
    parsedAt: string;
  };
  errors: ParseError[];
  warnings: ParseWarning[];
}

interface SymbolLocation {
  symbol: string;
  line: number;
  type: 'phase' | 'feature' | 'user-story' | 'acceptance-criteria';
}
```

**Dependencies:**
- src/toon/types.ts - Type definitions
- src/toon/utils/error-handler.ts - Error handling utilities

**Implementation Notes:**
```typescript
class TOONParserImpl implements TOONParser {
  constructor(
    private errorHandler: ErrorHandler,
    private symbolExtractor: SymbolExtractor
  ) {}

  parse(content: string): TOONParseResult {
    const lines = content.split('\n');
    const errors: ParseError[] = [];
    const warnings: ParseWarning[] = [];

    // Extract document header
    const header = this.parseHeader(lines, errors);

    // Extract symbols
    const symbols = this.symbolExtractor.extract(content);

    // Parse sections
    const sections = this.parseSections(lines, symbols, errors, warnings);

    // Build document object
    const document = this.buildDocument(header, sections);

    return {
      document,
      symbols,
      metadata: {
        lineCount: lines.length,
        tokenCount: this.countTokens(content),
        parsedAt: new Date().toISOString()
      },
      errors,
      warnings
    };
  }

  private parseHeader(lines: string[], errors: ParseError[]): DocumentHeader {
    // Implementation
  }

  private parseSections(
    lines: string[],
    symbols: Map<string, ParsedSymbol>,
    errors: ParseError[],
    warnings: ParseWarning[]
  ): ParsedSection[] {
    // Implementation
  }

  private buildDocument(header: DocumentHeader, sections: ParsedSection[]): TOONDocument {
    // Implementation
  }

  private countTokens(content: string): number {
    // Use tiktoken or simple approximation
    return Math.ceil(content.length / 4);
  }
}
```

#### @ref Resolver

**Purpose:** Resolve symbol references within TOON documents

**Responsibilities:**
- Build symbol table from document
- Resolve @ref references to their targets
- Detect circular reference chains
- Report unresolved references

**Interfaces:**

```typescript
interface RefResolver {
  /**
   * Resolve all @ref references in document
   * @param document - Parsed TOON document
   * @param symbols - Symbol table from parser
   * @returns Document with resolved references
   * @throws ReferenceError if references cannot be resolved
   */
  resolve(
    document: TOONDocument,
    symbols: Map<string, ParsedSymbol>
  ): ResolvedDocument;

  /**
   * Detect circular reference chains
   * @param document - Document with references
   * @returns List of circular chains found
   */
  detectCycles(document: TOONDocument): CircularChain[];

  /**
   * Build symbol table from parsed document
   * @param symbols - Parsed symbols
   * @returns Symbol table for lookups
   */
  buildSymbolTable(symbols: Map<string, ParsedSymbol>): SymbolTable;
}

interface ResolvedDocument {
  document: TOONDocument;
  resolvedRefs: Map<string, ResolvedReference>;
  unresolvedRefs: string[];
  cycles: CircularChain[];
}

interface ResolvedReference {
  from: {
    symbol: string;
    line: number;
  };
  to: {
    symbol: string;
    line: number;
    type: string;
  };
}

interface CircularChain {
  symbols: string[];
  path: ResolvedReference[];
}

interface SymbolTable {
  has(symbol: string): boolean;
  get(symbol: string): ParsedSymbol | undefined;
  getAll(): Map<string, ParsedSymbol>;
}
```

**Dependencies:**
- src/toon/types.ts - Type definitions
- src/toon/parser.ts - Parse results

**Implementation Notes:**
```typescript
class RefResolverImpl implements RefResolver {
  private readonly MAX_REF_DEPTH = 100;

  resolve(
    document: TOONDocument,
    symbols: Map<string, ParsedSymbol>
  ): ResolvedDocument {
    const symbolTable = this.buildSymbolTable(symbols);
    const resolvedRefs = new Map<string, ResolvedReference>();
    const unresolvedRefs: string[] = [];

    // Resolve all references
    this.resolveReferences(document, symbolTable, resolvedRefs, unresolvedRefs);

    // Detect cycles
    const cycles = this.detectCycles(document);

    return {
      document,
      resolvedRefs,
      unresolvedRefs,
      cycles
    };
  }

  buildSymbolTable(symbols: Map<string, ParsedSymbol>): SymbolTable {
    return new SymbolTableImpl(symbols);
  }

  detectCycles(document: TOONDocument): CircularChain[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const cycles: CircularChain[] = [];

    const visit = (symbol: string, path: string[]) => {
      if (visiting.has(symbol)) {
        // Found a cycle
        const cycleStart = path.indexOf(symbol);
        cycles.push({
          symbols: path.slice(cycleStart),
          path: this.buildPath(path.slice(cycleStart))
        });
        return;
      }

      if (visited.has(symbol) || path.length > this.MAX_REF_DEPTH) {
        return;
      }

      visiting.add(symbol);
      path.push(symbol);

      // Visit references
      const refs = this.getReferences(symbol, document);
      for (const ref of refs) {
        visit(ref, [...path]);
      }

      visiting.delete(symbol);
      visited.add(symbol);
    };

    // Start DFS from each symbol
    for (const symbol of this.getAllSymbols(document)) {
      if (!visited.has(symbol)) {
        visit(symbol, []);
      }
    }

    return cycles;
  }

  private resolveReferences(
    document: TOONDocument,
    symbolTable: SymbolTable,
    resolvedRefs: Map<string, ResolvedReference>,
    unresolvedRefs: string[]
  ): void {
    // Implementation
  }

  private getReferences(symbol: string, document: TOONDocument): string[] {
    // Implementation
  }

  private getAllSymbols(document: TOONDocument): string[] {
    // Implementation
  }

  private buildPath(symbols: string[]): ResolvedReference[] {
    // Implementation
  }
}
```

#### Schema Validator

**Purpose:** Validate TOON documents against schema

**Responsibilities:**
- Validate required fields present
- Validate data types (strings, enums, arrays)
- Validate @ref references resolve
- Validate enum values (status, priority)
- Return detailed error messages

**Interfaces:**

```typescript
interface TOONValidator {
  /**
   * Validate TOON document against schema
   * @param document - Document to validate
   * @returns Validation result with errors and warnings
   */
  validate(document: TOONDocument): ValidationResult;

  /**
   * Validate required fields for document type
   * @param document - Document to validate
   * @param type - Document type (requirements, architecture, etc.)
   * @returns Validation result
   */
  validateType(document: TOONDocument, type: DocumentType): ValidationResult;

  /**
   * Validate @ref references in document
   * @param document - Document to validate
   * @param symbolTable - Available symbols
   * @returns Reference validation result
   */
  validateReferences(
    document: TOONDocument,
    symbolTable: SymbolTable
  ): ReferenceValidationResult;
}

interface ValidationResult {
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

interface ValidationError {
  field: string;
  message: string;
  code: ErrorCode;
  line?: number;
  severity: 'error' | 'warning';
}

enum ErrorCode {
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_ENUM = 'INVALID_ENUM',
  INVALID_FORMAT = 'INVALID_FORMAT',
  REF_NOT_FOUND = 'REF_NOT_FOUND',
  CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE'
}

enum DocumentType {
  REQUIREMENTS = 'requirements',
  ARCHITECTURE = 'architecture',
  DETAILED_DESIGN = 'detailed-design',
  TEST_SPECIFICATION = 'test-specification'
}
```

**Dependencies:**
- src/toon/types.ts - Type definitions
- src/toon/schemas/*.ts - Zod schemas

**Implementation Notes:**
```typescript
class TOONValidatorImpl implements TOONValidator {
  private schemas: Map<DocumentType, z.ZodSchema>;

  constructor() {
    this.schemas = this.loadSchemas();
  }

  validate(document: TOONDocument): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate against base schema
    const baseResult = this.validateBaseSchema(document);
    errors.push(...baseResult.errors);
    warnings.push(...baseResult.warnings);

    // Validate specific type based on document content
    const docType = this.detectDocumentType(document);
    const typeResult = this.validateType(document, docType);
    errors.push(...typeResult.errors);
    warnings.push(...typeResult.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: this.buildSummary(errors, warnings)
    };
  }

  validateType(document: TOONDocument, type: DocumentType): ValidationResult {
    const schema = this.schemas.get(type);
    if (!schema) {
      return {
        valid: false,
        errors: [{
          field: 'document',
          message: `No schema found for type: ${type}`,
          code:ErrorCode.INVALID_FORMAT,
          severity: 'error'
        }],
        warnings: [],
        summary: { totalFields: 0, validFields: 0, invalidFields: 0, missingFields: 0 }
      };
    }

    return this.validateWithSchema(document, schema);
  }

  validateReferences(
    document: TOONDocument,
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
      summary: { totalFields: refs.length, validFields: refs.length - errors.length, invalidFields: errors.length, missingFields: 0 }
    };
  }

  private loadSchemas(): Map<DocumentType, z.ZodSchema> {
    // Load Zod schemas from schemas/ directory
    const schemas = new Map<DocumentType, z.ZodSchema>();

    schemas.set(DocumentType.REQUIREMENTS, requirementsSchema);
    schemas.set(DocumentType.ARCHITECTURE, architectureSchema);
    schemas.set(DocumentType.DETAILED_DESIGN, detailedDesignSchema);
    schemas.set(DocumentType.TEST_SPECIFICATION, testSpecificationSchema);

    return schemas;
  }

  private validateBaseSchema(document: TOONDocument): ValidationResult {
    // Validate against TOONDocument schema
    // Implementation
  }

  private validateWithSchema(document: TOONDocument, schema: z.ZodSchema): ValidationResult {
    const result = schema.safeParse(document);

    if (result.success) {
      return {
        valid: true,
        errors: [],
        warnings: [],
        summary: { totalFields: 0, validFields: 0, invalidFields: 0, missingFields: 0 }
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
      summary: { totalFields: result.error.errors.length, validFields: 0, invalidFields: result.error.errors.length, missingFields: 0 }
    };
  }

  private detectDocumentType(document: TOONDocument): DocumentType {
    // Detect document type from content
    // Implementation
    return DocumentType.REQUIREMENTS;
  }

  private buildSummary(errors: ValidationError[], warnings: ValidationWarning[]) {
    // Implementation
  }

  private extractReferences(document: TOONDocument): ExtractedReference[] {
    // Implementation
  }

  private mapZodErrorToErrorCode(err: z.ZodIssue): ErrorCode {
    // Map Zod error codes to our error codes
    // Implementation
    return ErrorCode.INVALID_TYPE;
  }
}
```

#### Token Counter

**Purpose:** Calculate token count for TOON documents

**Responsibilities:**
- Count tokens in document content
- Compare token counts (TOON vs JSON vs Markdown)
- Report token efficiency metrics

**Interfaces:**

```typescript
interface TokenCounter {
  /**
   * Count tokens in content
   * @param content - Content to count
   * @returns Token count
   */
  countTokens(content: string): number;

  /**
   * Compare token counts between formats
   * @param toon - TOON content
   * @param json - Equivalent JSON content
   * @param markdown - Equivalent Markdown content
   * @returns Comparison result
   */
  compare(toon: string, json: string, markdown: string): TokenComparison;
}

interface TokenComparison {
  toon: { tokens: number; chars: number };
  json: { tokens: number; chars: number };
  markdown: { tokens: number; chars: number };
  savings: {
    vsJson: { tokens: number; percentage: number };
    vsMarkdown: { tokens: number; percentage: number };
  };
}
```

**Dependencies:**
- tiktoken - Token counting library

#### Template Loader

**Purpose:** Load TOON templates from file system

**Responsibilities:**
- Load template files by name
- Search templates directory
- Detect template format (.toon.md vs .md)
- Parse loaded templates

**Interfaces:**

```typescript
interface TemplateLoader {
  /**
   * Load template by name
   * @param name - Template name (e.g., 'requirements')
   * @param preferredFormat - Preferred format ('toon' or 'markdown')
   * @returns Loaded and parsed template
   * @throws TemplateNotFoundError if template not found
   */
  loadTemplate(name: string, preferredFormat?: 'toon' | 'markdown'): LoadedTemplate;

  /**
   * List all available templates
   * @returns List of template names and formats
   */
  listTemplates(): TemplateInfo[];

  /**
   * Check if template exists
   * @param name - Template name
   * @returns True if template exists
   */
  hasTemplate(name: string): boolean;

  /**
   * Get template metadata without loading
   * @param name - Template name
   * @returns Template metadata
   */
  getTemplateMetadata(name: string): TemplateMetadata;
}

interface LoadedTemplate {
  name: string;
  format: 'toon' | 'markdown';
  content: string;
  document?: TOONDocument;
  metadata: TemplateMetadata;
}

interface TemplateInfo {
  name: string;
  formats: ('toon' | 'markdown')[];
  metadata: TemplateMetadata;
}

interface TemplateMetadata {
  name: string;
  description?: string;
  version?: string;
  lastModified: string;
  size: number;
  tokens: number;
}
```

#### Template Wizard

**Purpose:** Interactive template completion guidance

**Responsibilities:**
- Identify empty/required fields
- Prompt user for input
- Validate user input
- Complete template

**Interfaces:**

```typescript
interface TemplateWizard {
  /**
   * Guide user through template completion
   * @param template - Template to complete
   * @param context - Project context for pre-filling
   * @returns Completed template
   */
  guide(template: TOONDocument, context?: WizardContext): Promise<CompletedTemplate>;

  /**
   * Prompt user for specific field
   * @param field - Field configuration
   * @param currentValue - Current value (if any)
   * @returns User input
   */
  prompt(field: FieldConfig, currentValue?: string): Promise<string>;

  /**
   * Validate user input for field
   * @param field - Field configuration
   * @param value - User input
   * @returns Validation result
   */
  validateField(field: FieldConfig, value: string): FieldValidationResult;
}

interface WizardContext {
  projectName?: string;
  projectVersion?: string;
  author?: string;
  tags?: string[];
  previousAnswers?: Map<string, string>;
}

interface CompletedTemplate {
  document: TOONDocument;
  changes: FieldChange[];
  completedAt: string;
}

interface FieldConfig {
  name: string;
  type: 'text' | 'multiline' | 'enum' | 'array' | 'date';
  required: boolean;
  prompt: string;
  defaultValue?: string;
  enumOptions?: string[];
  validation?: RegExp | ((value: string) => boolean);
  placeholder?: string;
  helpText?: string;
}

interface FieldChange {
  field: string;
  oldValue: string | undefined;
  newValue: string;
  timestamp: string;
}

interface FieldValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

**Simplified Implementation:**

```typescript
/**
 * Simplified Wizard Implementation
 * Uses builder pattern for cleaner configuration
 */

// Core field configuration - only essential properties
interface SimpleFieldConfig {
  name: string;
  type: 'text' | 'multiline' | 'enum' | 'array' | 'date';
  required: boolean;
  prompt: string;
  // Optional: only add when needed
  defaultValue?: string;
  validation?: RegExp;
}

// Builder for wizard configuration
class WizardConfigBuilder {
  private fields: SimpleFieldConfig[] = [];

  addField(config: SimpleFieldConfig): this {
    this.fields.push(config);
    return this;
  }

  build(): SimpleFieldConfig[] {
    return [...this.fields];
  }
}

// Simplified validation module
class FieldValidator {
  private static validators = new Map<string, (value: string) => boolean>();

  static register(name: string, validator: (value: string) => boolean): void {
    this.validators.set(name, validator);
  }

  static validate(config: SimpleFieldConfig, value: string): FieldValidationResult {
    const errors: string[] = [];

    // Check required
    if (config.required && !value) {
      errors.push(`${config.name} is required`);
      return { valid: false, errors, warnings: [] };
    }

    // Run type-specific validation
    if (value) {
      if (config.type === 'date' && isNaN(Date.parse(value))) {
        errors.push(`${config.name} must be a valid date`);
      }
      if (config.validation && !config.validation.test(value)) {
        errors.push(`${config.name} format is invalid`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }
}

// Simplified wizard with separated concerns
class SimpleTemplateWizard implements TemplateWizard {
  private configBuilder = new WizardConfigBuilder();

  configure(config: SimpleFieldConfig[]): void {
    config.forEach(field => this.configBuilder.addField(field));
  }

  async guide(template: TOONDocument): Promise<CompletedTemplate> {
    const config = this.configBuilder.build();
    const changes: FieldChange[] = [];

    for (const fieldConfig of config) {
      const currentValue = this.getFieldValue(template, fieldConfig.name);
      const newValue = await this.prompt(fieldConfig, currentValue);

      const validation = FieldValidator.validate(fieldConfig, newValue);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      this.setFieldValue(template, fieldConfig.name, newValue);
      changes.push({
        field: fieldConfig.name,
        oldValue: currentValue,
        newValue,
        timestamp: new Date().toISOString()
      });
    }

    return {
      document: template,
      changes,
      completedAt: new Date().toISOString()
    };
  }

  async prompt(field: SimpleFieldConfig, currentValue?: string): Promise<string> {
    // CLI prompt implementation
    if (currentValue) {
      console.log(`${field.prompt} [${currentValue}]:`);
    } else {
      console.log(`${field.prompt}:`);
    }
    // Return user input
    return currentValue || '';
  }

  private getFieldValue(doc: TOONDocument, field: string): string {
    return (doc as any)[field] || '';
  }

  private setFieldValue(doc: TOONDocument, field: string, value: string): void {
    (doc as any)[field] = value;
  }

  validateField(field: SimpleFieldConfig, value: string): FieldValidationResult {
    return FieldValidator.validate(field, value);
  }
}
```

---

## 3. Data Models

### Entity Definitions

#### TOONDocument

| Attribute | Type | Constraints | Default | Validation |
|-----------|------|-------------|---------|------------|
| name | string | Required, max 100 chars | - | Must be alphanumeric with hyphens |
| description | string | Required, max 500 chars | - | Required |
| version | string | Required, semver format | - | Must match ^\d+\.\d+\.\d+$ |
| created_at | string | Required, ISO 8601 | - | Must be valid ISO date |
| updated_at | string | Required, ISO 8601 | - | Must be valid ISO date |
| status | enum | Required | draft | One of: draft, active, deprecated, superseded |
| tags | string[] | Optional | [] | Max 10 tags, max 50 chars each |
| phases | string[] | Optional | [] | @ref references to phase symbols |
| timeline | string | Optional | - | @ref reference to timeline symbol |

**Example:**
```typescript
interface TOONDocument {
  name: string;              // e.g., "toon-integration-test-feature"
  description: string;       // e.g., "Integrate TOON format into DevFlow"
  version: string;           // e.g., "1.0.0"
  created_at: string;        // e.g., "2026-02-13T10:00:00Z"
  updated_at: string;        // e.g., "2026-02-13T10:00:00Z"
  status: "draft" | "active" | "deprecated" | "superseded";
  tags: string[];            // e.g., ["toon", "integration", "test"]
  phases?: string[];         // e.g., ["@ref:phase1", "@ref:phase2"]
  timeline?: string;          // e.g., "@ref:timeline"
}
```

#### TOONPhase

| Attribute | Type | Constraints | Default | Validation |
|-----------|------|-------------|---------|------------|
| name | string | Required, unique | - | Must be unique within document |
| description | string | Required, max 500 chars | - | Required |
| version | string | Required, semver format | - | Must match ^\d+\.\d+\.\d+$ |
| timeline | string | Required | - | Timeline description |
| priority | enum | Required | - | One of: high, medium, low |
| start_date | string | Required, ISO 8601 | - | Must be valid ISO date |
| target_date | string | Required, ISO 8601 | - | Must be valid ISO date, after start_date |
| features | string[] | Optional | [] | @ref references to feature symbols |
| success_criteria | TOONSuccessCriteria | Optional | - | Optional success criteria |

#### TOONFeature

| Attribute | Type | Constraints | Default | Validation |
|-----------|------|-------------|---------|------------|
| name | string | Required, unique | - | Must be unique within document |
| description | string | Optional, max 500 chars | - | Optional description |
| phase | string | Required | - | @ref reference to phase |
| priority | enum | Required | - | One of: high, medium, low |
| effort | string | Required | - | Time estimate (e.g., "2 weeks") |
| team | string | Required | - | Team size (e.g., "2 developers") |
| status | enum | Required | planned | One of: planned, in-progress, completed, blocked, cancelled |
| user_stories | string[] | Optional | [] | @ref references to user story symbols |
| acceptance_criteria | string[] | Optional | [] | @ref references to acceptance criteria symbols |
| technical_specs | string | Optional | - | @ref reference to technical specs |
| created_at | string | Required, ISO 8601 | - | Must be valid ISO date |

### Relationships

```
TOONDocument ──┬──> TOONPhase (1:N)
               │
               ├──> Timeline (1:1)
               │
               └──> Release (1:N, via Timeline)

TOONPhase ──┬──> TOONFeature (1:N)
            │
            └──> TOONPhase (N:N, via dependencies)

TOONFeature ──┬──> TOONUserStory (1:N)
              │
              └──> TOONAcceptanceCriteria (1:N)
```

**Relationship Table:**

| From | To | Type | Cardinality | Foreign Key |
|------|-----|------|-------------|-------------|
| TOONDocument | TOONPhase | One-to-Many | 1:N | phases[] (@ref) |
| TOONDocument | Timeline | One-to-One | 1:1 | timeline (@ref) |
| TOONPhase | TOONFeature | One-to-Many | 1:N | features[] (@ref) |
| TOONPhase | TOONPhase | Many-to-Many | N:N | dependencies[] (@ref) |
| TOONFeature | TOONUserStory | One-to-Many | 1:N | user_stories[] (@ref) |
| TOONFeature | TOONAcceptanceCriteria | One-to-Many | 1:N | acceptance_criteria[] (@ref) |

### Zod Schemas

**File:** `src/toon/schemas/document.schema.ts`

```typescript
import { z } from 'zod';

/**
 * Zod schema for TOONDocument
 * Provides runtime validation and TypeScript type inference
 */
export const toonDocumentSchema = z.object({
  name: z.string()
    .min(1, 'Document name is required')
    .max(100, 'Document name must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Document name must be lowercase alphanumeric with hyphens'),

  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),

  version: z.string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format (e.g., 1.0.0)'),

  created_at: z.string()
    .datetime('Created date must be a valid ISO 8601 datetime'),

  updated_at: z.string()
    .datetime('Updated date must be a valid ISO 8601 datetime'),

  status: z.enum(['draft', 'active', 'deprecated', 'superseded'], {
    errorMap: () => ({ message: 'Status must be one of: draft, active, deprecated, superseded' })
  }),

  tags: z.array(z.string()
    .max(50, 'Tag must be less than 50 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),

  phases: z.array(z.string()
    .startsWith('@ref:', 'Phase reference must start with @ref:'))
    .optional(),

  timeline: z.string()
    .startsWith('@ref:', 'Timeline reference must start with @ref:')
    .optional()
});

// Infer TypeScript type from schema
export type ToonDocumentSchema = z.infer<typeof toonDocumentSchema>;
```

---

## 4. API Specifications

### Module API (Internal)

#### Parser API

```typescript
// src/toon/parser.ts
export interface TOONParser {
  parse(content: string): TOONParseResult;
  extractSymbols(content: string): Map<string, SymbolLocation>;
  validateStructure(content: string): StructureValidationResult;
}

export class TOONParserImpl implements TOONParser {
  constructor(options?: ParserOptions);
  parse(content: string): TOONParseResult;
  extractSymbols(content: string): Map<string, SymbolLocation>;
  validateStructure(content: string): StructureValidationResult;
}

export interface ParserOptions {
  maxFileSize?: number;          // Default: 100KB
  maxDepth?: number;             // Default: 100
  strictMode?: boolean;           // Default: true
}
```

#### Resolver API

```typescript
// src/toon/resolver.ts
export interface RefResolver {
  resolve(document: TOONDocument, symbols: Map<string, ParsedSymbol>): ResolvedDocument;
  detectCycles(document: TOONDocument): CircularChain[];
  buildSymbolTable(symbols: Map<string, ParsedSymbol>): SymbolTable;
}

export class RefResolverImpl implements RefResolver {
  constructor(options?: ResolverOptions);
  resolve(document: TOONDocument, symbols: Map<string, ParsedSymbol>): ResolvedDocument;
  detectCycles(document: TOONDocument): CircularChain[];
  buildSymbolTable(symbols: Map<string, ParsedSymbol>): SymbolTable;
}

export interface ResolverOptions {
  maxDepth?: number;             // Default: 100
  allowExternalRefs?: boolean;    // Default: false
}
```

#### Validator API

```typescript
// src/toon/validator.ts
export interface TOONValidator {
  validate(document: TOONDocument): ValidationResult;
  validateType(document: TOONDocument, type: DocumentType): ValidationResult;
  validateReferences(document: TOONDocument, symbolTable: SymbolTable): ReferenceValidationResult;
}

export class TOONValidatorImpl implements TOONValidator {
  constructor();
  validate(document: TOONDocument): ValidationResult;
  validateType(document: TOONDocument, type: DocumentType): ValidationResult;
  validateReferences(document: TOONDocument, symbolTable: SymbolTable): ReferenceValidationResult;
}
```

#### Template Loader API

```typescript
// src/templates/loader.ts
export interface TemplateLoader {
  loadTemplate(name: string, preferredFormat?: 'toon' | 'markdown'): LoadedTemplate;
  listTemplates(): TemplateInfo[];
  hasTemplate(name: string): boolean;
  getTemplateMetadata(name: string): TemplateMetadata;
}

export class TemplateLoaderImpl implements TemplateLoader {
  constructor(options?: LoaderOptions);
  loadTemplate(name: string, preferredFormat?: 'toon' | 'markdown'): LoadedTemplate;
  listTemplates(): TemplateInfo[];
  hasTemplate(name: string): boolean;
  getTemplateMetadata(name: string): TemplateMetadata;
}

export interface LoaderOptions {
  templatesDir?: string;         // Default: './templates'
  cacheEnabled?: boolean;        // Default: true
}
```

#### Wizard API

```typescript
// src/templates/wizard.ts
export interface TemplateWizard {
  guide(template: TOONDocument, context?: WizardContext): Promise<CompletedTemplate>;
  prompt(field: FieldConfig, currentValue?: string): Promise<string>;
  validateField(field: FieldConfig, value: string): FieldValidationResult;
}

export class TemplateWizardImpl implements TemplateWizard {
  constructor(options?: WizardOptions);
  guide(template: TOONDocument, context?: WizardContext): Promise<CompletedTemplate>;
  prompt(field: FieldConfig, currentValue?: string): Promise<string>;
  validateField(field: FieldConfig, value: string): FieldValidationResult;
}

export interface WizardOptions {
  interactive?: boolean;          // Default: true
  autoFill?: boolean;            // Default: true
}
```

### CLI Integration

```typescript
// Slash Commands for Claude Code
export interface DevFlowCommands {
  // Start a new DevFlow phase
  start: (phase: string, options?: StartOptions) => Promise<void>;

  // Validate TOON document
  validate: (options?: ValidateOptions) => Promise<ValidationResult>;

  // Convert markdown to TOON
  convert: (options?: ConvertOptions) => Promise<void>;

  // Run template wizard
  wizard: (options?: WizardOptions) => Promise<void>;
}

export interface StartOptions {
  format?: 'toon' | 'markdown';  // Default: 'toon'
  template?: string;              // Auto-detected from phase
}

export interface ValidateOptions {
  file?: string;                  // Default: current document
  strict?: boolean;               // Default: true
}

export interface ConvertOptions {
  input?: string;                 // Default: current document
  output?: string;                // Auto-generated
  format?: 'toon' | 'markdown';  // Default: 'toon'
}

export interface WizardOptions {
  template?: string;              // Required
  context?: WizardContext;
}
```

---

## 5. Business Logic Flows

### Template Loading Flow

```
┌─────────────────┐
│ Agent Command   │
│ /devflow-start │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Determine Phase │ ──→ │ Map to Template │
│   (e.g., reqs) │     │   (requirements)│
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Check Formats  │
│  .toon.md .md  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌─────────┐
│ .toon.md│ │  .md    │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Parse   │ │  Load   │
│  TOON   │ │  Direct │
└────┬────┘ └────┬────┘
     │           │
     └─────┬─────┘
           ▼
    ┌─────────────────┐
    │  Validate @ref  │
    │   Check Schema  │
    └────────┬────────┘
             │
        ┌────┴────┐
        │         │
        ▼         ▼
    ┌──────┐ ┌──────────┐
    │ Valid│ │ Invalid  │
    └──┬───┘ └────┬─────┘
       │         │
       ▼         ▼
    ┌──────┐ ┌──────────┐
    │Return│ │  Report  │
    │Template│ │  Errors  │
    └──────┘ └──────────┘
```

**Step 1: Determine Phase**

- **Input:** Agent context, current working directory
- **Process:** Map agent phase to template name
- **Output:** Template name (e.g., "requirements")
- **Validation:** Phase must be valid DevFlow phase
- **Error Handling:** Invalid phase → Error with list of valid phases

**Step 2: Check Available Formats**

- **Input:** Template name
- **Process:** Search templates directory for .toon.md and .md files
- **Output:** Available formats list
- **Validation:** At least one format must exist
- **Error Handling:** Template not found → Error with available templates

**Step 3: Load and Parse**

- **Input:** Template file path
- **Process:** Read file content, parse if .toon.md
- **Output:** Parsed document object
- **Validation:** File must be readable, parseable
- **Error Handling:** Parse error → Detailed error with line number

**Step 4: Validate References**

- **Input:** Parsed document
- **Process:** Resolve @ref references, detect cycles
- **Output:** Resolved document with validation report
- **Validation:** All references must resolve
- **Error Handling:** Unresolved reference → Error with reference path

### Template Wizard Flow

```
┌─────────────────┐
│ Load Template   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Extract Fields  │
│ (empty/required)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Pre-fill from  │
│ Project Context│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ For Each Field  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Has Value?      │ ──→ │ Validate Field  │
└────────┬────────┘     └────────┬────────┘
         │                      │
    ┌────┴────┐                │
    │         │                │
    ▼         ▼                ▼
┌──────┐ ┌─────────┐     ┌─────────┐
│ Yes  │ │   No    │     │ Valid?  │
└──┬───┘ └────┬────┘     └────┬────┘
   │          │              │
   │          ▼          ┌───┴───┐
   │    ┌─────────┐      │       │
   │    │  Prompt │      ▼       ▼
   │    │  User   │   ┌──────┐ ┌──────┐
   │    └────┬────┘   │  Yes │ │  No  │
   │         │         └──┬───┘ └──┬───┘
   │         │            │        │
   │         ▼            ▼        ▼
   │    ┌─────────┐ ┌──────┐ ┌──────────┐
   │    │ Validate│ │ Save ││ Reprompt │
   │    │  Input  │ │ Value││   User   │
   │    └────┬────┘ └──┬───┘ └──────────┘
   │         │          │
   └─────────┴──────────┘
              │
              ▼
       ┌─────────────────┐
       │  Save Document  │
       │   Report Changes│
       └─────────────────┘
```

**Step 1: Load Template**

- **Input:** Template name or path
- **Process:** Use TemplateLoader to load template
- **Output:** Parsed TOON document
- **Validation:** Template must load successfully
- **Error Handling:** Load error → Report and exit

**Step 2: Extract Empty Fields**

- **Input:** Parsed document
- **Process:** Identify required fields without values
- **Output:** List of fields to complete
- **Validation:** Field metadata must exist
- **Error Handling:** No fields to complete → Report completion

**Step 3: Pre-fill from Context**

- **Input:** Field list, project context
- **Process:** Match fields to context values
- **Output:** Pre-filled document
- **Validation:** Context values must match field types
- **Error Handling:** Type mismatch → Skip field

**Step 4: Interactive Prompting**

- **Input:** Field configuration
- **Process:** Display prompt, accept user input
- **Output:** User input value
- **Validation:** Field-specific validation
- **Error Handling:** Invalid input → Display error, re-prompt

**Step 5: Save Document**

- **Input:** Completed document
- **Process:** Write to file with .toon.md extension
- **Output:** Saved file path
- **Validation:** File must be writable
- **Error Handling:** Write error → Report with details

### State Machines

#### Document Status State Machine

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌────────────┐
│  Draft  │ ──→ │  Active │ ──→ │Deprecated│ ──→ │ Superseded │
└─────────┘     └─────────┘     └──────────┘     └────────────┘
     │               ▲                ▲                ▲
     │               │                │                │
     └───────────────┴────────────────┴────────────────┘
              (on approval or lifecycle change)
```

**State Transitions:**

| Current State | Event | Next State | Action |
|---------------|-------|------------|--------|
| draft | approved | active | Update status, notify |
| draft | rejected | draft | Keep draft, add comments |
| active | deprecated | deprecated | Update status, archive |
| active | superseded | superseded | Update status, link to replacement |
| deprecated | restored | active | Update status, unarchive |
| any | deleted | deleted | Remove document (soft delete) |

---

## 6. Security Design

### @ref Reference Validation

```
[Parse @ref] → [Validate Symbol] → [Check Type]
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                              ▼                       ▼
                         [Valid Symbol]         [Invalid Symbol]
                              │                       │
                              ▼                       ▼
                         [Resolve Ref]          [Security Error]
```

**Security Measures:**

1. **Symbol Whitelist:** Only allow symbols defined in document
2. **Path Traversal Prevention:** Validate all file paths
3. **Depth Limiting:** Maximum @ref chain depth (100)
4. **Circular Reference Detection:** Prevent infinite loops

### Data Sanitization

| Data Type | Sanitization | Validation |
|-----------|--------------|------------|
| Document content | Remove executable code patterns | Regex scan |
| @ref symbols | Allowlist pattern matching | ^[a-zA-Z0-9-_]+$ |
| File paths | Restrict to templates directory | Path validation |
| User input | HTML escaping, code injection prevention | XSS filters |

---

## 7. Error Handling

### Error Categories

| Category | Code | Format | Example |
|----------|------|--------|---------|
| Parse Error | PARSE_ERROR | {code, message, line, column} | Invalid syntax at line 45 |
| Reference Error | REF_ERROR | {code, message, symbol, line} | Unresolved @ref:phase1 |
| Validation Error | VALIDATION_ERROR | {code, message, field} | Missing required field: name |
| Template Error | TEMPLATE_ERROR | {code, message, template} | Template not found: xyz |
| Circular Reference | CIRCULAR_REF | {code, message, chain} | Circular reference: a→b→a |

### Error Response Format

```typescript
interface TOONError {
  code: ErrorCode;
  message: string;
  details?: {
    line?: number;
    column?: number;
    field?: string;
    symbol?: string;
    chain?: string[];
  };
  timestamp: string;
}

enum ErrorCode {
  PARSE_ERROR = 'PARSE_ERROR',
  REF_ERROR = 'REF_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TEMPLATE_ERROR = 'TEMPLATE_ERROR',
  CIRCULAR_REF = 'CIRCULAR_REF',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  INVALID_FORMAT = 'INVALID_FORMAT'
}
```

---

## 8. Performance Design

### Performance Targets

| Metric | Target | Measurement | Strategy |
|--------|--------|-------------|----------|
| TOON Parse Time | < 100ms | Benchmark with 1000 token doc | Stream processing |
| @ref Resolution | < 50ms | Symbol table lookup | HashMap-based |
| Schema Validation | < 150ms | Zod validation | Lazy validation |
| Token Counting | < 50ms | tiktoken library | Batch counting |
| Template Load | < 200ms | File I/O measurement | Caching |

### Caching Strategy

| Cache Type | TTL | Invalidation | Use Case |
|------------|-----|--------------|----------|
| Parsed Templates | Session | File change | Speed up repeated loads |
| Symbol Tables | Session | Document change | Fast @ref resolution |
| Token Counts | Permanent | Content change | Display metrics |
| Schema Validation | 5 min | Schema change | Reduce validation overhead |

**Concrete Implementation Details:**

#### 1. Cache Key Generation
```typescript
// Template cache key format: `template:name:hash`
function generateCacheKey(name: string, content: string): string {
  const hash = createHash('md5').update(content).digest('hex').substring(0, 8);
  return `template:${name}:${hash}`;
}

// Symbol table cache key: `symbols:docHash`
function generateSymbolCacheKey(document: TOONDocument): string {
  const docHash = createHash('md5').update(JSON.stringify(document)).digest('hex');
  return `symbols:${docHash}`;
}
```

#### 2. LRU Cache Configuration
```typescript
import { LRUCache } from 'lru-cache';

// Template cache with 100 MB limit, 100 entry max
const templateCache = new LRUCache<string, LoadedTemplate>({
  max: 100,
  maxSize: 100 * 1024 * 1024, // 100 MB
  sizeCalculation: (value) => value.content.length,
  ttl: 1000 * 60 * 30, // 30 minutes
});

// Symbol table cache with 50 entry max
const symbolCache = new LRUCache<string, SymbolTable>({
  max: 50,
  ttl: 1000 * 60 * 30, // 30 minutes
});
```

#### 3. File Change Detection
```typescript
import { watch } from 'chokidar';

// Watch templates directory for changes
const watcher = watch('./templates', {
  persistent: true,
  ignoreInitial: true
});

watcher.on('change', (path) => {
  // Invalidate cache entries for this template
  const templateName = path.basename(path, '.toon.md');
  invalidateTemplateCache(templateName);
});

watcher.on('unlink', (path) => {
  const templateName = path.basename(path, '.toon.md');
  invalidateTemplateCache(templateName);
});
```

#### 4. Cache Warming Strategy
```typescript
// On startup, pre-load frequently used templates
async function warmCache() {
  const frequentTemplates = ['requirements', 'architecture', 'detailed-design'];

  for (const name of frequentTemplates) {
    try {
      await loader.loadTemplate(name, 'toon');
      logger.info(`Warmed cache for template: ${name}`);
    } catch (error) {
      logger.warn(`Failed to warm cache for ${name}: ${error.message}`);
    }
  }
}
```

#### 5. Memory Limits and Eviction
```typescript
// Configure cache eviction when memory limits approached
const TOTAL_MEMORY_LIMIT = 200 * 1024 * 1024; // 200 MB

function checkMemoryPressure(): boolean {
  const usage = process.memoryUsage();
  const used = usage.heapUsed;
  return (used / TOTAL_MEMORY_LIMIT) > 0.8; // 80% threshold
}

// Evict least recently used entries when memory pressure detected
setInterval(() => {
  if (checkMemoryPressure()) {
    templateCache.purgeStale();
    symbolCache.purgeStale();
    logger.info('Purged stale cache entries due to memory pressure');
  }
}, 60000); // Check every minute
```

---

## 9. Scalability Design

### File System Scalability

```
┌──────────────────────────────────────┐
│     Templates Directory              │
│  ┌─────────┐  ┌─────────┐         │
│  │  .toon  │  │   .md   │         │
│  └─────────┘  └─────────┘         │
│       │            │                │
│       └─────┬──────┘              │
│             ▼                     │
│    ┌─────────────────┐             │
│    │  Index Cache   │             │
│    │  (JSON file)   │             │
│    └─────────────────┘             │
└──────────────────────────────────────┘
```

**Scalability Strategies:**

1. **Template Indexing:** JSON index of all templates for fast lookup
2. **Lazy Loading:** Only load template when requested
3. **Incremental Parsing:** Parse sections on demand
4. **Memory Management:** Limit parsed documents in memory

---

## 10. Implementation Guidelines

### Technology-Specific Guidelines

#### TypeScript 5.1+

**Directory Structure:**
```
src/
├── toon/                    # TOON core module
│   ├── types.ts             # Type definitions
│   ├── parser.ts            # TOON parser
│   ├── resolver.ts          # @ref resolver
│   ├── validator.ts         # Schema validator
│   ├── token-counter.ts     # Token counting
│   ├── schemas/             # Zod schemas
│   │   ├── document.schema.ts
│   │   ├── phase.schema.ts
│   │   └── feature.schema.ts
│   └── utils/              # Utilities
│       ├── error-handler.ts
│       └── constants.ts
├── templates/              # Template system
│   ├── loader.ts           # Template loader
│   ├── wizard.ts           # Interactive wizard
│   ├── converter.ts        # Format converter
│   └── framework.ts       # Validation framework
└── index.ts               # Public API
```

**Coding Standards:**
- Use ESLint 9.x with TypeScript plugin
- Use Prettier 3.x for formatting
- Maximum function complexity: 10 (cyclomatic complexity)
- Maximum file length: 500 lines
- Use strict mode: `"strict": true` in tsconfig.json

**TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Testing Approach

Reference: [test-specification-toon-integration.md](./test-specification-toon-integration.md) (to be created in Phase 5)

**Test Structure:**
```
tests/toon/
├── parser.test.ts         # Parser unit tests
├── resolver.test.ts      # Resolver unit tests
├── validator.test.ts     # Validator unit tests
├── token-counter.test.ts # Token counter tests
├── loader.test.ts        # Template loader tests
├── wizard.test.ts        # Wizard tests
└── integration/
    ├── template-loading.test.ts
    └── end-to-end.test.ts
```

---

## 11. Deployment Design

### Environment Configuration

| Environment | URL | Templates | External Services |
|-------------|-----|-----------|-------------------|
| Development | localhost | Local file system | None |
| Production | NPM package | Bundled templates | None |

### Package Structure

```
@xarlord/devflow-enforcer/
├── dist/                   # Compiled JavaScript
│   └── toon/
│       ├── parser.js
│       ├── resolver.js
│       └── ...
├── templates/              # TOON templates (bundled)
│   ├── requirements.toon.md
│   ├── architecture.toon.md
│   └── ...
├── package.json           # NPM package manifest
├── README.md              # Package documentation
└── LICENSE                # MIT License
```

### Build Process

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/toon/index.ts', 'src/templates/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['tiktoken'],
  outDir: 'dist'
});
```

---

## 12. Monitoring & Observability

### Metrics to Monitor

| Metric | Type | Alert Threshold |
|--------|------|-----------------|
| parse_duration_ms | histogram | p95 > 100ms |
| resolve_duration_ms | histogram | p95 > 50ms |
| validate_duration_ms | histogram | p95 > 150ms |
| template_load_duration_ms | histogram | p95 > 200ms |
| token_count | gauge | > 1000 |
| parse_errors_total | counter | Any increase |
| ref_errors_total | counter | Any increase |

### Logging Strategy

| Level | Use Case | Example |
|-------|----------|---------|
| ERROR | Parse failures, validation errors | "Failed to parse document: Invalid @ref syntax at line 45" |
| WARN | Deprecated features, near limits | "Document approaching token limit: 950/1000" |
| INFO | Template loads, successful parses | "Loaded template: requirements.toon.md (450 tokens)" |
| DEBUG | Detailed parsing steps | "Resolving @ref:phase1 → found symbol" |

---

## 13. Design Review Checklist

- [x] All components specified with interfaces
- [x] Data models defined with validation rules
- [x] API contracts documented
- [x] Business logic flows documented
- [x] Security considerations addressed
- [x] Error handling specified
- [x] Performance targets defined
- [x] Scalability considered
- [x] Deployment strategy defined
- [x] Monitoring approach specified
- [x] TypeScript types implemented (src/toon/types.ts)
- [x] Component interactions designed
- [x] State machines documented
- [x] All 11 functional requirements addressed

---

**Design Specification Status:** Draft
**Approved By:** Pending Review
**Approved Date:** Pending
**Next Review:** After implementation begins (Phase 7)

---

## Change History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-13 | 1.0.0 | Initial detailed design document | System/Software Architect Agent |
