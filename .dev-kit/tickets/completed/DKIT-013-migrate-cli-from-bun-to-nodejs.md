---
title: Migrate CLI Runtime from Bun to Node.js
category: Feature
---

## User Story

- As a CLI maintainer, I need to migrate the dev-kit CLI from Bun to Node.js runtime, so that the CLI can be published to npm and used by developers who don't have Bun installed.

## Acceptance Criteria

- Update package.json configuration:
  - Change shebang from `#!/usr/bin/env bun` to `#!/usr/bin/env node`
  - Update `engines` field to require Node.js >= 20.0.0 (remove Bun requirement)
  - Ensure all dependencies are compatible with Node.js
  - Update build scripts to use Node.js tooling
- Migrate build system:
  - Replace `bun build` with `tsup` or `esbuild` for bundling
  - Configure TypeScript compiler target for Node.js (ES2022)
  - Update build output to CommonJS or ESM compatible with Node.js
- Replace Bun-specific APIs:
  - Replace `import.meta.dir` with `__dirname` or `url.fileURLToPath`
  - Replace `package.json with { type: 'json' }` with standard Node.js import
  - Replace any Bun-specific file system APIs with Node.js `fs/promises`
  - Update test runner from `bun test` to `node:test` or `vitest`
- Update development scripts:
  - Replace `bun run` with `node` or `node --loader`
  - Update hot-reload/dev tooling for Node.js
  - Ensure TypeScript compilation works with Node.js
- Verify existing functionality:
  - All current CLI commands work with Node.js
  - File operations (copying skills, creating directories) work correctly
  - Agent detection and installation logic works
  - Onboarding guide display works
- Update documentation:
  - Update installation instructions in README.md
  - Update development setup instructions
  - Document Node.js version requirements
- Test compatibility:
  - Test on Node.js v20, v22 (LTS versions)
  - Verify CLI works on macOS, Linux, Windows with Node.js
  - Ensure no Bun-specific runtime dependencies remain

## References

- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
- [tsup Bundler](https://tsup.egoist.dev/)
- [esbuild Documentation](https://esbuild.github.io/)
- [vitest Testing Framework](https://vitest.dev/)
- [package.json Configuration](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [Current CLI Implementation](/cli/src/cli.ts)

## Notes

- **Breaking Change**: Users will need Node.js installed instead of Bun
- **Dependency Check**: Verify all dependencies (commander, etc.) work with Node.js
- **File System**: Bun's file system API is mostly compatible with Node.js `fs/promises`
- **Import Meta**: `import.meta` works in Node.js, but `import.meta.dir` needs replacement
