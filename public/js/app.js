// ===================================================================================
//  STEP 3: THE "PHONE CALL" TO THE BACKEND TO GET QUESTIONS
// ===================================================================================


// This function makes a network request to your backend's API endpoint.
const topicInput = document.getElementById('topic-input');

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
    // public/js/app.js

    // ... (keep all the other code) ...

    // Fetches quiz data from our backend and displays it
    async function fetchAndShowQuiz() {
        const topic = topicInput.value.trim(); // Get the topic from the input box
        const errorMsg = document.getElementById('error-message');

        // Check if the user actually typed something
        if (topic === '') {
            errorMsg.textContent = 'Please enter a topic.';
            errorMsg.classList.remove('hidden');
            return; // Stop the function if there's no topic
        }
        
        errorMsg.classList.add('hidden'); // Hide any previous errors

        try {
            // Show a loading message
            startScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');
            quizForm.innerHTML = `<p>Generating your quiz on "${topic}" with AI...</p>`;

            const response = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic }) // <-- Send the user's topic
            });

            if (!response.ok) {
                throw new Error('Failed to fetch quiz from the server.');
            }

            quizData = await response.json();

            // Check if the AI returned any questions
            if (quizData.questions.length === 0) {
                 throw new Error('The AI could not generate a quiz for this topic. Please try a different one.');
            }

            displayQuiz(quizData.questions);

        } catch (error) {
            console.error("Error fetching quiz:", error);
            // Go back to the start screen to show the error
            startScreen.classList.remove('hidden');
            quizScreen.classList.add('hidden');
            errorMsg.textContent = error.message;
            errorMsg.classList.remove('hidden');
        }
    }

    // ... (the rest of your functions are perfect, no changes needed) ...
    

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

    // public/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (keep the other element references)
    const usernameInput = document.getElementById('username-input'); // <-- ADD THIS LINE
    let currentTopic = ''; // To store the topic of the current quiz

    // ... (keep the event listeners)

    // In your fetchAndShowQuiz function, add this line right at the top
    async function fetchAndShowQuiz() {
        currentTopic = topicInput.value.trim(); // <-- ADD THIS LINE to save the topic
        // ... (the rest of the function is the same)
    }

    // Replace the old calculateAndShowResults function with this new one
    // public/js/app.js

    // ... (keep the rest of your JS code)

    async function calculateAndShowResults() {
        // ... (the top part of the function calculating the score is the same)
        let score = 0;
        const totalQuestions = quizData.questions.length;
        const formData = new FormData(quizForm);
        const username = usernameInput.value.trim() || 'Guest';

        quizData.questions.forEach((q, index) => {
            const userAnswer = formData.get(`question${index}`);
            if (userAnswer === q.correctAnswer) {
                score++;
            }
        });
        
        resultsText.textContent = "Submitting your score...";
        quizScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');

        try {
            const submissionPayload = { username, topic: currentTopic, score, totalQuestions };

            const response = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionPayload)
            });

            if (!response.ok) throw new Error('Failed to save score.');

            const result = await response.json();

            // --- NEW DISPLAY LOGIC ---
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
});