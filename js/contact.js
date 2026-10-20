/**
 * contact.js — Formulir kontak -> WhatsApp
 * --------------------------------------------------------------
 * Tidak ada server. Isi formulir disusun menjadi pesan dan dibuka di
 * WhatsApp (nomor diatur di config.js). Field: nama, jenis acara,
 * tanggal, perkiraan jumlah tamu.
 */
(() => {
  const { $ } = NMS;
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const f = form.elements;                         // akses field lewat atribut name
    let text = 'Halo Nomimos, saya ' + f.n.value + '. Acara: ' + f.j.value;
    if (f.d.value) text += ', tanggal ' + f.d.value;
    if (f.g.value) text += ', perkiraan ' + f.g.value + ' tamu';
    $('#ok').style.display = 'block';                // pesan "Membuka WhatsApp..."
    window.open(NMS.waLink(text + '.'), '_blank', 'noopener');
  });
})();
