// public/js/app.js (Final, Corrected Version)

document.addEventListener('DOMContentLoaded', () => {
    // --- Get all HTML elements ---
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    const startBtn = document.getElementById('start-btn');
    const quizForm = document.getElementById('quiz-form');
    const resultsText = document.getElementById('results-text');
    const restartBtn = document.getElementById('restart-btn');
    const topicInput = document.getElementById('topic-input');
    const usernameInput = document.getElementById('username-input');
    const errorMsg = document.getElementById('error-message');

    let quizData = null; // To store the questions
    let currentTopic = ''; // To store the current topic

    // --- EVENT LISTENERS ---

    startBtn.addEventListener('click', fetchAndShowQuiz);

    // This is the listener for the submit button
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault(); // This is crucial to stop the page from reloading
        calculateAndShowResults();
    });

    restartBtn.addEventListener('click', () => {
        resultsScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        quizForm.innerHTML = '';
        topicInput.value = ''; // Clear the topic input for the next quiz
    });

    // --- FUNCTIONS ---

    async function fetchAndShowQuiz() {
        currentTopic = topicInput.value.trim();
        if (currentTopic === '' || usernameInput.value.trim() === '') {
            errorMsg.textContent = 'Please enter your name and a topic.';
            errorMsg.classList.remove('hidden');
            return;
        }
        errorMsg.classList.add('hidden');

        try {
            startScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');
            quizForm.innerHTML = `<p>Generating your quiz on "${currentTopic}" with AI...</p>`;

            const response = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: currentTopic })
            });
            if (!response.ok) throw new Error('Failed to fetch quiz from the server.');

            quizData = await response.json();
            if (quizData.questions.length === 0) {
                 throw new Error('The AI could not generate a quiz for this topic. Please try a different one.');
            }
            displayQuiz(quizData.questions);
        } catch (error) {
            console.error("Error fetching quiz:", error);
            startScreen.classList.remove('hidden');
            quizScreen.classList.add('hidden');
            errorMsg.textContent = error.message;
            errorMsg.classList.remove('hidden');
        }
    }

    function displayQuiz(questions) {
        quizForm.innerHTML = '';
        questions.forEach((q, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question-block');
            let questionHTML = `<p class="question-text">${index + 1}. ${q.questionText}</p><div class="options">`;
            q.options.forEach(option => {
                questionHTML += `<label><input type="radio" name="question${index}" value="${option}" required> ${option}</label>`;
            });
            questionHTML += `</div>`;
            questionElement.innerHTML = questionHTML;
            quizForm.appendChild(questionElement);
        });
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit Answers';
        quizForm.appendChild(submitButton);
    }

    async function calculateAndShowResults() {
        let score = 0;
        const totalQuestions = quizData.questions.length;
        const formData = new FormData(quizForm);
        const username = usernameInput.value.trim() || 'Guest';

        quizData.questions.forEach((q, index) => {
            if (formData.get(`question${index}`) === q.correctAnswer) {
                score++;
            }
        });

        resultsText.textContent = "Saving your score...";
        quizScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');

        try {
            const submissionPayload = { username, topic: currentTopic, score, totalQuestions };
            const response = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionPayload)
            });
            if (!response.ok) throw new Error("Couldn't save your score.");

            const result = await response.json();
            let resultHTML = `You scored ${score} out of ${totalQuestions}!<br>`;
            resultHTML += `You earned ${result.pointsEarned} points. Your total is now ${result.totalPoints}.<br>`;
            if (result.streak > 1) {
                resultHTML += `You're on a ${result.streak}-day streak! 🔥<br>`;
            }
            if (result.newBadges && result.newBadges.length > 0) {
                resultHTML += `🎉 Badge Unlocked: ${result.newBadges.join(', ')}! 🎉`;
            }
            resultsText.innerHTML = resultHTML;
        } catch (error) {
            console.error("Error submitting score:", error);
            resultsText.textContent = `You scored ${score} out of ${totalQuestions}, but we couldn't save your score.`;
        }
    }
});