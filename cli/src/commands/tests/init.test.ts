/**
 * Init Command Tests
 */

import { InitCommand } from '../init';
import type { InitOptions } from '../init';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('InitCommand', () => {
  let command: InitCommand;
  let tempDir: string;

  beforeEach(async () => {
    command = new InitCommand();
    tempDir = path.join(process.env.TMPDIR || '/tmp', `init-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should create init command', () => {
    expect(command).toBeDefined();
  });

  it('should parse options correctly', () => {
    const options = command['parseOptions'](['--force', '--verify']);

    expect(options.force).toBe(true);
    expect(options.verify).toBe(true);
    expect(options.verbose).toBe(false);
  });

  it('should parse verbose flag', () => {
    const options = command['parseOptions'](['--verbose']);

    expect(options.verbose).toBe(true);
  });

  it('should parse short flags', () => {
    const options = command['parseOptions'](['-v', '-y']);

    expect(options.verbose).toBe(true);
    expect(options.yes).toBe(true);
  });

  it('should handle no options', () => {
    const options = command['parseOptions']([]);

    expect(options.force).toBe(false);
    expect(options.verify).toBe(false);
    expect(options.verbose).toBe(false);
    expect(options.yes).toBe(false);
  });

  // Note: Full integration tests would require:
  // - Mock file system
  // - Mock agent registry
  // - Mock readline for interactive prompts
  // - These would be better suited as E2E tests in DKIT-011
});
