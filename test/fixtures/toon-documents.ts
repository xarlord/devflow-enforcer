/**
 * TOON Document Fixtures
 *
 * Sample TOON documents for testing
 * @version 1.0.0
 */

/**
 * Valid minimal TOON document
 */
export const VALID_MINIMAL_TOON = `# TOON Document

## Document Overview

- name: "test-minimal"
- description: "A minimal valid TOON document"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

/**
 * Valid complete TOON document
 */
export const VALID_COMPLETE_TOON = `# TOON Document

## Document Overview

- name: "test-complete"
- description: "A complete TOON document with all fields"
- version: "1.0.0"
- status: "active"
- created_at: "2026-01-01T00:00:00Z"
- tags: [test, fixture, complete]

## Symbol: test-phase

- name: "Test Phase"
- description: "A test phase"
- status: "draft"
- start_date: "2026-01-01"
- target_date: "2026-01-31"
- success_criteria: []
`;

/**
 * TOON document with multiple symbols
 */
export const TOON_WITH_SYMBOLS = `# TOON Document

## Document Overview

- name: "test-symbols"
- description: "TOON document with symbol definitions"
- version: "1.0.0"
- status: "active"
- created_at: "2026-01-01T00:00:00Z"

## Symbol: phase-requirements

- name: "Requirements"
- description: "Requirements gathering phase"
- status: "completed"
- start_date: "2026-01-01"
- target_date: "2026-01-07"

## Symbol: phase-architecture

- name: "Architecture"
- description: "Architecture design phase"
- status: "active"
- start_date: "2026-01-08"
- target_date: "2026-01-14"

## Symbol: feature-parser

- name: "TOON Parser"
- description: "Parse TOON format into objects"
- effort: "2 weeks"
- team_size: 2
- priority: "high"
- status: "in_progress"

## Symbol: user-story-parse

- name: "Parse TOON File"
- as: "developer"
- i_want_to: "parse TOON files into objects"
- so_that: "I can process them programmatically"

- given: "a valid TOON file"
- when: "I call the parser"
- then: "the file should be parsed into a JavaScript object"

- and: "the object should contain all document fields"
- and: "the object should contain all symbol definitions"
`;

/**
 * TOON document with @ref references
 */
export const TOON_WITH_REFS = `# TOON Document

## Document Overview

- name: "test-refs"
- description: "TOON document with @ref references"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"

## Symbol: feature-main

- name: "Main Feature"
- description: "Main feature implementation"
- effort: "4 weeks"
- depends_on: @ref(feature-helper)
- priority: "high"

## Symbol: feature-helper

- name: "Helper Feature"
- description: "Helper feature"
- effort: "1 week"
- priority: "medium"
`;

/**
 * TOON document with circular @ref references (for cycle detection)
 */
export const TOON_WITH_CIRCULAR_REFS = `# TOON Document

## Document Overview

- name: "test-circular"
- description: "TOON document with circular references"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"

## Symbol: feature-a

- name: "Feature A"
- depends_on: @ref(feature-b)

## Symbol: feature-b

- name: "Feature B"
- depends_on: @ref(feature-c)

## Symbol: feature-c

- name: "Feature C"
- depends_on: @ref(feature-a)
`;

/**
 * Invalid TOON document - missing required fields
 */
export const INVALID_MISSING_REQUIRED = `# TOON Document

## Document Overview

- name: "test-invalid"
- description: "Document missing required fields"
`;

/**
 * Invalid TOON document - invalid version format
 */
export const INVALID_VERSION_FORMAT = `# TOON Document

## Document Overview

- name: "test-version"
- description: "Document with invalid version"
- version: "1.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

/**
 * Invalid TOON document - invalid status enum
 */
export const INVALID_STATUS_ENUM = `# TOON Document

## Document Overview

- name: "test-status"
- description: "Document with invalid status"
- version: "1.0.0"
- status: "invalid_status"
- created_at: "2026-01-01T00:00:00Z"
`;

/**
 * Invalid TOON document - invalid date format
 */
export const INVALID_DATE_FORMAT = `# TOON Document

## Document Overview

- name: "test-date"
- description: "Document with invalid date"
- version: "1.0.0"
- status: "draft"
- created_at: "not-a-date"
`;

/**
 * Valid requirements document
 */
export const VALID_REQUIREMENTS_TOON = `# TOON Document

## Document Overview

- name: "toon-integration-requirements"
- description: "Requirements for TOON integration feature"
- version: "1.0.0"
- status: "active"
- created_at: "2026-02-12T10:00:00Z"
- tags: [requirements, toon, integration]

## Symbol: FR-001

- name: "Parse TOON Format"
- description: "System must parse TOON format documents"
- priority: "high"
- status: "active"

## Symbol: US-001

- name: "Parse Simple Document"
- as: "developer"
- i_want_to: "parse a simple TOON document"
- so_that: "I can process document metadata"

- given: "a valid TOON document"
- when: "I call parseTOON(content)"
- then: "the document object is returned"
- and: "the object contains name, description, version fields"
`;

/**
 * Valid architecture document
 */
export const VALID_ARCHITECTURE_TOON = `# TOON Document

## Document Overview

- name: "toon-integration-architecture"
- description: "Architecture design for TOON integration"
- version: "1.0.0"
- status: "active"
- created_at: "2026-02-12T10:00:00Z"
- tags: [architecture, toon]

## Symbol: component-parser

- name: "TOON Parser Component"
- type: "parser"
- interface: "parse(content: string): TOONParseResult"
- dependencies: []
`;

/**
 * Empty TOON document
 */
export const EMPTY_TOON = `# TOON Document

## Document Overview

`;

/**
 * Malformed TOON document (syntax errors)
 */
export const MALFORMED_TOON = `# TOON Document

## Document Overview

name: "test"
- description "missing colon"
version 1.0.0
`;

/**
 * TOON document with nested sections
 */
export const TOON_WITH_NESTED_SECTIONS = `# TOON Document

## Document Overview

- name: "test-nested"
- description: "TOON with nested sections"
- version: "1.0.0"
- status: "active"
- created_at: "2026-01-01T00:00:00Z"

## Features

### High Priority

- name: "Feature A"
- priority: "high"

### Low Priority

- name: "Feature B"
- priority: "low"

## User Stories

- name: "Story 1"
- as: "user"
- i_want_to: "do something"
- so_that: "I can achieve a goal"
`;
