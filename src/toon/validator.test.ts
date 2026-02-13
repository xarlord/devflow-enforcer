/**
 * TOON Validator Tests
 *
 * Unit tests for document validation using Zod schemas
 * @version 1.0.0
 */

import { describe, it, expect } from 'vitest';
import { TOONValidator, validateDocument, validateType, getValidator } from './validator';
import type { TOONDocument, ValidationResult } from './types';
import { VALID_MINIMAL_TOON, VALID_COMPLETE_TOON } from '../../test/fixtures';

describe('TOONValidator', () => {
  describe('constructor', () => {
    it('should create validator instance', () => {
      const validator = new TOONValidator();
      expect(validator).toBeDefined();
    });
  });

  describe('validate', () => {
    let validator: TOONValidator;

    beforeEach(() => {
      validator = new TOONValidator();
    });

    it('should validate a valid minimal document', () => {
      const document = {
        name: 'test-document',
        description: 'A test document',
        version: '1.0.0',
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
      };

      const result = validator.validate(document);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.summary).toBeDefined();
    });

    it('should validate a complete document', () => {
      const document: TOONDocument = {
        name: 'test-complete',
        description: 'A complete test document',
        version: '1.0.0',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        tags: ['test', 'complete'],
        phases: [],
        features: [],
        user_stories: [],
      };

      const result = validator.validate(document);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject document with missing required fields', () => {
      const document = {
        name: 'test',
        // missing description
        // missing version
        // missing status
        // missing created_at
      };

      const result = validator.validate(document);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject document with invalid version format', () => {
      const document = {
        name: 'test',
        description: 'Test',
        version: '1.0', // Invalid - should be 1.0.0
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
      };

      const result = validator.validate(document);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_FORMAT')).toBe(true);
    });

    it('should reject document with invalid status enum', () => {
      const document = {
        name: 'test',
        description: 'Test',
        version: '1.0.0',
        status: 'invalid_status',
        created_at: '2026-01-01T00:00:00Z',
      };

      const result = validator.validate(document);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_ENUM')).toBe(true);
    });

    it('should reject document with invalid date format', () => {
      const document = {
        name: 'test',
        description: 'Test',
        version: '1.0.0',
        status: 'draft',
        created_at: 'not-a-date',
      };

      const result = validator.validate(document);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_FORMAT')).toBe(true);
    });

    it('should reject document with invalid name format', () => {
      const document = {
        name: 'Invalid_Name!', // Contains invalid characters
        description: 'Test',
        version: '1.0.0',
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
      };

      const result = validator.validate(document);

      expect(result.valid).toBe(false);
    });

    it('should accept document with valid tags array', () => {
      const document = {
        name: 'test',
        description: 'Test',
        version: '1.0.0',
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
        tags: ['tag1', 'tag2', 'tag3'],
      };

      const result = validator.validate(document);

      expect(result.valid).toBe(true);
    });

    it('should reject document with too many tags', () => {
      const document = {
        name: 'test',
        description: 'Test',
        version: '1.0.0',
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10', 'tag11'],
      };

      const result = validator.validate(document);

      expect(result.valid).toBe(false);
    });

    it('should build validation summary', () => {
      const document: TOONDocument = {
        name: 'test-summary',
        description: 'Test summary building',
        version: '1.0.0',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        phases: [],
        features: [],
        user_stories: [],
      };

      const result = validator.validate(document);

      expect(result.summary).toBeDefined();
      expect(result.summary.totalFields).toBeGreaterThan(0);
      expect(result.summary.validFields).toBeGreaterThan(0);
      expect(result.summary.invalidFields).toBe(0);
      expect(result.summary.missingFields).toBe(0);
    });

    it('should generate warnings for optional fields', () => {
      const document = {
        name: 'test',
        description: 'Test',
        version: '1.0.0',
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
      };

      const result = validator.validate(document);

      expect(result.warnings).toBeDefined();
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('validateType', () => {
    let validator: TOONValidator;

    beforeEach(() => {
      validator = new TOONValidator();
    });

    it('should validate REQUIREMENTS document type', () => {
      const document = {
        name: 'test-requirements',
        description: 'Requirements document',
        version: '1.0.0',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        type: 'REQUIREMENTS',
      };

      const result = validator.validateType(document, 'REQUIREMENTS');

      expect(result.valid).toBe(true);
    });

    it('should validate ARCHITECTURE document type', () => {
      const document = {
        name: 'test-architecture',
        description: 'Architecture document',
        version: '1.0.0',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        type: 'ARCHITECTURE',
      };

      const result = validator.validateType(document, 'ARCHITECTURE');

      expect(result.valid).toBe(true);
    });

    it('should validate DETAILED_DESIGN document type', () => {
      const document = {
        name: 'test-detailed-design',
        description: 'Detailed design document',
        version: '1.0.0',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        type: 'DETAILED_DESIGN',
      };

      const result = validator.validateType(document, 'DETAILED_DESIGN');

      expect(result.valid).toBe(true);
    });

    it('should validate TEST_SPECIFICATION document type', () => {
      const document = {
        name: 'test-specification',
        description: 'Test specification document',
        version: '1.0.0',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        type: 'TEST_SPECIFICATION',
      };

      const result = validator.validateType(document, 'TEST_SPECIFICATION');

      expect(result.valid).toBe(true);
    });

    it('should validate ROADMAP document type', () => {
      const document = {
        name: 'test-roadmap',
        description: 'Roadmap document',
        version: '1.0.0',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        type: 'ROADMAP',
      };

      const result = validator.validateType(document, 'ROADMAP');

      expect(result.valid).toBe(true);
    });
  });

  describe('validateReferences', () => {
    let validator: TOONValidator;

    beforeEach(() => {
      validator = new TOONValidator();
    });

    it('should validate document with valid @ref references', () => {
      const document = {
        name: 'test-refs',
        description: 'Test with references',
        version: '1.0.0',
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
      };

      const symbolTable = new Map([
        ['feature-a', { name: 'feature-a', type: 'feature' }],
        ['feature-b', { name: 'feature-b', type: 'feature' }],
      ]);

      const result = validator.validateReferences(document, symbolTable);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect unresolved @ref references', () => {
      const document = {
        name: 'test-unresolved',
        description: 'Test with unresolved refs',
        version: '1.0.0',
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
        depends_on: '@ref(missing-feature)',
      };

      const symbolTable = new Map([
        ['feature-a', { name: 'feature-a', type: 'feature' }],
      ]);

      const result = validator.validateReferences(document, symbolTable);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.code === 'REF_NOT_FOUND')).toBe(true);
    });

    it('should detect circular @ref references', () => {
      const document = {
        name: 'test-circular',
        description: 'Test with circular refs',
        version: '1.0.0',
        status: 'draft',
        created_at: '2026-01-01T00:00:00Z',
        depends_on: '@ref(feature-a)',
      };

      const symbolTable = new Map([
        ['feature-a', {
          name: 'feature-a',
          type: 'feature',
          depends_on: '@ref(feature-b)',
        }],
        ['feature-b', {
          name: 'feature-b',
          type: 'feature',
          depends_on: '@ref(feature-a)',
        }],
      ]);

      const result = validator.validateReferences(document, symbolTable);

      expect(result.valid).toBe(false);
      expect(result.circularChains).toBeDefined();
      expect(result.circularChains.length).toBeGreaterThan(0);
    });
  });
});

describe('validateDocument', () => {
  it('should validate document using default validator', () => {
    const document = {
      name: 'test',
      description: 'Test document',
      version: '1.0.0',
      status: 'draft',
      created_at: '2026-01-01T00:00:00Z',
    };

    const result = validateDocument(document);

    expect(result.valid).toBe(true);
  });
});

describe('validateType', () => {
  it('should validate document type using default validator', () => {
    const document = {
      name: 'test',
      description: 'Test document',
      version: '1.0.0',
      status: 'draft',
      created_at: '2026-01-01T00:00:00Z',
      type: 'REQUIREMENTS',
    };

    const result = validateType(document, 'REQUIREMENTS');

    expect(result.valid).toBe(true);
  });
});

describe('getValidator', () => {
  it('should return singleton validator instance', () => {
    const validator1 = getValidator();
    const validator2 = getValidator();

    expect(validator1).toBe(validator2);
  });
});
