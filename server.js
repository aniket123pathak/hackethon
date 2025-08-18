// server.js (Updated for Frontend)
require('dotenv').config();
const express = require('express');
const quizRoutes = require('./routes/quizRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const app = express();
const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use('/api/quiz', quizRoutes);

app.get('/quiz', (req, res) => {
  res.render('quiz', { title: 'AI Quiz' });
});


app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'My Dashboard' }); // This will render views/dashboard.ejs
});

// ... (the rest of the file)

app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Open the quiz at http://localhost:${PORT}/quiz`);
});