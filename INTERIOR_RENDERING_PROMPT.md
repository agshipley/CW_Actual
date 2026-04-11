# INTERIOR RENDERING OVERHAUL — Claude Code Prompt
## Paste this entire file to Claude Code

---

Completely overhaul the interior rendering system. The current interiors use flat colored rectangles for objects and minimal atmosphere. Replace everything with a painterly, Disco Elysium-inspired rendering style using the canvas drawing tools already in the codebase (gradients, sketchStroke, wobble system, radial glows).

**Visual target:** Disco Elysium's indoor environments — Whirling-in-Rags bar, Dolorian Church. Layered color washes, visible light sources with radial gradients, objects as characteristic silhouettes with highlight edges, wear and stains on surfaces.

**Rule:** Do not change any game logic, object data, upgrade mechanics, interaction behavior, or the interior overlay/panel UI. Only change how `renderInterior()` and `renderInteriorObject()` draw to the canvas.

Read `AESTHETIC.md` before starting for the locked palette.

---

## PART 1: ROOM ATMOSPHERE

Replace the current `renderInterior()` room rendering (everything before the objects loop) with:

### Walls
- Base fill stays (interior.bgColor) but add THREE semi-transparent overlapping washes on top:
  - A slightly lighter warm wash (rgba of bgColor + 20 lightness, alpha 0.15) in the center 60% of the wall
  - A darker wash (rgba 0,0,0,0.12) in the top 20% (ceiling shadow — much stronger than current)
  - A warm wash (rgba 180,140,80, alpha 0.06) in the bottom 40% (reflected floor warmth)

- **Wainscoting line**: A horizontal wobbled line at 55% of the way from ceiling to floor line. Use `sketchStroke` with the room's seeded wobble. Color: darken bgColor by 15%, lineWidth 1.5. This divides the wall into upper and lower sections.

- **Water stains**: Using the room seed, place 2-3 semi-transparent dark streaks (rgba 30,20,10, alpha 0.08) that drip from the top, each about 3-5px wide and 15-25% of wall height. Slightly wobbled vertically. These are subtle — you should barely see them, but they add life.

- **Crown molding suggestion**: At the very top of the wall (y=2), a thin horizontal line in a slightly lighter color than bgColor, lineWidth 1, alpha 0.3. Wobbled.

### Light Sources
Each room gets a defined light source position that creates a radial gradient tinting everything:

- **City Hall**: Window at (0.85, 0.30) — cool daylight during day, warm amber at night (from desk lamp implied)
- **Worship Center**: Dome above at (0.50, 0.0) — golden glow always (the dome catches light)
- **Saloon**: Lamp at (0.50, 0.15) — always warm amber (bar lighting)
- **Thespian Center**: Stage light at (0.55, 0.10) — warm yellow, slightly theatrical
- **General Store**: Window at (0.05, 0.25) — cool daylight day, dim amber night
- **Infirmary**: Overhead at (0.50, 0.10) — cool fluorescent-ish (slightly blue-white)
- **Erie Canal Lock**: Open sky at (0.50, 0.0) — outdoor light, matches time of day fully

For each: create a large radial gradient from the light source position, radius covering ~70% of canvas. Inner stop: rgba of the light color at alpha 0.12. Outer stop: transparent. Draw this OVER the wall and floor. This is the single biggest visual improvement — it makes the room feel lit rather than flat.

### Floors — Enhanced
Keep existing plank lines but enhance:
- Alternate plank colors: every other plank row gets a slightly different shade (vary by ±8 in RGB from floorColor). Use the room seed for consistency.
- **Scuff marks**: 3-5 semi-transparent dark ellipses (rgba 20,15,8, alpha 0.06) placed randomly via room seed. These are old boot marks.
- **Worn path**: A subtle lighter strip (rgba 255,240,200, alpha 0.04) running from bottom-center (where narrator enters) toward the room center. Foot traffic over years.

### Vignette — Stronger
Increase the corner darkening. Current inner radius is 0.22 — change to 0.30. Current outer alpha is 0.32 — change to 0.42. This creates more dramatic framing and hides the rectangular edges of the canvas.

### Time-of-day integration
Check `state.gameTime`. If nighttime (<480 or >1080), increase the light source radial intensity by 50% (it's the only light) and add a global dark overlay (rgba 0,0,0,0.08) to the whole room. If dawn/dusk, add the same warm bloom the map uses (rgba 220,140,40 at low alpha).

---

## PART 2: OBJECT RENDERING DISPATCH

Replace `renderInteriorObject()` with a dispatch function:

```javascript
function renderInteriorObject(obj) {
  var drawFn = INTERIOR_DRAW_FUNCTIONS[state.activeInterior + ":" + obj.id];
  if (drawFn) {
    drawFn(obj);
  } else {
    renderInteriorObjectDefault(obj); // fallback to improved default
  }
  // Selection/hover indicators and label drawn after
  renderInteriorObjectChrome(obj);
}
```

`renderInteriorObjectChrome(obj)` handles: selection highlight, hover glow, name label, upgrade dot. Extract this from the current `renderInteriorObject`. The label should use the same dark-background-behind-text style but with slightly warmer background (rgba 20,16,10,0.65).

`renderInteriorObjectDefault(obj)` is an improved version of the current rectangle renderer — use it for any object that doesn't have a custom draw function yet. Improve it by: adding a subtle inner gradient (lighter at top), a 1px highlight line on the top edge (rgba 255,255,255,0.1), and wobbled outline instead of straight strokeRect.

---

## PART 3: OBJECT DRAW FUNCTIONS

Create `var INTERIOR_DRAW_FUNCTIONS = {};` as a global object. Each entry is a function that receives the obj and draws it to ctx. All coordinates should be computed from obj.x, obj.y, obj.w, obj.h (these are in normalized 0-1 coords — multiply by cw/ch).

Use `seededRand` with a seed derived from obj.id for all randomized elements (wobble positions, stain placement) so they're stable across frames.

For ALL objects, follow these Disco Elysium rendering principles:
- **Silhouette first**: Fill the characteristic SHAPE of the object, not a rectangle
- **One highlight edge**: The edge facing the room's light source gets a thin bright line (rgba 255,240,200, alpha 0.15-0.25)
- **Drop shadow**: Offset 2-3px opposite to light source, rgba 0,0,0,0.25
- **No outlines on the shape itself** unless it's metal/glass. Objects are defined by fill and shadow, not by border. This is the key Disco Elysium difference.
- **Warm palette**: Even "gray" objects lean warm (add a few points of red/yellow to any gray)

### CITY HALL

**desk** — A wide desk surface (horizontal plank, slight thickness) supported by two leg panels on each side. Three small rectangles on the surface suggesting phones. A drawer handle line below the surface. Wood grain suggested by 2-3 thin horizontal lines at low alpha across the surface. Color: warm dark walnut (#5A4228 base).

**cane_chair** — Curved back (a gentle arc from seat to top), seat as a horizontal shape, four splayed legs. One leg slightly shorter than the others (wobble). The paw blood stain: a small reddish-brown blotch (rgba 120,40,20,0.15) on the seat area. Cane weave suggested by a crosshatch pattern at very low alpha on the seat.

**bigscreen** — Large rectangle but with a visible bezel (darker border around a slightly lighter inner screen area). The screen itself has a subtle blue-white glow (radial gradient from center, rgba 160,180,200,0.12 — or warmer if Mr. A is "watching"). Antenna or cable suggested by a thin line going up from one corner.

**couch** — Long, low horizontal shape with rounded arm rests at each end. Sagging slightly in the middle (the top line curves down). Cushion divisions suggested by two vertical lines. A subtle indentation where Mr. A sleeps (slightly darker patch on one end). Upholstery color: faded burgundy-brown (#6A4A3A).

**tank** — Tall rectangle with rounded top corners (aquarium shape). The glass is a subtle blue-green tint (rgba 60,90,80,0.3) with a lighter area near the top (water surface line). 3-4 small fish shapes inside — just tiny elongated ovals in darker color, each at a slightly different y-position and angle. Seeded positions so they're stable. Small bubbles: 2-3 tiny circles near the top at very low alpha. Stand/cabinet below the tank in darker wood color.

**walkstick** — Long thin diagonal line (leaning against the wall). Curved handle at the top (a small hook shape). The stick itself tapers from top to bottom. Use sketchStroke for the main line to give it the hand-drawn feel. Warm wood color with a single highlight line on the light-facing side.

### WORSHIP CENTER

**dome** — This is viewed from INSIDE looking up. Draw a large golden arc spanning most of the object area. Concentric arc lines suggesting the dome's ribbing (3-4 arcs at decreasing radius, thin, in slightly darker gold). The center has a warm radial gradient (the light coming through gold). Small decorative shapes at the base where dome meets wall. This should be the most visually striking object in any interior — use richer colors than anything else. Gold: #B8924A with highlights up to #E8D090.

**basin** — A pedestal baptism font. Vertical pedestal (tapered, wider at bottom), topped with a wide bowl shape (a shallow arc or half-ellipse). If upgraded to real marble, the fill color is lighter and has a subtle veined texture (thin wavy lines at very low alpha). Water suggested by a small horizontal line inside the bowl with a slight blue tint.

**mannequins** — Two standing figure silhouettes side by side. Use a simplified version of drawCharacter's body shape — head circles, torso rectangles, but no detail. They should look slightly unsettling: perfectly still, holding small rectangular shapes (rosaries — just thin lines from their hands). If the upgrade has removed them, draw a faint ghostly afterimage (same shapes at alpha 0.05) — they were here. They're not anymore. You can still see where they stood.

**draperies** — Long vertical hanging fabric. Draw as a series of overlapping vertical curved shapes suggesting folds — 4-5 sinusoidal waves, each slightly offset, filled with rgba white at varying alpha (0.3-0.5). The leftmost and rightmost folds are darker (shadowed edges). At the bottom, the fabric pools slightly (wider, flatter curves). These hide the Siala carvings, so behind the draperies (peeking at edges), draw small dark hints of shapes — just enough to suggest something anatomically ambitious is hidden there.

**heater** — Boxy iron stove shape: rectangular body with a small chimney pipe going up and to the right. The body has a firebox door (small rectangle with a tiny latch). If the door is "open," draw warm flickering light (a small radial gradient in orange-red emanating from the firebox, rgba 200,100,30,0.15). Cast iron texture: very dark fill (#3A2820) with a slight metallic sheen (thin highlight line on top edge).

**speaker** — Small rectangular box mounted on the wall (draw a thin mounting bracket below it). A circular speaker cone on the front (concentric circles). A thin wire/cable running up to the ceiling. The volume knob: a tiny circle on one side. If upgraded (knob fixed), draw a small arc suggesting the knob is turned. If not upgraded, draw a tiny X over the knob.

### SALOON

**bar** — Long horizontal counter at bar height. The surface has a wood-grain feel (3-4 thin horizontal lines). Behind the bar: vertical shelving suggested by a rectangle with 2-3 horizontal shelf lines. On the shelves: bottle silhouettes — 5-7 vertical shapes of varying height and width, some rounded (whiskey), some tall and thin (wine). A couple of glasses (small triangular/trapezoidal shapes) on the bar surface. The whole thing should feel cluttered and warm. If top shelf is upgraded, the bottles are taller and there are more of them. Bar rail along the bottom (thin horizontal line).

**stage** — Raised platform (draw the front edge with visible boards/planks). Footlights along the front edge: 4-5 small warm circles. Above the stage: suggestion of curtain — two curved shapes from the top corners draping slightly inward, in deep red (#7A2A1A). The stage surface is slightly lighter than the floor (it's newer wood, or at least more maintained). If boards are repaired (upgraded), draw them even and straight. If not, one board is visibly crooked (a plank line at an angle).

**sylvia_booth** — A corner booth: L-shaped bench seat with high back. The seat is a dark leather color (#4A3828). The high back curves slightly. A small table in front of the seat with a folder on it (rectangular shape, slightly open). Sylvia's booth feels darker than the rest of the bar — it's in the corner, less light reaches here. Add a slight shadow overlay (rgba 0,0,0,0.06) over the whole object area.

**cannon_booth** — Similar to Sylvia's booth but with a distinguishing detail: a small decorative cannonball shape (circle) on the seat area where Quinn fell asleep. Maybe a few crumbs from frontier stew (tiny dots). The booth is otherwise standard — bench seat, high back, small table.

**jukebox** — Tall cabinet with a rounded/arched top. The front panel has a curved glass window (lighter fill suggesting the glass, with a faint glow). Below the glass: rows of song selector buttons (tiny horizontal lines). Two small speaker circles on the lower front. The whole thing has a warm amber glow around it (small radial gradient). Chrome trim suggested by thin bright highlight lines along the edges. Color: warm wood and brass (#6A5A40 body, #B8924A trim accents).

### THESPIAN CENTER

**grizzly_suit** — This is the visual centerpiece. A bear costume hanging on a stand/hook. The head: a large rounded shape at the top with two small ear bumps. Below: the torso hanging limp (wider at shoulders, tapering to waist). Two arms hanging at the sides, ending in paw shapes. The whole thing sags — it's empty, deflated. Color: warm brown (#6A4A28) with darker patches. The paw blood stain: small reddish marks on one paw (rgba 100,30,15,0.2). The suit should look simultaneously sad and funny — a heroic costume for an unheroic man, hanging empty.

**costume_rack** — A horizontal bar (rail) supported by two vertical stands. Hanging from it: 5-6 costume shapes of different colors — suggested by trapezoidal shapes (wider at bottom like hanging fabric) in muted period colors (blue-gray, tan, dark red, olive). One hanger is empty. Below the rack: a couple of shoes/boots (small dark shapes on the floor). If upgraded (expanded wardrobe), there are 8-9 costumes and they're more colorful.

**patrol_locker** — Tall rectangular metal cabinet, slightly ajar (the door angles open a few pixels). Through the gap: darkness and the suggestion of equipment (thin vertical shape = rifle). The metal surface: dark blue-gray (#3E4852) with a few scratches (thin light lines). A padlock shape on the latch. The locker should feel heavy and serious — it contains live ammunition.

**rehearsal_mirror** — Tall rectangle with an ornate frame (draw the frame as a slightly wider rectangle behind the mirror surface). The mirror itself: fill with a lighter version of the room's wall color (it reflects the room). Add a subtle gradient suggesting the mirror's curvature — lighter in the center, slightly darker at edges. A crack suggested by a thin diagonal line across one corner. At the base of the mirror: a few items on the floor (script pages, a water bottle — tiny shapes).

**script_pile** — NOT a rectangle. A loose pile of papers: overlapping rectangles at slightly different angles (use seeded rotation). The top pages are lighter (more recent), the bottom pages are yellowed. Some pages have tiny horizontal lines suggesting text. One page sticks out at an angle. A pencil shape (thin diagonal line with point) resting on top.

**goose_masks** — Mounted on the wall: 3-4 mask shapes. Humpty-Dumpty: a large oval (egg shape). Bo Peep: a circle with a small bonnet shape on top. The wolf: a circle with a pointed snout extension. These are flat shapes (masks seen from front). Each has two tiny dark dots for eye holes. The wolf mask should look more like a surprised dog than a wolf — draw the ears too perky, the snout too blunt.

### GENERAL STORE

**penny_candy** — Glass-fronted display case: a rectangular cabinet with a lighter (glass) front panel. Inside the glass: shelves with colorful dots and small shapes (the candy — taffy, hard candy, toy soldiers). Draw 10-15 tiny colored dots/shapes arranged on 2-3 shelf levels. Colors: muted pastels (these are old frontier candy). The glass has a subtle reflection highlight (diagonal bright line).

**freds_counter** — Long service counter with a visible front panel and a flat top surface. Behind the counter: a register shape (boxy shape with a drawer, if upgraded it has a small screen). On the counter: a few items (small rectangular shapes — receipt pad, pencil holder). The front panel has a kickboard at the bottom (darker strip). Fred is implied by the tidiness — everything is squared away.

**shelves** — Tall shelving unit against the wall. 4-5 shelves with items: mix of rectangular shapes (boxes), cylindrical shapes (jars/cans), and the renamed products (draw a few with tiny "labels" — just colored rectangles on the items). One item is clearly a Doritos bag shape (rectangular with a small triangle/chip shape) relabeled. If upgraded (premium items), the top shelf has shinier/more uniform items. Gaps between items where things have been sold or stolen.

**butter_knife_rack** — Small wall-mounted rack: a horizontal bar with 4-5 knife shapes hanging from it. Each knife: a thin blade shape (slightly curved) with a small handle. They're butter knives — blunt, short, harmless-looking. One slot is empty (the one that was pulled on Fred). The rack itself is simple wood with a small mounting bracket.

**event_log** — A ledger book on a small stand/podium. The book is open: two page shapes side by side, filled with tiny horizontal lines (text). The pages are slightly yellowed. A pen/pencil rests in the crease between pages. The stand is a simple angled surface on a single post. The book should look thick — this is a comprehensive log. Fred is meticulous.

### INFIRMARY

**exam_table** — Medical examination table: a flat padded surface (slightly rounded rectangle) on a pedestal base. The padding is a muted green (#5A7A68) — institutional. A thin paper sheet over the surface (lighter strip). Slightly elevated — draw thin legs/support. One end has a slightly raised section (headrest). The antiseptic smell can't be drawn but the clinical precision of the shape suggests it.

**medicine_cabinet** — Wall-mounted cabinet with a cross symbol on the door (simple + shape). If closed: flat front with the cross and a small handle. If upgraded (restocked), the door is slightly ajar showing organized shelves with bottle/box shapes inside in neat rows. If not upgraded, the door is slightly ajar showing half-empty shelves with a few items at angles (disorganized, running low). Glass in the door suggested by a lighter rectangle within the frame.

**cot** — Simple metal-frame bed. The frame: thin lines forming a rectangle with head and foot boards (simple vertical bars at each end). A thin mattress (slightly rounded rectangle, slightly sagging in the middle). A folded blanket at the foot (small rectangle in olive/gray). A pillow (small rounded rectangle at the head). The permanent indentation: a subtle shadow in the mattress center (rgba 0,0,0,0.06 oval).

**flag_pile** — A pile of draped Confederate flags. NOT flat rectangles — draw as folded/rumpled fabric shapes. Multiple overlapping irregular shapes in red, white, and blue patterns. The flags' crosses are suggested by lighter diagonal lines on the red shapes. The pile is messy, informal — these are blankets, not display flags. A corner of one flag drapes over the edge of whatever surface they're on. Warm despite themselves.

**sink** — Wall-mounted basin: a semicircle or shallow bowl shape extending from the wall. A faucet above it (an inverted U shape with a spout). A small oval mirror above the faucet. Pipes visible below the basin (two thin vertical lines going down into the wall/floor). A soap dish shape on one side. If Samuel's report was burned here: a faint dark smudge in the basin (rgba 30,20,10,0.08).

### ERIE CANAL LOCK

**lock_mechanism** — Large mechanical structure: thick vertical walls (the lock gates) with a horizontal beam across the top. A gear/wheel shape on one side (circle with spoke lines). The mechanism is iron and stone — dark metal colors (#3E4852) for the mechanism, warm stone (#8A7A62) for the walls. Water suggested at the base: a horizontal band in blue-green with subtle ripple lines. The whole thing should feel massive and old and functional — this is the one thing in the park that works.

**campsite_diorama** — A display case/diorama box: a rectangular frame with a scene inside. Inside: a tiny bunkhouse shape (miniature building), two small figure silhouettes, and the aromatic device (a small box shape with wavy lines coming up from it suggesting smell). The display case has a glass front (lighter overlay with a reflection highlight). If upgraded (ethnicity corrected), the figures have slightly different silhouettes. Behind the glass: small informational placard (tiny rectangle at base).

**video_screen** — A pull-down projection screen: wide rectangle hanging from a roller mechanism at the top. The screen itself is slightly off-white with a faint image suggested on it (very low alpha shapes — just enough to imply something is being projected). The pull-down mechanism: a horizontal cylinder at the top. A small projector shape on one side (boxy with a lens circle). If upgraded (new video), the screen image is slightly brighter/clearer.

**spraypaint** — A section of wall with graffiti: draw irregular colored marks — sprayed lines, drips, a crude drawing. Use the same colors as the exterior retaining wall graffiti (muted rust rgba 156,74,46 and teal rgba 78,112,104). The marks should look like actual spraypaint: uneven edges, drip lines going down from letters. If upgraded (cleaned), draw the wall clean but with a slightly different shade where the cleaning solution was applied (a lighter rectangular patch — you can tell something was removed). One tag should vaguely resemble Quinn in the Grizzly suit (a round head shape with ears on a body — crude but recognizable).

**numbered_cobbles** — Stones on the ground/floor: 6-8 irregular rounded rectangle shapes in varying sizes and subtle color variations (gray-brown stone colors). Each stone has a small number on it — draw as tiny text or just a small mark. The stones are slightly elevated from the surface (shadows on their lower edges). Mortar lines between them (thin lines in a slightly lighter color). One cobble (#847) should be positioned as if the narrator is looking right at it.

---

## PART 4: INTEGRATION

After implementing all of the above:

1. Delete the old `renderInteriorObject` function entirely. Replace with the new dispatch + chrome + default system.
2. Make sure all existing functionality is preserved: hover highlighting, selection, upgrade dots, labels, narrator walking to objects.
3. The interior overlay panel (the text panel at bottom) should not change at all.
4. Test by entering each of the 7 buildings and verifying all objects render and all interactions work.

Deliver the full updated `index.html` and push to GitHub.
