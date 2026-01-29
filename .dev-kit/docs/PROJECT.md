# dev-kit Project Overview

## Summary

dev-kit is a development toolkit designed for developers and AI-assisted development workflows ("vibe-coders"). It provides a collection of reusable agent workflow skills that streamline project initialization, documentation, ticket management, research, and code implementation. The toolkit is distributed as an npm package and integrates with Claude Code's skill system.

## Problem Statement

Developers and AI-assisted development teams face several challenges:
- **Inconsistent documentation**: Projects lack standardized documentation structures
- **Fragmented workflows**: No unified approach to ticket generation, research, and implementation
- **AI-human collaboration gaps**: AI agents need clear workflows and context to work effectively alongside developers
- **Repetitive setup**: Each new project requires reinventing documentation and workflow structures

dev-kit addresses these problems by providing opinionated, reusable agent workflows that enforce best practices and accelerate development.

## Goals

1. **Standardize project documentation** through automated PROJECT.md and TECH.md generation
2. **Streamline ticket management** with structured ticket generation and dependency tracking
3. **Enable AI-assisted research** that creates reusable knowledge files for technology stacks
4. **Automate implementation workflows** where agents can autonomously complete tickets
5. **Provide refinement tools** to improve AI-generated documentation iteratively
6. **Ensure quality control** through structured review processes for completed work

## Non-Goals

- **Project-specific templates**: dev-kit provides workflows, not opinionated project scaffolding
- **CI/CD pipeline management**: DevOps workflows are out of scope
- **Hosting/deployment infrastructure**: Focus is on development workflows, not production deployment
- **Custom AI model training**: Uses existing Claude Code infrastructure; no model fine-tuning
- **Project management dashboards**: No UI or visualization tools for ticket tracking

## Users

### Primary Users
- **Developers**: Software engineers building projects with AI assistance
- **Vibe-coders**: Developers who heavily leverage AI agents in their workflow
- **Technical leads**: Engineers establishing project documentation and workflow standards

### Secondary Users
- **Contributors**: Developers extending dev-kit with new skills or improvements
- **DevOps engineers**: Teams integrating dev-kit workflows into CI/CD pipelines

## Scope

### Core Features

#### 1. Project Initialization (`/dev-kit.init`)
- Generate PROJECT.md and TECH.md from project descriptions
- Automatically research technology stack components
- Create documentation structure in `.dev-kit/docs/`
- Establish project codes for ticket tracking

#### 2. Ticket Management (`/dev-kit.ticket`)
- Create structured tickets from requirements
- Analyze dependencies and prerequisites
- Generate tickets in standard Markdown format
- Support feature, bug, enhancement, research, and chore categories

#### 3. Research Workflows (`/dev-kit.research`)
- Research technology topics and generate knowledge files
- Create version-specific documentation (e.g., "Next.js 16", "React 19")
- Store research in `.dev-kit/knowledge/` for reuse
- Provide citations and sources

#### 4. Implementation Workflows (`/dev-kit.work`)
- Autonomous implementation of tickets
- Follow acceptance criteria without step-by-step guidance
- Move completed tickets to `tickets/completed/`
- Generate implementation summaries

#### 5. Documentation Refinement (`/dev-kit.refine`)
- Improve AI-generated documentation
- Consolidate duplicate content
- Update docs after major refactoring
- Verify accuracy against codebase

#### 6. Review Processes (`/dev-kit.review`)
- Verify implementation against user stories
- Check acceptance criteria compliance
- Quality assurance for completed tickets
- Approval workflows

### Distribution
- npm package: `@tommy555my/dev-kit`
- Install via `npx skills` (project-level or global)
- Skills stored in `.claude/skills/` or `~/.claude/skills/`

### File Structure
```
.claude/skills/          # Agent workflow definitions
.dev-kit/docs/           # Project documentation (PROJECT.md, TECH.md)
.dev-kit/tickets/        # Active and completed tickets
.dev-kit/knowledge/      # Technology research files
```

## Success Metrics

### Adoption Metrics
- Number of projects installing dev-kit skills
- Frequency of skill invocations per project
- Global vs. project-level installation ratio

### Quality Metrics
- Ticket completion rate (tickets moved to `completed/`)
- Documentation refinement rate (iterations per document)
- User-reported satisfaction with generated artifacts

### Workflow Efficiency
- Time saved on project initialization
- Reduction in manual documentation tasks
- Autonomous implementation success rate

## Risks & Dependencies

### Risks
- **Claude Code compatibility**: Changes to Claude Code's skill system could break integration
- **AI hallucination**: Generated documentation or code may contain inaccuracies
- **Over-reliance on automation**: Teams may skip critical review steps
- **Skill versioning**: Managing updates to installed skills across projects

### Dependencies
- **Claude Code**: Primary execution environment for agent workflows
- **npx skills**: Distribution and installation mechanism
- **npm registry**: Package hosting and version management
- **oxfmt**: Code formatting (dev dependency, v0.26.0)

### Mitigation Strategies
- Version pinning for critical dependencies
- Clear documentation of assumptions and open questions
- Review workflows as mandatory steps
- Refinement tools for iterative improvement

## Open Questions

- Should dev-kit provide a CLI for direct skill invocation (vs. through Claude Code)?
- How should skill updates be handled in existing projects?
- Should there be a mechanism for sharing knowledge files across projects?
- What telemetry (if any) should be collected for usage analytics?
