/**
 * config.js — Konfigurasi global & fungsi bantu
 * --------------------------------------------------------------
 * Dimuat PERTAMA. Membuat namespace global `NMS` (Nomimos) yang
 * dipakai semua modul lain. Ubah nilai di bawah untuk menyesuaikan
 * website tanpa menyentuh modul lain.
 */
window.NMS = {
  /** Pengaturan yang sering diubah pemilik website */
  config: {
    whatsapp: '6282337572928',                              // Nomor WA (format internasional, tanpa +)
    instagram: 'https://www.instagram.com/nomimos.organizer/',
    music: 'assets/audio/lagu-pernikahan-kita-sax.mp3',     // File musik latar
    musicVolume: 0.8,                                       // Volume musik (0 - 1)
    storage: { music: 'nmus', theme: 'ntheme' }             // Kunci localStorage
  },

  /** true jika pengguna meminta animasi dikurangi (pengaturan aksesibilitas) */
  reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,

  /** Jalan pintas querySelector / querySelectorAll (hasil berupa Array) */
  $: (selector, root = document) => root.querySelector(selector),
  $$: (selector, root = document) => Array.from(root.querySelectorAll(selector)),

  /** localStorage yang aman (bisa gagal di mode privat / diblokir) */
  store: {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* diabaikan */ } }
  },

  /** Membuat tautan WhatsApp dengan pesan yang sudah terisi */
  waLink(text) {
    return 'https://wa.me/' + this.config.whatsapp + '?text=' + encodeURIComponent(text);
  }
};
