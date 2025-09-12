// Menambahkan jsPDF untuk export ke PDF
const jsPDF = window.jspdf.jsPDF;

(() => {
  // Mapping pertanyaan -> kategori
  // Kategori: [Rationalizing, Asserting, Negotiating, Inspiring, Bridging]
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

  // Count Scores based on user inputs
  function countScores() {
    const counts = { Rationalizing: 0, Asserting: 0, Negotiating: 0, Inspiring: 0, Bridging: 0 };
    for (const [label, nums] of Object.entries(groups)) {
      counts[label] = nums.reduce((acc, n) => acc + (document.getElementById(`q${n}`).checked ? 1 : 0), 0);
    }
    return counts;
  }

  // Update counters on the result section
  function updateCounters(counts) {
    document.getElementById('sRationalizing').textContent = counts.Rationalizing;
    document.getElementById('sAsserting').textContent = counts.Asserting;
    document.getElementById('sNegotiating').textContent = counts.Negotiating;
    document.getElementById('sInspiring').textContent = counts.Inspiring;
    document.getElementById('sBridging').textContent = counts.Bridging;
  }

  // Render the Radar Chart with Chart.js
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
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: { r: { min: 0, max: 3, ticks: { stepSize: 1 } } },
        plugins: { legend: { display: false } }
      }
    });

    // Set download link to PNG dataURL
    setTimeout(() => {
      downloadLink.href = chart.toBase64Image();
    }, 300);
  }

  // Export to PDF functionality using jsPDF
  function exportToPDF(counts) {
    const doc = new jsPDF();
    doc.text('Hasil Gaya Mempengaruhi', 20, 10);
    doc.text(`Rationalizing: ${counts.Rationalizing}`, 20, 20);
    doc.text(`Asserting: ${counts.Asserting}`, 20, 30);
    doc.text(`Negotiating: ${counts.Negotiating}`, 20, 40);
    doc.text(`Inspiring: ${counts.Inspiring}`, 20, 50);
    doc.text(`Bridging: ${counts.Bridging}`, 20, 60);
    doc.addImage(chart.toBase64Image(), 'PNG', 20, 70, 170, 120);
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

  // Fitur export PDF
  btnExportPdf.addEventListener('click', () => {
    const counts = countScores();
    exportToPDF(counts); // Trigger PDF Export
  });
})();
