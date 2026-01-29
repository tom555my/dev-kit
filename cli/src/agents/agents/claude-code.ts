/**
 * Claude Code Agent Implementation
 *
 * Claude Code uses the Agent Skills open standard with SKILL.md files.
 * Skills are installed to ~/.claude/skills/
 */

import { BaseAgent } from '../base-agent.js';
import type { AgentType } from '../../types/index.js';
import * as path from 'path';
import * as os from 'os';

/**
 * Claude Code agent
 */
export class ClaudeCodeAgent extends BaseAgent {
  constructor() {
    super({
      name: 'claude-code' as AgentType,
      displayName: 'Claude Code',
      skillPath: path.join(os.homedir(), '.claude', 'skills'),
      supported: true,
    });
  }

  /**
   * Detect Claude Code installation
   *
   * Checks for the ~/.claude/skills directory
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
