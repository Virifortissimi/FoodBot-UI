# Dashboard Feature Agent Instructions

## Purpose

This feature owns the logged-in summary experience, analytics cards, trends, quick actions, and dashboard-specific utility controls.

## Default Agent Mode

Use `Feature Builder`.

## Coding Rules

- Prefer real analytics data over placeholder arrays or hardcoded summary values.
- Dashboard metrics should explain what they measure and where they come from.
- If a metric is “today”-based, verify the underlying backend query truly filters to today.
- Small guidance affordances such as tooltips should clean up correctly and not leave stale UI behind.

## Integration Rules

- If backend analytics shape changes, update the dashboard cards, trend visuals, and any tooltip/help text together.
- If dashboard shell controls change, consider overlap with the logged-in app shell.

## Learned Constraints

- Mongo-backed learning and analytics queries may need separate collection reads instead of relationship navigation patterns.
- Tooltip behavior should always clean up on hide and destroy, or stale hints can remain on screen.
