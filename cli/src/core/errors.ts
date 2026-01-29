/**
 * Error types for dev-kit CLI
 *
 * Defines specific error types for different failure scenarios.
 */

import { Logger } from './logger.js';

/**
 * Base error class for all CLI errors
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly suggestion?: string
  ) {
    super(message);
    this.name = 'CLIError';
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Format error for display to user
   */
  format(): string {
    let output = `✗ Error: ${this.message}\n`;

    if (this.suggestion) {
      output += `\n  → ${this.suggestion}\n`;
    }

    return output;
  }
}

/**
 * User error - caused by invalid input or user environment
 */
export class UserError extends CLIError {
  constructor(message: string, suggestion?: string) {
    super(message, 'USER_ERROR', suggestion);
    this.name = 'UserError';
  }
}

/**
 * System error - caused by file system or runtime issues
 */
export class SystemError extends CLIError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, 'SYSTEM_ERROR');
    this.name = 'SystemError';
  }

  override format(): string {
    let output = `✗ Error: ${this.message}`;

    if (this.cause) {
      output += `\n  → Caused by: ${this.cause.message}`;
    }

    return output;
  }
}

/**
 * Validation error - caused by invalid structure or missing fields
 */
export class ValidationError extends CLIError {
  constructor(
    message: string,
    public readonly issues: Array<{
      field: string;
      issue: string;
      severity: 'error' | 'warning';
    }>
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }

  override format(): string {
    let output = `✗ Error: ${this.message}\n\n`;

    if (this.issues.length > 0) {
      output += '  Issues:\n';
      for (const issue of this.issues) {
        const icon = issue.severity === 'error' ? '•' : '⚠';
        output += `    ${icon} ${issue.field}: ${issue.issue}\n`;
      }
    }

    return output;
  }
}

/**
 * Agent not installed error
 */
export class AgentNotInstalledError extends UserError {
  constructor(agentName: string, expectedPath: string) {
    super(
      `${agentName} not detected at ${expectedPath}`,
      `Install ${agentName} or verify installation path`
    );
    this.name = 'AgentNotInstalledError';
  }
}

/**
 * Invalid agent error
 */
export class InvalidAgentError extends UserError {
  constructor(agentName: string, supportedAgents: string[]) {
    super(
      `Agent "${agentName}" is not supported`,
      `Supported agents: ${supportedAgents.join(', ')}`
    );
    this.name = 'InvalidAgentError';
  }
}

/**
 * Permission denied error
 */
export class PermissionDeniedError extends UserError {
  constructor(path: string, operation: string) {
    super(
      `Permission denied: Cannot ${operation} ${path}`,
      'Fix file permissions or run with appropriate privileges'
    );
    this.name = 'PermissionDeniedError';
  }
}

/**
 * Skill installation error
 */
export class SkillInstallationError extends SystemError {
  constructor(skillName: string, agentName: string, cause?: Error) {
    super(
      `Failed to install skill "${skillName}" for ${agentName}`,
      cause
    );
    this.name = 'SkillInstallationError';
  }
}

/**
 * Skill validation error
 */
export class SkillValidationError extends ValidationError {
  constructor(skillName: string, issues: Array<{ field: string; issue: string; severity: 'error' | 'warning' }>) {
    super(`Invalid skill structure for "${skillName}"`, issues);
    this.name = 'SkillValidationError';
  }
}

/**
 * File not found error
 */
export class FileNotFoundError extends SystemError {
  constructor(path: string) {
    super(`File not found: ${path}`);
    this.name = 'FileNotFoundError';
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends UserError {
  constructor(message: string, suggestion?: string) {
    super(message, suggestion);
    this.name = 'ConfigurationError';
  }
}

/**
 * Handle an error and log it appropriately
 */
export function handleError(error: unknown, logger?: Logger): void {
  const log = logger ?? console.error;

  if (error instanceof CLIError) {
    log.error(error.format());
  } else if (error instanceof Error) {
    log.error(`✗ Unexpected error: ${error.message}`);
    if (process.env.DEBUG) {
      log.error(error.stack ?? '');
    }
  } else {
    log.error('✗ Unknown error occurred');
  }
}

/**
 * Convert unknown error to CLIError
 */
export function toCLIError(error: unknown): CLIError {
  if (error instanceof CLIError) {
    return error;
  }

  if (error instanceof Error) {
    return new SystemError(error.message, error);
  }

  return new SystemError(String(error));
}
