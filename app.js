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
  const response = await fetch('https://script.google.com/macros/s/1V2UGSCbpRBuQfbfXRzSMwst-XnScCG5oVWf46nHMkYc/exec', {
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
function renderChart(counts) {
  const ctx = document.getElementById('radarChart').getContext('2d');
  const data = [
    counts.Rationalizing, counts.Asserting, counts.Negotiating, counts.Inspiring, counts.Bridging
  ];

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Rationalizing', 'Asserting', 'Negotiating', 'Inspiring', 'Bridging'],
      datasets: [{
        label: 'Gaya Mempengaruhi',
        data,
        fill: true,
        backgroundColor: 'rgba(0, 123, 255, 0.2)', 
        borderColor: 'rgba(0, 123, 255, 1)', 
        pointBackgroundColor: 'rgba(0, 123, 255, 1)', 
        pointBorderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      scales: { 
        r: { 
          min: 0, 
          max: 3, 
          ticks: { stepSize: 1 },
          grid: {
            color: "#ddd" 
          }
        }
      },
      plugins: {
        legend: {
          display: false 
        }
      }
    }
  });

  setTimeout(() => {
    downloadLink.href = chart.toBase64Image();
  }, 300);
}
