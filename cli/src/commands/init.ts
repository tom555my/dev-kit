/**
 * Init Command
 *
 * Initializes dev-kit by installing skills for a specified agent.
 */

import type { CommandHandler } from '../types/index.js';
import { getLogger, Logger, LogLevel } from '../core/logger.js';
import {
  AgentNotInstalledError,
  InvalidAgentError,
  CLIError,
} from '../core/errors.js';
import { createAgentRegistry } from '../agents/agent-registry.js';
import { getDevKitSkills } from '../data/skills.js';
import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * Init command options
 */
export interface InitOptions {
  /** Force overwrite existing skills */
  force?: boolean;
  /** Verify installation after copying */
  verify?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Non-interactive mode */
  yes?: boolean;
}

/**
 * Init Command Handler
 */
export class InitCommand implements CommandHandler {
  private logger: Logger;

  constructor() {
    this.logger = getLogger().child('init');
  }

  /**
   * Execute the init command
   *
   * @param args - Command arguments
   */
  async execute(args: string[]): Promise<void> {
    const startTime = Date.now();

    this.logger.info('Initializing dev-kit...');

    // Parse options
    const options = this.parseOptions(args);

    // Set verbose logging if requested
    if (options.verbose) {
      getLogger().setLevel(LogLevel.DEBUG);
    }

    // Get agent name
    let agentName = args[0];

    // If no agent specified, enter interactive mode
    if (!agentName) {
      agentName = await this.selectAgentInteractively(options);
    }

    // Validate agent name
    const validAgents = ['claude-code', 'github-copilot', 'cursor', 'opencode'];
    if (!validAgents.includes(agentName)) {
      throw new InvalidAgentError(agentName, validAgents);
    }

    this.logger.info(`Initializing dev-kit for ${agentName}...`);

    // Create agent registry and get agent
    const registry = await createAgentRegistry();
    const agent = registry.getOrThrow(agentName as any);

    // Check if agent is supported
    if (!agent.supported) {
      this.logger.error(`${agent.displayName} is not supported: ${agent.unsupportedReason || 'Unsupported agent'}`);
      this.logger.info('Supported agents: claude-code, github-copilot');
      throw new CLIError(
        `Cannot initialize dev-kit for ${agent.displayName}`,
        'SYSTEM_ERROR',
        agent.unsupportedReason
      );
    }

    // Detect if agent is installed
    const detected = await agent.detect();
    if (!detected) {
      throw new AgentNotInstalledError(agent.displayName, agent.skillPath);
    }

    this.logger.success(`${agent.displayName} detected at ${agent.skillPath}`);

    // Create .dev-kit directory structure in current project
    await this.createDevKitDirectory();

    // Get skills to install
    const skillsPath = path.resolve(process.cwd(), '../../.claude/skills');
    const skills = getDevKitSkills(skillsPath);

    this.logger.info(`Found ${skills.length} dev-kit skills to install`);

    // Check for existing skills
    const installedSkills = await agent.getInstalledSkills();
    const conflictingSkills = skills.filter((s) =>
      installedSkills.includes(s.name)
    );

    if (conflictingSkills.length > 0 && !options.force) {
      this.logger.warn(
        `The following skills are already installed: ${conflictingSkills.map((s) => s.name).join(', ')}`
      );
      this.logger.info('Use --force to overwrite existing skills');

      // Ask user what to do
      if (!options.yes) {
        const answer = await this.prompt(
          'Do you want to skip existing skills and install only new ones? (y/N)'
        );

        if (answer.toLowerCase() === 'y') {
          this.logger.info('Skipping existing skills...');
          // Filter out already installed skills
          skills.splice(0, skills.length, ...skills.filter((s) => !installedSkills.includes(s.name)));
        } else {
          this.logger.info('Installation cancelled');
          return;
        }
      }
    }

    // Install skills
    this.logger.blank();
    this.logger.info('Installing skills...');

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const skill of skills) {
      this.logger.blank();
      this.logger.info(`Installing ${skill.name}...`);

      try {
        const result = await agent.install(skill, {
          overwrite: options.force ?? false,
          backup: true,
          onProgress: (current: number, total: number, file: string) => {
            this.logger.debug(`  [${current}/${total}] ${file}`);
          },
        });

        if (result.success) {
          successCount += result.installedSkills.length;
          skipCount += result.skippedSkills.length;

          for (const installed of result.installedSkills) {
            this.logger.success(`  ✓ ${installed}`);
          }

          for (const skipped of result.skippedSkills) {
            this.logger.info(`  − ${skipped} (skipped)`);
          }

          // Verify if requested
          if (options.verify && result.installedSkills.length > 0) {
            const verified = await agent.verify(skill.name);
            if (verified) {
              this.logger.success(`  ✓ Verification passed`);
            } else {
              this.logger.warn(`  ⚠ Verification failed`);
            }
          }
        } else {
          errorCount += result.errors.length;

          for (const error of result.errors) {
            this.logger.error(`  ✗ ${error.skill}: ${error.error}`);
          }
        }
      } catch (error) {
        errorCount++;
        this.logger.error(`  ✗ Failed to install ${skill.name}: ${error}`);
      }
    }

    // Summary
    this.logger.blank();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (errorCount === 0) {
      this.logger.success(`✓ dev-kit initialized successfully in ${duration}s`);
      this.logger.info(`  Installed: ${successCount} skills`);
      if (skipCount > 0) {
        this.logger.info(`  Skipped: ${skipCount} skills`);
      }

      // Display next steps
      this.displayNextSteps(agentName);
    } else {
      this.logger.error(`✗ Installation completed with ${errorCount} error(s)`);
      this.logger.info(`  Installed: ${successCount} skills`);
      this.logger.info(`  Skipped: ${skipCount} skills`);
      this.logger.info(`  Failed: ${errorCount} skills`);

      throw new CLIError(
        'Installation completed with errors',
        'SYSTEM_ERROR',
        'Check error messages above and try again'
      );
    }
  }

  /**
   * Create .dev-kit directory structure
   */
  private async createDevKitDirectory(): Promise<void> {
    const devKitDir = path.join(process.cwd(), '.dev-kit');

    this.logger.debug(`Creating .dev-kit directory at ${devKitDir}`);

    // Create main directory
    await fs.mkdir(devKitDir, { recursive: true });

    // Create subdirectories
    const subdirs = ['docs', 'knowledge', 'tickets'];

    for (const subdir of subdirs) {
      const subdirPath = path.join(devKitDir, subdir);
      await fs.mkdir(subdirPath, { recursive: true });
      this.logger.debug(`Created directory: ${subdirPath}`);
    }

    this.logger.debug('.dev-kit directory structure created');
  }

  /**
   * Parse command options from arguments
   *
   * @param args - Command arguments
   * @returns Parsed options
   */
  private parseOptions(args: string[]): InitOptions {
    const options: InitOptions = {
      force: false,
      verify: false,
      verbose: false,
      yes: false,
    };

    // Parse flags (simplified, will be handled by Commander.js in CLI)
    for (const arg of args) {
      if (arg === '--force') options.force = true;
      if (arg === '--verify') options.verify = true;
      if (arg === '--verbose' || arg === '-v') options.verbose = true;
      if (arg === '--yes' || arg === '-y') options.yes = true;
    }

    return options;
  }

  /**
   * Interactive agent selection
   *
   * @param options - Init options
   * @returns Selected agent name
   */
  private async selectAgentInteractively(_options: InitOptions): Promise<string> {
    this.logger.info('No agent specified. Selecting agent interactively...');
    this.logger.blank();

    // Create agent registry
    const registry = await createAgentRegistry();

    // Detect available agents
    const detectedAgents = await registry.detectAll();

    if (detectedAgents.length === 0) {
      this.logger.error('No supported agents detected on your system.');
      this.logger.blank();
      this.logger.info('Please install one of the following agents:');
      this.logger.info('  • Claude Code: https://code.claude.com');
      this.logger.info('  • GitHub Copilot: https://github.com/features/copilot');
      this.logger.blank();
      throw new CLIError(
        'No agents detected',
        'USER_ERROR',
        'Install a code agent and try again'
      );
    }

    // List detected agents
    this.logger.info('Detected agents:');
    for (const agent of detectedAgents) {
      this.logger.info(`  • ${agent.displayName} (${agent.name})`);
    }
    this.logger.blank();

    // Prompt user to select
    const agentNames = detectedAgents.map((a) => a.name);
    const answer = await this.prompt(
      `Select agent [${agentNames.join('/')}]: `,
      agentNames[0]
    );

    return answer.toLowerCase();
  }

  /**
   * Prompt user for input
   *
   * @param question - Question to ask
   * @param defaultValue - Default value
   * @returns User's answer
   */
  private async prompt(question: string, defaultValue = ''): Promise<string> {
    // In a real CLI, this would use a prompt library
    // For now, we'll use a simplified approach
    if (process.env.NODE_ENV === 'test') {
      return defaultValue;
    }

    // Use readline for interactive input
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim() || defaultValue);
      });
    });
  }

  /**
   * Display next steps after successful installation
   *
   * @param agentName - Agent that was initialized
   */
  private displayNextSteps(_agentName: string): void {
    this.logger.blank();
    this.logger.info('Next steps:');
    this.logger.blank();
    this.logger.info('  1. Try dev-kit workflows:');
    this.logger.info('     /dev-kit.init "My project description"');
    this.logger.info('     /dev-kit.ticket "Add user authentication"');
    this.logger.info('     /dev-kit.work ticket=DKIT-001');
    this.logger.blank();
    this.logger.info('  2. View onboarding guide:');
    this.logger.info('     dev-kit onboard');
    this.logger.blank();
    this.logger.info('  3. Learn more:');
    this.logger.info('     https://github.com/user/dev-kit');
    this.logger.blank();
  }
}

/**
 * Create init command handler
 */
export function createInitCommand(): InitCommand {
  return new InitCommand();
}
