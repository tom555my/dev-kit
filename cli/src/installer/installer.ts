/**
 * Skill Installer
 *
 * Main installer that coordinates validation, file operations, and rollback.
 */

import type { Skill, InstallResult } from '../types/index.js';
import { Logger, getLogger } from '../core/logger.js';
import { PermissionDeniedError, SkillInstallationError } from '../core/errors.js';
import { SkillValidator, type ValidationOptions } from './validator.js';
import { FileOperations, type CopyOptions } from './file-ops.js';
import * as path from 'path';
import * as os from 'os';

/**
 * Installation options
 */
export interface InstallOptions {
  /** Overwrite existing skill */
  overwrite?: boolean;
  /** Skip validation */
  skipValidation?: boolean;
  /** Create backup before installing */
  backup?: boolean;
  /** Backup directory */
  backupDir?: string;
  /** Progress callback */
  onProgress?: (current: number, total: number, file: string) => void;
  /** Dry run (show what would be done) */
  dryRun?: boolean;
}

/**
 * Skill Installer class
 */
export class SkillInstaller {
  private logger: Logger;
  private validator: SkillValidator;
  private fileOps: FileOperations;

  constructor() {
    this.logger = getLogger().child('installer');
    this.validator = new SkillValidator();
    this.fileOps = new FileOperations();
  }

  /**
   * Install a skill
   *
   * @param skill - Skill to install
   * @param targetDir - Target installation directory
   * @param options - Installation options
   * @returns Installation result
   */
  async install(
    skill: Skill,
    targetDir: string,
    options: InstallOptions = {}
  ): Promise<InstallResult> {
    const startTime = Date.now();
    const targetPath = path.join(targetDir, skill.name);
    let backupPath: string | null = null;

    this.logger.info(`Installing skill "${skill.name}" to ${targetPath}`);

    try {
      // Step 1: Validate skill
      if (!options.skipValidation) {
        this.logger.debug('Validating skill...');

        const validationOptions: ValidationOptions = {
          checkConflicts: !options.overwrite,
          targetDir: targetDir,
        };

        const validationResult = await this.validator.validate(skill, validationOptions);

        if (!validationResult.isValid()) {
          this.logger.error(`Skill validation failed with ${validationResult.errors.length} errors`);

          return {
            success: false,
            installedSkills: [],
            skippedSkills: [],
            errors: validationResult.errors.map(e => ({
              skill: skill.name,
              error: `${e.field}: ${e.issue}`,
            })),
            duration: Date.now() - startTime,
            rollback: async () => {
              // Nothing to rollback
            },
          };
        }

        // Check for warnings
        if (validationResult.warnings.length > 0) {
          this.logger.warn(`Skill validation has ${validationResult.warnings.length} warnings`);
          for (const warning of validationResult.warnings) {
            this.logger.warn(`  - ${warning.field}: ${warning.issue}`);
          }
        }

        // Check if skill already exists
        if (validationResult.warnings.some(w => w.field === 'naming')) {
          if (!options.overwrite) {
            this.logger.info(`Skill "${skill.name}" already exists, skipping`);
            return {
              success: true,
              installedSkills: [],
              skippedSkills: [skill.name],
              errors: [],
              duration: Date.now() - startTime,
              rollback: async () => {
                // Nothing to rollback
              },
            };
          }

          this.logger.info(`Skill "${skill.name}" exists, will overwrite (backup enabled)`);
        }
      }

      // Step 2: Create backup if requested or if overwriting
      const targetExists = await this.fileOps.pathExists(targetPath);

      if (targetExists && (options.backup || options.overwrite)) {
        backupPath = await this.createBackup(targetPath, options.backupDir);
        this.logger.info(`Created backup: ${backupPath}`);
      }

      // Step 3: Copy skill files or write embedded content
      if (options.dryRun) {
        this.logger.info('[DRY RUN] Would install to:', targetPath);
      } else {
        this.logger.debug('Installing skill...');

        const copyOptions: CopyOptions = {
          overwrite: options.overwrite ?? false,
          onProgress: options.onProgress,
        };

        // Check if skill has embedded content
        if (skill.content) {
          // Write embedded content directly
          await this.fileOps.writeSkillContent(targetPath, skill.content, copyOptions);
          this.logger.debug(`Wrote embedded content for skill "${skill.name}"`);
        } else if (skill.sourcePath) {
          // Copy from source path (traditional file system approach)
          await this.fileOps.copyDirectory(skill.sourcePath, targetPath, copyOptions);
          this.logger.debug(`Copied files from ${skill.sourcePath}`);
        } else {
          throw new Error(`Skill "${skill.name}" has neither content nor sourcePath`);
        }

        this.logger.success(`Installed skill "${skill.name}"`);
      }

      // Step 4: Verify installation
      if (!options.dryRun) {
        this.logger.debug('Verifying installation...');

        const verificationResult = await this.validator.validateSkillAtPath(targetPath);

        if (!verificationResult.isValid()) {
          throw new Error('Installation verification failed');
        }
      }

      return {
        success: true,
        installedSkills: [skill.name],
        skippedSkills: [],
        errors: [],
        duration: Date.now() - startTime,
        rollback: async () => {
          if (backupPath) {
            await this.rollback(backupPath, targetPath);
          } else if (!options.dryRun) {
            // No backup, just remove what we installed
            await this.fileOps.removeDirectory(targetPath);
          }
        },
      };

    } catch (error) {
      this.logger.error(`Installation failed: ${error}`);

      // Rollback on error
      if (backupPath) {
        this.logger.info('Rolling back installation...');
        await this.rollback(backupPath, targetPath);
      }

      return {
        success: false,
        installedSkills: [],
        skippedSkills: [],
        errors: [{
          skill: skill.name,
          error: error instanceof Error ? error.message : String(error),
        }],
        duration: Date.now() - startTime,
        rollback: async () => {
          // Already rolled back
        },
      };
    }
  }

  /**
   * Install multiple skills
   *
   * @param skills - Skills to install
   * @param targetDir - Target installation directory
   * @param options - Installation options
   * @returns Installation result
   */
  async installMultiple(
    skills: Skill[],
    targetDir: string,
    options: InstallOptions = {}
  ): Promise<InstallResult> {
    this.logger.info(`Installing ${skills.length} skills to ${targetDir}`);

    const startTime = Date.now();
    const installedSkills: string[] = [];
    const skippedSkills: string[] = [];
    const errors: Array<{ skill: string; error: string }> = [];
    const rollbackOperations: Array<() => Promise<void>> = [];

    for (const skill of skills) {
      this.logger.info(`Installing skill: ${skill.name}`);

      const result = await this.install(skill, targetDir, {
        ...options,
        backup: false, // Don't backup for each skill in batch
      });

      if (result.success) {
        installedSkills.push(...result.installedSkills);
        skippedSkills.push(...result.skippedSkills);

        // Collect rollback operation
        if (result.rollback) {
          rollbackOperations.push(result.rollback);
        }
      } else {
        errors.push(...result.errors);

        // Rollback all installed skills on failure
        this.logger.error('Installation failed, rolling back all skills...');

        // Execute rollbacks in reverse order
        for (const rollback of [...rollbackOperations].reverse()) {
          try {
            await rollback();
          } catch (error) {
            this.logger.warn(`Rollback failed: ${error}`);
          }
        }

        break;
      }
    }

    const success = errors.length === 0;

    return {
      success,
      installedSkills,
      skippedSkills,
      errors,
      duration: Date.now() - startTime,
      rollback: async () => {
        // Execute all rollbacks in reverse order
        for (const rollback of [...rollbackOperations].reverse()) {
          try {
            await rollback();
          } catch (error) {
            this.logger.warn(`Rollback failed: ${error}`);
          }
        }
      },
    };
  }

  /**
   * Create backup of target directory
   *
   * @param targetPath - Path to backup
   * @param backupDir - Backup directory (defaults to temp)
   * @returns Backup path
   */
  private async createBackup(targetPath: string, backupDir?: string): Promise<string> {
    const backupDirectory = backupDir ?? path.join(os.tmpdir(), 'dev-kit-backups');
    return this.fileOps.backupDirectory(targetPath, backupDirectory);
  }

  /**
   * Rollback installation using backup
   *
   * @param backupPath - Backup path
   * @param targetPath - Target path
   */
  private async rollback(backupPath: string, targetPath: string): Promise<void> {
    try {
      await this.fileOps.restoreBackup(backupPath, targetPath);

      // Remove backup after successful restore
      await this.fileOps.removeDirectory(path.dirname(backupPath));

      this.logger.info('Rollback complete');
    } catch (error) {
      this.logger.error(`Rollback failed: ${error}`);
      throw new SkillInstallationError(
        path.basename(targetPath),
        'rollback',
        error as Error
      );
    }
  }
}

/**
 * Install skill utility function
 */
export async function installSkill(
  skill: Skill,
  targetDir: string,
  options?: InstallOptions
): Promise<InstallResult> {
  const installer = new SkillInstaller();
  return installer.install(skill, targetDir, options);
}
