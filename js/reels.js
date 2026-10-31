/**
 * reels.js — Carousel video "Nomimos beraksi"
 * --------------------------------------------------------------
 * - Kartu di tengah = aktif: diputar (tanpa suara) dan sedikit membesar;
 *   kartu lain berhenti agar ringan dan fokus.
 * - Berganti otomatis tiap AUTO_MS; jeda saat kursor di atasnya, disentuh, atau lightbox terbuka.
 * - Geser (HP), panah / titik / tombol kiri-kanan (desktop).
 * - Ketuk kartu samping = pindah ke tengah; ketuk kartu aktif = lightbox + suara.
 * Bergantung pada media.js (NMS.openVideo).
 */
(() => {
  const { $, $$, reduceMotion } = NMS;
  const track = $('.reels');
  if (!track) return;

  const cards = $$('.rl', track);
  const prev = $('.rl-prev'), next = $('.rl-next');
  const dotsBox = $('.rl-dots'), count = $('.rl-count');
  const lightbox = $('#lb');
  const AUTO_MS = 7000;                       // jeda antar pergantian video (milidetik) — ubah di sini
  let active = -1, inView = false, ticking = false;
  let elapsed = 0, lastTick = 0, hovering = false, holdUntil = 0;

  const pad = n => String(n).padStart(2, '0');
  const fmt = s => Math.floor(s / 60) + ':' + pad(Math.floor(s % 60));
  const center = card => card.offsetLeft + card.offsetWidth / 2;

  // Titik navigasi
  const dots = cards.map((card, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Video ' + (i + 1) + ': ' + card.dataset.title);
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  // Durasi & progres tiap kartu
  cards.forEach(card => {
    const video = $('video', card), dur = $('.rl-dur', card);
    const showDuration = () => { if (isFinite(video.duration)) dur.textContent = fmt(video.duration); };
    if (video.readyState >= 1) showDuration(); else video.addEventListener('loadedmetadata', showDuration, { once: true });
  });

  function goTo(i) {
    i = Math.max(0, Math.min(cards.length - 1, i));
    track.scrollTo({ left: center(cards[i]) - track.clientWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  // Hanya kartu aktif yang diputar, dan hanya saat section terlihat
  function sync() {
    const canPlay = inView && lightbox.hidden && !document.hidden && !reduceMotion;
    cards.forEach((card, i) => {
      const video = $('video', card);
      if (i === active && canPlay) video.play().catch(() => {}); else video.pause();
    });
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    elapsed = 0;
    cards.forEach((card, k) => {
      card.classList.toggle('on', k === i);
      card.style.setProperty('--p', 0);
      if (k === i) $('video', card).currentTime = 0;     // video aktif selalu mulai dari awal
      if (k === i) card.setAttribute('aria-current', 'true'); else card.removeAttribute('aria-current');
    });
    dots.forEach((dot, k) => dot.classList.toggle('on', k === i));
    count.textContent = pad(i + 1) + ' / ' + pad(cards.length);
    prev.disabled = i === 0;
    next.disabled = i === cards.length - 1;
    sync();
  }

  function detect() {
    ticking = false;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, gap = Infinity;
    cards.forEach((card, i) => {
      const g = Math.abs(center(card) - mid);
      if (g < gap) { gap = g; best = i; }
    });
    setActive(best);
  }

  function open(i) {
    i = (i + cards.length) % cards.length;
    const d = cards[i].dataset;
    goTo(i);
    NMS.openVideo(d.src, {
      cat: d.cat, title: d.title, cta: true,
      onPrev: () => open(i - 1), onNext: () => open(i + 1)
    });
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => (i === active ? open(i) : goTo(i)));
    card.addEventListener('focus', () => { if (i !== active) goTo(i); });
  });
  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
  });
  track.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(detect); }
  }, { passive: true });
  addEventListener('resize', detect);
  document.addEventListener('visibilitychange', sync);
  new MutationObserver(sync).observe(lightbox, { attributes: true, attributeFilter: ['hidden'] });
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.35 }).observe(track);

  // Layar lebar: mulai dari kartu ketiga agar kiri-kanan terisi; HP: mulai dari kartu pertama
  if (innerWidth > 700) track.scrollTo({ left: center(cards[2]) - track.clientWidth / 2, behavior: 'auto' });
  // Pergantian otomatis: garis progres di kartu aktif = hitung mundur ke video berikutnya
  const hold = ms => { holdUntil = performance.now() + ms; };
  ['pointerdown', 'wheel', 'touchstart', 'keydown', 'focusin'].forEach(type =>
    track.addEventListener(type, () => hold(4000), { passive: true }));
  track.addEventListener('mouseenter', () => { hovering = true; });
  track.addEventListener('mouseleave', () => { hovering = false; hold(800); });
  [prev, next, dotsBox].forEach(el => el.addEventListener('click', () => hold(4000)));

  const tick = time => {
    const dt = Math.min(time - lastTick, 100);          // batasi lonjakan saat tab kembali aktif
    lastTick = time;
    const run = !reduceMotion && inView && lightbox.hidden && !document.hidden && !hovering && time > holdUntil;
    if (run && active > -1) {
      elapsed += dt;
      cards[active].style.setProperty('--p', Math.min(elapsed / AUTO_MS, 1));
      if (elapsed >= AUTO_MS) { elapsed = 0; goTo((active + 1) % cards.length); }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  detect();
})();
