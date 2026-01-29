# dev-kit Onboarding Guide

**Welcome to dev-kit!** 🚀

This guide will help you get started with dev-kit, a development toolkit that empowers developers and AI agents with structured workflows for documentation, ticket management, research, and code review.

**Time to get started:** 5 minutes
**Prerequisites:** An AI coding assistant (Claude Code, Cursor, OpenCode, or GitHub Copilot)

---

## Table of Contents

1. [What is dev-kit?](#what-is-dev-kit)
2. [Who Should Use dev-kit?](#who-should-use-dev-kit)
3. [Quick Start (5 Minutes)](#quick-start-5-minutes)
4. [Workflow Overview](#workflow-overview)
5. [Common Use Cases](#common-use-cases)
6. [Example Workflows](#example-workflows)
7. [Quick Reference](#quick-reference)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)
10. [Next Steps](#next-steps)
11. [Getting Help](#getting-help)

---

## What is dev-kit?

**dev-kit** is a development toolkit that provides AI-powered agent workflows to streamline software development tasks. It helps you:

- ✅ **Maintain up-to-date documentation** automatically
- ✅ **Create structured tickets** with acceptance criteria
- ✅ **Research and document** technical decisions
- ✅ **Review code** against standards
- ✅ **Reduce context-switching** when starting new tasks

### What dev-kit is NOT

- ❌ A project management tool (doesn't replace Jira, Linear, etc.)
- ❌ A CI/CD system (focuses on pre-commit workflows)
- ❌ An autonomous code generator (requires human oversight)
- ❌ A methodology enforcer (works with Agile, Scrum, etc.)

---

## Who Should Use dev-kit?

### For Developers

If you're tired of:
- Outdated documentation that doesn't match your code
- Spending hours gathering context before starting tasks
- Inconsistent ticket formats across your team
- Losing track of technical decisions and research

**dev-kit helps** by automating documentation, structuring work, and preserving knowledge.

### For Vibe-Coders

If you prefer:
- Natural language instructions over complex tools
- AI assistance that follows structured workflows
- Getting up to speed on new codebases quickly

**dev-kit is designed** for AI-native development with agent-friendly workflows.

### For AI Agents

If you're an AI coding assistant that:
- Executes structured workflows
- Generates and maintains documentation
- Creates and implements tickets
- Conducts technical research

**dev-kit provides** the workflow definitions you need.

---

## Quick Start (5 Minutes)

### Step 1: Install dev-kit Skills

**For Claude Code:**
```bash
# Copy skills to your personal skills directory
mkdir -p ~/.claude/skills
cp -r .claude/skills/dev-kit-* ~/.claude/skills/

# Verify installation
ls ~/.claude/skills/
```

**For GitHub Copilot:**
```bash
# Copy skills to Copilot skills directory
mkdir -p ~/.copilot-skills
cp -r .claude/skills/dev-kit-* ~/.copilot-skills/
```

**For Cursor:**
```bash
# Install as VS Code extension (coming soon)
# For now, use the CLI directly via terminal
```

**For OpenCode:**
```bash
# Use dev-kit CLI directly (no skill integration yet)
# See "CLI Installation" below
```

### Step 2: Initialize Your Project

In your project directory, ask your AI agent:

```bash
# Claude Code
/dev-kit.init "My project: a web application for task management"

# GitHub Copilot
@workspace Initialize dev-kit for this project

# Or run directly (if using CLI)
dev-kit init --agent claude-code
```

**What happens:**
1. AI analyzes your codebase
2. Creates `.dev-kit/docs/PROJECT.md` (product overview)
3. Creates `.dev-kit/docs/TECH.md` (technical architecture)
4. Researches your tech stack automatically
5. Generates knowledge files in `.dev-kit/knowledge/`

**Example output:**
```
✓ Generated PROJECT.md
✓ Generated TECH.md
✓ Researched Next.js 16 → .dev-kit/knowledge/nextjs-16.md
✓ Researched React 19 → .dev-kit/knowledge/react-19.md
✓ Researched Tailwind CSS 4 → .dev-kit/knowledge/tailwind-4.md
```

### Step 3: Create Your First Ticket

```bash
# Claude Code
/dev-kit.ticket "Add user authentication with email and password"

# GitHub Copilot
@workspace Create a ticket for adding user authentication
```

**What happens:**
1. AI analyzes requirements
2. Generates structured ticket with User Story and Acceptance Criteria
3. Identifies dependencies and prerequisites
4. Saves to `.dev-kit/tickets/XXXX-003-add-user-auth.md`

**Example ticket:**
```markdown
---
title: Add User Authentication with Email and Password
category: Feature
---

## User Story

- As a user, I want to sign up and log in with email/password, so that I can access my personalized dashboard.

## Acceptance Criteria

- User can register with email and password
- User can log in with email and password
- Password is hashed before storage
- Session is maintained across page refreshes
- Error messages shown for invalid credentials
```

### Step 4: Implement the Ticket

```bash
# Claude Code
/dev-kit.work ticket=DKIT-003

# GitHub Copilot
@workspace Work on ticket DKIT-003
```

**What happens:**
1. AI loads ticket context
2. Implements feature step-by-step
3. Follows acceptance criteria
4. Asks for confirmation at key checkpoints

### Step 5: Review the Implementation

```bash
# Claude Code
/dev-kit.review DKIT-003

# GitHub Copilot
@workspace Review ticket DKIT-003
```

**What happens:**
1. AI verifies implementation against User Story
2. Checks all Acceptance Criteria
3. Runs code quality checks
4. Reports any issues found

---

## Workflow Overview

dev-kit provides **6 core workflows** that cover the complete development lifecycle:

### 1. `/dev-kit.init` - Initialize Documentation

**When to use:** Starting a new project or onboarding to an existing codebase

**What it does:**
- Generates PROJECT.md (product overview, goals, user journeys)
- Generates TECH.md (architecture, tech stack, deployment)
- Researches your tech stack components
- Creates knowledge files with version-specific details

**Time:** 3-5 minutes
**Output:** `.dev-kit/docs/PROJECT.md`, `.dev-kit/docs/TECH.md`, `.dev-kit/knowledge/*.md`

**Example:**
```bash
/dev-kit.init "E-commerce platform with Next.js and Stripe"
```

---

### 2. `/dev-kit.ticket` - Create Work Tickets

**When to use:** Breaking down features, bugs, or improvements into implementable tasks

**What it does:**
- Creates structured tickets with User Story and Acceptance Criteria
- Identifies dependencies and blockers
- Categorizes work (Feature, Bug, Research, Enhancement, Chore)
- Includes implementation guidance

**Time:** 1-3 minutes per ticket
**Output:** `.dev-kit/tickets/XXXX-ddd-brief-title.md`

**Example:**
```bash
/dev-kit.ticket "Implement Stripe payment flow for subscriptions"
```

---

### 3. `/dev-kit.research` - Technical Research

**When to use:** Investigating new technologies, patterns, or best practices

**What it does:**
- Researches specific topics with latest information (2025)
- Documents findings in knowledge files
- Creates version-specific research (e.g., "Next.js 16" vs "Next.js 15")
- Builds queryable knowledge base over time

**Time:** 2-5 minutes
**Output:** `.dev-kit/knowledge/topic-name-version.md`

**Example:**
```bash
/dev-kit.research "Server Actions in Next.js 16"
```

---

### 4. `/dev-kit.work` - Implement Tickets

**When to use:** Executing work defined in tickets

**What it does:**
- Loads ticket context and requirements
- Implements feature according to Acceptance Criteria
- Verifies dependencies before starting
- Updates ticket status when complete

**Time:** Varies by ticket complexity
**Input:** Ticket filename (e.g., `DKIT-003`)

**Example:**
```bash
/dev-kit.work ticket=DKIT-003
```

---

### 5. `/dev-kit.refine` - Refine Documentation

**When to use:** Documentation has drifted or needs accuracy checks

**What it does:**
- Verifies documentation against current codebase
- Updates outdated content
- Consolidates duplicate information
- Removes inaccuracies

**Time:** 2-5 minutes
**Output:** Updated `.dev-kit/docs/` and `.dev-kit/knowledge/`

**Example:**
```bash
/dev-kit.refine "Check if TECH.md still matches our current architecture"
```

---

### 6. `/dev-kit.review` - Code Review

**When to use:** Verifying completed tickets or pull requests

**What it does:**
- Verifies implementation against User Story
- Checks all Acceptance Criteria
- Runs code quality analysis
- Reports issues and suggests improvements

**Time:** 2-5 minutes
**Input:** Ticket filename or PR number

**Example:**
```bash
/dev-kit.review DKIT-003
```

---

## Common Use Cases

### Use Case 1: Starting a New Project

**Workflow:** init → research → work → review

```bash
# 1. Initialize project
/dev-kit.init "My SaaS application"

# 2. Research unfamiliar tech
/dev-kit.research "Supabase authentication best practices"

# 3. Create and implement tickets
/dev-kit.ticket "Add Supabase auth integration"
/dev-kit.work ticket=DKIT-001

# 4. Review implementation
/dev-kit.review DKIT-001
```

---

### Use Case 2: Onboarding to Existing Codebase

**Workflow:** init → refine → work

```bash
# 1. Generate documentation (if missing)
/dev-kit.init "Analyze this codebase and generate docs"

# 2. Refine existing docs for accuracy
/dev-kit.refine "Update docs to match current state"

# 3. Start working on tickets
/dev-kit.ticket "Fix authentication bug"
/dev-kit.work ticket=DKIT-005
```

---

### Use Case 3: Feature Development

**Workflow:** ticket → research → work → review

```bash
# 1. Create ticket from requirements
/dev-kit.ticket "Add real-time notifications with WebSockets"

# 2. Research the technology
/dev-kit.research "WebSocket implementation in Next.js 16"

# 3. Implement the feature
/dev-kit.work ticket=DKIT-007

# 4. Review before merging
/dev-kit.review DKIT-007
```

---

### Use Case 4: Bug Fix

**Workflow:** ticket → work → review

```bash
# 1. Create bug ticket
/dev-kit.ticket "Fix memory leak in useEffect cleanup"

# 2. Implement fix
/dev-kit.work ticket=DKIT-012

# 3. Verify fix
/dev-kit.review DKIT-012
```

---

### Use Case 5: Technical Investigation

**Workflow:** research → (optional) ticket

```bash
# 1. Research the topic
/dev-kit.research "Compare Zustand vs Redux for state management in 2025"

# 2. Create ticket based on findings
/dev-kit.ticket "Migrate from Redux to Zustand based on research"
```

---

### Use Case 6: Documentation Maintenance

**Workflow:** refine → review

```bash
# 1. Refresh documentation
/dev-kit.refine "Update PROJECT.md after product pivot"

# 2. Review accuracy
/dev-kit.review "Verify all documentation is up-to-date"
```

---

## Example Workflows

### Example 1: Full Feature Development

**Scenario:** Add user profile management to your app

```bash
# Step 1: Create the ticket
> /dev-kit.ticket "Add user profile management with avatar upload, bio, and social links"

✓ Created ticket: DKIT-015-add-user-profile-management.md
✓ Identified 3 sub-tasks:
  - DKIT-016: Database schema for user profiles
  - DKIT-017: Profile CRUD API endpoints
  - DKIT-018: Profile UI components

# Step 2: Research avatar upload best practices
> /dev-kit.research "Image upload best practices for Next.js 16"

✓ Researched: .dev-kit/knowledge/image-upload-nextjs-16.md
✓ Key findings:
  - Use server actions for uploads
  - Store in S3 or similar
  - Optimize images before storage

# Step 3: Implement database schema
> /dev-kit.work ticket=DKIT-016

✓ Created migration: 20250128_create_user_profiles.sql
✓ Added model: UserProfile.ts
✓ Added validation schemas

# Step 4: Implement API endpoints
> /dev-kit.work ticket=DKIT-017

✓ Created endpoint: GET /api/profile/:id
✓ Created endpoint: PUT /api/profile/:id
✓ Created endpoint: POST /api/profile/avatar
✓ Added error handling

# Step 5: Implement UI components
> /dev-kit.work ticket=DKIT-018

✓ Created: ProfilePage.tsx
✓ Created: AvatarUploader.tsx
✓ Created: BioEditor.tsx
✓ Added form validation

# Step 6: Review implementation
> /dev-kit.review DKIT-015

✓ Verified: User Story met
✓ Verified: All Acceptance Criteria passed
✓ Code quality: Excellent
✓ Type safety: 100%
✓ Tests: Passing
```

---

### Example 2: Research and Decision

**Scenario:** Choose a state management solution

```bash
# Step 1: Research options
> /dev-kit.research "State management comparison for React 19 in 2025"

✓ Created: .dev-kit/knowledge/state-management-react-19.md
✓ Compared: Zustand, Redux Toolkit, Jotai, Recoil
✓ Recommendation: Zustand (simple, fast, great DX)

# Step 2: Document decision in project docs
# (Add to TECH.md manually or ask AI to help)

# Step 3: Create migration ticket
> /dev-kit.ticket "Migrate from Redux to Zustand"

✓ Created ticket: DKIT-019-migrate-to-zustand.md
✓ Breaking down into phases:
  - Phase 1: Install Zustand and create stores
  - Phase 2: Migrate auth state
  - Phase 3: Migrate UI state
  - Phase 4: Remove Redux dependencies
```

---

### Example 3: Bug Investigation and Fix

**Scenario:** Users report session timeout issues

```bash
# Step 1: Create investigation ticket
> /dev-kit.ticket "Investigate and fix session timeout issues"

✓ Created: DKIT-020-session-timeout-fix.md
✓ User Story: As a user, I want my session to persist correctly

# Step 2: Research session management
> /dev-kit.research "Next.js 16 session management best practices"

✓ Created: .dev-kit/knowledge/nextjs-session-management.md
✓ Found: Common cookie configuration issues

# Step 3: Implement fix
> /dev-kit.work ticket=DKIT-020

✓ Fixed: Cookie configuration in middleware
✓ Added: Proper session refresh logic
✓ Added: Tests for session persistence

# Step 4: Verify fix
> /dev-kit.review DKIT-020

✓ All acceptance criteria met
✓ Session now persists correctly
✓ No memory leaks detected
```

---

## Quick Reference

### Workflow Commands

| Command | Purpose | Time | Output |
|---------|---------|------|--------|
| `/dev-kit.init` | Initialize documentation | 3-5 min | PROJECT.md, TECH.md |
| `/dev-kit.ticket` | Create work ticket | 1-3 min | Ticket file |
| `/dev-kit.research` | Research topic | 2-5 min | Knowledge file |
| `/dev-kit.work` | Implement ticket | Varies | Code + docs |
| `/dev-kit.refine` | Refine documentation | 2-5 min | Updated docs |
| `/dev-kit.review` | Review implementation | 2-5 min | Review report |

### Directory Structure

```
your-project/
├── .dev-kit/
│   ├── docs/
│   │   ├── PROJECT.md          # Product overview
│   │   └── TECH.md             # Technical architecture
│   ├── knowledge/             # Research files
│   │   ├── nextjs-16.md
│   │   └── react-19.md
│   └── tickets/                # Work tickets
│       ├── DKIT-001-feature.md
│       └── DKIT-002-bug.md
└── .claude/
    └── skills/                 # Agent skills (if using Claude Code)
        ├── dev-kit-init/
        └── dev-kit-ticket/
```

### Ticket Categories

- **Feature**: New functionality
- **Bug**: Fix for defect or issue
- **Enhancement**: Improvement to existing functionality
- **Research**: Investigation and documentation
- **Chore**: Maintenance or refactoring

### Common Arguments

```bash
# Initialize with description
/dev-kit.init "E-commerce platform"

# Create ticket with requirements
/dev-kit.ticket "Add user authentication"

# Work on specific ticket
/dev-kit.work ticket=DKIT-001

# Research specific topic
/dev-kit.research "Next.js 16 Server Actions"

# Review specific ticket
/dev-kit.review DKIT-001
```

---

## Troubleshooting

### Issue: "Skill not found"

**Symptom:** AI doesn't recognize `/dev-kit.*` commands

**Solutions:**

1. **Check skill installation:**
   ```bash
   # Claude Code
   ls ~/.claude/skills/dev-kit-*

   # GitHub Copilot
   ls ~/.copilot-skills/dev-kit-*
   ```

2. **Verify SKILL.md format:**
   - Ensure frontmatter has `name` and `description`
   - Check file is in correct directory

3. **Restart AI agent:**
   - Close and reopen Claude Code / IDE
   - Reload the workspace

---

### Issue: "Documentation doesn't match code"

**Symptom:** Generated docs are outdated or inaccurate

**Solutions:**

1. **Run refinement:**
   ```bash
   /dev-kit.refine "Update documentation to match current code"
   ```

2. **Manually update docs:**
   - Edit `.dev-kit/docs/PROJECT.md` or `TECH.md`
   - Run `/dev-kit.refine` to verify changes

3. **Regenerate from scratch:**
   ```bash
   # Backup current docs
   cp -r .dev-kit/docs .dev-kit/docs.backup

   # Regenerate
   /dev-kit.init "Regenerate documentation"
   ```

---

### Issue: "Ticket dependencies not met"

**Symptom:** `/dev-kit.work` reports blocked dependencies

**Solutions:**

1. **Check blocking tickets:**
   ```bash
   # Read ticket file
   cat .dev-kit/tickets/DKIT-001-feature.md

   # Look for "Blocked by:" in dependencies
   ```

2. **Complete blocking tickets first:**
   ```bash
   /dev-kit.work ticket=DKIT-000  # Complete blocker
   /dev-kit.work ticket=DKIT-001  # Then this one
   ```

3. **Update dependencies if outdated:**
   - Edit ticket to remove completed blockers
   - Or create new ticket for missing prerequisite

---

### Issue: "Research returns outdated info"

**Symptom:** Knowledge file has old information

**Solutions:**

1. **Check knowledge file date:**
   ```bash
   # View file header for date
   head -5 .dev-kit/knowledge/topic-name-version.md
   ```

2. **Re-run research with current date:**
   ```bash
   /dev-kit.research "Topic name 2025"  # Include year
   ```

3. **Update manually:**
   - Edit knowledge file
   - Add source links
   - Update version numbers

---

### Issue: "Review finds problems"

**Symptom:** `/dev-kit.review` reports issues

**Solutions:**

1. **Read review output carefully:**
   - Note which acceptance criteria failed
   - Check specific issues mentioned

2. **Fix issues:**
   ```bash
   # Ask AI to fix specific issues
   "Fix the issues found in the review for DKIT-001"
   ```

3. **Re-run review:**
   ```bash
   /dev-kit.review DKIT-001
   ```

4. **Update ticket if needed:**
   - Edit acceptance criteria if they were unclear
   - Add notes about edge cases discovered

---

### Issue: "AI doesn't follow workflow"

**Symptom:** AI skips steps or doesn't use workflow correctly

**Solutions:**

1. **Be explicit:**
   ```bash
   # Instead of: "make docs"
   # Use: /dev-kit.init "Generate project documentation"

   # Instead of: "create ticket"
   # Use: /dev-kit.ticket "Add feature X"
   ```

2. **Provide context:**
   ```bash
   /dev-kit.ticket "Add user authentication using Supabase"
   ```

3. **Check skill description:**
   - Open `SKILL.md` file
   - Verify `description` field is clear
   - Update if needed

---

## FAQ

### General Questions

**Q: Is dev-kit free to use?**
A: Yes! dev-kit is open source and free to use.

**Q: What AI agents work with dev-kit?**
A: Claude Code, GitHub Copilot, Cursor (via CLI), and OpenCode (via CLI).

**Q: Can I use dev-kit without an AI agent?**
A: Yes! The workflows are documented, so you can follow them manually. The CLI will make this easier.

**Q: Does dev-kit work with any programming language?**
A: Yes, dev-kit is language-agnostic and works with any tech stack.

**Q: How much does dev-kit cost?**
A: Nothing! It's completely free and open source.

---

### Technical Questions

**Q: What's the difference between `/dev-kit.init` and `/dev-kit.refine`?**
A:
- `/dev-kit.init` - Creates documentation from scratch
- `/dev-kit.refine` - Updates existing documentation for accuracy

**Q: Do I need to use all 6 workflows?**
A: No! Use whichever workflows fit your needs. Start with `init`, `ticket`, and `work`.

**Q: Can I customize the workflows?**
A: Yes! The skill files are in `.claude/skills/dev-kit-*/SKILL.md`. Edit them to customize.

**Q: What file format are tickets?**
A: Tickets are Markdown files with YAML frontmatter. Easy to read and edit.

**Q: How does dev-kit handle version-specific research?**
A: Knowledge files include version in filename (e.g., `nextjs-16.md`) for accuracy.

---

### Workflow Questions

**Q: When should I run `/dev-kit.init`?**
A:
- Starting a new project
- Onboarding to an existing team
- Before a major refactoring
- When documentation is missing

**Q: How detailed should ticket requirements be?**
A: More detail = better tickets. Include:
- What you want (feature/bug fix)
- Who it's for (user persona)
- Why it matters (business value)
- Constraints (tech stack, timeline)

**Q: Can `/dev-kit.work` handle multiple tickets?**
A: One at a time. Complete dependencies first, then move to next ticket.

**Q: What if `/dev-kit.review` finds issues?**
A: Fix the issues and re-run review. The workflow ensures quality before merging.

**Q: How often should I run `/dev-kit.refine`?**
A: Whenever:
- Code has changed significantly
- Documentation feels outdated
- Before releases
- After major refactors

---

### Integration Questions

**Q: Can I use dev-kit with GitHub Projects?**
A: Yes! dev-kit complements project management tools. Copy ticket content to GitHub Issues.

**Q: Does dev-kit integrate with CI/CD?**
A: Not currently. dev-kit focuses on pre-commit workflows, but you could add `/dev-kit.review` to CI.

**Q: Can I share tickets with my team?**
A: Yes! Tickets are Markdown files in `.dev-kit/tickets/`. Commit them to version control.

**Q: How do I backup my dev-kit data?**
A: The `.dev-kit/` directory contains everything. Commit it to git for automatic backup.

---

### Best Practices

**Q: What's the recommended workflow?**
A:
1. Start: `/dev-kit.init`
2. Plan: `/dev-kit.ticket` (create multiple tickets)
3. Research: `/dev-kit.research` (unfamiliar tech)
4. Build: `/dev-kit.work` (implement tickets)
5. Verify: `/dev-kit.review` (quality check)
6. Maintain: `/dev-kit.refine` (keep docs fresh)

**Q: Should I commit `.dev-kit/` to version control?**
A: Yes! Recommended structure:
- ✅ Commit: `.dev-kit/docs/`, `.dev-kit/tickets/`, `.dev-kit/knowledge/`
- ❌ Optional: `.dev-kit/tickets/completed/` (can archive)

**Q: How do I handle large features?**
A: Break into smaller tickets:
```
DKIT-010: Design database schema
DKIT-011: Implement API endpoints
DKIT-012: Build UI components
DKIT-013: Add tests
DKIT-014: Deploy and monitor
```

**Q: Can I use dev-kit for personal projects?**
A: Absolutely! It's great for solo developers. You'll have better documentation and structured work.

**Q: How do I get my team started?**
A:
1. Install dev-kit skills
2. Run `/dev-kit.init` on your project
3. Create 2-3 example tickets
4. Have team try `/dev-kit.work` on one ticket
5. Gather feedback and iterate

---

## Next Steps

### For Beginners

1. ✅ **Install dev-kit** - Follow Quick Start guide
2. ✅ **Initialize your project** - Run `/dev-kit.init`
3. ✅ **Create your first ticket** - Try `/dev-kit.ticket`
4. ✅ **Implement a ticket** - Use `/dev-kit.work`
5. ✅ **Review your work** - Run `/dev-kit.review`

### For Teams

1. ✅ **Standardize workflows** - Agree on which workflows to use
2. ✅ **Set up documentation** - Run `/dev-kit.init` on main projects
3. ✅ **Create ticket template** - Customize to your team's needs
4. ✅ **Train team members** - Share this onboarding guide
5. ✅ **Establish cadence** - When to run `/dev-kit.refine`

### For Advanced Users

1. ✅ **Customize skills** - Edit `.claude/skills/dev-kit-*/SKILL.md`
2. ✅ **Build integrations** - Create custom workflows
3. ✅ **Contribute** - Share improvements with the community
4. ✅ **Automate** - Integrate with CI/CD or git hooks
5. ✅ **Teach others** - Write blog posts, give talks

### Learn More

- **Advanced Workflows**: See [PROJECT.md](.dev-kit/docs/PROJECT.md) for deep dives
- **Technical Details**: See [TECH.md](.dev-kit/docs/TECH.md) for architecture
- **Agent Integration**: See [code-agent-integration-2025.md](.dev-kit/knowledge/code-agent-integration-2025.md)
- **CLI Building**: See [bun-single-file-executable-2025.md](.dev-kit/knowledge/bun-single-file-executable-2025.md)

---

## Getting Help

### Documentation

- **Project Docs**: [.dev-kit/docs/](.dev-kit/docs/)
- **Knowledge Base**: [.dev-kit/knowledge/](.dev-kit/knowledge/)
- **Workflow Definitions**: [.claude/skills/](.claude/skills/)

### Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/your-org/dev-kit/issues)
- **Discussions**: [Ask questions, share workflows](https://github.com/your-org/dev-kit/discussions)

### Resources

- **CLI Best Practices**: [clig.dev](https://clig.dev/)
- **Agent Skills Standard**: [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- **Documentation Guides**: [Diátaxis Framework](https://diataxis.fr/)

### Support

If you need help:
1. Check the [Troubleshooting](#troubleshooting) section
2. Search [GitHub Issues](https://github.com/your-org/dev-kit/issues)
3. Start a [Discussion](https://github.com/your-org/dev-kit/discussions)
4. Create a new issue with:
   - What you tried
   - What happened
   - Expected behavior
   - Environment details (OS, AI agent, etc.)

---

## Summary

You're now ready to use dev-kit! Here's what you learned:

✅ **What dev-kit is** - AI-powered development toolkit
✅ **How to install** - Copy skills to your AI agent
✅ **When to use workflows** - 6 core workflows for complete development lifecycle
✅ **Common use cases** - Real-world examples for every situation
✅ **Quick reference** - Commands, structure, categories
✅ **Troubleshooting** - Solve common issues
✅ **FAQ** - Answers to popular questions
✅ **Next steps** - Path for beginners, teams, and advanced users

**Remember:** Start small, iterate often, and keep your documentation fresh with `/dev-kit.refine`.

Happy coding! 🎉

---

**Last Updated:** 2025-01-28
**Version:** 1.0.0
**Maintained by:** dev-kit community
