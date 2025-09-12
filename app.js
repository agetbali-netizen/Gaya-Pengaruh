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

  // Function to count the selected checkboxes
  function countScores() {
    const counts = { Rationalizing: 0, Asserting: 0, Negotiating: 0, Inspiring: 0, Bridging: 0 };
    for (const [label, nums] of Object.entries(groups)) {
      counts[label] = nums.reduce((acc, n) => acc + (document.getElementById(`q${n}`).checked ? 1 : 0), 0);
    }
    return counts;
  }

  // Function to update the score display
  function updateCounters(counts) {
    document.getElementById('sRationalizing').textContent = counts.Rationalizing;
    document.getElementById('sAsserting').textContent = counts.Asserting;
    document.getElementById('sNegotiating').textContent = counts.Negotiating;
    document.getElementById('sInspiring').textContent = counts.Inspiring;
    document.getElementById('sBridging').textContent = counts.Bridging;
  }

  // Function to render the radar chart
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

  // Function to export the results to PDF
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

  // Handle form submission to send data to Google Sheets
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const counts = countScores();
    updateCounters(counts);
    renderChart(counts);
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth' });

    const fullName = document.getElementById('fullName').value;
    const dataToSend = {
      fullName: fullName,
      q1: document.getElementById('q1').checked ? 1 : 0,
      q2: document.getElementById('q2').checked ? 1 : 0,
      q3: document.getElementById('q3').checked ? 1 : 0,
      q4: document.getElementById('q4').checked ? 1 : 0,
      q5: document.getElementById('q5').checked ? 1 : 0,
      q6: document.getElementById('q6').checked ? 1 : 0,
      q7: document.getElementById('q7').checked ? 1 : 0,
      q8: document.getElementById('q8').checked ? 1 : 0,
      q9: document.getElementById('q9').checked ? 1 : 0,
      q10: document.getElementById('q10').checked ? 1 : 0,
      q11: document.getElementById('q11').checked ? 1 : 0,
      q12: document.getElementById('q12').checked ? 1 : 0,
      q13: document.getElementById('q13').checked ? 1 : 0,
      q14: document.getElementById('q14').checked ? 1 : 0,
      q15: document.getElementById('q15').checked ? 1 : 0
    };

    // Send the form data to Google Sheets via Apps Script Web App
    fetch('https://script.google.com/macros/s/AKfycbxehEAd3dOmbtDfR4zrbeEusNqHqRPIB9eCaPsDNpU/dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
    .then(response => response.text())
    .then(result => {
      console.log('Data berhasil dikirim:', result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });

  // Reset the form and chart
  btnReset.addEventListener('click', () => {
    form.reset();
    if (chart) chart.destroy();
    result.classList.add('hidden');
  });

  // Export results to PDF
  btnExportPdf.addEventListener('click', () => {
    const counts = countScores();
    exportToPDF(counts); 
  });
})();
