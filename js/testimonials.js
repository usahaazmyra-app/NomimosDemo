/**
 * testimonials.js — Kartu testimoni
 * --------------------------------------------------------------
 * Desktop : 3 kartu terlihat sekaligus; kartu "aktif" (bingkai emas)
 *           berganti otomatis tiap 5,5 detik, berhenti saat disentuh kursor.
 * Tablet/HP: kartu digeser (swipe) atau lewat panah/titik; kartu di tengah
 *           layar otomatis menjadi aktif.
 * Isi testimoni ada di index.html (section id="testimoni").
 */
(() => {
  const { $, $$, reduceMotion } = NMS;
  const track = $('#tmTrack');
  if (!track) return;

  const cards = $$('.tcard', track);
  const dotsBox = $('#tmDots');
  const stacked = matchMedia('(max-width: 1000px)');   // tablet & HP = carousel geser
  const INTERVAL = 5500;
  let index = stacked.matches ? 0 : 1, timer;     // desktop: kartu tengah menyala; carousel: mulai dari kartu pertama

  /* Titik penunjuk ------------------------------------------------ */
  const dots = cards.map((_, k) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Testimoni ' + (k + 1));
    dot.addEventListener('click', () => go(k, true));
    dotsBox.appendChild(dot);
    return dot;
  });

  /** Tandai kartu aktif */
  const mark = k => {
    index = k;
    cards.forEach((card, j) => card.classList.toggle('on', j === k));
    dots.forEach((dot, j) => dot.classList.toggle('on', j === k));
  };

  /** Pindah ke kartu k (di carousel: geser agar kartu berada di tengah) */
  const go = (k, byUser) => {
    k = (k + cards.length) % cards.length;
    mark(k);
    if (stacked.matches) {
      const card = cards[k];
      track.scrollTo({
        left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }
    if (byUser) restart();
  };

  /* Pergantian otomatis (hanya desktop) ------------------------------ */
  const restart = () => {
    clearInterval(timer);
    if (!reduceMotion && !stacked.matches) timer = setInterval(() => mark((index + 1) % cards.length), INTERVAL);
  };

  /* Interaksi ------------------------------------------------------ */
  $('#tmPrev').addEventListener('click', () => go(index - 1, true));
  $('#tmNext').addEventListener('click', () => go(index + 1, true));

  cards.forEach((card, k) => {
    card.addEventListener('mouseenter', () => { if (!stacked.matches) { clearInterval(timer); mark(k); } });
    card.addEventListener('mouseleave', restart);
  });

  // Saat digeser manual: kartu terdekat dengan tengah layar menjadi aktif
  let ticking = false;
  track.addEventListener('scroll', () => {
    if (!stacked.matches || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0, gap = Infinity;
      cards.forEach((card, k) => {
        const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (d < gap) { gap = d; best = k; }
      });
      // Di ujung kiri/kanan jalur, kartu pertama/terakhir menjadi aktif walau tidak bisa sampai ke tengah
      if (track.scrollLeft <= 4) best = 0;
      else if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 4) best = cards.length - 1;
      if (best !== index) mark(best);
      ticking = false;
    });
  }, { passive: true });

  stacked.addEventListener('change', restart);

  mark(index);
  restart();
})();
