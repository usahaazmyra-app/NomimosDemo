/**
 * cursor.js — Kursor emas & tombol magnetik (hanya desktop)
 * --------------------------------------------------------------
 * Tidak aktif di layar sentuh atau jika pengguna mengurangi animasi.
 */
(() => {
  const { $$, reduceMotion } = NMS;
  if (reduceMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  /* Cincin emas mengikuti kursor ------------------------------------ */
  const ring = document.createElement('div');
  ring.className = 'cur';
  document.body.appendChild(ring);

  const INTERACTIVE = 'a, button, .rl, .card, figure, summary, select, input';
  let x = 0, y = 0, ringX = 0, ringY = 0;

  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    ring.style.opacity = 1;
    ring.classList.toggle('hv', Boolean(e.target.closest(INTERACTIVE)));  // membesar di atas elemen klik
  });
  document.addEventListener('mouseleave', () => { ring.style.opacity = 0; });

  const follow = () => {
    ringX += (x - ringX) * 0.18;                    // gerak halus (lerp)
    ringY += (y - ringY) * 0.18;
    ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
    requestAnimationFrame(follow);
  };
  follow();

  /* Tombol emas bergeser sedikit mengikuti kursor -------------------- */
  $$('.btn.g').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const box = btn.getBoundingClientRect();
      const dx = (e.clientX - box.left - box.width / 2) * 0.18;
      const dy = (e.clientY - box.top - box.height / 2) * 0.28;
      btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
})();
