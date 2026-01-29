/**
 * Rollback Manager
 *
 * Manages installation rollback with state tracking and cleanup.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { Logger, getLogger } from '../core/logger.js';
import { FileOperations } from './file-ops.js';

/**
 * Rollback state information
 */
export interface RollbackState {
  /** Rollback ID */
  id: string;
  /** Timestamp */
  timestamp: number;
  /** Original path */
  originalPath: string;
  /** Backup path */
  backupPath: string;
  /** Rollback completed */
  completed: boolean;
}

/**
 * Rollback Manager class
 */
export class RollbackManager {
  private logger: Logger;
  private fileOps: FileOperations;
  private rollbacks: Map<string, RollbackState> = new Map();

  constructor() {
    this.logger = getLogger().child('rollback');
    this.fileOps = new FileOperations();
  }

  /**
   * Create a rollback point
   *
   * @param targetPath - Path to backup
   * @returns Rollback state
   */
  async createRollbackPoint(targetPath: string): Promise<RollbackState> {
    const rollbackId = `rollback-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const backupDir = path.join(os.tmpdir(), 'dev-kit-rollbacks');
    const backupPath = path.join(backupDir, rollbackId);

    this.logger.debug(`Creating rollback point: ${rollbackId}`);

    // Check if target exists
    const targetExists = await this.fileOps.pathExists(targetPath);

    if (targetExists) {
      // Create backup
      await this.fileOps.backupDirectory(targetPath, backupDir);
    } else {
      // Create empty backup directory to track that target didn't exist
      await fs.mkdir(backupPath, { recursive: true });
    }

    const state: RollbackState = {
      id: rollbackId,
      timestamp: Date.now(),
      originalPath: targetPath,
      backupPath,
      completed: false,
    };

    this.rollbacks.set(rollbackId, state);

    this.logger.info(`Created rollback point: ${rollbackId}`);

    return state;
  }

  /**
   * Execute rollback
   *
   * @param rollbackId - Rollback ID
   * @param cleanup - Clean up backup after rollback
   */
  async rollback(rollbackId: string, cleanup = true): Promise<void> {
    this.logger.info(`Executing rollback: ${rollbackId}`);

    const state = this.rollbacks.get(rollbackId);

    if (!state) {
      throw new Error(`Rollback not found: ${rollbackId}`);
    }

    if (state.completed) {
      this.logger.warn(`Rollback already completed: ${rollbackId}`);
      return;
    }

    try {
      // Check if backup exists
      const backupExists = await this.fileOps.pathExists(state.backupPath);

      if (backupExists) {
        // Check if backup has content
        const backupEntries = await fs.readdir(state.backupPath);

        if (backupEntries.length > 0) {
          // Restore backup
          await this.fileOps.restoreBackup(state.backupPath, state.originalPath);
        } else {
          // Backup is empty, remove original path
          await this.fileOps.removeDirectory(state.originalPath);
        }
      } else {
        this.logger.warn(`Backup not found: ${state.backupPath}`);
      }

      state.completed = true;

      // Clean up backup
      if (cleanup) {
        await this.cleanup(rollbackId);
      }

      this.logger.info(`Rollback completed: ${rollbackId}`);
    } catch (error) {
      this.logger.error(`Rollback failed: ${error}`);
      throw error;
    }
  }

  /**
   * Clean up rollback state and backup
   *
   * @param rollbackId - Rollback ID
   */
  async cleanup(rollbackId: string): Promise<void> {
    const state = this.rollbacks.get(rollbackId);

    if (!state) {
      this.logger.warn(`Rollback not found: ${rollbackId}`);
      return;
    }

    this.logger.debug(`Cleaning up rollback: ${rollbackId}`);

    try {
      // Remove backup directory
      await this.fileOps.removeDirectory(state.backupPath);

      // Remove from state
      this.rollbacks.delete(rollbackId);

      this.logger.debug(`Cleaned up rollback: ${rollbackId}`);
    } catch (error) {
      this.logger.warn(`Cleanup failed: ${error}`);
    }
  }

  /**
   * Clean up all rollbacks
   */
  async cleanupAll(): Promise<void> {
    this.logger.info('Cleaning up all rollbacks...');

    const rollbackIds = Array.from(this.rollbacks.keys());

    for (const id of rollbackIds) {
      try {
        await this.cleanup(id);
      } catch (error) {
        this.logger.warn(`Failed to cleanup rollback ${id}: ${error}`);
      }
    }

    this.logger.info(`Cleaned up ${rollbackIds.length} rollbacks`);
  }

  /**
   * Get rollback state
   *
   * @param rollbackId - Rollback ID
   * @returns Rollback state or undefined
   */
  getState(rollbackId: string): RollbackState | undefined {
    return this.rollbacks.get(rollbackId);
  }

  /**
   * Get all rollback states
   *
   * @returns Array of rollback states
   */
  getAllStates(): RollbackState[] {
    return Array.from(this.rollbacks.values());
  }

  /**
   * Mark rollback as complete (without executing)
   *
   * @param rollbackId - Rollback ID
   */
  markComplete(rollbackId: string): void {
    const state = this.rollbacks.get(rollbackId);

    if (state) {
      state.completed = true;
      this.logger.debug(`Marked rollback as complete: ${rollbackId}`);
    }
  }
}

/**
 * Create rollback point utility function
 */
export async function createRollbackPoint(targetPath: string): Promise<string> {
  const manager = new RollbackManager();
  const state = await manager.createRollbackPoint(targetPath);
  return state.id;
}

/**
 * Execute rollback utility function
 */
export async function executeRollback(rollbackId: string, cleanup = true): Promise<void> {
  const manager = new RollbackManager();
  return manager.rollback(rollbackId, cleanup);
}
