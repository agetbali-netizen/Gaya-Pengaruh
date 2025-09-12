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
  const downloadLink = document.getElementById('downloadPng');
  const btnExportPdf = document.getElementById('exportPdf');

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

  function exportToPDF(counts) {
    const fullName = document.getElementById('fullName').value; // Get the full name
    const doc = new jsPDF();
    doc.text('Hasil Gaya Mempengaruhi', 20, 10);
    doc.text(`Nama Lengkap: ${fullName}`, 20, 20); // Add full name to the PDF
    doc.text(`Rationalizing: ${counts.Rationalizing}`, 20, 30);
    doc.text(`Asserting: ${counts.Asserting}`, 20, 40);
    doc.text(`Negotiating: ${counts.Negotiating}`, 20, 50);
    doc.text(`Inspiring: ${counts.Inspiring}`, 20, 60);
    doc.text(`Bridging: ${counts.Bridging}`, 20, 70);
    doc.addImage(chart.toBase64Image(), 'PNG', 20, 80, 170, 120);
    doc.save('hasil-gaya-mempengaruhi.pdf');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const counts = countScores();
    updateCounters(counts);
    renderChart(counts);
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth' });
  });

  btnReset.addEventListener('click', () => {
    form.reset();
    if (chart) chart.destroy();
    result.classList.add('hidden');
  });

  btnExportPdf.addEventListener('click', () => {
    const counts = countScores();
    exportToPDF(counts); 
  });
})();