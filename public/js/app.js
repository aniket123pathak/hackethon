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