# oxlint & oxfmt - Knowledge Reference

## Overview

**oxlint** and **oxfmt** are high-performance linting and formatting tools written in Rust as part of the Oxc project. They are designed to be drop-in replacements for ESLint and Prettier, prioritizing extreme speed (50-100x faster).

---

## oxlint (Linter)
- **Speed**: Built in Rust, it can lint thousands of files in milliseconds.
- **Zero Config**: Works out of the box with sensible defaults.
- **Compatibility**: Supports many ESLint plugin rules natively (TypeScript, React, Unicorn, etc.).

### Usage in dev-kit
```bash
# Lint the project
pnpm lint

# Lint and fix issues
pnpm lint:fix
```

**Config (`.oxlintrc.json`)**:
Customizes the linting rules.

---

## oxfmt (Formatter)
- **Speed**: significantly faster than Prettier.
- **Prettier Compatible**: Aims to be 100% compatible with Prettier's formatting style.
- **Integrated**: Part of the same toolchain as the linter.

### Usage in dev-kit
```bash
# Format the project
pnpm format

# Check formatting
pnpm format:check
```

**Config (`.oxfmtrc.json`)**:
Defines print width, tabs vs spaces, and other formatting conventions.

---

## Why this Project uses Oxc
1. **Developer Velocity**: Eliminates the "linting/formatting pause" in dev cycles.
2. **Simplified Tooling**: One toolchain for code quality.
3. **Rust-Powered**: Leverages the safety and speed of Rust for CLI performance.

---

## Best Practices
1. **Regular Checks**: Run `pnpm lint` and `pnpm format` before every commit.
2. **Editor Integration**: Use Oxc-compatible extensions in VS Code or other IDEs for real-time feedback.
3. **CI Integration**: These tools are perfect for CI because they are fast and don't require heavy Node environments for execution.

---

## Resources
- [Oxc Project Home](https://oxc-project.github.io/)
- [oxlint Repository](https://github.com/oxc-project/oxc/tree/main/crates/oxlint)

---

## Status

✅ **Implemented in dev-kit**  
📚 **oxlint Version**: 1.41.0  
📚 **oxfmt Version**: 0.26.0  
🔄 **Last Updated**: 2026-01-22
