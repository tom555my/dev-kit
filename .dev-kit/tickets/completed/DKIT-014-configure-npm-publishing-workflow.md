---
title: Configure CLI for npm Publishing and Distribution
category: Feature
---

## User Story

- As a CLI maintainer, I need to configure the dev-kit CLI for npm publishing, so that users can install it globally via `npm install -g dev-kit-cli` or use it directly with `npx dev-kit-cli`.

## Acceptance Criteria

- Configure package.json for npm publishing:
  - Update `name` field to final npm package name (e.g., `@dev-kit/cli` or `dev-kit-cli`)
  - Set proper `version` following semantic versioning
  - Add comprehensive `description` for npm registry
  - Add `keywords` for discoverability
  - Add `author` and `repository` fields
  - Set correct `license` (MIT or chosen license)
  - Configure `files` field to include only necessary files in npm package
  - Add `homepage` and `bugs` URLs
  - Ensure `bin` entry points to correct executable
  - Add `exports` field for proper ESM/CommonJS handling
- Prepare npm package contents:
  - Include compiled JavaScript files in `dist/` directory
  - Include README.md with installation and usage instructions
  - Include LICENSE file
  - Exclude source files, tests, and configuration from npm package
  - Add `.npmignore` file if needed
- Set up build and publish scripts:
  - `npm run build` - Compile TypeScript for distribution
  - `npm run prepublishOnly` - Pre-publish checks and build
  - `npm run version` - Automated versioning script
  - Add `.npmrc` configuration if needed
- Create documentation for npm users:
  - Installation instructions (`npm install -g dev-kit-cli`)
  - Usage with `npx` (`npx dev-kit-cli`)
  - Local development setup
  - Contributing guidelines
- Configure CI/CD for automated publishing:
  - GitHub Actions workflow for publishing to npm
  - Automatic publishing on release/tag creation
  - Semantic release configuration (optional)
  - Token/provenance configuration for npm registry
- Test npm package installation:
  - Test local npm pack and install
  - Test global installation
  - Test npx usage
  - Verify post-install scripts work correctly
  - Test on fresh environments (no existing dependencies)
- Add npm provenance and signing:
  - Configure npm provenance for verified publishing
  - Set up npm token as GitHub secret
  - Add signature verification if needed

## References

- [npm Publishing Guide](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [npm package.json Documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions npm Publish](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
- [Semantic Release](https://github.com/semantic-release/semantic-release)
- [npx Documentation](https://docs.npmjs.com/cli/v9/commands/npx)
- Requires #DKIT-013

## Notes

- **Package Name**: Decide between scoped package `@dev-kit/cli` or independent `dev-kit-cli`
- **Versioning**: Follow semantic versioning (MAJOR.MINOR.PATCH)
- **Public vs Private**: Decide if package should be public or scoped private
- **README**: Must include clear installation and usage instructions for npm users
- **Dependencies**: Ensure all dependencies are also published on npm (no local/Bun-specific packages)
