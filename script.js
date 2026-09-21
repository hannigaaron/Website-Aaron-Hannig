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
  const revealables = $$('.reveal');

  if (hasGSAP) {
    gsap.set(revealables, { opacity: 0, y: 30 });
    ScrollTrigger.batch(revealables, {
      start: 'top 88%',
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1, y: 0, duration: .9, stagger: .09, ease: 'power3.out', overwrite: true,
        onStart: () => batch.forEach(el => el.classList.add('is-visible'))
      })
    });
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

    // Hero: Text und Bild wandern beim Scrollen unterschiedlich schnell
    gsap.to('.hero-inner', {
      yPercent: -14, opacity: .35, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });
    gsap.to('.hero-media', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });

    // Fotos: sanfter Parallaxe-Versatz im Rahmen
    $$('.media-frame img').forEach(img => {
      gsap.fromTo(img, { yPercent: -7 }, {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: img.closest('.media-frame'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
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

    // Kacheln und Zitate: gestaffelt, mit leichtem Aufziehen
    [['.tile', .07], ['.quote', .09], ['.perk', .08], ['.goals li', .06]].forEach(([sel, st]) => {
      ScrollTrigger.batch(sel, {
        start: 'top 90%',
        onEnter: b => gsap.from(b, { opacity: 0, y: 34, scale: .985, duration: .8, stagger: st, ease: 'power3.out', overwrite: 'auto' })
      });
    });

    // Kennzahlen im Hero: laufen von links herein
    ScrollTrigger.batch('.stat', {
      start: 'top 92%',
      onEnter: b => gsap.from(b, { opacity: 0, x: -18, duration: .7, stagger: .08, ease: 'power3.out' })
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
