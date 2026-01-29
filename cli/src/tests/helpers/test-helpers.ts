/**
 * Test helper utilities
 */

import { rm, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * Create a temporary directory for testing
 */
export async function createTempDir(prefix = 'dev-kit-test-'): Promise<string> {
  const tempDir = join(tmpdir(), `${prefix}${Date.now()}`);
  await mkdir(tempDir, { recursive: true });
  return tempDir;
}

/**
 * Clean up a temporary directory
 */
export async function cleanupTempDir(dir: string): Promise<void> {
  try {
    await rm(dir, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors
  }
}

/**
 * Create a mock console spy
 */
export function createConsoleSpy() {
  const logs: string[] = [] = [];
  const errors: string[] = [];
  const warns: string[] = [];

  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  return {
    logs,
    errors,
    warns,
    start() {
      console.log = (...args: any[]) => logs.push(args.join(' '));
      console.error = (...args: any[]) => errors.push(args.join(' '));
      console.warn = (...args: any[]) => warns.push(args.join(' '));
    },
    stop() {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    },
    clear() {
      logs.length = 0;
      errors.length = 0;
      warns.length = 0;
    },
  };
}

/**
 * Create a mock process.exit spy
 */
export function createExitSpy() {
  let exitCode: number | undefined;
  const originalExit = process.exit;

  return {
    get exitCode() {
      return exitCode;
    },
    start() {
      process.exit = ((code: number) => {
        exitCode = code;
        throw new Error(`process.exit(${code})`);
      }) as any;
    },
    stop() {
      process.exit = originalExit;
      exitCode = undefined;
    },
  };
}

/**
 * Wait for async operations
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a mock agent registry entry
 */
export function createMockAgent(agentId: string, options: Partial<any> = {}) {
  return {
    id: agentId,
    name: `${agentId} Agent`,
    binary: agentId,
    version: '1.0.0',
    installed: true,
    ...options,
  };
}

/**
 * Create a test project structure
 */
export async function createTestProject(projectDir: string, structure: Record<string, string>) {
  const { writeFile } = await import('fs/promises');

  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = join(projectDir, filePath);
    const dir = dirname(fullPath);

    // Create directory if it doesn't exist
    await mkdir(dir, { recursive: true });

    // Write file
    await writeFile(fullPath, content, 'utf-8');
  }
}

function dirname(path: string): string {
  const parts = path.split(/[/\\]/);
  parts.pop();
  return parts.join('/');
}
