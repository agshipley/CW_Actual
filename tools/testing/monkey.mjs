// Monkey test: random legal UI actions in real time, with an invariant check after every step.
//   node tools/testing/monkey.mjs [steps=1500] [seed=1] [outDir=./monkey-out]
// Writes screenshots of the first occurrence of each finding to outDir.
import { mkdirSync } from "node:fs";
import { openGame, sleep } from "./browser.mjs";

const STEPS = +(process.argv[2] || 1500), SEED = +(process.argv[3] || 1), OUT = process.argv[4] || "./monkey-out";
mkdirSync(OUT, { recursive: true });
let seed = SEED; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };

const game = await openGame();
const findings = new Map(); const trail = []; let step = 0, shots = 0;
const note = async (kind, detail) => {
  const k = kind + " | " + String(detail).slice(0, 160);
  if (!findings.has(k)) {
    findings.set(k, { n: 0, firstStep: step, trail: trail.slice(-8) });
    if (shots < 12) { await game.screenshot(`${OUT}/finding-${++shots}.png`); findings.get(k).shot = shots; }
  }
  findings.get(k).n++;
};
game.onEvent((d) => { if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error") note("console.error", d.params.args.map((a) => a.value ?? a.description).join(" ")); });

// Visible, enabled, unobscured elements matching a selector -> their centre points.
const targets = async (sel) => JSON.parse(await game.evaluate(`JSON.stringify([...document.querySelectorAll(${JSON.stringify(sel)})].filter(e=>{
  if(e.disabled)return false;const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;
  const s=getComputedStyle(e);if(s.visibility==='hidden'||s.display==='none'||s.pointerEvents==='none')return false;
  const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return t&&(t===e||e.contains(t));
}).map(e=>{const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,t:(e.innerText||e.id||e.className).replace(/\\s+/g,' ').slice(0,30)}}))`));
const canvasRect = async () => JSON.parse(await game.evaluate(`JSON.stringify(document.getElementById('canvas').getBoundingClientRect())`));

// Invariants that must hold whenever the game screen is showing.
const INV = `(function(){var v=[];var g=document.getElementById('game-screen').classList.contains('active');
 var t=document.getElementById('title-screen');var title=t&&getComputedStyle(t).display!=='none';
 if(!g)return JSON.stringify({screen:title?'title':'none',v:v});
 var num={budget:state.budget,attendance:state.attendance,gangThreat:state.gangThreat,morale:state.morale,narratorStress:state.narratorStress,narratorEnergy:state.narratorEnergy,gameTime:state.gameTime,day:state.day};
 for(var k in num){if(typeof num[k]!=='number'||!isFinite(num[k]))v.push('non-finite '+k+'='+num[k]);}
 ['attendance','gangThreat','morale','narratorStress','narratorEnergy'].forEach(function(k){if(num[k]<0||num[k]>100)v.push(k+' out of range '+num[k]);});
 if(num.gameTime<0||num.gameTime>=1440)v.push('gameTime out of range '+num.gameTime);
 var ov=document.getElementById('event-overlay').classList.contains('active');
 if(state.eventActive&&!ov)v.push('eventActive but no overlay');
 if(ov&&![...document.querySelectorAll('#event-box button')].some(b=>b.offsetParent&&!b.disabled))v.push('event overlay with no usable button: '+document.getElementById('event-box').innerText.slice(0,50));
 var io=document.getElementById('interior-overlay').classList.contains('active');
 if(!!state.activeInterior!==io)v.push('interior state/overlay mismatch: '+state.activeInterior+' overlay='+io);
 var tu=document.getElementById('tutorial-overlay');if(tu.classList.contains('active')&&tu.style.visibility!=='hidden'&&(ov||io))v.push('tutorial visible over modal/interior');
 var bm=document.getElementById('build-menu-overlay');if(bm&&getComputedStyle(bm).display==='block'&&!state.expanded)v.push('build menu open in phase 1');
 if(state.characters.some(c=>!isFinite(c.x)||!isFinite(c.y)))v.push('character with non-finite position');
 var ip=document.getElementById('interact-prompt');if(ip&&getComputedStyle(ip).display!=='none'&&(ov||io))v.push('interact prompt visible over modal/interior');
 return JSON.stringify({screen:'game',v:v,day:state.day,over:state.gameOver,paused:state.gamePaused,ev:state.eventActive,int:state.activeInterior});})()`;

let lastDay = 0, maxDay = 0, reloads = 0;
try {
  await game.evaluate(`localStorage.clear()`);
  for (step = 0; step < STEPS; step++) {
    const raw = await game.evaluate(INV);
    if (String(raw).startsWith("EXC")) { await note("INV-ERROR", raw); await sleep(150); continue; }
    const st = JSON.parse(raw);
    for (const v of st.v) await note("INVARIANT", v);
    if (st.screen !== "game") {
      lastDay = 0;
      const t = (await targets("#title-screen button")).filter((b) => !/community/i.test(b.t));
      if (t.length) { const p = t[Math.floor(rnd() * t.length)]; trail.push("title:" + p.t); await game.click(p.x, p.y); }
      await sleep(600); continue;
    }
    if (st.day < lastDay && !st.over) await note("INVARIANT", `day went backwards ${lastDay}->${st.day}`);
    lastDay = st.day; if (st.day > maxDay) maxDay = st.day;
    if (st.paused && !st.ev && !st.int && !st.over) { const b = await targets("#spd-4"); if (b.length) await game.click(b[0].x, b[0].y); }
    const r = rnd(); let did = "";
    const evBtns = await targets("#event-box button"), tutBtns = await targets("#tutorial-tip button");
    if (evBtns.length) { const p = evBtns[Math.floor(rnd() * evBtns.length)]; did = "event:" + p.t; await game.click(p.x, p.y); }
    else if (tutBtns.length && r < 0.3) { const p = tutBtns[Math.floor(rnd() * tutBtns.length)]; did = "tut:" + p.t; await game.click(p.x, p.y); }
    else if (st.int) {
      if (r < 0.12) { const b = await targets(".int-leave-btn"); if (b.length) { did = "leave"; await game.click(b[0].x, b[0].y); } }
      else { const c = await canvasRect(); did = "interior-click"; await game.click(c.left + rnd() * c.width, c.top + rnd() * c.height); }
    }
    else if (r < 0.40) { const c = await canvasRect(); did = "map-click"; await game.click(c.left + rnd() * c.width, c.top + rnd() * c.height); }
    else if (r < 0.70) { const b = await targets("#interact-prompt button"); if (b.length) { const p = b[Math.floor(rnd() * b.length)]; did = "prompt:" + p.t; await game.click(p.x, p.y); } }
    else if (r < 0.80) { const b = await targets("#daily-action-buttons button"); if (b.length) { const p = b[Math.floor(rnd() * b.length)]; did = "daily:" + p.t; await game.click(p.x, p.y); } }
    else if (r < 0.92) { const b = await targets("#spd-1, #spd-2, #spd-4, #spd-pause"); if (b.length) { const p = b[Math.floor(rnd() * b.length)]; did = "speed:" + p.t; await game.click(p.x, p.y); } }
    else if (r < 0.93) { did = "escape"; await game.key("Escape"); }
    else if (r < 0.935) { did = "reload"; reloads++; await game.load(); }
    else { const b = await targets("#mute-btn, #s-budget"); if (b.length) { did = "misc:" + b[0].t; await game.click(b[0].x, b[0].y); } }
    trail.push(`${step}:d${st.day}:${did}`);
    for (const e of game.errors.splice(0)) await note("EXCEPTION", e);
    await sleep(120);
  }
} catch (e) { console.log("DRIVER ERROR " + e.stack); }
game.close();
console.log(`seed ${SEED}: ${STEPS} steps, max day ${maxDay}, reloads ${reloads}, ${findings.size} distinct findings`);
for (const [k, v] of findings) console.log(`${v.n}x  ${k}  (first @step ${v.firstStep}${v.shot ? ", shot " + v.shot : ""})\n      trail: ${v.trail.join(" > ").slice(0, 400)}`);
process.exit(findings.size ? 1 : 0);
