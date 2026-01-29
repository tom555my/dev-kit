# Bun Single-File Executable Build Guide (2025)

**Knowledge Version:** 1.0.0
**Last Updated:** 2025-01-28
**Target Audience:** CLI developers building standalone executables with Bun

## Summary

Bun's `--compile` flag generates standalone binaries from TypeScript/JavaScript. These executables include the Bun runtime, all dependencies, and can embed static assets. This guide covers building, asset embedding, cross-compilation, and distribution best practices for CLI tools.

## Quick Reference

| Feature | Command | Status |
|---------|---------|--------|
| **Basic Compile** | `bun build --compile ./cli.ts --outfile mycli` | ✅ Stable |
| **Cross-Compile** | `--target=bun-linux-x64` | ✅ Stable (Bun 1.3+) |
| **Asset Embedding** | `import x from "./file" with { type: "file" }` | ✅ Stable |
| **Minification** | `--minify` | ✅ Stable |
| **Bytecode Compile** | `--bytecode` | ✅ Stable |
| **Code Signing** | External tools (codesign) | ✅ Supported |

---

## Basic Compilation

### Simple CLI

```bash
# Compile for current platform
bun build --compile ./cli.ts --outfile dev-kit

# Run the executable
./dev-kit
```

**Result:** Single binary containing:
- Your code
- Bun runtime
- All dependencies
- ~80-100MB base size (as of Bun 1.3, 2025)

### Programmatic Build

```typescript
// build.ts
await Bun.build({
  entrypoints: ["./cli.ts"],
  compile: {
    outfile: "./dev-kit",
  },
});
```

```bash
# Run build script
bun run build.ts
```

---

## Cross-Platform Compilation

### Supported Targets

| Target | OS | Arch | Status |
|--------|-------|------|--------|
| `bun-darwin-arm64` | macOS | ARM64 (Apple Silicon) | ✅ Full support |
| `bun-darwin-x64` | macOS | x64 (Intel) | ✅ Full support |
| `bun-linux-x64` | Linux | x64 | ✅ Full support |
| `bun-linux-arm64` | Linux | ARM64 | ✅ Full support |
| `bun-windows-x64` | Windows | x64 | ✅ Full support |
| `bun-windows-arm64` | Windows | ARM64 | ❌ Not supported |

### CPU Variants (Linux/Windows)

- **Default:** Modern CPUs (2013+, Haswell)
- **Baseline:** Pre-2013 CPUs (Nehalem) - more compatible
- **Modern:** 2013+ CPUs (Haswell) - faster

### Cross-Compilation Examples

```bash
# macOS (Apple Silicon)
bun build --compile --target=bun-darwin-arm64 ./cli.ts --outfile dev-kit-macos-arm64

# macOS (Intel)
bun build --compile --target=bun-darwin-x64 ./cli.ts --outfile dev-kit-macos-x64

# Linux (x64)
bun build --compile --target=bun-linux-x64 ./cli.ts --outfile dev-kit-linux-x64

# Linux (ARM64 - e.g., Raspberry Pi, Graviton)
bun build --compile --target=bun-linux-arm64 ./cli.ts --outfile dev-kit-linux-arm64

# Windows (x64)
bun build --compile --target=bun-windows-x64 ./cli.ts --outfile dev-kit-windows-x64.exe

# Linux (baseline - older CPUs)
bun build --compile --target=bun-linux-x64-baseline ./cli.ts --outfile dev-kit-linux-x64-baseline
```

### Programmatic Cross-Compilation

```typescript
// build-all.ts
const targets = [
  "bun-darwin-arm64",
  "bun-darwin-x64",
  "bun-linux-x64",
  "bun-linux-arm64",
  "bun-windows-x64",
];

for (const target of targets) {
  console.log(`Building for ${target}...`);

  await Bun.build({
    entrypoints: ["./cli.ts"],
    compile: {
      target,
      outfile: `./dist/dev-kit-${target}`,
    },
  });
}
```

### Known Issues

- **Windows to Linux cross-compilation:** Some reported issues as of December 2025 ([GitHub #25346](https://github.com/oven-sh/bun/issues/25346))
- **Recommendation:** Build on each target platform when possible, or use GitHub Actions with platform-specific runners

---

## Embedding Static Assets

### Single File Embedding

```typescript
// cli.ts
import skillPath from "./skills/dev-kit-init/SKILL.md" with { type: "file" };
import { file } from "bun";

// Read embedded file
const skillContent = await file(skillPath).text();
console.log(skillContent);
```

**How it works:**
1. Build time: Bun reads `SKILL.md`, embeds into binary
2. Runtime: `skillPath` becomes `$bunfs/skill-a1b2c3d4.md` (internal path)
3. `Bun.file()` reads from embedded filesystem

### Directory Embedding

```bash
# Glob pattern to include all files
bun build --compile ./cli.ts ./skills/**/*.md --outfile dev-kit
```

```typescript
// build.ts (programmatic)
import { Glob } from "bun";

const glob = new Glob("./skills/**/*.md");
const skillFiles = Array.from(glob.scanSync("."));

await Bun.build({
  entrypoints: ["./cli.ts", ...skillFiles],
  compile: {
    outfile: "./dev-kit",
  },
});
```

**Accessing embedded files:**

```typescript
import initSkill from "./skills/dev-kit-init/SKILL.md" with { type: "file" };
import ticketSkill from "./skills/dev-kit-ticket/SKILL.md" with { type: "file" };

const skills = {
  init: initSkill,
  ticket: ticketSkill,
};

// List all embedded files
import { embeddedFiles } from "bun";
for (const blob of embeddedFiles) {
  console.log(`${blob.name} - ${blob.size} bytes`);
}
```

### Practical Example: dev-kit Skill Bundling

```typescript
// cli.ts
import * as fs from "node:fs";

// Type for skill metadata
interface Skill {
  name: string;
  description: string;
  content: string;
}

// Embed all skills
const skills: Record<string, Skill> = {
  "dev-kit-init": {
    name: "dev-kit-init",
    description: "Initialize project documentation",
    content: await loadSkill("./skills/dev-kit-init/SKILL.md"),
  },
  "dev-kit-ticket": {
    name: "dev-kit-ticket",
    description: "Generate work tickets",
    content: await loadSkill("./skills/dev-kit-ticket/SKILL.md"),
  },
  // ... more skills
};

async function loadSkill(path: string): Promise<string> {
  import skillPath from path with { type: "file" };
  return await Bun.file(skillPath).text();
}

// CLI command to list skills
command("list-skills")
  .description("List all available skills")
  .action(() => {
    for (const [key, skill] of Object.entries(skills)) {
      console.log(`${key}: ${skill.description}`);
    }
  });
```

### Virtual File System API

```typescript
import { file, embeddedFiles } from "bun";

// Read as text
const text = await file("./path/to/file.md").text();

// Read as JSON
const data = await file("./config.json").json();

// Read as binary
const bytes = await file("./image.png").arrayBuffer();

// Get file info
const blob = file("./file.md");
console.log(blob.size); // File size in bytes
console.log(blob.name); // "file-a1b2c3d4.md" (with content hash)

// List all embedded files
for (const blob of embeddedFiles) {
  console.log(`${blob.name}: ${blob.size} bytes`);
}
```

### Content Hash Naming

**Default:** Files have content hash appended (for cache busting):
```
icon-a1b2c3d4.png
config-e5f6g7h8.json
```

**Disable hash:**
```bash
bun build --compile --asset-naming="[name].[ext]" ./cli.ts --outfile dev-kit
```

```typescript
await Bun.build({
  entrypoints: ["./cli.ts"],
  compile: { outfile: "./dev-kit" },
  naming: {
    asset: "[name].[ext]", // Preserve original names
  },
});
```

---

## Production Build Flags

### Optimal Production Build

```bash
bun build --compile \
  --minify \
  --sourcemap \
  --bytecode \
  ./cli.ts \
  --outfile dev-kit
```

**Flag breakdown:**

| Flag | Purpose | Impact |
|------|---------|--------|
| `--minify` | Reduce code size | Saves MBs of space |
| `--sourcemap` | Enable debugging | Better error messages |
| `--bytecode` | Pre-compile to bytecode | 2x faster startup |

### Programmatic Equivalent

```typescript
await Bun.build({
  entrypoints: ["./cli.ts"],
  compile: {
    outfile: "./dev-kit",
  },
  minify: true,
  sourcemap: "linked",
  bytecode: true,
});
```

### Build-Time Constants

Inject version numbers, build timestamps, etc.:

```bash
bun build --compile \
  --define BUILD_VERSION='"1.0.0"' \
  --define BUILD_TIME='"2025-01-28T10:30:00Z"' \
  ./cli.ts \
  --outfile dev-kit
```

```typescript
// cli.ts (constants are replaced at build time)
console.log(`Version: ${BUILD_VERSION}`);
console.log(`Built: ${BUILD_TIME}`);
```

### Config Loading Control

**Default behavior:**
- `tsconfig.json`: ❌ Disabled (dev-only)
- `package.json`: ❌ Disabled (dev-only)
- `.env`: ✅ Enabled (runtime config)
- `bunfig.toml`: ✅ Enabled (runtime config)

**Enable tsconfig/package.json at runtime:**

```bash
bun build --compile \
  --compile-autoload-tsconfig \
  --compile-autoload-package-json \
  ./cli.ts \
  --outfile dev-kit
```

**Disable .env/bunfig (deterministic execution):**

```bash
bun build --compile \
  --no-compile-autoload-dotenv \
  --no-compile-autoload-bunfig \
  ./cli.ts \
  --outfile dev-kit
```

---

## Windows-Specific Configuration

### Custom Icon and Metadata

```bash
bun build --compile \
  --windows-icon=./icon.ico \
  --windows-hide-console \
  ./cli.ts \
  --outfile dev-kit.exe
```

```typescript
await Bun.build({
  entrypoints: ["./cli.ts"],
  compile: {
    outfile: "./dev-kit.exe",
    windows: {
      icon: "./icon.ico",
      hideConsole: true,
      title: "dev-kit",
      publisher: "Your Name",
      version: "1.0.0",
      description: "Development toolkit for AI agents",
      copyright: "Copyright 2025",
    },
  },
});
```

---

## Code Signing

### macOS Code Signing

```bash
# Basic signing
codesign --deep --force -vvvv --sign "Developer ID Application: Your Name" ./dev-kit

# With entitlements (for JIT support)
codesign --deep --force \
  --sign "Developer ID Application: Your Name" \
  --entitlements entitlements.plist \
  ./dev-kit

# Verify signature
codesign -vvv --verify ./dev-kit
```

**entitlements.plist:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-executable-page-protection</key>
    <true/>
    <key>com.apple.security.cs.allow-dyld-environment-variables</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
</dict>
</plist>
```

### Windows Code Signing (External Tools)

Use external tools like [signtool](https://docs.microsoft.com/en-us/windows/win32/seccrypto/signtool):

```bash
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com dev-kit.exe
```

---

## Optimization Strategies

### Executable Size

**Current state (Bun 1.3, 2025):**
- Base executable: ~80-100MB (includes Bun runtime)
- Each embedded asset: adds to size
- Minification: Saves 10-30% depending on codebase

**Strategies:**

1. **Lazy load skills:**
   ```typescript
   // Instead of embedding all skills upfront
   import allSkills from "./skills/**";

   // Load on demand
   async function loadSkill(name: string) {
     return await import(`./skills/${name}/SKILL.md`);
   }
   ```

2. **Use `--bytecode`:**
   - Trades build time for runtime speed
   - No size impact, but 2x faster startup

3. **Asset compression:**
   ```typescript
   // Compress markdown assets
   import { gzip } from "node:zlib";
   const compressed = gzip.sync(rawContent);
   ```

### Startup Performance

**Bytecode compilation:**

```bash
bun build --compile --bytecode ./cli.ts --outfile dev-kit
```

**Impact:**
- Startup: 2x faster
- Build time: +10-20% slower
- Use for: CLI tools with frequent invocations

---

## CLI Project Structure

### Recommended Directory Layout

```
cli/
├── src/
│   ├── commands/        # CLI command implementations
│   │   ├── init.ts
│   │   ├── install.ts
│   │   └── onboard.ts
│   ├── agents/          # Agent-specific integrations
│   │   ├── claude-code.ts
│   │   ├── cursor.ts
│   │   └── copilot.ts
│   ├── utils/           # Utility functions
│   └── cli.ts           # Main entry point
├── skills/              # Embedded skill files
│   └── dev-kit-*/
├── docs/                # Embedded documentation
│   └── ONBOARDING.md
├── package.json
├── tsconfig.json
└── build.ts             # Build script
```

### package.json Configuration

```json
{
  "name": "dev-kit-cli",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "bun run build.ts",
    "build:all": "bun run build-all.ts",
    "dev": "bun run src/cli.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "commander": "^12.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "bun-types": "latest"
  }
}
```

### Build Script Example

```typescript
// build.ts
import { $ } from "bun";

const targets = [
  { os: "macos", arch: "arm64", bunTarget: "bun-darwin-arm64" },
  { os: "macos", arch: "x64", bunTarget: "bun-darwin-x64" },
  { os: "linux", arch: "x64", bunTarget: "bun-linux-x64" },
  { os: "linux", arch: "arm64", bunTarget: "bun-linux-arm64" },
  { os: "windows", arch: "x64", bunTarget: "bun-windows-x64" },
];

const version = JSON.parse(
  await Bun.file("./package.json").text()
).version as string;

await Promise.all(
  targets.map(async (target) => {
    const outfile = `./dist/dev-kit-${target.os}-${target.arch}`;
    const ext = target.os === "windows" ? ".exe" : "";

    console.log(`Building ${target.os} ${target.arch}...`);

    await $`bun build --compile \
      --target=${target.bunTarget} \
      --minify \
      --sourcemap \
      --bytecode \
      --define BUILD_VERSION='"${version}"' \
      ./src/cli.ts \
      --outfile ${outfile}${ext}
    `;

    // Generate checksum
    await $`shasum -a 256 ${outfile}${ext} > ${outfile}${ext}.sha256`;

    console.log(`✓ Built ${outfile}${ext}`);
  })
);

console.log("\n✅ All builds complete!");
```

---

## Testing Executables

### Local Testing

```bash
# Build for current platform
bun build --compile ./src/cli.ts --outfile dev-kit

# Test
./dev-kit --version
./dev-kit init --help
./dev-kit install-skills claude-code
```

### Cross-Platform Testing

**Option 1: Docker**

```bash
# Test Linux build on macOS
docker run --rm -v $(pwd):/app ubuntu:latest ./app/dev-kit-linux-x64 --version
```

**Option 2: GitHub Actions**

```yaml
# .github/workflows/test-builds.yml
name: Test Builds

on: [push]

jobs:
  test:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - run: ./dist/dev-kit --version
```

---

## Distribution

### GitHub Releases

1. **Build all platforms:**
   ```bash
   bun run build:all
   ```

2. **Create release:**
   ```bash
   gh release create v1.0.0 \
     dist/dev-kit-macos-arm64 \
     dist/dev-kit-macos-arm64.sha256 \
     dist/dev-kit-macos-x64 \
     dist/dev-kit-macos-x64.sha256 \
     dist/dev-kit-linux-x64 \
     dist/dev-kit-linux-x64.sha256 \
     dist/dev-kit-windows-x64.exe \
     dist/dev-kit-windows-x64.exe.sha256
   ```

### Installation Script

```bash
# install.sh
#!/bin/bash
VERSION="1.0.0"
BINARY_NAME="dev-kit"

# Detect OS and arch
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case $OS in
  darwin) OS="macos" ;;
  linux) OS="linux" ;;
  mingw*) OS="windows" ;;
esac

case $ARCH in
  x86_64) ARCH="x64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

# Download
FILE="dev-kit-${OS}-${ARCH}"
if [ "$OS" = "windows" ]; then FILE="${FILE}.exe"; fi

echo "Downloading $FILE..."
curl -L "https://github.com/user/dev-kit/releases/download/v${VERSION}/${FILE}" -o dev-kit

# Verify checksum
echo "Verifying checksum..."
curl -L "https://github.com/user/dev-kit/releases/download/v${VERSION}/${FILE}.sha256" -o dev-kit.sha256
shasum -a 256 -c dev-kit.sha256

# Install
chmod +x dev-kit
sudo mv dev-kit /usr/local/bin/

echo "dev-kit v${VERSION} installed successfully!"
```

---

## Best Practices

### Do's

✅ Use `--bytecode` for faster startup
✅ Embed assets with `with { type: "file" }`
✅ Cross-compile for all target platforms
✅ Generate SHA256 checksums for releases
✅ Use `--minify --sourcemap` for production
✅ Code sign executables for distribution
✅ Test on actual target platforms

### Don'ts

❌ Don't embed files larger than 10MB (performance)
❌ Don't use `--no-bundle` (not supported with `--compile`)
❌ Don't build Windows ARM64 (not supported yet)
❌ Don't forget to test built executables
❌ Don't skip checksums (security risk)

---

## Common Issues

### Issue: "Command not found" after cross-compilation

**Cause:** Building for wrong platform/architecture

**Fix:**
```bash
# Check your platform
uname -s    # OS
uname -m    # Architecture

# Use correct target
bun build --compile --target=bun-linux-x64 ./cli.ts --outfile dev-kit
```

### Issue: Embedded files not found

**Cause:** Files not included in build

**Fix:**
```bash
# Include files in entrypoints
bun build --compile ./cli.ts ./skills/**/*.md --outfile dev-kit

# Or use glob pattern in build script
```

### Issue: Executable too large

**Cause:** Including unnecessary dependencies or assets

**Fix:**
```bash
# 1. Enable minification
bun build --compile --minify ./cli.ts --outfile dev-kit

# 2. Lazy load assets
# 3. Tree-shake unused code
# 4. Compress assets before embedding
```

### Issue: Slow startup

**Cause:** JavaScript parsing overhead

**Fix:**
```bash
# Enable bytecode compilation
bun build --compile --bytecode ./cli.ts --outfile dev-kit
```

---

## Open Questions

1. **Executable Size:** Bun runtime is ~80MB - can we reduce this?
2. **Asset Updates:** How to update embedded skills without rebuilding executable?
3. **Plugin System:** Should we support external plugins loaded at runtime?
4. **Auto-Updates:** Should CLI check for updates and download new versions?
5. **Telemetry:** Anonymous usage tracking for improvement?

---

## Sources

- [Bun Single-File Executables Documentation](https://bun.sh/docs/bundler/executables)
- [Bun Build Documentation](https://bun.sh/docs/builder)
- [Bun 1.3 Release Notes (Cross-Compilation)](https://bun.com/blog/bun-v1.3)
- [Embed Directory in Executable (GitHub Issue #5445)](https://github.com/oven-sh/bun/issues/5445)
- [Bun Build --Compile with Embedded Assets (StackOverflow)](https://stackoverflow.com/questions/79314216/bun-build-compile-with-embedded-assets)
- [Cross-Compilation Guide](https://developer.mamezou-tech.com/en/blogs/2024/05/20/bun-cross-compile/)
- [Bun v1.3 Makes Deployment Simple](https://javascript.plainenglish.io/bun-v1-3-makes-building-and-deploying-javascript-apps-shockingly-simple-ecda8e06ace0)
