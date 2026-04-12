# AESTHETIC.md — CivilWarLand Visual Brand
### Authored from the April 11, 2026 Midjourney session (Liz)

This is the playbook for generating any future visual asset for CivilWarLand. Every principle below was learned through specific judgment calls during the interior background generation session. Do not deviate from these without good reason.

---

## THE BRAND IS THE SEVEN ROOMS

The visual brand of CivilWarLand is **the seven locked interior images**, not Disco Elysium, not any external reference. Disco Elysium was the seed prompt; the brand evolved through iteration. URLs in `INTERIOR_ART_ASSETS.md`.

When generating any new asset, the test is: **would this feel like it belongs in the same game as those seven rooms?** If no, rework.

---

## TEN PRINCIPLES (LEARNED THROUGH ITERATION)

### 1. Object legibility beats painterly beauty
Given a choice between a more illustrated image and a more painterly one, choose the one where individual objects are visually distinguishable. The game needs the player to identify clickable elements. A gallery-quality painting that blurs objects into atmosphere fails the gameplay test.

### 2. Each room gets its own color identity
Visual consistency does NOT mean uniform palette. The Saloon is amber and red because it's a bar. The Worship Center is cream and gold because it's a sacred space. The Infirmary is institutional green because it's clinical. Forcing a single palette across rooms creates dullness, not coherence.

### 3. Source narrative coherence beats visual grandeur
If a generation looks beautiful but contradicts the Saunders source, reject it. The Worship Center is a modest lodge, not a cathedral. The narrative truth is non-negotiable.

### 4. Describe style in words, never via `--sref`
Style references lock color too aggressively. The phrase to use is `oil painting style with visible brushstrokes and illustrated linework like Disco Elysium concept art`. This goes at the END of the prompt, not the beginning. Leading with painterly language pushes generations toward abstraction.

### 5. Describe ambiguous objects AS objects
"Bear costume" reads as a live bear wearing clothes. "Empty fursuit hanging on a stand with head drooping" reads as the object you actually want. Use language of emptiness, deflation, drape, hang. Add `--no bear animal person actor` as backup.

### 6. Always include `--no` exclusions
Standard exclusions: `--no person bear animal stage curtain curtains red drapes blood gore photograph 3d render`. Adjust per room. Without these, Midjourney reproduces artifacts (especially the saloon's red curtain) across every generation.

### 7. Each room gets an explicit color callout
Format: `color palette of X, Y, Z, NOT red NOT brown` (unless red/brown is intentionally correct for that room). The negative callout matters more than the positive one.

### 8. Reference Saunders tone via specific phrasing
Bake the narrative engine into the prompt. Examples that worked:
- "trying to be holy and not quite succeeding" (Worship Center)
- "deeply confused about its own purpose" (Infirmary)
- "an earnest historical exhibit constantly being defaced" (Canal Lock)
- "cramped and slightly desperate" (Thespian Center)

### 9. Comedic register comes from insufficiency, not gore
When a room is meant to be darkly funny, the humor lands when the space is *inadequate* for its purpose. Bloodstains push too dark. A welcome sign next to insufficient supplies works. Saunders' comedy is the gap between intent and reality, not shock.

### 10. Visible capacity matters
If a space exists because people keep ending up there (infirmary), show capacity (two beds, not one). The room should communicate its use case visually without text.

---

## STANDARD PROMPT STRUCTURE

```
[Subject + setting], [lighting], [object 1], [object 2], [object N],
[Saunders tone phrasing], color palette of [X, Y, Z], NOT [excluded colors],
oil painting style with visible brushstrokes and illustrated linework like
Disco Elysium concept art, atmospheric, [mood], no people
--ar 16:9 --style raw --v 7 --no [exclusions]
```

Lead with subject. End with style + color + exclusions. Never lead with painterly language.

---

## STANDARD PARAMETERS

- `--ar 16:9` (matches game canvas)
- `--style raw` (reduces Midjourney beautification)
- `--v 7` (current model)
- `--no` exclusions per room

Do NOT use `--sref`. Do NOT use `--sw`. Describe style in words.

---

## TOOL & WORKFLOW

- **Tool:** Midjourney v7 web interface (midjourney.com)
- **Cost:** Basic plan, $10/month
- **Reference images for the brand:** the seven URLs in `INTERIOR_ART_ASSETS.md`
- **When iterating:** save URLs to the tracking doc as decisions get made, not at the end

---

*This file lives at repo root. Update it whenever new visual lessons get learned. The brand evolves through use.*
