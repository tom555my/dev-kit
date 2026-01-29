/**
 * Logger - Simple logging system for CLI output
 *
 * Provides structured logging with support for different log levels and colors.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LoggerOptions {
  level?: LogLevel;
  colorOutput?: boolean;
  prefix?: string;
}

/**
 * Color codes for terminal output
 */
const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
} as const;

/**
 * Logger class for CLI output
 */
export class Logger {
  private level: LogLevel;
  private colorOutput: boolean;
  private prefix?: string;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? LogLevel.INFO;
    this.colorOutput = options.colorOutput ?? true;
    this.prefix = options.prefix;
  }

  /**
   * Set the log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  /**
   * Apply color to text if colors are enabled
   */
  private color(text: string, color: string): string {
    if (!this.colorOutput) {
      return text;
    }
    return `${color}${text}${Colors.reset}`;
  }

  /**
   * Format log message with timestamp and prefix
   */
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}] ` : '';
    return `${prefix}${timestamp} [${level}] ${message}`;
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.DEBUG)) {
      return;
    }
    const formatted = this.formatMessage('DEBUG', message);
    console.log(this.color(formatted, Colors.dim), ...args);
  }

  /**
   * Log info message
   */
  info(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.INFO)) {
      return;
    }
    const formatted = this.formatMessage('INFO', message);
    console.log(this.color(formatted, Colors.blue), ...args);
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.WARN)) {
      return;
    }
    const formatted = this.formatMessage('WARN', message);
    console.warn(this.color(formatted, Colors.yellow), ...args);
  }

  /**
   * Log error message
   */
  error(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.ERROR)) {
      return;
    }
    const formatted = this.formatMessage('ERROR', message);
    console.error(this.color(formatted, Colors.red), ...args);
  }

  /**
   * Log success message
   */
  success(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.INFO)) {
      return;
    }
    const formatted = this.formatMessage('✓', message);
    console.log(this.color(formatted, Colors.green), ...args);
  }

  /**
   * Log a blank line
   */
  blank(): void {
    console.log('');
  }

  /**
   * Create a child logger with a different prefix
   */
  child(prefix: string): Logger {
    return new Logger({
      level: this.level,
      colorOutput: this.colorOutput,
      prefix: this.prefix ? `${this.prefix}:${prefix}` : prefix,
    });
  }
}

/**
 * Global logger instance
 */
let globalLogger: Logger | null = null;

/**
 * Get or create the global logger
 */
export function getLogger(): Logger {
  if (!globalLogger) {
    globalLogger = new Logger();
  }
  return globalLogger;
}

/**
 * Set the global logger
 */
export function setLogger(logger: Logger): void {
  globalLogger = logger;
}

/**
 * Convenience function for debug logging
 */
export function debug(message: string, ...args: unknown[]): void {
  getLogger().debug(message, ...args);
}

/**
 * Convenience function for info logging
 */
export function info(message: string, ...args: unknown[]): void {
  getLogger().info(message, ...args);
}

/**
 * Convenience function for warning logging
 */
export function warn(message: string, ...args: unknown[]): void {
  getLogger().warn(message, ...args);
}

/**
 * Convenience function for error logging
 */
export function error(message: string, ...args: unknown[]): void {
  getLogger().error(message, ...args);
}

/**
 * Convenience function for success logging
 */
export function success(message: string, ...args: unknown[]): void {
  getLogger().success(message, ...args);
}
