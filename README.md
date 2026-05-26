# CivilWarLand in Bad Decline

A single-file, canvas-rendered park management simulation adapted from the George Saunders short story of the same name. You play the Special Assistant at a historical theme park in terminal decline. The budget is bleeding, the gang problem is "being addressed from a revenue-impacting standpoint," and your boss has ideas.

Built as one `index.html` with no build step, no framework, and no server. The entire runtime — engine, renderer, content, and save system — is roughly 4,400 lines in a single file.

---

## Quick Start

```bash
git clone git@github.com:agshipley/CW_Actual.git
cd CW_Actual
open index.html          # macOS
# or just double-click index.html
```

No install, no package manager, no build, no dev server. Save state persists in `localStorage`; clear site data to reset.

The in-browser hotspot authoring tool lives at [tools/hotspot-mapper.html](tools/hotspot-mapper.html) and runs the same way.

### Development setup (one-time)

```bash
npm install                          # installs eslint — only needed for the lint hook
git config core.hooksPath scripts    # activates the pre-push lint check
```

The hook lives at `scripts/pre-push` and runs `npm run lint` before every push. Skip it once with `git push --no-verify` if needed.

---

## Architecture Overview

The project is a **single-file monolith**: one HTML document containing embedded CSS, a `<canvas>` element, and the full JavaScript runtime. There are no modules, no bundler, and no third-party runtime dependencies.

| Segment | Approx. Lines | Location |
|--------|---------------|----------|
| Embedded CSS | ~180 | `index.html` lines 7–189 |
| HTML skeleton + UI overlays | ~310 | `index.html` lines 190–500 |
| JavaScript runtime | ~3,900 | `index.html` lines 500–4393 |
| **Total** | **~4,393** | `index.html` |

The runtime follows a **procedural, data-driven** pattern. A single mutable `state` object ([index.html:314](index.html#L314)) holds the entire world. Game content — story events, minor events, daily actions, building interiors, tally verdicts, character visuals — is encoded as plain JS object/array literals at the top of the script and consumed by a small set of imperative update and render functions.

### Execution model

- **Main loop:** `gameLoop(ts)` at [index.html:3982](index.html#L3982), driven by `requestAnimationFrame`.
- **Simulated time:** 45 real seconds == one in-game day at 1× speed. Midnight rollover calls `applyMidnight()` ([index.html:1053](index.html#L1053)) to run per-day decay, event checks, and tally checkpoints.
- **Event model:** flag-based state machine. Player choices mutate `state.flags` ([index.html:318](index.html#L318)); future event eligibility is gated by `condition` / `conditionNot` fields on each event record.
- **Persistence:** `saveGame()` / `loadGame()` ([index.html:1298](index.html#L1298), [index.html:1307](index.html#L1307)) serialize the `SAVE_FIELDS` allow-list to `localStorage` after every mutation of consequence.

---

## State Model

`state` ([index.html:314](index.html#L314)) is the single source of truth. Fields break down as follows:

| Group | Fields |
|-------|--------|
| Core stats | `day`, `budget`, `attendance`, `gangThreat`, `morale`, `narratorStress`, `narratorEnergy` |
| Phase gate | `phase2Active` (transitions at day 31: Phase 1 → Phase 2) |
| UI / selection | `selectedBuilding`, `selectedAction`, `eventActive`, `gameOver`, `activeInterior`, `selectedInteriorObj` |
| World contents | `characters`, `placedBuildings`, `placedZones`, `destroyedBuildings`, `log` |
| Systems | `actionCooldowns`, `interiorUpgrades`, `usedMinorEvents`, `tallyCounters`, `tallyHistory`, `lastTallyDay` |
| Phase 2 only | `charAssignedTo`, `charConsecutiveDays`, `charEventsFired` |

Only fields in `SAVE_FIELDS` ([index.html:1296](index.html#L1296)) are persisted; transient UI state is intentionally excluded from saves.

---

## Rendering Pipeline

A single `<canvas>` element ([index.html:210](index.html#L210)) and one `CanvasRenderingContext2D` handle all drawing. `render()` ([index.html:2477](index.html#L2477)) is the per-frame draw call.

Draw order is back-to-front:

1. Clear + brightness pass (`getDayBrightness()` applies a time-of-day multiplier)
2. Seasonal grass gradient (`seasonGrassColors[season]`, four stops × four seasons)
3. Grass noise patches (α 0.08)
4. Paths — three layered strokes (worn edge / warm core / highlight) via `sketchPath()` with stable road wobble
5. Creek (quadratic curves, cool palette)
6. Retaining wall — four-layer stroke (shadow, body, highlight, cracks) + procedural gang graffiti
7. Trees via `drawTree(x, y, size, nx, ny)` ([index.html:2558](index.html#L2558))
8. Zones, doorway wear ellipses, buildings, destroyed-building ruins
9. Characters via `drawCharacter()` ([index.html:2297](index.html#L2297))
10. Canvas-space notifications (construction complete, etc.)

When `state.activeInterior` is set, the overworld render is skipped and `renderInterior()` ([index.html:3760](index.html#L3760)) runs instead: a single Midjourney-generated PNG is blitted as a background, the narrator is drawn as a walkable token, and hotspot rectangles from `BUILDING_INTERIORS[roomId].objects` are overlaid for hit-testing.

### Sketchy-line primitives

The hand-drawn pen-and-ink aesthetic is produced by a small set of deterministic primitives:

| Function | Line | Purpose |
|----------|------|---------|
| `seededRand(seed, i)` | [index.html:2273](index.html#L2273) | Deterministic pseudorandom via sine hash — stable wobble across frames |
| `makeWobble(seed)` | [index.html:2278](index.html#L2278) | Generates a 32-pair offset array from a seed |
| `sketchStroke(x1, y1, x2, y2, wb, wi)` | [index.html:2289](index.html#L2289) | Draws a wobbly line as three short segments with offset perturbation |

Wobble is **baked once per character** at creation (`c.wobble = makeWobble(seed)`) and reused every frame for the session. This is deliberate — recomputing wobble per frame produces a shimmer that reads as instability rather than handcraft.

**Known quirk:** `sketchStroke` internally calls `ctx.moveTo`, which breaks continuous paths when chained for filled polygons. For closed wobbled fills, build the path manually with inline wobble rather than chaining calls.

Character visuals are data-driven via `CHAR_VISUAL` ([index.html:2221](index.html#L2221)) — a map from character ID to body/head color, height, head radius, and optional `style` flag (`"grayson"` hunches, `"sylvia"` widens the torso, `"samuel"` adds height, etc.). `drawCharacter()` reads from this table, applies ghost flicker if `c.ghost === true`, and draws shadow / legs / torso / arms / head / face in that order.

---

## Daily Action System

`DAILY_ACTIONS` ([index.html:573](index.html#L573)) defines four mutually-cooldowned choices per day:

| ID | Label | Primary tradeoff |
|----|-------|------------------|
| `repair` | Patch and Repair | −budget, +attendance, +morale |
| `patrol` | Increase Patrols | −budget, −gangThreat, (±morale) |
| `staff` | Manage the Staff | ±budget, +morale, −gangThreat |
| `cuts` | Cut Corners | +budget, −attendance, −morale |

`chooseDailyAction(id)` ([index.html:1923](index.html#L1923)) applies effects, increments any attached tally counter, writes a log line, sets `state.actionCooldowns[id] = COOLDOWN_DAYS` (2), and saves. Cooldowns decrement inside `applyMidnight()`.

`state.selectedAction` enforces one action per day; the UI locks the other three until the day ticks over.

---

## Event System

Events are split into three data tables, each an array of plain-object records.

### Story events — `EVENTS` ([index.html:650](index.html#L650))

```js
{ day, title, text, condition?, conditionNot?, choices: [
    { label, text, effect:{ budget, attendance, gangThreat, morale },
      flag?, tally?, followup? }
  ]
}
```

13 events pinned to specific days with optional flag gates. Choices apply stat deltas, set narrative flags, and may append tally marks. Some events branch into follow-up text on the same day.

### Minor events — `MINOR_EVENTS` ([index.html:604](index.html#L604))

Flavor occurrences chosen at random on days without a story event. Tracked in `state.usedMinorEvents` to prevent repeats. A subset are gated by `townshipOnly: true` for Phase 2.

### Phase 2 events — `PHASE2_EVENTS` ([index.html:474](index.html#L474))

Character-arrival and management-sim events that begin firing once `state.phase2Active` flips on day 31.

Choices are routed through `makeTownshipChoice(eventId, idx)` ([index.html:752](index.html#L752)) and `makePhase2Choice(eventId, idx)` ([index.html:4350](index.html#L4350)), which apply effects, set flags, close the modal, and persist.

---

## Tally / Moral Ledger

`state.tallyCounters` tracks four categories:

- `compromises` — armed additions, moral shortcuts taken with the park's integrity
- `coverUps` — buried bodies, insurance angles, the things you filed under "handled"
- `peopleLetDown` — staff fired, promises broken, Sam let go
- `thingsLetRot` — maintenance deferred, buildings allowed to crumble

Checkpoints fire at days 7, 14, 21, and 30 inside `applyMidnight()`. `TALLY_TEXT` ([index.html:918](index.html#L918)) holds authored Saunders-voice verdicts keyed by checkpoint and either dominant category or total-score thresholds:

```js
tally1:  { compromises:"…", coverUps:"…", peopleLetDown:"…", thingsLetRot:"…" }  // day 7
tally2:  [ { max:2,  text:"…" }, { max:5,  text:"…" }, … ]                        // day 14 by total
tally3a: { compromises:"…", … }                                                    // day 21 by category
tally3b: [ { min:60, text:"…" }, { min:40, text:"…" }, … ]                         // day 21 by morale
tally4a: { strong:"…", medium:"…", weak:"…" }                                      // day 30 by overall state
tally4b: { compromises:"…", coverUps:"…", peopleLetDown:"…", thingsLetRot:"…" }
```

See [TALLY_SYSTEM.md](TALLY_SYSTEM.md) for the full design doc and authored verdict text. All verdict strings are **authored, not generated** — pulled verbatim into the runtime table.

Fail states are checked every midnight: budget ≤ 0, attendance ≤ 0, morale ≤ 0, or gangThreat ≥ 100 ends the run immediately with a fail-state verdict.

---

## Interior System

`BUILDING_INTERIORS` ([index.html:2819](index.html#L2819)) maps a building ID to a room record:

```js
{
  name, bgColor, floorColor,
  objects: [
    { id, name, x, y, w, h, color, desc,
      upgrade?: { label, cost, effect, dailyEffect, upgradedDesc }
    }
  ]
}
```

Hotspot coordinates are **normalized (0–1)** so the same data drives hit-testing regardless of canvas size. Backgrounds live at `assets/interiors/{id}.png` and are lazy-loaded into the `INTERIOR_IMAGES` cache on first visit ([index.html:853](index.html#L853)).

Click handling runs an AABB test against each object's normalized rect; a hit sets `state.selectedInteriorObj`, shows the description, and — if the object has an `upgrade` — offers a purchase button. Upgrades persist in `state.interiorUpgrades` keyed by `"{buildingId}:{objId}"` and apply their `dailyEffect` each midnight.

New interiors are authored with [tools/hotspot-mapper.html](tools/hotspot-mapper.html): load a background, click-drag rectangles over interactive regions, export JSON, paste into `BUILDING_INTERIORS`.

Backgrounds are Midjourney-generated under the style rules in [AESTHETIC_INTERIORS.md](AESTHETIC_INTERIORS.md). Provenance for every image is tracked in [INTERIOR_ART_ASSETS.md](INTERIOR_ART_ASSETS.md).

---

## Save System

| | |
|--|--|
| Backing store | `window.localStorage` |
| Key | `SAVE_KEY` constant |
| Allow-list | `SAVE_FIELDS` at [index.html:1296](index.html#L1296) |
| Write triggers | Every action, every event choice, every midnight tick |
| Load trigger | Title screen "Continue" button, present only if a save exists |

Saves are plain JSON of a subset of `state`. No migration layer — schema changes invalidate prior saves.

---

## Decay Model

Each midnight `applyMidnight()` applies **compounding decay** before events resolve:

- `gangThreat += 2`
- `morale -= 1`
- `attendance -= 1`
- `narratorStress += 1`
- `productivity -= 1` (Phase 2 only)
- For each placed building: `condition -= rand(1..4)`, plus 2 extra if `gangThreat > 50`. Condition 0 → marked destroyed, rendered as a charred footprint.
- Each placed building's `daily` effect and each zone's daily effect are applied.

Player actions fight the slope; they don't eliminate it. This is intentional — the design principle is in [CLAUDE.md](CLAUDE.md) under "Height to Fall From."

---

## Phase Gate

Day 31 flips `state.phase2Active`, which swaps the active event table from `EVENTS` to `PHASE2_EVENTS` and enables:

- Character arrivals tied to milestone days (Ruth day 35, Dub day 40, etc.)
- Township zone placement
- Character-to-building assignments (`state.charAssignedTo`)
- Per-character consecutive-day streak tracking

Phase 1 design rules: [PHASE1_STYLE.md](PHASE1_STYLE.md) · [PHASE1_ROADMAP.md](PHASE1_ROADMAP.md)
Phase 2 design rules: [PHASE2_STYLE.md](PHASE2_STYLE.md) · [PHASE2_ROADMAP.md](PHASE2_ROADMAP.md)

---

## Repository Layout

```
.
├── index.html                       # the entire runtime
├── tools/
│   └── hotspot-mapper.html          # in-browser interior hotspot authoring tool
├── assets/
│   └── interiors/                   # Midjourney-rendered interior backgrounds (PNG/JPG + source PDFs)
├── AESTHETIC.md                     # outdoor visual brand guide — palette, wear, composition
├── AESTHETIC_INTERIORS.md           # interior visual style rules
├── CLAUDE.md                        # development handbook: voice, visual locks, workflow
├── PHASE1_STYLE.md / PHASE1_ROADMAP.md
├── PHASE2_STYLE.md / PHASE2_ROADMAP.md
├── TALLY_SYSTEM.md                  # moral ledger design + authored verdict corpus
├── INTERIOR_ART_ASSETS.md           # image provenance + completion status
├── INTERIOR_RENDERING_PROMPT.md     # Midjourney generation prompts + notes
├── VISUAL_STATE.md                  # living log of visual work
├── AUTONOMOUS.md                    # instructions for self-directed Claude Code sessions
└── SESSION_LOG.md                   # development session notes
```

---

## Development Conventions

- **One-file rule:** runtime code stays in `index.html` unless there is a concrete reason to split. No build step is a feature, not an oversight.
- **Voice:** all player-facing strings must read in the Saunders register described in [CLAUDE.md](CLAUDE.md). Flavor text is authored in claude.ai conversations and pasted verbatim into the data tables — it is never generated by Claude Code.
- **Visual cadence:** one element category per pass (characters, then buildings, then trees, …). Adjacent elements left outside scope are noted for the next pass rather than "also fixed" opportunistically.
- **Data over code:** new content is added by extending the existing literal tables (`EVENTS`, `MINOR_EVENTS`, `BUILDING_INTERIORS`, `TALLY_TEXT`), not by introducing new control flow.

---

## Source Material

"CivilWarLand in Bad Decline" by George Saunders. Originally published in *The Kenyon Review*, New Series, Vol. 14, No. 4 (Autumn 1992), pp. 142–155. Collected in *CivilWarLand in Bad Decline: Stories and a Novella* (Random House, 1996).

This project is an unofficial, non-commercial adaptation. All narrative beats, character names, and flavor text derive from the story and are used as homage. The ghosts are real. The McKinnons are not a metaphor.
