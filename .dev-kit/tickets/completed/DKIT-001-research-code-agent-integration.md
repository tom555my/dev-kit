---
title: Research Code Agent Integration Patterns
category: Research
---

## User Story

- As a CLI developer, I need to understand how dev-kit skills integrate with different code agents (Claude Code, Cursor, OpenCode, GitHub Copilot), so that I can build a CLI that correctly installs skills for each agent's specific requirements.

## Acceptance Criteria

- Document Claude Code skill installation process (`.claude/skills/` directory structure, SKILL.md format, required metadata)
- Document Cursor skill/integration requirements and installation method
- Document OpenCode skill/integration requirements and installation method
- Document GitHub Copilot skill/integration requirements and installation method
- Create a comparison matrix showing differences between agent integration approaches
- Identify any agent-specific configuration files or metadata requirements
- Research skill discovery mechanisms for each agent (how agents find and load skills)
- Document any file permission or directory placement constraints for each agent
- Create test scenarios for verifying skill installation on each agent

## References

- [Claude Code Skills Documentation](https://github.com/anthropics/claude-code)
- [Cursor Documentation](https://cursor.sh/docs)
- [OpenCode Documentation](https://github.com/opencodeorg/opencode)
- [GitHub Copilot Extensions Documentation](https://docs.github.com/en/copilot)
- [dev-kit Existing Skills](/.claude/skills)
