# dev-kit CLI

A Node.js-based CLI tool for initializing dev-kit workflows across multiple AI coding agents (Claude Code, GitHub Copilot, Cursor, OpenCode).

## Quick Overview

The **dev-kit CLI** helps developers quickly set up dev-kit skills and workflows across different AI coding environments.

### Key Characteristics

- **Multi-Agent Support**: Claude Code, GitHub Copilot, Cursor, OpenCode
- **Node.js Runtime**: Compatible with Node.js 20+
- **Cross-Platform**: macOS, Linux, Windows
- **Extensible**: Easy to add new agents, commands, and skills
- **npm Distributed**: Install via npm or use with npx

## Installation

### Requirements

- **Node.js** >= 20.0.0

### Via npm (Global Installation)

```bash
npm install -g dev-kit-cli
```

This installs the `dev-kit` command globally on your system.

### Via npx (Without Installation)

```bash
npx dev-kit-cli --help
```

Use `npx dev-kit-cli` to run the CLI without installing it globally.

### Via pnpm

```bash
pnpm add -g dev-kit-cli
```

### Via yarn

```bash
yarn global add dev-kit-cli
```

## Usage

### Basic Commands

```bash
# Show help
dev-kit --help

# Show version
dev-kit --version

# Initialize dev-kit for a specific agent
dev-kit init claude-code

# Display onboarding guide
dev-kit onboard

# Initialize with options
dev-kit init github-copilot --force --verify
```

### Using npx

```bash
# Run without installing
npx dev-kit-cli init claude-code

# Show onboarding guide
npx dev-kit-cli onboard
```

### Common Workflows

#### Initialize for Claude Code

```bash
dev-kit init claude-code
```

This installs dev-kit skills to `~/.claude/skills/`.

#### Initialize for GitHub Copilot

```bash
dev-kit init github-copilot
```

This installs dev-kit skills to `~/.copilot-skills/`.

#### Display Onboarding Guide

```bash
dev-kit onboard
```

Displays the complete onboarding guide in your terminal.

---

### Advanced Usage

#### Non-Interactive Mode

Automate installations without prompts:

```bash
dev-kit init claude-code --yes
```

Useful for:
- CI/CD pipelines
- Automation scripts
- Docker containers
- Non-interactive environments

#### Force Reinstall

Overwrite existing skills:

```bash
dev-kit init claude-code --force
```

Use when:
- Updating to latest skills
- Fixing corrupted installations
- Resetting to defaults

#### Verify Installation

Verify skills after installation:

```bash
dev-kit init claude-code --verify
```

Checks that:
- All skill files exist
- Valid YAML frontmatter
- Correct file structure
- Agent can read skills

#### Debug Mode

Enable detailed logging:

```bash
dev-kit init claude-code --debug
```

Shows:
- Internal execution steps
- File operations
- Agent detection details
- Error stack traces

#### Initialize Multiple Agents

Set up dev-kit for multiple agents:

```bash
# Initialize for all installed agents
dev-kit init claude-code
dev-kit init github-copilot
dev-kit init cursor
```

Or use a loop:

```bash
# Initialize for all agents in one command
for agent in claude-code github-copilot cursor; do
  dev-kit init $agent --yes
done
```

---

### Integration Examples

#### In npm Scripts

Add dev-kit initialization to your project:

```json
{
  "scripts": {
    "postinstall": "dev-kit init claude-code --yes",
    "init:devkit": "dev-kit init claude-code",
    "init:devkit:all": "dev-kit init claude-code && dev-kit init github-copilot"
  }
}
```

Usage:

```bash
npm run init:devkit
npm run postinstall  # Runs automatically after npm install
```

#### In GitHub Actions

Use dev-kit in CI/CD workflows:

```yaml
name: Setup dev-kit

on: [push, pull_request]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dev-kit CLI
        run: npm install -g dev-kit-cli

      - name: Initialize dev-kit
        run: dev-kit init claude-code --yes --verbose
```

#### In Docker

Include dev-kit in Docker containers:

```dockerfile
FROM node:20-alpine

# Install dev-kit CLI
RUN npm install -g dev-kit-cli

# Initialize dev-kit
RUN dev-kit init claude-code --yes

# Continue with your application setup
WORKDIR /app
COPY . .
CMD ["npm", "start"]
```

#### In Shell Scripts

Create automated setup scripts:

```bash
#!/bin/bash
# setup-devkit.sh

set -e  # Exit on error

echo "🚀 Setting up dev-kit..."

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20+ required, found $NODE_VERSION"
  exit 1
fi

# Install dev-kit CLI
echo "📦 Installing dev-kit CLI..."
npm install -g dev-kit-cli

# Initialize for agents
echo "🔧 Initializing dev-kit for Claude Code..."
dev-kit init claude-code --yes --verify

echo "✅ dev-kit setup complete!"
echo "📚 Run 'dev-kit onboard' to see the guide"
```

Make executable and run:

```bash
chmod +x setup-devkit.sh
./setup-devkit.sh
```

---

### Workflow Integration

#### After Installing Claude Code

Automatically initialize dev-kit after installing Claude Code:

```bash
# Install Claude Code (example)
# ... follow Claude Code installation instructions ...

# Initialize dev-kit
npm install -g dev-kit-cli
dev-kit init claude-code
```

#### With Project Initialization

Add dev-kit initialization to your project setup:

```bash
# Clone your project
git clone https://github.com/user/my-project.git
cd my-project

# Install dependencies
npm install

# Initialize dev-kit
dev-kit init claude-code

# Start development
npm run dev
```

#### With Multiple Projects

Use dev-kit across multiple projects:

```bash
# Project 1
cd ~/projects/project-1
dev-kit init claude-code

# Project 2
cd ~/projects/project-2
dev-kit init claude-code  # Skills already installed, no action needed
```

---

### CI/CD Integration Examples

#### Jenkins Pipeline

```groovy
pipeline {
  agent any

  stages {
    stage('Setup') {
      steps {
        sh 'npm install -g dev-kit-cli'
        sh 'dev-kit init claude-code --yes'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
  }
}
```

#### GitLab CI

```yaml
stages:
  - setup
  - build

setup:
  stage: setup
  script:
    - npm install -g dev-kit-cli
    - dev-kit init claude-code --yes

build:
  stage: build
  script:
    - npm run build
```

#### Azure Pipelines

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '20.x'
  displayName: 'Install Node.js'

- script: |
    npm install -g dev-kit-cli
    dev-kit init claude-code --yes
  displayName: 'Install and initialize dev-kit'

- script: |
    npm run build
  displayName: 'Build project'
```

---

### Troubleshooting Examples

#### Debug Installation Issues

Enable debug mode to troubleshoot:

```bash
# Run with debug output
dev-kit init claude-code --debug

# Run with verbose and debug
dev-kit init claude-code --verbose --debug

# Save debug output to file
dev-kit init claude-code --debug 2>&1 | tee devkit-debug.log
```

#### Check Skill Installation

Verify skills are correctly installed:

```bash
# List installed skills
ls -la ~/.claude/skills/dev-kit.*

# Check skill structure
cat ~/.claude/skills/dev-kit.init/SKILL.md

# Test skill loading (in Claude Code)
# Ask: "List all available dev-kit skills"
```

#### Test with Environment Variables

Test different configurations:

```bash
# Test with debug logging
DEV_KIT_DEBUG=true dev-kit init claude-code

# Test with custom config dir
DEV_KIT_CONFIG_DIR=/tmp/devkit dev-kit init claude-code

# Test non-interactive mode
DEV_KIT_YES=true dev-kit init claude-code

# Test with JSON logging
DEV_KIT_LOG_FORMAT=json dev-kit init claude-code
```

---

## Architecture at a Glance

```
User Input → CLI Parser → Command Router → Handler → Results
                                          ↓
                              ┌───────────────────────┐
                              │   Core Modules        │
                              ├───────────────────────┤
                              │ • Config Manager      │
                              │ • Agent Registry      │
                              │ • Resource Manager    │
                              │ • Skill Installer     │
                              └───────────────────────┘
                                          ↓
                              ┌───────────────────────┐
                              │   Agent Implement.    │
                              ├───────────────────────┤
                              │ • Claude Code         │
                              │ • GitHub Copilot      │
                              │ • Cursor              │
                              │ • OpenCode (stub)     │
                              └───────────────────────┘
                                          ↓
                              ┌───────────────────────┐
                              │   File System         │
                              │ • ~/.claude/skills/   │
                              │ • ~/.copilot-skills/  │
                              │ • ~/.dev-kit/config   │
                              └───────────────────────┘
```

## Module Breakdown

### 1. Core Framework (`cli/src/core/`)
- **Responsibility**: Command parsing, routing, error handling
- **Key Components**: CLI parser, router, error handler
- **Dependencies**: None (foundation layer)

### 2. Config Module (`cli/src/config/`)
- **Responsibility**: Load, save, validate user configuration
- **Key Components**: Config model, loader, validator, migrator
- **Storage**: `~/.dev-kit/config.json`

### 3. Agent Registry (`cli/src/agents/`)
- **Responsibility**: Manage and execute agent operations
- **Key Components**: Agent interface, registry, agent implementations
- **Supported Agents**:
  - ✅ Claude Code (fully supported)
  - ✅ GitHub Copilot (fully supported)
  - ⚠️ Cursor (medium complexity - requires .vsix)
  - ❌ OpenCode (not supported - no API)

### 4. Skill Installer (`cli/src/installer/`)
- **Responsibility**: File operations for skill installation
- **Key Components**: Installer, validator, rollback, backup
- **Safety**: Automatic rollback on failure

### 5. Resource Manager (`cli/src/resources/`)
- **Responsibility**: Embed and serve static files
- **Key Components**: Manager, embedded skills, embedded docs
- **Assets**: 6 skills, onboarding guide

### 6. Commands (`cli/src/commands/`)
- **Responsibility**: Implement CLI command handlers
- **Commands**: `init`, `install-skills`, `onboard`, `config`, `--version`, `--help`

## Data Structures

### Core Interfaces

```typescript
// Agent - Interface all agents must implement
interface Agent {
  readonly name: AgentType;
  readonly displayName: string;
  readonly skillPath: string;
  readonly supported: boolean;

  detect(): Promise<boolean>;
  install(skill: Skill): Promise<InstallResult>;
  verify(skillName: string): Promise<boolean>;
  uninstall(skillName: string): Promise<void>;
  getInstalledSkills(): Promise<string[]>;
}

// Skill - Skill metadata and installation info
interface Skill {
  name: string;
  description?: string;
  sourcePath: string;
  targetPath: string;
  requiredFiles: string[];
  dependencies?: string[];
  compatibleAgents: AgentType[];
  frontmatter: SkillFrontmatter;
}

// UserConfig - User preferences and settings
interface UserConfig {
  version: string;
  preferredAgents: AgentType[];
  installationPaths: Partial<Record<AgentType, string>>;
  preferences: UserPreferences;
  lastUpdateCheck?: string;
  cliVersion: string;
}
```

## Command Structure

```bash
dev-kit
├── init [agent]              # Initialize dev-kit for agent
│   ├── --all                # All supported agents
│   ├── --force              # Overwrite existing
│   └── --verbose            # Detailed output
│
├── install-skills [agent]    # Install specific skills
│   ├── --skill <name>       # Install specific skill
│   └── --list               # List available
│
├── onboard                   # Display onboarding guide
│   ├── --format <type>      # Output format
│   └── --output <file>      # Save to file
│
├── config                    # Manage configuration
│   ├── get <key>            # Get config value
│   ├── set <key> <value>    # Set config value
│   └── --reset              # Reset to defaults
│
├── --version                 # Show version
└── --help                    # Show help
```

## Error Handling

### Error Categories

1. **UserError** (4xx): Invalid input or environment
   ```bash
   ✗ Error: Agent "foo" is not supported
     → Supported agents: claude-code, github-copilot, cursor
   ```

2. **SystemError** (5xx): File system or runtime errors
   ```bash
   ✗ Error: Failed to copy skill files
     → Debug Info (run with --verbose for details)
   ```

3. **ValidationError**: Invalid structure
   ```bash
   ✗ Error: Invalid skill structure
     Issues:
       • Missing required file: SKILL.md
       • Invalid YAML frontmatter
   ```

## Troubleshooting

### Common Issues and Solutions

#### Installation Issues

**Problem**: `EACCES: permission denied` when installing globally

```bash
✗ Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/dev-kit-cli'
```

**Solutions**:
1. Use a Node version manager (nvm, fnvm) instead of system Node:
   ```bash
   # Install nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

   # Install Node.js with nvm
   nvm install 20
   nvm use 20

   # Install CLI globally (without sudo)
   npm install -g dev-kit-cli
   ```

2. Fix npm permissions (not recommended):
   ```bash
   sudo chown -R $(whoami) ~/.npm
   sudo chown -R $(whoami) /usr/local/lib/node_modules
   ```

3. Use npx instead of global installation:
   ```bash
   npx dev-kit-cli <command>
   ```

---

**Problem**: `Cannot find module` or command not found after installation

```bash
✗ Error: command not found: dev-kit
```

**Solutions**:
1. Check npm global bin directory:
   ```bash
   npm config get prefix
   ```

2. Add npm global bin to your PATH:
   ```bash
   # For macOS/Linux (bash)
   echo 'export PATH=$(npm config get prefix)/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc

   # For macOS/Linux (zsh)
   echo 'export PATH=$(npm config get prefix)/bin:$PATH' >> ~/.zshrc
   source ~/.zshrc

   # For Windows (PowerShell)
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$(npm config get prefix)\bin", "User")
   ```

3. Verify installation:
   ```bash
   npm list -g dev-kit-cli
   which dev-kit  # or where dev-kit on Windows
   ```

---

#### Agent Detection Issues

**Problem**: `Agent not detected` or `Agent not installed`

```bash
✗ Error: Agent "claude-code" is not installed
  → Expected directory: ~/.claude
```

**Solutions**:
1. Verify agent installation:
   ```bash
   # Check Claude Code
   ls -la ~/.claude

   # Check GitHub Copilot
   ls -la ~/.copilot-skills

   # Check Cursor
   code --list-extensions | grep cursor
   ```

2. Install the agent:
   - **Claude Code**: Visit [https://code.claude.com](https://code.claude.com)
   - **GitHub Copilot**: Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
   - **Cursor**: Visit [https://cursor.sh](https://cursor.sh)

3. Run with verbose output to debug:
   ```bash
   dev-kit init claude-code --verbose
   ```

---

#### Skill Installation Issues

**Problem**: `Failed to copy skill files` or `Permission denied`

```bash
✗ Error: Failed to copy skill files
  → Debug Info: EACCES: permission denied, open '/home/user/.claude/skills/dev-kit.init/SKILL.md'
```

**Solutions**:
1. Check directory permissions:
   ```bash
   ls -la ~/.claude/skills/
   ```

2. Fix permissions:
   ```bash
   # Fix ownership
   sudo chown -R $(whoami) ~/.claude/skills/

   # Fix read/write permissions
   chmod -R u+rw ~/.claude/skills/
   ```

3. Use `--force` to overwrite existing skills:
   ```bash
   dev-kit init claude-code --force
   ```

---

**Problem**: `Skill already exists` error

```bash
✗ Warning: The following skills are already installed: dev-kit.init, dev-kit.ticket
  → Use --force to overwrite existing skills
```

**Solutions**:
1. Skip existing skills (default behavior):
   ```bash
   dev-kit init claude-code
   # CLI will prompt: "Do you want to skip existing skills? (y/N)"
   ```

2. Overwrite existing skills:
   ```bash
   dev-kit init claude-code --force
   ```

3. Manually uninstall old skills first:
   ```bash
   rm -rf ~/.claude/skills/dev-kit.*
   dev-kit init claude-code
   ```

---

#### Node.js Version Issues

**Problem**: `Node.js version too old`

```bash
✗ Error: Node.js version 18.0.0 is not supported (requires >= 20.0.0)
```

**Solutions**:
1. Check your Node.js version:
   ```bash
   node --version
   ```

2. Upgrade Node.js:
   ```bash
   # Using nvm (recommended)
   nvm install 20
   nvm use 20
   nvm alias default 20

   # Using fnm
   fnm install 20
   fnm use 20
   fnm default 20

   # Or download from nodejs.org
   # https://nodejs.org/
   ```

3. Verify version:
   ```bash
   node --version  # Should be v20.x.x or higher
   ```

---

#### Network Issues

**Problem**: `npm ERR! network` or timeout during installation

```bash
✗ npm ERR! network request failed
```

**Solutions**:
1. Check internet connection:
   ```bash
   ping registry.npmjs.org
   ```

2. Use npm mirror (China users):
   ```bash
   npm config set registry https://registry.npmmirror.com
   npm install -g dev-kit-cli
   ```

3. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install -g dev-kit-cli
   ```

4. Use verbose output to debug:
   ```bash
   npm install -g dev-kit-cli --verbose
   ```

---

### Getting Help

If you're still experiencing issues:

1. **Enable debug mode**:
   ```bash
   dev-kit <command> --debug
   ```

2. **Check logs**:
   - Debug logs show detailed execution information
   - Error messages include hints for resolution

3. **Search existing issues**:
   - [GitHub Issues](https://github.com/user/dev-kit/issues)

4. **Create a new issue**:
   - Include error messages
   - Include `--debug` output
   - Specify your OS and Node.js version
   - Share steps to reproduce

5. **Community support**:
   - GitHub Discussions
   - Documentation: [README](../README.md)

## FAQ (Frequently Asked Questions)

### General Questions

**Q: What is dev-kit?**

A: dev-kit is a development toolkit that provides AI-powered agent workflows for documentation generation, ticket creation, research, implementation, refinement, and code review. It helps streamline software development tasks with structured, repeatable workflows.

**Q: What AI agents does dev-kit support?**

A: Currently dev-kit supports:
- **Claude Code** (fully supported)
- **GitHub Copilot** (fully supported)
- **Cursor** (partially supported - requires .vsix extraction)
- **OpenCode** (not supported - no public API)

**Q: Do I need to install all supported agents?**

A: No. You only need to install the agent(s) you use. The CLI will automatically detect which agents are installed on your system and allow you to initialize dev-kit for those agents.

**Q: Is dev-kit free to use?**

A: Yes! dev-kit is open-source and licensed under the MIT License. However, you may need licenses for the AI agents you use (e.g., GitHub Copilot subscription).

---

### Installation & Usage

**Q: Should I install dev-kit globally or use npx?**

A: It depends on your use case:
- **Global installation** (`npm install -g dev-kit-cli`): Recommended if you use dev-kit frequently across multiple projects. Faster execution and shorter commands.
- **npx** (`npx dev-kit-cli`): Recommended for occasional use or trying out dev-kit. Always uses the latest version without manual updates.

**Q: How do I update dev-kit to the latest version?**

A: If you installed globally:
```bash
npm update -g dev-kit-cli
```

If using npx, it automatically uses the latest version. To clear the npx cache:
```bash
npx dev-kit-cli@latest --help
```

**Q: Can I use dev-kit with multiple agents on the same machine?**

A: Yes! You can initialize dev-kit for multiple agents:
```bash
dev-kit init claude-code
dev-kit init github-copilot
dev-kit init cursor
```

Each agent gets its own set of skills in its respective skills directory.

**Q: What skills does dev-kit install?**

A: dev-kit installs the following skills:
- `dev-kit.init` - Generate project documentation (PROJECT.md, TECH.md)
- `dev-kit.ticket` - Create structured work tickets
- `dev-kit.research` - Research and document technologies
- `dev-kit.work` - Execute work from tickets
- `dev-kit.refine` - Refine and verify documentation
- `dev-kit.review` - Review completed tickets

---

### Compatibility

**Q: Which operating systems does dev-kit support?**

A: dev-kit supports:
- **macOS** (Intel and Apple Silicon)
- **Linux** (Ubuntu, Debian, Fedora, etc.)
- **Windows** (Windows 10/11 with WSL or native Node.js)

**Q: What version of Node.js do I need?**

A: You need **Node.js 20.0.0 or higher**. Check your version:
```bash
node --version
```

If you have an older version, upgrade using nvm:
```bash
nvm install 20
nvm use 20
```

**Q: Does dev-kit work with TypeScript projects?**

A: Yes! dev-kit works with any project type (JavaScript, TypeScript, Python, Go, Rust, etc.). The workflows are language-agnostic and focus on documentation, tickets, and research.

**Q: Can I use dev-kit in a monorepo?**

A: Yes. Initialize dev-kit in the root of your monorepo. The skills and workflows will be available across all packages.

---

### Configuration

**Q: Where does dev-kit store configuration?**

A: dev-kit stores configuration in `~/.dev-kit/config.json` (user-level) and creates `.dev-kit/` directories in your projects (project-level).

**Q: Can I customize the skill installation path?**

A: Currently, skills are installed to agent-specific directories:
- Claude Code: `~/.claude/skills/`
- GitHub Copilot: `~/.copilot-skills/`
- Cursor: `~/.cursor/skills/`

Custom paths may be supported in future versions.

**Q: How do I uninstall dev-kit?**

A: To uninstall dev-kit globally:
```bash
npm uninstall -g dev-kit-cli
```

Then remove installed skills:
```bash
# Claude Code
rm -rf ~/.claude/skills/dev-kit.*

# GitHub Copilot
rm -rf ~/.copilot-skills/dev-kit.*

# Cursor
rm -rf ~/.cursor/skills/dev-kit.*

# Remove config
rm -rf ~/.dev-kit
```

---

### Troubleshooting

**Q: The CLI says "agent not detected" but I have it installed. What do I do?**

A: Try these steps:
1. Verify the agent installation directory exists:
   ```bash
   ls -la ~/.claude  # or ~/.copilot-skills
   ```

2. Run with verbose output:
   ```bash
   dev-kit init claude-code --verbose
   ```

3. Check if you're using the correct agent name:
   ```bash
   dev-kit --help
   ```

**Q: I'm getting "permission denied" errors. How do I fix this?**

A: See the [Troubleshooting](#troubleshooting) section above. Common solutions:
- Use a Node version manager (nvm) instead of system Node
- Fix directory permissions: `sudo chown -R $(whoami) ~/.claude/skills/`
- Use `--force` flag to overwrite existing files

**Q: The skills installed but my AI agent doesn't recognize them.**

A: Try these steps:
1. Restart your AI agent/IDE
2. Verify skill files exist:
   ```bash
   ls -la ~/.claude/skills/dev-kit.init/SKILL.md
   ```
3. Check that SKILL.md has valid YAML frontmatter
4. Run with `--verify` flag:
   ```bash
   dev-kit init claude-code --verify
   ```

---

### Advanced Usage

**Q: Can I create custom workflows?**

A: Yes! Workflows are defined as Markdown files with YAML frontmatter. Create a new workflow file in `~/.claude/skills/` and follow the format of existing dev-kit skills.

**Q: How do I contribute to dev-kit?**

A: We welcome contributions! See the [Contributing](#contributing) section below for details.

**Q: Can I integrate dev-kit into my CI/CD pipeline?**

A: While dev-kit is primarily designed for interactive AI agent usage, you can run CLI commands in CI/CD:
```yaml
# Example GitHub Actions step
- name: Initialize dev-kit
  run: npx dev-kit-cli init claude-code --yes
```

**Q: Does dev-kit collect telemetry or usage data?**

A: No. dev-kit is fully local and does not send any data to external servers. All workflows, skills, and documentation remain on your machine.

---

### Migration from Bun

**Q: I was using the Bun-based dev-kit CLI. How do I migrate?**

A: See the [Migration Guide](MIGRATION.md) for detailed instructions on migrating from the Bun version to the Node.js version.

**Q: Are there breaking changes from the Bun version?**

A: The Node.js version maintains feature parity with the Bun version. The main differences:
- Runtime: Node.js 20+ instead of Bun
- Package manager: npm/pnpm/yarn instead of bun
- Distribution: npm package instead of standalone binary
- Commands and behavior remain the same

---

### Security

**Q: Is dev-kit safe to use?**

A: Yes. dev-kit:
- Only installs skills to local directories
- Does not make network requests during normal operation
- Does not execute arbitrary code
- Does not collect or transmit data

**Q: Does dev-kit require any special permissions?**

A: dev-kit only requires:
- Write access to agent skills directories (`~/.claude/skills/`, etc.)
- Write access to `.dev-kit/` in your project
- Standard file system permissions

No elevated permissions (sudo/admin) are needed if using a Node version manager.

---

## Exit Codes

The dev-kit CLI uses the following exit codes to indicate success or failure:

### Success Codes

| Code | Meaning |
|------|---------|
| **0** | Success - Command completed successfully |

### Error Codes (1-100)

| Code | Category | Description | Example Scenarios |
|------|----------|-------------|-------------------|
| **1** | General Error | Unhandled error or exception | Unexpected runtime error |
| **2** | Usage Error | Invalid command usage | Missing required arguments |
| **3** | Invalid Agent | Agent not supported or not found | `dev-kit init invalid-agent` |
| **4** | Agent Not Installed | Agent detected but not installed | Agent directory doesn't exist |
| **5** | Permission Denied | Insufficient file system permissions | Cannot write to skills directory |
| **6** | Validation Error | Invalid configuration or skill structure | Malformed skill frontmatter |
| **7** | File Not Found | Required file or directory missing | SKILL.md not found |
| **8** | Network Error | Network request failed (rare) | npm registry timeout |

### User Errors (100-199)

| Code | Meaning |
|------|---------|
| **100** | Invalid input provided |
| **101** | Required argument missing |
| **102** | Invalid option/flag combination |
| **103** | User cancelled operation |

### System Errors (200-299)

| Code | Meaning |
|------|---------|
| **200** | File system error |
| **201** | I/O error |
| **202** | Runtime error |
| **203** | Dependency error |

### Installation Errors (300-399)

| Code | Meaning |
|------|---------|
| **300** | Installation failed |
| **301** | Verification failed |
| **302** | Rollback failed |
| **303** | Backup failed |

### Usage Examples

Check exit codes in scripts:

```bash
# Run command and check exit code
dev-kit init claude-code
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "Success!"
elif [ $EXIT_CODE -eq 5 ]; then
  echo "Permission denied - try fixing directory permissions"
else
  echo "Failed with exit code: $EXIT_CODE"
fi
```

In shell scripts:

```bash
# Exit on error
set -e

# Run command
dev-kit init claude-code || {
  echo "Installation failed with exit code $?"
  exit 1
}
```

In npm scripts:

```json
{
  "scripts": {
    "init:devkit": "dev-kit init claude-code || exit 1"
  }
}
```

---

## Environment Variables

The dev-kit CLI can be configured using environment variables. These variables control behavior, logging, and configuration.

### Logging Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DEV_KIT_LOG_LEVEL` | string | `info` | Set logging level: `debug`, `info`, `warn`, `error`, `silent` |
| `DEV_KIT_LOG_FORMAT` | string | `pretty` | Log format: `pretty`, `json`, `plain` |
| `DEV_KIT_DEBUG` | boolean | `false` | Enable debug mode (equivalent to `--debug` flag) |
| `DEV_KIT_VERBOSE` | boolean | `false` | Enable verbose output (equivalent to `--verbose` flag) |

### Configuration Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DEV_KIT_CONFIG_DIR` | string | `~/.dev-kit` | Path to dev-kit configuration directory |
| `DEV_KIT_CONFIG_FILE` | string | `config.json` | Name of configuration file |
| `DEV_KIT_SKILLS_DIR` | string | (auto-detected) | Override default skills directory |

### Behavior Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DEV_KIT_FORCE` | boolean | `false` | Force overwrites without prompting |
| `DEV_KIT_YES` | boolean | `false` | Auto-confirm all prompts (non-interactive mode) |
| `DEV_KIT_VERIFY` | boolean | `false` | Verify installations after completion |
| `DEV_KIT_NO_BACKUP` | boolean | `false` | Skip creating backups during installation |

### Agent-Specific Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DEV_KIT_CLAUDE_SKILLS_PATH` | string | `~/.claude/skills` | Override Claude Code skills path |
| `DEV_KIT_COPILOT_SKILLS_PATH` | string | `~/.copilot-skills` | Override GitHub Copilot skills path |
| `DEV_KIT_CURSOR_SKILLS_PATH` | string | `~/.cursor/skills` | Override Cursor skills path |

### Node.js Variables

Standard Node.js environment variables also affect the CLI:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Set to `test` for test mode, `production` for production optimizations |
| `NODE_DEBUG` | Enable Node.js debug output |

### Usage Examples

Set environment variables in shell:

```bash
# Enable debug logging
export DEV_KIT_DEBUG=true
dev-kit init claude-code

# Set custom config directory
export DEV_KIT_CONFIG_DIR=/opt/dev-kit
dev-kit init claude-code

# Non-interactive mode
export DEV_KIT_YES=true
dev-kit init claude-code

# JSON logging for scripts
export DEV_KIT_LOG_FORMAT=json
dev-kit init claude-code
```

Use with commands:

```bash
# Set log level for single command
DEV_KIT_LOG_LEVEL=debug dev-kit init claude-code

# Multiple variables
DEV_KIT_VERBOSE=true DEV_KIT_VERIFY=true dev-kit init claude-code
```

In `.env` file (create in your project root):

```bash
# .env
DEV_KIT_LOG_LEVEL=debug
DEV_KIT_CONFIG_DIR=~/.dev-kit
DEV_KIT_YES=true
```

Load and use:

```bash
# Install dotenv (if not already installed)
npm install dotenv

# Load in script
node -r dotenv/config -e "console.log(process.env.DEV_KIT_LOG_LEVEL)"
```

In package.json scripts:

```json
{
  "scripts": {
    "init:devkit": "DEV_KIT_YES=true dev-kit init claude-code",
    "init:devkit:debug": "DEV_KIT_DEBUG=true dev-kit init claude-code",
    "init:devkit:verify": "DEV_KIT_VERIFY=true dev-kit init claude-code"
  }
}
```

### Environment Variable Precedence

Environment variables are resolved in this order (highest to lowest priority):

1. **Command-line flags** (e.g., `--debug`, `--force`)
2. **Environment variables** (e.g., `DEV_KIT_DEBUG`)
3. **Configuration file** (`~/.dev-kit/config.json`)
4. **Default values**

Example: If you set `DEV_KIT_DEBUG=true` but also pass `--no-debug` flag, the flag takes precedence.

### Debugging Environment Variables

Check which environment variables are set:

```bash
# Unix/Linux/macOS
env | grep DEV_KIT

# Windows PowerShell
Get-ChildItem Env: | Where-Object {$_.Name -like "DEV_KIT*"}

# Windows CMD
set DEV_KIT
```

Test environment variable configuration:

```bash
# Run with debug output
DEV_KIT_DEBUG=true dev-kit init claude-code

# Check config directory
echo $DEV_KIT_CONFIG_DIR  # Unix/Linux/macOS
echo %DEV_KIT_CONFIG_DIR% # Windows CMD
```

---

## Design Principles

1. **Separation of Concerns**: Each module has single responsibility
2. **Interface-Based Design**: Depend on abstractions, not concretions
3. **Fail-Fast**: Catch errors early with clear messages
4. **Immutable Config**: Read-only after load
5. **Asset Embedding**: All files embedded at build time

## Testing Strategy

```
                    E2E Tests (5%)
                   ┌────────────┐
                   │  Complete  │
                   │ Workflows  │
                   └────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
        ┌─────┴─────┐         ┌─────┴─────┐
        │Integration│         │  Property │
        │  (15%)    │         │  Tests    │
        └─────┬─────┘         └───────────┘
              │
        ┌─────┴────────┐
        │              │
   ┌────┴────┐   ┌─────┴─────┐
   │  Unit   │   │Benchmark  │
   │  (80%)  │   │           │
   └─────────┘   └───────────┘
```

- **Target Coverage**: >80%
- **Framework**: Vitest
- **Performance**: <100ms cold start, <500ms install per skill

## Build Process

```
Source → Type Check → Bundle with tsup → Generate Types → Package
```

### Development Commands

```bash
# Type checking
pnpm typecheck

# Build
pnpm build

# Run tests
pnpm test

# Development mode
pnpm dev
```

### Installation

### Requirements

- **Node.js** >= 20.0.0

### Via npm

```bash
npm install -g dev-kit-cli
```

### Via GitHub release

```bash
# Download the appropriate binary for your platform
wget https://github.com/user/dev-kit/releases/latest/download/dev-kit-macos-arm64
chmod +x dev-kit-macos-arm64
mv dev-kit-macos-arm64 /usr/local/bin/dev-kit
```

### Development Setup

```bash
# Clone repository
git clone https://github.com/user/dev-kit.git
cd dev-kit/cli

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build
```

## File Structure

```
cli/
├── ARCHITECTURE.md          # Detailed architecture doc
├── DIAGRAMS.md              # Visual diagrams
├── README.md                # This file
├── src/
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts         # All type definitions
│   ├── core/                # Core framework (DKIT-005)
│   ├── config/              # Config management (DKIT-005)
│   ├── agents/              # Agent implementations (DKIT-005)
│   ├── installer/           # Skill installer (DKIT-006)
│   ├── resources/           # Resource manager (DKIT-009)
│   └── commands/            # Command handlers (DKIT-007, DKIT-008)
├── scripts/
│   ├── embed-resources.ts   # Embed skills/docs (DKIT-009)
│   └── build.ts             # Build pipeline (DKIT-010)
└── embedded/                # Generated at build time
    ├── skills/              # Skill files
    └── docs/                # Documentation
```

## Extension Points

### Adding a New Agent

```typescript
// 1. Create agent implementation
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

// 2. Register in AgentRegistry
registry.register(new NewAgent());
```

### Adding a New Command

```typescript
// 1. Create command handler
export class NewCommand implements CommandHandler {
  async execute(args: string[]): Promise<void> {
    // Implementation
  }
}

// 2. Register in CLI router
program
  .command('new-command')
  .description('My new command')
  .action(async () => {
    await command.execute(args);
  });
```

## Implementation Tickets

This architecture serves as the blueprint for:

- **DKIT-005**: Implement CLI Framework with Agent Abstraction
- **DKIT-006**: Implement Skill Installer Module
- **DKIT-007**: Implement `dev-kit init` Command
- **DKIT-008**: Implement `dev-kit onboard` Command
- **DKIT-009**: Implement Static Resource Embedding
- **DKIT-010**: Implement Node.js Build Pipeline

## References

- **Detailed Architecture**: `cli/ARCHITECTURE.md`
- **Visual Diagrams**: `cli/DIAGRAMS.md`
- **Type Definitions**: `cli/src/types/index.ts`
- **Agent Integration Research**: `.dev-kit/knowledge/code-agent-integration-2025.md`

## Next Steps

1. ✅ Design complete architecture (DKIT-004)
2. ⏳ Implement CLI framework and agent abstraction (DKIT-005)
3. ⏳ Implement skill installer module (DKIT-006)
4. ⏳ Implement commands (DKIT-007, DKIT-008)
5. ⏳ Implement resource embedding (DKIT-009)
6. ⏳ Implement build pipeline (DKIT-010)
7. ⏳ Write tests (DKIT-011)
8. ⏳ Add documentation (DKIT-012)

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/user/dev-kit.git
cd dev-kit/cli

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Run tests
pnpm test

# Run type checking
pnpm typecheck

# Build for production
pnpm build
```

### Making Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure tests pass before submitting
- Update documentation as needed

### Submitting Issues

If you find a bug or have a feature request:

1. Check existing issues first
2. Use the issue template if available
3. Provide clear steps to reproduce for bugs
4. Explain the use case for feature requests

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/user/dev-kit/issues)
- **Documentation**: [README](../README.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTUE.md)
