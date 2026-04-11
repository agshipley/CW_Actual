# Visual Overhaul — State of Play

Living document tracking progress on the visual redesign. Updated at the end of each pass. `CLAUDE.md` is the stable project guide; `AESTHETIC.md` is the locked brand guide; this file is the work-in-progress log.

## Locked Direction

Hand-drawn sketchy pen-and-ink illustration colored with Disco Elysium's palette. Not literal painterly rendering — our line style is the wobble system established for characters. See `AESTHETIC.md` for the full brand guide.

**Core principle:** decline requires a height to fall from. Base colors are intentional "opening day 1975." Wear is applied locally on top as damage, never globally. Player must see both states at once — the sincere attempt and the twenty-year failure.

**The one rule that matters most:** warm lit windows against cooler base. "Lamplight holding back the dark."

## Status by Element

### LOCKED (do not touch without explicit direction)

- **Characters.** Sketchy wobble system, distinct silhouettes for narrator / Alsuga / Quinn / Sylvia / Grayson / Samuel / McKinnon. `drawCharacter` helper, `makeWobble`, `wobbleLine`, `seededRand`, `CHAR_VISUAL` object. Wobble baked in at character creation, cycled through per stroke, never recomputed per frame.

### DONE (this session)

- **Grass palette.** Reverted from an earlier cool-gray misread to warm dusty olive matching `AESTHETIC.md` ground palette. `seasonGrassColors` season 0 updated; `grassPatches` colors updated. All four seasons stay warm-dominant.
- **Building colors.** Every building in `BUILDINGS` and `BUILDABLE_STRUCTURES` recolored to the locked palette. Narrative-role-based assignments: civic buildings get weathered cream, warm-blooded buildings (Saloon, Brothel) get rust red, institutional buildings (Canal Lock, Infirmary) get dusty teal, utilitarian wood structures get warm wood brown, administrative buildings get muted slate blue. Worship Center is the only building with ochre gold (the sacred dome).

### IN PROGRESS / QUEUED NEXT

- **Warm lit windows.** Prompt drafted, not yet run. Day/dusk/night/dawn time-of-day variation, warm ochre lit state at night, soft radial glow bloom around lit windows, condemned buildings stay unlit. This is the hero lighting pass — the single biggest visual beat remaining.

### NOT YET ADDRESSED

Known aesthetic flaws from screenshot critique, in rough priority order:

1. Buildings all share the same shape (rectangle + triangle roof). No silhouette variety. Hero buildings (City Hall, Worship Center, Everly Mansion, Erie Canal Lock, Parking) should get unique custom shapes.
2. Building outlines and fills are clean rectangles, not matching the sketchy character style. Walls should have hatching. Roofs should slump. Outlines should wobble.
3. Scale is inconsistent — Conifer Grove is the same size as the Infirmary. Layout needs a design review, not just art.
4. Trees are three stacked circles. Need the sketchy treatment and more variety.
5. Paths look like marker on a lawn. Should be worn dirt walkways with irregular edges.
6. Retaining wall is a dashed CSS border. Should be a real weathered thing with possible graffiti per the story.
7. No atmospheric layering. Everything is the same brightness and contrast edge-to-edge. Needs cool wash on far elements, warm on near.
8. No diegetic wear on buildings. "Height to fall from" principle not yet visible — no peeling paint, no boarded windows, no rust streaks, no dirt at building bases.
9. Labels are always-on black backgrounds that compete with everything else. Should be hover/selection only, or redesigned to be quieter.
10. UI chrome (sidebar, stat bars, buttons, event modals) has not been touched. Still in the original dark-green `#1e2418` Georgia serif look. Undecided whether UI should match the world art or stay as deliberate bureaucratic contrast.

## Undecided Direction

- **UI chrome approach.** Match the Disco Elysium-inflected world art, or stay as a deliberate "bureaucratic paperwork around the world" contrast? Both are defensible. Not yet chosen.
- **Unique hero-building silhouettes vs. sketchy generic rectangles.** Probably both — hero buildings get custom shapes, others get the sketchy treatment applied to rectangles. Not yet committed.
- **Wear as a dedicated pass vs. rolled into sketchy-buildings pass.** Leaning toward dedicated pass since it needs all other passes as substrate.
- **Event modal redesign.** Typewritten memo / telegram feel is tempting but may be polish that doesn't move the needle. Defer decision until world art is further along.

## Failed Attempts (don't repeat)

- **Cool-gray desaturated palette.** Attempted early in this session as a misread of Disco Elysium. Read as bleak and dead. Corrected — DE's actual palette is warm-dominant. If the map ever drifts toward gray, that's a signal we're regressing.
- **Full-canvas cool atmospheric wash.** Applied at `rgba(180, 195, 205, 0.04)` as a uniform overlay. Pulled everything cold. Removed. Atmosphere comes from color variation between elements, not from overlays.

## Working Cadence

One element per pass. Describe approach before writing code. Implement in a single helper or block. Reload, evaluate in isolation, lock or iterate. Do not "also fix" adjacent elements during a pass. If something looks wrong outside current scope, note it here for the next pass.
