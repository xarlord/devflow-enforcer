# TOON Integration Test Feature - Architecture

**Application:** TOON Integration Test Feature
**Version:** 1.0.0
**Created:** 2026-02-13
**Architect:** System/Software Architect Agent
**Status:** Draft
**Related Docs:** [requirements-toon-integration.md](./requirements-toon-integration.md)

---

## 1. System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DevFlow Enforcer Plugin                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    CLI & Agent Interface Layer                     │    │
│  │  Claude Code Plugin | Slash Commands | Skill Invocations           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      TOON Core Layer                               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │   Parser     │  │  Resolver    │  │  Validator   │             │    │
│  │  │  (toon.ts)   │  │  (refs.ts)   │  │  (zod.ts)    │             │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │    │
│  │  ┌──────────────┐  ┌──────────────┐                             │    │
│  │  │ Token Counter│  │  Converter   │                             │    │
│  │  │  (tokens.ts) │  │  (md2toon.ts)│                             │    │
│  │  └──────────────┘  └──────────────┘                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Template System Layer                            │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │  Loader      │  │   Wizard     │  │ Validation   │             │    │
│  │  │ (loader.ts)   │  │(wizard.ts)   │  │(framework.ts)│             │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Data Layer                                    │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │ File System  │  │ TOON Types   │  │ Zod Schemas  │             │    │
│  │  │  (.toon.md)  │  │  (types.ts)  │  │  (schemas/)  │             │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component List

| Component | Responsibility | Technology | Interfaces |
|-----------|-----------------|-------------|-------------|
| TOON Parser | Parse .toon.md files into TypeScript objects | TypeScript 5.1+ | parse(content: string): TOONDocument |
| @ref Resolver | Resolve symbol references within documents | TypeScript 5.1+ | resolve(document: TOONDocument): ResolvedDocument |
| Schema Validator | Validate documents against TOON schema | Zod 3.x | validate(document: TOONDocument): ValidationResult |
| Token Counter | Calculate token count for documents | tiktoken/lite | countTokens(content: string): number |
| Template Loader | Load TOON templates from file system | Node.js 18+ fs | loadTemplate(name: string): TOONDocument |
| Template Wizard | Interactive template completion | Inquirer/prompts | guide(template: TOONDocument): CompletedDocument |
| Validation Framework | Validate template completeness | Zod 3.x | validateTemplate(template: TOONDocument): ValidationReport |
| Markdown Converter | Convert .md to .toon.md format | TypeScript 5.1+ | convert(markdown: string): TOONDocument |

---

## 2. Data Models

### Entity Relationship Diagram

```
┌──────────────────┐
│  TOON Document  │
│  ─────────────  │
│  name           │
│  description    │
│  version        │
│  status         │
│  tags[]         │
└────┬───────┬───┘
     │       │
     │       ├──> @ref phases[]
     │       │
     │       └──> @ref timeline
     │
     ▼
┌──────────────────┐       ┌──────────────────┐
│     Phase       │       │     Timeline     │
│  ─────────────  │       │  ─────────────   │
│  name           │       │  name            │
│  description    │       │  description     │
│  version        │       │  releases[]      │
│  timeline       │       └──────────────────┘
│  priority       │
│  features[]     │
│  dependencies[] │
└────┬───────┬───┘
     │       │
     │       ├──> @ref features[]
     │       │
     │       └──> @ref dependencies[]
     │
     ▼
┌──────────────────┐       ┌──────────────────┐
│     Feature     │       │     Release     │
│  ─────────────  │       │  ─────────────   │
│  name           │       │  name            │
│  phase          │       │  date            │
│  priority       │       │  status          │
│  effort         │       │  features[]      │
│  team           │       └──────────────────┘
│  status         │
│  user_stories[] │
│  acceptance_criteria[]
└────┬───────┬───┘
     │       │
     │       ├──> @ref user_stories[]
     │       │
     │       └──> @ref acceptance_criteria[]
     │
     ▼
┌──────────────────┐       ┌──────────────────┐
│   User Story    │       │  Acceptance C.   │
│  ─────────────  │       │  ─────────────   │
│  role           │       │  criteria[]      │
│  given          │       │  (given/when/    │
│  when           │       │   then/and)      │
│  then           │       └──────────────────┘
│  benefit        │
└──────────────────┘
```

### Data Model Specifications

| Entity | Attributes | Relationships | Notes |
|--------|------------|-------------|-------|
| TOONDocument | name, description, version, created_at, updated_at, status, tags | 1:N Phase, 1:1 Timeline | Root object for all TOON documents |
| Phase | name, description, version, timeline, priority, start_date, target_date, features[], dependencies[] | N:1 Document, 1:N Feature | Represents DevFlow phases |
| Feature | name, description, phase, priority, effort, team, status, user_stories[], acceptance_criteria[], technical_specs | N:1 Phase | Feature within a phase |
| Timeline | name, description, releases[] | 1:1 Document | Project timeline information |
| Release | name, date, status, features[], dependencies[] | N:1 Timeline | Release milestone |
| UserStory | name, role, given, when, then, and[], benefit, priority, created_at | N:1 Feature | BDD format user story |
| AcceptanceCriteria | name, criteria[{given, when, then, and[]}], created_at | N:1 Feature | BDD acceptance criteria |

### TypeScript Schema

**File:** `src/toon/types.ts`

All TOON types are already implemented and include:
- `TOONDocument` - Base document interface
- `TOONPhase` - Phase object interface
- `TOONFeature` - Feature object interface
- `TOONUserStory` - User story interface
- `TOONAcceptanceCriteria` - Acceptance criteria interface
- `TOONChangeLog` - Change tracking interface
- `TOONSuccessCriteria` - Success criteria interface

### Database Schema

**Note:** TOON Integration uses file-based storage, not a traditional database.

**File System Structure:**
```
templates/
├── requirements.toon.md
├── architecture.toon.md
├── detailed-design.toon.md
├── test-specification.toon.md
└── ...
```

**Schema Validation:** Zod schemas provide runtime validation.

---

## 3. Interactions & APIs

### Module API (Internal)

| Module | Method | Input | Output | Exceptions |
|--------|--------|-------|--------|------------|
| Parser | parse() | content: string | TOONDocument | ParseError, ValidationError |
| Resolver | resolve() | document: TOONDocument | ResolvedDocument | ReferenceError, CircularReferenceError |
| Validator | validate() | document: TOONDocument | ValidationResult | ValidationError |
| TokenCounter | count() | content: string | number | None |
| Loader | load() | name: string | TOONDocument | FileNotFoundError |
| Wizard | guide() | template: TOONDocument | CompletedDocument | UserAbortError |
| Framework | validateTemplate() | template: TOONDocument | ValidationReport | ValidationError |

### CLI Integration

**Slash Commands:**
```typescript
// Load template with TOON format
/devflow-start [phase] [--toon]

// Validate TOON document
/devflow-validate [--file path]

// Convert markdown to TOON
/devflow-convert [--input path] [--output path]

// Run template wizard
/devflow-wizard [--template name]
```

### Data Flow: Template Loading

```
[CLI Command] → [Template Loader] → [TOON Parser]
                                           │
                                           ▼
                                    [TypeScript Objects]
                                           │
                                           ▼
                                    [@ref Resolver]
                                           │
                                           ▼
                                    [Schema Validator]
                                           │
                                           ▼
                                    [Agent Processing]
```

### Data Flow: Template Wizard

```
[Load Template] → [Parse TOON] → [Identify Empty Fields]
                                           │
                                           ▼
                                    [Interactive Prompts]
                                           │
                                           ▼
                                    [User Input]
                                           │
                                           ▼
                                    [Validate Completeness]
                                           │
                                           ▼
                                    [Save Document]
```

---

## 4. Functional Specifications

### TOON Document Parsing

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Read .toon.md  │ ──→ │  Parse Content  │ ──→ │  Validate @ref  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
                                                    ┌─────────────────┐
                                                    │  Resolve @ref   │
                                                    └─────────────────┘
                                                           │
                                                           ▼
                                                    ┌─────────────────┐
                                                    │ Return Objects  │
                                                    └─────────────────┘
```

**Requirements:**
- Parse .toon.md files into TypeScript objects
- Validate against TOON schema (Zod)
- Resolve all @ref references
- Detect circular references
- Provide clear error messages with line numbers

### @ref Resolution

```
[Scan Document] → [Collect @ref Tags] → [Build Symbol Table]
                                            │
                                            ▼
                                     [Resolve References]
                                            │
                         ┌──────────────────┼──────────────────┐
                         ▼                  ▼                  ▼
                    [Found]           [Not Found]        [Circular]
                         │                  │                  │
                         ▼                  ▼                  ▼
                  [Link Object]    [Error: Symbol]    [Error: Cycle]
```

**Requirements:**
- Case-sensitive symbol matching
- Support cross-document references (future)
- Detect circular reference chains
- Report unresolved symbols

### Template Loading

```
[Agent Starts] → [Determine Phase] → [Load Template]
                                           │
                                           ▼
                                    [Check Format]
                                           │
                         ┌──────────────────┴──────────────────┐
                         ▼                                     ▼
                    [.toon.md]                           [.md only]
                         │                                     │
                         ▼                                     ▼
              [Parse TOON]                          [Use Existing]
                         │                                     │
                         └──────────────────┬──────────────────┘
                                            ▼
                                     [Return Template]
```

**Requirements:**
- Load templates for all DevFlow phases
- Support both .toon.md and .md formats
- Verify template completeness
- Cache parsed templates for performance

### Schema Validation

```
[Parse Document] → [Zod Validation] → [Check Required Fields]
                                            │
                                            ▼
                                     [Check @ref Links]
                                            │
                         ┌──────────────────┴──────────────────┐
                         ▼                                     ▼
                    [Valid]                               [Invalid]
                         │                                     │
                         ▼                                     ▼
                  [Return Valid]                       [Return Errors]
```

**Requirements:**
- Validate all required fields present
- Validate data types (strings, enums, arrays)
- Validate @ref references resolve
- Validate enum values (status, priority)
- Return detailed error messages

---

## 5. Technology Stack

| Layer | Technology | Version | Justification |
|--------|-------------|---------|---------------|
| Language | TypeScript | 5.1.0 - 5.3.0 | Type safety for TOON schemas; compatible with Node.js 18+ |
| Runtime | Node.js | 18.x - 20.x | LTS active support; async/await performance |
| Parser | Custom TOON Parser | 1.0.0 | Token-efficient format; @ref resolution |
| Validation | Zod | 3.x | Type-safe runtime validation; excellent TypeScript integration |
| Testing | Vitest | 1.0+ | Fast unit tests; matches existing framework |
| Token Counting | tiktoken | 1.0+ | Accurate GPT token counting |
| CLI | Commander.js | 11.x | CLI argument parsing |
| File System | Node.js fs | 18+ | Native file operations |

**Technology Stack Justification:**

1. **TypeScript 5.1+**: Provides strict type checking for TOON objects, reducing runtime errors and improving developer experience. Version 5.1+ adds enhanced type inference for complex object types.

2. **Zod 3.x**: Schema validation library that integrates seamlessly with TypeScript. Zod schemas automatically infer TypeScript types, ensuring validation and types stay in sync.

3. **Vitest**: Fast unit test framework with ESM support. Compatible with existing DevFlow test infrastructure.

4. **tiktoken**: OpenAI's tokenizer library for accurate GPT token counting, ensuring TOON meets token efficiency targets.

---

## 6. Security Considerations

| Concern | Mitigation |
|----------|-------------|
| TOON Document Injection | No code execution from document content; parse as text only |
| Path Traversal in Template Loading | Validate and sanitize all file paths; restrict to templates directory |
| Circular Reference DoS | Detect and prevent infinite @ref loops |
| Uncontrolled Token Consumption | Enforce token limits on parsed documents |
| Symbol Injection in @ref | Validate symbol names against allowlist pattern |

**Security Design Principles:**

1. **No Code Execution**: TOON documents are data-only. Parser never executes code from document content.

2. **Path Validation**: All file access restricted to templates directory with explicit allowlist.

3. **Resource Limits**: Maximum file size (100KB), maximum @ref depth (100), maximum symbols (1000).

---

## 7. Deployment Architecture

**Deployment Type:** NPM Package (@xarlord/devflow-enforcer)

```
┌─────────────────────────────────────────────────────────┐
│                  Claude Code                          │
│              (Application Context)                    │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│            DevFlow Enforcer Plugin                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │         TOON Integration Module                 │   │
│  │  ┌─────────────┐  ┌─────────────┐            │   │
│  │  │   Parser    │  │  Resolver   │            │   │
│  │  └─────────────┘  └─────────────┘            │   │
│  │  ┌─────────────┐  ┌─────────────┐            │   │
│  │  │  Validator  │  │   Wizard    │            │   │
│  │  └─────────────┘  └─────────────┘            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Environments:**

| Environment | Purpose | Deployment |
|-------------|---------|------------|
| Development | Local plugin testing | npm link |
| Production | Claude Code Marketplace | npm publish |

**Package Structure:**
```
@xarlord/devflow-enforcer/
├── dist/
│   └── toon/
│       ├── parser.js
│       ├── resolver.js
│       ├── validator.js
│       └── ...
├── templates/
│   ├── requirements.toon.md
│   ├── architecture.toon.md
│   └── ...
└── package.json
```

---

## 8. Monitoring & Logging

| Metric | Tool | Alert Threshold |
|---------|--------|----------------|
| Parse Time | Console.time() | > 100ms |
| Token Count | tiktoken | > 1000 tokens |
| @ref Resolution Rate | Counter | < 99% |
| Validation Errors | Error counter | > 5% |
| Template Load Time | Console.time() | > 200ms |

**Logging Strategy:**

| Level | Use Case | Example |
|-------|----------|---------|
| ERROR | Parse failures, validation errors | "Failed to parse document: Invalid @ref syntax at line 45" |
| WARN | Deprecated features, near limits | "Document approaching token limit: 950/1000" |
| INFO | Template loads, successful parses | "Loaded template: requirements.toon.md (450 tokens)" |
| DEBUG | Detailed parsing steps | "Resolving @ref:phase1 → found symbol" |

---

## 9. Non-Functional Requirements

| Requirement | Target | Measurement |
|--------------|--------|--------------|
| TOON Document Parsing | < 100ms for typical document (1000 tokens) | Unit benchmarks |
| Token Efficiency | 40-60% reduction vs JSON | Token comparison script |
| Template Loading | < 200ms for template resolution | Integration tests |
| Validation Performance | < 150ms for full schema validation | Load testing |
| Parse Success Rate | 99.9% for valid TOON documents | Automated CI/CD tests |
| @ref Resolution | 100% for valid symbols | Unit tests |
| Error Recovery | Graceful degradation on parse errors | Error handling tests |

**Performance Benchmarks (Targets):**

| Operation | Target | Current | Status |
|-----------|--------|---------|--------|
| Parse typical document | < 100ms | TBD | Phase 7 |
| Token count | < 50ms | TBD | Phase 7 |
| @ref resolution | < 50ms | TBD | Phase 7 |
| Schema validation | < 150ms | TBD | Phase 7 |
| Template load | < 200ms | TBD | Phase 7 |

---

## 10. Architecture Decisions

### Decision 1: Custom TOON Parser vs. YAML/JSON

**Decision:** Custom TOON parser for .toon.md files.

**Rationale:**
- TOON format is token-optimized (40-60% smaller than JSON)
- Markdown-based for human readability
- @ref syntax for object linking not supported by standard formats
- BDD-friendly structure (Given/When/Then)

**Trade-offs:**
- +: Optimized for LLM context windows
- +: Human-readable and writable
- -: Requires custom parser implementation
- -: Non-standard format

### Decision 2: Zod for Schema Validation

**Decision:** Use Zod 3.x for runtime schema validation.

**Rationale:**
- TypeScript-first design
- Automatic type inference from schemas
- Excellent error messages
- Lightweight (no runtime dependencies)

**Trade-offs:**
- +: Type-safe validation
- +: Clear error messages
- -: Additional runtime dependency
- -: Learning curve for team

### Decision 3: File-based Template Storage

**Decision:** Store templates as .toon.md files in templates/ directory.

**Rationale:**
- Simple version control (git)
- Easy to edit and review
- No database dependency
- Matches existing DevFlow workflow

**Trade-offs:**
- +: Simple deployment
- +: Git-native
- -: No built-in indexing
- -: Manual template management

### Decision 4: Backward Compatibility Mode

**Decision:** Support both .md and .toon.md formats during transition.

**Rationale:**
- Gradual migration path
- Existing templates continue working
- Allows A/B testing of formats

**Trade-offs:**
- +: No breaking changes
- +: Flexible migration
- -: Dual format support complexity
| -: Maintenance burden during transition

---

## 11. Component Interaction Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                         Agent/CLI                               │
└───────────────────────────┬──────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ Load       │  │ Validate    │  │ Wizard      │
   │ Template   │  │ Document    │  │ Mode        │
   └─────┬───────┘  └─────┬───────┘  └─────┬───────┘
         │                │                │
         ▼                ▼                │
   ┌─────────────┐  ┌─────────────┐       │
   │ Read File  │  │ Read File   │       │
   └─────┬───────┘  └─────┬───────┘       │
         │                │                │
         ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ TOON       │  │ TOON        │  │ TOON        │
   │ Parser     │  │ Parser      │  │ Parser      │
   └─────┬───────┘  └─────┬───────┘  └─────┬───────┘
         │                │                │
         ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ @ref       │  │ @ref       │  │ Interactive │
   │ Resolver   │  │ Resolver    │  │ Prompts     │
   └─────┬───────┘  └─────┬───────┘  └─────┬───────┘
         │                │                │
         ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ Zod        │  │ Zod         │  │ Updated     │
   │ Validator  │  │ Validator    │  │ Document    │
   └─────┬───────┘  └─────┬───────┘  └─────┬───────┘
         │                │                │
         ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ Return     │  │ Validation  │  │ Save        │
   │ Document   │  │ Report      │  │ File        │
   └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 12. File Structure

```
src/toon/
├── types.ts              # TypeScript interfaces (EXISTS)
├── parser.ts            # TOON document parser
├── resolver.ts          # @ref symbol resolution
├── validator.ts         # Zod schema validation
├── token-counter.ts    # Token counting utility
├── schemas/
│   ├── document.schema.ts
│   ├── phase.schema.ts
│   ├── feature.schema.ts
│   ├── user-story.schema.ts
│   └── acceptance-criteria.schema.ts
└── utils/
    ├── error-handler.ts
    └── constants.ts

src/templates/
├── loader.ts            # Template loading system
├── wizard.ts           # Interactive template wizard
├── converter.ts        # Markdown to TOON converter
└── framework.ts        # Template validation framework

templates/
├── requirements.toon.md
├── architecture.toon.md
├── detailed-design.toon.md
├── test-specification.toon.md
└── ...

tests/toon/
├── parser.test.ts
├── resolver.test.ts
├── validator.test.ts
├── token-counter.test.ts
├── loader.test.ts
├── wizard.test.ts
└── ...
```

---

## 13. Integration with Existing DevFlow

### Phase Integration

```
[Phase 1: Requirements]  → requirements.toon.md
[Phase 2: Validation]    → Uses requirements.toon.md
[Phase 3: Architecture]  → architecture.toon.md
[Phase 4: Detailed Design]→ detailed-design.toon.md
[Phase 5: Testing]       → test-specification.toon.md
[Phase 6: Features]      → Feature allocation from previous phases
[Phase 7: Development]   → Implementation from designs
```

### Agent Workflow

```
[Agent Starts Phase]
        │
        ▼
[Load TOON Template] ← TOON-FR-006: Template Loading
        │
        ▼
[Validate Template] ← TOON-FR-011: Template Validation Framework
        │
        ▼
[Guide User with Wizard] ← TOON-FR-010: Interactive Template Wizard
        │
        ▼
[Save Completed Document]
        │
        ▼
[Generate Traceability] ← Links requirements to tests to code
```

---

## 14. Addressing Findings

### TOON-F-004: Missing @ref Target Definitions

**Status:** Open (to be addressed in implementation)

**Resolution Strategy:**
1. Define symbol anchor syntax: `## Symbol: symbol_name`
2. Update parser to extract symbol definitions
3. Validate all @ref references have matching symbols
4. Update existing TOON documents with proper symbol anchors

**Architecture Support:**
- Parser includes symbol extraction phase
- Resolver validates symbol existence before resolution
- Error reporting includes line numbers for missing symbols

### TOON-F-005: TypeScript Schema Not Implemented

**Status:** RESOLVED

**Resolution:**
- TypeScript interfaces defined in `src/toon/types.ts` ✓
- All required interfaces present:
  - TOONDocument ✓
  - TOONPhase ✓
  - TOONFeature ✓
  - TOONUserStory ✓
  - TOONAcceptanceCriteria ✓
  - TOONSuccessCriteria ✓

**Next Step:** Create Zod schemas matching TypeScript interfaces (Phase 4: Detailed Design)

### TOON-F-006: Test Cases Not Defined

**Status:** Open (Expected for Phase 5)

**Resolution:** Test cases will be defined in Phase 5 (Testing Specification)
- 19 test cases (TC-TOON-001 through TC-TOON-019) planned
- Test specification document to be created
- Unit tests for parser, resolver, validator
- Integration tests for template loading
- E2E tests for wizard workflow

---

## 15. Requirements Traceability

| Requirement ID | Component | Status |
|---------------|-----------|--------|
| TOON-FR-001 | TOON Parser | Architecture defined |
| TOON-FR-002 | @ref Resolver | Architecture defined |
| TOON-FR-003 | Metadata Objects | Supported in TOONDocument |
| TOON-FR-004 | Phase Objects | Supported in TOONPhase |
| TOON-FR-005 | Feature Objects | Supported in TOONFeature |
| TOON-FR-006 | Template Loader | Architecture defined |
| TOON-FR-007 | Schema Validator | Architecture defined |
| TOON-FR-008 | Token Counter | Architecture defined |
| TOON-FR-009 | Markdown Converter | Architecture defined |
| TOON-FR-010 | Template Wizard | Architecture defined |
| TOON-FR-011 | Validation Framework | Architecture defined |

---

**Document Status:** Draft
**Last Updated:** 2026-02-13
**Next Review:** After Phase 4 (Detailed Design)
**Related Documents:**
- [requirements-toon-integration.md](./requirements-toon-integration.md) - Functional and non-functional requirements
- [detailed-design-toon-integration.md](./detailed-design-toon-integration.md) - Detailed design specifications (Phase 4)
