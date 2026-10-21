/**
 * services.js — Panel layanan yang melebar
 * --------------------------------------------------------------
 * Satu panel terbuka pada satu waktu. Berganti otomatis tiap 4,5 detik
 * sampai pengunjung berinteraksi (hover / klik / keyboard).
 * Di HP (akordeon vertikal) pergantian otomatis DIMATIKAN karena tinggi
 * panel berubah dan membuat halaman melompat saat di-scroll.
 */
(() => {
  const { $, $$, reduceMotion } = NMS;
  const panels = $$('.pn');
  const wrapper = $('.sv2');
  if (!panels.length) return;

  const INTERVAL = 4500;
  let current = 0, timer;

  const open = k => {
    current = k;
    panels.forEach((panel, j) => {
      panel.classList.toggle('on', j === k);
      panel.setAttribute('aria-expanded', String(j === k));
    });
  };
  const stopAuto = () => { clearInterval(timer); wrapper.classList.remove('cy'); };  // 'cy' = animasi progres

  const stacked = matchMedia('(max-width: 700px)');         // HP: panel tersusun vertikal
  if (reduceMotion) wrapper.classList.remove('cy');
  else timer = setInterval(() => { if (!stacked.matches) open((current + 1) % panels.length); }, INTERVAL);

  panels.forEach((panel, k) => {
    const activate = () => { stopAuto(); open(k); };
    panel.addEventListener('click', e => { if (!e.target.closest('a')) activate(); }); // tombol WA tetap berfungsi
    panel.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
    panel.addEventListener('mouseenter', () => {
      if (matchMedia('(hover: hover)').matches) activate();     // hover hanya di perangkat dengan mouse
    });
  });
})();
