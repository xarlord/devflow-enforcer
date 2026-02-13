/**
 * Template Loader Tests
 *
 * Unit tests for template loading with caching
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TemplateLoader, loadTemplate, listTemplates, getLoader } from './loader';
import { promises as fs } from 'fs';
import type { LoadedTemplate, TemplateMetadata } from './types';

// Mock fs module
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    stat: vi.fn(),
    access: vi.fn(),
    readdir: vi.fn(),
  },
}));

describe('TemplateLoader', () => {
  let loader: TemplateLoader;

  beforeEach(() => {
    loader = new TemplateLoader();
    vi.clearAllMocks();
  });

  afterEach(() => {
    loader.clearCache();
  });

  describe('constructor', () => {
    it('should create loader with default options', () => {
      const l = new TemplateLoader();
      expect(l).toBeDefined();
    });

    it('should create loader with custom options', () => {
      const l = new TemplateLoader({
        cacheMaxSize: 50,
        cacheTtl: 600000,
      });
      expect(l).toBeDefined();
    });
  });

  describe('loadTemplate', () => {
    it('should load requirements template', async () => {
      const mockContent = `# TOON Document

## Document Overview

- name: "requirements"
- description: "Requirements template"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      vi.mocked(fs.stat).mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);

      const template = await loader.loadTemplate('requirements', 'toon');

      expect(template).toBeDefined();
      expect(template.name).toBe('requirements');
      expect(template.content).toBe(mockContent);
      expect(template.format).toBe('toon');
    });

    it('should load architecture template', async () => {
      const mockContent = `# TOON Document

## Document Overview

- name: "architecture"
- description: "Architecture template"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      vi.mocked(fs.stat).mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);

      const template = await loader.loadTemplate('architecture', 'toon');

      expect(template).toBeDefined();
      expect(template.name).toBe('architecture');
    });

    it('should load detailed-design template', async () => {
      const mockContent = `# TOON Document

## Document Overview

- name: "detailed-design"
- description: "Detailed design template"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      vi.mocked(fs.stat).mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);

      const template = await loader.loadTemplate('detailed-design', 'toon');

      expect(template).toBeDefined();
      expect(template.name).toBe('detailed-design');
    });

    it('should load test-specification template', async () => {
      const mockContent = `# TOON Document

## Document Overview

- name: "test-specification"
- description: "Test specification template"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      vi.mocked(fs.stat).mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);

      const template = await loader.loadTemplate('test-specification', 'toon');

      expect(template).toBeDefined();
      expect(template.name).toBe('test-specification');
    });

    it('should cache loaded templates', async () => {
      const mockContent = `# TOON Document

## Document Overview

- name: "test-cache"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      vi.mocked(fs.stat).mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);

      // First call
      await loader.loadTemplate('test-cache', 'toon');
      // Second call should use cache
      await loader.loadTemplate('test-cache', 'toon');

      // readFile should only be called once due to caching
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('should invalidate cache when file changes', async () => {
      const mockContent = `# TOON Document

## Document Overview

- name: "test-invalidation"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      vi.mocked(fs.stat)
        .mockResolvedValueOnce({
          size: mockContent.length,
          mtime: new Date('2026-01-01'),
        } as any)
        .mockResolvedValueOnce({
          size: mockContent.length,
          mtime: new Date('2026-01-02'), // Modified time
        } as any);

      // First load
      await loader.loadTemplate('test-invalidation', 'toon');
      // Second load with modified file
      await loader.loadTemplate('test-invalidation', 'toon');

      expect(fs.readFile).toHaveBeenCalledTimes(2);
    });

    it('should throw error for non-existent template', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'));

      await expect(
        loader.loadTemplate('non-existent', 'toon')
      ).rejects.toThrow();
    });

    it('should return template metadata', async () => {
      const mockContent = `# TOON Document

## Document Overview

- name: "test-metadata"
- description: "Test metadata extraction"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      vi.mocked(fs.stat).mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);

      const template = await loader.loadTemplate('test-metadata', 'toon');

      expect(template.metadata).toBeDefined();
      expect(template.metadata.size).toBeGreaterThan(0);
      expect(template.metadata.tokens).toBeGreaterThan(0);
      expect(template.metadata.format).toBe('toon');
    });
  });

  describe('listTemplates', () => {
    it('should list available templates', async () => {
      vi.mocked(fs.readdir).mockResolvedValue([
        'requirements.toon.md',
        'architecture.toon.md',
        'detailed-design.toon.md',
        'test-specification.toon.md',
      ]);

      const templates = await loader.listTemplates();

      expect(templates).toBeDefined();
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some(t => t.name === 'requirements')).toBe(true);
      expect(templates.some(t => t.name === 'architecture')).toBe(true);
    });

    it('should filter by format', async () => {
      vi.mocked(fs.readdir).mockResolvedValue([
        'requirements.toon.md',
        'requirements.md',
        'architecture.toon.md',
      ]);

      const templates = await loader.listTemplates('toon');

      expect(templates.every(t => t.format === 'toon')).toBe(true);
    });
  });

  describe('hasTemplate', () => {
    it('should return true for existing template', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);

      const exists = await loader.hasTemplate('requirements');

      expect(exists).toBe(true);
    });

    it('should return false for non-existent template', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('File not found'));

      const exists = await loader.hasTemplate('non-existent');

      expect(exists).toBe(false);
    });
  });

  describe('getTemplateMetadata', () => {
    it('should return template metadata', async () => {
      const mockContent = `# TOON Document

## Document Overview

- name: "requirements"
- description: "Requirements template"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      vi.mocked(fs.stat).mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);

      const metadata = await loader.getTemplateMetadata('requirements');

      expect(metadata).toBeDefined();
      expect(metadata.name).toBe('requirements');
      expect(metadata.size).toBeGreaterThan(0);
      expect(metadata.tokens).toBeGreaterThan(0);
    });
  });

  describe('clearCache', () => {
    it('should clear template cache', async () => {
      const mockContent = `# TOON Document

## Document Overview

- name: "test-clear"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

      vi.mocked(fs.readFile).mockResolvedValue(mockContent);
      vi.mocked(fs.stat).mockResolvedValue({
        size: mockContent.length,
        mtime: new Date(),
      } as any);

      // Load template
      await loader.loadTemplate('test-clear', 'toon');
      // Clear cache
      loader.clearCache();
      // Load again - should read from disk
      await loader.loadTemplate('test-clear', 'toon');

      expect(fs.readFile).toHaveBeenCalledTimes(2);
    });
  });
});

describe('loadTemplate', () => {
  it('should load template using default loader', async () => {
    const mockContent = `# TOON Document

## Document Overview

- name: "requirements"
- version: "1.0.0"
- status: "draft"
- created_at: "2026-01-01T00:00:00Z"
`;

    vi.mocked(fs.readFile).mockResolvedValue(mockContent);
    vi.mocked(fs.stat).mockResolvedValue({
      size: mockContent.length,
      mtime: new Date(),
    } as any);

    const template = await loadTemplate('requirements', 'toon');

    expect(template).toBeDefined();
  });
});

describe('listTemplates', () => {
  it('should list templates using default loader', async () => {
    vi.mocked(fs.readdir).mockResolvedValue([
      'requirements.toon.md',
      'architecture.toon.md',
    ]);

    const templates = await listTemplates();

    expect(templates).toBeDefined();
    expect(Array.isArray(templates)).toBe(true);
  });
});

describe('getLoader', () => {
  it('should return singleton loader instance', () => {
    const loader1 = getLoader();
    const loader2 = getLoader();

    expect(loader1).toBe(loader2);
  });
});
