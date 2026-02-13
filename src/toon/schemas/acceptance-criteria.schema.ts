/**
 * Zod Schema for TOON Acceptance Criteria
 *
 * Provides runtime validation for TOONAcceptanceCriteria objects
 * @version 1.0.0
 */

import { z } from 'zod';

/**
 * Criteria item schema
 */
const criteriaItemSchema = z.object({
  given: z.string()
    .min(1, 'Given condition is required')
    .max(500, 'Given condition must be less than 500 characters'),

  then: z.string()
    .min(1, 'Then condition is required')
    .max(500, 'Then condition must be less than 500 characters'),

  and: z.array(z.string()
    .max(500, 'Additional condition must be less than 500 characters'))
    .max(5, 'Maximum 5 additional conditions allowed')
    .optional()
});

/**
 * Zod schema for TOONAcceptanceCriteria
 */
export const toonAcceptanceCriteriaSchema = z.object({
  name: z.string()
    .min(1, 'Criteria name is required')
    .max(100, 'Criteria name must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Criteria name must be lowercase alphanumeric with hyphens'),

  criteria: z.array(criteriaItemSchema)
    .min(1, 'At least one criteria item is required')
    .max(10, 'Maximum 10 criteria items allowed'),

  created_at: z.string()
    .datetime('Created date must be a valid ISO 8601 datetime')
});

// Infer TypeScript type from schema
export type ToonAcceptanceCriteriaSchema = z.infer<typeof toonAcceptanceCriteriaSchema>;
