/**
 * Zod Schema for TOON User Story
 *
 * Provides runtime validation for TOONUserStory objects
 * @version 1.0.0
 */

import { z } from 'zod';

/**
 * Zod schema for TOONUserStory
 */
export const toonUserStorySchema = z.object({
  name: z.string()
    .min(1, 'User story name is required')
    .max(100, 'User story name must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'User story name must be lowercase alphanumeric with hyphens'),

  role: z.string()
    .min(1, 'Role is required')
    .max(50, 'Role must be less than 50 characters'),

  given: z.string()
    .min(1, 'Given condition is required')
    .max(500, 'Given condition must be less than 500 characters'),

  when: z.string()
    .min(1, 'When condition is required')
    .max(500, 'When condition must be less than 500 characters'),

  then: z.string()
    .min(1, 'Then condition is required')
    .max(500, 'Then condition must be less than 500 characters'),

  and: z.array(z.string()
    .max(500, 'Additional condition must be less than 500 characters'))
    .max(5, 'Maximum 5 additional conditions allowed')
    .optional(),

  benefit: z.string()
    .min(1, 'Benefit is required')
    .max(500, 'Benefit must be less than 500 characters'),

  priority: z.enum(['high', 'medium', 'low'], {
    errorMap: () => ({ message: 'Priority must be one of: high, medium, low' })
  }),

  created_at: z.string()
    .datetime('Created date must be a valid ISO 8601 datetime')
});

// Infer TypeScript type from schema
export type ToonUserStorySchema = z.infer<typeof toonUserStorySchema>;
