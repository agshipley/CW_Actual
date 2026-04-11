# INTERIOR ART ASSETS — CivilWarLand
### Last updated: April 11, 2026 (Liz session)

## STYLE GUIDELINES (LEARNED THROUGH ITERATION)

**What works:**
- Style described in WORDS, NOT via `--sref`. Reference images lock color too aggressively.
- Phrase: `oil painting style with visible brushstrokes and illustrated linework like Disco Elysium concept art`
- Standard params: `--ar 16:9 --style raw --v 7`
- Always include `--no stage curtain curtains red drapes`
- Each room gets explicit color callout: "color palette of X, Y, Z, NOT red NOT brown"
- Describe space accurately to source ("modest lodge not cathedral", "backstage not stage")
- Reference Saunders tone ("trying to be holy and not quite succeeding")

**What doesn't work:**
- `--sref` from Saloon image — overpowers color even at `--sw 30`
- Generic descriptions — Midjourney defaults to clichés
- Forgetting `--no` parameters — red curtains everywhere

## ROOMS

1. **Saloon** ✅ https://www.midjourney.com/jobs/d99b38a0-4f17-4435-bfa4-3a42da5e2486?index=0
2. **City Hall** ✅ https://www.midjourney.com/jobs/8bf03d39-bd64-4f8d-bdf6-a71caa95b137?index=2
3. **Worship Center** ✅ https://www.midjourney.com/jobs/4d086d64-eecc-4577-903e-b0e32facb2cd?index=0
4. **Thespian Center** ⏳ in progress — dusty yellows/sage/wood, no --sref
5. **General Store** 📋 — natural daylight, warm wood
6. **Infirmary** 📋 — cool institutional greens/whites
7. **Erie Canal Lock** 📋 — stone grays, water greens

## NEXT STEPS
1. Finish Thespian (test no-sref approach)
2. Generate remaining 4 rooms
3. Build hotspot mapper tool
4. Map coordinates per image
5. Code integration via Claude Code
