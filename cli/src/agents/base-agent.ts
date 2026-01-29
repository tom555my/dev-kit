/**
 * Base Agent Implementation
 *
 * Provides common functionality for all agent implementations.
 */

import type {
  Agent,
  AgentType,
  Skill,
  InstallResult,
} from '../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { Logger, getLogger } from '../core/logger.js';
import {
  AgentNotInstalledError,
  PermissionDeniedError,
  SkillInstallationError,
} from '../core/errors.js';
import { SkillInstaller, type InstallOptions } from '../installer/installer.js';

/**
 * Abstract base class for agent implementations
 *
 * Provides common functionality while leaving specific implementation
 * details to subclasses.
 */
export abstract class BaseAgent implements Agent {
  readonly name: AgentType;
  readonly displayName: string;
  readonly skillPath: string;
  readonly supported: boolean;
  readonly unsupportedReason?: string;

  protected logger: Logger;

  constructor(config: {
    name: AgentType;
    displayName: string;
    skillPath: string;
    supported: boolean;
    unsupportedReason?: string;
  }) {
    this.name = config.name;
    this.displayName = config.displayName;
    this.skillPath = config.skillPath;
    this.supported = config.supported;
    this.unsupportedReason = config.unsupportedReason;
    this.logger = getLogger().child(`agent:${config.name}`);
  }

  /**
   * Detect if this agent is installed on the system
   *
   * Default implementation checks if the skill directory exists.
   * Subclasses can override for more sophisticated detection.
   */
  async detect(): Promise<boolean> {
    if (!this.supported) {
      this.logger.debug(`Agent ${this.name} is not supported: ${this.unsupportedReason}`);
      return false;
    }

    try {
      const stats = await fs.stat(this.skillPath);
      return stats.isDirectory();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get the path to the agent's skill directory
   */
  getSkillPath(): string {
    return this.skillPath;
  }

  /**
   * Install a skill for this agent
   *
   * Uses the SkillInstaller module for validation, copying, and rollback.
   * Subclasses can override for agent-specific installation logic.
   */
  async install(skill: Skill, options?: InstallOptions): Promise<InstallResult> {
    this.logger.info(`Installing skill "${skill.name}" for ${this.displayName}`);

    // Check if agent is detected
    const detected = await this.detect();
    if (!detected) {
      throw new AgentNotInstalledError(this.displayName, this.skillPath);
    }

    // Use the installer module
    const installer = new SkillInstaller();

    // Set up progress tracking
    if (options?.onProgress) {
      options.onProgress = (current, total, file) => {
        this.logger.debug(`[${current}/${total}] ${file}`);
      };
    }

    return installer.install(skill, this.skillPath, {
      ...options,
      backup: true, // Always backup for safety
    });
  }

  /**
   * Verify that a skill is correctly installed
   *
   * Default implementation checks for SKILL.md file with valid frontmatter.
   * Subclasses can override for agent-specific verification.
   */
  async verify(skillName: string): Promise<boolean> {
    const skillFile = path.join(this.skillPath, skillName, 'SKILL.md');

    try {
      const content = await fs.readFile(skillFile, 'utf-8');

      // Check for YAML frontmatter
      if (!content.includes('---')) {
        this.logger.debug(`Skill "${skillName}" missing YAML frontmatter`);
        return false;
      }

      // Check for name field in frontmatter
      if (!content.includes('name:')) {
        this.logger.debug(`Skill "${skillName}" missing name in frontmatter`);
        return false;
      }

      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        this.logger.debug(`Skill "${skillName}" not found at ${skillFile}`);
        return false;
      }
      throw error;
    }
  }

  /**
   * Uninstall a skill
   *
   * Default implementation removes the skill directory.
   * Subclasses can override for agent-specific uninstall logic.
   */
  async uninstall(skillName: string): Promise<void> {
    const targetPath = path.join(this.skillPath, skillName);

    this.logger.info(`Uninstalling skill "${skillName}" from ${this.displayName}`);

    try {
      await fs.rm(targetPath, { recursive: true, force: true });
      this.logger.success(`Uninstalled skill "${skillName}"`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        throw new PermissionDeniedError(targetPath, 'remove');
      }
      throw new SkillInstallationError(skillName, this.displayName, error as Error);
    }
  }

  /**
   * Get list of installed skills
   *
   * Default implementation lists subdirectories in skill path.
   * Subclasses can override for agent-specific logic.
   */
  async getInstalledSkills(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.skillPath, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        throw new PermissionDeniedError(this.skillPath, 'read');
      }
      throw error;
    }
  }

  /**
   * Install skill files to target directory
   *
   * This method should be overridden by subclasses for agent-specific
   * file operations (e.g., Cursor .vsix packaging).
   */
  protected async installSkillFiles(_skill: Skill, targetPath: string): Promise<void> {
    // Create target directory
    await fs.mkdir(targetPath, { recursive: true });

    // Copy skill files from source to target
    // This is a placeholder - actual implementation will read from embedded resources
    this.logger.debug(`Installing skill files to ${targetPath}`);

    // TODO: Implement file copying from embedded resources
    // This will be implemented in DKIT-009 (Static Resource Embedding)
  }

  /**
   * Create backup of current installation state
   */
  protected async createBackup(): Promise<string> {
    const backupDir = path.join(os.tmpdir(), `dev-kit-backup-${Date.now()}`);
    await fs.mkdir(backupDir, { recursive: true });
    this.logger.debug(`Created backup at ${backupDir}`);
    return backupDir;
  }

  /**
   * Rollback installation using backup
   */
  protected async rollback(backupPath: string, targetPath: string): Promise<void> {
    this.logger.debug(`Rolling back installation from ${backupPath}`);

    try {
      // Remove target directory
      await fs.rm(targetPath, { recursive: true, force: true });

      // Restore from backup if exists
      const hasBackup = await this.pathExists(backupPath);
      if (hasBackup) {
        await fs.cp(backupPath, targetPath, { recursive: true });
      }

      // Clean up backup
      await fs.rm(backupPath, { recursive: true, force: true });

      this.logger.debug('Rollback complete');
    } catch (error) {
      this.logger.warn(`Rollback incomplete: ${error}`);
    }
  }

  /**
   * Check if a path exists
   */
  protected async pathExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
