/**
 * Template Loader
 *
 * Loads TOON templates from the file system with caching
 * @version 1.0.0
 */

import { promises as fs, statSync } from 'fs';
import * as path from 'path';
import { parseTOON } from '../toon';

/**
 * Loaded template interface
 */
export interface LoadedTemplate {
  name: string;
  format: 'toon' | 'markdown';
  content: string;
  document?: any;
  metadata: TemplateMetadata;
}

/**
 * Template info interface
 */
export interface TemplateInfo {
  name: string;
  formats: ('toon' | 'markdown')[];
  metadata: TemplateMetadata;
}

/**
 * Template metadata interface
 */
export interface TemplateMetadata {
  name: string;
  description?: string;
  version?: string;
  lastModified: string;
  size: number;
  tokens: number;
}

/**
 * Loader options interface
 */
export interface LoaderOptions {
  templatesDir?: string;         // Default: './templates'
  cacheEnabled?: boolean;        // Default: true
  cacheMaxAge?: number;          // Default: 30 minutes
}

/**
 * Cache entry interface
 */
interface CacheEntry {
  template: LoadedTemplate;
  timestamp: number;
  path: string;
  fileMtimeMs: number; // Store file modification time for cache invalidation
}

/**
 * Template Loader class
 * Loads TOON templates from the file system
 */
export class TemplateLoader {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TEMPLATES_DIR = './templates';
  private readonly DEFAULT_CACHE_MAX_AGE = 30 * 60 * 1000; // 30 minutes in ms

  private options: Required<LoaderOptions>;

  constructor(options?: LoaderOptions) {
    this.options = {
      templatesDir: options?.templatesDir || this.DEFAULT_TEMPLATES_DIR,
      cacheEnabled: options?.cacheEnabled !== false,
      cacheMaxAge: options?.cacheMaxAge || this.DEFAULT_CACHE_MAX_AGE
    };
  }

  /**
   * Load template by name
   * @param name - Template name (e.g., 'requirements')
   * @param preferredFormat - Preferred format ('toon' or 'markdown')
   * @returns Loaded and parsed template
   * @throws TemplateNotFoundError if template not found
   */
  async loadTemplate(name: string, preferredFormat?: 'toon' | 'markdown'): Promise<LoadedTemplate> {
    const cacheKey = `${name}:${preferredFormat || 'toon'}`;

    // Check cache first
    if (this.options.cacheEnabled) {
      const cached = this.getFromCache(cacheKey, name);
      if (cached) {
        return cached;
      }
    }

    // Search for template file
    const templatePath = await this.findTemplate(name, preferredFormat);

    if (!templatePath) {
      throw new Error(`Template not found: ${name}${preferredFormat ? ` (${preferredFormat} format)` : ''}`);
    }

    // Read file content
    const content = await fs.readFile(templatePath.path, 'utf-8');

    // Parse if TOON format
    let document;
    if (templatePath.format === 'toon') {
      try {
        const parseResult = parseTOON(content);
        document = parseResult.document;
      } catch (error) {
        throw new Error(`Failed to parse template ${name}: ${(error as Error).message}`);
      }
    }

    // Get file stats
    const stats = await fs.stat(templatePath.path);
    const metadata: TemplateMetadata = {
      name,
      description: this.extractDescription(content),
      version: this.extractVersion(content),
      lastModified: stats.mtime.toISOString(),
      size: stats.size,
      tokens: content.length
    };

    const template: LoadedTemplate = {
      name,
      format: templatePath.format,
      content,
      document,
      metadata
    };

    // Add to cache
    if (this.options.cacheEnabled) {
      this.addToCache(cacheKey, template, templatePath.path);
    }

    return template;
  }

  /**
   * List all available templates
   * @param format - Optional format filter ('toon' or 'markdown')
   * @returns List of template names and formats
   */
  async listTemplates(format?: 'toon' | 'markdown'): Promise<TemplateInfo[]> {
    const templatesDir = this.options.templatesDir;

    try {
      await fs.access(templatesDir);
    } catch {
      return [];
    }

    const entries = await fs.readdir(templatesDir, { withFileTypes: true });
    const templateMap = new Map<string, TemplateInfo>();

    for (const entry of entries) {
      if (!entry.isFile()) continue;

      const entryFormat = entry.name.endsWith('.toon.md') ? 'toon' : 'markdown';
      const basename = path.basename(entry.name, entry.name.endsWith('.toon.md') ? '.toon.md' : '.md');
      const name = basename.replace(/\.(toon\.)?md$/, '');

      // Skip if format filter is specified and doesn't match
      if (format && entryFormat !== format) continue;

      if (!templateMap.has(name)) {
        templateMap.set(name, {
          name,
          formats: [entryFormat],
          metadata: {
            name,
            lastModified: entry.mtime?.toISOString() || new Date().toISOString(),
            size: entry.size || 0,
            tokens: 0
          }
        });
      } else {
        const info = templateMap.get(name)!;
        if (!info.formats.includes(entryFormat)) {
          info.formats.push(entryFormat);
        }
      }
    }

    return Array.from(templateMap.values());
  }

  /**
   * Check if template exists
   * @param name - Template name
   * @returns True if template exists
   */
  async hasTemplate(name: string): Promise<boolean> {
    try {
      await fs.access(this.options.templatesDir);
      const entries = await fs.readdir(this.options.templatesDir);
      return entries.some(e => e === `${name}.toon.md` || e === `${name}.md`);
    } catch {
      return false;
    }
  }

  /**
   * Get template metadata without loading
   * @param name - Template name
   * @returns Template metadata
   */
  async getTemplateMetadata(name: string): Promise<TemplateMetadata> {
    const templatePath = await this.findTemplate(name);

    if (!templatePath) {
      throw new Error(`Template not found: ${name}`);
    }

    const stats = await fs.stat(templatePath.path);
    const content = await fs.readFile(templatePath.path, 'utf-8');

    return {
      name,
      description: this.extractDescription(content),
      version: this.extractVersion(content),
      lastModified: stats.mtime.toISOString(),
      size: stats.size,
      tokens: content.length
    };
  }

  /**
   * Clear the template cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Remove stale entries from cache
   */
  purgeStaleCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.options.cacheMaxAge) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Find template file by name and preferred format
   * @param name - Template name
   * @param preferredFormat - Preferred format
   * @returns Template path info or null
   */
  private async findTemplate(
    name: string,
    preferredFormat?: 'toon' | 'markdown'
  ): Promise<{ path: string; format: 'toon' | 'markdown' } | null> {
    const templatesDir = this.options.templatesDir;
    const toonPath = path.join(templatesDir, `${name}.toon.md`);
    const mdPath = path.join(templatesDir, `${name}.md`);

    // Check preferred format first
    if (preferredFormat === 'toon') {
      if (await this.fileExists(toonPath)) return { path: toonPath, format: 'toon' };
      if (await this.fileExists(mdPath)) return { path: mdPath, format: 'markdown' };
    } else if (preferredFormat === 'markdown') {
      if (await this.fileExists(mdPath)) return { path: mdPath, format: 'markdown' };
      if (await this.fileExists(toonPath)) return { path: toonPath, format: 'toon' };
    }

    // No preference - check both
    if (await this.fileExists(toonPath)) return { path: toonPath, format: 'toon' };
    if (await this.fileExists(mdPath)) return { path: mdPath, format: 'markdown' };

    return null;
  }

  /**
   * Check if file exists
   * @param filePath - Path to check
   * @returns True if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get template from cache
   * @param key - Cache key
   * @param name - Template name
   * @returns Cached template or null
   */
  private getFromCache(key: string, name: string): LoadedTemplate | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > this.options.cacheMaxAge) {
      this.cache.delete(key);
      return null;
    }

    // Verify file hasn't changed by comparing mtime
    try {
      const stats = statSync(entry.path);
      if (stats.mtimeMs > entry.fileMtimeMs) {
        // File has been modified since caching
        this.cache.delete(key);
        return null;
      }
    } catch {
      this.cache.delete(key);
      return null;
    }

    return entry.template;
  }

  /**
   * Add template to cache
   * @param key - Cache key
   * @param template - Template to cache
   * @param filePath - Template file path
   */
  private addToCache(key: string, template: LoadedTemplate, filePath: string): void {
    const stats = statSync(filePath);
    this.cache.set(key, {
      template,
      timestamp: Date.now(),
      path: filePath,
      fileMtimeMs: stats.mtimeMs
    });

    // Enforce cache size limit (approximately 100MB)
    this.enforceCacheLimit();
  }

  /**
   * Enforce cache size limit
   */
  private enforceCacheLimit(): void {
    const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
    let totalSize = 0;

    for (const [key, entry] of this.cache.entries()) {
      totalSize += entry.template.content.length;
    }

    if (totalSize > MAX_CACHE_SIZE) {
      // Remove oldest entries until under limit
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      totalSize = 0;
      for (const [key, entry] of entries) {
        if (totalSize + entry.template.content.length > MAX_CACHE_SIZE) {
          this.cache.delete(key);
        } else {
          totalSize += entry.template.content.length;
        }
      }
    }
  }

  /**
   * Extract description from template content
   * @param content - Template content
   * @returns Description or undefined
   */
  private extractDescription(content: string): string | undefined {
    const match = content.match(/description:\s*["']([^"']+)["']/i);
    return match ? match[1] : undefined;
  }

  /**
   * Extract version from template content
   * @param content - Template content
   * @returns Version or undefined
   */
  private extractVersion(content: string): string | undefined {
    const match = content.match(/version:\s*["']?(\d+\.\d+\.\d+)["']?/i);
    return match ? match[1] : undefined;
  }
}

/**
 * Default loader instance
 */
let defaultLoader: TemplateLoader | null = null;

/**
 * Get or create default loader instance
 * @returns TemplateLoader instance
 */
export function getLoader(): TemplateLoader {
  if (!defaultLoader) {
    defaultLoader = new TemplateLoader();
  }
  return defaultLoader;
}

/**
 * Load template using default loader
 * @param name - Template name
 * @param preferredFormat - Preferred format
 * @returns Loaded template
 */
export async function loadTemplate(
  name: string,
  preferredFormat?: 'toon' | 'markdown'
): Promise<LoadedTemplate> {
  return getLoader().loadTemplate(name, preferredFormat);
}

/**
 * List templates using default loader
 * @returns Array of template info
 */
export async function listTemplates(): Promise<TemplateInfo[]> {
  return getLoader().listTemplates();
}
