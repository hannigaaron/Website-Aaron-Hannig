(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Sterne für die Google-Bewertung ---------- */
  const STAR = 'M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z';
  $$('.stars, .q-stars').forEach(el => {
    el.innerHTML = Array.from({ length: 5 }, () =>
      `<svg viewBox="0 0 24 24"><path d="${STAR}"/></svg>`).join('');
  });

  /* ---------- Laufband ---------- */
  const WORDS = ['Routinen', 'Gewohnheiten', 'Analyse', 'Lösungen', 'Mindeststandards', 'Langfristigkeit'];
  const track = $('#marquee-track');
  if (track) {
    const row = WORDS.map(w => `<span>${w}</span><i></i>`).join('');
    track.innerHTML = row + row;
  }

  /* ---------- Phasen ---------- */
  const PHASES = [
    { name: 'Klarheit', text: 'Analyse statt Annahmen: Wo stehst du, wie sieht deine Woche wirklich aus, und woran ist es bisher gescheitert? Daraus entsteht eine Richtung, die zu deinem Alltag passt — nicht zu einem Idealbild.' },
    { name: 'Basis', text: 'Wenige Gewohnheiten, dafür verlässlich. Wir setzen die ersten Routinen auf, legen deine Mindeststandards fest und bringen dein Ernährungssystem in eine Form, die auch an vollen Tagen trägt.' },
    { name: 'Aufbau', text: 'Jetzt wird gesteigert. Im wöchentlichen Call analysieren wir, was der Alltag dazwischenfunkt, und lösen es konkret. Journaling und Check-ins zeigen dir schwarz auf weiß, dass sich etwas bewegt.' },
    { name: 'Selbstläufer', text: 'Die Routinen tragen sich selbst. Wir prüfen, was auch ohne Betreuung standhält, und arbeiten gezielt darauf hin, dass du irgendwann keinen Coach mehr brauchst.' }
  ];

  const rail  = $('.timeline-rail');
  const pBody = $('.panel-body');
  const pNum  = $('#phase-n');
  const pName = $('#phase-title');
  const pText = $('#phase-text');

  if (rail) {
    rail.innerHTML = PHASES.map((p, i) => `
      <button class="phase${i === 0 ? ' is-active' : ''}" role="tab"
              aria-selected="${i === 0}" data-i="${i}">
        <span class="phase-n">Phase ${i + 1}</span>
        <span class="phase-name">${p.name}</span>
      </button>`).join('');

    let current = 0;
    const render = (i) => {
      pNum.textContent  = `Phase ${i + 1}`;
      pName.textContent = PHASES[i].name;
      pText.textContent = PHASES[i].text;
    };
    const select = (i) => {
      if (i === current) return;
      current = i;
      $$('.phase', rail).forEach((b, n) => {
        b.classList.toggle('is-active', n === i);
        b.setAttribute('aria-selected', String(n === i));
      });
      pBody.classList.add('is-swapping');
      setTimeout(() => { render(i); pBody.classList.remove('is-swapping'); }, reduced ? 0 : 220);
    };
    render(0);

    rail.addEventListener('click', (e) => {
      const btn = e.target.closest('.phase');
      if (btn) select(Number(btn.dataset.i));
    });
    // Pfeiltasten wie bei echten Tabs
    rail.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 };
      const step = keys[e.key];
      if (!step) return;
      e.preventDefault();
      const next = (current + step + PHASES.length) % PHASES.length;
      select(next);
      $$('.phase', rail)[next].focus();
    });
  }

  /* ---------- Interaktiv: die Kette ----------
     Zwölf Monate. Der Regler bestimmt, in wie vielen davon etwas
     dazwischenkommt. Ohne Mindeststandard fällt so ein Monat ganz aus
     und reißt die Kette; mit Mindeststandard wird er nur kleiner. */
  const range = $('#lab-range');
  if (range) {
    const MONTHS = 12;
    const out = $('#lab-range-out');
    const chainA = $('#chain-a'), chainB = $('#chain-b');
    const resA = $('#res-a'), resB = $('#res-b');

    // die betroffenen Monate gleichmässig übers Jahr verteilen,
    // damit die Kette natürlich aussieht statt vorne zu klumpen
    const pick = (n) => {
      const set = new Set();
      for (let i = 0; i < n; i++) set.add(Math.round((i + 0.5) * MONTHS / n));
      return set;
    };

    const build = (box, cls, hit) => {
      box.innerHTML = Array.from({ length: MONTHS }, (_, i) =>
        `<span class="lab-link${hit.has(i + 1) ? ' ' + cls : ''}"></span>`).join('');
    };

    const render = () => {
      const n = Number(range.value);
      const hit = pick(n);
      out.textContent = n;
      range.style.setProperty('--fill', (n / MONTHS * 100) + '%');

      build(chainA, 'is-gap', hit);
      build(chainB, 'is-min', hit);

      const aktiv = MONTHS - n;
      resA.innerHTML = n === 0
        ? '<b>12</b> von 12 Monaten dabei — solange nichts dazwischenkommt.'
        : `<b>${aktiv}</b> von 12 Monaten dabei · <b>${n}</b> ${n === 1 ? 'Neuanfang' : 'Neuanfänge'}`;
      resB.innerHTML = '<b class="good">12</b> von 12 Monaten dabei · <b class="good">0</b> Neuanfänge';
    };

    range.addEventListener('input', render);
    render();
  }

  /* ---------- Scroll-Fortschritt + Nav ---------- */
  const progress = $('#progress');
  const nav = $('#nav');
  const sticky = $('#sticky-cta');
  const heroEl = $('.hero');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
      nav.classList.toggle('is-stuck', scrollY > 8);
      if (sticky && heroEl) sticky.classList.toggle('is-shown', scrollY > heroEl.offsetHeight * 0.8);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal ---------- */
  const revealables = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const sibs = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
        entry.target.style.transitionDelay = Math.min(sibs.indexOf(entry.target), 6) * 75 + 'ms';
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    revealables.forEach(el => io.observe(el));
  }

  /* ---------- Aktiver Abschnitt in der Navigation ---------- */
  const links = $$('.nav-links a');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { threshold: 0.3 });
    sections.forEach(s => spy.observe(s));
  }

  if (reduced) return;

  /* ---------- Magnetische Buttons ---------- */
  if (matchMedia('(pointer: fine)').matches) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.26}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Hero: Liniengeflecht in der Neigung der Bildmarke ---------- */
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const blue = css.getPropertyValue('--blue').trim() || '#84d6ef';
  const SLOPE = 455 / 810;               // exakt die Neigung der langen Logo-Kante
  let w = 0, h = 0, lines = [], mx = -1e4, my = -1e4, raf = 0;

  const build = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gap = w < 700 ? 78 : 62;
    const span = h + w * SLOPE;
    lines = [];
    for (let c = -span; c < span; c += gap) {
      lines.push({ c, phase: Math.random() * Math.PI * 2 });
    }
  };

  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    ctx.strokeStyle = blue;
    for (const ln of lines) {
      const bob = Math.sin(t / 3400 + ln.phase) * 7;
      // Abstand der Linie vom Mauszeiger -> sie weicht leicht aus
      const yAtMouse = SLOPE * mx + ln.c + bob;
      const dist = Math.abs(yAtMouse - my);
      const push = dist < 150 ? (1 - dist / 150) : 0;
      const off = ln.c + bob + push * (yAtMouse > my ? 22 : -22);
      ctx.globalAlpha = 0.2 + push * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, off);
      ctx.lineTo(w, SLOPE * w + off);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  };

  build();
  raf = requestAnimationFrame(draw);
  addEventListener('resize', build);
  addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });
  // Rechenzeit sparen, sobald der Hero aus dem Bild ist
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
      else { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0 }).observe(canvas);
  }
})();
