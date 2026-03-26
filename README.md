# CivilWarLand in Bad Decline

A park management simulation game based on the short story by George Saunders.

You are the Special Assistant at CivilWarLand, a historical theme park in terminal decline. Gangs roam the grounds. Attendance is cratering. Your boss has ideas. None of them are good.

Each day, choose how to spend your energy. When the story intervenes, choose how to respond. Try to keep the place standing for thirty days.

## How to Play

Open `index.html` in a browser. No install, no build step, no server.

Or play the live version: [link TBD]

## Game Mechanics

**Daily actions** — each day you choose one of four actions (Patch and Repair, Increase Patrols, Manage the Staff, Cut Corners). Each has tradeoffs across budget, attendance, gang threat, and morale. Actions go on cooldown for 2 days after use.

**Story events** — on specific days, narrative events from the story interrupt with branching choices. Your decisions set flags that change which future events appear and which ending you reach. There are 13 story events with conditional branching.

**Minor events** — on days without a story event, smaller incidents drawn from details in the story may fire. The planter-crapper, the pregnant cancan girls, Quinn's insurance anxieties, Mr. McKinnon kicking cars in the parking lot.

**Compounding decay** — the park deteriorates on its own every day. Gang threat rises, morale drops, attendance slips. Your actions fight the decline, they don't eliminate it.

**Fail states** — if budget, attendance, or morale hit zero, or gang threat hits 100, the game ends immediately.

## Endings

Six narrative endings at day 30 based on the choices you've made, plus four fail-state endings that can trigger on any day. Ten possible outcomes total.

## Source Material

"CivilWarLand in Bad Decline" by George Saunders, originally published in *The Kenyon Review*, New Series, Vol. 14, No. 4 (Autumn, 1992), pp. 142–155. Later collected in *CivilWarLand in Bad Decline: Stories and a Novella* (Random House, 1996).

## Built With

Vanilla HTML, CSS, and JavaScript. One file. No frameworks, no dependencies, no build tools.
