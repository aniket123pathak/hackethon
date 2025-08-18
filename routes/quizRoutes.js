
const express = require('express');
const { generateQuiz } = require('../controllers/quizController');
const { handleSubmitQuiz } = require('../controllers/gamifyController'); // <-- ADD THIS LINE

const router = express.Router();

// Route for Person 1 & 2
router.post('/generate', generateQuiz);

// Route for Person 3
router.post('/submit', handleSubmitQuiz); // <-- ADD THIS LINE

module.exports = router;