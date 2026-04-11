# PHASE 1 FEATURE ROADMAP
## CivilWarLand — Days 1-30: Dialogue-Driven Survival

---

## STATUS KEY
- ✅ COMPLETE — Implemented and tested
- 🔧 IN PROGRESS — Partially implemented
- 📋 DESIGNED — Design complete, ready for implementation
- 💡 CONCEPT — Needs design work before implementation

---

## LAYER 0: FOUNDATION (must work before anything else)

### ✅ Core game loop
- Real-time clock (45 real seconds = 1 game day at 1x)
- Day/night cycle with brightness changes
- Midnight processing: stat decay, events, economics
- Pause/play/speed controls
- Save/load system

### ✅ Map and movement
- Isometric canvas with buildings, trees, paths, characters
- Click-to-move narrator
- Character proximity detection (buildings, NPCs)
- Map expansion at day 30 (mapScale 0.5)

### ✅ Event system
- Scripted story events on specific days (Haberstrom, Quinn, Samuel, Church, etc.)
- Minor event pool with random selection
- Weather events (rain, fog)
- Branching choices with stat effects and flags
- Multiple endings at day 30

### ✅ Stat system
- Budget, attendance, gangThreat, morale (park stats)
- Energy, stress (narrator stats)
- Daily decay on all stats
- Fail states: insolvency, empty park, gang takeover, staff collapse, breakdown

### ✅ Visual aesthetic
- Sketchy hand-drawn character system (wobble, sketchStroke)
- Warm palette per AESTHETIC.md
- Building rendering with condition-based wear
- Atmospheric post-processing (dawn/dusk bloom, vignette)

---

## LAYER 1: GAMEPLAY FIXES (exploit closure)

### 📋 Fix 1 — Building actions cost game time
Every building interaction advances the clock by 30 minutes (60 for rest). This kills the spam loop — the player can do ~24 actions per day maximum. CC prompt written.

### 📋 Fix 2 — Building actions once per day
`state.usedBuildingActions` tracks which buildings have been used today. Reset at midnight. CC prompt written.

### 📋 Fix 3 — Show effects before clicking
Interact prompt displays stat effects in green/red below the action button. Player makes informed decisions. CC prompt written.

### 📋 Fix 4 — Repair once per building per day
`state.repairedToday` limits repair to one per building per day. Repair becomes triage. CC prompt written.

### 📋 Fix 5 — Energy cost per action
8 energy per building action, 10 per repair. Blocks at 0. Creates a real daily energy budget of ~8-10 meaningful actions. CC prompt written.

### 📋 Fix 6 — Stress graduated effects
50+: faster energy drain. 70+: 25% reduced action effectiveness. Makes stress a constant pressure, not a binary fail condition. CC prompt written.

### 📋 Fix 7 — Daily actions UI
Restore DAILY_ACTIONS as once-per-day strategic choice in sidebar. Pick one standing order per day. CC prompt written.

---

## LAYER 2: INTERIOR OVERHAUL (dialogue system)

### ✅ Interior rendering
- Room rendering with wall/floor/baseboard/vignette
- Clickable objects with descriptions
- Narrator walks to objects inside rooms
- Time cost for examination (15 min) and upgrades (1 hour)

### ✅ Interior data authored (7 buildings)
City Hall, Worship Center, Saloon, Thespian Center, General Store, Infirmary, Erie Canal Lock — all objects and descriptions written in Saunders voice.

### 🔧 Interior upgrade daily effects
Upgrades provide ongoing daily stat modifiers (not just one-time bumps). `dailyEffect` field applied in `applyMidnight()`. CC prompt written.

### 📋 2A — Replace object interaction with character conversations
**This is the key Phase 1 change.** When the player enters a building, instead of clicking on furniture, they find a CHARACTER. The primary interaction is a SHORT DIALOGUE TREE, not an object examination.

Each building has a **resident character** during park hours:
| Building | Character | Fallback (if character removed/absent) |
|----------|-----------|----------------------------------------|
| City Hall | Mr. Alsuga | Empty desk, narrator monologue |
| Saloon | Sylvia (during info), Nate (default) | Narrator alone at bar |
| Thespian Center | Quinn | Empty stage, narrator monologue |
| Conifer Grove | Samuel (if armed) | Wind, narrator monologue |
| Infirmary | (no fixed character) | Narrator examines room |
| General Store | Fred Moore (implied) | Narrator describes the space |
| Worship Center | (no fixed character) | Narrator describes the dome |
| Erie Canal Lock | (no fixed character) | Narrator examines the Lock |

Implementation:
1. Add `BUILDING_CONVERSATIONS` data object — keyed by building ID, containing arrays of dialogue nodes
2. Each node has: speaker, text, player_responses (array of {text, effect, next_node, flag_required, flag_set})
3. Dialogue changes based on game state — use `condition` functions on nodes
4. Stat effects apply when the player selects a response, not when entering the building
5. Each conversation costs 30 minutes of game time
6. Object examination remains available AFTER or ALONGSIDE conversation (secondary interaction)

### 📋 2B — Conditional dialogue based on game state
Characters say different things based on:
- **Day number**: Early game vs. late game
- **Flags**: Has Quinn been armed? Has Samuel arrived? Was the church burned?
- **Stats**: Is morale below 30? Is gangThreat above 70?
- **Recent events**: Did Quinn just get humiliated? Did Evelyn just leave?

Implementation: Each dialogue node has an optional `condition` function. First matching node wins. Fallback to default greeting.

### 📋 2C — Passive checks in dialogue
When narrator stats meet thresholds, extra dialogue options appear:
- **Energy > 60**: "You notice something" — observational options that reveal information
- **Stress < 40**: Diplomatic options that produce better outcomes
- **Stress > 70**: Desperate/raw options that are honest but costly
- **Morale < 30 (park)**: Characters are more forthcoming about problems
- **gangThreat > 60**: Characters mention the gangs unprompted

These are NOT random. They're authored dialogue branches gated by stat thresholds. The player never sees the check — they just see new options appear when conditions are met.

### 📋 2D — Thought system
After key conversations or events, the narrator "internalizes" a thought:
- Small UI element in sidebar or below stats: "Narrator's Thoughts" with 3-4 slots
- Each thought is a short phrase + a small ongoing stat modifier
- Thoughts are permanent for the playthrough (no removing)
- Thoughts are earned through specific conversation paths or event choices
- Maximum ~10 possible thoughts, 3-4 active at a time

Data structure:
```
NARRATOR_THOUGHTS = {
  "flags_warm": {
    text: "The flags are warm.",
    trigger: "foley_massacre" flag set,
    effect: {stress: -1},  // daily
    desc: "You wrapped Quinn in a Confederate flag. It was warm."
  },
  ...
}
```

### 💡 2E — Hidden discoverable interactions
Some objects in interiors have context-sensitive interactions that only appear under specific conditions:
- Walking Stick during crisis (gangThreat > 70): stress reduction scene
- Office Couch after midnight: rest option
- Corporate Tank when morale < 30: contemplative morale bump
- These fire once per day maximum. No UI hint. Player discovers through experimentation.

---

## LAYER 3: NARRATIVE EXPANSION

### 💡 3A — Character schedules
Characters move to different buildings at different times of day:
- Quinn at Thespian Center during park hours, Saloon in evening
- Sylvia at City Hall mornings, roaming afternoons
- Mr. A at City Hall always (he lives there)
- Samuel in Conifer Grove (if armed), Kriegal Place (if butter)

Finding a character at a specific time/place becomes part of the player's day planning.

### 💡 3B — Character relationship tracking
Simple relationship value per character (-100 to 100). Affected by:
- Conversation choices (defending Quinn → +relationship with Quinn, -relationship with Mr. A)
- Event choices (arming Samuel → -relationship with most staff)
- Proximity/visit frequency (visiting someone regularly → slow relationship gain)

Relationship affects: dialogue tone, available conversation options, character event outcomes.

### 💡 3C — Expanded minor event pool
Current pool: ~35 minor events. Target: 60+.
Each event should reference specific characters, locations, or consequences of earlier choices.
Priority: events that respond to flags (insurance_fraud, samuel_armed, quinn_refused, etc.)

### 💡 3D — Mid-game consequence scenes
Between major story events, add brief narrative scenes that show the CONSEQUENCES of earlier choices:
- Day 11 (if Quinn armed): Quinn is sleeping in the Thespian Center. He won't take off the vest.
- Day 14 (if Grayson fired): You pass his empty observation post. The orioles are there. He is not.
- Day 18 (if church burned for insurance): The insurance inspector's car is in the parking lot again.

These are not events with choices — they're authored narrative moments that fire automatically.

---

## LAYER 4: POLISH & FEEL

### 💡 4A — Dialogue panel UI
Proper dialogue interface replacing the current interior overlay:
- Character name/title at top
- Dialogue text in Saunders italic
- Response options as styled buttons (not raw HTML buttons)
- Smooth transitions between dialogue nodes
- Stat effects shown AFTER selecting a response (brief flash, then fade)

### 💡 4B — Character portraits (text-based)
Not pixel art. A small colored panel showing the character's name, a one-line description, and their current mood. Mood derived from morale + character-specific offset.

### 💡 4C — Sound design
- Conversation: soft ambient drone shifts when entering buildings
- Dialogue advance: subtle click/paper sound
- Stat change: quiet chime (positive) or thud (negative)
- Event overlay: existing chime system (already implemented)

### 💡 4D — Tutorial integration
Replace the current 4-step tutorial with one that introduces: walking, entering buildings, talking to characters, making choices. Should feel like the first conversation (with Mr. A) IS the tutorial.

---

## IMPLEMENTATION ORDER

1. **Layer 1 fixes** (7 CC prompts, run in sequence) — closes exploits, makes time meaningful
2. **Layer 2A** (conversation system) — the core Phase 1 change, requires authoring dialogue trees in claude.ai then delivering to CC
3. **Layer 2B** (conditional dialogue) — builds on 2A, requires authoring variant dialogue
4. **Layer 2C** (passive checks) — builds on 2B, requires identifying check points and authoring gated content
5. **Layer 2D** (thought system) — independent feature, can be built alongside 2A-2C
6. **Layer 3A-3D** (narrative expansion) — content authoring, can happen in parallel
7. **Layer 4** (polish) — last, after everything works

---

## DEPENDENCIES

- All dialogue content must be written in claude.ai (Saunders voice cannot be generated by Claude Code — it doesn't have access to the source text)
- CC prompts should be delivered as complete data + implementation instructions
- Each layer should be testable independently before moving to the next

---

*This document is a project reference file. Place at repo root. Update status markers as features are implemented.*
