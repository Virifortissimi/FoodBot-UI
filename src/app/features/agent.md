# Feature Folder Agent Instructions

## Purpose

This folder contains route-level features and their local pages, components, and feature-specific logic.

## Default Agent Mode

Use `Feature Builder`.

## Coding Rules

- Keep feature behavior self-contained where possible.
- Put shared cross-feature logic into core services, not duplicated feature code.
- Keep loading, empty, and error states intentional inside each feature.
- When a feature exposes or explains client-facing API capabilities, keep the custom API docs aligned.

## What To Capture Here

Add feature-specific `agent.md` files when:
- the feature has recurring bugs
- the feature has auth or provider edge cases
- the feature has design constraints that should be preserved
- the feature is client-facing enough that docs and UX need to stay in sync

## Learned Constraints

- Features with complicated interaction state should document the stable rules for how state transitions work.
- If a feature repeatedly needs special integration handling, create a local `agent.md` in that feature instead of bloating this file.
