# npm Publishing Guide

This document explains how to publish the dev-kit CLI to npm.

## Prerequisites

1. **npm account**: Create an account at https://www.npmjs.com/signup
2. **Package name**: The package name `dev-kit-cli` must be available

## Setup

### 1. Create npm Access Token

```bash
# Login to npm
npm login

# Create automation token
# Go to: https://www.npmjs.com/settings/tokens
# Click "Add New Token"
# Select "Automation" type
# Copy the generated token
```

### 2. Add Token to GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your npm automation token
6. Click "Add secret"

### 3. Configure Repository (if not done)

The following files should already be configured:

- `.npmignore` - Specifies what to exclude from npm package
- `.npmrc` - Enables provenance for verified publishing
- `package.json` - Contains all necessary metadata
- `.github/workflows/publish.yml` - Automated publishing workflow

## Publishing Workflow

### Option 1: Automated Publishing (Recommended)

The `.github/workflows/publish.yml` workflow automatically publishes when you push a version tag:

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Push the tag
git push --follow-tags

# This triggers the publish workflow automatically
```

The workflow will:
1. Run tests
2. Build the package
3. Verify package contents
4. Publish to npm with provenance
5. Send notification

### Option 2: Manual Publishing

```bash
# Build the package
pnpm build

# Run tests
pnpm test

# Publish to npm
npm publish --access public --provenance
```

## Versioning

Follow semantic versioning:

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backwards compatible

```bash
# Update version (automatically commits and tags)
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# Or edit package.json manually, then:
npm version <new-version>
```

## Publishing Checklist

Before publishing, verify:

- [ ] Version updated in `package.json`
- [ ] CHANGELOG.md updated with changes
- [ ] All tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] README.md is up to date
- [ ] LICENSE file is present
- [ ] `.npmignore` is configured correctly
- [ ] No sensitive data in package

## After Publishing

### Verify Installation

```bash
# Test global installation
npm install -g dev-kit-cli@<version>
dev-kit --version

# Test npx usage
npx dev-kit-cli@<version> --help
```

### Check npm Registry

Visit: https://www.npmjs.com/package/dev-kit-cli

Verify:
- Version is published
- Metadata is correct
- Documentation displays properly

### Update Repository

1. Create a GitHub release
2. Update CHANGELOG.md
3. Tag the release in git
4. Notify users (if applicable)

## Provenance

This package uses npm provenance for verified publishing. This means:

- Each published package includes a cryptographic signature
- Users can verify the package originated from this repository
- Improves supply chain security

For more information: https://docs.npmjs.com/generating-provenance-statements

## Troubleshooting

### "E401" Error

Your npm token is invalid or expired. Generate a new token and update GitHub secrets.

### "E404" Error

The package name is already taken. Choose a different name or use a scoped package like `@dev-kit/cli`.

### "E403" Error

You don't have permission to publish this package. Ensure:
- You're logged in as the owner
- For scoped packages, you have correct permissions

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

### Tests Fail

```bash
# Run tests with verbose output
pnpm test --reporter=verbose

# Run specific test file
pnpm test path/to/test.test.ts
```

## CI/CD Pipeline

The publishing workflow (`.github/workflows/publish.yml`):

```yaml
On tag push (v*.*.*):
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Run tests
  5. Build package
  6. Verify package
  7. Publish to npm (with provenance)
  8. Send notification
```

The release workflow (`.github/workflows/release.yml`):

```yaml
On package.json change:
  1. Checkout code
  2. Extract version
  3. Build package
  4. Create GitHub release
```

## Security Considerations

1. **Token Security**: Never commit npm tokens to repository
2. **Provenance**: Always use `--provenance` flag for publishing
3. **Access Control**: Limit who can push to main branch
4. **2FA**: Enable 2FA on npm account
5. **Audit**: Run `npm audit` regularly

## Related Documentation

- [npm publish docs](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions npm guide](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
