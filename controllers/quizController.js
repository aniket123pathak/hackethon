// START OF controllers/quizController.js

const { generateQuizFromWorqHat } = require('../config/worqhat.js');

const generateQuiz = async (req, res) => {
  try {
    // Get the topic from the JSON body of the POST request
    const { topic } = req.body;
    console.log(topic)
    // Basic validation to ensure a topic was sent
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required in the request body' });
    }

    console.log(`Received request to generate quiz for topic: ${topic}`);

    // Call the main function that interacts with the WorqHat API
    const quizData = await generateQuizFromWorqHat(topic);

    // Send the formatted quiz data back to the frontend
    res.status(200).json(quizData);

  } catch (error) {
    // Generic error handler for any unexpected issues
    console.error("Error in generateQuiz controller:", error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
};

// This is the last line of the file.
module.exports = {
  generateQuiz
};

// END OF controllers/quizController.js