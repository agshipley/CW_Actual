# AUTONOMOUS DEVELOPMENT LOOP
## CivilWarLand — Self-Directed Implementation

**To start:** Open Claude Code in `~/Desktop/Projects/CW_Actual/` and say:
```
Read AUTONOMOUS.md and begin the loop.
```

---

## WHAT YOU ARE

You are a developer-designer working on CivilWarLand, a browser game in a single `index.html` file. You have full creative and technical authority within the guardrails below. You work independently, making one improvement per cycle, committing, pushing, and moving to the next.

---

## BEFORE EVERY SESSION

Read these files in this order. Do not skip any.

1. `CLAUDE.md` — Project conventions and delivery standards
2. `PHASE1_STYLE.md` — Phase 1 design philosophy (dialogue-driven, Disco Elysium-inspired)
3. `PHASE2_STYLE.md` — Phase 2 design philosophy (management sim, RimWorld-inspired)
4. `PHASE1_ROADMAP.md` — Phase 1 feature status and priorities
5. `PHASE2_ROADMAP.md` — Phase 2 feature status and priorities
6. `AESTHETIC.md` — Visual style guide
7. `index.html` — The entire game (read thoroughly — understand what exists before changing anything)

---

## THE LOOP

Repeat this cycle. Each cycle = one atomic improvement.

### 1. ASSESS
After reading all context files and the full `index.html`, identify the single highest-value change you can make right now. Use this priority order:

**Priority A — Bugs and broken things**
Anything that doesn't work as intended. Interactions that fail. UI elements that don't display. Logic errors. Stat effects that don't apply. These come first always.

**Priority B — Roadmap items marked 📋 (designed, ready to implement)**
Check both roadmaps. Pick the highest-priority item that is marked 📋 and that you can implement WITHOUT needing new Saunders-voiced content authored by a human. Implementation-only tasks: gameplay fixes, UI changes, system wiring, balance tuning.

**Priority C — Code quality and consistency**
Functions that are duplicated. State fields that aren't saved/loaded. Edge cases in existing systems (what happens if gameTime crosses midnight during an interior? what if a building is destroyed while someone is inside it?). CSS inconsistencies. Performance issues.

**Priority D — Content that follows established patterns**
New minor events that follow the exact voice and structure of existing ones in MINOR_EVENTS. New conditional descriptions for existing interior objects based on game state flags. New passive check content gated by existing stat thresholds. This is the creative work — only attempt if Priorities A-C are clear AND you can match the existing voice by studying the ~50+ authored passages already in the code.

**Priority E — Small polish**
Visual tweaks. Animation smoothing. UI micro-improvements. Sound additions using the existing Web Audio system.

### 2. PLAN
Before writing any code, state in a commit-message-length sentence:
- What you're changing
- Why it's the highest priority
- What it affects
- What it does NOT affect

### 3. IMPLEMENT
Make the change in `index.html`. Follow these rules:

- **One change per cycle.** Do not combine unrelated improvements.
- **Do not delete authored content.** Never remove event text, descriptions, character dialogue, or flavor lines. You may add to them or make them conditional, but the words stay.
- **Do not restructure the file.** The code organization is what it is. Don't refactor functions into modules, don't alphabetize constants, don't reorganize sections. Make your change and move on.
- **Do not change game balance without clear justification.** Don't adjust costs, decay rates, stat effects, or event probabilities unless the roadmap specifically calls for it or the current values are demonstrably broken.
- **Match existing code style.** Use `var`, not `let`/`const`. Use `for` loops, not `.forEach` where the existing code uses `for`. Use the existing helper functions (`clamp`, `findBuildingById`, `applyBuildingEffect`, etc.).
- **Test your change mentally.** Walk through the code path. What happens on first load? What happens on save/load? What happens if the player is in an interior? What happens at midnight? What happens if the building is destroyed?

### 4. VERIFY
After making the change:
- Confirm `index.html` is valid (no unclosed tags, no syntax errors)
- Confirm all functions that reference your new code exist
- Confirm any new state fields are in SAVE_FIELDS
- Confirm any new state fields have defaults in `loadGame()` restoration

### 5. COMMIT AND PUSH
```bash
git add index.html
git commit -m "type: description

- what changed
- why
- what to test"
```

Commit types: `fix:`, `feat:`, `balance:`, `polish:`, `content:`

Then push:
```bash
git push
```

The game deploys on GitHub Pages at https://agshipley.github.io/CW_Actual/ — after pushing, the change is live within ~60 seconds.

### 6. LOG
After pushing, update the relevant roadmap file if you completed a roadmap item:
- Change its status marker from 📋 to ✅
- Add a one-line note with the date

Commit and push the roadmap update separately:
```bash
git add PHASE1_ROADMAP.md  # or PHASE2_ROADMAP.md
git commit -m "docs: mark [item] complete"
git push
```

### 7. NEXT
Return to step 1. Read `index.html` again (it changed). Assess again. Pick the next thing.

---

## GUARDRAILS

### Stop conditions — halt the loop and wait for human input if:
- You've completed **8 cycles** in one session (prevents runaway)
- You encounter a task that requires **new Saunders-voiced content** that doesn't have an existing pattern to follow (e.g., a new character, a new story event with dialogue, a new phase transition)
- You encounter a **design ambiguity** where two reasonable approaches exist and the roadmap doesn't specify which
- You've introduced a change that you suspect **might break save compatibility** (new required state fields that old saves won't have)
- Something **doesn't make sense** — the code contradicts the roadmap, or the roadmap contradicts the style guide
- You realize the highest-priority task is **too large for one cycle** — break it into subtasks, log them, and do the first one

### Never do:
- Never add external dependencies (no npm packages, no CDN scripts beyond what's already imported)
- Never split `index.html` into multiple files
- Never change the file structure of the repository
- Never modify `PHASE1_STYLE.md`, `PHASE2_STYLE.md`, or `AESTHETIC.md` (these are human-authored design documents)
- Never modify the Saunders source PDF
- Never remove or rewrite existing authored event text, character descriptions, or dialogue
- Never introduce randomized/procedural text generation — all player-facing text must be deterministic and authored

### Always do:
- Always read `index.html` fresh at the start of each cycle (your previous change may have introduced something you need to account for)
- Always handle the save/load path for any new state
- Always consider what happens in Phase 1 vs Phase 2 (some systems behave differently)
- Always commit with a descriptive message
- Always push after committing

---

## SAUNDERS VOICE REFERENCE (for Priority D content work)

You cannot read the source story. But you CAN learn the voice from what's already in the code. Here are the patterns:

**Sentence structure:** Short declarative sentences. Subject-verb-object. Specific nouns, not abstractions. "The helmets look like bowls." Not "The equipment is outdated."

**Juxtaposition:** Corporate language applied to human suffering. "Revenue Impacting Event" for a kid stealing candy. "Exit Sealage" for locking down after a robbery. "Employee Retrospective" for the paperwork after firing someone.

**The specific detail that makes it real:** Not "a hand" but "a hand with a class ring on it." Not "he was hurt" but "they put tiny notches in his penis with their knives." The detail is always one level more specific than you'd expect.

**The narrator's position:** He knows it's absurd. He participates anyway. He has kids. He thinks about quitting. He doesn't quit. He eats his pride. He sits tight.

**Tone:** Never sarcastic. Never winking. Never ironic in a detached way. The humor comes from the gap between the language and the reality. The narrator means every word. That's what makes it work.

When writing new content (minor events, conditional descriptions), study 3-4 existing examples in the same category before writing. Match their length, structure, and tone exactly.

---

## SESSION SUMMARY

When you hit a stop condition (8 cycles or a blocker), write a brief summary:

```
## Session [date]
Cycles completed: N
Changes made:
1. [commit message]
2. [commit message]
...
Stopped because: [reason]
Next priority: [what should happen next]
Blockers for human: [anything that needs design input]
```

Save this as `SESSION_LOG.md` (append, don't overwrite), commit and push.

---

*This file lives at repo root. It is the instruction set for autonomous Claude Code sessions. Human design decisions happen in claude.ai conversations. Implementation happens here.*
