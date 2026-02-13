/**
 * File System Mock Utilities
 *
 * Utilities for mocking file system operations in tests
 * @version 1.0.0
 */

import { vi } from 'vitest';
import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Mock file system entry
 */
export interface MockFileEntry {
  path: string;
  content: string;
  stats?: {
    size: number;
    mtime: Date;
    isFile: boolean;
    isDirectory: boolean;
  };
}

/**
 * Mock file system options
 */
export interface MockFsOptions {
  baseDir?: string;
  files?: MockFileEntry[];
  directories?: string[];
}

/**
 * Create a mock file system
 * @param options - Mock file system options
 * @returns Cleanup function
 */
export function createMockFs(options: MockFsOptions = {}): () => void {
  const { baseDir = '/mock', files = [], directories = [] } = options;

  // Create mock stats
  const mockStats = vi.fn((filePath: string) => ({
    size: 0,
    mtime: new Date(),
    isFile: () => true,
    isDirectory: () => false,
    ...files.find(f => f.path === filePath)?.stats,
  }));

  // Mock fs.promises.readFile
  const readFileSpy = vi.spyOn(fs, 'readFile').mockImplementation(
    async (filePath: string) => {
      const file = files.find(f => f.path === filePath);
      if (file) {
        return file.content;
      }
      throw new Error(`File not found: ${filePath}`);
    }
  );

  // Mock fs.promises.writeFile
  const writeFileSpy = vi.spyOn(fs, 'writeFile').mockImplementation(
    async (filePath: string, content: string) => {
      const existingIndex = files.findIndex(f => f.path === filePath);
      if (existingIndex >= 0) {
        files[existingIndex].content = content;
      } else {
        files.push({ path: filePath, content });
      }
    }
  );

  // Mock fs.promises.stat
  const statSpy = vi.spyOn(fs, 'stat').mockImplementation(
    async (filePath: string) => {
      const file = files.find(f => f.path === filePath);
      if (file) {
        return mockStats(filePath);
      }
      throw new Error(`File not found: ${filePath}`);
    }
  );

  // Mock fs.promises.access
  const accessSpy = vi.spyOn(fs, 'access').mockImplementation(
    async (filePath: string) => {
      const file = files.find(f => f.path === filePath);
      const dir = directories.find(d => d === filePath);
      if (file || dir) {
        return;
      }
      throw new Error(`Path not found: ${filePath}`);
    }
  );

  // Mock fs.promises.readdir
  const readdirSpy = vi.spyOn(fs, 'readdir').mockImplementation(
    async (dirPath: string) => {
      const entries = files
        .filter(f => path.dirname(f.path) === dirPath)
        .map(f => path.basename(f.path));

      const subDirs = directories
        .filter(d => path.dirname(d) === dirPath)
        .map(d => path.basename(d));

      return [...entries, ...subDirs];
    }
  );

  // Return cleanup function
  return () => {
    readFileSpy.mockRestore();
    writeFileSpy.mockRestore();
    statSpy.mockRestore();
    accessSpy.mockRestore();
    readdirSpy.mockRestore();
  };
}

/**
 * Create mock TOON document content
 * @param overrides - Fields to override
 * @returns TOON document content
 */
export function createMockToonDocument(overrides: Partial<Record<string, any>> = {}): string {
  const defaults = {
    name: 'test-document',
    description: 'A test TOON document',
    version: '1.0.0',
    status: 'draft',
    created_at: new Date().toISOString(),
    tags: ['test', 'mock'],
  };

  const merged = { ...defaults, ...overrides };

  return `# TOON Document

## Document Overview

- name: "${merged.name}"
- description: "${merged.description}"
- version: "${merged.version}"
- status: "${merged.status}"
- created_at: "${merged.created_at}"
- tags: [${merged.tags.join(', ')}]
`;
}

/**
 * Create mock JSON document
 * @param overrides - Fields to override
 * @returns JSON document object
 */
export function createMockJsonDocument(overrides: Partial<Record<string, any>> = {}): Record<string, any> {
  const defaults = {
    name: 'test-document',
    description: 'A test TOON document',
    version: '1.0.0',
    status: 'draft',
    created_at: new Date().toISOString(),
    tags: ['test', 'mock'],
  };

  return { ...defaults, ...overrides };
}

/**
 * Create mock symbol table
 * @returns Map of mock symbols
 */
export function createMockSymbolTable(): Map<string, any> {
  return new Map([
    ['test-phase', {
      name: 'test-phase',
      type: 'phase',
      content: '- name: "Test Phase"\n- status: "draft"',
    }],
    ['test-feature', {
      name: 'test-feature',
      type: 'feature',
      content: '- name: "Test Feature"\n- effort: "2 weeks"',
    }],
  ]);
}

/**
 * Assert validation result
 * @param result - Validation result
 * @param expected - Expected properties
 */
export function assertValidationResult(
  result: { valid: boolean; errors: any[]; warnings?: any[] },
  expected: { valid: boolean; errorCount?: number; warningCount?: number }
): void {
  expect(result.valid).toBe(expected.valid);
  if (expected.errorCount !== undefined) {
    expect(result.errors.length).toBe(expected.errorCount);
  }
  if (expected.warningCount !== undefined && result.warnings) {
    expect(result.warnings.length).toBe(expected.warningCount);
  }
}

/**
 * Assert parse result
 * @param result - Parse result
 * @param expected - Expected properties
 */
export function assertParseResult(
  result: { success: boolean; document?: any; errors?: any[] },
  expected: { success: boolean; hasDocument?: boolean; errorCount?: number }
): void {
  expect(result.success).toBe(expected.success);
  if (expected.hasDocument !== undefined) {
    expect(result.document).toBeDefined();
    if (expected.hasDocument) {
      expect(Object.keys(result.document || {}).length).toBeGreaterThan(0);
    }
  }
  if (expected.errorCount !== undefined) {
    expect(result.errors?.length || 0).toBe(expected.errorCount);
  }
}

/**
 * Wait for async operations
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after delay
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Flush all pending promises
 * @returns Promise that resolves when microtasks complete
 */
export function flushPromises(): Promise<void> {
  return new Promise(resolve => setImmediate(resolve));
}
