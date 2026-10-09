// Balance simulator: plays N complete Phase 1 runs (day 0 -> 30) per player profile against the real game code.
//   node tools/testing/balance-sim.mjs [runsPerProfile=100]
// Profiles: engaged (4 building interactions/day, informed event choices),
//           typical (3/day, half-informed choices), casual (2/day, random choices).
import { readFileSync } from "node:fs";
import { openGame } from "./browser.mjs";

const N = +(process.argv[2] || 100);
const game = await openGame();
try {
  // Silence audio and inject the in-page harness.
  await game.evaluate(`window.sndChime=function(){};window.sndPlace=function(){};window.startDrone=function(){};` +
    readFileSync(new URL("./balance-harness.js", import.meta.url), "utf8"));
  for (const policy of ["engaged", "typical", "casual"]) {
    const raw = await game.evaluate(`__simulate(${JSON.stringify(policy)}, ${N})`);
    if (String(raw).startsWith("EXC")) { console.log(policy, raw); continue; }
    const d = JSON.parse(raw);
    const days = d.deathDays; const median = days.length ? days[Math.floor(days.length / 2)] : "-";
    console.log(`${policy.padEnd(8)} win ${d.winRate.padStart(4)}  deaths ${JSON.stringify(d.deaths)}  median death day ${median}`);
    console.log(`         sample end states (day/$/att/gang/morale/stress): ${d.endStats.slice(0, 4).join("  ")}`);
  }
  console.log(`uncaught exceptions: ${game.errors.length}${game.errors.length ? " — " + game.errors.slice(0, 3).join(" ; ") : ""}`);
} finally { game.close(); }
process.exit(0);
