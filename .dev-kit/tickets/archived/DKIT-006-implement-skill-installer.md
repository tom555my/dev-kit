---
title: Implement Skill Installer Module
category: Feature
---

## User Story

- As a CLI user, I need the CLI to automatically copy dev-kit skills to my code agent's skill directory, so that I can start using dev-kit workflows without manual file operations.

## Acceptance Criteria

- Implement skill installer that handles:
  - Reading skill files from embedded resources or local `./.claude/skills/` directory
  - Detecting agent's skill directory (using agent abstraction)
  - Creating target directory if it doesn't exist
  - Copying skill files recursively (preserving directory structure)
  - Setting appropriate file permissions (readable by user and agent)
- Create skill validation that verifies:
  - Required files exist (SKILL.md, supporting files)
  - SKILL.md has valid frontmatter (name, description)
  - No naming conflicts with existing skills
- Implement rollback mechanism:
  - If installation fails, remove partially copied files
  - Restore previous state if skill was being updated
- Add skill update functionality:
  - Detect if skill already exists
  - Prompt user to overwrite or skip
  - Backup existing skill before updating
- Create progress indicators for copy operations (especially for multi-file skills)
- Log all installation operations for debugging
- Add integration tests for each supported agent

## References

- [Bun File System API](https://bun.sh/docs/api/file-io)
- [Agent-Specific Integration Requirements](/.dev-kit/tickets/DKIT-001-research-code-agent-integration.md)
- [dev-kit Skills Directory](/.claude/skills)
- Requires #DKIT-001, #DKIT-005
