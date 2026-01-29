/**
 * Onboard Command Tests
 */

import { OnboardCommand } from '../onboard';
import type { OnboardOptions, OutputFormat } from '../onboard';

describe('OnboardCommand', () => {
  let command: OnboardCommand;

  beforeEach(() => {
    command = new OnboardCommand();
  });

  it('should create onboard command', () => {
    expect(command).toBeDefined();
  });

  describe('Option Parsing', () => {
    it('should parse --output option', () => {
      const options = command['parseOptions'](['--output', 'markdown']);
      expect(options.output).toBe('markdown');
    });

    it('should parse --open flag', () => {
      const options = command['parseOptions'](['--open']);
      expect(options.open).toBe(true);
    });

    it('should parse --section option', () => {
      const options = command['parseOptions'](['--section', 'faq']);
      expect(options.section).toBe('faq');
    });

    it('should parse --update flag', () => {
      const options = command['parseOptions'](['--update']);
      expect(options.update).toBe(true);
    });

    it('should parse --no-pager flag', () => {
      const options = command['parseOptions'](['--no-pager']);
      expect(options.pager).toBe(false);
    });

    it('should have default options', () => {
      const options = command['parseOptions']([]);
      expect(options.output).toBe('terminal');
      expect(options.open).toBe(false);
      expect(options.section).toBeUndefined();
      expect(options.update).toBe(false);
      expect(options.pager).toBe(true);
    });
  });

  describe('Section Extraction', () => {
    it('should extract Quick Start section', () => {
      const content = `# Guide

## Quick Start
Content here

## Other Section
More content`;

      const section = command['extractSection'](content, 'quick-start');
      expect(section).toBeDefined();
      expect(section).toContain('Content here');
      expect(section).not.toContain('Other Section');
    });

    it('should return undefined for non-existent section', () => {
      const content = '# Guide\n\nContent';
      const section = command['extractSection'](content, 'nonexistent');
      expect(section).toBeUndefined();
    });

    it('should extract all sections', () => {
      const content = `# Guide

## Section One
Content

### Subsection
More content

## Section Two
Content`;

      const sections = command['extractSections'](content);
      expect(sections).toContain('Guide');
      expect(sections).toContain('Section One');
      expect(sections).toContain('Section Two');
    });
  });

  describe('Markdown Formatting', () => {
    it('should strip markdown formatting', () => {
      const content = `# Header

**bold** and *italic* and \`code\`

[link](url)`;

      const plain = command['stripMarkdown'](content);
      expect(plain).not.toContain('#');
      expect(plain).not.toContain('**');
      expect(plain).not.toContain('*');
      expect(plain).toContain('bold');
      expect(plain).toContain('italic');
      expect(plain).toContain('code');
    });
  });

  describe('Terminal Capabilities Detection', () => {
    it('should detect terminal capabilities', () => {
      const capabilities = command['detectTerminalCapabilities']();
      expect(capabilities).toBeDefined();
      expect(typeof capabilities.colors).toBe('boolean');
      expect(typeof capabilities.rows).toBe('number');
      expect(typeof capabilities.cols).toBe('number');
    });
  });

  describe('Output Format', () => {
    it('should format for terminal with colors', () => {
      const content = `# Header

Some text and \`code\` blocks.`;

      const capabilities = { colors: true, formatting: true, rows: 25, cols: 80 };
      const formatted = command['formatForTerminal'](content, capabilities);

      expect(formatted).toContain('\x1b['); // ANSI color codes
      expect(formatted).toContain('\x1b[0m'); // Reset
    });

    it('should not add colors when disabled', () => {
      const content = `# Header`;

      const capabilities = { colors: false, formatting: true, rows: 25, cols: 80 };
      const formatted = command['formatForTerminal'](content, capabilities);

      expect(formatted).not.toContain('\x1b[');
    });
  });
});
