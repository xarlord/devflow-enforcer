/**
 * Validation Utilities
 *
 * Helper utilities for TOON validation
 * @version 1.0.0
 */

/**
 * Validate ISO 8601 date string
 * @param value - Date string to validate
 * @returns True if valid ISO 8601 date
 */
export function isValidISO8601Date(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const date = new Date(value);
  return !isNaN(date.getTime()) && value.includes('T');
}

/**
 * Validate semver version string
 * @param value - Version string to validate
 * @returns True if valid semver format
 */
export function isValidSemver(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([a-z0-9]+(?:\.[a-z0-9]+)*))?$/i;
  return semverRegex.test(value);
}

/**
 * Validate @ref symbol format
 * @param value - Symbol reference to validate
 * @returns True if valid @ref format
 */
export function isValidRefSymbol(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }

  return value.startsWith('@ref:') && value.length > 5; // @ref: + at least 1 char
}

/**
 * Extract symbol name from @ref reference
 * @param ref - Reference string (e.g., "@ref:phase1")
 * @returns Extracted symbol name (e.g., "phase1")
 */
export function extractSymbolName(ref: string): string {
  if (!isValidRefSymbol(ref)) {
    return '';
  }

  return ref.substring(5); // Remove '@ref:' prefix
}

/**
 * Validate priority enum value
 * @param value - Priority value to validate
 * @returns True if valid priority
 */
export function isValidPriority(value: string): boolean {
  const validPriorities = ['high', 'medium', 'low'];
  return validPriorities.includes(value);
}

/**
 * Validate status enum value
 * @param value - Status value to validate
 * @returns True if valid status
 */
export function isValidStatus(value: string): boolean {
  const validStatuses = [
    'draft',
    'active',
    'deprecated',
    'superseded',
    'planned',
    'in-progress',
    'completed',
    'blocked',
    'cancelled'
  ];
  return validStatuses.includes(value);
}

/**
 * Validate array field doesn't exceed max length
 * @param value - Array to validate
 * @param maxLength - Maximum allowed length
 * @returns True if within limit
 */
export function isValidArrayLength(value: any[], maxLength: number): boolean {
  return Array.isArray(value) && value.length <= maxLength;
}

/**
 * Validate string field doesn't exceed max length
 * @param value - String to validate
 * @param maxLength - Maximum allowed length
 * @returns True if within limit
 */
export function isValidStringLength(value: string, maxLength: number): boolean {
  return typeof value === 'string' && value.length <= maxLength;
}

/**
 * Validate tag format and constraints
 * @param tags - Tags array to validate
 * @returns Validation result with isValid and errors
 */
export function validateTags(tags: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(tags)) {
    return { valid: false, errors: ['Tags must be an array'] };
  }

  if (tags.length > 10) {
    errors.push('Maximum 10 tags allowed');
  }

  for (const tag of tags) {
    if (typeof tag !== 'string') {
      errors.push(`Tag "${tag}" must be a string`);
    } else if (tag.length > 50) {
      errors.push(`Tag "${tag}" exceeds 50 character limit`);
    } else if (!/^[a-z0-9-]+$/.test(tag)) {
      errors.push(`Tag "${tag}" must be lowercase alphanumeric with hyphens`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate date is after another date
 * @param date - Date to validate
 * @param afterDate - Date that must be before
 * @returns True if date is after afterDate
 */
export function isDateAfter(date: string, afterDate: string): boolean {
  const d1 = new Date(date);
  const d2 = new Date(afterDate);
  return d1 > d2;
}

/**
 * Create validation error object
 * @param field - Field name
 * @param message - Error message
 * @param code - Error code
 * @param severity - Error severity
 * @returns Validation error object
 */
export function createValidationError(
  field: string,
  message: string,
  code: string,
  severity: 'error' | 'warning' = 'error'
): { field: string; message: string; code: string; severity: 'error' | 'warning' } {
  return {
    field,
    message,
    code,
    severity
  };
}

/**
 * Format validation errors for display
 * @param errors - Array of validation errors
 * @returns Formatted error string
 */
export function formatValidationErrors(errors: { field: string; message: string; code: string }[]): string {
  if (errors.length === 0) {
    return '';
  }

  return errors
    .map(err => `  - ${err.field}: ${err.message} (${err.code})`)
    .join('\n');
}
