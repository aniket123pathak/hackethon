

const { generateQuizFromWorqHat } = require('../config/worqhat.js');

const generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;
    console.log(topic)
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required in the request body' });
    }

    console.log(`Received request to generate quiz for topic: ${topic}`);
    const quizData = await generateQuizFromWorqHat(topic);
    res.status(200).json(quizData);

  } catch (error) {
    console.error("Error in generateQuiz controller:", error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
};

module.exports = {
  generateQuiz
};

