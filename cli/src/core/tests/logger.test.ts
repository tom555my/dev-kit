/**
 * Logger tests
 */

import { Logger, LogLevel } from '../logger.js';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger({
      level: LogLevel.DEBUG,
      colorOutput: false, // Disable colors for testing
    });
  });

  it('should create logger with default options', () => {
    const defaultLogger = new Logger();
    expect(defaultLogger).toBeDefined();
  });

  it('should set log level', () => {
    logger.setLevel(LogLevel.ERROR);
    logger.debug('This should not appear');
    logger.info('This should not appear');
    logger.warn('This should not appear');
    logger.error('This should appear');
  });

  it('should respect log levels', () => {
    logger.setLevel(LogLevel.WARN);

    expect(logger['shouldLog'](LogLevel.DEBUG)).toBe(false);
    expect(logger['shouldLog'](LogLevel.INFO)).toBe(false);
    expect(logger['shouldLog'](LogLevel.WARN)).toBe(true);
    expect(logger['shouldLog'](LogLevel.ERROR)).toBe(true);
  });

  it('should create child logger with prefix', () => {
    const child = logger.child('test');
    expect(child).toBeDefined();
    expect(child['prefix']).toBe('test');
  });

  it('should format message with timestamp', () => {
    const message = 'Test message';
    const formatted = logger['formatMessage']('INFO', message);
    expect(formatted).toContain('INFO');
    expect(formatted).toContain(message);
  });

  it('should not color text when colors are disabled', () => {
    const noColorLogger = new Logger({ colorOutput: false });
    const text = 'Test';
    const colored = noColorLogger['color'](text, '\x1b[31m');
    expect(colored).toBe(text);
  });

  it('should color text when colors are enabled', () => {
    const colorLogger = new Logger({ colorOutput: true });
    const text = 'Test';
    const colored = colorLogger['color'](text, '\x1b[31m');
    expect(colored).toContain('\x1b[31m');
    expect(colored).toContain('\x1b[0m');
  });
});

describe('Global Logger', () => {
  it('should get global logger', async () => {
    const { getLogger } = await import('../logger.js');
    const logger = getLogger();
    expect(logger).toBeInstanceOf(Logger);
  });

  it('should set global logger', async () => {
    const { getLogger, setLogger } = await import('../logger.js');
    const newLogger = new Logger();
    setLogger(newLogger);
    const logger = getLogger();
    expect(logger).toBe(newLogger);
  });
});
