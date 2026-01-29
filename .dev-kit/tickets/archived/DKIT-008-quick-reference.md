# dev-kit onboard Command - Quick Reference

## Usage

```bash
dev-kit onboard [options]
```

## Options

| Option | Description | Example |
|--------|-------------|---------|
| `--output <format>` | Output format: terminal, markdown, plain, json | `--output markdown` |
| `--section <name>` | Display specific section | `--section quick-start` |
| `--open` | Open guide in browser | `--open` |
| `--update` | Fetch latest guide (not implemented) | `--update` |
| `--no-pager` | Disable paging for long content | `--no-pager` |

## Examples

### Basic usage (terminal with colors)
```bash
dev-kit onboard
```

### Display specific section
```bash
dev-kit onboard --section quick-start
dev-kit onboard --section workflows
dev-kit onboard --section faq
dev-kit onboard --section troubleshooting
```

### Export to different formats
```bash
dev-kit onboard --output markdown > guide.md
dev-kit onboard --output plain > guide.txt
dev-kit onboard --output json > guide.json
```

### Open in browser
```bash
dev-kit onboard --open
```

### Combine options
```bash
dev-kit onboard --section quick-start --output plain
dev-kit onboard --no-pager --output markdown
```

## Available Sections

- `quick-start` or `quickstart` - Quick Start guide
- `overview` - Overview section
- `workflows` or `workflow` - Workflow Overview
- `examples` or `example` - Example Workflows
- `faq` - Frequently Asked Questions
- `troubleshooting` - Troubleshooting guide
- `next-steps` - Next Steps section

## Terminal Formatting

The command automatically detects terminal capabilities and applies appropriate formatting:

- **Colors**: 5 header levels (green → yellow → blue → magenta → cyan)
- **Code blocks**: Cyan color with proper formatting
- **Inline code**: Cyan color
- **Bold text**: White/bold formatting
- **Auto-pager**: Uses `less` for long content (respects --no-pager)

## Environment Variables

The command respects these environment variables:

- `TERM` - Terminal type (e.g., xterm-256color)
- `FORCE_COLOR` - Force color output (0 or 1)
- `TERM_LINES` - Terminal height (for pager detection)
- `TERM_COLUMNS` - Terminal width (for formatting)
- `NO_COLOR` - Disable color output if set

## Implementation Details

**File**: `cli/src/commands/onboard.ts` (549 lines)
**Tests**: `cli/src/commands/tests/onboard.test.ts` (148 lines)
**Test Coverage**: 19 tests, 100% pass rate

### Key Methods

- `execute()` - Main entry point, parses options and routes to appropriate display method
- `loadOnboardingGuide()` - Loads guide from multiple possible paths
- `displayTerminal()` - Formats and displays with ANSI colors
- `displaySection()` - Extracts and displays specific section
- `extractSection()` - Parses markdown to find section boundaries
- `addColorFormatting()` - Applies ANSI color codes
- `detectTerminalCapabilities()` - Checks TERM environment
- `openInBrowser()` - Opens guide in default browser

## Integration with dev-kit

The `dev-kit onboard` command integrates with:
- Onboarding guide from `docs/ONBOARDING.md` (created in DKIT-003)
- CLI framework using Commander.js
- Logger for consistent output formatting
- Error handling for graceful degradation

## Next Steps

After users complete onboarding, they can:
1. Initialize dev-kit: `dev-kit init <agent>`
2. Create project docs: `/dev-kit.init "Project description"`
3. Create work tickets: `/dev-kit.ticket "Feature description"`
4. Work on tickets: `/dev-kit.work DKIT-XXX`
