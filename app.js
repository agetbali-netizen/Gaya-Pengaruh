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

  // URL Web App Google Apps Script
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxw06ITHAYWQo20w0YFSEnGxWZi1IHiiQ1Gp8vgPiYsJ8e5XleX-4JPj0ZAJQEC19cqwg/exec';

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

  btnSendToSheet.addEventListener('click', () => {
    btnSendToSheet.disabled = true;

    const counts = countScores();
    const fullName = document.getElementById('fullName').value;

    const dataToSend = {
      fullName: fullName,
      Rationalizing: counts.Rationalizing,
      Asserting: counts.Asserting,
      Negotiating: counts.Negotiating,
      Inspiring: counts.Inspiring,
      Bridging: counts.Bridging
    };

    // Fungsi untuk mengirim data menggunakan formulir tersembunyi
    function sendData(url, data) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.target = '_blank'; // Buka di tab baru agar halaman tidak dimuat ulang
      form.style.display = 'none';

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data[key];
          form.appendChild(input);
        }
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    }

    sendData(SCRIPT_URL, dataToSend);

    alert('Data Anda telah berhasil dikirim ke Spreadsheet! Silakan periksa tab baru.');
    btnSendToSheet.disabled = false;
  });

  btnReset.addEventListener('click', () => {
    form.reset();
    if (chart) {
      chart.destroy();
    }
    result.classList.add('hidden');
  });
})();
