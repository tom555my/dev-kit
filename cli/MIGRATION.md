# Migration Guide: Bun to Node.js

This guide helps you migrate from the Bun-based dev-kit CLI to the Node.js-based CLI.

## Overview

The dev-kit CLI has been migrated from **Bun** to **Node.js** to improve compatibility, distribution, and ecosystem integration. This guide walks you through the migration process.

### Key Changes

| Aspect | Bun Version | Node.js Version |
|--------|-------------|-----------------|
| **Runtime** | Bun | Node.js 20+ |
| **Package Manager** | Bun | npm, pnpm, or yarn |
| **Distribution** | Standalone binary | npm package |
| **Installation** | Download binary | `npm install -g dev-kit-cli` |
| **Updates** | Re-download binary | `npm update -g dev-kit-cli` |
| **Commands** | Same | Same (full parity) |
| **Behavior** | Same | Same (full parity) |

---

## Migration Steps

### Step 1: Uninstall Bun Version

Remove the Bun-based CLI:

```bash
# If installed globally with Bun
bun uninstall -g dev-kit-cli

# If installed as standalone binary
rm /usr/local/bin/dev-kit  # or wherever you installed it

# Remove Bun installation (if only used for dev-kit)
# See: https://bun.sh/docs/install/uninstall
```

Verify removal:

```bash
which dev-kit
# Should return: "dev-kit not found" or similar
```

---

### Step 2: Install Node.js

Ensure you have Node.js 20.0.0 or higher installed.

Check current version:

```bash
node --version
```

If Node.js is not installed or version is < 20:

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
nvm alias default 20

# Using fnm (fast Node manager)
curl -fsSL https://fnm.vercel.app/install | bash
fnm install 20
fnm use 20
fnm default 20

# Or download from nodejs.org
# https://nodejs.org/
```

Verify installation:

```bash
node --version  # Should be v20.x.x or higher
npm --version
```

---

### Step 3: Install Node.js CLI

Install the new Node.js-based dev-kit CLI:

#### Option 1: Global Installation (Recommended)

```bash
npm install -g dev-kit-cli
```

#### Option 2: Use pnpm

```bash
pnpm add -g dev-kit-cli
```

#### Option 3: Use yarn

```bash
yarn global add dev-kit-cli
```

#### Option 4: Use npx (No Installation)

```bash
npx dev-kit-cli <command>
```

Verify installation:

```bash
dev-kit --version
# Should output version number
```

---

### Step 4: Re-initialize Skills

The skill installation paths remain the same, but you should re-install skills to ensure compatibility:

```bash
# For Claude Code
dev-kit init claude-code

# For GitHub Copilot
dev-kit init github-copilot

# For Cursor
dev-kit init cursor

# For all agents (if you have multiple)
dev-kit init claude-code
dev-kit init github-copilot
dev-kit init cursor
```

Use `--force` if skills already exist:

```bash
dev-kit init claude-code --force
```

---

### Step 5: Verify Installation

Test that the CLI works correctly:

```bash
# Show version
dev-kit --version

# Show help
dev-kit --help

# List available commands
dev-kit --help

# Test init command (dry run)
dev-kit init claude-code --help
```

Verify skills are installed:

```bash
# Claude Code skills
ls -la ~/.claude/skills/dev-kit.*

# GitHub Copilot skills
ls -la ~/.copilot-skills/dev-kit.*

# Cursor skills
ls -la ~/.cursor/skills/dev-kit.*
```

---

## What's Changed

### Breaking Changes

**None!** The Node.js version maintains full feature parity with the Bun version. All commands, options, and behaviors remain the same.

### New Features

The Node.js version includes several improvements:

1. **Better npm Integration**: Published to npm registry for easier installation and updates

2. **Environment Variable Support**: More configuration options via environment variables (see [README.md](README.md#environment-variables))

3. **Improved Error Messages**: Enhanced error reporting with hints for resolution

4. **Cross-Platform Compatibility**: Better support for Windows (both native and WSL)

5. **Standard Exit Codes**: Consistent exit codes for scripting (see [README.md](README.md#exit-codes))

### Removed Features

No features have been removed. If something is missing, please [open an issue](https://github.com/user/dev-kit/issues).

---

## Feature Parity Matrix

| Feature | Bun Version | Node.js Version | Notes |
|---------|-------------|-----------------|-------|
| `init` command | ✅ | ✅ | Full parity |
| `onboard` command | ✅ | ✅ | Full parity |
| Claude Code support | ✅ | ✅ | Full parity |
| GitHub Copilot support | ✅ | ✅ | Full parity |
| Cursor support | ✅ | ✅ | Full parity |
| OpenCode support | ❌ | ❌ | Not supported (no API) |
| Agent detection | ✅ | ✅ | Full parity |
| Skill installation | ✅ | ✅ | Full parity |
| Verification (`--verify`) | ✅ | ✅ | Full parity |
| Force overwrite (`--force`) | ✅ | ✅ | Full parity |
| Non-interactive mode (`--yes`) | ✅ | ✅ | Full parity |
| Verbose logging (`--verbose`) | ✅ | ✅ | Full parity |
| Debug mode (`--debug`) | ✅ | ✅ | Enhanced |

---

## Configuration Migration

### Environment Variables

If you used environment variables with the Bun version, update them:

```bash
# Old (Bun version)
DEV_KIT_BUN_VAR=value

# New (Node.js version - see README.md for full list)
DEV_KIT_LOG_LEVEL=debug
DEV_KIT_CONFIG_DIR=~/.dev-kit
DEV_KIT_YES=true
```

See [Environment Variables](README.md#environment-variables) in the README for the complete list.

### Configuration File

The configuration file location and format remain the same:

- **Location**: `~/.dev-kit/config.json`
- **Format**: JSON (unchanged)

No migration needed for configuration files.

---

## Troubleshooting

### Issue: "command not found: dev-kit"

**Cause**: npm global bin directory not in PATH

**Solution**:

```bash
# Check npm prefix
npm config get prefix

# Add to PATH (macOS/Linux - zsh)
echo 'export PATH=$(npm config get prefix)/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# Add to PATH (macOS/Linux - bash)
echo 'export PATH=$(npm config get prefix)/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

See [Troubleshooting](README.md#troubleshooting) in the README for more details.

---

### Issue: "Permission denied" when installing globally

**Cause**: Attempting to install to system directory without permissions

**Solution**:

1. Use a Node version manager (nvm/fnm) instead of system Node:
   ```bash
   nvm install 20
   npm install -g dev-kit-cli
   ```

2. Or fix npm permissions:
   ```bash
   sudo chown -R $(whoami) ~/.npm
   sudo chown -R $(whoami) /usr/local/lib/node_modules
   ```

3. Or use npx instead of global installation:
   ```bash
   npx dev-kit-cli <command>
   ```

---

### Issue: Skills not recognized by AI agent

**Cause**: AI agent needs restart after skill installation

**Solution**:

1. Restart your AI agent/IDE
2. Verify skill files exist:
   ```bash
   ls -la ~/.claude/skills/dev-kit.init/SKILL.md
   ```
3. Re-install with verification:
   ```bash
   dev-kit init claude-code --force --verify
   ```

---

### Issue: "Node.js version too old"

**Cause**: Node.js version < 20.0.0

**Solution**:

```bash
# Check current version
node --version

# Upgrade using nvm
nvm install 20
nvm use 20
nvm alias default 20
```

---

## Rollback

If you need to rollback to the Bun version:

### Step 1: Uninstall Node.js Version

```bash
npm uninstall -g dev-kit-cli
```

### Step 2: Reinstall Bun Version

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install dev-kit CLI with Bun
# (Use the previous installation method)
```

### Step 3: Verify

```bash
dev-kit --version
```

---

## FAQ

**Q: Do I need to migrate my existing skills?**

A: No. Skills remain in the same location and work with both versions. However, we recommend re-installing with `--force` to ensure compatibility.

**Q: Will my configuration be preserved?**

A: Yes. Configuration in `~/.dev-kit/config.json` is compatible with both versions.

**Q: Can I have both versions installed?**

A: It's not recommended. Uninstall the Bun version before installing the Node.js version to avoid conflicts.

**Q: Is the Node.js version slower than the Bun version?**

A: Performance is comparable. The Node.js version has been optimized and includes performance benchmarks. Cold start is <100ms, skill installation is <500ms per skill.

**Q: Do I need to update my scripts or CI/CD pipelines?**

A: If you use the `dev-kit` command directly, no changes needed. If you reference the binary path or use Bun-specific commands, update to use `npx dev-kit-cli` or the globally installed `dev-kit` command.

**Q: What if I find a bug or issue?**

A: Please [open an issue](https://github.com/user/dev-kit/issues) with:
- Error messages
- `--debug` output
- Your OS and Node.js version
- Steps to reproduce

---

## Support

If you encounter issues during migration:

1. Check the [Troubleshooting](README.md#troubleshooting) section in the README
2. Review the [FAQ](README.md#faq-frequently-asked-questions)
3. Search [existing GitHub issues](https://github.com/user/dev-kit/issues)
4. [Open a new issue](https://github.com/user/dev-kit/issues/new)

---

## Summary

| Step | Action |
|------|--------|
| 1 | Uninstall Bun version |
| 2 | Install Node.js 20+ |
| 3 | Install Node.js CLI (`npm install -g dev-kit-cli`) |
| 4 | Re-initialize skills (`dev-kit init <agent>`) |
| 5 | Verify installation (`dev-kit --version`) |

The migration process should take less than 5 minutes. All commands, behaviors, and configurations remain the same.

Welcome to the Node.js version of dev-kit! 🎉
