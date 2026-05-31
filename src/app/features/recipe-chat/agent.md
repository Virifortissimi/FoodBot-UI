# Recipe Chat Feature Agent Instructions

## Purpose

This feature owns the interactive recipe chat experience and its chat-specific UI behavior.

## Default Agent Mode

Use `Feature Builder` and `UI Steward`.

## Coding Rules

- Preserve the rule-based conversational model unless a task explicitly changes the backend behavior.
- Loading, typing, and scroll behavior should support reading comfort, not just message delivery.
- Do not force-scroll users to the bottom if they have intentionally moved upward to read older messages.
- Brand language should reflect the product direction and not imply AI where the experience is intentionally rule-based.

## Integration Rules

- If auth token handling changes, verify hub or chat connection behavior.
- If message shape changes, verify the UI service, page state, and branding copy together.

## Learned Constraints

- Auto-scroll rules must respect user intent or the chat becomes frustrating during longer sessions.
- “Thinking” or typing states are a UX layer and should not falsely imply a different backend model than what is actually implemented.
