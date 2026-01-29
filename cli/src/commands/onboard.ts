/**
 * Onboard Command
 *
 * Displays the dev-kit onboarding guide to users.
 */

import type { CommandHandler } from '../types/index.js';
import { getLogger, Logger } from '../core/logger.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync, spawn } from 'child_process';

/**
 * Output format types
 */
export type OutputFormat = 'terminal' | 'markdown' | 'plain' | 'json';

/**
 * Onboarding command options
 */
export interface OnboardOptions {
  /** Output format */
  output?: OutputFormat;
  /** Open in browser */
  open?: boolean;
  /** Specific section to display */
  section?: string;
  /** Update guide from remote */
  update?: boolean;
  /** Use pager for long content */
  pager?: boolean;
}

/**
 * Onboard Command Handler
 */
export class OnboardCommand implements CommandHandler {
  private logger: Logger;

  constructor() {
    this.logger = getLogger().child('onboard');
  }

  /**
   * Execute the onboard command
   *
   * @param args - Command arguments
   */
  async execute(args: string[]): Promise<void> {
    this.logger.info('Loading onboarding guide...');

    // Parse options
    const options = this.parseOptions(args);

    // Handle --open flag immediately
    if (options.open) {
      this.openInBrowser();
      return;
    }

    // Load onboarding guide content
    const content = await this.loadOnboardingGuide();

    // Handle --update flag
    if (options.update) {
      this.logger.info('Fetching latest onboarding guide...');
      // TODO: Implement remote fetching in future version
      this.logger.warn('Remote updates not yet implemented');
    }

    // Handle section-specific display
    if (options.section) {
      this.displaySection(content, options.section, options.output);
      return;
    }

    // Handle different output formats
    switch (options.output) {
      case 'markdown':
        this.displayMarkdown(content);
        break;

      case 'plain':
        this.displayPlain(content);
        break;

      case 'json':
        this.displayJSON(content);
        break;

      case 'terminal':
      default:
        this.displayTerminal(content, options);
        break;
    }
  }

  /**
   * Load onboarding guide content
   *
   * @returns Guide content
   */
  private async loadOnboardingGuide(): Promise<string> {
    // Look for onboarding guide in several locations
    const possiblePaths = [
      path.resolve(process.cwd(), 'docs/ONBOARDING.md'),
      path.resolve(process.cwd(), '../docs/ONBOARDING.md'),
      path.resolve(process.cwd(), '../../docs/ONBOARDING.md'),
      path.resolve(process.cwd(), './ONBOARDING.md'),
    ];

    for (const guidePath of possiblePaths) {
      try {
        const content = await fs.readFile(guidePath, 'utf-8');
        this.logger.debug(`Loaded onboarding guide from ${guidePath}`);
        return content;
      } catch (error) {
        // File doesn't exist, try next path
        continue;
      }
    }

    throw new Error(
      'Onboarding guide not found. Please ensure docs/ONBOARDING.md exists.'
    );
  }

  /**
   * Display guide in terminal format with formatting
   *
   * @param content - Guide content
   * @param options - Display options
   */
  private displayTerminal(content: string, options: OnboardOptions): void {
    this.logger.blank();

    // Check terminal capabilities
    const capabilities = this.detectTerminalCapabilities();

    // Format content for terminal
    const formatted = this.formatForTerminal(content, capabilities);

    // Display with or without pager
    if (options.pager && this.shouldUsePager(content)) {
      this.displayWithPager(formatted);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Display guide in markdown format
   *
   * @param content - Guide content
   */
  private displayMarkdown(content: string): void {
    console.log(content);
  }

  /**
   * Display guide in plain text format
   *
   * @param content - Guide content
   */
  private displayPlain(content: string): void {
    // Remove markdown formatting
    const plain = this.stripMarkdown(content);
    console.log(plain);
  }

  /**
   * Display guide in JSON format
   *
   * @param content - Guide content
   */
  private displayJSON(content: string): void {
    const data = {
      title: 'dev-kit Onboarding Guide',
      content,
      format: 'markdown',
      length: content.length,
    };
    console.log(JSON.stringify(data, null, 2));
  }

  /**
   * Display specific section of guide
   *
   * @param content - Guide content
   * @param section - Section name
   * @param format - Output format
   */
  private displaySection(content: string, section: string, format?: OutputFormat): void {
    this.logger.info(`Displaying section: ${section}`);

    const sectionContent = this.extractSection(content, section);

    if (!sectionContent) {
      this.logger.error(`Section "${section}" not found`);
      this.logger.info('Available sections:');
      this.listSections(content);
      return;
    }

    // Display section based on format
    const outputFormat = format || 'terminal';

    switch (outputFormat) {
      case 'markdown':
        console.log(sectionContent);
        break;

      case 'plain':
        console.log(this.stripMarkdown(sectionContent));
        break;

      case 'json':
        const data = {
          section,
          content: sectionContent,
        };
        console.log(JSON.stringify(data, null, 2));
        break;

      case 'terminal':
      default:
        // Apply terminal formatting
        const capabilities = this.detectTerminalCapabilities();
        const formatted = this.formatForTerminal(sectionContent, capabilities);
        console.log(formatted);
        break;
    }
  }

  /**
   * Extract a specific section from the guide
   *
   * @param content - Full guide content
   * @param section - Section name
   * @returns Section content or undefined
   */
  private extractSection(content: string, section: string): string | undefined {
    // Map user-friendly section names to markdown headers
    const sectionMap: Record<string, string> = {
      'quick-start': 'Quick Start',
      'quickstart': 'Quick Start',
      'overview': 'Overview',
      'workflows': 'Workflow Overview',
      'workflow': 'Workflow Overview',
      'examples': 'Example Workflows',
      'example': 'Example Workflows',
      'faq': 'FAQ',
      'troubleshooting': 'Troubleshooting',
      'next-steps': 'Next Steps',
    };

    const headerName = sectionMap[section.toLowerCase()] || section;

    // Find the section
    const lines = content.split('\n');
    let startIndex = -1;
    let endIndex = lines.length;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for matching header
      if (line && line.startsWith('#') && line.includes(headerName)) {
        startIndex = i;
      }

      // Stop at next header of same or higher level
      if (startIndex >= 0 && i > startIndex && line) {
        const startLine = lines[startIndex];
        const currentLevel = startLine?.match(/^#+/)?.[0].length || 0;
        const currentLineLevel = line.match(/^#+/)?.[0].length || 0;

        if (currentLineLevel <= currentLevel && line.startsWith('#')) {
          endIndex = i;
          break;
        }
      }
    }

    if (startIndex === -1) {
      return undefined;
    }

    return lines.slice(startIndex, endIndex).join('\n');
  }

  /**
   * List available sections in the guide
   *
   * @param content - Guide content
   */
  private listSections(content: string): void {
    const sections = this.extractSections(content);

    this.logger.info('Available sections:');
    for (const section of sections) {
      this.logger.info(`  • ${section}`);
    }
  }

  /**
   * Extract all section names from guide
   *
   * @param content - Guide content
   * @returns Array of section names
   */
  private extractSections(content: string): string[] {
    const sections: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.startsWith('#') && line.length > 1) {
        const header = line.replace(/^#+\s*/, '').trim();
        sections.push(header);
      }
    }

    return sections;
  }

  /**
   * Format content for terminal display
   *
   * @param content - Markdown content
   * @param capabilities - Terminal capabilities
   * @returns Formatted content
   */
  private formatForTerminal(content: string, capabilities: TerminalCapabilities): string {
    let formatted = content;

    if (capabilities.colors) {
      // Apply some basic formatting
      formatted = this.addColorFormatting(formatted);
    }

    return formatted;
  }

  /**
   * Add color formatting to markdown content
   *
   * @param content - Markdown content
   * @returns Formatted content with ANSI colors
   */
  private addColorFormatting(content: string): string {
    const lines = content.split('\n');
    const formatted: string[] = [];

    for (const line of lines) {
      let formattedLine = line;

      // Color headers
      if (line.match(/^#+\s/)) {
        const level = line.match(/^#+/)?.[0].length || 0;
        const colors = ['\x1b[1;32m', '\x1b[1;33m', '\x1b[1;34m', '\x1b[1;35m', '\x1b[1;36m'];
        const reset = '\x1b[0m';

        formattedLine = `${colors[Math.min(level - 1, 4)]}${line}${reset}`;
      }

      // Color code blocks
      if (line.match(/^\s*```/)) {
        formattedLine = '\x1b[36m' + line + '\x1b[0m';
      }

      // Color inline code
      formattedLine = formattedLine.replace(/`([^`]+)`/g, '\x1b[36m$1\x1b[0m');

      // Color bold
      formattedLine = formattedLine.replace(/\*\*([^*]+)\*\*/g, '\x1b[1m$1\x1b[0m');

      formatted.push(formattedLine);
    }

    return formatted.join('\n');
  }

  /**
   * Strip markdown formatting
   *
   * @param content - Markdown content
   * @returns Plain text content
   */
  private stripMarkdown(content: string): string {
    let plain = content;

    // Remove headers but keep text
    plain = plain.replace(/^#+\s+/gm, '');

    // Remove code blocks
    plain = plain.replace(/```\n[\s\S]*?\n```/g, '');

    // Remove inline code
    plain = plain.replace(/`([^`]+)`/g, '$1');

    // Remove bold
    plain = plain.replace(/\*\*([^*]+)\*\*/g, '$1');

    // Remove italic
    plain = plain.replace(/\*([^*]+)\*/g, '$1');

    // Remove links but keep text
    plain = plain.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    return plain;
  }

  /**
   * Detect terminal capabilities
   *
   * @returns Terminal capabilities
   */
  private detectTerminalCapabilities(): TerminalCapabilities {
    const env = process.env;

    return {
      colors: env.TERM !== 'dumb' && env.FORCE_COLOR !== '0',
      formatting: env.TERM !== 'dumb',
      rows: parseInt(env.TERM_LINES || '25', 10),
      cols: parseInt(env.TERM_COLUMNS || '80', 10),
    };
  }

  /**
   * Check if content should use pager
   *
   * @param content - Content to display
   * @returns true if pager should be used
   */
  private shouldUsePager(content: string): boolean {
    const lines = content.split('\n').length;
    const capabilities = this.detectTerminalCapabilities();

    // Use pager if content is longer than terminal rows
    return lines > capabilities.rows;
  }

  /**
   * Display content with pager
   *
   * @param content - Content to display
   */
  private displayWithPager(content: string): void {
    try {
      // Try to use 'less' pager
      const result = execSync('echo "$PAGER" | less --version', {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });

      if (!result.stderr) {
        // 'less' is available
        const proc = spawn('less', ['-R'], {
          stdio: ['pipe', 'inherit', 'inherit'],
        });

        proc.stdin.write(content);
        proc.stdin.end();
        return;
      }
    } catch {
      // Pager not available, fall back to console
    }

    // Fallback to console
    console.log(content);
  }

  /**
   * Open guide in browser
   */
  private openInBrowser(): void {
    this.logger.info('Opening onboarding guide in browser...');

    try {
      const url = 'https://github.com/user/dev-kit/blob/main/docs/ONBOARDING.md';

      // Use open command on macOS, xdg-open on Linux
      const command = process.platform === 'darwin' ? 'open' : 'xdg-open';

      execSync(`${command} ${url}`, {
        stdio: 'ignore',
      });

      this.logger.success(`Opened: ${url}`);
    } catch (error) {
      this.logger.error('Failed to open browser');
      this.logger.info('Visit: https://github.com/user/dev-kit/blob/main/docs/ONBOARDING.md');
    }
  }

  /**
   * Parse command options
   *
   * @param args - Command arguments
   * @returns Parsed options
   */
  private parseOptions(args: string[]): OnboardOptions {
    const options: OnboardOptions = {
      output: 'terminal',
      open: false,
      section: undefined,
      update: false,
      pager: true,
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg === '--output' && i + 1 < args.length) {
        options.output = args[++i] as OutputFormat;
      } else if (arg === '--open') {
        options.open = true;
      } else if (arg === '--section' && i + 1 < args.length) {
        options.section = args[++i];
      } else if (arg === '--update') {
        options.update = true;
      } else if (arg === '--no-pager') {
        options.pager = false;
      }
    }

    return options;
  }
}

/**
 * Terminal capabilities
 */
interface TerminalCapabilities {
  colors: boolean;
  formatting: boolean;
  rows: number;
  cols: number;
}

/**
 * Create onboard command handler
 */
export function createOnboardCommand(): OnboardCommand {
  return new OnboardCommand();
}
