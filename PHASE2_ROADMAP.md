# PHASE 2 FEATURE ROADMAP
## CivilWarLand — Day 31+: Community Management Sim

---

## STATUS KEY
- ✅ COMPLETE — Implemented and tested
- 🔧 IN PROGRESS — Partially implemented
- 📋 DESIGNED — Design complete, ready for implementation
- 💡 CONCEPT — Needs design work before implementation

---

## LAYER 0: FOUNDATION (already built)

### ✅ Map expansion
- Map doubles at day 30 (mapScale 0.5)
- Expanded territory available for building placement
- Retaining wall boundary extends

### ✅ Building placement system
- Click-to-place on expanded map
- 10 buildable structures with costs and daily effects
- Construction timer (3 days, 40% opacity during construction)
- One-at-a-time construction limit
- Overlap detection with existing buildings and zones

### ✅ Character assignment system
- Characters assignable to buildings via assignment panel
- Trait system: 2-3 traits per character with building-specific effects
- Daily effects applied in `applyPhase2Daily()`
- Consecutive day tracking for event triggers
- Assignment preview (hover to see trait match)

### ✅ Milestone character arrivals
- 6 characters arrive at day/population thresholds (Ruth, Dub, Connie, Terrence, Jolene, Pastor Hundt)
- Authored arrival scenes in Saunders voice
- Characters added to map and assignment pool on arrival

### ✅ Character story events
- 6 character-driven events (Quinn's Big Break, Sylvia Knows, Samuel's Report, Grayson's Discovery, First Community Meeting, The Question)
- Trigger conditions: character assigned to specific building + consecutive days + flag/stat requirements
- Branching choices with authored consequences

### ✅ Township system
- Unlocks at 10 placed buildings
- Residential/Commercial/Civic zoning
- Population growth tied to residential capacity
- Approval stat with decay
- Township story events (First Complaint, Zoning Board, Election, Property Values, What to Do with Samuel)
- Commercial income based on zone proximity

### ✅ Productivity stat
- Decays at -1/day
- Affected by character assignments and trait effects
- Fail state at productivity < 10

### ✅ Phase 2 stats
- Population, approval, productivity added to sidebar
- Budget tooltip shows full economic breakdown

---

## LAYER 1: DESIGN DOCUMENT IMPLEMENTATION

### 📋 1A — Full PHASE2_DESIGN.md implementation
The `PHASE2_DESIGN.md` document (already written) specifies:
- Four community stats: money, morale, population, productivity
- Buildings constructed with money
- Roster of ~20-30 pre-written Saunders-voiced characters
- Characters have 2-3 narrative traits with building-specific mechanical effects
- Character + building combination produces specific outcomes
- Phase 1 daily actions remain available alongside assignment system

**Current gap**: Only 10 characters exist (4 initial + 6 milestone). Design calls for 20-30.

Implementation:
1. Author remaining 10-20 characters in claude.ai (traits, descriptions, arrival text, event text)
2. Add to PHASE2_CHAR_DATA and PHASE2_MILESTONE_CHARS
3. Space arrivals across days 65-120+ and population 80-200+
4. Write 1-2 character events per new character

### 📋 1B — Interactive map
Phase 2 map should support:
- Click on any building to see its status, staff, and production
- Visual indicators: staffed (green dot — already implemented), condition bars, production arrows
- Hover to see building name and daily output summary
- Zones show population count and revenue
- Camera pan/scroll for expanded territory (currently fixed view)

### 📋 1C — Building interaction in Phase 2
In Phase 2, entering buildings should show a MANAGEMENT VIEW, not a dialogue tree:
- Current staff and their trait effects
- Building condition and daily output
- Assign/unassign buttons
- Quick-repair option
- Brief Saunders-voiced status line: "The General Store is functioning. Terrence has implemented dynamic pricing. Visitors hate it."

This replaces Phase 1's conversation system. The building interior renders the same room, but the overlay shows data, not dialogue.

---

## LAYER 2: ECONOMIC DEPTH

### 📋 2A — Building synergies
Buildings near each other should produce synergy bonuses:
- Clinic near Residential: +health modifier → slower approval decay
- School near Residential: +population growth rate
- Fire Station near anything: prevents fire-based destruction events in radius
- Commercial zone near Residential: already implemented (revenue per adjacent res zone)

Implementation: In `applyPhase2Daily()`, check proximity between buildings and apply synergy bonuses. Display synergies in the building info panel.

### ✅ 2B — Upkeep scaling
Current: flat upkeep per building (defined in BUILDABLE_STRUCTURES).
Target: upkeep scales with building age and condition.
- New buildings: base upkeep
- Buildings older than 30 days: 1.5x upkeep
- Buildings with condition < 50: 2x upkeep (they cost more to keep running when they're falling apart)

This creates a long-term economic pressure that mirrors the Saunders principle: the older things get, the more they cost to maintain, until eventually you can't afford them all.

*Implemented 2026-04-11: builtDay stored on completion, 1.5x multiplier >30 days, 2x multiplier for condition <50, stacking.*

### 📋 2C — Revenue diversification
Current revenue sources: park attendance × $12/visitor, tax income, commercial zones.
Target: add building-specific revenue streams:
- Worship Center baptisms: $300 per event (random, ~2/week)
- Thespian Center performances: $200 per event (requires Quinn or Jolene assigned)
- General Store sales: scaled to attendance
- Entry ride: scaled to attendance, reduced if condition < 50
- Sutler's Tent: flat daily

Each revenue source should appear as a named line in the budget tooltip.

### 💡 2D — Economic events
Events triggered by economic conditions:
- **Surplus > $20,000**: Mr. A wants to build something ambitious. Investor pressure.
- **Deficit > 5 consecutive days**: Already implemented (DEFICIT SPENDING event). Expand with escalating versions.
- **Budget < $5,000**: Emergency austerity choices (layoffs, closures, selling buildings)
- **Budget > $100,000**: "What are we saving for?" — existential economic event

---

## LAYER 3: COMMUNITY DEPTH

### 📋 3A — Resident simulation
Current: Residents are dots that wander between zones and buildings.
Target: Residents have simple needs that aggregate into approval:
- **Housing quality**: Residential zones near parks/gardens → +approval
- **Services**: Clinic, school, fire station presence → +approval
- **Employment**: Commercial zones provide jobs → +approval
- **Safety**: gangThreat < 20 → +approval; gangThreat > 50 → -approval
- **Proximity to problems**: Residential near Brothel → -approval (already implemented)

Approval is the aggregate of these factors, not a single number that decays arbitrarily.

### 📋 3B — Community events (expanded pool)
Current: 8 township events + 6 character events.
Target: 20+ township events, 15+ character events.

Event categories:
- **Governance**: Elections, zoning disputes, complaints, petitions
- **Infrastructure**: Power outages, water issues, road damage, fire
- **Social**: Festivals, feuds, romances between characters, births, departures
- **Economic**: Booms, busts, outside investors, developer pressure
- **Existential**: "Why are we here?" events at high population that ask what CivilWarLand means

Each event authored in Saunders voice. No procedural text.

### 💡 3C — Character relationships (Phase 2 version)
Characters assigned to the same building develop opinions about each other:
- Quinn + Jolene at Thespian Center: synergy bonus (+2 morale) — they're both performers
- Terrence + anyone: friction (-1 morale) — he has opinions about everyone's workflow
- Samuel + anyone at same building: impossible (exclusive trait) — Samuel works alone
- Connie + Quinn: synergy — she diagnoses him with nothing, he's not reassured, but morale improves

Implementation: `multiStaff` and `exclusive` trait flags already exist. Expand with relationship-specific flavor text and small stat modifiers.

### 💡 3D — Character departure/loss
Characters can leave if conditions are bad enough:
- Morale < 20 for 10+ consecutive days: characters start threatening to leave
- If morale stays below 20: one character per week departs with an authored goodbye scene
- Specific flags trigger specific departures (Samuel departs if gangThreat < 5 — already implemented)
- Departed characters can potentially return if conditions improve (new arrival event)

---

## LAYER 4: LATE GAME

### 💡 4A — Population milestones as narrative beats
| Population | Event | Theme |
|-----------|-------|-------|
| 10 | First Complaint | "They have concerns" |
| 20 | Zoning Board | Governance begins |
| 25 | Community Meeting | Ghost acknowledgment |
| 40 | Election | Power transfer |
| 50 | The Developer | Outside pressure |
| 75 | The Newspaper | CivilWarLand is news |
| 100 | The Question | "What did we make here?" |
| 150 | The Offer | Someone wants to buy it all |
| 200 | The Ending | What CivilWarLand becomes |

Each milestone is an authored event with branching choices that permanently affect the community's direction.

### 💡 4B — End states
Phase 2 doesn't have a fixed endpoint like Phase 1's day 30. Instead, it has MULTIPLE possible endpoints triggered by conditions:

- **Fail states**: Budget ≤ 0, morale < 10, productivity < 10, approval < 20 (recall). All already implemented.
- **Voluntary endpoints**: At population 200, the player is offered a choice: continue indefinitely (sandbox) or trigger a final event that wraps the story.
- **The Final Event**: Authored based on accumulated flags. What kind of community did you build? Who stayed? Who left? What happened to Samuel? To Quinn? To Mr. A?

The final event should feel like a Saunders ending: specific, honest, and quietly devastating regardless of whether the player "succeeded."

### 💡 4C — Sandbox mode
After the final event (or if the player declines it), the game continues as an infinite sandbox:
- No new story events
- Systems continue running: economy, population, condition decay
- The player manages a community that is now just... a place where people live
- The Saunders voice recedes. The narrator has less to say. Things are what they are.

---

## LAYER 5: POLISH

### 💡 5A — Phase 2 visual changes
- Map feels larger and more populated
- Residential zones show small house sprites
- Commercial zones show market stall sprites
- More residents visible on map at higher populations
- Building condition visualized through wear (already implemented in Phase 1)

### 💡 5B — Phase 2 UI refinements
- Building info panel shows: name, condition bar, staff list, daily output, synergies
- Assignment panel shows character availability across all buildings (not just one)
- Economic dashboard: daily income/expense breakdown, trend arrows, deficit warning
- Population chart: simple bar showing current/max with growth rate

### 💡 5C — Phase 2 sound
- Ambient drone shifts: warmer/busier as population grows
- Construction sounds when building in progress
- Resident murmur ambient (subtle crowd noise scaled to population)
- Event sounds: chime (already implemented), distinct sound for character arrivals

### 💡 5D — Mobile considerations
- Phase 2 has more UI elements and smaller map objects
- May need responsive layout for the build/zone/assign panels
- Touch targets must be large enough for placed buildings
- Current mobile gate (899px threshold) may need adjustment

---

## IMPLEMENTATION ORDER

1. **Layer 1 fixes** from Phase 1 roadmap — these apply to Phase 2 as well
2. **Layer 1A** — Author remaining characters (claude.ai task, then CC delivery)
3. **Layer 1B-1C** — Interactive map and building management view (CC tasks)
4. **Layer 2A-2C** — Economic depth (CC tasks, some design in claude.ai)
5. **Layer 3A-3B** — Community depth and expanded events (authoring in claude.ai, then CC)
6. **Layer 4A-4B** — Late game narrative (authoring in claude.ai, then CC)
7. **Layer 5** — Polish (CC tasks)
8. **Layer 4C** — Sandbox mode (CC task, last because it requires all other systems)

---

## CONTENT AUTHORING NEEDS

Phase 2 is content-heavy. The following must be written in claude.ai (Saunders voice, source text reference):

| Content | Count | Status |
|---------|-------|--------|
| Character profiles (traits, descriptions, arrival text) | 10-20 more | 💡 |
| Character events (2 per character) | 20-40 more | 💡 |
| Township events | 12+ more | 💡 |
| Minor events (Phase 2 specific) | 15+ more | 💡 |
| Population milestone events | 5 more | 💡 |
| End state narratives | 3-5 | 💡 |
| Building synergy flavor text | ~20 | 💡 |
| Assignment daily flavor lines (per trait) | Already written for existing 10 chars | ✅ |

Total estimated authoring: ~100-150 short passages, each 2-6 sentences. This is the bulk of Phase 2 work — the code is relatively simple, the content is the challenge.

---

## DEPENDENCIES

- Phase 1 gameplay fixes (Layer 1 of Phase 1 roadmap) must ship first — they affect both phases
- Character authoring blocks on source text reference (claude.ai only)
- Phase 2 building management view (Layer 1C) should be built before economic depth (Layer 2)
- Late game narrative (Layer 4) requires all characters to be authored and implemented first

---

*This document is a project reference file. Place at repo root alongside PHASE1_ROADMAP.md, PHASE1_STYLE.md, and PHASE2_STYLE.md. Update status markers as features are implemented.*
