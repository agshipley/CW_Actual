# PHASE 2 — STYLE & DESIGN GUIDELINES
## CivilWarLand in Bad Decline: Day 31+

### Reference: RimWorld (Ludeon Studios, 2018), Dwarf Fortress, SimCity

---

## CORE IDENTITY

Phase 2 is a **management simulation**. The player is no longer a character walking through a story — the player is an administrator running a community. The camera pulls back. The verbs change. The primary verb is now **assign**. The secondary verb is **build**. Dialogue recedes; systems emerge.

The transition should feel like a promotion that is also a loss. In Phase 1 you were a person who talked to people. In Phase 2 you are a manager who allocates people. The Saunders voice persists — this is still a place where things decline — but the intimacy of Phase 1 gives way to the loneliness of oversight.

---

## DESIGN PRINCIPLES

### 1. Systems Replace Conversations

In Phase 1, you talk to Quinn and learn he's afraid. In Phase 2, you assign Quinn to the Thespian Center and see his productivity modifier. The information about Quinn hasn't changed — he's still afraid, still earnest, still ugly as sin — but your relationship to that information has changed. You're no longer his colleague. You're his boss.

This is the emotional engine of Phase 2: the player has power over people they came to know as equals. Every assignment is a small act of authority. The Saunders voice should remind the player of this.

### 2. Characters Are Resources (and That Should Feel Wrong)

RimWorld's colonists have traits that make them good or bad at tasks. The player assigns them to jobs based on those traits. This is the correct mechanical model for Phase 2 — but CivilWarLand should make the player *feel* the moral weight of it.

In RimWorld, assigning a colonist to cleaning is neutral. In CivilWarLand, assigning Quinn to the Thespian Center because his "Aspiring Thespian" trait gives +3 morale should feel like you're using his dreams as a management tool. Because you are.

The trait descriptions, the assignment flavors, the daily reports — all of these should be written in the Saunders voice, which means they should be simultaneously efficient and devastating.

### 3. Expansion Creates Vulnerability

The map doubles at day 30. New land means new buildings, new zones, new people. But every new thing is also a new thing that can fail. Every building needs upkeep. Every resident has opinions. Every zone generates both revenue and complaints.

The city-builder temptation is to reward expansion with power. CivilWarLand should reward expansion with complexity. More buildings = more to maintain. More people = more events. More success = higher expectations. The Saunders principle (decline as default) scales with the community.

### 4. The AI Storyteller Model

RimWorld's best idea: an AI storyteller that controls event pacing. Cassandra Classic increases tension on a curve. Randy Random is chaos. CivilWarLand's Phase 2 should use a similar model — events escalate based on community size, wealth, and time.

Small community (pop < 25): Minor events. Complaints. Small crises.
Medium community (pop 25-75): Political events. Elections. Zoning disputes. Character-driven drama.
Large community (pop 75+): Existential questions. What is this place? Why are we here? The game's thematic concerns surface through events.

### 5. Decline Scales with Success

The bigger the community gets, the more expensive decline becomes. A park with 5 buildings and no residents can limp along. A community with 20 buildings, 100 residents, and a school needs everything to work — and when one thing breaks, it cascades.

This is the RimWorld death spiral adapted for Saunders: the moment you're doing well enough to feel safe is the moment you're most vulnerable. The game should teach the player this through experience, not through tutorials.

### 6. The Narrator Becomes an Administrator

The narrator's voice changes in Phase 2. Not the style — still Saunders, still first-person, still resigned and darkly comic — but the *content*. In Phase 1 the narrator describes what he sees. In Phase 2 the narrator describes what he's responsible for.

Phase 1: "Quinn is in the Grizzly suit again. He looks like he's been sleeping in it."
Phase 2: "Quinn is assigned to the Thespian Center. Productivity: +3. He's performing a one-man Hamlet. Attendance is up, though reviews are mixed on his decision to play Ophelia as well."

The narrator is still human, but he's speaking in reports now. The corporate language that Saunders satirizes becomes the player's actual interface.

---

## MECHANICAL FRAMEWORK

### Building System
- **Placement**: Click-to-place on expanded map. Grid-aligned. Cost deducted immediately.
- **Construction time**: 3 days. Building appears at 40% opacity with "UNDER CONSTRUCTION" label. One building at a time.
- **Categories**: Revenue (Sutler's Tent, Homestead), Defense (Watchtower, Artillery), Morale (Memorial Garden, Officers' Quarters), Productivity (Telegraph, Printing Press), Township (School, Clinic, Fire Station, Community Center).
- **Upkeep**: Each building has a daily cost. The player must balance revenue buildings against service buildings.
- **Condition decay**: All buildings lose condition daily. Repair costs money and narrator time. Neglected buildings become condemned (condition 0) and stop producing effects.

### Zoning System
- **Residential**: Enables population growth. Each zone houses 10 residents. Water tower required for pop > 30.
- **Commercial**: Generates revenue proportional to nearby residential population.
- **Civic**: Increases approval. Counteracts natural approval decay.
- Zones are placed on the expanded map. They interact with buildings based on proximity.

### Character Assignment System
- Each building has a **capacity** (0-2 staff slots).
- Characters have **traits** with building-specific effects. A trait may be positive at one building and negative at another.
- **Assignment produces**: Daily stat modifiers, flavor text in the log, and triggers for character-specific story events after consecutive days at a building.
- **Unstaffed buildings** still function but at reduced output (defined per building in PHASE2_BUILDING_META).
- **Character events** fire when a character has been assigned to a specific building for N consecutive days and other conditions are met (morale level, flags from Phase 1, etc.).

### Community Stats
| Stat | What it represents | Decay |
|------|-------------------|-------|
| Budget | Money. Revenue minus costs. | Net income applied daily. |
| Attendance | Park visitors per day. | -1/day base + random drift. |
| Morale | Staff willingness to continue. | -1/day base + random drift. |
| Gang Threat | External pressure. | +2/day base. |
| Productivity | How effectively the community operates. | -1/day base. |
| Population | Residents in the township. | Grows toward residential capacity. |
| Approval | Resident satisfaction. | -1/day + civic zone offset. |

### Event System (RimWorld-inspired)
Events are selected based on:
1. **Day number**: Story events fire on specific days.
2. **Population thresholds**: Community milestone events.
3. **Character conditions**: Character-specific events after consecutive days at a building.
4. **Random pool**: Minor events weighted by current state (high gangThreat → more gang events; high population → more community events).
5. **Deficit tracking**: Sustained deficit triggers escalating financial events.

Events are **authored, not procedural**. Every event has Saunders-voiced text. No generated content. The event pool is large enough to feel varied but every entry is hand-written.

### Milestone Characters
New characters arrive at day/population milestones. Each arrives with:
- An authored arrival scene (Saunders-voiced)
- 2-3 traits with specific building synergies
- A character event that fires after extended assignment to their best building

Characters are pre-written (in PHASE2_CHAR_DATA and PHASE2_MILESTONE_CHARS). They are not procedurally generated. This is deliberate: Saunders characters need to be specific, not algorithmic.

---

## VOICE & WRITING

### Assignment Flavor Text
When a character is assigned to a building, the daily log should include a short Saunders-voiced line describing what they're doing there. This is the primary narrative content of Phase 2 — not dialogue, but report.

Example: "Terrence has implemented dynamic pricing at the General Store. Visitors hate it. Revenue is up 40%."

These lines come from the trait's `flavor` field. They should be funny, specific, and slightly heartbreaking.

### Event Writing
Phase 2 events should feel like memos from a failing institution:
- The title is bureaucratic. "THE FIRST COMPLAINT." "PROPERTY VALUES." "THE ELECTION."
- The body is Saunders. Specific detail. Human behavior observed with precision and sadness.
- The choices are real. Not "good option / bad option" but "option that prioritizes X / option that prioritizes Y."

### Daily Reports
The budget tooltip already provides economic data. Phase 2 should expand this to include a brief daily narrative summary visible in the log: who did what, what broke, what's coming.

---

## UI PRINCIPLES

### The Sidebar Expands
Phase 2 adds: Productivity stat, Population stat, Approval stat, Structures count. The sidebar is now a dashboard. This is correct — Phase 2 is a management game and the player needs data.

### The Build Menu
Left-side overlay with building cards showing: name, cost, daily effects (green/red), description. Construction lock when a building is in progress.

### The Assignment Panel
Left-side overlay showing available characters, their current assignment, their traits, and a preview of how they'd perform at the selected building. Hover to preview, click to assign.

### The Map
Zoomed out (mapScale 0.5). The expanded territory is visible. Placed buildings and zones appear alongside the original park. The narrator still walks the map but is smaller — the world has gotten bigger than one person.

---

## WHAT PHASE 2 IS NOT

- Not dialogue-driven. Conversations are replaced by assignment effects and event text.
- Not Disco Elysium anymore. The intimacy is gone. That's the point.
- Not a sandbox without pressure. Decline continues. The game can still end in failure.
- Not a score-chaser. There is no "winning" — there are events that feel like milestones (pop 25, pop 50, pop 100) and an authored endpoint.
- Not procedural. Every character, every event, every trait flavor line is hand-written in the Saunders voice.

---

## THE TRANSITION (Day 30 → Day 31)

The transition between phases should feel abrupt and deliberate. The player has just survived thirty days of intimate, ground-level crisis management. They've talked to Quinn. They've buried a hand in the marsh. They've watched the church burn.

Then: the map doubles. New stats appear. A build menu materializes. Characters become assignable resources. The game literally changes genre.

This is the Saunders move: the thing you were doing — caring, personally, about specific people — is now a system. The park didn't change. You did.

The Phase 2 intro text should acknowledge this directly. Mr. A says "people are arriving." Not visitors. People. They need things. They need someone to be in charge of things. That someone is you. The narrator's response should be the silence of a man who knows exactly what this means.

---

## REFERENCE TOUCHSTONES

| Game | What to take | What to leave |
|------|-------------|---------------|
| RimWorld | Character traits → building synergies. AI storyteller pacing. Emergent stories from systems. Decline spirals. | Procedural generation. Player-as-god camera. Combat system. |
| SimCity / Cities: Skylines | Zoning system. Revenue/cost balance. Population as a growth metric. | Abstract citizen simulation. Traffic management. Infrastructure puzzles. |
| Dwarf Fortress | Characters with deep personality affecting behavior. Events that chain. "Losing is fun." | Overwhelming complexity. ASCII aesthetic. Fortress mode depth. |
| Frostpunk | Moral weight of management decisions. Laws as irreversible choices. Hope/Discontent as dual pressures. | Apocalyptic framing. Binary moral system. |
| Saunders (source text) | The voice. The specific detail. The corporate language. The feeling that authority is both necessary and corrosive. | N/A — Saunders is the foundation, not a reference. |

---

*This document is a project reference file. Place at repo root alongside AESTHETIC.md, CLAUDE.md, and PHASE1_STYLE.md. All Phase 2 feature work should be reviewed against these principles.*
