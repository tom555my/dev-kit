# dev-kit Technical Documentation

## Overview

dev-kit is a skill-based toolkit for Claude Code that provides reusable agent workflows for software development tasks. The system uses Claude Code's skill execution model to provide context-aware, autonomous development assistance. Each skill is a self-contained workflow with specific inputs, outputs, and quality rules.

## Architecture

### High-Level Design

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Claude Code   │─────▶│  npx skills CLI │─────▶│  npm Registry   │
│   (Execution)   │      │ (Installation)  │      │   (Distribution)│
└────────┬────────┘      └─────────────────┘      └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                    dev-kit Skills                        │
├─────────────┬─────────────┬─────────────┬───────────────┤
│  dev-kit.   │  dev-kit.   │  dev-kit.   │  dev-kit.     │
│    init     │   ticket    │  research   │    work       │
├─────────────┼─────────────┼─────────────┼───────────────┤
│  dev-kit.   │  dev-kit.   │                           │
│   refine    │   review    │                           │
└─────────────┴─────────────┴─────────────┴───────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  .dev-kit/  │      │  .dev-kit/  │      │  .dev-kit/  │
│   docs/     │      │  tickets/   │      │ knowledge/  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Execution Flow

1. **User invokes skill** via Claude Code (e.g., `/dev-kit.init`)
2. **Claude Code loads skill** from `.claude/skills/<skill-name>/SKILL.md`
3. **Skill defines workflow** with specific steps and quality rules
4. **Agent executes workflow** autonomously, reading/writing files
5. **Outputs delivered** as documentation, tickets, or code

## Core Components

### 1. dev-kit.init (Initialization Skill)

**Purpose**: Generate project documentation (PROJECT.md and TECH.md) and research technology stack.

**Inputs**:
- `project description` (required): Text description of project
- Audience, depth, project code, output scope (clarified interactively)

**Workflow**:
1. Clarify requirements with user
2. Ingest evidence from codebase (README, package.json, configs)
3. Propose outline for both docs
4. Draft PROJECT.md and TECH.md
5. Extract technologies with versions
6. Auto-invoke `/dev-kit.research` for each major technology

**Outputs**:
- `.dev-kit/docs/PROJECT.md`
- `.dev-kit/docs/TECH.md`
- Knowledge files in `.dev-kit/knowledge/`

**Quality Rules**:
- Be specific with numbers, owners, environments
- Reduce fluff; prefer bullets
- Fit audience (exec → outcomes, eng → systems, ops → runbooks)

### 2. dev-kit.ticket (Ticket Generation Skill)

**Purpose**: Create structured tickets with dependency analysis.

**Inputs**:
- User request describing feature/bug/enhancement
- Project context from `.dev-kit/docs/`

**Workflow**:
1. Parse user request
2. Analyze project state for prerequisites
3. Identify dependencies and blockers
4. Create prerequisite tickets if needed
5. Generate tickets in standard format
6. STOP (do not implement unless explicitly asked)

**Outputs**:
- Ticket files: `.dev-kit/tickets/XXXX-ddd-brief-title.md`
- Summary table with dependencies

**Ticket Format**:
```markdown
---
title: <Descriptive title>
category: Research | Feature | Bug | Enhancement | Chore
---

## User Story
- As a [persona], I [want to], [so that]

## Acceptance Criteria
- AC1
- AC2

## References
- [Links to docs, designs, etc.]
```

**Prerequisite Detection**:
- Architecture decisions (framework, stack, hosting)
- Foundation infrastructure (auth, API, database)
- External integrations (payment, messaging, GenAI)
- Observability and testing

### 3. dev-kit.research (Research Skill)

**Purpose**: Research topics and generate version-specific knowledge files.

**Inputs**:
- Research topic or technology name
- Context about what aspects to research

**Workflow**:
1. Define research scope
2. Search for documentation, examples, best practices
3. Extract key information with citations
4. Generate knowledge file in Markdown
5. Save to `.dev-kit/knowledge/<topic>-<version>.md`

**Outputs**:
- `.dev-kit/knowledge/<technology>-<year>.md`
- Structured with: Overview, Key Features, Usage Patterns, Common Pitfalls, References

### 4. dev-kit.work (Implementation Skill)

**Purpose**: Autonomously implement tickets from start to finish.

**Inputs**:
- `ticket` (required): Ticket filename or ID
- `additional_instruction` (optional): Extra context or constraints

**Workflow**:
1. Load ticket and parse requirements
2. Check prerequisites and dependencies
3. Implement all acceptance criteria autonomously
4. Test and verify implementation
5. Ask user confirmation
6. Move ticket to `tickets/completed/`

**Outputs**:
- Implemented code/features
- Implementation summary
- List of files created/modified
- Test results

**Key Principle**: Work autonomously through implementation, but always ask for confirmation before marking complete.

**Category Handling**:
- "Research" tickets → Redirect to `/dev-kit.research`
- Feature/Bug/Enhancement/Chore → Proceed with implementation

### 5. dev-kit.refine (Refinement Skill)

**Purpose**: Improve and consolidate documentation.

**Inputs**:
- Documentation files to refine
- Specific issues or areas of improvement

**Workflow**:
1. Read existing documentation
2. Identify inconsistencies, inaccuracies, or gaps
3. Consolidate duplicate content
4. Update to match current codebase state
5. Preserve important context while improving clarity

**Use Cases**:
- Documentation has drifted from implementation
- AI hallucinations detected in generated docs
- Major refactoring requires doc updates
- Duplicate content across multiple docs

### 6. dev-kit.review (Review Skill)

**Purpose**: Verify completed tickets against acceptance criteria.

**Inputs**:
- Completed ticket or pull request
- Project documentation for context

**Workflow**:
1. Read User Story and Acceptance Criteria
2. Verify implementation meets all criteria
3. Check code quality and standards
4. Validate against project patterns
5. Provide approval or feedback

**Outputs**:
- Review summary
- List of verified acceptance criteria
- Any issues found
- Approval/rejection decision

## Installation & Distribution

### Package Structure
```
@tommy555my/dev-kit/
├── package.json              # npm package manifest
├── .claude/
│   └── skills/
│       ├── dev-kit-init/
│       │   ├── SKILL.md      # Skill definition
│       │   ├── assets/       # Optional resources
│       │   ├── references/   # Templates, examples
│       │   └── scripts/      # Helper scripts
│       ├── dev-kit-ticket/
│       ├── dev-kit-research/
│       ├── dev-kit-work/
│       ├── dev-kit-refine/
│       └── dev-kit-review/
```

### Installation Methods

**Project-level** (recommended for team projects):
```bash
npx skills add tom555my/dev-kit
# Installs to .claude/skills/
```

**Global** (for personal use across projects):
```bash
npx skills add tom555my/dev-kit -g
# Installs to ~/.claude/skills/
```

**List skills before installing**:
```bash
npx skills add tom555my/dev-kit --list
```

**Install specific skills**:
```bash
npx skills add tom555my/dev-kit --skill dev-kit.init --skill dev-kit.ticket
```

### Skill Invocation

Skills are invoked through Claude Code:
```
/dev-kit.init <project description>
/dev-kit.ticket <feature request>
/dev-kit.research <technology or topic>
/dev-kit.work <ticket ID>
/dev-kit.refine <documentation files>
/dev-kit.review <ticket or PR>
```

## File Structure

### Project Layout
```
dev-kit/                          # Root repository
├── .claude/
│   └── skills/                   # Skill definitions
│       ├── dev-kit-init/
│       ├── dev-kit-ticket/
│       ├── dev-kit-research/
│       ├── dev-kit-work/
│       ├── dev-kit-refine/
│       └── dev-kit-review/
├── .dev-kit/                     # Generated content (not in repo)
│   ├── docs/                     # Project documentation
│   │   ├── PROJECT.md
│   │   └── TECH.md
│   ├── tickets/                  # Work tickets
│   │   ├── DKIT-001-*.md
│   │   └── completed/           # Completed tickets
│   └── knowledge/                # Research files
│       ├── nextjs-16.md
│       └── react-19.md
├── package.json                  # npm manifest
├── CLAUDE.md                     # Project guidance for Claude
└── README.md                     # User documentation
```

### Skill File Structure

Each skill follows this structure:
```
<skill-name>/
├── SKILL.md                      # Required: skill definition
├── assets/                       # Optional: static resources
├── references/                   # Optional: templates, examples
└── scripts/                      # Optional: helper scripts
```

**SKILL.md Format**:
```markdown
---
name: skill-name
description: "Brief description of when to use this skill"
---

You are a <role>. Use the user-provided inputs to <action>.

## Workflow
1. Step 1
2. Step 2
...

## Quality Rules
- Rule 1
- Rule 2
...

## Inputs
- Input 1 (required): description
- Input 2 (optional): description

## Output
- Expected output format

<user-request>
$ARGUMENTS
</user-request>
```

## Dependencies

### Runtime Dependencies
None (skills are declarative; Claude Code provides execution)

### Development Dependencies
- **oxfmt** (v0.26.0): Code formatter for consistent style

### External Dependencies
- **Claude Code**: Agent execution environment
- **npx skills**: Skill installation and management
- **npm registry**: Package distribution

## Development Workflow

### Skill Creation
1. Create skill directory: `.claude/skills/<skill-name>/`
2. Write SKILL.md with:
   - Name and description
   - Workflow steps
   - Quality rules
   - Input/output specifications
3. Add optional assets/references/scripts
4. Test skill locally
5. Update version in package.json
6. Publish to npm registry

### Skill Interaction Patterns

**Sequential**:
```
/dev-kit.init → /dev-kit.research (auto-invoked) → /dev-kit.ticket → /dev-kit.work → /dev-kit.review
```

**Iterative**:
```
/dev-kit.ticket → /dev-kit.work → /dev-kit.refine → /dev-kit.work
```

**Independent**:
```
/dev-kit.research (standalone knowledge gathering)
/dev-kit.refine (standalone doc improvement)
```

### Error Handling
- Skills validate inputs before execution
- Clarification questions asked when requirements ambiguous
- Assumptions stated explicitly when information missing
- Failed implementations marked with issues in tickets

## Extension Points

### Adding New Skills

1. **Create skill directory**:
   ```bash
   mkdir -p .claude/skills/dev-kit-<name>
   ```

2. **Write SKILL.md**:
   - Define clear purpose and when to use
   - Specify workflow steps
   - Document quality rules
   - Describe inputs and outputs

3. **Add optional components**:
   - `references/`: Templates, examples
   - `assets/`: Images, diagrams
   - `scripts/`: Helper bash scripts

4. **Test skill**:
   - Install locally: `npx skills add .`
   - Invoke through Claude Code
   - Verify outputs

5. **Update package.json**:
   - Increment version
   - Update README with new skill

### Customizing Workflows

Skills can be customized by:
- Modifying SKILL.md workflow steps
- Adding new quality rules
- Changing output formats
- Extending with new references/templates

### Integration Hooks

- **Ticket numbering**: Customize project code in `/dev-kit.init`
- **Documentation templates**: Modify in skill `references/` directories
- **Research sources**: Add new sources in `/dev-kit.research` skill

## Code Quality

### Formatting
- **Tool**: oxfmt (v0.26.0)
- **Command**: `pnpm format`
- **Check only**: `pnpm format:check`

### Documentation Standards
- Be specific with numbers, versions, environments
- Prefer bullets over paragraphs
- Use active voice and direct sentences
- Include assumptions and open questions

### Testing
- Manual testing of each skill
- Verification of generated artifacts
- User acceptance testing

## Deployment

### Publishing to npm
```bash
# Update version
npm version patch|minor|major

# Publish
npm publish

# Or use pnpm
pnpm publish
```

### Versioning
- **Semantic versioning**: Major.Minor.Patch
- **Major**: Breaking changes to skills
- **Minor**: New skills or features
- **Patch**: Bug fixes, documentation updates

### Installation by Users
```bash
# Install all skills
npx skills add tom555my/dev-kit

# Install specific skills
npx skills add tom555my/dev-kit --skill dev-kit.init

# Update to latest version
npx skills add tom555my/dev-kit --force
```

## Open Questions

- **Skill versioning**: How to handle breaking changes in installed skills?
- **Telemetry**: Should usage be tracked for improvement?
- **Offline mode**: Can skills work without internet access?
- **Multi-language support**: Should skills support non-English workflows?
- **Skill marketplace**: Should there be a way to discover third-party skills?
