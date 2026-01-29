/**
 * File Operations
 *
 * Core file system operations for skill installation.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger, getLogger } from '../core/logger.js';
import { PermissionDeniedError, FileNotFoundError } from '../core/errors.js';

/**
 * File permissions for skill files
 * - User can read/write
 * - Group can read
 * - Others can read
 */
const DEFAULT_FILE_MODE = 0o644; // rw-r--r--

/**
 * Directory permissions
 * - User can read/write/execute
 * - Group can read/execute
 * - Others can read/execute
 */
const DEFAULT_DIR_MODE = 0o755; // rwxr-xr-x

/**
 * Progress callback type
 */
export type ProgressCallback = (current: number, total: number, file: string) => void;

/**
 * Copy options
 */
export interface CopyOptions {
  /** Overwrite existing files */
  overwrite?: boolean;
  /** Preserve file permissions */
  preservePermissions?: boolean;
  /** Progress callback */
  onProgress?: ProgressCallback;
  /** Files to exclude (globs) */
  exclude?: string[];
}

/**
 * File Operations class
 */
export class FileOperations {
  private logger: Logger;

  constructor() {
    this.logger = getLogger().child('file-ops');
  }

  /**
   * Recursively copy a directory
   *
   * @param source - Source directory
   * @param target - Target directory
   * @param options - Copy options
   * @returns Number of files copied
   */
  async copyDirectory(
    source: string,
    target: string,
    options: CopyOptions = {}
  ): Promise<number> {
    this.logger.debug(`Copying directory: ${source} -> ${target}`);

    // Check source exists
    const sourceExists = await this.pathExists(source);
    if (!sourceExists) {
      throw new FileNotFoundError(source);
    }

    // Create target directory
    await fs.mkdir(target, { recursive: true, mode: DEFAULT_DIR_MODE });
    this.logger.debug(`Created directory: ${target}`);

    // Read source directory
    const entries = await fs.readdir(source, { withFileTypes: true });

    let fileCount = 0;
    const totalFiles = await this.countFiles(source);

    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const tgtPath = path.join(target, entry.name);

      // Check if excluded
      if (this.isExcluded(entry.name, options.exclude)) {
        this.logger.debug(`Skipping excluded file: ${entry.name}`);
        continue;
      }

      if (entry.isDirectory()) {
        // Recursively copy subdirectory
        const subCount = await this.copyDirectory(srcPath, tgtPath, options);
        fileCount += subCount;
      } else if (entry.isFile()) {
        // Copy file
        await this.copyFile(srcPath, tgtPath, options);
        fileCount++;

        // Report progress
        if (options.onProgress) {
          options.onProgress(fileCount, totalFiles, entry.name);
        }
      } else {
        // Skip symbolic links and special files
        this.logger.warn(`Skipping special file: ${entry.name}`);
      }
    }

    this.logger.debug(`Copied ${fileCount} files from ${source} to ${target}`);

    return fileCount;
  }

  /**
   * Copy a single file
   *
   * @param source - Source file path
   * @param target - Target file path
   * @param options - Copy options
   */
  async copyFile(source: string, target: string, options: CopyOptions = {}): Promise<void> {
    this.logger.debug(`Copying file: ${source} -> ${target}`);

    // Check if target exists and overwrite is disabled
    const targetExists = await this.pathExists(target);
    if (targetExists && !options.overwrite) {
      this.logger.debug(`File exists, skipping: ${target}`);
      return;
    }

    try {
      // If target exists and overwrite is enabled, remove it first
      if (targetExists && options.overwrite) {
        await fs.rm(target);
      }

      // Copy file
      await fs.copyFile(source, target, fs.constants.COPYFILE_EXCL);

      // Set permissions
      if (!options.preservePermissions) {
        await fs.chmod(target, DEFAULT_FILE_MODE);
      }

      this.logger.debug(`Copied file: ${path.basename(source)}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        throw new PermissionDeniedError(target, 'write');
      }
      throw error;
    }
  }

  /**
   * Write embedded skill content to a SKILL.md file
   *
   * @param targetPath - Target directory path
   * @param content - Skill content to write
   * @param options - Copy options
   */
  async writeSkillContent(
    targetPath: string,
    content: string,
    options: CopyOptions = {}
  ): Promise<void> {
    this.logger.debug(`Writing skill content to: ${targetPath}`);

    // Create target directory
    await fs.mkdir(targetPath, { recursive: true, mode: DEFAULT_DIR_MODE });
    this.logger.debug(`Created directory: ${targetPath}`);

    // Write SKILL.md file
    const skillFilePath = path.join(targetPath, 'SKILL.md');

    // Check if target exists and overwrite is disabled
    const targetExists = await this.pathExists(skillFilePath);
    if (targetExists && !options.overwrite) {
      this.logger.debug(`SKILL.md exists, skipping: ${skillFilePath}`);
      return;
    }

    try {
      await fs.writeFile(skillFilePath, content, { mode: DEFAULT_FILE_MODE });
      this.logger.debug(`Wrote SKILL.md to: ${targetPath}`);

      // Report progress
      if (options.onProgress) {
        options.onProgress(1, 1, 'SKILL.md');
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        throw new PermissionDeniedError(skillFilePath, 'write');
      }
      throw error;
    }
  }

  /**
   * Count files in a directory recursively
   *
   * @param dirPath - Directory path
   * @returns Number of files
   */
  async countFiles(dirPath: string): Promise<number> {
    let count = 0;

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          count += await this.countFiles(fullPath);
        } else if (entry.isFile()) {
          count++;
        }
      }
    } catch (error) {
      // Directory might not exist yet
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    return count;
  }

  /**
   * Remove a directory recursively
   *
   * @param targetPath - Path to remove
   */
  async removeDirectory(targetPath: string): Promise<void> {
    this.logger.debug(`Removing directory: ${targetPath}`);

    try {
      await fs.rm(targetPath, { recursive: true, force: true });
      this.logger.debug(`Removed directory: ${targetPath}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        throw new PermissionDeniedError(targetPath, 'remove');
      }
      throw error;
    }
  }

  /**
   * Create a backup of a directory
   *
   * @param sourcePath - Source directory
   * @param backupDir - Backup directory
   * @returns Path to backup
   */
  async backupDirectory(sourcePath: string, backupDir: string): Promise<string> {
    const backupName = `${path.basename(sourcePath)}-${Date.now()}`;
    const backupPath = path.join(backupDir, backupName);

    this.logger.debug(`Creating backup: ${sourcePath} -> ${backupPath}`);

    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true, mode: DEFAULT_DIR_MODE });

    // Copy to backup
    await this.copyDirectory(sourcePath, backupPath, {
      overwrite: true,
      preservePermissions: true,
    });

    this.logger.info(`Created backup: ${backupPath}`);

    return backupPath;
  }

  /**
   * Restore a backup
   *
   * @param backupPath - Backup directory path
   * @param targetPath - Target to restore to
   */
  async restoreBackup(backupPath: string, targetPath: string): Promise<void> {
    this.logger.info(`Restoring backup: ${backupPath} -> ${targetPath}`);

    // Remove existing target
    await this.removeDirectory(targetPath);

    // Copy backup to target
    await this.copyDirectory(backupPath, targetPath, {
      overwrite: true,
      preservePermissions: true,
    });

    this.logger.info(`Restored backup to: ${targetPath}`);
  }

  /**
   * Check if a path exists
   *
   * @param filePath - File path
   * @returns true if path exists
   */
  async pathExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a path should be excluded
   *
   * @param fileName - File name
   * @param excludePatterns - Exclude patterns
   * @returns true if should exclude
   */
  private isExcluded(fileName: string, excludePatterns?: string[]): boolean {
    if (!excludePatterns || excludePatterns.length === 0) {
      return false;
    }

    // Simple glob matching (for production, use a proper glob library)
    for (const pattern of excludePatterns) {
      if (fileName === pattern) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Copy directory utility function
 */
export async function copyDirectory(
  source: string,
  target: string,
  options?: CopyOptions
): Promise<number> {
  const ops = new FileOperations();
  return ops.copyDirectory(source, target, options);
}

/**
 * Remove directory utility function
 */
export async function removeDirectory(targetPath: string): Promise<void> {
  const ops = new FileOperations();
  return ops.removeDirectory(targetPath);
}

/**
 * Check if path exists utility function
 */
export async function pathExists(filePath: string): Promise<boolean> {
  const ops = new FileOperations();
  return ops.pathExists(filePath);
}
