/**
 * Command Router
 *
 * Routes CLI commands to their handlers.
 */

import type { CommandHandler } from '../types/index.js';
import { Logger, getLogger } from './logger.js';
import { InvalidAgentError } from './errors.js';

export interface Route {
  command: string;
  handler: CommandHandler;
  description: string;
}

/**
 * Command router
 */
export class Router {
  private routes: Map<string, Route> = new Map();
  private logger: Logger;

  constructor() {
    this.logger = getLogger().child('router');
  }

  /**
   * Register a command route
   *
   * @param command - Command name
   * @param handler - Command handler
   * @param description - Command description
   */
  register(command: string, handler: CommandHandler, description: string): void {
    if (this.routes.has(command)) {
      throw new Error(`Command "${command}" is already registered`);
    }

    this.routes.set(command, { command, handler, description });
    this.logger.debug(`Registered route: ${command}`);
  }

  /**
   * Get a route by command name
   *
   * @param command - Command name
   * @returns Route or undefined
   */
  getRoute(command: string): Route | undefined {
    return this.routes.get(command);
  }

  /**
   * Check if a command is registered
   *
   * @param command - Command name
   * @returns true if command exists
   */
  has(command: string): boolean {
    return this.routes.has(command);
  }

  /**
   * Route a command to its handler
   *
   * @param command - Command name
   * @param args - Command arguments
   */
  async route(command: string, args: string[] = []): Promise<void> {
    this.logger.debug(`Routing command: ${command}`);

    const route = this.routes.get(command);

    if (!route) {
      throw new InvalidAgentError(
        command,
        Array.from(this.routes.keys())
      );
    }

    this.logger.info(`Executing command: ${command}`);
    await route.handler.execute(args);
  }

  /**
   * Get all registered commands
   *
   * @returns Array of command names
   */
  getCommands(): string[] {
    return Array.from(this.routes.keys());
  }

  /**
   * Get all routes
   *
   * @returns Array of routes
   */
  getAllRoutes(): Route[] {
    return Array.from(this.routes.values());
  }

  /**
   * Clear all routes
   *
   * Mainly useful for testing
   */
  clear(): void {
    this.routes.clear();
    this.logger.debug('Cleared all routes');
  }

  /**
   * Get count of registered routes
   */
  get size(): number {
    return this.routes.size;
  }
}
