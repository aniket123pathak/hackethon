// controllers/gamifyController.js
const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db.json');

// --- Define our Gamification Rules ---
const BADGES = [
    { name: "Curious Mind", points: 100 },
    { name: "Quick Learner", points: 500 },
    { name: "Topic Explorer", points: 1000 },
    { name: "Knowledge Master", points: 2500 }
];

// Helper function to check if two dates are on consecutive days
function areConsecutiveDays(dateStr1, dateStr2) {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    // Set both to the start of their day
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diff = d2.getTime() - d1.getTime();
    return diff === 24 * 60 * 60 * 1000; // Difference is exactly one day
}

exports.handleSubmitQuiz = async (req, res) => {
    try {
        const { username, topic, score, totalQuestions } = req.body;
        if (!username || !topic || score === undefined || !totalQuestions) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const dbRaw = await fs.readFile(dbPath, 'utf-8');
        const db = JSON.parse(dbRaw);
        const now = new Date();

        // Initialize user if they don't exist
        if (!db.users[username]) {
            db.users[username] = {
                totalPoints: 0,
                badges: [],
                streak: 0,
                lastPlayed: null
            };
        }

        const user = db.users[username];
        const pointsEarned = score * 10;
        user.totalPoints += pointsEarned;

        // --- Streak Logic ---
        if (user.lastPlayed && areConsecutiveDays(user.lastPlayed, now.toISOString())) {
            user.streak += 1; // It's a consecutive day, increase streak
        } else {
            user.streak = 1; // Not a consecutive day, reset streak to 1
        }
        user.lastPlayed = now.toISOString();

        // --- Badge Logic ---
        const newBadgesEarned = [];
        BADGES.forEach(badge => {
            // If user has enough points and doesn't already have the badge
            if (user.totalPoints >= badge.points && !user.badges.includes(badge.name)) {
                user.badges.push(badge.name);
                newBadgesEarned.push(badge.name);
            }
        });
        
        // Add to history
        db.quizHistory.push({ username, topic, score, totalQuestions, pointsEarned, takenAt: now.toISOString() });

        await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

        res.status(200).json({
            message: `Score saved for ${username}!`,
            pointsEarned,
            totalPoints: user.totalPoints,
            streak: user.streak,
            newBadges: newBadgesEarned // Send back any new badges
        });

    } catch (error) {
        console.error("Error in handleSubmitQuiz:", error);
        res.status(500).json({ error: 'Failed to save quiz results.' });
    }
};