/**
 * media.js — Video & lightbox
 * --------------------------------------------------------------
 * 1. Memutar/menjeda video latar otomatis sesuai posisi di layar.
 * 2. Lightbox video (layar penuh + suara) untuk elemen [data-video].
 * 3. Lightbox foto untuk kartu tim.
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
  $$('video:not(#lbv):not(.reels video)').forEach(NMS.observeVideo);

  /* 2. Lightbox video --------------------------------------------- */
  const videoBox = $('#lb');
  const player = $('#lbv');
  const cap = $('.lb-cap', videoBox), capCat = $('.lb-cat', videoBox), capTitle = $('.lb-title', videoBox);
  const cta = $('.lb-cta', videoBox), navPrev = $('.lb-prev', videoBox), navNext = $('.lb-next', videoBox);
  let meta = null, opener = null;

  // info (opsional): { title, cat, cta, onPrev, onNext } -> keterangan, tombol WhatsApp, dan panah antar video
  NMS.openVideo = (src, info = {}) => {
    meta = info;
    if (videoBox.hidden) opener = document.activeElement;
    player.src = src;
    cap.hidden = !info.title;
    capCat.textContent = info.cat || '';
    capTitle.textContent = info.title || '';
    cta.hidden = !info.cta;
    if (info.cta) cta.href = NMS.waLink('Halo Nomimos, saya tertarik setelah melihat video "' + info.title + '"');
    navPrev.hidden = !info.onPrev;
    navNext.hidden = !info.onNext;
    videoBox.hidden = false;
    document.body.style.overflow = 'hidden';  // cegah halaman ikut bergulir di belakang
    player.muted = false;                     // di lightbox video boleh bersuara
    player.play().catch(() => {});
    $('.x', videoBox).focus({ preventScroll: true });
  };
  const closeVideo = () => {
    if (videoBox.hidden) return;
    videoBox.hidden = true;
    player.pause();
    meta = null;
    document.body.style.overflow = '';
    if (opener) opener.focus({ preventScroll: true });
    opener = null;
  };
  navPrev.addEventListener('click', () => meta && meta.onPrev && meta.onPrev());
  navNext.addEventListener('click', () => meta && meta.onNext && meta.onNext());

  // Satu listener untuk semua pemicu [data-video]
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-video]');
    if (trigger) NMS.openVideo(trigger.dataset.video);
  });
  // Pemicu berupa div role="button" (mis. video tim) juga bisa dibuka dengan Enter / Spasi
  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-video][role="button"]')) {
      event.preventDefault();
      NMS.openVideo(event.target.dataset.video);
    }
  });
  $('.x', videoBox).addEventListener('click', closeVideo);
  videoBox.addEventListener('click', e => { if (e.target === videoBox) closeVideo(); });

  /* 3. Lightbox foto ---------------------------------------------- */
  const imageBox = $('#lbi');
  const bigImage = $('#lbim');
  const closeImage = () => { imageBox.hidden = true; };

  $$('.team .card').forEach(item => {
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
    if (!videoBox.hidden && meta && e.target !== player) {   // panah kiri/kanan = video sebelumnya/berikutnya
      if (e.key === 'ArrowLeft' && meta.onPrev) meta.onPrev();
      if (e.key === 'ArrowRight' && meta.onNext) meta.onNext();
    }
  });
})();
