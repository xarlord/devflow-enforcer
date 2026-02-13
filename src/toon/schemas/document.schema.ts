/**
 * Zod Schema for TOON Document
 *
 * Provides runtime validation for TOONDocument objects
 * @version 1.0.0
 */

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
    .datetime('Updated date must be a valid ISO 8601 datetime')
    .optional(),

  status: z.enum(['draft', 'active', 'deprecated', 'superseded']),

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
}).passthrough(); // Allow additional fields like 'type'

// Infer TypeScript type from schema
export type ToonDocumentSchema = z.infer<typeof toonDocumentSchema>;
