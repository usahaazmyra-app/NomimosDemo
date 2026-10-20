/**
 * hero.js — Bagian pembuka (hero)
 * --------------------------------------------------------------
 * 1. Judul muncul kata demi kata.
 * 2. Slideshow foto di bingkai lengkung (4 foto, ganti tiap 5,2 detik).
 * 3. Efek parallax ringan mengikuti mouse (desktop).
 * 4. Badge layanan membuka panel layanan yang sesuai.
 */
(() => {
  const { $, $$, reduceMotion } = NMS;

  /* 1. Animasi judul ----------------------------------------------- */
  const title = $('#h1');
  if (title) {
    title.innerHTML = title.textContent.trim().split(' ')
      .map((word, i) => '<span class="wd" aria-hidden="true" style="--i:' + i + '">' + word + '</span>')
      .join('');                                  // teks asli tetap terbaca lewat aria-label di HTML
  }

  /* 2. Slideshow foto ---------------------------------------------- */
  const arch = $('.arch2');
  if (arch) {
    const slides = $$('img', arch);
    const dots = $$('.hdots button', arch);
    const INTERVAL = 5200;                        // ms antar foto
    let index = 0, timer;

    const show = n => {
      index = (n + slides.length) % slides.length;
      slides.forEach((img, k) => img.classList.toggle('on', k === index));
      dots.forEach((dot, k) => dot.classList.toggle('on', k === index));
    };
    const autoplay = () => {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => show(index + 1), INTERVAL);
    };
    dots.forEach((dot, k) => dot.addEventListener('click', () => { show(k); autoplay(); }));
    show(0);
    autoplay();
  }

  /* 3. Parallax mouse ---------------------------------------------- */
  const hero = $('.hero');
  const rings = $('.rings');
  if (hero && rings && !reduceMotion) {
    const frame = $('.pa', rings);                // bingkai foto
    const ornaments = $$('.pc', rings);           // ranting emas
    hero.addEventListener('mousemove', e => {
      const x = (e.clientX / innerWidth - 0.5) * 2;   // -1 .. 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      frame.style.transform = 'translate(' + x * -10 + 'px,' + y * -10 + 'px)';
      ornaments.forEach((el, k) => {
        const power = k ? -14 : 14;               // ranting bergerak berlawanan arah
        el.style.transform = 'translate(' + x * power + 'px,' + y * power + 'px)';
      });
    });
  }

  /* 4. Badge layanan -> buka panel layanan terkait ------------------ */
  $$('.hb').forEach(badge => {
    badge.addEventListener('click', () => {
      const panel = $$('.pn')[Number(badge.dataset.s)];   // data-s = urutan panel (mulai 0)
      if (panel) setTimeout(() => panel.click(), 450);    // tunggu scroll ke section selesai
    });
  });
})();
