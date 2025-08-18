// ===================================================================================
//  STEP 3: THE "PHONE CALL" TO THE BACKEND TO GET QUESTIONS
// ===================================================================================
// This function makes a network request to your backend's API endpoint.
async function fetchQuiz(topic) {
    console.log(`Fetching quiz for topic: ${topic}`);

    // --- REAL CODE IS NOW LIVE ---
    try {
        const response = await fetch('/api/quiz/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic })
        });
        if (!response.ok) { // Check if the server responded with an error
            throw new Error(`Server error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch quiz:", error);
        alert("Could not load the quiz. Please try again later.");
    }
}

// public/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Get references to all the HTML elements we'll need
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    const startBtn = document.getElementById('start-btn');
    const quizForm = document.getElementById('quiz-form');
    const resultsText = document.getElementById('results-text');
    const restartBtn = document.getElementById('restart-btn');

    let quizData = null; // To store the questions fetched from the API

    // --- EVENT LISTENERS ---
    startBtn.addEventListener('click', () => {
        fetchAndShowQuiz();
    });

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        calculateAndShowResults();
    });

    restartBtn.addEventListener('click', () => {
        resultsScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        quizForm.innerHTML = '';
    });

    // --- FUNCTIONS ---
    async function fetchAndShowQuiz() {
        try {
            startScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');
            quizForm.innerHTML = '<p>Generating your quiz with AI...</p>';

            const response = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: 'Beginner Python' })
            });

            if (!response.ok) throw new Error('Failed to fetch quiz.');

            quizData = await response.json();
            displayQuiz(quizData.questions);

        } catch (error) {
            console.error("Error fetching quiz:", error);
            quizForm.innerHTML = `<p class="error">Sorry, we couldn't generate a quiz right now.</p>`;
        }
    }

    function displayQuiz(questions) {
        quizForm.innerHTML = ''; 

        questions.forEach((q, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question-block');

            let questionHTML = `<p class="question-text">${index + 1}. ${q.questionText}</p>`;
            
            questionHTML += `<div class="options">`;
            q.options.forEach(option => {
                questionHTML += `
                    <label>
                        <input type="radio" name="question${index}" value="${option}" required>
                        ${option}
                    </label>
                `;
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

    function calculateAndShowResults() {
        let score = 0;
        const totalQuestions = quizData.questions.length;
        const formData = new FormData(quizForm);

        quizData.questions.forEach((q, index) => {
            const userAnswer = formData.get(`question${index}`);
            if (userAnswer === q.correctAnswer) {
                score++;
            }
        });

        resultsText.textContent = `You scored ${score} out of ${totalQuestions}!`;
        quizScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
    }
});