/**
 * stories.js — Kisah pasangan (kumpulan video wedding klien)
 * --------------------------------------------------------------
 * - Satu video utama di bingkai ponsel; daftar 7 pasangan untuk memilih.
 * - Video HANYA dimuat saat section mendekati layar, dan hanya satu
 *   video yang dimuat pada satu waktu (hemat kuota).
 * - Berganti otomatis ke pasangan berikutnya setelah CLIP detik; berhenti
 *   saat kursor/fokus berada di section atau lightbox video terbuka.
 * - Klik video / tombol "Tonton dengan suara" membuka lightbox (js/media.js
 *   lewat atribut data-video).
 * Daftar pasangan ada di index.html (section id="cerita"); atribut data-clip berisi file video.
 * (Sengaja bukan data-video, karena atribut itu otomatis membuka lightbox.)
 */
(() => {
  const { $, $$, reduceMotion } = NMS;
  const section = $('.love');
  if (!section) return;

  const video = $('#loveVideo');
  const screen = $('#lovePhone');
  const watchBtn = $('#loveWatch');
  const namesEl = $('#loveNames');
  const bar = $('.love-progress b');
  const list = $('#loveList');
  const items = $$('.love-item');
  const total = items.length;
  const stacked = matchMedia('(max-width: 860px)');   // daftar berupa barisan geser

  const CLIP = 14;                                    // detik tayang sebelum pindah otomatis
  let index = -1, hold = false, loaded = false;

  /** Pilih pasangan ke-k: perbarui teks, poster, dan (jika sudah aktif) video */
  const select = k => {
    index = (k + total) % total;
    const item = items[index];

    items.forEach((el, j) => {
      el.classList.toggle('on', j === index);
      el.setAttribute('aria-current', String(j === index));
    });

    // Nama memudar sebentar saat berganti
    section.classList.add('swap');
    setTimeout(() => {
      namesEl.textContent = item.dataset.names;
      section.classList.remove('swap');
    }, 220);

    screen.dataset.video = item.dataset.clip;        // pemicu lightbox
    watchBtn.dataset.video = item.dataset.clip;
    screen.setAttribute('aria-label', 'Tonton video ' + item.dataset.names + ' dengan suara');

    video.poster = item.dataset.poster;
    bar.style.width = '0';

    if (loaded && !reduceMotion) {
      video.src = item.dataset.clip;                 // memuat video pasangan ini saja
      video.play().catch(() => {});
    }

    // Di HP: geser daftar agar item terpilih terlihat
    if (stacked.matches) {
      list.scrollTo({
        left: item.parentElement.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }
  };

  /* Muat video pertama saat section mendekati layar ------------------ */
  const lazy = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    loaded = true;
    lazy.disconnect();
    select(Math.max(index, 0));
  }, { rootMargin: '250px' });
  lazy.observe(section);

  /* Progres + pindah otomatis ------------------------------------------ */
  video.addEventListener('timeupdate', () => {
    bar.style.width = Math.min(video.currentTime / CLIP, 1) * 100 + '%';
    const lightboxOpen = !$('#lb').hidden;
    if (video.currentTime >= CLIP && !hold && !lightboxOpen && !reduceMotion) select(index + 1);
  });

  /* Interaksi ------------------------------------------------------- */
  items.forEach((item, k) => item.addEventListener('click', () => select(k)));
  $('#lovePrev').addEventListener('click', () => select(index - 1));
  $('#loveNext').addEventListener('click', () => select(index + 1));

  const stage = $('.love-stage');
  stage.addEventListener('mouseenter', () => { hold = true; });
  stage.addEventListener('mouseleave', () => { hold = false; });
  stage.addEventListener('focusin', () => { hold = true; });
  stage.addEventListener('focusout', () => { hold = false; });

  // Geser kiri/kanan pada video (layar sentuh)
  let startX = null;
  screen.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  screen.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) select(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  select(0);                                          // tampilan awal: poster + nama pasangan pertama
})();
