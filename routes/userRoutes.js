
// routes/userRoutes.js
const express = require('express');
const { getUserProfile } = require('../controllers/userController.js');
const router = express.Router();

router.get('/:username', getUserProfile);

module.exports = router;