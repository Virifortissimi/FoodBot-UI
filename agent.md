# Frontend Agent Instructions

## Purpose

This project owns the app shell, public marketing pages, logged-in experience, custom API docs UI, and feature interactions.

## Default Agent Mode

Use `UI Steward` for layout, responsiveness, and interaction quality.
Use `Feature Builder` for feature work.
Use `Docs Keeper` for API docs and developer-facing content.

## Coding Rules

- Keep route-level pages focused on orchestration and presentation, with shared behavior in services when appropriate.
- Prefer clear UX states: loading, empty, error, success.
- Preserve the established design system tokens and global style conventions.
- If component-local styles become large or repeatedly hit Angular style budget limits, move stable styles into global styles.
- Keep authenticated app-shell behavior consistent across logged-in routes.

## Integration Rules

- If auth state or routing behavior changes, verify both public and logged-in shells.
- If a feature depends on backend response shape, update the UI and the docs together when that feature is client-facing.
- If a new public page is introduced, add navigation intentionally instead of leaving it orphaned.

## Learned Constraints

- Some page-specific styles are better placed in global styles to avoid Angular component CSS budget warnings.
- Logged-in shell changes affect many routes at once, so navigation, footer, sidebar, and modal behavior should be considered together.
- The custom API docs are first-class UI, not generated output, so content structure matters as much as visuals.
