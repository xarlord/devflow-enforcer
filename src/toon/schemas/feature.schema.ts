/**
 * Zod Schema for TOON Feature
 *
 * Provides runtime validation for TOONFeature objects
 * @version 1.0.0
 */

import { z } from 'zod';

/**
 * Zod schema for TOONFeature
 */
export const toonFeatureSchema = z.object({
  name: z.string()
    .min(1, 'Feature name is required')
    .max(100, 'Feature name must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Feature name must be lowercase alphanumeric with hyphens'),

  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),

  priority: z.enum(['high', 'medium', 'low'], {
    errorMap: () => ({ message: 'Priority must be one of: high, medium, low' })
  }),

  effort: z.string()
    .min(1, 'Effort estimate is required')
    .regex(/^(\d+\s+(hour|day|week|month)s?|\d+h|\d+d|\d+w|\d+m)$/i, 'Effort must be a time estimate (e.g., 2 weeks, 3 days, 4h)'),

  team: z.string()
    .min(1, 'Team size is required')
    .regex(/^(\d+\s+(people?|developers?|engineers?)|\d+p)$/i, 'Team must specify number of people'),

  status: z.enum(['planned', 'in-progress', 'completed', 'blocked', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be one of: planned, in-progress, completed, blocked, cancelled' })
  }),

  phase: z.string()
    .min(1, 'Phase reference is required')
    .startsWith('@ref:', 'Phase reference must start with @ref:'),

  user_stories: z.array(z.string()
    .startsWith('@ref:', 'User story reference must start with @ref:'))
    .default([]),

  acceptance_criteria: z.array(z.string()
    .startsWith('@ref:', 'Acceptance criteria reference must start with @ref:'))
    .default([]),

  technical_specs: z.string()
    .startsWith('@ref:', 'Technical specs reference must start with @ref:')
    .optional(),

  created_at: z.string()
    .datetime('Created date must be a valid ISO 8601 datetime')
});

// Infer TypeScript type from schema
export type ToonFeatureSchema = z.infer<typeof toonFeatureSchema>;
