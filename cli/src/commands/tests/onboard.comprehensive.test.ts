/**
 * Comprehensive Onboard Command Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OnboardCommand, OnboardOptions } from '../onboard.js';
import { writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { createTempDir, cleanupTempDir } from '../../tests/helpers/test-helpers.js';

describe('OnboardCommand - Comprehensive Tests', () => {
  let onboardCommand: OnboardCommand;
  let tempDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    onboardCommand = new OnboardCommand();
    tempDir = await createTempDir('onboard-test-');
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTempDir(tempDir);
    vi.clearAllMocks();
  });

  describe('parseOptions', () => {
    it('should parse default options with no args', () => {
      const options = (onboardCommand as any).parseOptions([]);
      expect(options).toEqual({
        output: 'terminal',
        open: false,
        section: undefined,
        update: false,
        pager: true,
      });
    });

    it('should parse --output flag', () => {
      const options = (onboardCommand as any).parseOptions(['--output', 'markdown']);
      expect(options.output).toBe('markdown');
    });

    it('should parse --open flag', () => {
      const options = (onboardCommand as any).parseOptions(['--open']);
      expect(options.open).toBe(true);
    });

    it('should parse --section flag', () => {
      const options = (onboardCommand as any).parseOptions(['--section', 'quick-start']);
      expect(options.section).toBe('quick-start');
    });

    it('should parse --update flag', () => {
      const options = (onboardCommand as any).parseOptions(['--update']);
      expect(options.update).toBe(true);
    });

    it('should parse --no-pager flag', () => {
      const options = (onboardCommand as any).parseOptions(['--no-pager']);
      expect(options.pager).toBe(false);
    });

    it('should parse multiple flags', () => {
      const options = (onboardCommand as any).parseOptions([
        '--output', 'json',
        '--section', 'overview',
        '--no-pager'
      ]);
      expect(options.output).toBe('json');
      expect(options.section).toBe('overview');
      expect(options.pager).toBe(false);
    });
  });

  describe('loadOnboardingGuide', () => {
    it('should load guide from docs/ONBOARDING.md', async () => {
      const docsDir = join(tempDir, 'docs');
      await writeFile(docsDir + '/ONBOARDING.md', '# Test Guide\n\nContent here', 'utf-8');

      const content = await (onboardCommand as any).loadOnboardingGuide();
      expect(content).toContain('# Test Guide');
    });

    it('should try multiple paths for guide', async () => {
      // Create guide in parent directory
      await writeFile('../ONBOARDING.md', '# Parent Guide\n\nContent', 'utf-8');

      const content = await (onboardCommand as any).loadOnboardingGuide();
      expect(content).toContain('# Parent Guide');
    });

    it('should throw error when guide not found', async () => {
      await expect((onboardCommand as any).loadOnboardingGuide()).rejects.toThrow(
        'Onboarding guide not found'
      );
    });
  });

  describe('extractSection', () => {
    const sampleContent = `# Guide Title

## Quick Start

Quick start content here.

## Overview

Overview content here.

### Subsection

Subsection content.

## Troubleshooting

Troubleshooting info.

`;

    it('should extract Quick Start section', () => {
      const section = (onboardCommand as any).extractSection(sampleContent, 'quick-start');
      expect(section).toBeDefined();
      expect(section).toContain('Quick Start');
      expect(section).toContain('Quick start content here');
    });

    it('should extract Overview section', () => {
      const section = (onboardCommand as any).extractSection(sampleContent, 'overview');
      expect(section).toBeDefined();
      expect(section).toContain('Overview');
      expect(section).toContain('Overview content here');
    });

    it('should return undefined for non-existent section', () => {
      const section = (onboardCommand as any).extractSection(sampleContent, 'non-existent');
      expect(section).toBeUndefined();
    });

    it('should include subsections in parent section', () => {
      const section = (onboardCommand as any).extractSection(sampleContent, 'overview');
      expect(section).toContain('Subsection');
      expect(section).toContain('Subsection content');
    });

    it('should stop at next section of same level', () => {
      const section = (onboardCommand as any).extractSection(sampleContent, 'quick-start');
      expect(section).not.toContain('Overview');
    });
  });

  describe('stripMarkdown', () => {
    it('should remove markdown headers', () => {
      const input = '# Header\n## Sub Header\nContent';
      const result = (onboardCommand as any).stripMarkdown(input);
      expect(result).not.toMatch(/^#/);
    });

    it('should remove bold formatting', () => {
      const input = 'This is **bold** text';
      const result = (onboardCommand as any).stripMarkdown(input);
      expect(result).not.toContain('**');
    });

    it('should remove italic formatting', () => {
      const input = 'This is *italic* text';
      const result = (onboardCommand as any).stripMarkdown(input);
      expect(result).not.toContain('*');
    });

    it('should remove code formatting', () => {
      const input = 'This is `code` text';
      const result = (onboardCommand as any).stripMarkdown(input);
      expect(result).not.toContain('`');
    });

    it('should remove links', () => {
      const input = '[Link text](https://example.com)';
      const result = (onboardCommand as any).stripMarkdown(input);
      expect(result).not.toContain('[');
      expect(result).not.toContain(']');
      expect(result).not.toContain('(');
      expect(result).not.toContain(')');
    });
  });

  describe('displayJSON', () => {
    it('should output valid JSON', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      (onboardCommand as any).displayJSON('Test content');

      expect(consoleSpy).toHaveBeenCalled();
      const callArgs = consoleSpy.mock.calls[0][0];
      expect(() => JSON.parse(callArgs)).not.toThrow();

      const parsed = JSON.parse(callArgs);
      expect(parsed).toHaveProperty('title', 'dev-kit Onboarding Guide');
      expect(parsed).toHaveProperty('content', 'Test content');
      expect(parsed).toHaveProperty('length', 12);

      consoleSpy.mockRestore();
    });
  });

  describe('displayMarkdown', () => {
    it('should output content as-is', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const content = '# Test\n\nContent';
      (onboardCommand as any).displayMarkdown(content);

      expect(consoleSpy).toHaveBeenCalledWith(content);

      consoleSpy.mockRestore();
    });
  });

  describe('displayPlain', () => {
    it('should strip markdown and output', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const content = '# Test Header\n\n**Bold** text';
      (onboardCommand as any).displayPlain(content);

      expect(consoleSpy).toHaveBeenCalled();
      const output = consoleSpy.mock.calls[0][0];
      expect(output).not.toContain('#');
      expect(output).not.toContain('**');

      consoleSpy.mockRestore();
    });
  });

  describe('detectTerminalCapabilities', () => {
    it('should return capabilities object', () => {
      const capabilities = (onboardCommand as any).detectTerminalCapabilities();
      expect(capabilities).toHaveProperty('colors');
      expect(capabilities).toHaveProperty('formatting');
      expect(capabilities).toHaveProperty('rows');
      expect(capabilities).toHaveProperty('cols');
      expect(typeof capabilities.colors).toBe('boolean');
      expect(typeof capabilities.formatting).toBe('boolean');
      expect(typeof capabilities.rows).toBe('number');
      expect(typeof capabilities.cols).toBe('number');
    });
  });

  describe('shouldUsePager', () => {
    it('should return true for long content', () => {
      const longContent = '# Test\n\n' + 'Line\n'.repeat(100);
      const result = (onboardCommand as any).shouldUsePager(longContent);
      expect(result).toBe(true);
    });

    it('should return false for short content', () => {
      const shortContent = '# Test\n\nShort content';
      const result = (onboardCommand as any).shouldUsePager(shortContent);
      expect(result).toBe(false);
    });
  });

  describe('formatForTerminal', () => {
    it('should format markdown for terminal', () => {
      const capabilities = { colors: true, formatting: true, rows: 25, cols: 80 };
      const content = '# Header\n\n**Bold** and *italic*';
      const formatted = (onboardCommand as any).formatForTerminal(content, capabilities);

      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });

    it('should handle plain text', () => {
      const capabilities = { colors: false, formatting: false, rows: 25, cols: 80 };
      const content = 'Plain text content';
      const formatted = (onboardCommand as any).formatForTerminal(content, capabilities);

      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('execute with --open flag', () => {
    it('should attempt to open browser', async () => {
      const openSpy = vi.spyOn(onboardCommand as any, 'openInBrowser').mockImplementation(() => {});

      await onboardCommand.execute(['--open']);

      expect(openSpy).toHaveBeenCalled();

      openSpy.mockRestore();
    });
  });

  describe('execute with --update flag', () => {
    it('should show warning for remote updates', async () => {
      const docsDir = join(tempDir, 'docs');
      await writeFile(docsDir + '/ONBOARDING.md', '# Guide\n\nContent', 'utf-8');

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await onboardCommand.execute(['--update']);

      // Should complete without error
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('execute with --section flag', () => {
    it('should display specific section', async () => {
      const docsDir = join(tempDir, 'docs');
      const content = '# Guide\n\n## Quick Start\n\nQuick start here.\n\n## Overview\n\nOverview here.';
      await writeFile(docsDir + '/ONBOARDING.md', content, 'utf-8');

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await onboardCommand.execute(['--section', 'quick-start']);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should show error for non-existent section', async () => {
      const docsDir = join(tempDir, 'docs');
      await writeFile(docsDir + '/ONBOARDING.md', '# Guide\n\nContent', 'utf-8');

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await onboardCommand.execute(['--section', 'non-existent']);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('execute with different output formats', () => {
    beforeEach(async () => {
      const docsDir = join(tempDir, 'docs');
      await writeFile(docsDir + '/ONBOARDING.md', '# Guide\n\nContent here', 'utf-8');
    });

    it('should handle markdown format', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await onboardCommand.execute(['--output', 'markdown']);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle plain format', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await onboardCommand.execute(['--output', 'plain']);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle json format', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await onboardCommand.execute(['--output', 'json']);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
