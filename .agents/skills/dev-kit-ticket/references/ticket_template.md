# Standard Ticket Template

All tickets in `.dev-kit/tickets/` must follow this format:

```markdown
---
title: <Create a descriptive title>
category: <It can ONLY have the value of "Research" | "Feature" | "Bug" | "Enhancement" | "Chore">
---

## User Story

- As a [persona], I [want to], [so that].

## Acceptance Criteria

- AC1
- AC2

## References

- [PLANNINGDOC1](https://example.com)
- [FIGMADOC1](https://example.com)
- [TECHDOCUMENTATION1](https://example.com)
- [TECHDOCUMENTATION2](https://example.com)
```

## Example Ticket

```markdown
---
title: Implement Dark Mode Toggle
category: Feature
---

## User Story

- As a user, I want to be able to toggle between light and dark modes, so that I can comfortably use the application in different lighting conditions.

## Acceptance Criteria

- A theme toggle component is visible in the global navigation bar.
- Clicking the toggle immediately switches the application theme between 'light' and 'dark' without a page reload.
- The user's theme preference is persisted in `localStorage` so it remains consistent across sessions.
- The application detects and respects the system's preferred color scheme on the first visit.
- All core components (buttons, cards, backgrounds) meet WCAG AA contrast standards in both modes.

## References

- [Brand Design - Foundation Colors](https://www.figma.com/file/example-brand-colors)
- [React Theme Provider Documentation](https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions)
- [Local Storage API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
```

## Category Values

The `category` field must be one of:
- **Research**: Investigation and documentation tasks
- **Feature**: New functionality or capabilities
- **Bug**: Fixes for defects or issues
- **Enhancement**: Improvements to existing functionality
- **Chore**: Maintenance, refactoring, or minor tasks

## Ticket Numbering

- Format: `XXXX-ddd-brief-title.md`
- XXXX: 4-character project code (e.g., PROJ, CODE, DKIT)
- ddd: Sequential number (001, 002, 003...)
- Example: `PROJ-001-setup-stripe-integration.md`
