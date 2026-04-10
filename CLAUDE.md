# CivilWarLand in Bad Decline — Claude Code Guide

## Project Overview

A browser-based park management simulation game inspired by the George Saunders short story. The player is the Special Assistant at a failing Civil War theme park, making daily decisions for 30 days while story events intervene.

The entire game lives in a **single file**: `index.html`. No build step, no framework, no dependencies. Open in a browser to play.

## Architecture

- **One file**: all HTML, CSS, and JS in `index.html` (~2383 lines as of Phase 2)
- **Vanilla JS**: no modules, no bundler, no npm
- **Global `state` object**: holds all game state (day, budget, attendance, morale, gangThreat, population, productivity, phase, buildings, characters, flags, etc.)
- **Canvas rendering**: the park map is drawn on a `<canvas>` element via `drawMap()`
- **Event system**: story events are objects in the `EVENTS` array, minor events in `MINOR_EVENTS`; fired by `checkEvents()` each day advance

## Two Phases

**Phase 1 (Days 1–30):** Original story-driven survival mode. Four daily actions, 13 story events, 6 endings + 4 fail states. Core stats: budget, attendance, morale, gangThreat.

**Phase 2 (Days 31+, "The Community"):** Management sim layer. Triggers when `state.expanded === true`. Adds: population, productivity, character assignment, building upkeep, milestone characters. Active on `sims-mode` branch.

## Key Functions

- `advanceDay()` — main game loop tick; applies daily decay, fires events, updates UI
- `checkEvents()` — evaluates which story/minor events trigger today
- `renderSidebar()` / `drawMap()` — all UI rendering
- `startGame()` / `startPhase2Game()` — entry points
- `dbgSkipToPhase2()` — debug shortcut to jump to Phase 2 state

## Testing

No test suite. Test by opening `index.html` in a browser. Use the **debug panel** (press `d` during gameplay) for:
- Skip to day N
- Force-trigger specific events
- Skip to Phase 2 (`dbgSkipToPhase2()`)

The "Skip to The Community" button on the title screen also jumps to Phase 2.

## Branches

- `main` — stable Phase 1 game
- `sims-mode` — Phase 2 work in progress (The Community / Day 31+ layer)

## Design Principles

- **One file**: keep everything in `index.html`. Don't introduce build tools, modules, or external files.
- **No frameworks**: vanilla JS and CSS only.
- **Atmospheric tone**: Georgia serif font, dark muted green palette (`#1e2418` bg, `#d4d0c4` text). All copy should match the Saunders story's voice — bureaucratic dread, dark humor.
- **Don't break Phase 1**: Phase 2 code should be gated behind `state.expanded` checks so it doesn't affect the base game.
