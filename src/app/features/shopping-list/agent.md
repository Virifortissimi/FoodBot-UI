# Shopping List Feature Agent Instructions

## Purpose

This feature owns shopping-list generation, rendering, item state, section toggles, sharing, and list progress UX.

## Default Agent Mode

Use `Feature Builder`.

## Coding Rules

- Keep the UI responsive during item and section updates; optimistic updates are acceptable when rollback is handled.
- When adding new bulk actions, prefer backend endpoints that express the bulk intent instead of chaining many single-item calls.
- Loading and regenerate states should be explicit and user-visible.

## Integration Rules

- If item state contracts change, verify both single-item and section-level toggles.
- If sharing output changes, verify copy and share actions together.

## Learned Constraints

- Section-level toggles are clearer and more reliable when backed by one category update endpoint, not many individual toggles.
- Shopping list generation is currently integration-heavy; failure modes should be surfaced clearly rather than silently swallowed.
