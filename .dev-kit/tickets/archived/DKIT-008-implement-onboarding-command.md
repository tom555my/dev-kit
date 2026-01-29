---
title: Implement `dev-kit onboard` Command
category: Feature
---

## User Story

- As a new dev-kit user, I want to run `dev-kit onboard` to display a comprehensive getting started guide, so that I can learn how to use dev-kit workflows effectively.

## Acceptance Criteria

- Implement `dev-kit onboard` command that:
  - Displays the onboarding guide content (created in #DKIT-003)
  - Formats output for terminal display (markdown rendering, syntax highlighting)
  - Supports paging if content is long (integrates with system pager like `less`)
  - Detects terminal capabilities (colors, formatting support)
- Add output format options:
  - `--output markdown` - Output raw markdown (for file export)
  - `--output plain` - Plain text without formatting
  - `--output json` - JSON format for integration with other tools
- Add `--open` flag to open guide in browser (if markdown viewer available)
- Add section-specific display:
  - `dev-kit onboard --section quick-start`
  - `dev-kit onboard --section workflows`
  - `dev-kit onboard --section faq`
- Include "Next Steps" at end of guide with suggested commands
- Add `--update` flag to fetch latest onboarding guide from remote (if remote versioning is implemented)
- Test on various terminal emulators (macOS Terminal, iTerm2, Windows Terminal, etc.)

## References

- [Onboarding Guide Content](/.dev-kit/tickets/DKIT-003-create-onboarding-guide-content.md)
- [Terminal Formatting Libraries for Bun](https://bun.sh/docs/cli/terminal)
- [Markdown Rendering for CLIs](https://github.com/Markdown-It/markdown-it)
- Requires #DKIT-003
