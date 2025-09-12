(() => {
  const groups = {
    Rationalizing: [1, 2, 3],
    Asserting: [4, 5, 6],
    Negotiating: [7, 8, 9],
    Inspiring: [10, 11, 12],
    Bridging: [13, 14, 15]
  };

  const form = document.getElementById('formGM');
  const result = document.getElementById('result');
  const btnReset = document.getElementById('btnReset');

  // URL Web App Google Sheets Anda
  const SCRIPT_URL = 'const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzbV1atTo6IsVdJRmUIsRT5QnLds8TF-epxV7geR6Slo57c5HQ5z8lof3ZeEKbyr2FL/exec';

  let chart;

  function countScores() {
    const counts = { Rationalizing: 0, Asserting: 0, Negotiating: 0, Inspiring: 0, Bridging: 0 };
    for (const [label, nums] of Object.entries(groups)) {
      counts[label] = nums.reduce((acc, n) => acc + (document.getElementById(`q${n}`).checked ? 1 : 0), 0);
    }
    return counts;
  }

  function updateCounters(counts) {
    document.getElementById('sRationalizing').textContent = counts.Rationalizing;
    document.getElementById('sAsserting').textContent = counts.Asserting;
    document.getElementById('sNegotiating').textContent = counts.Negotiating;
    document.getElementById('sInspiring').textContent = counts.Inspiring;
    document.getElementById('sBridging').textContent = counts.Bridging;
  }

  function renderChart(counts) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    const data = [
      counts.Rationalizing, counts.Asserting, counts.Negotiating, counts.Inspiring, counts.Bridging
    ];

    if (chart) {
      chart.destroy();
    }
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
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const counts = countScores();
    const fullName = document.getElementById('fullName').value;

    updateCounters(counts);
    renderChart(counts);
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth' });

    // Kirim data ke Google Sheets
    try {
      const data = {
        fullName: fullName,
        Rationalizing: counts.Rationalizing,
        Asserting: counts.Asserting,
        Negotiating: counts.Negotiating,
        Inspiring: counts.Inspiring,
        Bridging: counts.Bridging
      };

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Penting untuk mengirim data ke Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('Data berhasil dikirim ke Google Sheets.');
    } catch (error) {
      console.error('Error saat mengirim data:', error);
    }
  });

  btnReset.addEventListener('click', () => {
    form.reset();
    if (chart) {
      chart.destroy();
    }
    result.classList.add('hidden');
  });
})();
