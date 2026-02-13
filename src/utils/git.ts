/**
 * Git Utilities
 *
 * Helper utilities for git operations
 * @version 1.0.0
 */

import { promises as fs } from 'fs';
import { exec } from 'child_process';

/**
 * Get git user name from git config
 * @returns Git user name or 'Unknown'
 */
export async function gitUserName(): Promise<string> {
  try {
    const { stdout } = await exec('git config user.name');
    const name = stdout.trim();
    return name || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

/**
 * Get current git branch name
 * @returns Branch name or 'unknown'
 */
export async function gitBranchName(): Promise<string> {
  try {
    const { stdout } = await exec('git branch --show-current');
    return stdout.trim() || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Check if current directory is a git repository
 * @returns True if in git repository
 */
export async function isGitRepository(): Promise<boolean> {
  try {
    await fs.access('.git');
    return true;
  } catch {
    return false;
  }
}

/**
 * Get git remote URL
 * @returns Remote URL or null
 */
export async function gitRemoteUrl(): Promise<string | null> {
  try {
    const { stdout } = await exec('git config --get remote.origin.url');
    return stdout.trim() || null;
  } catch {
    return null;
  }
}
