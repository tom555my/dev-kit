/**
 * Comprehensive Init Command Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InitCommand, InitOptions } from '../init.js';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { createTempDir, cleanupTempDir } from '../../tests/helpers/test-helpers.js';

// Mock the dependencies
vi.mock('../../agents/agent-registry.js', () => ({
  createAgentRegistry: vi.fn(),
}));

vi.mock('../../data/skills.js', () => ({
  getDevKitSkills: vi.fn(() => [
    {
      name: 'test-skill-1',
      sourcePath: '/test/source/skill1',
      content: 'test content 1',
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    },
    {
      name: 'test-skill-2',
      sourcePath: '/test/source/skill2',
      content: 'test content 2',
      targetPath: '',
      requiredFiles: ['SKILL.md'],
      compatibleAgents: ['claude-code'],
      frontmatter: {},
    },
  ]),
}));

describe('InitCommand - Comprehensive Tests', () => {
  let initCommand: InitCommand;
  let tempDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    initCommand = new InitCommand();
    tempDir = await createTempDir('init-test-');
    originalCwd = process.cwd();
    process.chdir(tempDir);

    // Set test environment
    process.env.NODE_ENV = 'test';
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTempDir(tempDir);
    process.env.NODE_ENV = 'development';
    vi.clearAllMocks();
  });

  describe('parseOptions', () => {
    it('should parse default options with no args', () => {
      const options = (initCommand as any).parseOptions([]);
      expect(options).toEqual({
        force: false,
        verify: false,
        verbose: false,
        yes: false,
      });
    });

    it('should parse --force flag', () => {
      const options = (initCommand as any).parseOptions(['--force']);
      expect(options.force).toBe(true);
    });

    it('should parse --verify flag', () => {
      const options = (initCommand as any).parseOptions(['--verify']);
      expect(options.verify).toBe(true);
    });

    it('should parse --verbose flag', () => {
      const options = (initCommand as any).parseOptions(['--verbose']);
      expect(options.verbose).toBe(true);
    });

    it('should parse -v as verbose', () => {
      const options = (initCommand as any).parseOptions(['-v']);
      expect(options.verbose).toBe(true);
    });

    it('should parse --yes flag', () => {
      const options = (initCommand as any).parseOptions(['--yes']);
      expect(options.yes).toBe(true);
    });

    it('should parse -y as yes', () => {
      const options = (initCommand as any).parseOptions(['-y']);
      expect(options.yes).toBe(true);
    });

    it('should parse multiple flags', () => {
      const options = (initCommand as any).parseOptions(['--force', '--verbose', '--yes']);
      expect(options.force).toBe(true);
      expect(options.verbose).toBe(true);
      expect(options.yes).toBe(true);
    });
  });

  describe('createDevKitDirectory', () => {
    it('should create .dev-kit directory structure', async () => {
      await (initCommand as any).createDevKitDirectory();

      const { stat } = await import('fs/promises');
      const devKitDir = join(tempDir, '.dev-kit');

      // Check main directory
      await expect(stat(devKitDir)).resolves.toBeDefined();

      // Check subdirectories
      await expect(stat(join(devKitDir, 'docs'))).resolves.toBeDefined();
      await expect(stat(join(devKitDir, 'knowledge'))).resolves.toBeDefined();
      await expect(stat(join(devKitDir, 'tickets'))).resolves.toBeDefined();
    });

    it('should not error if directory already exists', async () => {
      await (initCommand as any).createDevKitDirectory();
      await (initCommand as any).createDevKitDirectory(); // Should not throw

      const { stat } = await import('fs/promises');
      await expect(stat(join(tempDir, '.dev-kit'))).resolves.toBeDefined();
    });
  });

  describe('prompt in test mode', () => {
    it('should return default value in test environment', async () => {
      process.env.NODE_ENV = 'test';
      const result = await (initCommand as any).prompt('Test question?', 'default');
      expect(result).toBe('default');
    });

    it('should return empty string when no default provided', async () => {
      process.env.NODE_ENV = 'test';
      const result = await (initCommand as any).prompt('Test question?');
      expect(result).toBe('');
    });
  });

  describe('displayNextSteps', () => {
    it('should not throw when displaying next steps', () => {
      expect(() => {
        (initCommand as any).displayNextSteps('claude-code');
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should throw InvalidAgentError for invalid agent', async () => {
      const { createAgentRegistry } = await import('../../agents/agent-registry.js');

      vi.mocked(createAgentRegistry).mockResolvedValue({
        getOrThrow: vi.fn().mockReturnValue({
          name: 'invalid-agent',
          displayName: 'Invalid Agent',
          supported: true,
          detect: vi.fn().mockResolvedValue(true),
        }),
      } as any);

      await expect(initCommand.execute(['invalid-agent'])).rejects.toThrow(/not supported/);
    });

    it('should throw when no agent specified and no agents detected', async () => {
      const { createAgentRegistry } = await import('../../agents/agent-registry.js');

      vi.mocked(createAgentRegistry).mockResolvedValue({
        detectAll: vi.fn().mockResolvedValue([]),
      } as any);

      await expect(initCommand.execute([])).rejects.toThrow('No agents detected');
    });
  });

  describe('Agent Validation', () => {
    it('should validate agent names against whitelist', async () => {
      const validAgents = ['claude-code', 'github-copilot', 'cursor', 'opencode'];
      const { createAgentRegistry } = await import('../../agents/agent-registry.js');

      for (const agentName of validAgents) {
        vi.clearAllMocks();

        vi.mocked(createAgentRegistry).mockResolvedValue({
          getOrThrow: vi.fn().mockReturnValue({
            name: agentName,
            displayName: `${agentName} Agent`,
            supported: false,
            unsupportedReason: 'Test unsupported',
            detect: vi.fn().mockResolvedValue(true),
          }),
        } as any);

        // Should not throw InvalidAgentError for valid names
        await expect(
          initCommand.execute([agentName])
        ).rejects.not.toThrow(/Invalid agent/);
      }
    });
  });

  describe('Options Parsing Edge Cases', () => {
    it('should handle agent name with flags', () => {
      const options = (initCommand as any).parseOptions(['claude-code', '--force', '--verbose']);
      expect(options).toEqual({
        force: true,
        verify: false,
        verbose: true,
        yes: false,
      });
    });

    it('should handle flags before agent name', () => {
      const options = (initCommand as any).parseOptions(['--force', 'claude-code']);
      expect(options.force).toBe(true);
    });

    it('should handle duplicate flags (last one wins)', () => {
      const options = (initCommand as any).parseOptions(['--force', '--verbose', '--force']);
      expect(options.force).toBe(true);
      expect(options.verbose).toBe(true);
    });
  });

  describe('createDevKitDirectory Permissions', () => {
    it('should create directories with correct structure', async () => {
      await (initCommand as any).createDevKitDirectory();

      const { readdir } = await import('fs/promises');
      const devKitDir = join(tempDir, '.dev-kit');
      const contents = await readdir(devKitDir);

      expect(contents).toEqual(expect.arrayContaining(['docs', 'knowledge', 'tickets']));
      expect(contents).toHaveLength(3);
    });
  });
});
