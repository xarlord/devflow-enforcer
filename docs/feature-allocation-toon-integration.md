# TOON Integration - Feature Allocation

**Version:** 1.0.0
**Created:** 2026-02-13
**Architect:** System/Software Architect Agent
**Status:** Draft
**Related Docs:** [requirements-toon-integration.md](./requirements-toon-integration.md) | [detailed-design-toon-integration.md](./detailed-design-toon-integration.md)

---

## 1. Overview

### Purpose

This document allocates functional requirements to development features and assigns them to specialized agents for implementation in Phase 7 (Feature Development Loop).

### Allocation Strategy

| Component | Priority | Complexity | Agent | Estimated Effort |
|-----------|----------|------------|--------|------------------|
| TOON Parser | High | Medium | Typescript Coding Agent | 3 weeks |
| @ref Resolver | High | Medium | Typescript Coding Agent | 2 weeks |
| Schema Validator | High | Low | Typescript Coding Agent | 2 weeks |
| Token Counter | Medium | Low | Typescript Coding Agent | 1 week |
| Template Loader | High | Low | Typescript Coding Agent | 1 week |
| Template Wizard | Medium | Medium | Typescript Coding Agent | 2 weeks |
| Format Converter | Medium | Medium | Typescript Coding Agent | 2 weeks |
| CLI Integration | High | Medium | System Architect Agent | 1 week |
| Testing Infrastructure | High | Medium | Testing Agent | 2 weeks |

### Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                    Feature Dependencies                      │
├─────────────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐                                        │
│  │   Parser     │◄─────────────┐                        │
│  └──────────────┘              │                          │
│         ▲                       │                          │
│         │ depends on            │                          │
│  ┌────┴────────┐              │                          │
│  │    Resolver   │◄─────────────┤                          │
│  └──────────────┘              │                          │
│         ▲                       │                          │
│         │                       │                          │
│  ┌────┴────────┐              │                          │
│  │  Validator   │◄─────────────┤                          │
│  └──────────────┘              │                          │
│                                 │                          │
│                           ┌────┴────────┐                 │
│                           │ Token Counter│                 │
│                           └─────────────┘                 │
│                                                          │
│  ┌──────────────┐        ┌──────────────┐            │
│  │Template Loader│───────►│Template Wizard│            │
│  └──────────────┘        └──────────────┘            │
│         │                       │                          │
│         └───────┬───────┘───────┐                  │
│                 ▼                   ▼                  │
│           ┌──────────────────────────────┐             │
│           │   Format Converter          │             │
│           └──────────────────────────────┘             │
│                        │                             │
│                        ▼                             │
│           ┌──────────────────────────────┐             │
│           │    CLI Integration          │             │
│           └──────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Feature Allocation

### TOON-FEAT-001: TOON Parser Implementation

**Requirement:** TOON-FR-001 (TOON Document Parsing)
**Priority:** High
**Complexity:** Medium
**Assigned Agent:** TypeScript Coding Agent
**Estimated Effort:** 3 weeks

**Description:**
Implement the TOON Parser component to parse .toon.md files into TypeScript objects with full symbol extraction and error reporting.

**Acceptance Criteria:**
- [ ] Parser successfully parses valid TOON documents
- [ ] Extracts all symbol definitions with line numbers
- [ ] Reports parse errors with line and column information
- [ ] Validates document structure before parsing
- [ ] Maintains token count metadata
- [ ] Passes all 4 parser unit tests (TC-TOON-001 through TC-TOON-004)

**Technical Specifications:**
```typescript
// File: src/toon/parser.ts
interface TOONParser {
  parse(content: string): TOONParseResult;
  extractSymbols(content: string): Map<string, SymbolLocation>;
  validateStructure(content: string): StructureValidationResult;
}
```

**Dependencies:**
- src/toon/types.ts (existing)
- src/toon/schemas/*.ts (existing)

**Deliverables:**
1. src/toon/parser.ts - Parser implementation
2. src/toon/utils/error-handler.ts - Error handling utilities
3. Parser unit tests (4 tests)
4. Integration tests with parser

---

### TOON-FEAT-002: @ref Resolver Implementation

**Requirement:** TOON-FR-002 (@ref Resolution)
**Priority:** High
**Complexity:** Medium
**Assigned Agent:** TypeScript Coding Agent
**Estimated Effort:** 2 weeks

**Description:**
Implement the @ref Resolver to resolve symbol references within TOON documents with circular reference detection.

**Acceptance Criteria:**
- [ ] Resolves all valid @ref references
- [ ] Detects and reports circular references
- [ ] Reports unresolved references with details
- [ ] Builds symbol table for fast lookups
- [ ] Limits reference depth to 100 levels
- [ ] Passes all 3 resolver unit tests (TC-TOON-005 through TC-TOON-007)

**Technical Specifications:**
```typescript
// File: src/toon/resolver.ts
interface RefResolver {
  resolve(document: TOONDocument, symbols: Map<string, ParsedSymbol>): ResolvedDocument;
  detectCycles(document: TOONDocument): CircularChain[];
  buildSymbolTable(symbols: Map<string, ParsedSymbol>): SymbolTable;
}
```

**Dependencies:**
- src/toon/types.ts (existing)
- TOON-FEAT-001 (Parser)

**Deliverables:**
1. src/toon/resolver.ts - Resolver implementation
2. src/toon/utils/symbol-table.ts - Symbol table implementation
3. Resolver unit tests (3 tests)
4. Integration tests with resolver

---

### TOON-FEAT-003: Schema Validator Implementation

**Requirement:** TOON-FR-004 (Schema Validation)
**Priority:** High
**Complexity:** Low
**Assigned Agent:** TypeScript Coding Agent
**Estimated Effort:** 2 weeks

**Description:**
Implement the Schema Validator using Zod schemas for runtime validation of TOON documents.

**Acceptance Criteria:**
- [ ] Validates all TOON document types
- [ ] Returns detailed error messages
- [ ] Validates enum values (status, priority)
- [ ] Validates date formats (ISO 8601)
- [ ] Validates @ref reference format
- [ ] Passes all 3 validator unit tests (TC-TOON-008 through TC-TOON-010)

**Technical Specifications:**
```typescript
// File: src/toon/validator.ts
interface TOONValidator {
  validate(document: TOONDocument): ValidationResult;
  validateType(document: TOONDocument, type: DocumentType): ValidationResult;
  validateReferences(document: TOONDocument, symbolTable: SymbolTable): ReferenceValidationResult;
}
```

**Dependencies:**
- src/toon/types.ts (existing)
- src/toon/schemas/*.ts (existing)
- TOON-FEAT-001 (Parser)

**Deliverables:**
1. src/toon/validator.ts - Validator implementation
2. src/toon/utils/validation.ts - Validation utilities
3. Validator unit tests (3 tests)
4. Integration tests with validator

---

### TOON-FEAT-004: Token Counter Integration

**Requirement:** TOON-FR-003 (Token Efficiency)
**Priority:** Medium
**Complexity:** Low
**Assigned Agent:** TypeScript Coding Agent
**Estimated Effort:** 1 week

**Description:**
Integrate the TokenCounter implementation with tiktoken library into the TOON parsing pipeline.

**Acceptance Criteria:**
- [ ] Uses tiktoken for accurate token counting
- [ ] Provides token comparison between formats
- [ ] Integrates with parser for automatic counting
- [ ] Includes resource cleanup (dispose method)
- [ ] Passes all 2 token counter unit tests (TC-TOON-004, TC-TOON-011)

**Technical Specifications:**
```typescript
// File: src/toon/token-counter.ts (already exists)
// Integration points:
// - Add to parser pipeline
// - Add CLI command for token counting
// - Add comparison utility
```

**Dependencies:**
- src/toon/token-counter.ts (existing)
- src/toon/parser.ts (TOON-FEAT-001)

**Deliverables:**
1. Parser integration with token counting
2. CLI token count command
3. Token counter unit tests (2 tests)
4. Integration tests with token counter

---

### TOON-FEAT-005: Template Loader Implementation

**Requirement:** TOON-FR-005 (Template Pre-Filling)
**Priority:** High
**Complexity:** Low
**Assigned Agent:** TypeScript Coding Agent
**Estimated Effort:** 1 week

**Description:**
Implement the Template Loader to load TOON templates from the file system with caching.

**Acceptance Criteria:**
- [ ] Loads templates by name
- [ ] Searches for .toon.md and .md formats
- [ ] Lists all available templates
- [ ] Caches loaded templates
- [ ] Detects template file changes
- [ ] Passes all 2 template loader unit tests (TC-TOON-012, TC-TOON-013)

**Technical Specifications:**
```typescript
// File: src/templates/loader.ts
interface TemplateLoader {
  loadTemplate(name: string, preferredFormat?: 'toon' | 'markdown'): LoadedTemplate;
  listTemplates(): TemplateInfo[];
  hasTemplate(name: string): boolean;
  getTemplateMetadata(name: string): TemplateMetadata;
}
```

**Dependencies:**
- src/toon/parser.ts (TOON-FEAT-001)
- Template files in templates/ directory

**Deliverables:**
1. src/templates/loader.ts - Loader implementation
2. src/templates/cache.ts - Template cache
3. Loader unit tests (2 tests)
4. Integration tests with loader

---

### TOON-FEAT-006: Template Wizard Implementation

**Requirement:** TOON-FR-006 (Interactive Template Completion)
**Priority:** Medium
**Complexity:** Medium
**Assigned Agent:** TypeScript Coding Agent
**Estimated Effort:** 2 weeks

**Description:**
Implement the simplified Template Wizard for interactive template completion with field validation.

**Acceptance Criteria:**
- [ ] Guides users through template completion
- [ ] Prompts for each required field
- [ ] Validates user input
- [ ] Pre-fills from project context
- [ ] Saves completed template
- [ ] Passes all 2 wizard unit tests (TC-TOON-014, TC-TOON-015)

**Technical Specifications:**
```typescript
// File: src/templates/wizard.ts
// Using simplified implementation from detailed design

class SimpleTemplateWizard implements TemplateWizard {
  configure(config: SimpleFieldConfig[]): void;
  guide(template: TOONDocument): Promise<CompletedTemplate>;
  prompt(field: SimpleFieldConfig): Promise<string>;
  validateField(field: SimpleFieldConfig, value: string): FieldValidationResult;
}
```

**Dependencies:**
- src/toon/validator.ts (TOON-FEAT-003)
- src/templates/loader.ts (TOON-FEAT-005)

**Deliverables:**
1. src/templates/wizard.ts - Wizard implementation
2. src/templates/field-validator.ts - Field validator module
3. src/templates/config-builder.ts - Wizard config builder
4. Wizard unit tests (2 tests)
5. Integration tests with wizard

---

### TOON-FEAT-007: Format Converter Implementation

**Requirement:** TOON-FR-007 (Format Conversion)
**Priority:** Medium
**Complexity:** Medium
**Assigned Agent:** TypeScript Coding Agent
**Estimated Effort:** 2 weeks

**Description:**
Implement the Format Converter to convert between Markdown and TOON formats bidirectionally.

**Acceptance Criteria:**
- [ ] Converts Markdown to TOON format
- [ ] Converts TOON to Markdown format
- [ ] Preserves document structure
- [ ] Validates converted documents
- [ ] Passes all 2 converter unit tests (TC-TOON-016, TC-TOON-017)

**Technical Specifications:**
```typescript
// File: src/templates/converter.ts
interface FormatConverter {
  mdToToon(markdown: string): string;
  toonToMd(toon: string): string;
  convert(content: string, from: 'md' | 'toon', to: 'md' | 'toon'): string;
}
```

**Dependencies:**
- src/toon/parser.ts (TOON-FEAT-001)
- src/toon/validator.ts (TOON-FEAT-003)

**Deliverables:**
1. src/templates/converter.ts - Converter implementation
2. Converter unit tests (2 tests)
3. Integration tests with converter

---

### TOON-FEAT-008: CLI Integration Implementation

**Requirement:** TOON-FR-008 (CLI Integration)
**Priority:** High
**Complexity:** Medium
**Assigned Agent:** System Architect Agent
**Estimated Effort:** 1 week

**Description:**
Implement CLI slash commands (/devflow-start, /validate, /convert, /wizard) for Claude Code integration.

**Acceptance Criteria:**
- [ ] /devflow-start initializes workflow with templates
- [ ] /validate validates TOON documents
- [ ] /convert converts between formats
- [ ] /wizard guides template completion
- [ ] All commands handle errors gracefully
- [ ] Passes all 2 CLI unit tests (TC-TOON-018, TC-TOON-019)

**Technical Specifications:**
```typescript
// File: src/commands/index.ts
interface DevFlowCommands {
  start(phase: string, options?: StartOptions): Promise<void>;
  validate(options?: ValidateOptions): Promise<ValidationResult>;
  convert(options?: ConvertOptions): Promise<void>;
  wizard(options?: WizardOptions): Promise<void>;
}
```

**Dependencies:**
- All other features (FEAT-001 through FEAT-007)
- Claude Code plugin API

**Deliverables:**
1. src/commands/index.ts - CLI commands
2. src/commands/start.ts - /devflow-start command
3. src/commands/validate.ts - /validate command
4. src/commands/convert.ts - /convert command
5. src/commands/wizard.ts - /wizard command
6. CLI unit tests (2 tests)
7. Integration tests with CLI

---

### TOON-FEAT-009: Testing Infrastructure

**Requirement:** All requirements (Quality Assurance)
**Priority:** High
**Complexity:** Medium
**Assigned Agent:** Testing Agent
**Estimated Effort:** 2 weeks

**Description:**
Implement testing infrastructure including test framework setup, fixtures, and test utilities.

**Acceptance Criteria:**
- [ ] Vitest framework configured
- [ ] Coverage reporting configured (c8)
- [ ] Test fixtures created for all components
- [ ] Test utilities for mocking file system
- [ ] All 34 test cases implemented
- [ ] Unit test coverage >= 95%
- [ ] All tests passing (100% pass rate)

**Technical Specifications:**
```typescript
// File: vitest.config.ts
// Coverage thresholds: 95% lines, functions, branches, statements
```

**Dependencies:**
- All feature implementations

**Deliverables:**
1. vitest.config.ts - Test configuration
2. tests/fixtures/ - Test fixtures
3. tests/utils/ - Test utilities
4. tests/toon/*.test.ts - All TOON tests (19)
5. tests/integration/*.test.ts - Integration tests (8)
6. tests/e2e/*.test.ts - E2E tests (7)
7. Coverage report

---

## 3. Implementation Order

### Sprint 1 (Weeks 1-3): Core Parsing
```
Week 1: TOON-FEAT-003 (Schema Validator) + TOON-FEAT-004 (Token Counter)
Week 2: TOON-FEAT-001 (TOON Parser)
Week 3: TOON-FEAT-002 (@ref Resolver)
```

### Sprint 2 (Weeks 4-5): Templates
```
Week 4: TOON-FEAT-005 (Template Loader)
Week 5: TOON-FEAT-006 (Template Wizard) + TOON-FEAT-007 (Format Converter)
```

### Sprint 3 (Week 6): Integration
```
Week 6: TOON-FEAT-008 (CLI Integration) + TOON-FEAT-009 (Testing Infrastructure)
```

---

## 4. Resource Allocation

### Team Structure

| Role | Agent | Responsibilities |
|-------|--------|-----------------|
| System Architect | System/Software Architect Agent | CLI Integration, Architecture Review |
| TypeScript Developer | TypeScript Coding Agent | Parser, Resolver, Validator, Templates |
| QA Engineer | Testing Agent | Test Infrastructure, Test Implementation |

### Weekly Capacity

| Week | Features | Team Size | Total Capacity |
|-------|----------|------------|----------------|
| 1 | 2 | 1 | 2 weeks |
| 2 | 2 | 1 | 2 weeks |
| 3 | 1 | 1 | 1 week |
| 4 | 1 | 1 | 1 week |
| 5 | 2 | 1 | 2 weeks |
| 6 | 2 | 2 | 2 weeks |

**Total Implementation Time:** 10 weeks (2.5 months)

---

## 5. Risk Management

### Implementation Risks

| Risk | Probability | Impact | Mitigation |
|-------|-------------|----------|------------|
| tiktoken compatibility issues | Medium | Medium | Test early, have fallback to approximation |
| Complex circular references | Low | High | Depth limit of 100, clear error messages |
| Template migration issues | Medium | High | Support both formats during transition |
| CLI API changes | Medium | Medium | Version pinning, API abstraction |
| Test coverage gaps | Low | High | Strict coverage gates, pre-commit hooks |

---

## 6. Quality Gates

### Feature Completion Gates

Each feature must pass the following gates before merging:

1. **Code Review:** Approved by System/Software Architect
2. **Unit Tests:** 100% pass rate
3. **Coverage:** >= 95% for new code
4. **Linting:** 0 errors
5. **Type Safety:** No `any` types, strict mode enabled
6. **Documentation:** JSDoc on all public APIs

### Phase Completion Gates

Phase 7 (Feature Development Loop) is complete when:

- [ ] All 9 features implemented
- [ ] All 34 test cases passing
- [ ] Unit test coverage >= 95%
- [ ] 0 linting errors
- [ ] 0 critical/high security issues
- [ ] All acceptance criteria met

---

## 7. Traceability Matrix

| Feature ID | Requirement | Agent | Tests | Dependencies |
|-----------|-------------|--------|--------|--------------|
| TOON-FEAT-001 | TOON-FR-001 | TypeScript Coding Agent | TC-TOON-001 to TC-TOON-004 | None |
| TOON-FEAT-002 | TOON-FR-002 | TypeScript Coding Agent | TC-TOON-005 to TC-TOON-007 | TOON-FEAT-001 |
| TOON-FEAT-003 | TOON-FR-004 | TypeScript Coding Agent | TC-TOON-008 to TC-TOON-010 | TOON-FEAT-001 |
| TOON-FEAT-004 | TOON-FR-003 | TypeScript Coding Agent | TC-TOON-004, TC-TOON-011 | TOON-FEAT-001 |
| TOON-FEAT-005 | TOON-FR-005 | TypeScript Coding Agent | TC-TOON-012, TC-TOON-013 | TOON-FEAT-001 |
| TOON-FEAT-006 | TOON-FR-006 | TypeScript Coding Agent | TC-TOON-014, TC-TOON-015 | TOON-FEAT-003, TOON-FEAT-005 |
| TOON-FEAT-007 | TOON-FR-007 | TypeScript Coding Agent | TC-TOON-016, TC-TOON-017 | TOON-FEAT-001, TOON-FEAT-003 |
| TOON-FEAT-008 | TOON-FR-008 | System Architect Agent | TC-TOON-018, TC-TOON-019 | All FEAT-001 to FEAT-007 |
| TOON-FEAT-009 | All | Testing Agent | TC-TOON-INT-001 to TC-TOON-E2E-007 | All FEAT-001 to FEAT-008 |

---

**Feature Allocation Status:** Draft
**Approved By:** Pending Review
**Next Phase:** Phase 7 - Feature Development Loop

---

## Change History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-13 | 1.0.0 | Initial feature allocation document | System/Software Architect Agent |
