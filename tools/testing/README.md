# Test tools

Three Node scripts that drive the real game in a headless browser over the Chrome DevTools
Protocol. They have no npm dependencies; they need Node 22+ (for built-in `WebSocket`) and a
Chrome or Chromium binary.

The browser is located automatically: `$CHROME_PATH` first, then Playwright's cached headless
shell (`~/Library/Caches/ms-playwright`), then an installed Google Chrome. If none is found, set
`CHROME_PATH`.

Run them from the repository root.

## Regression checks — `regression.mjs`

```bash
node tools/testing/regression.mjs
```

Fifteen pass/fail checks for bugs that have been fixed, including the tutorial covering modals,
the duplicate game loop after quit and continue, the Day 30 handoff, the background-tab
fast-forward, and "Enter the Park" after quitting resuming the old run. Exits with status 1 if
anything fails. Run it after any change to the event system, tallies, save/load, the title screen
or the game loop. It takes about 30 seconds.

## Balance simulator — `balance-sim.mjs`

```bash
node tools/testing/balance-sim.mjs 100     # runs per player profile
```

Plays complete 30-day Phase 1 runs against the real game code with three simulated players:

| Profile | Behaviour |
|---|---|
| engaged | 4 building interactions a day aimed at the weakest stats, event choices informed by their hidden effects, rests when stressed |
| typical | 3 interactions a day, half-informed choices, rests only when very stressed |
| casual | 2 interactions a day, random choices and daily orders |

It reports win rate, causes and days of death, and sample end states
(day / budget / attendance / gang threat / morale / stress). Use it to see the effect of a tuning
change before playtesting.

The bots are not people. Engaged and typical can see effects a real player can't, and casual
plays at random, so treat the numbers as directional and confirm by playing.

Baseline after the October 2026 tuning (100 runs each): engaged 100%, typical 100%, casual
about 35–40%, dying of staff collapse around Day 17–20. Attentive players now end with
morale in the 80s and attendance between 55 and 75, instead of both pinned near 100.

## Monkey test — `monkey.mjs`

```bash
node tools/testing/monkey.mjs 1500 1 ./monkey-out    # steps, seed, screenshot folder
```

Plays in real time at 4× speed with random legal actions: walking, building actions, interiors,
events, daily orders, speed changes, quitting to the title and reloading. After every step it
checks invariants:

- stats are finite and within range;
- no modal is open without a usable button;
- interior state matches what is on screen;
- the tutorial and the interact prompt never sit on top of a modal;
- the day never goes backwards.

Each new finding is printed with the actions that led to it, and screenshotted. Exits with
status 1 if anything was found. Random play rarely survives past the first week, so pair it with
the balance simulator for late-game coverage.
