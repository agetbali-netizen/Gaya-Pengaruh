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
    console.log("Counts:", counts); // Debugging: Log all counts
    return counts;
  }

  // Function to update the score display
  function updateCounters(counts) {
    document.getElementById('sRationalizing').textContent = counts.Rationalizing;
    document.getElementById('sAsserting').textContent = counts.Asserting;
    document.getElementById('sNegotiating').textContent = counts.Negotiating;
    document.getElementById('sInspiring').
