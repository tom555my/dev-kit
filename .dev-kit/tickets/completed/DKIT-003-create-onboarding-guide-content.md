---
title: Create dev-kit Onboarding Guide Content
category: Feature
---

## User Story

- As a new dev-kit user, I want a comprehensive onboarding guide that explains what dev-kit is, how to use it, and what workflows are available, so that I can quickly get started with the toolkit.

## Acceptance Criteria

- Create a comprehensive onboarding guide (`docs/ONBOARDING.md`) covering:
  - What is dev-kit and who should use it
  - Quick start guide (5-minute setup)
  - Overview of all 6 workflows and when to use each
  - Example workflows with sample outputs
  - Common use cases and patterns
  - Troubleshooting common issues
  - Next steps and advanced usage
- Include a "Quick Reference" section for workflow commands
- Add visual examples (code blocks, terminal output snippets)
- Create a "FAQ" section addressing common new user questions
- Ensure the guide is agent-agnostic (works for Claude Code, Cursor, OpenCode, GitHub Copilot)
- Add links to detailed documentation for each workflow
- Include a "Getting Help" section with community resources

## References

- [dev-kit PROJECT.md](/.dev-kit/docs/PROJECT.md)
- [dev-kit TECH.md](/.dev-kit/docs/TECH.md)
- [Existing Workflow Definitions](/.agent/workflows)
- [CLI Onboarding Best Practices](https://clig.dev/#guide)
- Requires #DKIT-001 (for agent-specific nuances)
