# npx skills CLI (2025)

## Overview

npx skills is a package manager and distribution tool for AI agent skills, described as "npm for AI Agents." It enables developers to install, manage, and share reusable agent workflows across multiple AI coding assistants including Claude Code, OpenCode, Cursor, Codex, and 30+ other tools.

**Repository**: [vercel-labs/skills](https://github.com/vercel-labs/skills)
**Purpose**: Open agent skills ecosystem and distribution
**Year**: 2025

## Key Concepts

### Skill Package
A **skill** is a self-contained agent workflow with:
- `SKILL.md`: Skill definition with name, description, and workflow
- Optional assets: templates, examples, scripts
- Standardized structure for AI agent execution
- Installable via npm/GitHub

### Installation Scopes
- **Project-level**: Skills installed to `.claude/skills/` (project-specific)
- **Global**: Skills installed to `~/.claude/skills/` (available across all projects)
- **Namespace**: Skills follow `owner/repo` naming (e.g., `tom555my/dev-kit`)

### Agent Compatibility
Skills work across multiple AI agents:
- Claude Code (primary)
- OpenCode
- Cursor
- Codex
- And 30+ other tools

## Best Practices

### Installing Skills

**Install all skills from a package**:
```bash
npx skills add owner/repo
# Example: npx skills add tom555my/dev-kit
```

**Install specific skills only**:
```bash
npx skills add owner/repo --skill skill-name --skill another-skill
# Example: npx skills add tom555my/dev-kit --skill dev-kit.init --skill dev-kit.ticket
```

**Global installation** (recommended for personal toolkits):
```bash
npx skills add owner/repo -g
```

**List skills before installing**:
```bash
npx skills add owner/repo --list
```

**Force update/reinstall**:
```bash
npx skills add owner/repo --force
```

### Creating Skill Packages

1. **Create skill structure**:
```bash
mkdir -p .claude/skills/my-skill
cd .claude/skills/my-skill
```

2. **Write SKILL.md**:
```markdown
---
name: my-skill
description: "Brief description of when to use this skill"
---

You are a <role>. Use the user-provided inputs to <action>.

## Workflow
1. Step 1
2. Step 2

## Quality Rules
- Rule 1
- Rule 2

## Inputs
- input1 (required): Description
- input2 (optional): Description

## Output
- What the skill produces

<user-request>
$ARGUMENTS
</user-request>
```

3. **Publish to npm or GitHub**:
```bash
npm publish
# Or push to GitHub repository
```

### Organizing Skills

**For project-specific workflows**:
- Install to project: `.claude/skills/`
- Include in version control
- Document in team README

**For personal toolkits**:
- Install globally: `~/.claude/skills/`
- Keep private repos or public npm packages
- Share with team via GitHub

**For public distribution**:
- Use semantic versioning
- Provide clear descriptions
- Include examples in README
- Tag with relevant topics

## Implementation Tips

### Skill Invocation Pattern

Skills are invoked via forward slash:
```
/skill-name arguments
```

Example:
```
/dev-kit.init Build a Next.js blog with TypeScript
/dev-kit.ticket Implement user authentication
/dev-kit.research Next.js 16 caching
```

### Package.json Configuration

For distributing skill packages:
```json
{
  "name": "@owner/skill-package",
  "version": "1.0.0",
  "description": "Collection of AI agent skills",
  "files": [
    ".claude/skills/*"
  ],
  "keywords": ["claude-code", "skills", "ai-agent"]
}
```

### Team Workflow

**Setup team skills**:
1. Create organization repository (e.g., `mycompany/dev-skills`)
2. Add team skills to `.claude/skills/`
3. Team members install: `npx skills add mycompany/dev-skills -g`
4. Update skills via `--force` flag

**Version management**:
1. Tag releases in git
2. Update package.json version
3. Team pulls updates with `--force`
4. Document breaking changes

### CI/CD Integration

**Format code with skills**:
```yaml
- name: Generate documentation
  run: npx skills add company/docs -g && echo "/dev-kit.init auto" | claude-code
```

**Check skills installed**:
```bash
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

## Common Pitfalls

### Skill Not Found
- **Issue**: Skill not invoked by AI agent
- **Solution**: Verify skill path, check SKILL.md format, restart AI agent
- **Debug**: Check `.claude/skills/` directory exists and contains skill

### Version Conflicts
- **Issue**: Old skill version still used after update
- **Solution**: Use `--force` flag, clear AI agent cache
- **Prevent**: Pin versions in package.json

### Global vs Project Scope Confusion
- **Issue**: Skill installed in wrong location
- **Solution**: Use `-g` flag for global, omit for project
- **Check**: `ls -la ~/.claude/skills/` vs `ls -la .claude/skills/`

### Skill Dependencies
- **Issue**: Skill requires other skills or tools
- **Solution**: Document in skill description, check in workflow
- **Pattern**: Auto-install prerequisites in skill workflow

### Private Repository Access
- **Issue**: Can't install skills from private repos
- **Solution**: Configure npm auth, GitHub tokens, or SSH keys
- **Workaround**: Manual copy to `.claude/skills/`

## Ecosystem Tools

### Alternative Tools
- **add-skill**: [`npx add-skill`](https://add-skill.org/) - Universal skill installer
- **OpenSkills**: Universal skills loader for AI coding assistants
- Both compatible with npx skills ecosystem

### Complementary Tools
- **Claude Code**: Primary execution environment
- **MCP Servers**: Model Context Protocol for tool extensions
- **Hooks**: Custom triggers for skill execution

## References

- [Official GitHub](https://github.com/vercel-labs/skills)
- [add-skill CLI](https://add-skill.org/)
- [Claude Code Docs](https://code.claude.com/docs/en/quickstart)
- [Complete Guide to Claude Code V2](https://www.reddit.com/r/ClaudeAI/comments/1qcwckg/the_complete_guide_to_claude_code_v2_claudemd_mcp/)
- [Skill CLI Medium Article](https://kotrotsos.medium.com/claude-skill-cli-b22b244171e0)
- [Agentic Development in 2026](https://dev.to/chand1012/the-best-way-to-do-agentic-development-in-2026-14mn)

## Version-Specific Notes (2025)

- Released: January 2025
- Supports 30+ AI coding assistants
- Part of VoidZero ecosystem (along with Oxc tools)
- Active development with frequent updates
- Community-driven skill marketplace emerging

## Migration Checklist

When adopting npx skills for your team:

- [ ] Identify reusable workflows in your team
- [ ] Create skill packages for common patterns
- [ ] Publish to npm or private GitHub repo
- [ ] Document skill usage in team wiki
- [ ] Install skills globally for team members
- [ ] Create onboarding guide with skill examples
- [ ] Version skills with semantic versioning
- [ ] Establish update process (frequency, communication)
- [ ] Monitor skill usage and effectiveness
- [ ] Contribute back to public ecosystem when applicable
