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
- Generic descriptions — Midjourney defaults to cliches
- Forgetting `--no` parameters — red curtains everywhere

## ROOMS

All seven interior backgrounds selected and locked. Midjourney job URLs below — images must be downloaded to `assets/interiors/` as PNG files for use in-game. CDN links return 403; images must live in the repo.

| # | Room | Status | Filename | Midjourney Job |
|---|------|--------|----------|----------------|
| 1 | Saloon | ✅ downloaded (PDF) | `saloon.png` | `d99b38a0-4f17-4435-bfa4-3a42da5e2486?index=0` |
| 2 | City Hall | ❌ needs download | `cityhall.png` | `8bf03d39-bd64-4f8d-bdf6-a71caa95b137?index=2` |
| 3 | Worship Center | ❌ needs download | `worship.png` | `4d086d64-eecc-4577-903e-b0e32facb2cd?index=0` |
| 4 | Thespian Center | ❌ needs download | `thespian.png` | `7852c503` (full ID TBD) |
| 5 | General Store | ❌ needs download | `general.png` | `25cdfcfd` (full ID TBD) |
| 6 | Infirmary | ❌ needs download | `infirmary.png` | `4eddf23b` (full ID TBD) |
| 7 | Erie Canal Lock | ❌ needs download | `canal.png` | `44f532b5` (full ID TBD) |

**Filename convention:** matches `BUILDING_INTERIORS` key in `index.html` + `.png`. This lets the code do `"assets/interiors/" + state.activeInterior + ".png"`.

**Note:** Saloon is currently `saloon.pdf` — needs re-download or conversion to PNG.

## HOTSPOT COORDINATES

Each room's clickable objects need `{x, y, w, h}` rectangles mapped onto the background image. Use the hotspot mapper tool (`tools/hotspot-mapper.html`) to generate these.

Coordinates go here once mapped — one section per room:

*(Not yet mapped — waiting on image downloads and mapper tool)*

## INTEGRATION CHECKLIST

- [ ] Download all 7 images as PNG to `assets/interiors/`
- [ ] Convert or re-download saloon.pdf as saloon.png
- [ ] Map hotspot coordinates for all 7 rooms using mapper tool
- [ ] Record coordinates in this file
- [ ] CC implements rendering integration in `index.html`
- [ ] Push to GitHub Pages, verify in browser
