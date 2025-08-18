// controllers/userController.js
const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');

exports.getUserProfile = async (req, res) => {
    try {
        const { username } = req.params; // Get username from URL parameter
        const dbRaw = await fs.readFile(dbPath, 'utf-8');
        const db = JSON.parse(dbRaw);

        if (db.users[username]) {
            res.status(200).json(db.users[username]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        res.status(500).json({ error: 'Failed to get user profile.' });
    }
};