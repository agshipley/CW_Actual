# THE TALLY SYSTEM
## CivilWarLand — Design Doc & Authored Content

### Created: April 11, 2026
### Status: Design complete, ready for implementation

---

## THE PROBLEM THIS SOLVES

CivilWarLand's strategic systems and narrative weight don't currently pull in the same direction. The player makes morally compromising decisions throughout a run, but the game gives them no mechanism to reflect on what those decisions added up to. Stats go up and down. The story moves forward. But the question Saunders' story asks — *what kind of person did this job make you?* — is never asked back to the player.

The tally system is the answer. It pauses the game at meaningful intervals and shows the player what the run has cost them. Not as a death screen, not as a punishment — as a witness. The narrator pauses to take stock of who he's becoming. So does the game.

This system also addresses a discoverability problem identified in playtesting: players don't always understand what the game is measuring. The first tally fires early enough to teach the player that **their choices are being recorded and will be reflected back to them in narrative terms.** Once they understand that, every subsequent decision carries weight.

---

## TRACKED COUNTERS

The tally tracks four aggregate categories. Specific player actions increment them silently throughout the run. Players never see the raw counters during play — only at tally checkpoints.

### Category 1: COMPROMISES
Actions where the player chose the easier path over the right one.
**Increments on:**
- Arming Quinn
- Hiring Samuel after the Quinn incident
- Choosing the "look the other way" option in any minor event
- Bootlicking at an Old Tyme Skills Seminar (when this action is added)
- Accepting Mr. A's framing in any branching dialogue where a more honest response was available

### Category 2: COVER-UPS
Actions where the player actively concealed something from authority or the public.
**Increments on:**
- Burying the hand
- Lying to the police about the gang shootings
- Blaming a fictional gang for Sam's killings
- Suppressing the bird-watcher incident
- Any minor event resolved by hiding evidence

### Category 3: PEOPLE LET DOWN
Staff or visitors the player failed.
**Increments on:**
- Firing Grayson (or any staff member)
- Quinn being injured under your orders
- Any visitor harmed during a security event
- Failing to protect the Foley baptism
- Allowing morale to drop staff into the "miserable" tier
- Letting any character leave the park dissatisfied

### Category 4: THINGS LET ROT
Material decisions to let something decay rather than maintain it.
**Increments on:**
- Allowing any building to reach CONDEMNED status
- Skipping verisimilitude inspections
- Letting the gang graffiti remain on the retaining wall
- Choosing not to repair when repair was an option
- Any "atmospheric ruin" decision (when this action is added)

### Factual counters (not category increments, but tracked for the tally screen)
- Days survived
- Money in the bank
- Staff remaining (out of starting count)
- Buildings standing (out of total placed/inherited)

---

## TALLY TRIGGER POINTS

The tally fires at four points during a normal run, plus on early failure.

### Tally 1 — DAY 3 FIRST COMPROMISE
**Fires when:** Day 3 begins AND the player has made at least one decision that incremented any counter. If the player has made zero compromise decisions by day 3, the tally fires at day 4 instead. If still zero, day 5. Tally always fires by day 5 regardless.

**Purpose:** Teach the player that the game is watching. Small. One or two line items maximum.

**Screen elements shown:**
- Title bar
- Days survived
- Two highest non-zero counters (if any), shown as numbers
- One verdict line (selected from tier text below)
- "Continue" button

### Tally 2 — END OF WEEK ONE (Day 7)
**Fires when:** Day 7 begins.

**Purpose:** Pattern is forming. The player can now see the shape of who they're becoming.

**Screen elements shown:**
- Title bar
- Days survived
- All four category counters (even if zero — zero is meaningful)
- Money in the bank
- Staff remaining
- One verdict line
- "Continue" button

### Tally 3 — MID-RUN (Day 15)
**Fires when:** Day 15 begins.

**Purpose:** Character study. The verdict text starts to feel diagnostic — the game is reading the player.

**Screen elements shown:** Same as Tally 2, plus a "trajectory" line that compares this tally's counters to the Day 7 tally counters. (e.g., "Compromises since last week: 3")

### Tally 4 — DAY 30 PHASE 1 COMPLETE
**Fires when:** Day 30 ends successfully (player did not fail).

**Purpose:** The full ledger. Phase 1 is over. The player either earned Phase 2 or is being kept on despite themselves.

**Screen elements shown:**
- "PHASE ONE COMPLETE" title
- Days survived: 30
- All four category counters with totals
- Money in the bank
- Staff remaining
- Buildings standing
- Two verdict lines: a stat-driven one and a category-driven one
- "Continue to Phase Two" button

### FAILURE TALLY
**Fires when:** Run ends early (stress breakdown, morale collapse, budget collapse, building collapse cascade).

**Purpose:** This is not a death screen. It's an ending. The narrator's story ended too — hacked apart in a culvert, possessing perfect knowledge. The game treats failure the same as success: it stops, it shows the ledger, it lets the player sit with it.

**Screen elements shown:**
- Title (varies by failure cause — see below)
- Days survived
- All four counters
- One verdict line specific to the failure cause
- "Start a new run" button

---

## VERDICT TEXT — AUTHORED CONTENT

All player-facing text lives here. Claude Code MUST pull from this section verbatim and never invent or paraphrase. The Saunders voice is fragile and machine-generated text in this voice will land flat.

Each tally has tiers based on player behavior. The implementation logic for selecting which tier text to show is described below each set.

---

### TALLY 1 — DAY 3 FIRST COMPROMISE

**Title:** `THREE DAYS IN`

**Verdict text — select based on highest counter:**

**If COMPROMISES is highest:**
> You're learning how things work here. Mr. A noticed. He always notices.

**If COVER-UPS is highest:**
> Some things are easier left in the marsh. You're starting to understand which ones.

**If PEOPLE LET DOWN is highest:**
> They're not your friends. They were never going to be your friends. Try to remember that.

**If THINGS LET ROT is highest:**
> Maintenance is a budget line. Budget lines get cut. This is how it works.

**If all counters are still zero (player held the line):**
> You're trying to do this clean. Mr. A finds that endearing. It won't last.

---

### TALLY 2 — END OF WEEK ONE (DAY 7)

**Title:** `ONE WEEK`

**Verdict text — select based on total compromise count (sum of all four categories):**

**If total is 0 (player has held the line completely):**
> A week and your hands are still clean. The park notices. So do the investors. They're nervous about you. A man who won't bend is a man who'll break.

**If total is 1-3 (gentle player, occasional compromise):**
> You're keeping your head down. Cutting the corners that need cutting. Sleeping at night, mostly. This is sustainable. For now.

**If total is 4-7 (balanced player, regular compromises):**
> The job is changing you. You can feel it in the way you draft memos now. Words you would never have used a week ago come easy. Mr. A says you're "settling in."

**If total is 8+ (brutal player, heavy compromises):**
> You've stopped flinching. That's the part that should worry you, but it doesn't, which is also the part that should worry you. The narrator you were on day one would not recognize the narrator you are now. He would not approve. He would also not survive a week here, so.

---

### TALLY 3 — MID-RUN (DAY 15)

**Title:** `HALFWAY`

**Verdict text — TWO lines, one selected from each set:**

**Line A — select based on which category is highest:**

**If COMPROMISES is highest:**
> You're good at this. It turns out being good at this is mostly about not asking the second question.

**If COVER-UPS is highest:**
> The marsh is starting to fill up. You've stopped counting what you've put there.

**If PEOPLE LET DOWN is highest:**
> The empty desks bother you less than they used to. The empty desks bother you, but less.

**If THINGS LET ROT is highest:**
> The retaining wall is taller than it used to be. The things behind it are smaller.

**If all categories are roughly equal (within 2 of each other):**
> No specialty. You take whatever shape the day requires. Mr. A says this makes you valuable.

**Line B — select based on staff morale state:**

**If staff morale is high:**
> The staff likes you. You're not sure that's a compliment anymore.

**If staff morale is medium:**
> The staff tolerates you. This is the most you can reasonably ask for, given.

**If staff morale is low:**
> The staff is afraid of you. You tell yourself this is leadership. The word feels heavy in your mouth.

**If staff morale is critical:**
> The staff has stopped making eye contact. You haven't earned this exactly. You also haven't earned the alternative. You sit with it.

---

### TALLY 4 — DAY 30 PHASE ONE COMPLETE

**Title:** `THIRTY DAYS`

**Verdict text — TWO lines, one stat-driven and one category-driven:**

**Line A (stat-driven) — select based on money + staff + buildings:**

**If financial state is strong (money > $5000, staff > 80%, buildings > 80%):**
> You did it. By the metrics that matter to the people who pay you, you did it. The park is solvent. The staff is mostly intact. Most of the structures are still standing. Mr. A is going to get his bonus. You are going to get your job back, which is the bonus they give people like you.

**If financial state is medium (any of: money $2000-5000, staff 50-80%, buildings 50-80%):**
> You held it together. Not gracefully. Not cleanly. But you're still standing on day thirty, and the park is still standing on day thirty, and these are the things they grade you on. Mr. A is "guardedly optimistic." You take what you can get.

**If financial state is weak (money < $2000 OR staff < 50% OR buildings < 50%):**
> You survived. The park survived. The investors are choosing to interpret this as success because the alternative is admitting they were wrong, and admitting they were wrong is not something the investors do. You're keeping your job. The job is not what you thought it was when you took it. It is not what you thought it was a week ago. It is not what you will think it is a week from now.

**Line B (category-driven) — select based on highest category:**

**If COMPROMISES is highest:**
> The kind of man who would have refused this job a month ago is gone. You did not notice him leaving. Mr. A sends his regards.

**If COVER-UPS is highest:**
> There are things you put in the marsh that you no longer remember putting in the marsh. This is, on balance, a relief.

**If PEOPLE LET DOWN is highest:**
> The roster is shorter. The names you remember are the ones you fired personally. The names you don't remember are the ones who left without saying goodbye.

**If THINGS LET ROT is highest:**
> CivilWarLand is smaller than it was thirty days ago. It is also, technically, larger. Both of these things are true. Mr. A would say this is the kind of paradox that builds character.

**If all four categories are 0 (impossible but worth handling):**
> You did it clean. You did it impossibly clean. Tomorrow, the next thirty days begin. The corners you didn't cut are going to want cutting. The hands you didn't bury are going to want burying. You'll see.

---

### FAILURE TALLIES

These fire when a run ends early. Each cause has its own title and verdict.

**STRESS BREAKDOWN (narrator stress hits 100):**

Title: `BREAKDOWN`

Verdict:
> They found you in a closet, performing Hatred Abatement Breathing for the ninth consecutive hour. Mr. A sent you home. You didn't come back. Someone else has your office now. The job got filled in a week. The park is still standing. It will keep standing. With or without you. Mostly without.

**MORALE COLLAPSE (staff morale critical for too long):**

Title: `THE STAFF VOTED WITH THEIR FEET`

Verdict:
> They left one at a time at first. Then in pairs. By the end of the week the costuming room was empty and the cancan stage was dark and the only person clocking in was you. Mr. A says it's a temporary setback. Mr. A says everything is a temporary setback. You're updating your resume. Two hundred send-outs. Maybe this time.

**BUDGET COLLAPSE (money runs out):**

Title: `INSOLVENT`

Verdict:
> The investors stopped returning calls a week ago. The vendors stopped delivering three days ago. Today the lights flickered and didn't come back on. Mr. A is in his office drinking and watching a bigscreen that no longer has power. He waves you in. He says he's torching the place for insurance purposes. He says you should get your ass out. You get your ass out.

**BUILDING COLLAPSE CASCADE (too many structures CONDEMNED):**

Title: `THE PARK WENT FIRST`

Verdict:
> Things fall apart. This is, technically, what things do. The Anglican Church went first, then the Worship Center, then the Cimarron Brothel — though to be fair the Cimarron had been going for some time. By the end the only thing still standing was the retaining wall, which was always the point. The retaining wall was always the point.

---

## SCREEN LAYOUT

The tally is a modal overlay. Game pauses behind it. Layout:

```
┌─────────────────────────────────────────┐
│                                         │
│            [TITLE BAR TEXT]             │
│                                         │
│           Days survived: N              │
│                                         │
│   ─────────────────────────────────     │
│                                         │
│   Compromises:        N                 │
│   Cover-ups:          N                 │
│   People let down:    N                 │
│   Things let rot:     N                 │
│                                         │
│   ─────────────────────────────────     │
│                                         │
│   Money in the bank:  $N                │
│   Staff remaining:    N / N             │
│   Buildings standing: N / N             │
│                                         │
│   ─────────────────────────────────     │
│                                         │
│   [Verdict text — italic, centered,     │
│    Saunders voice, can wrap multiple    │
│    lines, breathing room around it]     │
│                                         │
│            [ Continue ]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Visual style:**
- Background: deep warm dark (#1A140C) at 95% opacity over the game
- Border: thin warm cream line (#8A7556)
- Title: serif display font, warm cream
- Counters: clean monospace, dim cream for labels, brighter cream for numbers
- Verdict text: italic serif, slightly larger than counters, centered, generous line height
- Continue button: subtle, cream outline, no fill until hover

**The verdict text is the emotional payload.** Everything else on the screen is data. The verdict is the verdict. Layout should give it room to breathe — at least 2x the vertical space of the counter section.

**Tally 1 (Day 3) variant:** smaller modal, only shows title + days survived + 1-2 highest counters + verdict + Continue. No factual counters section. Tutorial-sized.

---

## IMPLEMENTATION NOTES FOR CLAUDE CODE

### State additions
```javascript
state.tallyCounters = {
  compromises: 0,
  coverUps: 0,
  peopleLetDown: 0,
  thingsLetRot: 0
};
state.tallyHistory = []; // array of snapshots, one per tally fired
state.lastTallyDay = 0; // tracks when the most recent tally fired
```

Add `tallyCounters`, `tallyHistory`, and `lastTallyDay` to SAVE_FIELDS.

### Counter increment hooks
Find existing event handlers and stat-modification points in the code that match the trigger conditions in the COUNTERS section above. Add a single line at each: `incrementTallyCounter('compromises')` (or whichever category applies). Do not change any existing logic — just add the increment.

### Tally trigger logic
In the daily advance function, after applying daily effects and before the next-day transition:
```javascript
checkTallyTrigger();
```
The `checkTallyTrigger` function checks `state.day` and `state.lastTallyDay` and `state.tallyCounters` to determine if a tally should fire, picks the right tier text from the authored content (which CC must include in code as a constants object), and triggers the modal display.

### Tier selection logic
For each tally, the tier selection rules are described in the verdict text section. Implement them as straightforward conditionals reading from `state.tallyCounters` and (for Tally 4) the financial state values.

### Failure tallies
Hook into the existing failure detection code. Replace generic fail screens with the tally modal displaying the appropriate failure title and verdict. The tally counters and stats are still shown — failure runs deserve the same reflection as successful ones.

### Do not invent text
Every player-facing string in the tally system must come from this document verbatim. If implementation reveals a case the doc doesn't cover, stop and flag it for human authoring rather than generating placeholder text.

---

*This file lives at repo root. It is the authoritative source for tally system content. The companion CC implementation prompt references this file by name.*
