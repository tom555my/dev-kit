---
title: Design dev-kit CLI Architecture
category: Feature
---

## User Story

- As a CLI developer, I need a well-architected CLI structure that supports multiple code agents, extensible commands, and embedded skill files, so that the CLI is maintainable and can evolve with new requirements.

## Acceptance Criteria

- Design CLI command structure with clear separation of concerns:
  - `dev-kit init [agent]` - Initialize dev-kit for specified agent
  - `dev-kit install-skills [agent]` - Install skills for specified agent
  - `dev-kit onboard` - Display onboarding guide
  - `dev-kit --version` - Show version info
  - `dev-kit --help` - Show usage information
- Create architecture diagram showing:
  - Core CLI framework (command routing, argument parsing)
  - Agent abstraction layer (interface for different code agents)
  - Skill installer module (handles file operations for skill installation)
  - Resource manager (embeds and serves static files like skills, guides)
  - User configuration module (stores preferences, installed agents)
- Define data structures for:
  - Agent metadata (name, skill directory path, config format)
  - Skill metadata (name, source path, target path, required files)
  - User configuration (preferred agents, installation paths)
- Design error handling strategy for:
  - Unsupported agents
  - Permission errors
  - Invalid agent installations
  - Missing dependencies
- Create module boundaries and interface definitions
- Document testing strategy for each module

## References

- [Commander.js (Bun-compatible CLI framework)](https://github.com/tj/commander.js)
- [CLI Architecture Patterns](https://matthewminer.com/best-practices/cli-apps)
- [Bun File System APIs](https://bun.sh/docs/api/file-io)
- Requires #DKIT-001 (agent integration patterns)
- Requires #DKIT-002 (Bun executable constraints)
