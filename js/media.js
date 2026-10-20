/**
 * media.js — Video & lightbox
 * --------------------------------------------------------------
 * 1. Memutar/menjeda video latar otomatis sesuai posisi di layar.
 * 2. Lightbox video (layar penuh + suara) untuk elemen [data-video].
 * 3. Lightbox foto untuk galeri dan kartu tim.
 * 4. Video cerita Rino & Jojo diputar berulang pada potongan terbaik.
 * Menyediakan: NMS.observeVideo(video), NMS.openVideo(src).
 */
(() => {
  const { $, $$, reduceMotion } = NMS;

  /* 1. Autoplay saat terlihat (hemat baterai & kuota) ------------- */
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {}); // play() bisa ditolak browser
      else target.pause();
    });
  }, { threshold: 0.25 });

  NMS.observeVideo = video => {
    video.muted = true;                       // autoplay hanya diizinkan jika tanpa suara
    if (!reduceMotion) visibility.observe(video);
  };
  $$('video:not(#lbv)').forEach(NMS.observeVideo);

  /* 2. Lightbox video --------------------------------------------- */
  const videoBox = $('#lb');
  const player = $('#lbv');

  NMS.openVideo = src => {
    player.src = src;
    videoBox.hidden = false;
    player.muted = false;                     // di lightbox video boleh bersuara
    player.play().catch(() => {});
  };
  const closeVideo = () => { videoBox.hidden = true; player.pause(); };

  // Satu listener untuk semua pemicu (termasuk kartu hasil klon di carousel)
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-video]');
    if (trigger) NMS.openVideo(trigger.dataset.video);
  });
  $('.x', videoBox).addEventListener('click', closeVideo);
  videoBox.addEventListener('click', e => { if (e.target === videoBox) closeVideo(); });

  /* 3. Lightbox foto ---------------------------------------------- */
  const imageBox = $('#lbi');
  const bigImage = $('#lbim');
  const closeImage = () => { imageBox.hidden = true; };

  $$('.gal figure, .team .card').forEach(item => {
    item.tabIndex = 0;                         // bisa difokus dengan keyboard
    item.setAttribute('role', 'button');
    const show = () => {
      const img = $('img', item);
      bigImage.src = img.currentSrc || img.src;
      bigImage.alt = img.alt;
      imageBox.hidden = false;
    };
    item.addEventListener('click', show);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); }
    });
  });
  $('.x', imageBox).addEventListener('click', closeImage);
  imageBox.addEventListener('click', e => { if (e.target === imageBox) closeImage(); });

  // Tombol Esc menutup lightbox mana pun yang terbuka
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeVideo(); closeImage(); }
  });

  /* 4. Video cerita: ulangi hanya detik 35-48 (adegan terbaik) ----- */
  const story = $('.story .big video');
  const SEGMENT = { start: 35, end: 48 };
  if (story) {
    story.addEventListener('loadedmetadata', () => { story.currentTime = SEGMENT.start; });
    story.addEventListener('timeupdate', () => {
      if (story.currentTime > SEGMENT.end || story.currentTime < SEGMENT.start - 1) {
        story.currentTime = SEGMENT.start;
      }
    });
  }
})();
