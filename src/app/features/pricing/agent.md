# Pricing Feature Agent Instructions

## Purpose

This feature owns plan presentation, current-plan highlighting, checkout initiation, and upgrade messaging.

## Default Agent Mode

Use `Feature Builder`.

## Coding Rules

- Pricing UI should reflect the signed-in user’s actual plan when known.
- Disable or mute actions that do not make sense for the user’s current tier.
- Keep checkout CTA labels aligned with real subscription products and backend plan codes.

## Integration Rules

- If plan codes, pricing amounts, or checkout behavior changes, verify frontend and backend together.
- If payment verification updates the user plan, refresh the client-side profile state after success.

## Learned Constraints

- Placeholder plan codes and invalid payment config create misleading checkout failures; keep displayed plans aligned with actual backend/payment behavior.
- Current-plan awareness is part of the UX contract, not optional polish.
