---
title: Implement CLI Framework with Agent Abstraction
category: Feature
---

## User Story

- As a CLI developer, I need to implement the core CLI framework with agent abstraction layer, so that commands can be routed correctly and agent-specific operations are handled through a unified interface.

## Acceptance Criteria

- Initialize Bun project in `./cli` directory with proper `package.json` and `tsconfig.json`
- Implement command parser and router using a Bun-compatible CLI framework (e.g., Commander.js or Yargs for Bun)
- Create agent abstraction interface with methods:
  - `detect()`: Check if agent is installed on user's system
  - `getSkillPath()`: Return agent's skill installation directory
  - `installSkill(skillData)`: Copy skill files to agent's directory
  - `verifySkill(skillName)`: Confirm skill is correctly installed
- Implement agent registry that maps agent names (claude-code, cursor, opencode, github-copilot) to their implementations
- Create error types for:
  - `AgentNotInstalledError`
  - `PermissionDeniedError`
  - `InvalidAgentError`
  - `SkillInstallationError`
- Implement logging system (info, warn, error, debug levels)
- Add basic CLI help and version commands
- Create unit tests for command routing and agent abstraction

## References

- [Bun CLI Framework Guide](https://bun.sh/docs/tooling)
- [Agent Integration Research](/.dev-kit/tickets/DKIT-001-research-code-agent-integration.md)
- [CLI Architecture Design](/.dev-kit/tickets/DKIT-004-design-cli-architecture.md)
- Requires #DKIT-001, #DKIT-004
