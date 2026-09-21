(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const hasGSAP = !reduced && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('js-gsap');
  }

  /* ======================================================================
     Inhalte, die aus Daten entstehen
     ====================================================================== */

  const STAR = 'M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z';
  $$('.stars, .q-stars').forEach(el => {
    el.innerHTML = Array.from({ length: 5 }, () =>
      `<svg viewBox="0 0 24 24"><path d="${STAR}"/></svg>`).join('');
  });

  const WORDS = ['Routinen', 'Gewohnheiten', 'Analyse', 'Lösungen', 'Mindeststandards', 'Langfristigkeit'];
  const track = $('#marquee-track');
  if (track) {
    const row = WORDS.map(w => `<span>${w}</span><i></i>`).join('');
    track.innerHTML = row + row;
  }

  const PHASES = [
    { name: 'Klarheit', text: 'Analyse statt Annahmen: Wo stehst du, wie sieht deine Woche wirklich aus, und woran ist es bisher gescheitert? Daraus entsteht eine Richtung, die zu deinem Alltag passt — nicht zu einem Idealbild.' },
    { name: 'Basis', text: 'Wenige Gewohnheiten, dafür verlässlich. Wir setzen die ersten Routinen auf, legen deine Mindeststandards fest und bringen dein Ernährungssystem in eine Form, die auch an vollen Tagen trägt.' },
    { name: 'Aufbau', text: 'Jetzt wird gesteigert. Im wöchentlichen Call analysieren wir, was der Alltag dazwischenfunkt, und lösen es konkret. Journaling und Check-ins zeigen dir schwarz auf weiß, dass sich etwas bewegt.' },
    { name: 'Selbstläufer', text: 'Die Routinen tragen sich selbst. Wir prüfen, was auch ohne Betreuung standhält, und arbeiten gezielt darauf hin, dass du irgendwann keinen Coach mehr brauchst.' }
  ];

  const rail  = $('.timeline-rail');
  const pBody = $('.panel-body');
  const pNum  = $('#phase-n'), pName = $('#phase-title'), pText = $('#phase-text');

  if (rail) {
    rail.innerHTML = PHASES.map((p, i) => `
      <button class="phase${i === 0 ? ' is-active' : ''}" role="tab"
              aria-selected="${i === 0}" data-i="${i}">
        <span class="phase-n">Phase ${i + 1}</span>
        <span class="phase-name">${p.name}</span>
      </button>`).join('');

    let current = 0;
    const render = (i) => {
      pNum.textContent = `Phase ${i + 1}`;
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
      if (hasGSAP) {
        gsap.fromTo(pBody, { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: .45, ease: 'power3.out', onStart: () => render(i) });
      } else {
        pBody.classList.add('is-swapping');
        setTimeout(() => { render(i); pBody.classList.remove('is-swapping'); }, reduced ? 0 : 220);
      }
    };
    render(0);

    rail.addEventListener('click', (e) => {
      const btn = e.target.closest('.phase');
      if (btn) select(Number(btn.dataset.i));
    });
    rail.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const next = (current + step + PHASES.length) % PHASES.length;
      select(next);
      $$('.phase', rail)[next].focus();
    });
  }

  /* ---------- Interaktiv: die Kette ---------- */
  const range = $('#lab-range');
  if (range) {
    const MONTHS = 12;
    const out = $('#lab-range-out');
    const chainA = $('#chain-a'), chainB = $('#chain-b');
    const resA = $('#res-a'), resB = $('#res-b');

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
      const n = Number(range.value), hit = pick(n);
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

  /* ======================================================================
     Lenis — weiches Scrollen mit Nachlauf
     ====================================================================== */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6
    });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }

  // Sprungmarken: Lenis übernimmt, mit Versatz für die klebende Navigation
  const navOffset = () => (innerWidth <= 820 ? -128 : -86);
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: navOffset(), duration: 1.1 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ======================================================================
     Scroll-Fortschritt, klebende Navigation, mitlaufender Button
     ====================================================================== */
  const progress = $('#progress'), nav = $('#nav'), sticky = $('#sticky-cta'), heroEl = $('.hero');
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

  /* ======================================================================
     Einblendungen — GSAP wenn da, sonst IntersectionObserver
     ====================================================================== */
  const revealables = $$('.reveal').filter(el => !el.closest('.hero'));

  if (hasGSAP) {
    gsap.set(revealables, { opacity: 0, y: 30 });
    const show = (els, stagger = { each: .09, amount: .7 }) => gsap.to(els, {
      opacity: 1, y: 0, duration: .8, stagger, ease: 'power3.out', overwrite: true,
      onStart: () => els.forEach(el => el.classList.add('is-visible'))
    });
    ScrollTrigger.batch(revealables, { start: 'top 88%', onEnter: (b) => show(b) });

    // Sicherheitsnetz: bei Sprungmarken oder sehr schnellem Scrollen kann die
    // Staffel-Animation einen Abschnitt ueberspringen. Was im Bild steht und
    // noch unsichtbar ist, wird hier nachgezogen.
    const catchUp = () => {
      const late = revealables.filter(el => {
        if (el.classList.contains('is-visible')) return false;
        const r = el.getBoundingClientRect();
        return r.top < innerHeight * .95 && r.bottom > 0;
      });
      if (late.length) show(late, { each: .04, amount: .35 });
    };
    let catchTimer;
    addEventListener('scroll', () => {
      clearTimeout(catchTimer);
      catchTimer = setTimeout(catchUp, 180);
    }, { passive: true });
    ScrollTrigger.addEventListener('refresh', catchUp);
    setTimeout(catchUp, 600);
  } else if (reduced || !('IntersectionObserver' in window)) {
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
    }, { threshold: .12, rootMargin: '0px 0px -60px' });
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
    }, { threshold: .3 });
    sections.forEach(s => spy.observe(s));
  }

  /* ======================================================================
     GSAP: die scroll-gesteuerten Effekte
     ====================================================================== */
  if (hasGSAP) {

    /* ---------- Auftakt: die Headline kommt gross und zieht sich zusammen ---------- */
    const titleLines = $$('.hero-title .line > span');
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

    gsap.set('.hero-title', { transformOrigin: '18% 50%' });
    gsap.set(titleLines, { y: 0, yPercent: 108, opacity: 0 });
    gsap.set(['.eyebrow', '.hero .lead', '.hero-cta', '.hero .rating', '.stats'], { opacity: 0, y: 22 });
    gsap.set('.hero-media img', { scale: 1.22, opacity: 0, transformOrigin: '60% 30%' });

    intro
      .to(titleLines, { yPercent: 0, opacity: 1, duration: 1, stagger: .09 })
      .from('.hero-title', { scale: 1.42, duration: 1.5, ease: 'power4.out' }, 0)
      .to('.hero-media img', { scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out' }, .25)
      .to('.eyebrow', { opacity: 1, y: 0, duration: .7 }, .55)
      .to('.hero .lead', { opacity: 1, y: 0, duration: .7 }, .7)
      .to('.hero-cta', { opacity: 1, y: 0, duration: .7 }, .82)
      .to('.hero .rating', { opacity: 1, y: 0, duration: .7,
          onStart: () => $('.hero .rating')?.classList.add('is-visible') }, .94)
      .to('.stats', { opacity: 1, y: 0, duration: .7,
          onStart: () => $('.stats')?.classList.add('is-visible') }, 1.02);

    // Hero: Text und Bild wandern beim Scrollen unterschiedlich schnell
    gsap.to('.hero-inner', {
      yPercent: -14, opacity: .35, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });
    gsap.to('.hero-media', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });

    // Hero-Foto: schiebt sich beim Wegscrollen leicht hoch und zu
    gsap.to('.hero-media img', {
      yPercent: -6, scale: 1.05, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
    });

    // Coach-Foto und die Fläche dahinter laufen gegeneinander
    gsap.fromTo('.coach-media img', { yPercent: 6 }, {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: '.coach-media', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.fromTo('.coach-shape', { yPercent: -8, xPercent: -3 }, {
      yPercent: 8, xPercent: 3, ease: 'none',
      scrollTrigger: { trigger: '.coach-media', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // Foto im Abschluss-CTA: langsamer Zug nach oben
    gsap.fromTo('.cta-bg img', { yPercent: 8, scale: 1.06 }, {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // Laufband: läuft endlos, reagiert aber auf Scrollrichtung und -tempo
    if (track) {
      const marquee = gsap.to(track, { xPercent: -50, repeat: -1, duration: 30, ease: 'none' });
      let resetter;
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = self.getVelocity();
          marquee.timeScale(gsap.utils.clamp(-4, 4, v / 320 || 1));
          gsap.to('.marquee', { skewX: gsap.utils.clamp(-4, 4, v / 900), duration: .4, overwrite: true });
          clearTimeout(resetter);
          resetter = setTimeout(() => {
            marquee.timeScale(1);
            gsap.to('.marquee', { skewX: 0, duration: .6, ease: 'power2.out' });
          }, 140);
        }
      });
    }

    // Kacheln und Zitate: zusaetzliche Staffelung.
    // Wichtig: ohne opacity — die gehoert der Einblendung oben, sonst
    // starten sich beide gegenseitig neu und die Elemente flackern.
    [['.tile', .07], ['.quote', .09], ['.perk', .08], ['.goals li', .06]].forEach(([sel, st]) => {
      ScrollTrigger.batch(sel, {
        start: 'top 90%', once: true,
        onEnter: b => gsap.from(b, { y: 34, scale: .985, duration: .8, stagger: st, ease: 'power3.out' })
      });
    });

    // Kennzahlen im Hero: laufen von links herein
    ScrollTrigger.batch('.stat', {
      start: 'top 92%', once: true,
      onEnter: b => gsap.from(b, { x: -18, duration: .7, stagger: .08, ease: 'power3.out' })
    });

    // Die Kette baut sich Glied für Glied auf
    ScrollTrigger.create({
      trigger: '#konsistenz', start: 'top 72%', once: true,
      onEnter: () => gsap.from('.lab-link', { scaleY: .2, opacity: 0, duration: .5, stagger: .025, ease: 'back.out(2)' })
    });

    // Die diagonalen Schnittkanten neigen sich beim Durchscrollen leicht mit
    $$('.cut-top').forEach(sec => {
      gsap.fromTo(sec, { '--cut': '4.4vw' }, {
        '--cut': '1.6vw', ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 40%', scrub: .5 }
      });
    });

    addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ======================================================================
     Magnetische Buttons
     ====================================================================== */
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (hasGSAP) gsap.to(el, { x: dx * .18, y: dy * .26, duration: .4, ease: 'power3.out' });
        else el.style.transform = `translate(${dx * .18}px, ${dy * .26}px)`;
      });
      el.addEventListener('mouseleave', () => {
        if (hasGSAP) gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1, .4)' });
        else el.style.transform = '';
      });
    });
  }

  /* ======================================================================
     Fotos neigen sich leicht zur Maus — kostet nichts, wirkt raeumlich
     ====================================================================== */
  if (hasGSAP && matchMedia('(pointer: fine)').matches) {
    $$('.hero-media img, .coach-media img').forEach(el => {
      el.classList.add('tilt-3d');
      const zone = el.parentElement;
      zone.addEventListener('mousemove', (e) => {
        const r = zone.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        gsap.to(el, {
          rotationY: px * 7, rotationX: -py * 7, transformPerspective: 900,
          duration: .7, ease: 'power3.out', overwrite: 'auto'
        });
      });
      zone.addEventListener('mouseleave', () => {
        gsap.to(el, { rotationY: 0, rotationX: 0, duration: 1.1, ease: 'elastic.out(1,.5)' });
      });
    });
  }

  /* ======================================================================
     Vanta: 3D-Netz hinter dem Hero.
     three.js + Vanta sind zusammen rund 630 KB — deshalb werden sie erst
     zur Laufzeit geladen, und nur dort, wo sie auch etwas bringen.
     ====================================================================== */
  const vantaEl = $('#hero-canvas');
  const wantsVanta = vantaEl && !reduced
    && innerWidth > 820
    && matchMedia('(pointer: fine)').matches
    && !navigator.connection?.saveData;

  if (wantsVanta) {
    const load = (src) => new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });

    load('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
      .then(() => load('https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.net.min.js'))
      .then(() => {
        if (!window.VANTA) return;
        const css = getComputedStyle(document.documentElement);
        const hex = (name, fallback) => {
          const v = css.getPropertyValue(name).trim();
          return /^#[0-9a-f]{6}$/i.test(v) ? parseInt(v.slice(1), 16) : fallback;
        };
        const fx = VANTA.NET({
          el: vantaEl,
          backgroundColor: 0xffffff,
          color: hex('--blue', 0x93ddf4),
          points: 7.5,
          maxDistance: 23,
          spacing: 19,
          showDots: true,
          mouseControls: true,
          touchControls: false,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1
        });
        vantaEl.classList.add('is-live');

        // aus dem Bild gescrollt: Rechenzeit sparen
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(([e]) => {
            if (!fx) return;
            e.isIntersecting ? fx.resize() : null;
            if (fx.renderer) fx.renderer.setAnimationLoop(e.isIntersecting ? fx.renderer.getAnimationLoop?.() ?? null : null);
          }, { threshold: 0 }).observe(vantaEl);
        }
        addEventListener('pagehide', () => fx.destroy?.());
      })
      .catch(() => { /* ohne 3D-Hintergrund sieht die Seite genauso gut aus */ });
  }
})();
