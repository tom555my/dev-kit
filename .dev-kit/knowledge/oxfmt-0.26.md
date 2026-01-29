# oxfmt v0.26.0

## Overview

oxfmt is a high-performance JavaScript/TypeScript formatter built with Rust as part of the Oxc (Oxidation Compiler) project. It provides 10-100x faster formatting compared to Prettier while maintaining compatibility with Prettier's configuration options.

**Version**: 0.26.0
**Language**: Rust
**Purpose**: Code formatting for JavaScript, TypeScript, JSON, CSS, and HTML

## Key Concepts

### Performance
- Written in Rust for exceptional speed
- Benchmarks show 10-100x faster than Prettier
- Lower memory usage
- Ideal for large codebases and CI/CD pipelines

### Compatibility
- Most options mirror Prettier's configuration
- Drop-in replacement for existing Prettier setups
- Migration tool available: `oxfmt --migrate=prettier`

### Configuration Files
- **Primary**: `.oxfmtrc.json` (JSON format)
- **Alternative**: `.oxfmtrc.jsonc` (JSON with comments)
- Single root configuration file (no cascading or overrides in v0.26.0)

## Best Practices

### Project Setup
1. Install as devDependency: `npm install -D oxfmt`
2. Initialize config: `npx oxfmt --init`
3. Migrate from Prettier: `npx oxfmt --migrate=prettier`
4. Add npm scripts:
   ```json
   {
     "scripts": {
       "format": "oxfmt",
       "format:check": "oxfmt --check"
     }
   }
   ```

### Editor Integration

**VSCode / Cursor**:
```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true
}
```

**IntelliJ IDEA**:
- Install [Oxc IntelliJ Plugin](https://github.com/oxc-project/oxc-intellij-plugin)
- Enable format on save in settings

### CI/CD Integration
```yaml
# Example GitHub Actions
- name: Format check
  run: npx oxfmt --check
```

## Implementation Tips

### Configuration Options (.oxfmtrc.json)
```json
{
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true,
  "printWidth": 80,
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false
}
```

### CLI Commands
```bash
# Format all files
oxfmt

# Check formatting without modifying
oxfmt --check

# Initialize config
oxfmt --init

# Migrate from Prettier
oxfmt --migrate=prettier

# Format specific files
oxfmt src/*.ts
```

### Ignore Patterns
Create `.oxfmtignore`:
```
node_modules/
dist/
build/
.next/
coverage/
*.min.js
```

## Common Pitfalls

### Idempotency Issues
- **Issue**: Running oxfmt multiple times should produce identical output
- **Status**: Known issues with CSS comments in v0.26.0 ([#18522](https://github.com/oxc-project/oxc/issues/18522))
- **Workaround**: Avoid complex CSS comments or wait for patch

### VSCode Extension Not Working
- **Issue**: VSCode extension doesn't format files ([#18410](https://github.com/oxc-project/oxc/issues/18410))
- **Solution**: Ensure oxfmt is installed in project, check extension version compatibility
- **Verify**: Run `oxfmt --version` in project root

### Configuration Not Detected
- **Issue**: Config file not being read
- **Solution**: Use `.oxfmtrc.json` (not `.js` or `.ts` configs in v0.26.0)
- **Validate**: Use JSON schema validation in VSCode

### Migration from Prettier
- **Issue**: Some Prettier options not supported
- **Solution**: Check [config file reference](https://oxc.rs/docs/guide/usage/formatter/config-file-reference)
- **Fallback**: Keep Prettier for unsupported edge cases

## References

- [Official Documentation](https://oxc.rs/docs/guide/usage/formatter)
- [GitHub Repository](https://github.com/oxc-project/oxc)
- [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
- [Configuration Reference](https://oxc.rs/docs/guide/usage/formatter/config-file-reference)
- [CLI Documentation](https://oxc.rs/docs/guide/usage/formatter/cli)
- [Formatter Benchmarks](https://github.com/oxc-project/bench-formatter)

## Migration Checklist

When adopting oxfmt in an existing project:

- [ ] Install oxfmt as devDependency
- [ ] Run `oxfmt --migrate=prettier` to convert config
- [ ] Review generated `.oxfmtrc.json`
- [ ] Update CI/CD to use `oxfmt --check`
- [ ] Configure editor integration
- [ ] Create `.oxfmtignore` if needed
- [ ] Test formatting on sample files
- [ ] Commit with PR showing diff
- [ ] Update team documentation
- [ ] Uninstall Prettier after verification

## Version-Specific Notes (v0.26.0)

- Released: September 2025
- Tab width default: 4 for JS/TS, varies for other file types
- Single root config only (no extend/override)
- JSON and JSONC configs supported
- No `.js` or `.ts` config files
- Experimental features may change in future versions
