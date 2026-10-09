// Shared headless-browser launcher for the test tools (Chrome DevTools Protocol, no dependencies).
// Browser lookup: $CHROME_PATH, then Playwright's cached headless shell, then installed Chrome.
import { spawn } from "node:child_process";
import { existsSync, readdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const GAME_URL = pathToFileURL(resolve(HERE, "..", "..", "index.html")).href;
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findBrowser() {
  if (process.env.CHROME_PATH) return { bin: process.env.CHROME_PATH, args: ["--headless=new"] };
  const cache = join(homedir(), "Library", "Caches", "ms-playwright");
  if (existsSync(cache)) {
    for (const d of readdirSync(cache).filter((n) => n.startsWith("chromium_headless_shell")).sort().reverse()) {
      for (const sub of readdirSync(join(cache, d))) {
        const bin = join(cache, d, sub, "chrome-headless-shell");
        if (existsSync(bin)) return { bin, args: [] };
      }
    }
  }
  for (const bin of ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"]) {
    if (existsSync(bin)) return { bin, args: ["--headless=new"] };
  }
  throw new Error("No headless browser found. Set CHROME_PATH to a Chrome/Chromium binary.");
}

// Launch a browser, open the game, return helpers. Exceptions thrown by the page are collected in `errors`.
export async function openGame({ width = 1600, height = 1000 } = {}) {
  const { bin, args } = findBrowser();
  const port = 9300 + Math.floor(Math.random() * 600);
  const profile = mkdtempSync(join(tmpdir(), "cwl-test-"));
  const proc = spawn(bin, [...args, `--remote-debugging-port=${port}`, `--window-size=${width},${height}`,
    `--user-data-dir=${profile}`, "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page")?.webSocketDebuggerUrl; } catch {}
    if (!wsUrl) await sleep(200);
  }
  if (!wsUrl) { proc.kill(); throw new Error("Browser did not open its debugging port (sandboxed shell?)"); }
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map(); const errors = []; const listeners = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); d.error ? p.rej(new Error(d.error.message)) : p.res(d.result); return; }
    if (d.method === "Runtime.exceptionThrown") errors.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).split("\n").slice(0, 3).join(" | "));
    for (const l of listeners) l(d);
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expr) => {
    const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    return r.exceptionDetails ? "EXC: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400) : r.result.value;
  };
  const click = async (x, y) => { for (const type of ["mousePressed", "mouseReleased"]) await send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 }); };
  const key = async (k) => { await send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code: k }); await send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code: k }); };
  const screenshot = async (file) => { const r = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(file, Buffer.from(r.data, "base64")); };
  const load = async () => { await send("Page.navigate", { url: GAME_URL }); await sleep(1500); };
  await send("Runtime.enable"); await send("Page.enable");
  await load();
  return { send, evaluate, click, key, screenshot, load, errors, onEvent: (fn) => listeners.push(fn), close: () => { ws.close(); proc.kill(); } };
}
