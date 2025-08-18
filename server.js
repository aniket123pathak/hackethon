// server.js (Updated for Frontend)
require('dotenv').config();
const express = require('express');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// NEW -- Tell Express to use EJS for views
app.set('view engine', 'ejs');
// NEW -- Tell Express to serve static files (like CSS and JS) from the 'public' folder
app.use(express.static('public'));

app.use(express.json());

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static('public'));
// API Routes
// All routes defined in quizRoutes will be prefixed with /api/quiz

app.use('/api/quiz', quizRoutes);

// NEW -- Create a route to render our quiz page
app.get('/quiz', (req, res) => {
  res.render('quiz', { title: 'AI Quiz' }); // This will render views/quiz.ejs
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Open the quiz at http://localhost:${PORT}/quiz`);
});