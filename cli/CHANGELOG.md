# Changelog

All notable changes to the dev-kit CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-28

### Added
- Initial npm publishing configuration for dev-kit CLI
- Package metadata for npm registry (keywords, repository, homepage, bugs)
- Automated CI/CD workflows for publishing to npm
- npm provenance configuration for verified publishing
- Comprehensive documentation for npm users
  - Installation instructions (npm, npx, pnpm, yarn)
  - Usage examples and common workflows
  - Contributing guidelines
  - Publishing guide for maintainers
- MIT License file
- .npmignore configuration for clean npm packages
- GitHub Actions workflows:
  - Automated publishing on version tags
  - Release creation workflow

### Changed
- Migrated from Bun runtime to Node.js 20+ (DKIT-013)
- Build system switched to tsup
- Test framework migrated to Vitest

### Dependencies
- commander: ^12.1.0
- Node.js: >=20.0.0

## [Unreleased]

### Planned
- Static resource embedding for skills and documentation
- Additional agent implementations
- Enhanced error reporting
- Progress indicators for installations
- Configuration file support
- Update checking mechanism
