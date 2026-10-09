// Regression checks for known Phase 1 bugs. Exits 1 if any check fails.
//   node tools/testing/regression.mjs
import { openGame, sleep } from "./browser.mjs";

const game = await openGame();
const { evaluate: ev, click } = game;
const results = [];
const check = (name, ok, detail) => results.push({ name, ok, detail });
const tutVis = () => ev(`(function(){var o=document.getElementById('tutorial-overlay');return o.classList.contains('active')?(o.style.visibility==='hidden'?'hidden':'visible'):'off'})()`);
const eventText = () => ev(`document.getElementById('event-box').innerText`);

try {
  check("Phase 2 shortcut hidden on the title screen", (await ev(`getComputedStyle(document.getElementById('skip-phase2-btn')).display`)) === "none");

  // --- tutorial
  await ev(`localStorage.clear();newGame()`); await sleep(1000);
  check("tutorial shows on new game", (await tutVis()) === "visible");
  const c = JSON.parse(await ev(`(function(){var r=document.getElementById('canvas').getBoundingClientRect();return JSON.stringify({x:r.left+r.width*0.3,y:r.top+r.height*0.75})})()`));
  await click(c.x, c.y); await sleep(400);
  check("first map click advances the tutorial", (await ev(`tutStep`)) === 1);
  await ev(`state.day=0;applyMidnight()`); await sleep(400);
  check("tutorial hidden while an event is open", (await tutVis()) === "hidden");
  await ev(`[...document.querySelectorAll('#event-box .ev-choice-btn, #event-box button')][0].click()`); await sleep(300);
  await ev(`[...document.querySelectorAll('#event-overlay.active #event-box button')].forEach(b=>b.click())`); await sleep(300);
  check("tutorial returns after the event closes", (await tutVis()) === "visible");
  await ev(`document.getElementById('interact-prompt').dataset.buildingId='saloon';enterBuilding()`); await sleep(500);
  check("tutorial hidden inside an interior", (await tutVis()) === "hidden");
  await ev(`leaveBuilding();tutDismiss()`);

  // --- interiors: overlapping hotspots resolve to the specific object
  await ev(`document.getElementById('interact-prompt').dataset.buildingId='thespian';enterBuilding()`); await sleep(800);
  const g = JSON.parse(await ev(`(function(){var c=document.getElementById('canvas').getBoundingClientRect();var o=BUILDING_INTERIORS.thespian.objects.find(o=>o.id==='grizzly_suit');return JSON.stringify({x:c.left+(o.x+o.w/2)*c.width,y:c.top+(o.y+o.h/2)*c.height})})()`));
  await click(g.x, g.y); await sleep(7000);
  check("Thespian Center: Grizzly Suit click opens its description", /Grizzly/i.test(await ev(`document.getElementById('interior-info-content').innerText`)));
  await ev(`leaveBuilding()`);

  // --- one game loop across quit -> continue
  const renders = async () => { await ev(`window.__n=0;if(!window.__wrapped){window.__wrapped=true;var o=window.render;window.render=function(){window.__n++;return o.apply(this,arguments)}}`); await sleep(2000); return ev(`window.__n`); };
  const before = await renders();
  await ev(`saveAndQuit()`); await sleep(400); await ev(`document.getElementById('continue-btn').click()`); await sleep(800);
  const after = await renders();
  check("one game loop after quit -> continue", after < before * 1.3, `render calls per 2s: before ${before}, after ${after}`);

  // --- background tab: a long gap between frames must not fast-forward days
  await ev(`(function(){document.getElementById('event-overlay').classList.remove('active');state.eventActive=false;state.gameOver=false;state.day=2;state.gameTime=480;setSpeed(4);state.gamePaused=false;lastFrameTime=performance.now()-600000;})()`);
  await sleep(300);
  check("10-minute background gap does not skip days", (await ev(`state.day`)) === 2, `day ${await ev(`state.day`)}, gameTime ${await ev(`Math.round(state.gameTime)`)}`);
  await ev(`setSpeed(0)`);

  // --- Day 30 handoff
  await ev(`state.lastTallyDay=3;dbgSkipToDay30()`); await sleep(500);
  const title = await ev(`(document.querySelector('#event-box .tally-title')||{}).innerText`);
  check("Day 30 shows the THIRTY DAYS tally even if earlier tallies were missed", title === "THIRTY DAYS", "got " + title);
  await ev(`dismissTally()`); await sleep(300);
  check("THIRTY DAYS leads to the ending screen", /Continue Playing/i.test(await eventText()));

  // --- stranded run fallback
  await game.load();
  await ev(`localStorage.clear();newGame();tutDismiss();state.day=31;state.lastTallyDay=30;applyMidnight()`); await sleep(400);
  check("a run past Day 30 without expansion gets the ending", /Continue Playing/i.test(await eventText()));

  // --- diminishing returns shown in the UI
  await ev(`document.getElementById('event-overlay').classList.remove('active');state.eventActive=false;state.gameOver=false;state.morale=92;updateSidebar()`);
  check("daily orders show no morale gain at 92 morale", !/\+8 morale/.test(await ev(`document.getElementById('daily-action-buttons').innerText`)));

  // --- new game after quitting is a fresh run
  await ev(`state.day=12;state.budget=1234;state.morale=7;state.flags.quinn_armed=true;saveGame();saveAndQuit()`); await sleep(300);
  await ev(`[...document.querySelectorAll('#title-screen button')].find(b=>/enter the park/i.test(b.innerText)).click()`); await sleep(2000);
  const fresh = JSON.parse(await ev(`JSON.stringify({day:state.day,budget:state.budget,quinn:!!state.flags.quinn_armed,inGame:document.getElementById('game-screen').classList.contains('active')})`));
  check("Enter the Park after quitting starts a fresh run", fresh.inGame && fresh.day === 0 && fresh.budget === 50000 && !fresh.quinn, JSON.stringify(fresh));

  check("no uncaught exceptions", game.errors.length === 0, game.errors.slice(0, 2).join(" ; "));
} catch (e) { check("driver", false, e.stack); }
game.close();
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail && !r.ok ? "  — " + r.detail : ""}`);
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
