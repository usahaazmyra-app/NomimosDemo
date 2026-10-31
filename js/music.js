/**
 * music.js — Musik latar (autoplay)
 * --------------------------------------------------------------
 * - Mencoba autoplay saat halaman dibuka.
 * - Musik selalu dicoba diputar tiap halaman dibuka (pilihan "mati" hanya berlaku selama
 *   halaman itu terbuka). Browser memblokir suara otomatis sebelum pengunjung
 *   berinteraksi, jadi musik dimulai pada klik / ketukan / tombol keyboard pertama.
 * - Musik fade-out & berhenti saat video bersuara diputar (lightbox),
 *   lalu lanjut lagi saat video ditutup. Berhenti juga saat tab disembunyikan.
 * - Tombol #mus untuk menyalakan/mematikan; pilihan disimpan di localStorage.
 * File lagu & volume diatur di config.js.
 */
(() => {
  const { $, $$, store, config } = NMS;
  const button = $('#mus');
  const label = $('#mlb');

  const audio = new Audio(config.music);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;                                  // dimulai dari senyap lalu fade-in

  let wantMusic = true;                              // selalu coba autoplay saat halaman dibuka
  let audible = false;                               // true = benar-benar terdengar
  let videoPlaying = false;                          // true = ada video bersuara diputar
  let fadeTimer;

  /** Ubah volume bertahap (fade) menuju `target` selama `ms` milidetik */
  const fadeTo = (target, ms, done) => {
    clearInterval(fadeTimer);
    const from = audio.volume, t0 = performance.now();
    fadeTimer = setInterval(() => {
      const p = Math.min((performance.now() - t0) / ms, 1);
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * p));
      if (p >= 1) { clearInterval(fadeTimer); if (done) done(); }
    }, 40);
  };

  /** Perbarui tampilan tombol musik */
  const render = () => {
    button.classList.toggle('on', audible);                          // animasi equalizer
    button.classList.toggle('wait', wantMusic && !audible && !videoPlaying); // berdenyut: menunggu ketukan
    button.setAttribute('aria-pressed', String(wantMusic));
    label.textContent = audible ? 'Music'
      : wantMusic ? (videoPlaying ? 'Dijeda (video)' : 'Putar musik')
      : 'Musik mati';
  };

  /** Coba putar dengan suara; jika diblokir, jalan senyap & tunggu interaksi */
  const play = async () => {
    if (audible) return true;
    audio.muted = false;
    try {
      await audio.play();
      audible = true;
      fadeTo(config.musicVolume, 1500);
      render();
      return true;
    } catch (err) {
      audio.muted = true;
      audio.play().catch(() => {});
      audible = false;
      render();
      return false;
    }
  };

  const stop = () => {
    audible = false;
    fadeTo(0, 350, () => audio.pause());
    render();
  };

  /** Putuskan: musik boleh jalan jika diinginkan, tak ada video bersuara, tab terlihat */
  const sync = () => (wantMusic && !videoPlaying && !document.hidden) ? play() : stop();

  /** Deteksi video bersuara yang sedang diputar */
  const checkVideos = () => {
    const playing = $$('video').some(v => !v.paused && !v.muted && v.readyState > 2);
    if (playing !== videoPlaying) { videoPlaying = playing; sync(); }
  };
  ['play', 'playing', 'pause', 'ended', 'volumechange'].forEach(type =>
    document.addEventListener(type, checkVideos, true));   // capture: event media tidak menggelembung
  document.addEventListener('visibilitychange', sync);

  /** Interaksi pertama pengunjung membuka izin audio browser */
  const firstGesture = e => {
    if (audible || (e.target.closest && e.target.closest('#mus'))) return;
    if (wantMusic && !videoPlaying) {
      play().then(ok => {
        if (!ok) return;
        GESTURES.forEach(t => removeEventListener(t, firstGesture, true));
      });
    }
  };
  const GESTURES = ['pointerup', 'mousedown', 'click', 'keydown', 'touchend'];  // pemicu paling awal yang diizinkan browser
  GESTURES.forEach(t => addEventListener(t, firstGesture, true));

  /** Tombol musik */
  button.addEventListener('click', () => {
    if (wantMusic && !audible && !videoPlaying) { play(); return; }  // menunggu: klik = putar
    wantMusic = !wantMusic;
    store.set(config.storage.music, wantMusic ? 'on' : 'off');
    if (wantMusic && !videoPlaying) play(); else stop();
    render();
  });

  render();
  if (wantMusic) play();                             // percobaan autoplay saat halaman dibuka
})();
