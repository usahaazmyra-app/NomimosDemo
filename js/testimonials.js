/**
 * testimonials.js — Slider testimoni
 * --------------------------------------------------------------
 * Tiga tab dengan garis progres emas. Pindah otomatis tiap 7 detik,
 * berhenti saat kursor/fokus di dalamnya, bisa digeser di layar sentuh.
 */
(() => {
  const { $, $$, reduceMotion } = NMS;
  const quotes = $$('.tq');
  const photos = $$('.tmv .c1 img');
  const tabs = $$('.tabs2 button');
  const label = $('#tch');
  const area = $('.tmg');
  if (!quotes.length) return;

  const DURATION = 7000;                            // ms per testimoni
  let index = 0, progress = 0, hovering = false, last = performance.now();
  const bar = k => $('i', tabs[k]);

  const go = k => {
    index = (k + quotes.length) % quotes.length;
    progress = 0;
    quotes.forEach((q, j) => q.classList.toggle('on', j === index));
    photos.forEach((p, j) => p.classList.toggle('on', j === index));
    tabs.forEach((tab, j) => {
      tab.classList.toggle('on', j === index);
      tab.setAttribute('aria-selected', String(j === index));
      bar(j).style.width = (reduceMotion && j === index) ? '100%' : '0';
    });
    label.textContent = tabs[index].dataset.l;
  };
  tabs.forEach((tab, k) => tab.addEventListener('click', () => go(k)));

  // Jeda saat kursor / fokus di dalam area testimoni
  area.addEventListener('mouseenter', () => { hovering = true; });
  area.addEventListener('mouseleave', () => { hovering = false; });
  area.addEventListener('focusin', () => { hovering = true; });
  area.addEventListener('focusout', () => { hovering = false; });

  // Geser kiri/kanan di layar sentuh
  let startX = null;
  area.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  area.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  // Isi garis progres tiap frame; pindah saat penuh
  const frame = time => {
    const dt = Math.min(time - last, 50);
    last = time;
    if (!hovering && !reduceMotion && !document.hidden) {
      progress += dt / DURATION;
      bar(index).style.width = Math.min(progress, 1) * 100 + '%';
      if (progress >= 1) go(index + 1);
    }
    requestAnimationFrame(frame);
  };
  go(0);
  requestAnimationFrame(frame);
})();
