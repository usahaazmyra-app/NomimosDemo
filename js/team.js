/**
 * team.js — Senior team berjalan otomatis (HP)
 * --------------------------------------------------------------
 * Di HP (lebar <= 700px) baris Senior team berupa carousel geser. File ini
 * menggesernya satu kartu tiap STEP_MS, lalu kembali ke awal di ujung.
 * Berhenti sementara saat disentuh/digeser, saat foto tim dibuka,
 * saat baris di luar layar, dan jika pengguna meminta animasi dikurangi.
 */
(() => {
  const { $, reduceMotion } = NMS;
  const row = $('.team .r7');
  if (!row || reduceMotion) return;

  const STEP_MS = 2800;                       // jeda antar geseran (milidetik) — ubah di sini
  const phone = matchMedia('(max-width: 700px)');
  let inView = false, holdUntil = 0;

  const hold = ms => { holdUntil = performance.now() + ms; };
  ['pointerdown', 'touchstart', 'wheel', 'focusin'].forEach(type =>
    row.addEventListener(type, () => hold(5000), { passive: true }));
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.4 }).observe(row);

  setInterval(() => {
    if (!phone.matches || !inView || document.hidden || performance.now() < holdUntil) return;
    if (!$('#lbi').hidden) return;            // foto tim sedang dibuka
    const step = row.children[1].offsetLeft - row.children[0].offsetLeft;
    const atEnd = row.scrollLeft >= row.scrollWidth - row.clientWidth - 4;
    row.scrollTo({ left: atEnd ? 0 : row.scrollLeft + step, behavior: 'smooth' });
  }, STEP_MS);
})();
