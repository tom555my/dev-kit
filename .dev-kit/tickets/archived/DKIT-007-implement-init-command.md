---
title: Implement `dev-kit init` Command
category: Feature
---

## User Story

- As a new dev-kit user, I want to run `dev-kit init [agent]` to automatically set up dev-kit skills for my preferred code agent, so that I can start using dev-kit workflows immediately.

## Acceptance Criteria

- Implement `dev-kit init [agent]` command that:
  - Accepts agent name as argument (claude-code, cursor, opencode, github-copilot)
  - Validates agent is supported and installed
  - Detects user's agent configuration directory
  - Installs all dev-kit skills (init, ticket, research, work, refine, review)
  - Creates `.dev-kit/` directory structure in user's project if not present
  - Reports success/failure for each skill installation
- Add interactive mode if no agent specified:
  - List supported agents
  - Detect which agents are installed
  - Prompt user to select from available agents
- Handle edge cases:
  - Agent not installed (clear error message with installation link)
  - Insufficient permissions (guide user to fix)
  - Skills already installed (prompt to update or skip)
  - Unsupported agent (list supported agents)
- Add `--force` flag to overwrite existing skills
- Add `--verify` flag to test skill installation after copying
- Display onboarding guide URL/path after successful installation
- Create integration tests for each agent type

## References

- [CLI Architecture Design](/.dev-kit/tickets/DKIT-004-design-cli-architecture.md)
- [Skill Installer Module](/.dev-kit/tickets/DKIT-006-implement-skill-installer.md)
- [dev-kit Skills List](/.claude/skills)
- Requires #DKIT-005, #DKIT-006
