# Visual Overhaul — State of Play

Living document tracking progress on the visual redesign. Updated at the end of each pass. `CLAUDE.md` is the stable project guide; `AESTHETIC.md` is the locked brand guide; this file is the work-in-progress log.

## Locked Direction

Hand-drawn sketchy pen-and-ink illustration colored with Disco Elysium's palette. Not literal painterly rendering — our line style is the wobble system established for characters. See `AESTHETIC.md` for the full brand guide.

**Core principle:** decline requires a height to fall from. Base colors are intentional "opening day 1975." Wear is applied locally on top as damage, never globally. Player must see both states at once — the sincere attempt and the twenty-year failure.

**The one rule that matters most:** warm lit windows against cooler base. "Lamplight holding back the dark."

## Status by Element

### LOCKED (do not touch without explicit direction)

- **Characters.** Sketchy wobble system, distinct silhouettes for narrator / Alsuga / Quinn / Sylvia / Grayson / Samuel / McKinnon. `drawCharacter` helper, `makeWobble`, `wobbleLine`, `seededRand`, `CHAR_VISUAL` object. Wobble baked in at character creation, cycled through per stroke, never recomputed per frame.

### DONE

- **Grass palette.** Warm dusty olive matching `AESTHETIC.md` ground palette. `seasonGrassColors` and `grassPatches` updated. All four seasons warm-dominant.
- **Building colors.** Every building in `BUILDINGS` and `BUILDABLE_STRUCTURES` recolored to the locked AESTHETIC.md palette. Worship Center is the only building with ochre gold roof.
- **Pass 1 — Warm lit windows.** `renderBuilding` now reads `state.gameTime`. Night = gameTime < 480 || >= 1080. Lit windows render `rgba(240,200,120,0.72)` with a soft radial bloom (`rgba(250,210,140,0.25)` → transparent at r=10). Daytime windows dark `rgba(40,38,34,0.55)`. Condemned always unlit.
- **Pass 2 — Sketchy building outlines and hatched walls.** Body outline changed from cold black to `#2E241E` warm umber. Double-stroke pass (offset ghost + clean line) for hand-drawn feel. Diagonal wall hatching at 7% opacity clipped to building body. Roof edges use slightly asymmetric slump offsets.
- **Pass 3 — Sketchy trees.** `drawTree` replaced. Seeded per-tree wobble (`seed = floor(x) + floor(y)*137`). Wobbled trunk, 4–5 irregular foliage clumps in muted greens (`#4A6838`, `#3A5828`, `#527840`, `#3E5E2E`, `#445A34`). Canopy shadow. Warm umber outline. Trees near map edges get a cool wash overlay proportional to edge proximity.
- **Pass 4 — Paths as worn dirt walkways.** Three-layer path: dark `#5E4628` edge (55% alpha, 8px), warm `#8C6A42` core (5px), lighter `#A8845A` boot-worn highlight streak (35% alpha, 2px). All wobbled via existing `sketchPath` system.
- **Pass 5 — Retaining wall.** Real weathered concrete/slate wall. Three-layer: `#3E4852` shadow offset (+2), `#5E6E7C` body (8px), `#8A9AA8` top-cap highlight (45% alpha, 2px). Crack marks at four positions using wb offsets. Three gang graffiti tags in muted rust `rgba(156,74,46,0.52)` and teal `rgba(78,112,104,0.48)`.
- **Pass 6 — Localized wear.** Clipped to building body polygon. Dirt accumulation at wall base (linear gradient, alpha scales with condition decay). Rust streak (vertical radial gradient, position seeded by wb[42]). Peeling paint patch (ellipse at low opacity, present when cond < 80).
- **Pass 7 — UI chrome.** Sidebar redesigned: warm umber dark background (`#1E1812`), umber borders (`#3A2A1E`/`#4A3A2A`), cream stat values (`#C8B878`), warm brown labels (`#8A6A44`). Stat bars slightly thicker (4px), warm dark trough. Action buttons warm umber, no border-radius. Next-day button with box-shadow.
- **Pass 8 — Event modal.** `#event-box` redesigned as period document: cream paper gradient (`#EAE0C8→#D8C8A0`), umber ink text (`#2E241E`), rust-brown border (`#8C6238`), inset double-border rule (::before). Title stamped uppercase with heavy rule below. Body text italic. All buttons use paper-and-ink palette.
- **Pass 9 — Atmospheric layering.** Post-processing block at end of `render()`. Dawn warm bloom (gameTime 430–560, peak 490, max alpha 0.10). Dusk warm bloom (1020–1140, peak 1080, max alpha 0.17). Four-edge cool vignette (`rgba(80,100,120,0.10)` day / `0.18` night), ~18–20% canvas width/height each edge. No full-canvas overlay — all via edge gradients.

### NOT YET ADDRESSED

Known aesthetic flaws, in rough priority order:

1. Buildings all share the same shape (rectangle + triangle roof). No silhouette variety. Hero buildings (City Hall, Worship Center, Everly Mansion, Erie Canal Lock) should get unique custom shapes.
2. Scale is inconsistent — Conifer Grove is the same size as the Infirmary. Layout needs a design review.
3. Labels are always-on black backgrounds that compete with everything else. Should be hover/selection only, or redesigned quieter.

## Failed Attempts (don't repeat)

- **Cool-gray desaturated palette.** Read as bleak and dead. If the map drifts toward gray, that's regression.
- **Full-canvas cool atmospheric wash.** Uniform overlay pulled everything cold. Atmosphere comes from color variation between elements, not overlays.

## Working Cadence

One element per pass. Describe approach before writing code. Implement in a single helper or block. Reload, evaluate in isolation, lock or iterate. Do not "also fix" adjacent elements during a pass.
