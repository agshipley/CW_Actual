// In-page Monte Carlo (injected by balance-sim.mjs): plays many Phase 1 runs (day 0 -> 30) with a player policy; reports survival.
window.__init = JSON.parse(JSON.stringify(state));
window.__simulate = function (policy, N) {
  var out = { policy: policy, runs: N, won: 0, deaths: {}, deathDays: [], endStats: [] };
  var STAT_W = function () {
    // weight each stat by how close it is to its failure line
    var w = {};
    w.morale = 1 + (state.morale < 40 ? 2 : 0) + (state.morale < 20 ? 3 : 0);
    w.attendance = 1 + (state.attendance < 40 ? 2 : 0) + (state.attendance < 20 ? 3 : 0);
    w.gangThreat = -(1 + (state.gangThreat > 60 ? 2 : 0) + (state.gangThreat > 80 ? 3 : 0));
    w.narratorStress = -(0.6 + (state.narratorStress > 60 ? 2 : 0) + (state.narratorStress > 80 ? 3 : 0));
    w.budget = (state.budget < 8000 ? 0.004 : 0.0015);
    return w;
  };
  function score(eff) { if (!eff) return 0; var w = STAT_W(), s = 0; for (var k in eff) if (w[k] !== undefined) s += eff[k] * w[k]; return s; }
  function clickFirst(sel) { var b = [].slice.call(document.querySelectorAll(sel)).filter(function (x) { return x.offsetParent; }); if (b.length) { b[0].click(); return true; } return false; }
  function resolveOverlays() {
    for (var guard = 0; guard < 8; guard++) {
      var ov = document.getElementById("event-overlay");
      if (!ov.classList.contains("active")) return "clear";
      var txt = document.getElementById("event-box").innerText;
      if (/Start a new run/i.test(txt) && state.gameOver) return "dead";
      if (/Continue to Phase Two/i.test(txt)) return "won";
      if (/Continue Playing/i.test(txt)) return "won";
      var choices = [].slice.call(document.querySelectorAll("#event-box .ev-choice-btn"));
      if (choices.length) {
        var ev = null; for (var i = 0; i < EVENTS.length; i++) { var e = EVENTS[i]; if (e.day !== state.day) continue; if (e.condition && !state.flags[e.condition]) continue; if (e.conditionNot && state.flags[e.conditionNot]) continue; ev = e; break; }
        var pick = Math.floor(Math.random() * choices.length);
        if ((policy === "engaged" || (policy === "typical" && Math.random() < 0.5)) && ev) { var best = -1e9; ev.choices.forEach(function (c, ci) { var sc = score(c.effect) + Math.random() * 0.5; if (sc > best) { best = sc; pick = ci; } }); }
        choices[Math.min(pick, choices.length - 1)].click();
        continue;
      }
      if (!clickFirst("#event-box button")) return "stuck";
    }
    return "loop";
  }
  for (var r = 0; r < N; r++) {
    try { localStorage.clear(); } catch (e) {}
    state = JSON.parse(JSON.stringify(window.__init)); _activeTally = 0;
    startGame(); state.gamePaused = true; state.flags.tutorial_done = true;
    document.getElementById("tutorial-overlay").classList.remove("active");
    var result = null;
    for (var d = 0; d < 40 && !result; d++) {
      state.gameTime = 480; state.narratorEnergy = 100;
      var k = policy === "engaged" ? 4 : policy === "typical" ? 3 : 2;
      var used = 0, ids = Object.keys(BUILDING_ACTIONS).filter(function (id) { return findBuildingById(id) && !state.destroyedBuildings[id]; });
      while (used < k) {
        var bestId = null, bestS = -1e9;
        ids.forEach(function (id) { if (state.usedBuildingActions[id]) return; var a = BUILDING_ACTIONS[id]; if (a.flagRequired && !state.flags[a.flagRequired]) return; var s = (policy === "engaged" || (policy === "typical" && Math.random() < 0.7) ? score(a.effect) : Math.random()); if (s > bestS) { bestS = s; bestId = id; } });
        if (!bestId) break;
        document.getElementById("interact-prompt").dataset.buildingId = bestId; interactCooldownUntil = 0; interactWithBuilding(); used++;
      }
      if ((policy === "engaged" && state.narratorStress > 55) || (policy === "typical" && state.narratorStress > 75)) { interactCooldownUntil = 0; document.getElementById("interact-prompt").dataset.buildingId = "saloon"; restNarrator(); }
      if (!state.todaysAction) {
        var act = policy !== "casual"
          ? (state.morale < 45 ? "staff" : state.gangThreat > 50 ? "patrol" : state.attendance < 50 ? "repair" : "staff")
          : DAILY_ACTIONS[Math.floor(Math.random() * DAILY_ACTIONS.length)].id;
        chooseDailyAction(act);
      }
      state.gameTime = 480; applyMidnight();
      var o = resolveOverlays();
      if (o === "won") result = "won";
      else if (o === "dead" || state.gameOver) { var f = checkFailState(); result = "dead:" + (f ? f.title : document.querySelector("#event-box .ev-title, #event-box .tally-title") && document.querySelector("#event-box .ev-title, #event-box .tally-title").innerText); }
      else if (o === "stuck" || o === "loop") result = "stuck:" + document.getElementById("event-box").innerText.slice(0, 60);
    }
    if (result === "won") out.won++;
    else { out.deaths[result || "timeout"] = (out.deaths[result || "timeout"] || 0) + 1; out.deathDays.push(state.day); }
    out.endStats.push([state.day, Math.round(state.budget), state.attendance, state.gangThreat, state.morale, state.narratorStress].join("/"));
    document.getElementById("event-overlay").classList.remove("active"); state.gameOver = false; state.eventActive = false;
  }
  out.winRate = Math.round(100 * out.won / N) + "%";
  out.deathDays.sort(function (a, b) { return a - b; });
  out.endStats = out.endStats.slice(0, 6);
  return JSON.stringify(out);
};
