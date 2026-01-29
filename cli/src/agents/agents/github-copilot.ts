/**
 * GitHub Copilot Agent Implementation
 *
 * GitHub Copilot uses Agent Skills similar to Claude Code.
 * Skills are installed to ~/.copilot-skills/
 */

import { BaseAgent } from '../base-agent.js';
import type { AgentType } from '../../types/index.js';
import * as path from 'path';
import * as os from 'os';

/**
 * GitHub Copilot agent
 */
export class GitHubCopilotAgent extends BaseAgent {
  constructor() {
    super({
      name: 'github-copilot' as AgentType,
      displayName: 'GitHub Copilot',
      skillPath: path.join(os.homedir(), '.copilot-skills'),
      supported: true,
    });
  }

  /**
   * Detect GitHub Copilot installation
   *
   * Checks for the ~/.copilot-skills directory
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
   * Check if path is accessible
   */
  private async access(filePath: string): Promise<void> {
    const { promises: fs } = await import('fs');
    await fs.access(filePath);
  }
}
