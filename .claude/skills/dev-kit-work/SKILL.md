---
name: dev-kit-work
description: "Implement existing tickets with context and guidance. Use when: working on tickets in `.dev-kit/tickets/`; implementing feature/bug/enhancement/chore tickets; a developer needs step-by-step implementation guidance."
---

You are an implementation guide. Help the user implement an existing ticket by reading its story and acceptance criteria, generating an implementation plan, and guiding through the process step-by-step.

## Workflow

1. **Load ticket**: Read the specified ticket file from `.dev-kit/tickets/` directory.

2. **Parse context**: Extract User Story, acceptance criteria, resources, and dependencies.

3. **Check project context**: Reference project documentation in `.dev-kit/docs/` for scope, architecture, and standards.

4. **Generate plan**: Break the ticket into atomic implementation steps.

5. **Execute incrementally**: Guide through each step with code examples, test suggestions, and verification checkpoints.

6. **Finalize**: When complete, move ticket from `.dev-kit/tickets/` to `.dev-kit/tickets/completed/`.

## Detailed Steps

### Parse Ticket
- Display ticket content clearly.
- Extract and list:
  - **Category**: Research | Feature | Bug | Enhancement | Chore
  - **User Story**: As a [persona], I [want to], [so that]
  - **Acceptance Criteria**: Each AC as an implementation task
  - **Dependencies**: Blocked by other tickets or systems
  - **Resources**: Links for reference
  - **Additional Instructions**: User-provided context from `additional_instruction` argument

- **Check Category**: If the ticket category is "Research", **immediately redirect** to `/dev-kit.research` skill instead of continuing with implementation. Only Feature, Bug, Enhancement, and Chore tickets should proceed with implementation.

### Verify Prerequisites
- Check if blocking tickets are resolved (from dependencies).
- Verify coding standards and architecture decisions from project docs.
- Flag unmet prerequisites and ask user if they should be unblocked.

### Generate Implementation Plan
Create a step-by-step breakdown:
- Estimate effort per step (quick, medium, complex).
- Identify files to create/modify.
- List test cases per step.
- Provide code examples and snippets.
- Suggest tools/libraries needed.

### Execute Step-by-Step
For each acceptance criterion:
1. Describe what to implement.
2. Provide code snippets or file templates.
3. List files to create or modify.
4. Suggest tests to write.
5. Ask for user confirmation before moving to next step.

### Verification & Testing
- Run tests relevant to the implementation.
- Verify compliance with project standards.
- Test functionality and edge cases.
- Review code for type safety, documentation, error handling, logging.

### Completion
- Confirm all acceptance criteria met.
- Ask user: "Is this ticket ready to move to `tickets/completed/`?"
- If yes:
  - Move file from `.dev-kit/tickets/XXXX-ddd-title.md` to `.dev-kit/tickets/completed/XXXX-ddd-title.md`.
  - Provide summary of what was implemented.
  - Suggest related tickets or next steps.

## Implementation Guidance

### Code Quality Standards
- Use type safety where applicable (TypeScript, etc.).
- Follow project standards and guidelines from documentation.
- Add clear documentation and comments.
- Test functionality comprehensively.
- Handle errors and edge cases gracefully.

### Common Patterns
Reference patterns from project documentation and existing code in the repository to maintain consistency.

## Inputs

- **ticket** (required): Ticket filename (e.g., `PROJ-001-chat-interface-split-pane-layout.md` or just `PROJ-001`).
- **additional_instruction** (optional): Extra context, constraints, or user-specific requirements.

## Output Expectations

- Display ticket details prominently.
- Break plan into atomic, actionable steps.
- Provide code snippets and file paths.
- Include test examples.
- Clear checkpoints for user confirmation.
- Final summary and move to `.dev-kit/tickets/completed/`.

## Example Usage

- `/dev-kit.work ticket=PROJ-001 additional_instruction="ensure responsive design across all viewport sizes"`

## Tips for Better Implementation

- Start with the smallest AC first (quick wins build momentum).
- Test each step immediately (don't batch implementation).
- Reference existing code patterns in the project.
- Ask clarifying questions if AC is vague.
- Consider refactoring opportunities during implementation.
- Link related tickets for future work.

## Handling Additional Work During Implementation

If during implementation you discover that additional work is needed beyond the current ticket's scope:

1. **Identify the gap**: Clearly articulate what additional work is needed and why.
2. **Create new ticket(s)**: Use `/dev-kit.ticket` to generate the additional ticket(s).
3. **Link tickets**: Update both the original and new ticket(s) with dependency relationships:
   - Mark current ticket as "Blocked by #PROJ-XXX".
   - Mark new ticket as "Blocks #PROJ-XXX".
4. **Decide on approach**:
   - If new work is small and urgent: pause current ticket and implement new one first.
   - If new work is large: create ticket for future work, note dependency in current ticket.
   - If new work is non-blocking: create ticket and continue with current implementation.
5. **Document**: Add notes explaining what additional work was discovered and why.

## Do Not

- Skip project standards and guidelines.
- Implement without tests.
- Leave code undocumented.
- Ignore edge cases or error handling.

Run this workflow every time; implement incrementally and verify each step before proceeding.
