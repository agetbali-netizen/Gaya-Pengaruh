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
  const btnSubmit = document.getElementById('btnSubmit');
  const btnSendToSheet = document.getElementById('btnSendToSheet');

  // URL Web App Google Sheets untuk menyimpan data
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzbV1atTo6IsVdJRmUIsRT5QnLds8TF-epxV7geR6Slo57c5HQ5z8lof3ZeEKbyr2FL/exec';
  // URL Web App Google Sheets untuk mengirim email (Anda harus membuatnya)
  const SCRIPT_URL_EMAIL = 'https://script.google.com/macros/s/AKfycbzgWQW3eLghUWfLcxdaSB20yNXWbtcU8a-uAtGwE7-wP230lvLqW_pTvNDgMcIma2eL1w/exec';

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const counts = countScores();
    updateCounters(counts);
    renderChart(counts);
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth' });
  });

  btnSendToSheet.addEventListener('click', async () => {
    btnSendToSheet.disabled = true;

    const counts = countScores();
    const fullName = document.getElementById('fullName').value;

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('Rationalizing', counts.Rationalizing);
    formData.append('Asserting', counts.Asserting);
    formData.append('Negotiating', counts.Negotiating);
    formData.append('Inspiring', counts.Inspiring);
    formData.append('Bridging', counts.Bridging);

    try {
      // Kirim data ke Google Sheets
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData
      });
      console.log('Data berhasil dikirim ke Google Sheets.');

      // Kirim data sebagai email
      await fetch(SCRIPT_URL_EMAIL, {
        method: 'POST',
        body: formData
      });
      console.log('Email berhasil dikirim.');

      alert('Data Anda telah berhasil dikirim!');
    } catch (error) {
      console.error('Error saat mengirim data:', error);
      alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
    } finally {
      btnSendToSheet.disabled = false;
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
