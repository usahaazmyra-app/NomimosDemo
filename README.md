# Nomimos Organizer — Website Landing Page

Website statis (HTML + CSS + JavaScript murni, tanpa framework dan tanpa proses build).
Responsif untuk desktop, tablet, dan handphone. Siap di-deploy ke Vercel, GitHub Pages, atau Hostinger.

## Struktur folder

```
nomimos-organizer/
├─ index.html            Halaman utama (semua bagian, diberi komentar per bagian)
├─ 404.html              Halaman "tidak ditemukan"
├─ css/                  Gaya, satu file per bagian (urutan muat ada di index.html)
│  ├─ base.css           Variabel warna/tema, reset, tipografi, tombol  <- ubah warna di sini
│  ├─ animations.css     Semua @keyframes
│  ├─ nav.css  hero.css  marquee-stats.css  about.css  services.css  packages.css
│  ├─ media.css          Carousel video dan lightbox
│  ├─ stories.css        Kisah pasangan (kumpulan video wedding klien)
│  ├─ team.css  process.css  testimonials.css  faq-contact.css  footer.css
│  ├─ widgets.css        Tombol WA, musik, kursor, progres scroll
│  └─ utilities.css      Efek muncul saat scroll (dimuat terakhir)
├─ js/                   Perilaku, satu file per fitur (semua memakai namespace NMS)
│  ├─ config.js          Nomor WA, Instagram, file musik  <- ubah di sini
│  ├─ media.js           Video autoplay, lightbox video & foto
│  ├─ nav.js  hero.js  reveal.js  services.js  packages.js
│  ├─ reels.js  stories.js  testimonials.js  contact.js  music.js  cursor.js
├─ assets/
│  ├─ images/ (hero, team, packages, gallery, services, logo)
│  ├─ video/
│  └─ audio/
├─ vercel.json           Pengaturan cache & keamanan untuk Vercel
├─ .htaccess             Pengaturan untuk Hostinger / Apache
├─ robots.txt  sitemap.xml  .gitignore
```

## Menjalankan di komputer sendiri

Cara paling mudah: klik dua kali `index.html`. Untuk uji yang lebih mirip server asli:

```bash
python3 -m http.server 8000      # lalu buka http://localhost:8000
```

## Mengubah isi website

| Yang diubah | Di mana |
|---|---|
| Nomor WhatsApp (formulir) | `js/config.js` -> `whatsapp` |
| Nomor WhatsApp (tombol & tautan) | cari `6282337572928` di `index.html`, ganti semua |
| Instagram | `js/config.js` dan tautan `instagram.com/nomimos.organizer` di `index.html` |
| Warna merek | `css/base.css`, bagian `:root` |
| Foto hero (4 foto) | `index.html`, `.arch2`; file di `assets/images/hero/` |
| Harga & isi paket | `index.html`, section `id="paket"` |
| Testimoni | `index.html`, section `.tm` (**saat ini teks contoh**) |
| Musik latar | ganti file di `assets/audio/` lalu perbarui `music` di `js/config.js` |
| Tambah video carousel | duplikat satu `<button class="rl">` di section `id="reels"` |
| Tambah pasangan di "Kisah pasangan" | taruh video di `assets/video/pasangan/` dan gambar sampul di `assets/images/pasangan/`; duplikat satu `<li class="love-item">` di section `id="cerita"` (ubah `data-clip`, `data-poster`, `data-names`) dan ubah angka `/ 07` |

Menambah animasi muncul-saat-scroll ke elemen baru: tambahkan selector-nya di konstanta `REVEAL` pada `js/reveal.js`.

## Yang perlu diisi sebelum dipublikasikan

- Testimoni klien (sekarang contoh), angka "100+ acara", harga paket Wedding.
- Jawaban FAQ (DP, area layanan, waktu booking).
- Ganti `DOMAIN-ANDA.com` di `index.html` (canonical & og:image), `robots.txt`, `sitemap.xml`.
- **Musik:** lagu "Lagu Pernikahan Kita" (cover saxophone) adalah karya berhak cipta. Pastikan Anda punya izin/lisensi sebelum situs dipublikasikan, atau ganti dengan musik bebas royalti.

## Deploy

### 1. GitHub
```bash
cd nomimos-organizer
git init
git add -A
git commit -m "Initial commit: website Nomimos Organizer"
git branch -M main
git remote add origin https://github.com/azmyikh98-rgb/nomimos-organizer.git
git push -u origin main
```
Buat repository kosong `nomimos-organizer` di GitHub lebih dulu. Ukuran folder `assets/video` sekitar 50 MB; masih di bawah batas GitHub (100 MB per file).

### 2. Vercel
1. Masuk ke vercel.com -> **Add New Project** -> pilih repository tadi.
2. **Framework Preset: Other**. Biarkan Build Command dan Output Directory kosong (situs statis).
3. Klik **Deploy**. Setiap `git push` ke `main` otomatis memperbarui situs.
4. Domain sendiri: Project -> **Settings -> Domains**.

### 3. Hostinger (nanti)
1. hPanel -> **Files -> File Manager** -> buka `public_html`.
2. Unggah **isi** folder proyek (bukan folder induknya): `index.html`, `css/`, `js/`, `assets/`, `.htaccess`, dan lainnya. Gunakan File Manager (zip lalu Extract) atau FTP.
3. Aktifkan SSL gratis di hPanel (bagian Security -> SSL) agar pengalihan HTTPS di `.htaccess` berfungsi.
4. Jika file `.htaccess` tidak terlihat, aktifkan "Show hidden files".

## Catatan teknis

- **Tanpa build:** hanya file statis; mudah dipindah ke hosting mana pun.
- **Urutan file penting:** CSS dan JS dimuat dalam urutan yang tertulis di `index.html`. `js/config.js` dan `js/media.js` harus pertama.
- **Aksesibilitas:** navigasi keyboard, label ARIA, dan animasi otomatis berhenti bagi pengguna yang mengaktifkan "kurangi gerakan".
- **Autoplay musik:** browser memblokir suara otomatis sebelum pengunjung berinteraksi. Musik mulai pada klik/ketukan pertama; ini aturan browser, bukan bug.
- **Performa:** video diputar hanya saat terlihat di layar. Untuk koneksi lambat, pertimbangkan membuat versi video yang lebih ringan.
- **Cache:** Vercel menyimpan folder `assets` selama 7 hari. Jika mengganti file dengan nama yang sama, ubah namanya agar pengunjung langsung melihat versi baru.

## Setiap kali ada perubahan (Git)

```bash
git add -A
git commit -m "Deskripsi perubahan"
git push
```
