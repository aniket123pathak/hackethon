// START OF routes/quizRoutes.js

const express = require('express');
const { generateQuiz } = require('../controllers/quizController.js');

const router = express.Router();

// This route will handle POST requests to /api/quiz/generate
// It is used by Person 1 (Backend) and Person 2 (Frontend).
router.post('/generate', generateQuiz);

// Person 3 (Data & Gamification) will add the '/submit' route to this file later.
// For example:
// const { handleSubmitQuiz } = require('../controllers/gamifyController');
// router.post('/submit', handleSubmitQuiz);


// This is the last line of the file.
module.exports = router;

// END OF routes/quizRoutes.js