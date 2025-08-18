// routes/userRoutes.js
const express = require('express');
const { getUserProfile, getUserHistory } = require('../controllers/userController');

// RENAMED from 'router' to 'userRouter' for clarity
const userRouter = express.Router();

userRouter.get('/:username', getUserProfile);
userRouter.get('/history/:username', getUserHistory);

// Exporting the new variable name
module.exports = userRouter;