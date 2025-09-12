(() => {
  const form = document.getElementById('formGM');
  const result = document.getElementById('result');
  const btnReset = document.getElementById('btnReset');
  const btnSubmit = document.getElementById('btnSubmit');
  const btnSendToSheet = document.getElementById('btnSendToSheet');

  // PASTE URL WEB APP ANDA DI SINI
  const SCRIPT_URL = 'https://docs.google.com/spreadsheets/d/1iQAb1--YlQjPrn0TtZChManPDA8ONFOwiT_mhiQoJvA/edit?gid=0#gid=0';

  let chart;

  function countScores() {
    const counts = { Rationalizing: 0, Asserting: 0, Negotiating: 0, Inspiring: 0, Bridging: 0 };
    const groups = {
      Rationalizing: [1, 2, 3],
      Asserting: [4, 5, 6],
      Negotiating: [7, 8, 9],
      Inspiring: [10, 11, 12],
      Bridging: [13, 14, 15]
    };
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
    
    const fullName = document.getElementById('fullName').value;
    const dataToSend = {
      fullName: fullName
    };

    for (let i = 1; i <= 15; i++) {
      const qId = `q${i}`;
      dataToSend[qId] = document.getElementById(qId).checked ? 1 : 0;
    }

    function sendData(url, data) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.target = '_blank';
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
