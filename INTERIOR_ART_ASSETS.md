# INTERIOR ART ASSETS — CivilWarLand
### Last updated: April 11, 2026 (Liz session — ALL ROOMS COMPLETE)

## STATUS: ✅ ALL 7 IMAGES SELECTED

Next steps: download images, build hotspot mapper, map coordinates, code integration.

---

## STYLE GUIDELINES

See `AESTHETIC_INTERIORS.md` — all prompt structure, parameter, and iteration lessons live there.

---

## ROOMS

All seven interior backgrounds selected and locked. Midjourney job URLs below — images must be downloaded to `assets/interiors/` as PNG files for use in-game. CDN links return 403; images must live in the repo.

| # | Room | Status | Filename | Midjourney Job |
|---|------|--------|----------|----------------|
| 1 | Saloon | ✅ downloaded (PDF) | `saloon.png` | `d99b38a0-4f17-4435-bfa4-3a42da5e2486?index=0` |
| 2 | City Hall | ❌ needs download | `cityhall.png` | `8bf03d39-bd64-4f8d-bdf6-a71caa95b137?index=2` |
| 3 | Worship Center | ❌ needs download | `worship.png` | `4d086d64-eecc-4577-903e-b0e32facb2cd?index=0` |
| 4 | Thespian Center | ❌ needs download | `thespian.png` | `7852c503-4112-406a-85b1-8501fd28e266?index=0` |
| 5 | General Store | ❌ needs download | `general.png` | `25cdfcfd-8f4a-411e-b54e-b2d4c01245bb?index=1` |
| 6 | Infirmary | ❌ needs download | `infirmary.png` | `4eddf23b-6d1a-4439-b84e-408576e7dd47?index=0` |
| 7 | Erie Canal Lock | ❌ needs download | `canal.png` | `44f532b5-fd78-4a8b-8876-36c5f7cd04a0?index=1` |

**Filename convention:** matches `BUILDING_INTERIORS` key in `index.html` + `.png`. This lets the code do `"assets/interiors/" + state.activeInterior + ".png"`.

**Note:** Saloon is currently `saloon.pdf` — needs re-download or conversion to PNG.

### Object lists per room

1. **Saloon** — bar, stage, sylvia_booth, cannon_booth, jukebox
2. **City Hall** — desk, cane_chair, bigscreen, couch, tank, walkstick
3. **Worship Center** — dome, basin, mannequins, draperies, heater, speaker
4. **Thespian Center** — grizzly_suit, costume_rack, patrol_locker, rehearsal_mirror, script_pile, goose_masks
5. **General Store** — penny_candy, freds_counter, shelves, butter_knife_rack, event_log
6. **Infirmary** — exam_table, medicine_cabinet, cot, flag_pile, sink
7. **Erie Canal Lock** — lock_mechanism, campsite_diorama, video_screen, spraypaint, numbered_cobbles

---

## HOTSPOT COORDINATES

Each room's clickable objects need `{x, y, w, h}` rectangles mapped onto the background image. Use the hotspot mapper tool (`tools/hotspot-mapper.html`) to generate these.

Coordinates go here once mapped — one section per room:

*(Not yet mapped — waiting on image downloads and mapper tool)*

---

## INTEGRATION CHECKLIST

- [ ] Download all 7 images as PNG to `assets/interiors/`
- [ ] Convert or re-download saloon.pdf as saloon.png
- [ ] Map hotspot coordinates for all 7 rooms using mapper tool
- [ ] Record coordinates in this file
- [ ] CC implements rendering integration in `index.html`
- [ ] Push to GitHub Pages, verify in browser
