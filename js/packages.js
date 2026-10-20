/**
 * packages.js — Tab paket & efek tilt foto
 * --------------------------------------------------------------
 * Tab: tombol .tabs button[data-t="idPaket"] menampilkan kartu .pk#idPaket.
 */
(() => {
  const { $$, reduceMotion } = NMS;

  /* Tab paket ------------------------------------------------------- */
  const tabs = $$('.tabs button');
  const cards = $$('.pk');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    cards.forEach(card => card.classList.toggle('on', card.id === tab.dataset.t));
  }));

  /* Foto paket miring mengikuti kursor (3D ringan) ------------------ */
  if (reduceMotion) return;
  $$('.pk img').forEach(img => {
    img.style.transition = 'transform .2s';
    img.addEventListener('pointermove', e => {
      const box = img.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width - 0.5;
      const y = (e.clientY - box.top) / box.height - 0.5;
      img.style.transform = 'perspective(700px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg)';
    });
    img.addEventListener('pointerleave', () => { img.style.transform = ''; });
  });
})();
