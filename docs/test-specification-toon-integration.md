# TOON Integration Test Feature - Test Specification

**Version:** 1.0.0
**Created:** 2026-02-13
**Test Engineer:** Testing Agent
**Status:** Draft
**Related Docs:** [requirements-toon-integration.md](./requirements-toon-integration.md) | [detailed-design-toon-integration.md](./detailed-design-toon-integration.md)

---

## 1. Test Overview

### Purpose

This document defines comprehensive test specifications for the TOON Integration Test Feature, ensuring all functional requirements are verified through unit, integration, and end-to-end tests.

### Test Scope

| Component | Unit Tests | Integration Tests | E2E Tests | Total |
|-----------|------------|-------------------|------------|-------|
| TOON Parser | 4 | 1 | 1 | 6 |
| @ref Resolver | 3 | 1 | 1 | 5 |
| Schema Validator | 3 | 1 | 1 | 5 |
| Token Counter | 2 | 1 | 0 | 3 |
| Template Loader | 2 | 1 | 1 | 4 |
| Template Wizard | 2 | 1 | 1 | 4 |
| Format Converter | 2 | 1 | 1 | 4 |
| CLI Integration | 1 | 1 | 1 | 3 |
| **Total** | **19** | **8** | **7** | **34** |

### Test Environment

| Environment | Purpose | Tools |
|-------------|----------|-------|
| Unit Testing | Component isolation | Vitest |
| Integration Testing | Component interaction | Vitest + Test Fixtures |
| E2E Testing | Full workflow validation | Vitest + File System Mock |
| Coverage Measurement | Quality gate enforcement | c8 (Istanbul) |

### Quality Gates

| Gate | Requirement | Target |
|-------|-------------|--------|
| Unit Test Coverage | All components | 95% |
| Integration Test Coverage | All component interactions | 90% |
| E2E Test Coverage | All user workflows | 100% |
| Test Pass Rate | All tests | 100% |
| Linting Errors | Codebase | 0 |
| Critical Security Issues | All components | 0 |
| High Security Issues | All components | 0 |

---

## 2. Unit Tests

### TC-TOON-001: Parser - Valid Document Structure

**Requirement:** TOON-FR-001 (TOON Document Parsing)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the TOON Parser can successfully parse a valid TOON document with all required fields.

**Given:**
```typescript
const validToonDocument = `
# TOON Test Document

## Document Overview

- name: "test-document"
  description: "Test description"
  version: "1.0.0"
  created_at: 2026-02-13
  status: "active"
  tags: ["test"]
`;
```

**When:**
```typescript
const result = parser.parse(validToonDocument);
```

**Then:**
```typescript
expect(result.document.name).toBe("test-document");
expect(result.document.description).toBe("Test description");
expect(result.document.version).toBe("1.0.0");
expect(result.document.status).toBe("active");
expect(result.document.tags).toEqual(["test"]);
expect(result.errors).toHaveLength(0);
```

**Expected Result:** Parser returns valid TOONDocument with no errors

---

### TC-TOON-002: Parser - Invalid Syntax Detection

**Requirement:** TOON-FR-001 (TOON Document Parsing)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the TOON Parser detects and reports invalid syntax in TOON documents.

**Given:**
```typescript
const invalidToonDocument = `
# TOON Test Document

## Document Overview

- name: "test-document"
  description: "Missing required fields"
  # Missing version field
  # Missing created_at field
`;
```

**When:**
```typescript
const result = parser.parse(invalidToonDocument);
```

**Then:**
```typescript
expect(result.errors.length).toBeGreaterThan(0);
expect(result.errors[0].code).toBe("MISSING_REQUIRED_FIELD");
expect(result.errors[0].field).toBe("version");
```

**Expected Result:** Parser returns parse errors with specific error codes

---

### TC-TOON-003: Parser - Symbol Extraction

**Requirement:** TOON-FR-002 (@ref Resolution)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the TOON Parser can extract all symbol definitions from a document.

**Given:**
```typescript
const toonDocumentWithSymbols = `
# TOON Test Document

## Symbol: phase1
### Phase 1

## Symbol: feature1
### Feature 1
`;
```

**When:**
```typescript
const symbols = parser.extractSymbols(toonDocumentWithSymbols);
```

**Then:**
```typescript
expect(symbols.size).toBe(2);
expect(symbols.has("phase1")).toBe(true);
expect(symbols.has("feature1")).toBe(true);
expect(symbols.get("phase1").line).toBe(5);
expect(symbols.get("phase1").type).toBe("phase");
```

**Expected Result:** Parser extracts all symbols with correct metadata

---

### TC-TOON-004: Parser - Token Counting

**Requirement:** TOON-FR-003 (Token Efficiency)
**Priority:** Medium
**Type:** Unit Test

**Description:**
Verify that the TOON Parser correctly counts tokens in document content using tiktoken.

**Given:**
```typescript
const sampleContent = "This is a sample TOON document content for testing token counting.";
```

**When:**
```typescript
const tokenCount = tokenCounter.countTokens(sampleContent);
```

**Then:**
```typescript
// Verify tiktoken encoding (cl100k_base) is used
expect(tokenCount).toBeGreaterThan(0);
expect(tokenCount).toBeLessThan(sampleContent.length); // Tokens < chars
// Should be approximately char count / 4
expect(tokenCount).toBeCloseTo(Math.ceil(sampleContent.length / 4), 1);
```

**Expected Result:** Token counter returns accurate token count using tiktoken

---

### TC-TOON-005: Resolver - Valid @ref Resolution

**Requirement:** TOON-FR-002 (@ref Resolution)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the @ref Resolver can successfully resolve valid symbol references.

**Given:**
```typescript
const symbols = new Map([
  ["phase1", { symbol: "phase1", line: 10, type: "phase" }],
  ["feature1", { symbol: "feature1", line: 20, type: "feature" }]
]);

const document = {
  name: "test",
  phases: ["@ref:phase1"],
  features: [{ name: "test", phase: "@ref:phase1" }]
};
```

**When:**
```typescript
const result = resolver.resolve(document, symbols);
```

**Then:**
```typescript
expect(result.resolvedRefs.size).toBe(2);
expect(result.unresolvedRefs).toHaveLength(0);
expect(result.resolvedRefs.get("@ref:phase1").to.symbol).toBe("phase1");
```

**Expected Result:** Resolver resolves all valid @ref references

---

### TC-TOON-006: Resolver - Circular Reference Detection

**Requirement:** TOON-FR-002 (@ref Resolution)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the @ref Resolver detects circular reference chains.

**Given:**
```typescript
// Circular reference: phase1 -> feature1 -> user-story1 -> phase1
const document = {
  phases: [{ name: "phase1", features: ["@ref:feature1"] }],
  features: [{ name: "feature1", user_stories: ["@ref:user-story1"] }],
  userStories: [{ name: "user-story1", phase: "@ref:phase1" }]
};
```

**When:**
```typescript
const result = resolver.resolve(document, symbols);
```

**Then:**
```typescript
expect(result.cycles.length).toBeGreaterThan(0);
expect(result.cycles[0].symbols).toContain("phase1");
expect(result.cycles[0].symbols).toContain("feature1");
expect(result.cycles[0].symbols).toContain("user-story1");
```

**Expected Result:** Resolver detects and reports circular references

---

### TC-TOON-007: Resolver - Unresolved Reference Detection

**Requirement:** TOON-FR-002 (@ref Resolution)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the @ref Resolver detects unresolved symbol references.

**Given:**
```typescript
const symbols = new Map([
  ["phase1", { symbol: "phase1", line: 10, type: "phase" }]
]);

const document = {
  name: "test",
  phases: ["@ref:phase1", "@ref:nonexistent"]
};
```

**When:**
```typescript
const result = resolver.resolve(document, symbols);
```

**Then:**
```typescript
expect(result.unresolvedRefs).toHaveLength(1);
expect(result.unresolvedRefs[0]).toBe("@ref:nonexistent");
```

**Expected Result:** Resolver identifies all unresolved references

---

### TC-TOON-008: Validator - Valid Schema

**Requirement:** TOON-FR-004 (Schema Validation)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the Schema Validator accepts a valid TOON document.

**Given:**
```typescript
const validDocument = {
  name: "test-document",
  description: "Valid test document",
  version: "1.0.0",
  created_at: "2026-02-13T10:00:00Z",
  updated_at: "2026-02-13T10:00:00Z",
  status: "active",
  tags: ["test"]
};
```

**When:**
```typescript
const result = validator.validate(validDocument);
```

**Then:**
```typescript
expect(result.valid).toBe(true);
expect(result.errors).toHaveLength(0);
```

**Expected Result:** Validator accepts valid document

---

### TC-TOON-009: Validator - Missing Required Field

**Requirement:** TOON-FR-004 (Schema Validation)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the Schema Validator rejects a document with missing required fields.

**Given:**
```typescript
const invalidDocument = {
  name: "test-document"
  // Missing: description, version, created_at, updated_at, status
};
```

**When:**
```typescript
const result = validator.validate(invalidDocument);
```

**Then:**
```typescript
expect(result.valid).toBe(false);
expect(result.errors.length).toBeGreaterThan(0);
expect(result.errors.some(e => e.code === "MISSING_REQUIRED_FIELD")).toBe(true);
```

**Expected Result:** Validator rejects with specific error codes

---

### TC-TOON-010: Validator - Invalid Enum Value

**Requirement:** TOON-FR-004 (Schema Validation)
**Priority:** Medium
**Type:** Unit Test

**Description:**
Verify that the Schema Validator rejects invalid enum values.

**Given:**
```typescript
const invalidDocument = {
  name: "test-document",
  description: "Test",
  version: "1.0.0",
  created_at: "2026-02-13T10:00:00Z",
  updated_at: "2026-02-13T10:00:00Z",
  status: "invalid-status" // Invalid enum value
};
```

**When:**
```typescript
const result = validator.validate(invalidDocument);
```

**Then:**
```typescript
expect(result.valid).toBe(false);
expect(result.errors.some(e => e.code === "INVALID_ENUM")).toBe(true);
expect(result.errors[0].field).toBe("status");
```

**Expected Result:** Validator rejects with INVALID_ENUM error

---

### TC-TOON-011: Token Counter - Token Comparison

**Requirement:** TOON-FR-003 (Token Efficiency)
**Priority:** Medium
**Type:** Unit Test

**Description:**
Verify that the Token Counter can compare token counts between formats.

**Given:**
```typescript
const toonContent = `# TOON Document
- name: "test"`;
const jsonContent = JSON.stringify({ name: "test", description: "test" });
const markdownContent = `# Test Document\n\nThis is a test.`;
```

**When:**
```typescript
const comparison = tokenCounter.compare(toonContent, jsonContent, markdownContent);
```

**Then:**
```typescript
expect(comparison.toon.tokens).toBeLessThan(comparison.json.tokens);
expect(comparison.toon.tokens).toBeLessThan(comparison.markdown.tokens);
expect(comparison.savings.vsJson.percentage).toBeGreaterThan(0);
expect(comparison.savings.vsMarkdown.percentage).toBeGreaterThan(0);
```

**Expected Result:** TOON format shows token savings

---

### TC-TOON-012: Template Loader - Load Template

**Requirement:** TOON-FR-005 (Template Pre-Filling)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the Template Loader can load a template by name.

**Given:**
```typescript
// Template file exists: templates/requirements.toon.md
```

**When:**
```typescript
const template = loader.loadTemplate("requirements", "toon");
```

**Then:**
```typescript
expect(template.name).toBe("requirements");
expect(template.format).toBe("toon");
expect(template.content).toContain("# Requirements");
expect(template.document).toBeDefined();
```

**Expected Result:** Loader loads and parses template

---

### TC-TOON-013: Template Loader - List Templates

**Requirement:** TOON-FR-005 (Template Pre-Filling)
**Priority:** Medium
**Type:** Unit Test

**Description:**
Verify that the Template Loader can list all available templates.

**Given:**
```typescript
// Templates directory contains: requirements.toon.md, architecture.toon.md
```

**When:**
```typescript
const templates = loader.listTemplates();
```

**Then:**
```typescript
expect(templates.length).toBeGreaterThanOrEqual(2);
expect(templates.some(t => t.name === "requirements")).toBe(true);
expect(templates.some(t => t.name === "architecture")).toBe(true);
expect(templates[0].formats).toContain("toon");
```

**Expected Result:** Loader lists all available templates

---

### TC-TOON-014: Wizard - Field Prompting

**Requirement:** TOON-FR-006 (Interactive Template Completion)
**Priority:** Medium
**Type:** Unit Test

**Description:**
Verify that the Template Wizard can prompt for field input.

**Given:**
```typescript
const fieldConfig = {
  name: "description",
  type: "multiline",
  required: true,
  prompt: "Enter description:",
  validation: /^.+$/
};

const mockUserInput = "This is a test description";
```

**When:**
```typescript
const result = await wizard.prompt(fieldConfig);
// Mock user input returns mockUserInput
```

**Then:**
```typescript
expect(result).toBe(mockUserInput);
expect(wizard.validateField(fieldConfig, result).valid).toBe(true);
```

**Expected Result:** Wizard prompts and validates field input

---

### TC-TOON-015: Wizard - Field Validation

**Requirement:** TOON-FR-006 (Interactive Template Completion)
**Priority:** Medium
**Type:** Unit Test

**Description:**
Verify that the Template Wizard validates field input correctly.

**Given:**
```typescript
const fieldConfig = {
  name: "version",
  type: "text",
  required: true,
  prompt: "Enter version:",
  validation: /^\d+\.\d+\.\d+$/
};
```

**When:**
```typescript
const validResult = wizard.validateField(fieldConfig, "1.0.0");
const invalidResult = wizard.validateField(fieldConfig, "invalid");
```

**Then:**
```typescript
expect(validResult.valid).toBe(true);
expect(validResult.errors).toHaveLength(0);
expect(invalidResult.valid).toBe(false);
expect(invalidResult.errors.length).toBeGreaterThan(0);
```

**Expected Result:** Wizard validates field input correctly

---

### TC-TOON-016: Converter - Markdown to TOON

**Requirement:** TOON-FR-007 (Format Conversion)
**Priority:** Medium
**Type:** Unit Test

**Description:**
Verify that the Format Converter can convert Markdown to TOON format.

**Given:**
```typescript
const markdownContent = `# Requirements Document

## Overview

- Feature: User Authentication
  Priority: High
`;
```

**When:**
```typescript
const toonContent = converter.mdToToon(markdownContent);
```

**Then:**
```typescript
expect(toonContent).toContain("# Requirements Document");
expect(toonContent).toContain("## Document Overview");
expect(toonContent).toContain('name: "User Authentication"');
```

**Expected Result:** Converter transforms Markdown to TOON format

---

### TC-TOON-017: Converter - TOON to Markdown

**Requirement:** TOON-FR-007 (Format Conversion)
**Priority:** Medium
**Type:** Unit Test

**Description:**
Verify that the Format Converter can convert TOON to Markdown format.

**Given:**
```typescript
const toonContent = `# Requirements Document

## Document Overview

- name: "test"
  description: "Test feature"
`;
```

**When:**
```typescript
const markdownContent = converter.toonToMd(toonContent);
```

**Then:**
```typescript
expect(markdownContent).toContain("# Requirements Document");
expect(markdownContent).toContain("## Overview");
expect(markdownContent).toContain("**Name:** test");
expect(markdownContent).toContain("**Description:** Test feature");
```

**Expected Result:** Converter transforms TOON to Markdown format

---

### TC-TOON-018: CLI - Devflow Start Command

**Requirement:** TOON-FR-008 (CLI Integration)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the CLI /devflow-start command initializes workflow correctly.

**Given:**
```typescript
const mockArgs = { phase: "requirements", format: "toon" };
const mockFileSystem = { exists: false };
```

**When:**
```typescript
await devflowCommands.start(mockArgs.phase, { format: mockArgs.format });
```

**Then:**
```typescript
// Verify branch creation
expect(git.createBranch).toHaveBeenCalledWith("feature/test-toon-integration");

// Verify template loading
expect(templateLoader.loadTemplate).toHaveBeenCalledWith("requirements", "toon");

// Verify file creation
expect(fileSystem.writeFile).toHaveBeenCalledWith(
  "requirements-toon-integration.md",
  expect.stringContaining("# Requirements")
);
```

**Expected Result:** CLI initializes DevFlow workflow with TOON template

---

### TC-TOON-019: CLI - Validate Command

**Requirement:** TOON-FR-008 (CLI Integration)
**Priority:** High
**Type:** Unit Test

**Description:**
Verify that the CLI /validate command validates TOON documents.

**Given:**
```typescript
const mockDocumentPath = "requirements-toon-integration.md";
const mockDocument = {
  name: "test",
  description: "Test",
  version: "1.0.0"
};
```

**When:**
```typescript
const result = await devflowCommands.validate({ file: mockDocumentPath });
```

**Then:**
```typescript
expect(validator.validate).toHaveBeenCalled();
expect(result.valid).toBeDefined();
expect(result.errors).toBeDefined();
```

**Expected Result:** CLI validates TOON document and reports results

---

## 3. Integration Tests

### TC-TOON-INT-001: Parser to Resolver Integration

**Requirement:** TOON-FR-001, TOON-FR-002
**Priority:** High
**Type:** Integration Test

**Description:**
Verify that the Parser and Resolver work together to parse and resolve references.

**Test Flow:**
1. Parser extracts symbols from document
2. Resolver receives parsed document and symbols
3. Resolver resolves all @ref references
4. Verify no unresolved references

**Expected Result:** Complete parse and resolve workflow with valid output

---

### TC-TOON-INT-002: Resolver to Validator Integration

**Requirement:** TOON-FR-002, TOON-FR-004
**Priority:** High
**Type:** Integration Test

**Description:**
Verify that the Resolver and Validator work together for validation.

**Test Flow:**
1. Resolver resolves all references
2. Validator receives resolved document
3. Validator validates against schema
4. Validator validates all resolved references

**Expected Result:** Complete resolve and validate workflow

---

### TC-TOON-INT-003: Loader to Parser Integration

**Requirement:** TOON-FR-005
**Priority:** High
**Type:** Integration Test

**Description:**
Verify that the Loader and Parser work together for template loading.

**Test Flow:**
1. Loader reads template file
2. Loader passes content to Parser
3. Parser parses template into document object
4. Verify document structure

**Expected Result:** Complete template load and parse workflow

---

### TC-TOON-INT-004: Wizard to Validator Integration

**Requirement:** TOON-FR-006
**Priority:** Medium
**Type:** Integration Test

**Description:**
Verify that the Wizard and Validator work together for template completion.

**Test Flow:**
1. Wizard loads template
2. User completes fields through Wizard
3. Wizard validates each field
4. Final document validated by Validator

**Expected Result:** Complete wizard workflow with validation

---

### TC-TOON-INT-005: Converter to Parser Integration

**Requirement:** TOON-FR-007
**Priority:** Medium
**Type:** Integration Test

**Description:**
Verify that the Converter and Parser work together for format conversion.

**Test Flow:**
1. Converter receives Markdown content
2. Converter transforms to TOON format
3. Parser validates converted TOON
4. Verify document is valid

**Expected Result:** Complete convert and validate workflow

---

### TC-TOON-INT-006: CLI to All Components Integration

**Requirement:** TOON-FR-008
**Priority:** High
**Type:** Integration Test

**Description:**
Verify that the CLI integrates with all components correctly.

**Test Flow:**
1. CLI receives /devflow-start command
2. CLI loads template via Loader
3. CLI parses via Parser
4. CLI resolves via Resolver
5. CLI validates via Validator
6. User completes via Wizard
7. Verify complete workflow

**Expected Result:** Complete CLI workflow with all components

---

### TC-TOON-INT-007: Token Counter Integration

**Requirement:** TOON-FR-003
**Priority:** Medium
**Type:** Integration Test

**Description:**
Verify token counting across the parsing pipeline.

**Test Flow:**
1. Parser counts tokens during parse
2. Token Counter provides counts for all sections
3. Compare TOON vs JSON vs Markdown
4. Verify token efficiency metrics

**Expected Result:** Accurate token counting and comparison

---

### TC-TOON-INT-008: Error Handling Integration

**Requirement:** All requirements
**Priority:** High
**Type:** Integration Test

**Description:**
Verify error handling across all components.

**Test Flow:**
1. Parser detects parse error
2. Error propagated through Resolver
3. Validator reports validation errors
4. CLI displays user-friendly error messages
5. Verify no data corruption

**Expected Result:** Proper error handling and reporting

---

## 4. End-to-End Tests

### TC-TOON-E2E-001: Complete DevFlow Workflow

**Requirement:** TOON-FR-008
**Priority:** High
**Type:** E2E Test

**Description:**
Verify complete DevFlow workflow from start to completion.

**Test Flow:**
1. User runs `/devflow-start requirements`
2. CLI creates feature branch
3. Template loads successfully
4. User completes template via Wizard
5. Document saves to disk
6. Validator confirms valid document
7. Progress updates in devflow-progress.md
8. Verify all artifacts created

**Expected Result:** Complete workflow execution with all artifacts

---

### TC-TOON-E2E-002: Multi-Phase Document Creation

**Requirement:** TOON-FR-001, TOON-FR-002
**Priority:** High
**Type:** E2E Test

**Description:**
Verify creating multiple TOON documents with cross-references.

**Test Flow:**
1. Create requirements document
2. Create architecture document
3. Create detailed design document
4. Add cross-references between documents
5. Resolve all references
6. Validate all documents
7. Verify reference integrity

**Expected Result:** Multiple documents with valid cross-references

---

### TC-TOON-E2E-003: Template Creation and Usage

**Requirement:** TOON-FR-005
**Priority:** Medium
**Type:** E2E Test

**Description:**
Verify creating a new template and using it in workflow.

**Test Flow:**
1. Create new test template file
2. Add template to templates directory
3. Run `/devflow-start` with new template
4. Complete template via Wizard
5. Validate resulting document
6. Verify template list includes new template

**Expected Result:** New template created and used successfully

---

### TC-TOON-E2E-004: Format Conversion Workflow

**Requirement:** TOON-FR-007
**Priority:** Medium
**Type:** E2E Test

**Description:**
Verify complete format conversion workflow.

**Test Flow:**
1. Load existing Markdown document
2. Convert to TOON format
3. Validate TOON document
4. Edit TOON document
5. Convert back to Markdown
6. Compare content preservation
7. Verify data integrity

**Expected Result:** Successful bidirectional conversion

---

### TC-TOON-E2E-005: Error Recovery Workflow

**Requirement:** All requirements
**Priority:** High
**Type:** E2E Test

**Description:**
Verify system can recover from errors gracefully.

**Test Flow:**
1. Start DevFlow workflow
2. Introduce parse error (invalid syntax)
3. Verify error detected and reported
4. Fix error
5. Resume workflow
6. Verify no data loss
7. Complete workflow successfully

**Expected Result:** Graceful error recovery with data integrity

---

### TC-TOON-E2E-006: Performance Validation

**Requirement:** TOON-FR-003
**Priority:** Medium
**Type:** E2E Test

**Description:**
Verify performance targets are met for all operations.

**Test Flow:**
1. Parse 1000-token TOON document
2. Verify parse time < 100ms
3. Resolve @ref references
4. Verify resolve time < 50ms
5. Validate document
6. Verify validation time < 150ms
7. Load template
8. Verify load time < 200ms

**Expected Result:** All performance targets met

---

### TC-TOON-E2E-007: Quality Gates Validation

**Requirement:** All requirements
**Priority:** High
**Type:** E2E Test

**Description:**
Verify all quality gates pass after implementation.

**Test Flow:**
1. Run complete test suite
2. Measure unit test coverage
3. Verify coverage >= 95%
4. Check all tests pass (100% pass rate)
5. Run linter
6. Verify 0 linting errors
7. Run security audit
8. Verify 0 critical/high security issues

**Expected Result:** All quality gates passed

---

## 5. Test Data

### Sample TOON Documents

**Valid Requirements Document:**
```markdown
# Feature Requirements

## Document Overview

- name: "user-authentication"
  description: "User authentication and authorization system"
  version: "1.0.0"
  created_at: 2026-02-13
  status: "active"
  tags: ["authentication", "security"]
```

**Document with @ref References:**
```markdown
# Project Roadmap

## Document Overview

- name: "project-roadmap"
  phases: @ref:phases

## Symbol: phases
### Project Phases

- name: "Phase 1"
  features: @ref:phase1_features

## Symbol: phase1_features
### Phase 1 Features

- name: "User Authentication"
```

**Invalid Document (for error testing):**
```markdown
# Invalid Document

## Document Overview

- name: "test"
  # Missing required fields
```

---

## 6. Test Execution Plan

### Phase 5: Test Implementation

| Week | Tasks | Deliverables |
|-------|--------|-------------|
| 1 | Set up test framework (Vitest), write unit tests | 19 unit tests |
| 2 | Write integration tests | 8 integration tests |
| 3 | Write E2E tests, set up coverage reporting | 7 E2E tests |
| 4 | Review, fix failures, document results | Test report |

### Test Execution Order

1. **Unit Tests First** - Validate individual components
2. **Integration Tests Second** - Validate component interactions
3. **E2E Tests Last** - Validate complete workflows

---

## 7. Success Criteria

### Test Completion Criteria

- [ ] All 19 unit tests implemented and passing
- [ ] All 8 integration tests implemented and passing
- [ ] All 7 E2E tests implemented and passing
- [ ] Unit test coverage >= 95%
- [ ] Integration test coverage >= 90%
- [ ] All tests passing (100% pass rate)
- [ ] 0 linting errors
- [ ] 0 critical/high security issues

### Quality Gate Status

| Gate | Target | Current | Status |
|-------|--------|---------|--------|
| Unit Test Coverage | 95% | TBD | Pending |
| Test Pass Rate | 100% | TBD | Pending |
| Linting Errors | 0 | TBD | Pending |
| Critical Security Issues | 0 | TBD | Pending |
| High Security Issues | 0 | TBD | Pending |

---

## 8. Test Tools and Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.ts', '**/dist/**'],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95
      }
    }
  }
});
```

### Test Scripts

```json
{
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "test:ui": "vitest --ui",
  "test:run": "vitest run"
}
```

---

## 9. Traceability Matrix

| Test Case | Requirement | Component | Priority | Status |
|-----------|-------------|------------|----------|--------|
| TC-TOON-001 | TOON-FR-001 | Parser | High | Pending |
| TC-TOON-002 | TOON-FR-001 | Parser | High | Pending |
| TC-TOON-003 | TOON-FR-002 | Parser | High | Pending |
| TC-TOON-004 | TOON-FR-003 | Token Counter | Medium | Pending |
| TC-TOON-005 | TOON-FR-002 | Resolver | High | Pending |
| TC-TOON-006 | TOON-FR-002 | Resolver | High | Pending |
| TC-TOON-007 | TOON-FR-002 | Resolver | High | Pending |
| TC-TOON-008 | TOON-FR-004 | Validator | High | Pending |
| TC-TOON-009 | TOON-FR-004 | Validator | High | Pending |
| TC-TOON-010 | TOON-FR-004 | Validator | Medium | Pending |
| TC-TOON-011 | TOON-FR-003 | Token Counter | Medium | Pending |
| TC-TOON-012 | TOON-FR-005 | Template Loader | High | Pending |
| TC-TOON-013 | TOON-FR-005 | Template Loader | Medium | Pending |
| TC-TOON-014 | TOON-FR-006 | Template Wizard | Medium | Pending |
| TC-TOON-015 | TOON-FR-006 | Template Wizard | Medium | Pending |
| TC-TOON-016 | TOON-FR-007 | Format Converter | Medium | Pending |
| TC-TOON-017 | TOON-FR-007 | Format Converter | Medium | Pending |
| TC-TOON-018 | TOON-FR-008 | CLI Integration | High | Pending |
| TC-TOON-019 | TOON-FR-008 | CLI Integration | High | Pending |
| TC-TOON-INT-001 through INT-008 | All | Integration | High/ Medium | Pending |
| TC-TOON-E2E-001 through E2E-007 | All | E2E | High/ Medium | Pending |

---

**Test Specification Status:** Draft
**Approved By:** Pending Review
**Next Phase:** Phase 6 - Feature Creation & Allocation

---

## Change History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-13 | 1.0.0 | Initial test specification document | Testing Agent |
