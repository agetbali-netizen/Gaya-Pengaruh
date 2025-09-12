document.getElementById('influenceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let scores = [0, 0, 0, 0, 0]; // [Rationalizing, Negotiating, Asserting, Bridging, Inspiring]
    let answers = [
        {id: 'q1', category: 0}, // Rationalizing
        {id: 'q2', category: 0}, // Rationalizing
        {id: 'q3', category: 3}, // Asserting
        {id: 'q4', category: 3}, // Asserting
        {id: 'q5', category: 3}, // Asserting
        {id: 'q6', category: 4}, // Inspiring
        {id: 'q7', category: 4}, // Inspiring
        {id: 'q8', category: 2}, // Negotiating
        {id: 'q9', category: 2}, // Negotiating
        {id: 'q10', category: 4}, // Inspiring
        {id: 'q11', category: 1}, // Rationalizing
        {id: 'q12', category: 1}, // Rationalizing
        {id: 'q13', category: 2}, // Negotiating
        {id: 'q14', category: 2}, // Negotiating
        {id: 'q15', category: 1}  // Rationalizing
    ];

    answers.forEach((answer) => {
        let checkbox = document.getElementById(answer.id);
        if (checkbox.checked) {
            scores[answer.category]++;
        }
    });

    // Prepare the radar chart
    let ctx = document.getElementById('influenceChart').getContext('2d');
    let chartData = {
        labels: ['Rationalizing', 'Negotiating', 'Asserting', 'Bridging', 'Inspiring'],
        datasets: [{
            label: 'Gaya Mempengaruhi',
            data: scores,
            fill: true,
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderColor: 'rgba(0, 123, 255, 1)',
            pointBackgroundColor: 'rgba(0, 123, 255, 1)',
            pointBorderColor: '#fff'
        }]
    };

    new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: {
            scales: {
                r: {
                    min: 0,
                    max: 15,
                    stepSize: 1
                }
            }
        }
    });
});
