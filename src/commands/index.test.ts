/**
 * CLI Commands Tests
 *
 * Unit tests for slash command implementations
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';

// Mock fs module
const mockReadFile = vi.fn();
const mockWriteFile = vi.fn();
const mockStat = vi.fn();
const mockAccess = vi.fn();
const mockReaddir = vi.fn();
const mockStatSync = vi.fn();
const mockExistsSync = vi.fn();

vi.mock('fs', () => ({
  promises: {
    readFile: (...args: any[]) => mockReadFile(...args),
    writeFile: (...args: any[]) => mockWriteFile(...args),
    stat: (...args: any[]) => mockStat(...args),
    access: (...args: any[]) => mockAccess(...args),
    readdir: (...args: any[]) => mockReaddir(...args),
  },
  statSync: (...args: any[]) => mockStatSync(...args),
  existsSync: (...args: any[]) => mockExistsSync(...args),
}));

describe('CLI Commands', () => {
  beforeEach(() => {
    // Reset all mocks
    mockReadFile.mockReset();
    mockWriteFile.mockReset();
    mockStat.mockReset();
    mockAccess.mockReset();
    mockReaddir.mockReset();
    mockStatSync.mockReset();
    mockExistsSync.mockReset();
    vi.clearAllMocks();

    // Set up default statSync mock
    mockStatSync.mockReturnValue({
      size: 1000,
      mtime: new Date(),
      isFile: () => true,
      isDirectory: () => false,
    });
  });

  describe('executeStart', () => {
    it('should initialize requirements phase', async () => {
      const { executeStart } = await import('./index');

      const mockContent = `# TOON Document

## Document Overview

- name: "requirements"
- description: "Requirements template"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      mockReadFile.mockResolvedValue(mockContent);
      mockStat.mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);
      mockWriteFile.mockResolvedValue(undefined);

      const result = await executeStart('requirements', { format: 'toon' });

      expect(result.success).toBe(true);
      expect(result.message).toContain('requirements');
    });

    it('should initialize architecture phase', async () => {
      const { executeStart } = await import('./index');

      const mockContent = `# TOON Document

## Document Overview

- name: "architecture"
- description: "Architecture template"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      mockReadFile.mockResolvedValue(mockContent);
      mockStat.mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);
      mockWriteFile.mockResolvedValue(undefined);

      const result = await executeStart('architecture', { format: 'toon' });

      expect(result.success).toBe(true);
      expect(result.message).toContain('architecture');
    });

    it('should handle template loading errors gracefully', async () => {
      const { executeStart } = await import('./index');

      mockReadFile.mockRejectedValue(new Error('Template not found'));

      const result = await executeStart('non-existent', { format: 'toon' });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed');
    });
  });

  describe('executeValidate', () => {
    it('should validate a valid TOON document', async () => {
      const { executeValidate } = await import('./index');

      const validContent = `# TOON Document

## Document Overview

- name: "test-validation"
- description: "Valid document for testing"
- version: "1.0.0"
- status: "active"
- created_at: "2026-01-01T00:00:00Z"
- updated_at: "2026-01-01T00:00:00Z"
- tags: []
`;

      // Mock readdir to return a TOON file
      mockReaddir.mockResolvedValue(['test-validation.toon.md']);
      mockReadFile.mockResolvedValue(validContent);

      const result = await executeValidate({ file: 'test-validation.toon.md' });

      expect(result.success).toBe(true);
      expect(result.message).toContain('passed');
    });

    it('should detect validation errors in invalid document', async () => {
      const { executeValidate } = await import('./index');

      const invalidContent = `# TOON Document

## Document Overview

- name: "test-invalid"
- description: "Invalid document"
`;

      mockReadFile.mockResolvedValue(invalidContent);

      const result = await executeValidate({});

      expect(result.success).toBe(false);
      expect(result.message).toContain('failed');
    });

    it('should validate specified file', async () => {
      const { executeValidate } = await import('./index');

      const validContent = `# TOON Document

## Document Overview

- name: "specific-file"
- description: "Test specific file validation"
- version: "1.0.0"
- status: "active"
- created_at: "2026-01-01T00:00:00Z"
`;

      mockReadFile.mockResolvedValue(validContent);

      const result = await executeValidate({ file: 'specific-file.toon.md' });

      expect(result.success).toBe(true);
    });

    it('should return error when no file found', async () => {
      const { executeValidate } = await import('./index');

      mockReaddir.mockResolvedValue([]);

      const result = await executeValidate({});

      expect(result.success).toBe(false);
      expect(result.message).toContain('No TOON file found');
    });
  });

  describe('executeConvert', () => {
    it('should convert TOON to Markdown', async () => {
      const { executeConvert } = await import('./index');

      const toonContent = `# TOON Document

## Document Overview

- name: "test-convert"
- description: "Test conversion"
- version: "1.0.0"
- status: "active"
- created_at: "2026-01-01T00:00:00Z"
`;

      mockReadFile.mockResolvedValue(toonContent);
      mockWriteFile.mockResolvedValue(undefined);
      mockStat.mockResolvedValue({
        size: toonContent.length,
      } as any);

      const result = await executeConvert({
        input: 'test.toon.md',
        format: 'markdown',
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('markdown');
    });

    it('should convert Markdown to TOON', async () => {
      const { executeConvert } = await import('./index');

      const mdContent = `# Test Document

## Overview

Name: test
Description: Test conversion
`;

      mockReadFile.mockResolvedValue(mdContent);
      mockWriteFile.mockResolvedValue(undefined);
      mockStat.mockResolvedValue({
        size: mdContent.length,
      } as any);

      const result = await executeConvert({
        input: 'test.md',
        format: 'toon',
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('toon');
    });

    it('should detect input format from extension', async () => {
      const { executeConvert } = await import('./index');

      const toonContent = `# TOON Document

## Document Overview

- name: "auto-detect"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      mockReadFile.mockResolvedValue(toonContent);
      mockWriteFile.mockResolvedValue(undefined);
      mockStat.mockResolvedValue({
        size: toonContent.length,
      } as any);

      const result = await executeConvert({
        input: 'auto-detect.toon.md',
      });

      expect(result.success).toBe(true);
    });

    it('should generate output filename', async () => {
      const { executeConvert } = await import('./index');

      const toonContent = `# TOON Document

## Document Overview

- name: "output-test"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      mockReadFile.mockResolvedValue(toonContent);
      mockWriteFile.mockResolvedValue(undefined);
      mockStat.mockResolvedValue({
        size: toonContent.length,
      } as any);

      const result = await executeConvert({
        input: 'output-test.toon.md',
        format: 'markdown',
      });

      expect(result.success).toBe(true);
      expect(result.data?.output).toBeDefined();
    });
  });

  describe('executeWizard', () => {
    it.skip('should run wizard with template', async () => {
      // Skip wizard tests for now - requires readline mocking
      // TODO: Mock readline interface for wizard tests
    });

    it.skip('should use provided context in wizard', async () => {
      const { executeWizard } = await import('./index');

      const mockContent = `# TOON Document

## Document Overview

- name: "context-test"
- description: "Test context usage"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      mockReadFile.mockResolvedValue(mockContent);
      mockStat.mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);
      mockWriteFile.mockResolvedValue(undefined);

      const result = await executeWizard({
        template: 'requirements',
        context: {
          projectName: 'test-project',
          projectVersion: '2.0.0',
          author: 'Test Author',
          tags: ['test', 'wizard'],
        },
      });

      expect(result.success).toBe(true);
    });

    it.skip('should handle wizard errors gracefully', async () => {
      const { executeWizard } = await import('./index');

      mockReadFile.mockRejectedValue(new Error('Template not found'));

      const result = await executeWizard({
        template: 'non-existent',
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('failed');
    });
  });

  describe('DevFlowCommands class', () => {
    it('should create commands instance', async () => {
      const { DevFlowCommands } = await import('./index');

      const commands = new DevFlowCommands();

      expect(commands).toBeDefined();
    });

    it('should share default instance', async () => {
      const { getCommands } = await import('./index');

      const cmd1 = getCommands();
      const cmd2 = getCommands();

      expect(cmd1).toBe(cmd2);
    });
  });
});
