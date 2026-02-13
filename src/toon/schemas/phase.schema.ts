/**
 * Zod Schema for TOON Phase
 *
 * Provides runtime validation for TOONPhase objects
 * @version 1.0.0
 */

import { z } from 'zod';

/**
 * Zod schema for TOONSuccessCriteria
 */
export const toonSuccessCriteriaSchema = z.object({
  name: z.string().min(1, 'Criteria name is required'),
  criteria: z.string().min(1, 'Criteria description is required'),
  target: z.string().min(1, 'Target value is required'),
  measurement: z.string().min(1, 'Measurement method is required'),
  current: z.string().default('0'),
  achieved: z.boolean().default(false),
  created_at: z.string().datetime('Created date must be a valid ISO 8601 datetime')
});

/**
 * Zod schema for TOONPhase
 */
export const toonPhaseSchema = z.object({
  name: z.string()
    .min(1, 'Phase name is required')
    .regex(/^[a-z0-9-]+$/, 'Phase name must be lowercase alphanumeric with hyphens'),

  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),

  version: z.string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver format (e.g., 1.0.0)'),

  timeline: z.string()
    .min(1, 'Timeline description is required'),

  priority: z.enum(['high', 'medium', 'low'], {
    errorMap: () => ({ message: 'Priority must be one of: high, medium, low' })
  }),

  start_date: z.string()
    .datetime('Start date must be a valid ISO 8601 datetime'),

  target_date: z.string()
    .datetime('Target date must be a valid ISO 8601 datetime')
    .refine((date, ctx) => {
      const startDate = ctx.parent as { start_date: string };
      return new Date(date) > new Date(startDate.start_date);
    }, 'Target date must be after start date'),

  features: z.array(z.string())
    .default([]),

  success_criteria: toonSuccessCriteriaSchema.optional()
});

// Infer TypeScript types from schemas
export type ToonSuccessCriteriaSchema = z.infer<typeof toonSuccessCriteriaSchema>;
export type ToonPhaseSchema = z.infer<typeof toonPhaseSchema>;
