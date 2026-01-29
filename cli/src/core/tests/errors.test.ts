/**
 * Error types tests
 */

import {
  CLIError,
  UserError,
  SystemError,
  ValidationError,
  AgentNotInstalledError,
  InvalidAgentError,
  PermissionDeniedError,
  SkillInstallationError,
  FileNotFoundError,
  ConfigurationError,
} from '../errors';

describe('CLIError', () => {
  it('should create base CLI error', () => {
    const error = new CLIError('Test error', 'TEST_CODE', 'Suggestion');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.suggestion).toBe('Suggestion');
    expect(error.name).toBe('CLIError');
  });

  it('should format error with suggestion', () => {
    const error = new CLIError('Test error', 'TEST_CODE', 'Fix it');
    const formatted = error.format();
    expect(formatted).toContain('Test error');
    expect(formatted).toContain('Fix it');
  });

  it('should format error without suggestion', () => {
    const error = new CLIError('Test error', 'TEST_CODE');
    const formatted = error.format();
    expect(formatted).toContain('Test error');
    expect(formatted).not.toContain('→');
  });
});

describe('UserError', () => {
  it('should create user error', () => {
    const error = new UserError('Invalid input', 'Check your input');
    expect(error.name).toBe('UserError');
    expect(error.code).toBe('USER_ERROR');
  });

  it('should format user error', () => {
    const error = new UserError('Invalid input', 'Check your input');
    const formatted = error.format();
    expect(formatted).toContain('Invalid input');
    expect(formatted).toContain('Check your input');
  });
});

describe('SystemError', () => {
  it('should create system error', () => {
    const cause = new Error('Root cause');
    const error = new SystemError('System failed', cause);
    expect(error.name).toBe('SystemError');
    expect(error.code).toBe('SYSTEM_ERROR');
    expect(error.cause).toBe(cause);
  });

  it('should format system error with cause', () => {
    const cause = new Error('Root cause');
    const error = new SystemError('System failed', cause);
    const formatted = error.format();
    expect(formatted).toContain('System failed');
    expect(formatted).toContain('Root cause');
  });
});

describe('ValidationError', () => {
  it('should create validation error', () => {
    const issues = [
      { field: 'name', issue: 'Missing', severity: 'error' as const },
      { field: 'email', issue: 'Invalid format', severity: 'warning' as const },
    ];
    const error = new ValidationError('Validation failed', issues);
    expect(error.name).toBe('ValidationError');
    expect(error.issues).toEqual(issues);
  });

  it('should format validation error', () => {
    const issues = [
      { field: 'name', issue: 'Missing', severity: 'error' as const },
    ];
    const error = new ValidationError('Validation failed', issues);
    const formatted = error.format();
    expect(formatted).toContain('Validation failed');
    expect(formatted).toContain('Issues:');
    expect(formatted).toContain('name: Missing');
  });
});

describe('AgentNotInstalledError', () => {
  it('should create agent not installed error', () => {
    const error = new AgentNotInstalledError('Claude Code', '~/.claude/skills');
    expect(error.name).toBe('AgentNotInstalledError');
    expect(error.message).toContain('Claude Code');
    expect(error.message).toContain('~/.claude/skills');
  });
});

describe('InvalidAgentError', () => {
  it('should create invalid agent error', () => {
    const error = new InvalidAgentError('invalid-agent', ['claude-code', 'github-copilot']);
    expect(error.name).toBe('InvalidAgentError');
    expect(error.message).toContain('invalid-agent');
    expect(error.suggestion).toContain('claude-code');
  });
});

describe('PermissionDeniedError', () => {
  it('should create permission denied error', () => {
    const error = new PermissionDeniedError('/path/to/file', 'write');
    expect(error.name).toBe('PermissionDeniedError');
    expect(error.message).toContain('Permission denied');
    expect(error.message).toContain('/path/to/file');
    expect(error.message).toContain('write');
  });
});

describe('SkillInstallationError', () => {
  it('should create skill installation error', () => {
    const cause = new Error('Disk full');
    const error = new SkillInstallationError('test-skill', 'Claude Code', cause);
    expect(error.name).toBe('SkillInstallationError');
    expect(error.message).toContain('test-skill');
    expect(error.cause).toBe(cause);
  });
});

describe('FileNotFoundError', () => {
  it('should create file not found error', () => {
    const error = new FileNotFoundError('/path/to/file');
    expect(error.name).toBe('FileNotFoundError');
    expect(error.message).toContain('/path/to/file');
  });
});

describe('ConfigurationError', () => {
  it('should create configuration error', () => {
    const error = new ConfigurationError('Invalid config', 'Check config.json');
    expect(error.name).toBe('ConfigurationError');
    expect(error.message).toContain('Invalid config');
    expect(error.suggestion).toBe('Check config.json');
  });
});
