---
title: Add Comprehensive CLI Documentation for npm Users
category: Feature
---

## User Story

- As a CLI user installing from npm, I need clear documentation on how to install, use, and troubleshoot the dev-kit CLI, so that I can quickly get started and use it effectively in my workflow.

## Acceptance Criteria

- Update README.md for npm users:
  - Add installation instructions (`npm install -g dev-kit-cli`)
  - Add npx usage instructions (`npx dev-kit-cli`)
  - Add system requirements (Node.js >= 20.0.0)
  - Add quick start guide
  - Add all available commands with examples
  - Add troubleshooting section
  - Add contributing guidelines
  - Add license information
- Create comprehensive CLI documentation:
  - Document all commands (init, onboard, future commands)
  - Add usage examples for each command
  - Document all command options and flags
  - Add exit codes and their meanings
  - Document configuration files (if any)
  - Add environment variables reference
  - Add FAQ section
- Create architecture documentation:
  - Overview of CLI architecture
  - How agent detection works
  - How skill installation works
  - Resource bundling and access
  - Extension points for developers
- Add code examples:
  - Basic usage examples
  - Advanced usage examples
  - Integration examples with AI agents
  - Troubleshooting examples
- Document development setup:
  - How to set up development environment
  - How to run tests
  - How to build the project
  - How to contribute
- Create npm package documentation:
  - Ensure README.md is included in npm package
  - Add detailed installation instructions
  - Document post-install steps (if any)
  - Add support and contact information
- Document migration from Bun (if applicable):
  - Breaking changes from Bun version
  - Migration guide for existing users
  - Feature parity notes
- Add API documentation (if CLI has programmatic API):
  - How to import and use CLI as a library
  - TypeScript definitions
  - API examples

## References

- [npm README Best Practices](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#readme)
- [Commander.js Documentation](https://commander.js.org/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Existing Documentation](/.dev-kit/docs/)
- [Onboarding Guide](/docs/ONBOARDING.md)
- Requires #DKIT-013

## Notes

- **README Priority**: README.md is the first thing npm users see - make it comprehensive and clear
- **Installation**: Include both npm install and npx usage examples
- **Node.js Requirement**: Clearly state Node.js version requirement
- **Screenshots**: Consider adding screenshots for visual learners
- **Examples**: Real-world examples help users understand quickly
- **Updating**: Keep documentation in sync with code changes
- **Accessibility**: Use clear language and structure for all experience levels
- **Links**: Link to related docs (GitHub issues, discussions, etc.)
