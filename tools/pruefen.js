// node pruefen.js — die Pflichtpruefung vor jedem Fertigmelden (siehe CLAUDE.md):
// kein seitliches Scrollen, kein Text ueber Text, keine Fremdanfragen, keine Skriptfehler.
const { start, seite, URL, BREITEN } = require('./lib');
(async () => {
  const b = await start(); let fehler = 0;
  for (const [w, h] of BREITEN) {
    const p = await seite(b, w, h);
    const fremd = [], js = [];
    p.on('request', r => { const u = r.url(); if (!u.startsWith(new (require('url').URL)(URL).origin) && !u.startsWith('data:')) fremd.push(u); });
    p.on('pageerror', e => js.push(String(e)));
    await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    let maxX = 0; const treffer = new Set();
    for (let y = 0; y <= H; y += Math.round(h * 0.45)) {
      await p.evaluate(v => window.scrollTo(v + 400, v), y); await p.waitForTimeout(170);
      const r = await p.evaluate(() => {
        const sx = window.scrollX; window.scrollTo(0, window.scrollY);
        const vis = e => { const c = getComputedStyle(e); return c.visibility !== 'hidden' && +c.opacity > .05 && c.display !== 'none'; };
        const kette = e => { for (let n = e; n && n !== document.body; n = n.parentElement) if (!vis(n)) return false; return true; };
        const box = e => { const g = document.createRange(); g.selectNodeContents(e); return [...g.getClientRects()].filter(q => q.width > 2 && q.height > 2); };
        const hs = [...document.querySelectorAll('h1,h2')].filter(kette);
        const ts = [...document.querySelectorAll('p,li,h3,summary,a.btn,dt,dd,blockquote,.kicker,.eyebrow')].filter(kette);
        const out = [];
        // Woerter, die gerade einlaufen, sind von .word-wrap beschnitten: gemessen wird
        // deshalb die sichtbare Huelle, nicht das verschobene Wort darin.
        const kopf = e => { const ww = [...e.querySelectorAll('.word-wrap')]; return ww.length ? ww.map(x => x.getBoundingClientRect()).filter(q => q.width > 2 && q.height > 2) : box(e); };
        for (const hd of hs) for (const a of kopf(hd)) {
          if (a.bottom < 0 || a.top > innerHeight) continue;
          for (const t of ts) { if (hd.contains(t) || t.contains(hd)) continue;
            if (t.closest('.quote-rail,.marquee,.cta-bg,.sticky-cta,.nav')) continue;
            for (const q of box(t)) { const ox = Math.min(a.right, q.right) - Math.max(a.left, q.left), oy = Math.min(a.bottom, q.bottom) - Math.max(a.top, q.top);
              if (ox > 4 && oy > 4) out.push(hd.textContent.trim().slice(0, 28) + ' × ' + t.textContent.trim().slice(0, 28)); } } }
        return { sx, out };
      });
      maxX = Math.max(maxX, r.sx); r.out.forEach(o => treffer.add(o));
    }
    const ok = maxX === 0 && !treffer.size && !fremd.length && !js.length; if (!ok) fehler++;
    console.log(`${w}px  scrollX ${maxX}  Ueberlappung ${treffer.size}  fremd ${fremd.length}  JS-Fehler ${js.length}  ${ok ? 'ok' : 'FEHLER'}`);
    [...treffer].slice(0, 5).forEach(t => console.log('   ', t)); fremd.slice(0, 3).forEach(t => console.log('   ', t)); js.slice(0, 3).forEach(t => console.log('   ', t));
    await p.close();
  }
  await b.close(); process.exit(fehler ? 1 : 0);
})();
