# Smoke Test

Run this after every meaningful change. Budget ~5 minutes. Same path every time.
A "meaningful change" is anything touching render(), applyMidnight(), enterBuilding/leaveBuilding,
the event system, save/load, or stat calculations.

---

## 1. Startup & Title Screen

- [ ] Page loads, title screen appears, no console errors
- [ ] "Continue" button visible only if a save exists; hidden otherwise
- [ ] "Enter the Park" starts a fresh game at Day 0, $50,000, time 08:00

---

## 2. Exterior Walk & Time

- [ ] Clicking the map moves the narrator (gold dot) to that point
- [ ] Pause/1x/2x/4x speed buttons change game speed visibly (clock advances faster)
- [ ] Clock advances; day number increments at midnight
- [ ] Narrator energy drains while walking; stops draining when still
- [ ] Weather overlay appears correctly (fog/rain dimming, rain streaks)

---

## 3. Building Interaction

Walk the narrator to the Saloon or City Hall.

- [ ] Interact prompt appears with building name and correct buttons
- [ ] "Interact" button applies its effect (check Budget or Morale changes in sidebar)
- [ ] "Repair" button costs $200 and increases condition (only shows when condition < 100)
- [ ] "Rest" button restores energy and advances time 1 hour
- [ ] After using Interact, the button grays out for the rest of the day
- [ ] After midnight, the button is available again

---

## 4. Interior Entry & Exit

Walk to Saloon, City Hall, or Worship Center and press Enter.

- [ ] Interior renders — either the painted background image or procedural fallback
- [ ] Clicking an object starts the narrator walking toward it
- [ ] Narrator arrives, "15 MINUTES PASS" notification appears, object panel updates
- [ ] Object description appears; upgrade button shows with correct cost
- [ ] "← Leave" exits the interior, restores exterior view, unpauses game
- [ ] Re-entering the same building shows no visual artifacts

**Edge case — midnight crossing inside interior:**
- [ ] If you examine enough objects to push time past midnight, the game exits the
      interior automatically, advances the day, and returns to exterior play

---

## 5. Narrative Events

Advance to Day 3 (use the debug "Skip to Day 30" button or speed through).

- [ ] Tally screen appears at Day 3 — shows counters, Saunders-voice verdict text
- [ ] Clicking Continue dismisses it and returns to exterior play
- [ ] A story event (any day 5–15 event) appears with choices
- [ ] Making a choice applies the described effects to sidebar stats
- [ ] Event overlay fully dismisses; game is playable afterward

---

## 6. Save & Load

- [ ] Press Escape (or Quit button) → saves and returns to title screen
- [ ] "Continue" button now visible on title screen
- [ ] Loading restores: day, budget, stats, building conditions, placed buildings
- [ ] Game resumes in exterior view with game paused (not mid-event, not mid-interior)

---

## 7. Fail States

Use the debug "Kill Stat" button to force a failure.

- [ ] Failure tally screen appears with correct title and Saunders-voice text
- [ ] "Start a new run" reloads the page cleanly

---

## Notes

- Open the browser console before starting. Any uncaught error is a blocker.
- If a step fails, note which step and what you observed — that's enough to file a bug.
- This list covers Phase 1 only. Phase 2 (The Community) has its own interactions
  that are not tested here.
