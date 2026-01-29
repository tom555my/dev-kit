#!/usr/bin/env node

/**
 * dev-kit CLI - Main Entry Point
 *
 * A CLI tool for initializing dev-kit workflows across AI coding agents.
 */

import { Command } from 'commander';
import { setLogger, Logger, LogLevel } from './core/logger.js';
import { handleError } from './core/errors.js';
import { createInitCommand } from './commands/init.js';
import { createOnboardCommand } from './commands/onboard.js';
import packageJson from '../package.json' assert { type: 'json' };

// Set up global logger
const logger = new Logger({
  level: LogLevel.INFO,
  colorOutput: true,
});
setLogger(logger);

/**
 * CLI version
 */
const VERSION = packageJson.version;

/**
 * Main CLI program
 */
const program = new Command();

/**
 * Configure the CLI program
 */
function configureProgram(): void {
  program
    .name('dev-kit')
    .description('CLI tool for dev-kit workflows across AI coding agents')
    .version(VERSION, '-v, --version', 'Display version number')
    .helpOption('-h, --help', 'Display help for command')
    .addHelpText('after', '\nDocumentation: https://github.com/user/dev-kit');

  // Add global options
  program.option('--verbose', 'Enable verbose output', false);
  program.option('--debug', 'Enable debug output', false);

  // Handle global options
  program.hook('preAction', (thisCommand) => {
    const options = thisCommand.opts();

    if (options.debug) {
      logger.setLevel(LogLevel.DEBUG);
    } else if (options.verbose) {
      logger.setLevel(LogLevel.DEBUG);
    }
  });

  // Register commands
  const initCommand = createInitCommand();
  const onboardCommand = createOnboardCommand();

  program
    .command('init [agent]')
    .description('Initialize dev-kit for a code agent')
    .option('--force', 'Overwrite existing skills')
    .option('--verify', 'Verify installation after copying')
    .option('-y, --yes', 'Skip confirmation prompts')
    .action(async (agent, options) => {
      const args = [agent, ...(options.force ? ['--force'] : []), ...(options.verify ? ['--verify'] : []), ...(options.yes ? ['--yes'] : [])];
      await initCommand.execute(args.filter(Boolean));
    });

  program
    .command('onboard')
    .description('Display onboarding guide for dev-kit')
    .option('--output <format>', 'Output format (terminal, markdown, plain, json)',)
    .option('--section <name>', 'Display specific section', )
    .option('--open', 'Open guide in browser')
    .option('--update', 'Fetch latest guide from remote (not implemented)')
    .option('--no-pager', 'Disable paging for long content')
    .action(async (options) => {
      const args = [
        ...(options.output ? ['--output', options.output] : []),
        ...(options.section ? ['--section', options.section] : []),
        ...(options.open ? ['--open'] : []),
        ...(options.update ? ['--update'] : []),
        ...(options.noPager ? ['--no-pager'] : []),
      ];
      await onboardCommand.execute(args);
    });

  logger.debug('CLI program configured');
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  try {
    logger.debug(`dev-kit CLI v${VERSION} starting...`);

    // Configure program
    configureProgram();

    // Parse arguments
    await program.parseAsync(process.argv);

    logger.debug('CLI execution completed');
  } catch (error) {
    handleError(error, logger);
    process.exit(1);
  }
}

// Run main if this file is executed directly
// Check if this module is the main module (Node.js equivalent of import.meta.main)
const isMainModule = process.argv[1] === __filename;
if (isMainModule) {
  main();
}

export { program, configureProgram };
