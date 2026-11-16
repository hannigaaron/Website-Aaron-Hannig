// node shot.js <name> [breite] [y]  — Bildschirmfoto an Scrollposition y
const { start, seite, URL } = require('./lib');
(async () => {
  const [name = 'shot', w = '1440', y = '0', sel = ''] = process.argv.slice(2);
  const W = +w, H = W <= 430 ? 844 : 900;
  const b = await start(); const p = await seite(b, W, H, W <= 430 ? 2 : 1);
  await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  if (sel) await p.evaluate(s => document.querySelector(s).scrollIntoView({ block: 'start' }), sel);
  else await p.evaluate(v => window.scrollTo(0, v), +y);
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${name}.png` }); await b.close();
})();
