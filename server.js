// server.js
require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');
const quizRoutes = require('./routes/quizRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// API Routes
// All routes defined in quizRoutes will be prefixed with /api/quiz
app.use('/api/quiz', quizRoutes);

// A simple base route to check if the server is running
app.get('/', (req, res) => {
  res.send('AI Tutor Hackathon Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});