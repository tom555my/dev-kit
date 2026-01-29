# Code Agent Integration Patterns (2025)

**Knowledge Version:** 1.0.0
**Last Updated:** 2025-01-28
**Target Audience:** CLI developers implementing multi-agent skill installation

## Summary

This knowledge file documents how to install dev-kit skills across four major AI coding agents: Claude Code, Cursor, OpenCode, and GitHub Copilot. Each agent has different integration patterns, file system requirements, and discovery mechanisms.

## Quick Reference Matrix

| Agent | Skill Location | File Format | Discovery Method | Auto-Install | Priority |
|-------|---------------|-------------|------------------|--------------|----------|
| **Claude Code** | `.claude/skills/<name>/SKILL.md` | YAML + Markdown | Automatic + Manual | Yes | High |
| **Cursor** | VS Code extensions | `.vsix` package | Marketplace/URL | Yes | Medium |
| **OpenCode** | Custom skills (TBD) | TBD | MCP/Memory | TBD | Low |
| **GitHub Copilot** | `.copilot-skills/<name>/SKILL.md` | YAML + Markdown | Automatic | Yes | High |

## Claude Code

### Skill Structure

Claude Code uses the **Agent Skills** open standard with extensions.

```
.claude/skills/<skill-name>/
├── SKILL.md              # Required: Main instructions
├── template.md           # Optional: Template for Claude to fill
├── examples/
│   └── sample.md         # Optional: Example outputs
└── scripts/
    └── helper.sh         # Optional: Executable scripts
```

### SKILL.md Format

**Required YAML Frontmatter:**

```yaml
---
name: skill-name          # Optional: defaults to directory name
description: What this skill does and when to use it  # Recommended
argument-hint: [arg]      # Optional: shown in autocomplete
disable-model-invocation: true  # Optional: prevent auto-trigger
user-invocable: false     # Optional: hide from / menu
allowed-tools: Read, Grep # Optional: tools Claude can use
model: claude-sonnet-4.5  # Optional: model override
context: fork             # Optional: run in subagent
agent: Explore            # Optional: which subagent type
hooks:                    # Optional: lifecycle hooks
  preCommand: ./scripts/setup.sh
---
```

**Markdown Content:**
- Reference content (inline knowledge)
- Task content (step-by-step workflows)
- Can use `$ARGUMENTS` substitution
- Keep under 500 lines (split large content to supporting files)

### Installation Locations

| Location | Path | Scope | Priority |
|----------|------|-------|----------|
| **Enterprise** | Managed settings | Organization | Highest |
| **Personal** | `~/.claude/skills/` | All projects | Medium |
| **Project** | `.claude/skills/` | Current project | Low |
| **Plugin** | `<plugin>/skills/` | Where enabled | Namespaced |

### Discovery Mechanisms

1. **Automatic Discovery:** Claude reads skill descriptions into context (15,000 char budget by default)
2. **Manual Invocation:** Users type `/skill-name [args]`
3. **Nested Directories:** Monorepo support - discovers skills in `packages/*/.claude/skills/`
4. **Priority:** Enterprise > Personal > Project

### Installation CLI Commands

```bash
# Personal installation (recommended for dev-kit)
mkdir -p ~/.claude/skills
cp -r ./skills/dev-kit-init ~/.claude/skills/

# Project-specific installation
mkdir -p .claude/skills
cp -r ./skills/dev-kit-init .claude/skills/

# Verify installation
ls -la ~/.claude/skills/dev-kit-init/SKILL.md
```

### File Permissions

- SKILL.md: Readable (644)
- Scripts: Executable (755) if Claude will run them
- No special ownership required

### Verification Test

```bash
# Test skill discovery
echo "What skills are available?" | claude-code

# Test manual invocation
claude-code /dev-kit-init
```

### Resources

- [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Agent Skills Engineering Blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Awesome Claude Skills](https://github.com/travisvn/awesome-claude-skills)

---

## Cursor

### Extension Model

Cursor is **built on VS Code**, so it supports the full VS Code extension ecosystem.

### Extension Structure

```
cursor-extension/
├── package.json          # Required: VS Code extension manifest
├── extension.js/ts       # Required: Main extension code
├── schemas/              # Optional: JSON schemas
└── README.md             # Required: Marketplace listing
```

### package.json Format

```json
{
  "name": "dev-kit-skills",
  "displayName": "dev-kit Skills",
  "description": "AI workflows for documentation and ticket generation",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.108.0"
  },
  "categories": ["Other", "Snippets"],
  "activationEvents": [],
  "contributes": {
    "commands": [
      {
        "command": "devKit.init",
        "title": "Initialize dev-kit"
      }
    ],
    "snippets": [
      {
        "language": "markdown",
        "path": "./snippets/dev-kit.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/user/dev-kit"
  }
}
```

### Installation Methods

1. **From Marketplace (future):**
   ```bash
   # Search and install via Cursor UI
   code --install-extension publisher.dev-kit-skills
   ```

2. **From URL:**
   ```bash
   # Install directly from GitHub release
   cursor --install-extension https://github.com/user/dev-kit/releases/download/v1.0.0/dev-kit.vsix
   ```

3. **Local Installation:**
   ```bash
   # Install from local .vsix file
   cursor --install-extension ./dev-kit-skills-1.0.0.vsix
   ```

### Building .vsix Package

```bash
# Using vsce (VS Code Extension Manager)
npm install -g @vscode/vsce
vsce package

# Output: dev-kit-skills-1.0.0.vsix
```

### Discovery Mechanism

- Extensions auto-activate based on `activationEvents`
- Commands appear in Command Palette (Cmd/Ctrl+Shift+P)
- Snippets appear in IntelliSense

### Limitations for dev-kit

**Challenge:** Cursor doesn't have native "Agent Skills" like Claude Code. Workarounds:

1. **Snippets Approach:** Embed skills as code snippets
2. **Commands Approach:** Create VS Code commands that generate text
3. **Webview Approach:** Full UI for skill management (complex)
4. **Documentation Approach:** Extension provides markdown files users can reference

**Recommended:** Start with **Commands + Snippets** approach.

### File Permissions

- `.vsix` file: Readable (644)
- Installation directory: `~/.cursor/extensions/` (managed by Cursor)

### Verification Test

```bash
# List installed extensions
cursor --list-extensions | grep dev-kit

# Test command
cursor --command devKit.init
```

### Resources

- [Extensions | Cursor Docs](https://cursor.com/docs/configuration/extensions)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [vsce Publishing Tool](https://github.com/microsoft/vscode-vsce)

---

## OpenCode

### Current Status (2025-01)

**Important:** OpenCode is an **open-source AI coding agent** that runs in the terminal, but as of January 2025, it does **not** have a standardized "skills" system like Claude Code Agent Skills.

### Extension Model

OpenCode appears to support:

1. **MCP (Model Context Protocol)** - For tool integrations
2. **Memory Systems** - For context persistence
3. **Custom Workflows** - Via configuration files

### Installation Approach (Tentative)

Since OpenCode doesn't have a documented skills system as of 2025-01-28, potential approaches:

**Option 1: MCP Server**
```bash
# Install dev-kit as an MCP server
opencode mcp install dev-kit
```

**Option 2: Configuration Files**
```bash
# Add dev-kit workflows to OpenCode config
mkdir -p ~/.opencode/workflows
cp ./workflows/* ~/.opencode/workflows/
```

**Option 3: Memory System**
```bash
# Store dev-kit instructions as memory
opencode memory import dev-kit-instructions.md
```

### Recommendation

**Status:** OpenCode support should be **deferred** until:
- Official skills/plugins documentation is available
- MCP integration patterns are standardized
- Community examples emerge

### Alternative: Wrapper Approach

Create a dev-kit CLI that OpenCode can invoke via Bash tool:

```bash
# OpenCode runs:
dev-kit init --agent opencode
```

This requires **no OpenCode-specific integration** - just CLI compatibility.

### Resources

- [OpenCode GitHub Repository](https://github.com/opencode-ai/opencode)
- [OpenCode Official Website](https://opencode.ai/)
- [YouTube: Custom Skills with MCP](https://www.youtube.com/watch?v=vHkLrDD2xrU)

---

## GitHub Copilot

### Agent Skills (New in 2025)

GitHub introduced **Agent Skills** in December 2025 as an open standard.

### Skill Structure

```
.copilot-skills/<skill-name>/
├── SKILL.md              # Required: Main instructions
├── resources/            # Optional: Supporting files
│   └── reference.md
└── scripts/              # Optional: Automation scripts
```

### SKILL.md Format

```yaml
---
name: dev-kit-init
description: Generate project documentation using dev-kit workflows
---

Your instructions here...
```

### Installation Locations

| Location | Path | Scope |
|----------|------|-------|
| **User** | `~/.copilot-skills/` | All repositories |
| **Repository** | `.copilot-skills/` | Current repo |
| **Organization** | Managed settings | Organization repos |

### Installation CLI Commands

```bash
# User-level installation
mkdir -p ~/.copilot-skills
cp -r ./skills/dev-kit-init ~/.copilot-skills/

# Repository-level installation
mkdir -p .copilot-skills
cp -r ./skills/dev-kit-init .copilot-skills/

# Verify
ls -la ~/.copilot-skills/dev-kit-init/SKILL.md
```

### Discovery Mechanism

1. **Automatic:** GitHub Copilot loads skills when contextually relevant
2. **Manual:** Users can invoke via Copilot Chat (UI-specific)
3. **VS Code Integration:** Skills appear in Copilot interface

### Requirements

- **VS Code 1.108+** with GitHub Copilot extension
- **Agent Skills enabled** in Copilot settings (experimental as of 2025-01)

### File Permissions

- SKILL.md: Readable (644)
- No special ownership required

### Verification Test

```typescript
// In VS Code with Copilot:
// 1. Open Copilot Chat
// 2. Ask: "What skills are available?"
// 3. Verify dev-kit skills appear
```

### Resources

- [GitHub Copilot Agent Skills Changelog](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
- [Customize GitHub Copilot Experience](https://github.com/skills/customize-your-github-copilot-experience)
- [Building Agents with GitHub Copilot SDK](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/building-agents-with-github-copilot-sdk-a-practical-guide-to-automated-tech-upda/4488948)

---

## Comparison Analysis

### Similarities

All four agents support:
- ✅ YAML frontmatter for metadata
- ✅ Markdown-based skill definitions
- ✅ Manual invocation
- ✅ Automatic loading (some conditions apply)
- ✅ File-based distribution

### Differences

| Aspect | Claude Code | Cursor | OpenCode | GitHub Copilot |
|--------|-------------|--------|----------|----------------|
| **Standard** | Agent Skills + | VS Code Ext | MCP (TBD) | Agent Skills |
| **Format** | SKILL.md | package.json | TBD | SKILL.md |
| **Discovery** | Description match | Extension API | TBD | Description match |
| **Scope** | Personal/Project | Global | Global | User/Repo |
| **Complexity** | Low | High | Unknown | Low |
| **Maturity** | High | High | Low | Medium |

### Integration Complexity Ranking

1. **Claude Code** - Easiest (direct file copy)
2. **GitHub Copilot** - Easy (direct file copy, similar to Claude)
3. **Cursor** - Medium (requires packaging as .vsix)
4. **OpenCode** - Blocked (no documented skills system)

---

## Implementation Strategy for dev-kit CLI

### Phase 1: Supported Agents (Immediate)

1. **Claude Code** - Full support
   - Detect: `~/.claude/skills/` exists
   - Install: Copy to `~/.claude/skills/` or `.claude/skills/`
   - Verify: Check SKILL.md frontmatter validity

2. **GitHub Copilot** - Full support
   - Detect: VS Code with Copilot extension installed
   - Install: Copy to `~/.copilot-skills/` or `.copilot-skills/`
   - Verify: Check SKILL.md frontmatter validity

### Phase 2: Future Support (Deferred)

3. **Cursor** - Package as VS Code extension
   - Requires: Build .vsix package
   - Install: `cursor --install-extension`
   - Complexity: Medium

4. **OpenCode** - Defer until documentation available
   - Fallback: Recommend using CLI via Bash tool
   - Tracking: Monitor OpenCode GitHub for skills API

### Detection Logic

```typescript
interface AgentConfig {
  name: string;
  detect: () => Promise<boolean>;
  skillPath: string;
  install: (skill: Skill) => Promise<void>;
  verify: (skillName: string) => Promise<boolean>;
}

const agents: AgentConfig[] = [
  {
    name: 'claude-code',
    detect: async () => {
      const home = os.homedir();
      return await fs.pathExists(`${home}/.claude/skills`);
    },
    skillPath: '~/.claude/skills',
    install: async (skill) => {
      const target = path.join(os.homedir(), '.claude', 'skills', skill.name);
      await fs.copy(skill.source, target);
    },
    verify: async (skillName) => {
      const skillFile = path.join(os.homedir(), '.claude', 'skills', skillName, 'SKILL.md');
      const content = await fs.readFile(skillFile, 'utf-8');
      return content.includes('---') && content.includes('name:');
    }
  },
  // ... similar for other agents
];
```

---

## Test Scenarios

### Scenario 1: Fresh Claude Code Installation

```bash
# Pre-condition: Claude Code installed, no skills
# Action: dev-kit init claude-code
# Expected:
#   - Skills copied to ~/.claude/skills/
#   - All SKILL.md files valid
#   - Claude Code recognizes skills
```

### Scenario 2: Update Existing Skills

```bash
# Pre-condition: dev-kit skills already installed
# Action: dev-kit init claude-code --force
# Expected:
#   - Old skills backed up
#   - New skills installed
#   - No conflicts
```

### Scenario 3: Multi-Agent Installation

```bash
# Pre-condition: Claude Code + GitHub Copilot installed
# Action: dev-kit init --all
# Expected:
#   - Skills installed for both agents
#   - No file conflicts
#   - Both agents verify skills
```

### Scenario 4: Unsupported Agent

```bash
# Pre-condition: OpenCode (no skills support)
# Action: dev-kit init opencode
# Expected:
#   - Clear error message
#   - Suggestion to use CLI directly
#   - Link to OpenCode documentation
```

---

## Open Questions

1. **OpenCode Integration:** When will OpenCode document a skills/plugins API?
2. **Skill Versioning:** How should CLI handle skill updates vs. existing installations?
3. **Conflict Resolution:** What if user has custom skill with same name as dev-kit skill?
4. **Remote Skills:** Should CLI support fetching skills from remote repository?
5. **Verification:** How to deeply test that agent actually loads skill (beyond file existence)?

---

## Sources

- [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Extensions | Cursor Docs](https://cursor.com/docs/configuration/extensions)
- [OpenCode GitHub Repository](https://github.com/opencode-ai/opencode)
- [GitHub Copilot Agent Skills Announcement](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
- [Bun Single-File Executables Documentation](https://bun.sh/docs/bundler/executables)
