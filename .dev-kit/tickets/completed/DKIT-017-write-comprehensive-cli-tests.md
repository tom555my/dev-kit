---
title: Write Comprehensive CLI Tests with Node.js Test Runner
category: Feature
---

## User Story

- As a CLI developer, I need comprehensive tests for the CLI using Node.js-compatible testing framework, so that the CLI is reliable and works correctly across different Node.js versions and operating systems.

## Acceptance Criteria

- Set up testing framework for Node.js:
  - Choose and configure test framework (vitest or node:test)
  - Configure TypeScript support for tests
  - Set up test coverage reporting
  - Add test scripts to package.json
- Migrate existing Bun tests to Node.js:
  - Convert all existing tests from `bun test` format
  - Update test assertions for chosen framework
  - Ensure all current tests pass with new runner
  - Maintain test coverage percentage
- Write comprehensive unit tests:
  - Test all command handlers (init, onboard)
  - Test core utilities (logger, errors, file operations)
  - Test agent registry and detection logic
  - Test installer module
  - Test validator logic
  - Test resource bundling and access
- Write integration tests:
  - Test CLI invocation with various arguments
  - Test end-to-end workflows (e.g., `init → install skills`)
  - Test error handling and edge cases
  - Test file system operations (copy skills, create directories)
  - Test agent detection across different environments
- Add tests for npm package scenarios:
  - Test CLI works after npm install
  - Test CLI works with npx
  - Test global installation scenarios
  - Test resource access from installed package
- Test cross-platform compatibility:
  - Run tests on macOS, Linux, Windows (GitHub Actions)
  - Test path handling on different platforms
  - Test file operations on different platforms
  - Test shebang and executable permissions
- Test multiple Node.js versions:
  - Test on Node.js v20 (current LTS)
  - Test on Node.js v22 (latest LTS)
  - Ensure no deprecated API usage
- Add test coverage requirements:
  - Set minimum coverage threshold (e.g., 80%)
  - Enforce coverage in CI/CD
  - Generate coverage reports (HTML, lcov)
- Performance and load tests:
  - Test CLI startup time
  - Test large file operations
  - Test memory usage during operations
- Test error scenarios:
  - Invalid command arguments
  - Missing files or directories
  - Permission errors
  - Network failures (if applicable)

## References

- [vitest Documentation](https://vitest.dev/)
- [Node.js node:test](https://nodejs.org/api/test.html)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Coverage Tools](https://istanbul.js.org/)
- [Existing Tests](/cli/src/**/tests/)
- Requires #DKIT-013

## Notes

- **Test Framework Choice**: Recommend vitest for better TypeScript support and compatibility with Bun test format
- **Migration**: Most Bun tests can be converted with minimal changes (describe, it, expect are similar)
- **Mocking**: Use vitest's vi.mock or node:test's mock facilities for file system mocking
- **Fixtures**: Create test fixtures for skills, configs, and test projects
- **CI/CD**: Run tests on multiple Node.js versions in GitHub Actions
- **Coverage**: Use c8 or istanbul for coverage reporting with Node.js
