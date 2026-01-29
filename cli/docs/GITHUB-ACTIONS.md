# GitHub Actions Workflows

This document describes the GitHub Actions workflows configured for the dev-kit CLI.

## Workflows

### 1. Publish to npm (`.github/workflows/publish.yml`)

**Trigger**: Automated on version tags (e.g., `v1.0.0`)

**What it does**:
1. Checks out the code
2. Sets up Node.js v20
3. Installs dependencies with pnpm
4. Runs tests to ensure quality
5. Builds the package
6. Verifies package contents
7. Publishes to npm with provenance
8. Sends notification on success/failure

**Usage**:
```bash
# Bump version and create tag
npm version patch  # or minor, or major
git push --follow-tags

# This triggers the publish workflow automatically
```

**Requirements**:
- `NPM_TOKEN` secret must be configured in GitHub repository secrets
- Token must have automation permissions
- Provenance is enabled for verified publishing

**Permissions**:
- `contents: read` - Access repository code
- `id-token: write` - Generate OIDC token for provenance

### 2. Create Release (`.github/workflows/release.yml`)

**Trigger**:
- On push to `main` branch when `cli/package.json` changes
- Manual trigger via workflow_dispatch

**What it does**:
1. Checks out the code
2. Sets up Node.js v20
3. Extracts version from package.json
4. Builds the package
5. Creates a GitHub release with installation instructions

**Usage**:
```bash
# Update version in package.json
npm version patch

# Push to main branch
git push origin main

# This triggers the release workflow automatically
```

**Permissions**:
- `contents: write` - Create releases

## Setup Instructions

### 1. Configure npm Token

1. Go to https://www.npmjs.com/settings/tokens
2. Click "Add New Token"
3. Select "Automation" type
4. Copy the generated token

### 2. Add GitHub Secret

1. Go to your repository on GitHub
2. Navigate to: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your npm automation token
6. Click "Add secret"

### 3. Enable Workflow Permissions

The workflows require the following permissions (already configured in workflow files):

**publish.yml**:
- `contents: read`
- `id-token: write` (for npm provenance)

**release.yml**:
- `contents: write` (for creating releases)

These permissions are set using the `permissions` key in each workflow file.

## Publishing Process

### Automated Publishing (Recommended)

```bash
# 1. Update version
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# 2. Push tag to trigger workflow
git push --follow-tags

# 3. Workflow automatically:
#    - Runs tests
#    - Builds package
#    - Publishes to npm
#    - Sends notification
```

### Manual Publishing

```bash
# Build and test
pnpm build
pnpm test

# Publish manually
npm publish --provenance --access public
```

## Workflow Files

### publish.yml

```yaml
on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:
```

Triggers on:
- Version tags (v1.0.0, v2.1.3, etc.)
- Manual trigger from GitHub Actions UI

### release.yml

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'cli/package.json'
  workflow_dispatch:
```

Triggers on:
- Push to main branch with package.json changes
- Manual trigger from GitHub Actions UI

## Troubleshooting

### Publish Workflow Fails

**Error**: "E401 Unauthorized"
- **Solution**: NPM_TOKEN is invalid or expired
- Generate new token and update GitHub secret

**Error**: "E403 Forbidden"
- **Solution**: Insufficient permissions
- Ensure npm account has publish permissions for package

**Error**: "Provenance statement generation failed"
- **Solution**: Provenance requires public npm package
- Ensure `--access public` flag is used
- Verify OIDC permissions are correct

### Release Workflow Fails

**Error**: "Resource not accessible"
- **Solution**: Check `contents: write` permission
- Ensure workflow has correct permissions

**Error**: Version mismatch
- **Solution**: Verify version in package.json
- Ensure CHANGELOG.md is updated

## Best Practices

1. **Version Bump**: Always use `npm version` to create tags
2. **CHANGELOG**: Update CHANGELOG.md before versioning
3. **Testing**: Ensure all tests pass before pushing
4. **Branch Protection**: Protect main branch to require PRs
5. **Token Security**: Use automation tokens, not personal tokens
6. **Provenance**: Always publish with provenance for security

## Monitoring

### View Workflow Runs

1. Go to repository on GitHub
2. Click "Actions" tab
3. Select workflow from list
4. View run history and logs

### Workflow Status Badge

Add to README.md:

```markdown
[![npm publish](https://github.com/user/dev-kit/actions/workflows/publish.yml/badge.svg)]
[![create release](https://github.com/user/dev-kit/actions/workflows/release.yml/badge.svg)]
```

## Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
- [Publishing Guide](./PUBLISHING.md)
