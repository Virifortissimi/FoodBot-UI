# Frontend Core Services Agent Instructions

## Purpose

This folder owns cross-feature services such as auth, user state, API clients, toast behavior, SEO, and shared app state.

## Default Agent Mode

Use `Feature Builder` for app-state work and `Service Integrator` for auth/token/provider interaction.

## Coding Rules

- Keep service APIs stable and predictable because many features depend on them.
- Prefer one source of truth for auth, user state, and shared API state.
- Avoid duplicating endpoint logic across feature services if a core service already owns it.
- When clipboard, share, or browser-only APIs are used, guard for browser availability.

## Integration Rules

- Auth changes must be tested against route guards, interceptors, and any SignalR or long-lived connections.
- If a core service changes response assumptions, check the downstream features that consume it.

## Learned Constraints

- Access-token refresh and authenticated navigation are tightly coupled; changing one usually affects the other.
- Browser-only APIs such as clipboard and share need graceful failure handling.
