# Developers Feature Agent Instructions

## Purpose

This feature owns the custom API docs experience and developer-facing onboarding content.

## Default Agent Mode

Use `Docs Keeper`.

## Coding Rules

- Treat docs content as structured product content, not throwaway marketing copy.
- Prefer data-driven endpoint documentation over hardcoded repeated markup.
- Keep request and response examples close to the structured docs data so updates stay consistent.
- Document auth, headers, request shape, response shape, and error behavior together.

## Integration Rules

- When a client-facing endpoint changes, update this feature in the same task.
- If an endpoint is not approved for external clients, do not document it as public integration surface.
- Keep onboarding copy aligned with the real API key issuance process.

## Learned Constraints

- This docs system is custom-built on purpose; do not reintroduce Swagger-style generated docs as the primary client experience.
- The docs should reflect approved client capabilities, not every internal app endpoint.
