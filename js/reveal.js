/**
 * reveal.js — Animasi saat di-scroll
 * --------------------------------------------------------------
 * - Elemen muncul halus saat masuk layar (kelas .rv -> .in)
 * - Angka statistik menghitung naik ([data-n])
 * - Garis atas langkah "Cara kerja" menyala emas saat terlihat
 */
(() => {
  const { $$, reduceMotion } = NMS;

  /* Muncul saat di-scroll ------------------------------------------- */
  // Daftar elemen yang ikut animasi. Tambahkan selector baru di sini.
  const REVEAL = '.head, .abt, .about .w > div:last-child, .pk, .steps li, ' +
                 '.faq details, .card, .ng > *, .lv';

  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      reveal.unobserve(entry.target);             // cukup sekali
    });
  }, { threshold: 0.1 });

  $$(REVEAL).forEach(el => {
    el.classList.add('rv');
    // jeda bertingkat antar saudara agar muncul berurutan
    const position = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = (position % 4) * 90 + 'ms';
    reveal.observe(el);
  });

  /* Hitung naik angka statistik -------------------------------------- */
  const counter = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      counter.unobserve(target);
      if (reduceMotion) return;                   // tampilkan angka akhir saja
      const end = Number(target.dataset.n);
      const DURATION = 1200;
      let start;
      const step = time => {
        start = start || time;
        const p = Math.min((time - start) / DURATION, 1);
        target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));  // easing keluar
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  $$('[data-n]').forEach(el => {
    if (!reduceMotion) el.textContent = '0';
    counter.observe(el);
  });

  /* Langkah "Cara kerja" menyala saat terlihat ------------------------ */
  const steps = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('lit', e.isIntersecting));
  }, { threshold: 0.7 });
  $$('.steps li').forEach(li => steps.observe(li));
})();
