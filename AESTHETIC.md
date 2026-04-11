# CivilWarLand Aesthetic Guide

Visual brand guide for all art passes. Single source of truth. When a prompt references "the aesthetic" or "AESTHETIC.md," this is the document.

## Reference

**Disco Elysium** (ZA/UM, 2019), specifically the outdoor environments of Martinaise and the fishing village coast as painted by Aleksander Rostov. Not the character portraits, not the interiors — the isometric exterior scenes.

**What we are taking from Disco Elysium:**
- The palette (warm-dominant, rich but desaturated, cool shadows)
- The "lamplight holding back the dark" lighting philosophy
- The "height to fall from" principle — base colors are intentional, wear is applied on top
- The period-collision feel (Disco Elysium mixes 1870s and 1970s; CivilWarLand mixes 1860s and 1990s)
- Warm/cool variation as atmosphere, never uniform filters

**What we are NOT taking from Disco Elysium:**
- Literal painterly rendering. We're hand-drawn pen-and-ink illustration colored with DE's palette. Commit to this.
- Full gloom. CivilWarLand has comedy in it. Lit windows, warm accents, and character color are relief valves.
- Rostov's loose brushwork. Our line style is the sketchy wobble system we already built for characters.

## The One Rule That Matters Most

**Warm lit windows against cooler base.** Every habitable building has warm ochre windows that glow against a cooler environment. The warmth radiates slightly into the surroundings at night. If only one rule from this document is applied, make it this one. It's what makes Martinaise feel alive and sad instead of bleak and dead.

## Palette

### Ground

```
Primary grass:      #8A8458   (warm dusty olive)
Shadow grass:       #6A6442   (cooled olive in tree shadow)
Highlight grass:    #A89A68   (warm straw where sun hits)
Worn dirt patch:    #7C5E3A   (warm brown at doorways)
Path core:          #8C6A42   (compacted dirt walkway)
Path edge:          #5E4628   (darker worn edge)
```

### Buildings (base walls)

Each building should be ONE of these, not a custom color. The palette is intentionally limited so the map reads as coherent.

```
Weathered cream:    #D4B878   (Everly Mansion, Anglican Church — civic/proud buildings)
Warm wood brown:    #8C6238   (Thespian Center, Blacksmith, Kriegal Place — utilitarian wood)
Deep rust red:      #9C4A2E   (Saloon, Brothel — the warm-blooded buildings)
Dusty teal:         #4E7068   (Canal Lock, Infirmary — the cooler "institutional" buildings)
Muted slate blue:   #5E6E7C   (civic/administrative background)
Ochre gold:         #B8924A   (Worship Center dome ONLY — this is sacred and must glow)
Pale celadon:       #9AAC94   (select accents, garden walls)
```

### Roofs

```
Rust tile:          #7A3A24   (pairs with cream walls)
Warm umber wood:    #5E3A1E   (pairs with wood brown)
Slate shadow:       #3E4852   (pairs with teal / slate blue)
```

### Windows

```
Lit warm:           rgba(240, 200, 120, 0.72)   [THE HERO ACCENT]
Unlit dark:         rgba(40, 38, 34, 0.55)      (warm-dark, not cold)
Window frame:       #D4B878
Lamp glow bloom:    rgba(250, 210, 140, 0.25)   (soft radial around lit windows)
```

### Outlines

**Never use pure black. Never use neutral gray.**

```
Primary line:       #2E241E   (warm near-black umber)
Shadow line:        #1E1812
Interior detail:    #4A3A2A
```

### Atmospheric

```
Cool distance wash: rgba(80, 100, 120, 0.10)    (applied only to far elements)
Warm foreground:    no overlay — achieved via palette itself
```

### Wear layer (applied over base colors)

```
Rust streaks:       rgba(60, 30, 15, 0.35)      (verticals under metal fixtures)
Peeling paint:      small patches in #A89068 showing through
Water damage:       rgba(40, 50, 60, 0.25)      (cool stains from gutters)
Dirt accumulation:  rgba(50, 38, 22, 0.30)      (at base of walls)
```

## Composition Rules

1. **Warm/cool variation, never uniform filters.** A cool wash on the whole map is wrong. Cool shadows in recesses, warm light on exposed surfaces, is right.
2. **Warm is proximity, cool is distance.** Foreground elements render warmer and higher-contrast. Background elements (edges of map, far trees) get a slight cool wash.
3. **Warm accents are earned.** A lit window means something is happening inside. A gold dome means the building matters. Don't scatter warm accents randomly.
4. **Shadows pool in corners.** Under eaves, against walls, beneath roof overhangs, at the base of trees. That's where the deep cool values live.
5. **Outline weight varies.** Primary shapes get heavier outlines, detail gets lighter. No uniform 1px everything.

## Wear Philosophy: Height to Fall From

Every base color above represents "opening day 1975" — when the park was built with sincerity and hope. Wear is applied on top as damage, localized not global. The player must be able to see both states at once: the intention and the failure.

**Good wear:**
- One boarded window on an otherwise intact cream wall
- Rust streaks running from a single bolt, not covering the whole wall
- A patch of peeling paint at shoulder height where people touch
- Worn grass at a doorway where foot traffic lives
- A single missing shingle, not a half-collapsed roof

**Bad wear:**
- Uniformly desaturating a whole building "because it's old"
- Making everything gray
- Covering entire walls in grime
- Making the park look abandoned (it's in decline, not abandoned — people still work here)

## Period Collision

Remember: the park was built in 1975 to look like 1865. Wear and grime should be 1990s-1975 wear, not 1865-1975 wear. The park is thirty years old pretending to be one hundred and thirty. The cheap construction materials of 1975 — plywood painted to look like weathered board, fiberglass painted to look like stone — are failing in characteristically 1970s ways. Warped plywood, peeling simulated-wood paint, rusted corrugated metal.

The park is a sincere lie twenty years past its prime. Every visual decision should honor that.
