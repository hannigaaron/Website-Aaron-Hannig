// Gemeinsamer Start fuer alle Pruefskripte. Chromium ist im Container vorinstalliert.
const { chromium } = require('playwright-core');
const fs = require('fs');
const kandidaten = [process.env.CHROME, '/opt/pw-browsers/chromium', '/opt/pw-browsers/chromium-1243/chrome-linux/chrome', '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'];
const pfad = kandidaten.find(p => p && fs.existsSync(p) && fs.statSync(p).isFile());
exports.BREITEN = [[390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]];
exports.URL = process.env.URL || 'http://localhost:8000/index.html';
exports.start = () => chromium.launch({ executablePath: pfad });
exports.seite = async (b, w, h, dsf = 1) => {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, isMobile: w <= 430, hasTouch: w <= 1024 });
  await p.addInitScript(() => { try { sessionStorage.setItem('pca-intro', '1'); } catch (e) {} });
  return p;
};
