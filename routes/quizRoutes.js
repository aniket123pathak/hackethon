// routes/quizRoutes.js
const express = require('express');
const { generateQuiz } = require('../controllers/quizController');
const { handleSubmitQuiz } = require('../controllers/gamifyController');

// RENAMED from 'router' to 'quizRouter' for clarity
const quizRouter = express.Router();

// Route for Person 1 & 2
quizRouter.post('/generate', generateQuiz);

// Route for Person 3
quizRouter.post('/submit', handleSubmitQuiz);

// Exporting the new variable name
module.exports = quizRouter;