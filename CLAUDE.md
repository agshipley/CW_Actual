## Saunders Voice (Non-Negotiable)

Every piece of text the player reads must sound like the narrator of "CivilWarLand in Bad Decline": resigned, self-aware, darkly funny, wrapped in the language of corporate middle management. Even when things are going well. Especially when things are going well.

Concrete markers of the voice:
- Bureaucratic euphemism describing the absurd ("Revenue Impacting Event," "Verisimilitude Evaluation," "Exit Sealage")
- Earnest effort applied to ridiculous ends, played straight
- Comedy from juxtaposition — corporate language describing violence, genuine tenderness amid institutional collapse
- Never joke about the sadness. Let the sadness and the jokes coexist without acknowledging each other.
- The ghosts are real. The McKinnons are not a metaphor. Played completely straight.

**Claude Code cannot read the source story.** All flavor text, character writing, and narrative content must be authored in claude.ai conversations first, then pasted into prompts verbatim. Do not ask Claude Code to "write in the Saunders voice" — it doesn't have the source material. Provide the lines.

## Core Creative Principle: Height to Fall From

The game is about decline, but decline requires prior integrity. A fall is only a fall if there's a height to fall from. The park was built with sincerity — someone chose the Worship Center's gold dome, someone painted the Everly Mansion cream, someone cared — and what the player sees is that intention still visible underneath twenty years of wear.

This principle governs all future visual and narrative work:
- Base colors are "opening day 1975." Wear is added on top as damage, not baked in.
- Decline should be visible *locally* (peeling paint, worn grass at doorways, one boarded window) not *globally* (everything desaturated into gray).
- The player should be able to see both states at once — the intention and the failure. That tension is the whole game.
- Mr. A cries when the church burns because he meant it. Honor that sincerity in every system.

## Visual Style (as of April 2026)

**Current locked style:** sketchy hand-drawn pen-and-ink illustration with flat muted fills. Think storybook illustration or literary chapbook, not painterly rendering. This style was chosen because it plays to canvas's strengths (lines, shapes, flat fills) and can be rendered well on the first try.

**Characters: LOCKED.** The `drawCharacter` function and its helpers (`makeWobble`, `wobbleLine`, `seededRand`, the `CHAR_VISUAL` object) represent the established visual system. Each character stores its wobble offsets once on `c.wobble` and they persist for the session — wobble is baked in at creation, never recomputed per frame, to avoid shimmering. Do not refactor this system without explicit direction.

**Environment: in progress.** Grass palette has been revised to muted-but-living field green (`seasonGrassColors` season 0). Buildings still use their original saturated Phase 1 colors and need a matching pass. Trees, paths, retaining wall, zones, and weather overlays have not been touched.

**Active aesthetic target: see `AESTHETIC.md`.** The brand guide at the repo root is the single source of truth for palette, composition rules, wear philosophy, and reference. All visual passes reference it. The target is Disco Elysium's Martinaise outdoor environments (Aleksander Rostov), translated into our existing sketchy pen-and-ink line style. Warm-dominant palette, cool shadows in recesses, warm lit windows as the hero accent, wear applied locally on top of intentional base colors.

## Sketchy Drawing Primitives

The project has a reusable set of primitives for hand-drawn-feeling rendering:
- `seededRand(seed, i)` — deterministic pseudorandom for stable wobble
- `makeWobble(seed)` — generates a 32-pair offset array
- `wobbleLine(x1, y1, x2, y2, wobble, wi)` — draws a line in 3 wobbled segments using stored offsets

**Known quirk:** `wobbleLine` calls `ctx.moveTo` internally, which breaks continuous paths if chained for filled shapes. If you need a closed wobbled fill shape (e.g. a building wall), either extend `wobbleLine` with a "continue path" parameter or build the path manually with inline wobble. Do not chain `wobbleLine` calls expecting a closed filled polygon — it will render as disconnected strokes.

Any new hand-drawn element (buildings, trees, signage) should reuse these primitives for consistency.

## Visual Work Cadence

Visual passes should be scoped narrowly — one element type per pass (characters, then buildings, then trees, etc.). Do not attempt multi-element visual overhauls in a single prompt. The pattern is:
1. Pick one element category
2. Describe the approach before writing code
3. Implement in a single helper function
4. Reload and evaluate in isolation
5. Lock or iterate, then move on

Do not "also fix" adjacent visual elements during a pass. If something looks wrong outside the current scope, note it for the next pass.

## Workflow Division

- **claude.ai conversations**: design decisions, flavor text authoring, diagnosis, aesthetic direction, Saunders-voice content
- **Claude Code (VS Code)**: all file edits, implementation, git operations, verification

When in doubt, design in claude.ai first and hand completed prompts to Claude Code. Claude Code should not be asked to make open-ended creative decisions about tone, voice, or aesthetic direction.