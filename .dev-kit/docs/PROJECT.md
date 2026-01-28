# dev-kit (DKIT) - Project Overview

## Summary

**dev-kit** is a development toolkit that empowers developers and "vibe-coders" with AI-powered agent workflows to streamline software development tasks. It provides structured, repeatable workflows for documentation generation, ticket creation, research, implementation, refinement, and code review.

**Status**: Active Development  
**Project Code**: DKIT  
**Target Audience**: Software developers, AI agents, and vibe-coders (developers who prefer natural language instructions)

---

## Problem Statement

Modern software development involves repetitive tasks that are well-suited for AI assistance but lack standardized approaches:

- **Documentation Drift**: Project and technical documentation quickly becomes outdated as code evolves
- **Context Switching**: Developers waste time gathering context when starting new tasks
- **Inconsistent Processes**: Teams lack standardized workflows for research, ticket creation, and reviews
- **AI Integration**: No structured way to delegate development tasks to AI agents
- **Knowledge Fragmentation**: Technical research and decisions aren't consistently documented

**dev-kit** addresses these challenges by providing AI-native workflows that maintain documentation, structure work, and preserve knowledge.

---

## Goals & Non-Goals

### Goals
- Provide repeatable, AI-friendly workflows for common development tasks
- Maintain up-to-date project and technical documentation automatically
- Structure development work into well-defined, implementable tickets
- Document research and technical decisions in a queryable knowledge base
- Enable seamless collaboration between human developers and AI agents
- Reduce context-switching overhead when starting new tasks

### Non-Goals
- Replace project management tools (Jira, Linear, etc.) - dev-kit complements them
- Provide CI/CD infrastructure - focuses on pre-commit workflows
- Enforce specific development methodologies (Agile, Scrum, etc.)
- Generate production-ready code without human review
- Replace human decision-making in architectural choices

---

## Target Users

### Primary Users
1. **Developers**: Engineers who want structured workflows and automated documentation
2. **Vibe-Coders**: Developers who prefer natural language instructions and AI assistance
3. **AI Agents**: LLM-based coding assistants that execute structured workflows

### User Journeys

**Journey 1: New Project Setup**
1. Developer runs `/dev-kit.init` with project description
2. Agent generates PROJECT.md and TECH.md from codebase analysis
3. Agent automatically researches tech stack and creates knowledge files
4. Team has up-to-date documentation from day one

**Journey 2: Feature Development**
1. Developer provides feature requirements
2. Runs `/dev-kit.ticket` to generate structured tickets with acceptance criteria
3. AI or developer executes ticket using `/dev-kit.work`
4. After completion, runs `/dev-kit.review` to verify implementation
5. Knowledge base is updated with learnings

**Journey 3: Technical Research**
1. Developer encounters unfamiliar technology or pattern
2. Runs `/dev-kit.research` with research topic
3. Agent investigates and documents findings in `.dev-kit/knowledges/`
4. Future work references existing research, avoiding redundant investigations

---

## Core Features

### 1. Documentation Initialization (`/dev-kit.init`)
- Generates PROJECT.md (product overview and goals)
- Generates TECH.md (architecture and technical stack)
- Analyzes codebase for accurate, evidence-based documentation
- Automatically triggers tech stack research

### 2. Ticket Generation (`/dev-kit.ticket`)
- Creates structured tickets in `.dev-kit/tickets/`
- Includes User Story, Acceptance Criteria, Implementation Guidance
- Detects dependencies and prerequisites
- Categorizes tickets (feature, bug, research, refactor, etc.)

### 3. Research & Knowledge Management (`/dev-kit.research`)
- Investigates specific technologies or patterns
- Documents findings in `.dev-kit/knowledges/`
- Creates version-specific research (e.g., "Next.js 16", not just "Next.js")
- Builds queryable knowledge base over time

### 4. Ticket Implementation (`/dev-kit.work`)
- Loads ticket context and provides implementation guidance
- Redirects research tickets to `/dev-kit.research`
- Verifies dependencies are met before starting
- Updates ticket status upon completion

### 5. Documentation Refinement (`/dev-kit.refine`)
- Consolidates `.dev-kit/docs/` and `.dev-kit/knowledges/`
- Verifies documentation against current codebase
- Updates outdated content and removes inaccuracies
- Maintains documentation quality over time

### 6. Code Review (`/dev-kit.review`)
- Reviews completed tickets one at a time
- Verifies implementation against User Story and Acceptance Criteria
- Uses code analysis tools to validate changes
- Ensures quality standards are met

---

## Project Scope

### In Scope
- Workflow definitions and execution
- Documentation generation and maintenance
- Ticket creation and tracking
- Research documentation
- Code review assistance

### Out of Scope
- Hosting/deployment infrastructure
- Real-time collaboration features
- Version control integration (git operations)
- Database or persistent storage (uses file system)
- Authentication or multi-user access control

---

## Success Metrics

### Adoption Metrics
- Number of workflows executed per project
- Adoption rate across development teams
- Frequency of workflow usage (daily, weekly)

### Productivity Metrics
- Time saved on documentation tasks
- Context-switching time reduction
- Ticket completion velocity improvement
- Reduction in documentation drift incidents

### Quality Metrics
- Code review effectiveness (bugs caught)
- Documentation accuracy rate
- Knowledge base utilization (research reuse)
- Ticket implementation success rate (first-time completion)

---

## Technical Constraints

- **File-based storage**: All data stored in `.dev-kit/` directory structure
- **Markdown format**: Documentation uses GitHub-flavored Markdown
- **Agent compatibility**: Workflows must be parseable by LLM agents
- **No external dependencies**: Workflows run locally without external services
- **Version control friendly**: All artifacts are text-based and git-friendly

---

## Risks & Dependencies

### Risks
- **AI hallucinations**: Generated documentation may contain inaccuracies (mitigated by refinement workflow)
- **Context limits**: Large codebases may exceed LLM context windows (mitigated by focused analysis)
- **Workflow evolution**: Workflows may need updates as AI capabilities change
- **Adoption friction**: Teams may resist changing existing processes

### Dependencies
- AI agent/LLM with code analysis capabilities
- File system access for `.dev-kit/` directory
- Markdown rendering tooling for documentation viewing
- No external API dependencies

---

## Timeline

- **Phase 1 (Complete)**: Core workflows defined (`init`, `ticket`, `research`, `work`, `refine`, `review`)
- **Phase 2 (Current)**: Documentation and knowledge base establishment
- **Phase 3 (Planned)**: Workflow refinement based on usage feedback
- **Phase 4 (Future)**: Tool integrations and enhanced automation

---

## Glossary

- **Vibe-coder**: A developer who prefers natural language instructions and AI-assisted coding
- **Workflow**: A defined set of steps for accomplishing a development task
- **Ticket**: A structured work item with User Story, Acceptance Criteria, and Implementation Guidance
- **Knowledge file**: A research document in `.dev-kit/knowledges/` about a specific technology or pattern
- **Turbo annotation**: A workflow marker (`// turbo` or `// turbo-all`) indicating commands can be auto-executed

---

## Assumptions & Open Questions

### Assumptions
1. Users have access to an AI agent with code analysis capabilities
2. Projects use git for version control
3. Development teams are comfortable with Markdown documentation
4. File system access is available for `.dev-kit/` directory manipulation
5. Workflows will be executed in the project root directory

### Open Questions
1. Should workflows integrate with external project management tools?
2. What's the ideal frequency for running `/dev-kit.refine`?
3. Should knowledge files have expiration dates for version-specific content?
4. How should workflows handle monorepo structures?
5. Should there be a workflow for generating PR descriptions from tickets?
