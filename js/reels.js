/**
 * reels.js — Carousel video "Nomimos beraksi" (jalan otomatis)
 * --------------------------------------------------------------
 * Kartu digandakan agar putaran tidak terputus. Berhenti sementara saat
 * kursor di atasnya atau layar disentuh, dan saat lightbox video terbuka.
 * Bergantung pada media.js (NMS.observeVideo).
 */
(() => {
  const { $, reduceMotion } = NMS;
  const row = $('.reels');
  if (!row || reduceMotion) return;                 // tanpa animasi: carousel manual saja

  const SPEED = 0.05;                               // px per milidetik (50 px/detik)
  const original = Array.from(row.children);
  const count = original.length;

  // Gandakan kartu (klon disembunyikan dari pembaca layar)
  original.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    row.appendChild(clone);
    NMS.observeVideo($('video', clone));
  });

  // Lebar satu putaran penuh = jarak kartu pertama ke klon pertama
  const loopWidth = () => row.children[count].offsetLeft - row.children[0].offsetLeft;

  let position = row.scrollLeft, last = 0, holdUntil = 0;
  const hold = ms => { holdUntil = performance.now() + ms; };

  ['pointerdown', 'wheel', 'touchstart', 'focusin'].forEach(type =>
    row.addEventListener(type, () => hold(2500), { passive: true }));
  row.addEventListener('mouseenter', () => { holdUntil = Infinity; });
  row.addEventListener('mouseleave', () => hold(800));
  row.addEventListener('scroll', () => {              // jika digeser manual melewati batas, kembali ke awal
    if (row.scrollLeft >= loopWidth()) row.scrollLeft -= loopWidth();
  }, { passive: true });

  const tick = time => {
    const dt = Math.min(time - last, 50);             // batasi lonjakan saat tab kembali aktif
    last = time;
    const lightboxOpen = !$('#lb').hidden;
    if (time > holdUntil && !lightboxOpen && !document.hidden) {
      position += SPEED * dt;
      if (position >= loopWidth()) position -= loopWidth();
      row.scrollLeft = position;
    } else {
      position = row.scrollLeft;                      // sinkron dengan posisi manual
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
