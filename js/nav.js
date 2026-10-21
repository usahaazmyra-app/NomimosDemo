/**
 * nav.js — Navbar, progres scroll, dan tema
 * --------------------------------------------------------------
 * - Garis emas progres scroll di atas halaman (#pg)
 * - Navbar sembunyi saat scroll turun, muncul saat scroll naik
 * - Menu aktif mengikuti bagian yang sedang dilihat
 * - Menu hamburger (dropdown) untuk tablet & HP
 * - Tombol tema terang/gelap (pilihan disimpan di localStorage)
 */
(() => {
  const { $, $$, store, config } = NMS;
  const root = document.documentElement;
  const nav = $('nav');
  const progress = $('#pg');

  /* Progres scroll + sembunyikan navbar ---------------------------- */
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    progress.style.width = (y / Math.max(1, root.scrollHeight - innerHeight)) * 100 + '%';
    if (y < 260 || y < lastY - 4) nav.classList.remove('hide');  // tampil
    else if (y > lastY + 4 && !nav.classList.contains('menu-open')) nav.classList.add('hide'); // sembunyi (kecuali menu terbuka)
    lastY = y;
  }, { passive: true });

  /* Menu aktif (scroll-spy) ---------------------------------------- */
  const links = $$('nav ul a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });                       // aktif saat bagian di tengah layar
  $$('section[id]').forEach(section => spy.observe(section));

  /* Menu hamburger (tablet & HP) ----------------------------------- */
  const burger = $('#burger');
  const setMenu = open => {
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));
  $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));   // tutup setelah memilih menu
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 1000) setMenu(false); });

  /* Tema terang / gelap -------------------------------------------- */
  const toggle = $('#tg');
  const osPrefersDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = () => root.dataset.theme || (osPrefersDark() ? 'dark' : 'light');

  const saved = store.get(config.storage.theme);
  if (saved) root.dataset.theme = saved;

  const paintToggle = () => {
    const dark = currentTheme() === 'dark';
    toggle.innerHTML = dark ? '&#9728;' : '&#9790;';             // matahari / bulan
    toggle.setAttribute('aria-label', dark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
  };
  toggle.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set(config.storage.theme, next);
    paintToggle();
  });
  paintToggle();
})();
