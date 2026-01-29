/**
 * OpenCode Agent Implementation
 *
 * OpenCode does not have a documented skills API as of January 2025.
 * This is a stub implementation that will be updated when OpenCode
 * documents their skills/plugins system.
 *
 * Current approach: Recommend using dev-kit CLI directly via Bash tool.
 */

import { BaseAgent } from '../base-agent.js';
import type { AgentType, InstallResult } from '../../types/index.js';

/**
 * OpenCode agent (stub)
 */
export class OpenCodeAgent extends BaseAgent {
  constructor() {
    super({
      name: 'opencode' as AgentType,
      displayName: 'OpenCode',
      skillPath: '', // No known skills path
      supported: false,
      unsupportedReason:
        'OpenCode does not have a documented skills API as of January 2025. ' +
        'Use dev-kit CLI directly via Bash tool instead.',
    });
  }

  /**
   * Detect OpenCode installation
   *
   * Returns false since OpenCode skills are not supported
   */
  override async detect(): Promise<boolean> {
    this.logger.debug(
      `${this.displayName} skills not supported: ${this.unsupportedReason}`
    );
    return false;
  }

  /**
   * Install skill for OpenCode
   *
   * Throws error since OpenCode skills are not supported
   */
  override install(): Promise<InstallResult> {
    throw new Error(
      'OpenCode skills are not supported. ' +
      'Use dev-kit CLI directly via Bash tool: dev-kit init'
    );
  }

  /**
   * Verify skill installation
   *
   * Returns false since OpenCode skills are not supported
   */
  override verify(_skillName: string): Promise<boolean> {
    this.logger.warn('OpenCode skills are not supported');
    return Promise.resolve(false);
  }

  /**
   * Uninstall skill
   *
   * No-op since OpenCode skills are not supported
   */
  override uninstall(): Promise<void> {
    this.logger.warn('OpenCode skills are not supported');
    return Promise.resolve();
  }

  /**
   * Get installed skills
   *
   * Returns empty array since OpenCode skills are not supported
   */
  override getInstalledSkills(): Promise<string[]> {
    this.logger.debug('OpenCode skills are not supported');
    return Promise.resolve([]);
  }
}
