/**
 * Cursor Agent Implementation
 *
 * Cursor is built on VS Code and supports VS Code extensions.
 * Skills are packaged as .vsix files and installed via Cursor extension system.
 *
 * Note: This is a medium-complexity integration requiring .vsix packaging.
 * Currently marked as supported but requires additional build steps.
 */

import { BaseAgent } from '../base-agent.js';
import type { AgentType } from '../../types/index.js';
import * as path from 'path';
import * as os from 'os';

/**
 * Cursor agent
 */
export class CursorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'cursor' as AgentType,
      displayName: 'Cursor',
      skillPath: path.join(os.homedir(), '.cursor', 'extensions'),
      supported: true,
      unsupportedReason: 'Requires .vsix packaging - complex integration',
    });
  }

  /**
   * Detect Cursor installation
   *
   * Checks for the ~/.cursor/extensions directory
   */
  override async detect(): Promise<boolean> {
    this.logger.debug(`Detecting ${this.displayName} at ${this.skillPath}`);

    try {
      await this.access(this.skillPath);
      this.logger.debug(`${this.displayName} detected`);
      return true;
    } catch {
      this.logger.debug(`${this.displayName} not detected`);
      return false;
    }
  }

  /**
   * Install skill for Cursor
   *
   * Cursor requires .vsix packaging. This is a placeholder that
   * will be fully implemented when the build pipeline is ready.
   */
  override async installSkillFiles(skill: any, targetPath: string): Promise<void> {
    this.logger.warn(
      'Cursor installation requires .vsix packaging. ' +
      'This will be implemented in the build pipeline phase.'
    );

    // Placeholder: Will need to:
    // 1. Build .vsix package
    // 2. Install via: cursor --install-extension path/to/skill.vsix
    // 3. Or copy to extensions directory if already packaged

    await super.installSkillFiles(skill, targetPath);
  }

  /**
   * Check if path is accessible
   */
  private async access(filePath: string): Promise<void> {
    const { promises: fs } = await import('fs');
    await fs.access(filePath);
  }
}
