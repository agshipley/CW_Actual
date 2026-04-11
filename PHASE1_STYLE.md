# PHASE 1 — STYLE & DESIGN GUIDELINES
## CivilWarLand in Bad Decline: Days 1–30

### Reference: Disco Elysium (ZA/UM, 2019)

---

## CORE IDENTITY

Phase 1 is a **dialogue-driven narrative survival sim**. The player is not building anything. The player is not managing an economy in any meaningful strategic sense. The player is walking through a failing park, talking to people, and making decisions that determine whether the place and the people in it survive thirty days.

The closest reference is Disco Elysium's Martinaise: a decaying place full of people who are stuck there, each with their own angle, each willing to talk to you about it. The player's primary verb is **talk**. The secondary verb is **choose**. Everything else — walking, time management, stat tracking — exists to give those two verbs weight.

---

## DESIGN PRINCIPLES

### 1. Dialogue Is Gameplay

In Disco Elysium, there is no combat. There are no puzzles in the traditional sense. The game is conversations that branch, reveal, and alter the world state. CivilWarLand Phase 1 should feel the same way.

When the player enters a building, they should find **a person**. Not an upgrade menu. Not a list of objects. A person who has something to say, and whose response to you depends on what has happened so far. The conversation IS the interaction. The stat effects emerge from the conversation, not from clicking a button labeled "+5 morale."

### 2. Characters Are the System

Disco Elysium's 24 skills are literally voices in the detective's head — they have personalities, they argue with each other, they have opinions. CivilWarLand's version of this is simpler but follows the same principle: **characters are the mechanical system**.

Quinn is not a stat block. Quinn is a man in a bear suit with six kids who is afraid of nerve damage. When you talk to Quinn, what he says depends on the park's state. If morale is low, Quinn is scared. If you armed him, Quinn is different. If you didn't arm him, Quinn is different in a different way. The conversation changes the stats, but the player experiences it as talking to Quinn.

Each character should feel like they have an inner life that continues when you're not looking. Their dialogue should reference things that happened, things that are happening, and things they're worried about.

### 3. Time Is the Only Resource

In Disco Elysium, time advances when you talk to people and examine things. Walking is free. This is the correct model for Phase 1.

Every conversation costs time. Every examination costs time. The player has a fixed number of game-hours per day and must choose: do I talk to Quinn, or do I talk to Sylvia? Do I examine the spraypaint on the Lock, or do I go check on the Infirmary? You cannot do everything. The day ends whether you're ready or not.

This creates the same feeling Disco Elysium achieves: the anxiety of knowing there are conversations you're missing, people you haven't talked to, things happening out of sight.

### 4. Failure Is Narrative

Disco Elysium's most celebrated design choice: failing a skill check is often more interesting than passing it. The game doesn't punish you with a "game over" screen — it gives you a different, sometimes better, story.

CivilWarLand should follow this. When stats hit critical levels, the game doesn't just end — it produces specific, authored narrative content. When you make a bad decision in an event, the consequence should be a scene, not just a number change. The player should feel "that was a disaster" through the writing, not through watching a bar go red.

The existing endings (day 30) already do this well. The principle needs to extend to mid-game consequences.

### 5. The Narrator's Voice Is a Character

In Disco Elysium, the skills literally speak to you. "INLAND EMPIRE — Something terrible happened here." CivilWarLand's equivalent is the narrator's internal voice — the Saunders voice. When the player examines something, clicks on something, or enters a conversation, the narrator's internal monologue should comment on it.

This voice should be: resigned, observant, darkly comic, self-aware about the absurdity but unable to do anything about it. The voice of someone who knows exactly how bad things are and still shows up to work.

### 6. The Saunders Principle: Decline as Default

Everything gets worse on its own. The player's effort slows the decline but cannot reverse it. Every good outcome is temporary. Every fix is a patch on a bigger problem. The game should feel like holding water in your hands — you can do it, but not forever, and you know it.

This is not nihilism. Saunders' characters care deeply. They try. They show up. The game should honor that. But the system itself should be honest about the trajectory.

---

## VOICE & WRITING

### Narrator Internal Monologue
- First person, present tense
- Saunders' cadence: short declarative sentences, corporate euphemism used to describe human suffering, the specific detail that makes the absurd real
- Never sarcastic. Never winking at the player. The narrator means every word — that's what makes it funny and devastating
- Example: "The Infirmary smells like antiseptic and Confederate flags. Quinn was here after the cannon incident. I wrapped him in a flag and put him in a hay cart. The flag was surprisingly warm."

### Character Dialogue
- Each character has a distinct voice. Quinn is anxious and earnest. Sylvia is precise and enjoys knowing things you don't. Mr. A is delusional and commanding. Samuel doesn't talk much.
- Dialogue should be **short**. 2-4 sentences per exchange. This is a game, not a novel. The player should want to click through dialogue, not dread it.
- Characters should reference shared history. If Quinn was humiliated at the cannon, he references it. If you fired Grayson, the remaining characters reference his absence.

### Object Descriptions (when examining non-character items)
- Brief, specific, Saunders-voiced
- Should connect the object to a character or event. Not "A desk." but "Mr. A's desk. Three phones. One works."
- Should imply a story in one sentence

---

## MECHANICAL FRAMEWORK

### Building Interiors: Conversations, Not Menus
When the player enters a building, they encounter:
1. **A character** (primary interaction — dialogue tree)
2. **Examinable objects** (secondary — narrator monologue, time cost, occasional stat effect)
3. **Context-sensitive options** (tertiary — appear only when game state warrants them)

The character dialogue is the main event. Objects are texture. The building is not a shop.

### Dialogue Structure (adapted from Disco Elysium)
Each conversation has:
- **Opening line**: Character says something based on current game state (morale, recent events, their assignment, time of day)
- **Player responses**: 2-3 options. Each reveals different information or produces different effects. No option is purely mechanical — each is a sentence the narrator would actually say.
- **Outcome**: Stat changes happen as a RESULT of the conversation, explained through the dialogue itself. "Quinn looks relieved. He's going to show up tomorrow." (+3 morale) — the morale change is visible but the player feels it as a story beat.

### Passive Checks (simplified from Disco Elysium)
Disco Elysium uses 24 skills for passive checks. CivilWarLand uses the existing narrator stats:
- **Energy > 60**: The narrator notices things a tired person wouldn't. Extra descriptive lines appear. Occasionally reveals hidden dialogue options.
- **Stress < 40**: The narrator is calm enough to be diplomatic. Certain confrontational dialogue options are replaced with more measured ones.
- **Stress > 70**: The narrator is fraying. Dialogue options become more desperate, more honest, sometimes counterproductive. The Saunders voice gets rawer.

These are not dice rolls. They're automatic: if the stat meets the threshold, the content appears. If not, it doesn't. The player never sees the check happening — they just notice that sometimes the narrator says things they haven't seen before.

### Thought System (simplified from Disco Elysium's Thought Cabinet)
After key conversations or events, the narrator "internalizes" a thought — a short phrase that represents a conclusion or worry. These persist in a small UI element and provide minor ongoing stat modifiers.

Examples:
- **"The flags are warm"** (after wrapping Quinn in the Confederate flag) — -1 stress/day, the narrator has learned to find comfort in absurd details
- **"Don't take this too personal"** (if Samuel was armed) — -2 morale/day, the narrator knows what Samuel does and can't unknow it
- **"We're investing in the future"** (after repeated deficit warnings) — +$100/day revenue, the narrator has internalized Mr. A's delusion enough to sell it to others

Maximum 3-4 active thoughts. New thoughts can replace old ones. This is the game's progression system for Phase 1 — not building things, but accumulating psychological weight.

---

## UI PRINCIPLES

### The Sidebar
- Stats are visible but **not the focus**. The focus is the canvas — the map, the buildings, the characters.
- The event log should read like a diary, not a database. "Day 6 — Armed Quinn. God help us." not "Day 6: Quinn armed. gangThreat -4."

### The Dialogue Panel
- Replaces the interior overlay when conversations are active
- Left side: character portrait or name in the Saunders-voice style (no pixel art faces — text and color)
- Right side: dialogue text and response options
- Stat effects shown subtly after the player has committed to a choice, not before. This is the opposite of showing effects on hover — the player should make choices based on the story, not the math.

### The Map
- Characters are visible, walking, alive. The map should feel inhabited, not diagrammatic.
- When you approach a character, their name and a one-line status should appear. "Quinn — Nervous" or "Sylvia — Has information."
- Buildings glow warm at night if occupied. Dark if not. This tells a story without UI.

---

## WHAT PHASE 1 IS NOT

- Not a city builder. No placing buildings in Phase 1.
- Not a tycoon game. No upgrade menus inside buildings.
- Not an economy sim. Budget exists as a survival stat, not as something the player optimizes.
- Not a strategy game with perfect information. The player should feel uncertain, reactive, human.
- Not a game you "win." You survive, or you don't. The endings are authored, not scored.

---

## REFERENCE TOUCHSTONES

| Game | What to take | What to leave |
|------|-------------|---------------|
| Disco Elysium | Dialogue as primary mechanic. Passive checks. Thought system. Failure as narrative. Time as scarce resource. | 24-skill complexity. Dice rolling. Detective framing. |
| Saunders (source text) | Voice. Specific detail. Corporate language masking human pain. The earnestness beneath the absurdity. | The short-story structure (we need ongoing narrative, not a single arc). |
| RimWorld | Characters with traits producing emergent stories. Events that chain. Decline as pressure. | Direct colony management. Player-as-god perspective. Procedural generation. |

---

*This document is a project reference file. Place at repo root alongside AESTHETIC.md and CLAUDE.md. All Phase 1 feature work should be reviewed against these principles.*
