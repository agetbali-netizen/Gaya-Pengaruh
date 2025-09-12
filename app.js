// Fungsi untuk menghitung skor berdasarkan checkbox yang dicentang
function countScores() {
  const counts = {
    Rationalizing: 0,
    Asserting: 0,
    Negotiating: 0,
    Inspiring: 0,
    Bridging: 0
  };

  // Pemetaan checkbox untuk setiap kategori
  const groups = {
    Rationalizing: [1, 2, 3],
    Asserting: [4, 5, 6],
    Negotiating: [7, 8, 9],
    Inspiring: [10, 11, 12],
    Bridging: [13, 14, 15]
  };

  // Menghitung jumlah centangan untuk setiap kategori
  for (const [category, questions] of Object.entries(groups)) {
    counts[category] = questions.reduce((acc, q) => acc + (document.getElementById(`q${q}`).checked ? 1 : 0), 0);
  }

  return counts;
}

// Fungsi untuk mengirim data ke Google Sheets
async function sendToGoogleSheets(fullName, counts) {
  const response = await fetch('https://script.google.com/macros/s/AKfycbxehEAd3dOmbtDfR4zrbeEusNqHqRPIB9eCaPsDNpU/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: fullName,  // Nama lengkap
      counts: counts       // Skor per kategori
    }),
  });

  if (!response.ok) {
    alert('Gagal mengirim data ke Google Sheets');
  } else {
    alert('Data berhasil dikirim!');
  }
}

// Menambahkan event listener untuk menangani submit form
const form = document.getElementById('formGM');
form.addEventListener('submit', (e) => {
  e.preventDefault();  // Menghentikan form dari submit default

  // Ambil nama lengkap dari input field
  const fullName = document.getElementById('fullName').value;

  // Hitung skor berdasarkan checkbox yang dicentang
  const counts = countScores();

  // Kirimkan data ke Google Sheets
  sendToGoogleSheets(fullName, counts);

  // Tampilkan hasil atau grafik sesuai dengan hasil perhitungan
  updateCounters(counts);  // Fungsi ini untuk memperbarui skor yang ditampilkan
  renderChart(counts);     // Fungsi ini untuk menggambar grafik radar

  // Tampilkan hasil
  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth' });
});

// Fungsi untuk reset form dan hasil
const btnReset = document.getElementById('btnReset');
btnReset.addEventListener('click', () => {
  form.reset();  // Reset form
  if (chart) chart.destroy();  // Hapus grafik jika ada
  result.classList.add('hidden');  // Sembunyikan hasil
});
