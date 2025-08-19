// public/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const username = prompt("Please enter your username to see your report:");

    if (username) {
        fetchUserReport(username);
        document.getElementById('dashboard-username').textContent = `For ${username}`;
    } else {
        document.querySelector('.container').innerHTML = '<h1>Please provide a username to view a report.</h1>';
    }
});

async function fetchUserReport(username) {
    try {
        const response = await fetch(`/api/user/${username}`);
        if (!response.ok) {
            throw new Error('User not found. Have you taken a quiz yet?');
        }
        const userData = await response.json();
        const quizHistoryResponse = await fetch(`/api/history/${username}`);
        const quizHistory = await quizHistoryResponse.json();

        document.getElementById('total-points').textContent = userData.totalPoints;
        document.getElementById('current-streak').textContent = `${userData.streak} days 🔥`;
        document.getElementById('badges-earned').textContent = userData.badges.length > 0 ? userData.badges.join(', ') : 'None yet!';

        renderPerformanceChart(quizHistory);

    } catch (error) {
        document.querySelector('.container').innerHTML = `<h1>Error: ${error.message}</h1>`;
        console.error("Failed to fetch user report:", error);
    }
}

function renderPerformanceChart(quizHistory) {
    const ctx = document.getElementById('performance-chart').getContext('2d');
    const recentQuizzes = quizHistory.slice(-5);
    const labels = recentQuizzes.map(quiz => quiz.topic);
    const scores = recentQuizzes.map(quiz => (quiz.score / quiz.totalQuestions) * 100);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score (%)',
                data: scores,
                backgroundColor: 'rgba(187, 134, 252, 0.6)',
                borderColor: 'rgba(187, 134, 252, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}
