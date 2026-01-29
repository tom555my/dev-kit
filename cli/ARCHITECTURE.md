# dev-kit CLI Architecture

**Version:** 1.0.0
**Last Updated:** 2025-01-28
**Status:** Design Document

---

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Architecture Diagram](#architecture-diagram)
4. [Command Structure](#command-structure)
5. [Module Architecture](#module-architecture)
6. [Data Structures](#data-structures)
7. [Error Handling Strategy](#error-handling-strategy)
8. [Testing Strategy](#testing-strategy)
9. [Build and Distribution](#build-and-distribution)
10. [Extension Points](#extension-points)

---

## Overview

The **dev-kit CLI** is a single-file executable built with Bun that helps users initialize dev-kit workflows across multiple AI coding agents. It provides a unified interface for installing agent skills, displaying documentation, and managing configurations.

### Key Requirements

1. **Multi-Agent Support**: Support Claude Code, GitHub Copilot, Cursor, OpenCode
2. **Single-File Executable**: Built with Bun compilation for portability
3. **Embedded Resources**: Skill files and documentation embedded in binary
4. **Cross-Platform**: Works on macOS (ARM64/x64), Linux (x64/ARM64), Windows (x64)
5. **Extensibility**: Easy to add new agents and commands

### Technical Stack

- **Runtime**: Bun (JavaScript/TypeScript)
- **CLI Framework**: Commander.js (lightweight, Bun-compatible)
- **File System**: Bun fs APIs
- **Build Tool**: Bun compiler with asset embedding

---

## Design Principles

### 1. Separation of Concerns
Each module has a single, well-defined responsibility:
- **Core**: Command routing only
- **Agents**: Agent-specific logic only
- **Installer**: File operations only
- **Resources**: Asset management only
- **Config**: State persistence only

### 2. Interface-Based Design
All modules depend on interfaces, not concrete implementations:
```typescript
interface Agent {
  name: string;
  detect(): Promise<boolean>;
  install(skill: Skill): Promise<InstallResult>;
  verify(skillName: string): Promise<boolean>;
}

// Can be mocked for testing
const mockAgent: Agent = { ... };
```

### 3. Fail-Fast with Clear Errors
Errors are caught early and communicated clearly:
```bash
# Before destructive operations
✗ Error: Claude Code not detected at ~/.claude/skills/
  → Install Claude Code from https://code.claude.com
```

### 4. Immutable Configuration
Configuration is read-only after load:
```typescript
// ✅ Good: Immutable config
const config = await loadConfig();
const target = config.getSkillPath(agent);

// ❌ Bad: Mutating config
config.skillPath = 'new-path';
```

### 5. Asset Embedding
All static files are embedded at build time:
```typescript
// No external file dependencies at runtime
import onboardingGuide from "../embedded/docs/ONBOARDING.md" with { type: "file" };
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         dev-kit CLI                             │
│                      (Single Executable)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Core Framework                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ CLI Parser   │  │ Router       │  │ Error Handler        │  │
│  │ (Commander)  │  │ (Routes to   │  │ (Unified errors)     │  │
│  │              │  │  handlers)   │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Commands Module │  │ Config Module   │  │Resource Manager │
│                 │  │                 │  │                 │
│ • init          │  │ • Load config   │  │ • Embed files   │
│ • install-skills│  │ • Save config   │  │ • Serve assets  │
│ • onboard       │  │ • Validate      │  │ • Cache         │
│ • --version     │  │ • Migrate       │  │                 │
│ • --help        │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agent Abstraction Layer                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Claude   │  │    GitHub  │  │   Cursor   │            │
│  │    Code    │  │   Copilot  │  │            │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                             │
│  Common Interface:                                          │
│  • detect()     → Promise<boolean>                          │
│  • install()    → Promise<InstallResult>                    │
│  • verify()     → Promise<boolean>                          │
│  • uninstall()  → Promise<void>                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Skill Installer Module                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ File Ops     │  │ Validator    │  │ Rollback         │  │
│  │ (Copy/Move)  │  │ (YAML check) │  │ (Undo on error)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    File System                               │
│  • ~/.claude/skills/        (Claude Code)                   │
│  • ~/.copilot-skills/       (GitHub Copilot)                │
│  • ~/.cursor/extensions/    (Cursor)                        │
│  • ~/.dev-kit/config.json   (CLI Config)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Command Structure

### Command Hierarchy

```bash
dev-kit
├── init [agent]              # Initialize dev-kit for agent
│   ├── --all                # Initialize all supported agents
│   ├── --force              # Overwrite existing skills
│   └── --verbose            # Show detailed output
│
├── install-skills [agent]    # Install skills for agent
│   ├── --skill <name>       # Install specific skill
│   └── --list               # List available skills
│
├── onboard                   # Display onboarding guide
│   ├── --format <type>      # Output format (markdown/terminal)
│   └── --output <file>      # Save to file
│
├── config                    # Manage configuration
│   ├── get <key>            # Get config value
│   ├── set <key> <value>    # Set config value
│   └── --reset              # Reset to defaults
│
├── --version                 # Show version info
└── --help                    # Show usage information
```

### Command Routing Flow

```
User Input → Commander Parser → Router → Handler
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Load Config   │
                              └───────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Detect Agent  │
                              └───────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Execute Logic │
                              └───────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Return Result │
                              └───────────────┘
```

---

## Module Architecture

### 1. Core Framework (`cli/src/core/`)

**Responsibility**: Command parsing, routing, and global error handling

**Files**:
- `cli.ts` - Main entry point
- `router.ts` - Command router
- `error-handler.ts` - Global error handler

**Interface**:
```typescript
export interface CommandHandler {
  execute(args: string[]): Promise<void>;
}

export class Router {
  register(command: string, handler: CommandHandler): void;
  route(command: string, args: string[]): Promise<void>;
}
```

**Dependencies**: None (foundation layer)

---

### 2. Config Module (`cli/src/config/`)

**Responsibility**: Load, save, and validate user configuration

**Files**:
- `config.ts` - Configuration model
- `loader.ts` - Load from file system
- `validator.ts` - Validate config schema
- `migrator.ts` - Migrate old config versions

**Interface**:
```typescript
export interface UserConfig {
  preferredAgents: string[];
  installationPaths: Record<string, string>;
  verbose: boolean;
  autoUpdate: boolean;
  version: string;
}

export class ConfigManager {
  async load(): Promise<UserConfig>;
  async save(config: UserConfig): Promise<void>;
  async validate(config: UserConfig): Promise<ValidationResult>;
  async migrate(config: any): Promise<UserConfig>;
}
```

**Dependencies**: None

**Error Handling**:
- Invalid JSON: ParseError with line number
- Missing config: Create default
- Version mismatch: Auto-migrate or error

---

### 3. Agent Abstraction Layer (`cli/src/agents/`)

**Responsibility**: Agent detection, installation, and verification

**Files**:
- `agent.ts` - Agent interface definition
- `agent-registry.ts` - Registry of all agents
- `agents/claude-code.ts` - Claude Code implementation
- `agents/github-copilot.ts` - GitHub Copilot implementation
- `agents/cursor.ts` - Cursor implementation
- `agents/opencode.ts` - OpenCode implementation (stub)

**Interface**:
```typescript
export interface Skill {
  name: string;
  sourcePath: string;    // Embedded path
  targetPath: string;    // Installation path
  files: string[];       // Required files
}

export interface InstallResult {
  success: boolean;
  installedSkills: string[];
  errors: string[];
  rollback: () => Promise<void>;
}

export interface Agent {
  readonly name: string;
  readonly displayName: string;
  readonly skillPath: string;
  readonly supported: boolean;

  detect(): Promise<boolean>;
  install(skill: Skill): Promise<InstallResult>;
  verify(skillName: string): Promise<boolean>;
  uninstall(skillName: string): Promise<void>;
  getInstalledSkills(): Promise<string[]>;
}

export class AgentRegistry {
  register(agent: Agent): void;
  get(name: string): Agent | undefined;
  detectAll(): Promise<Agent[]>;
  getSupported(): Agent[];
}
```

**Dependencies**: Config Module, Installer Module

**Implementation Example**:
```typescript
export class ClaudeCodeAgent implements Agent {
  readonly name = 'claude-code';
  readonly displayName = 'Claude Code';
  readonly skillPath = path.join(os.homedir(), '.claude', 'skills');
  readonly supported = true;

  async detect(): Promise<boolean> {
    return await fs.exists(this.skillPath);
  }

  async install(skill: Skill): Promise<InstallResult> {
    // Installer module handles file operations
    return installer.install(skill, this.skillPath);
  }

  async verify(skillName: string): Promise<boolean> {
    const skillFile = path.join(this.skillPath, skillName, 'SKILL.md');
    if (!await fs.exists(skillFile)) return false;

    const content = await fs.readFile(skillFile, 'utf-8');
    return content.includes('---') && content.includes('name:');
  }

  async uninstall(skillName: string): Promise<void> {
    const target = path.join(this.skillPath, skillName);
    await fs.remove(target);
  }

  async getInstalledSkills(): Promise<string[]> {
    if (!await fs.exists(this.skillPath)) return [];
    const entries = await fs.readdir(this.skillPath);
    return entries.filter(e => e.isDirectory());
  }
}
```

---

### 4. Skill Installer Module (`cli/src/installer/`)

**Responsibility**: File operations for skill installation

**Files**:
- `installer.ts` - Main installer
- `validator.ts` - Validate skill structure
- `rollback.ts` - Rollback on failure
- `backup.ts` - Backup existing skills

**Interface**:
```typescript
export interface InstallOptions {
  overwrite?: boolean;
  backup?: boolean;
  dryRun?: boolean;
}

export class SkillInstaller {
  async install(
    skill: Skill,
    targetPath: string,
    options?: InstallOptions
  ): Promise<InstallResult>;

  async validate(skill: Skill): Promise<ValidationResult>;
  async backup(targetPath: string): Promise<string>;
  async rollback(backupPath: string): Promise<void>;
}

export class SkillValidator {
  async validate(skill: Skill): Promise<ValidationResult>;
  validateFrontmatter(content: string): boolean;
  validateRequiredFiles(skill: Skill): boolean;
}
```

**Dependencies**: None (file system only)

**Error Handling**:
- Permission denied: Clear error message, suggest fix permissions
- Invalid skill: ValidationError with specific issues
- Disk full: Error before any changes (check space first)
- Rollback: Automatic on any failure

**Installation Flow**:
```
1. Validate skill structure
2. Check disk space
3. Backup existing skills (if any)
4. Copy skill files
5. Validate installation
6. Clean up backup (success)
   OR
6. Rollback (failure)
```

---

### 5. Resource Manager (`cli/src/resources/`)

**Responsibility**: Embed and serve static files at runtime

**Files**:
- `manager.ts` - Main resource manager
- `embedded/` - Embedded files directory
  - `skills/` - Skill files
  - `docs/` - Documentation (ONBOARDING.md)

**Interface**:
```typescript
export class ResourceManager {
  getSkill(skillName: string): Promise<Skill | undefined>;
  getOnboardingGuide(): Promise<string>;
  listSkills(): string[];
  async extractAll(targetDir: string): Promise<void>;
}
```

**Dependencies**: None

**Asset Embedding**:
```typescript
// Build-time embedding
import skills from "../embedded/skills" with { type: "file" };
import onboarding from "../embedded/docs/ONBOARDING.md" with { type: "file" };

// Runtime access
export class ResourceManager {
  getSkill(name: string): Skill {
    const skillPath = skills[`./${name}/SKILL.md`];
    return {
      name,
      sourcePath: skillPath,
      files: ['SKILL.md', 'template.md', 'examples/'],
    };
  }

  async getOnboardingGuide(): Promise<string> {
    return await Bun.file(onboarding).text();
  }
}
```

**Build-Time Generation**:
```typescript
// scripts/embed-resources.ts
const skills = [
  'dev-kit-init',
  'dev-kit-ticket',
  'dev-kit-research',
  'dev-kit-work',
  'dev-kit-refine',
  'dev-kit-review',
];

// Generate embedded skills manifest
for (const skill of skills) {
  const skillPath = `.claude/skills/${skill}/SKILL.md`;
  const content = await fs.readFile(skillPath, 'utf-8');
  await fs.write(`embedded/skills/${skill}.md`, content);
}
```

---

### 6. Commands Module (`cli/src/commands/`)

**Responsibility**: Implement CLI command handlers

**Files**:
- `init.ts` - Initialize dev-kit for agents
- `install-skills.ts` - Install specific skills
- `onboard.ts` - Display onboarding guide
- `config.ts` - Manage configuration
- `version.ts` - Show version
- `help.ts` - Show help

**Interface**:
```typescript
export class InitCommand implements CommandHandler {
  constructor(
    private agents: AgentRegistry,
    private config: ConfigManager,
    private resources: ResourceManager
  ) {}

  async execute(args: string[]): Promise<void> {
    // Implementation
  }
}
```

**Dependencies**: All other modules (orchestration layer)

---

## Data Structures

### Agent Metadata

```typescript
interface AgentMetadata {
  // Unique identifier
  name: string;

  // Human-readable name
  displayName: string;

  // Path to skill directory
  skillPath: string;

  // Is this agent supported?
  supported: boolean;

  // Why unsupported? (if applicable)
  unsupportedReason?: string;

  // Installation priority (1 = highest)
  priority: number;

  // Detected on this system?
  detected: boolean;
}
```

### Skill Metadata

```typescript
interface SkillMetadata {
  // Unique identifier (e.g., "dev-kit-init")
  name: string;

  // Human-readable description
  description: string;

  // Source path (embedded)
  sourcePath: string;

  // Target path (agent-specific)
  targetPath: string;

  // Required files/directories
  requiredFiles: string[];

  // Skill dependencies
  dependencies?: string[];

  // Compatible agents
  compatibleAgents: string[];

  // YAML frontmatter (parsed)
  frontmatter: {
    name?: string;
    description?: string;
    'argument-hint'?: string;
    'user-invocable'?: boolean;
    // ... other fields
  };
}
```

### User Configuration

```typescript
interface UserConfig {
  // Config version (for migrations)
  version: string;

  // User's preferred agents
  preferredAgents: string[];

  // Custom installation paths
  installationPaths: {
    [agentName: string]: string;
  };

  // CLI preferences
  preferences: {
    verbose: boolean;
    autoUpdate: boolean;
    colorOutput: boolean;
    confirmBeforeInstall: boolean;
  };

  // Last update check
  lastUpdateCheck?: string;

  // CLI version when config was created
  cliVersion: string;
}
```

### Install Result

```typescript
interface InstallResult {
  // Overall success
  success: boolean;

  // Successfully installed skills
  installedSkills: string[];

  // Skipped skills (already installed)
  skippedSkills: string[];

  // Failed skills with errors
  errors: Array<{
    skill: string;
    error: string;
  }>;

  // Rollback function
  rollback: () => Promise<void>;

  // Installation duration
  duration: number;
}
```

---

## Error Handling Strategy

### Error Categories

#### 1. User Errors (4xx)
**Cause**: Invalid input or user environment issues
**Action**: Clear message + suggestion

```typescript
class UserError extends Error {
  constructor(message: string, suggestion?: string) {
    super(message);
    this.name = 'UserError';
    this.suggestion = suggestion;
  }
}

// Examples:
new UserError(
  'Agent "foo" is not supported',
  'Supported agents: claude-code, github-copilot, cursor'
);

new UserError(
  'Permission denied: Cannot write to ~/.claude/skills/',
  'Fix permissions or run with appropriate privileges'
);
```

#### 2. System Errors (5xx)
**Cause**: File system, network, or runtime errors
**Action**: Error message + stack trace (if verbose)

```typescript
class SystemError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'SystemError';
    this.cause = cause;
  }
}

// Examples:
new SystemError(
  'Failed to copy skill files',
  new Error('Disk full')
);
```

#### 3. Validation Errors
**Cause**: Invalid skill structure or configuration
**Action**: List all validation issues

```typescript
interface ValidationError {
  field: string;
  issue: string;
  severity: 'error' | 'warning';
}

class ValidationResult {
  errors: ValidationError[] = [];
  warnings: ValidationError[] = [];

  isValid(): boolean {
    return this.errors.length === 0;
  }
}
```

### Error Handling Flow

```
Exception Caught
      │
      ▼
┌─────────────────┐
│ Identify Type   │
└─────────────────┘
      │
      ├─→ User Error → Show message + suggestion
      │
      ├─→ System Error → Log + show user-friendly message
      │
      └─→ Validation Error → List all issues
```

### Error Message Format

```bash
# User Error
✗ Error: Claude Code not detected

  → Claude Code skills directory not found at ~/.claude/skills/

  Fix:
    1. Install Claude Code from https://code.claude.com
    2. Run "claude-code" once to create directory structure
    3. Try again

# System Error
✗ Error: Failed to install skill

  → Permission denied: Cannot write to ~/.claude/skills/dev-kit-init/

  Debug Info (run with --verbose for details):
    Error: EACCES: permission denied

# Validation Error
✗ Error: Invalid skill structure

  Issues:
    • Missing required file: SKILL.md
    • Invalid YAML frontmatter: Missing 'name' field
    • Unsupported file: executable.sh (must be in scripts/)

  Fix:
    1. Check skill structure at /path/to/skill
    2. Ensure all required files are present
    3. Validate YAML frontmatter format
```

---

## Testing Strategy

### Unit Tests

**Framework**: Bun test (built-in)

**Coverage Target**: >80%

**Test Structure**:
```
cli/src/
├── core/
│   ├── router.test.ts
│   └── error-handler.test.ts
├── config/
│   ├── loader.test.ts
│   ├── validator.test.ts
│   └── migrator.test.ts
├── agents/
│   ├── agent-registry.test.ts
│   ├── claude-code.test.ts
│   ├── github-copilot.test.ts
│   └── cursor.test.ts
├── installer/
│   ├── installer.test.ts
│   ├── validator.test.ts
│   └── rollback.test.ts
└── resources/
    └── manager.test.ts
```

**Example Test**:
```typescript
import { describe, it, expect, beforeEach } from 'bun:test';
import { ClaudeCodeAgent } from './claude-code';
import { MockFileSystem } from '../test/mocks/fs';

describe('ClaudeCodeAgent', () => {
  let agent: ClaudeCodeAgent;
  let mockFs: MockFileSystem;

  beforeEach(() => {
    mockFs = new MockFileSystem();
    agent = new ClaudeCodeAgent(mockFs);
  });

  it('should detect Claude Code when skills directory exists', async () => {
    mockFs.existsSync.mockReturnValue(true);
    const detected = await agent.detect();
    expect(detected).toBe(true);
  });

  it('should verify valid skill installation', async () => {
    mockFs.readFile.mockReturnValue('---\nname: test\n---\nContent');
    const valid = await agent.verify('test');
    expect(valid).toBe(true);
  });

  it('should reject invalid skill', async () => {
    mockFs.readFile.mockReturnValue('No frontmatter');
    const valid = await agent.verify('test');
    expect(valid).toBe(false);
  });
});
```

### Integration Tests

**Focus**: Module interactions

**Test Scenarios**:
1. `dev-kit init claude-code` → Full installation flow
2. `dev-kit install-skills github-copilot` → Skill installation
3. `dev-kit onboard` → Resource serving
4. Config migration from old version
5. Rollback on installation failure

**Example**:
```typescript
describe('Init Command Integration', () => {
  it('should install all skills for Claude Code', async () => {
    const config = new ConfigManager();
    const agents = new AgentRegistry();
    const resources = new ResourceManager();
    const command = new InitCommand(agents, config, resources);

    await command.execute(['claude-code']);

    const installed = await agents.get('claude-code').getInstalledSkills();
    expect(installed).toContain('dev-kit-init');
    expect(installed).toContain('dev-kit-ticket');
  });
});
```

### E2E Tests

**Focus**: Complete user workflows

**Test Scenarios**:
1. Fresh install: Detect agent, install skills, verify
2. Update: Reinstall with --force, validate changes
3. Multi-agent: Install for multiple agents
4. Error recovery: Install fails, rollback, retry

### Performance Benchmarks

**Tool**: Bun's built-in benchmark

**Metrics**:
- Cold start time: <100ms
- Skill installation time: <500ms per skill
- Config load time: <50ms
- Memory usage: <100MB

---

## Build and Distribution

### Build Pipeline

```
Source Code
     │
     ▼
┌─────────────────┐
│ Resource Embed  │ ← Embed skills, docs
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ Type Check      │ ← tsc --noEmit
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ Compile         │ ← bun build --compile
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ Optimize        │ ← minify, bytecode
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ Sign            │ ← code sign (macOS/Windows)
└─────────────────┘
     │
     ▼
┌─────────────────┐
│ Package         │ ← .zip, .tar.gz
└─────────────────┘
```

### Build Script

```typescript
// scripts/build.ts
const targets = [
  { os: 'macos', arch: 'arm64', ext: '', bunTarget: 'bun-darwin-arm64' },
  { os: 'macos', arch: 'x64', ext: '', bunTarget: 'bun-darwin-x64' },
  { os: 'linux', arch: 'x64', ext: '', bunTarget: 'bun-linux-x64' },
  { os: 'linux', arch: 'arm64', ext: '', bunTarget: 'bun-linux-arm64' },
  { os: 'windows', arch: 'x64', ext: '.exe', bunTarget: 'bun-windows-x64' },
];

const version = '1.0.0';

for (const target of targets) {
  const outfile = `dist/dev-kit-${target.os}-${target.arch}${target.ext}`;

  // Use Bun's built-in shell execution (secure for build scripts with known values)
  await $`bun build --compile \
    --target=${target.bunTarget} \
    --minify \
    --sourcemap \
    --bytecode \
    --define BUILD_VERSION='"${version}"' \
    ./cli/src/cli.ts \
    --outfile ${outfile}`;

  console.log(`Built: ${outfile}`);
}
```

### Distribution Strategy

#### GitHub Releases

```
Release: dev-kit v1.0.0

Assets:
  ├── dev-kit-macos-arm64      (macOS Apple Silicon)
  ├── dev-kit-macos-x64        (macOS Intel)
  ├── dev-kit-linux-x64        (Linux x64)
  ├── dev-kit-linux-arm64      (Linux ARM64)
  └── dev-kit-windows-x64.exe  (Windows x64)

Installation:
  curl -sSL https://github.com/user/dev-kit/releases/download/v1.0.0/install.sh | bash
```

---

## Extension Points

### Adding New Agents

**Steps**:
1. Create agent implementation in `cli/src/agents/agents/new-agent.ts`
2. Implement `Agent` interface
3. Register in `AgentRegistry`
4. Add to supported agents list

**Example**:
```typescript
// agents/agents/new-agent.ts
export class NewAgent implements Agent {
  readonly name = 'new-agent';
  readonly displayName = 'New Agent';
  readonly skillPath = path.join(os.homedir(), '.new-agent', 'skills');
  readonly supported = true;

  async detect(): Promise<boolean> { /* ... */ }
  async install(skill: Skill): Promise<InstallResult> { /* ... */ }
  async verify(skillName: string): Promise<boolean> { /* ... */ }
  async uninstall(skillName: string): Promise<void> { /* ... */ }
  async getInstalledSkills(): Promise<string[]> { /* ... */ }
}

// agents/agent-registry.ts
export class AgentRegistry {
  constructor() {
    this.register(new ClaudeCodeAgent());
    this.register(new GitHubCopilotAgent());
    this.register(new CursorAgent());
    this.register(new NewAgent()); // ← New agent
  }
}
```

### Adding New Commands

**Steps**:
1. Create command handler in `cli/src/commands/new-command.ts`
2. Implement `CommandHandler` interface
3. Register in CLI router

**Example**:
```typescript
// commands/new-command.ts
export class NewCommand implements CommandHandler {
  constructor(
    private config: ConfigManager,
    private agents: AgentRegistry
  ) {}

  async execute(args: string[]): Promise<void> {
    // Implementation
  }
}

// cli.ts
import { NewCommand } from './commands/new-command';

program
  .command('new-command')
  .description('My new command')
  .action(async () => {
    const command = new NewCommand(config, agents);
    await command.execute(args);
  });
```

### Adding New Skills to Bundle

**Steps**:
1. Add skill to `.claude/skills/`
2. Re-run resource embedding script
3. Rebuild binary

**Example**:
```bash
# Add new skill
mkdir -p .claude/skills/dev-kit-foo
echo "# Skill content" > .claude/skills/dev-kit-foo/SKILL.md

# Re-embed resources
bun run scripts/embed-resources.ts

# Rebuild
bun run build
```

---

## Appendix: Sequence Diagrams

### Sequence: dev-kit init claude-code

```
User       CLI         Config      AgentRegistry   ClaudeCode    Installer
 │           │            │              │             │             │
 ├─init─────>│            │              │             │             │
 │           ├─load─────>│              │             │             │
 │           │<───────────┤              │             │             │
 │           ├─detect──────────────────>│             │             │
 │           │            │              ├─detect──────────────────>│
 │           │            │              │<─────────────────────────┤
 │           │<─────────────────────────┤             │             │
 │           ├─getSkills────────────────┤             │             │
 │           │            │              │             │             │
 │           ├─install─────────────────────install───>│             │
 │           │            │              │             │<────────────┤
 │           │            │              │             │             │
 │           │<─────────────────────────────────────────────────────┤
 │<──────────┤            │              │             │             │
```

### Sequence: Error and Rollback

```
User       CLI         Agent        Installer     FileSystem
 │           │            │             │             │
 ├─init─────>│            │             │             │
 │           ├─install──────────────────>│             │
 │           │            │             ├─copy───────>│
 │           │            │             │             │
 │           │            │             │<─ERROR──────┤
 │           │            │             │  (Disk full)│
 │           │            │             │             │
 │           │            │             ├─rollback───>│
 │           │            │             │  (delete)   │
 │           │            │             │<────────────┤
 │           │            │<────────────┤             │
 │           │<───────────┤             │             │
 │<─error────┤            │             │             │
```

---

## References

- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Bun File System APIs](https://bun.sh/docs/api/file-io)
- [Bun Compilation](https://bun.sh/docs/bundler/executables)
- [CLI Architecture Patterns](https://matthewminer.com/best-practices/cli-apps)
- [code-agent-integration-2025.md](/.dev-kit/knowledge/code-agent-integration-2025.md)
- [bun-single-file-executable-2025.md](/.dev-kit/knowledge/bun-single-file-executable-2025.md)
