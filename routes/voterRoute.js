const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');
const { join } = require('path');

// GET route to serve the Voter Registration page
router.get('/voter', authMiddleware.checkAuth, (req, res) => {
    // Serve the voterRegistration.html file
    res.sendFile('voterRegistration.html', { root: join(__dirname, '../views') });
});

// API endpoint to check if the voter is registered
router.get('/voter/status', authMiddleware.checkAuth, async (req, res) => {
    const userId = req.session.user ? req.session.user.id : null;

    if (!userId) {
        return res.status(403).json({ message: 'User not authenticated' });
    }

    try {
        // Fetch user details (NID and metamask_address) from the database
        const [user] = await db.promise().query('SELECT NID, metamask_address FROM users WHERE id = ?', [userId]);

        // Check if the user is registered
        if (user.length > 0 && user[0].NID && user[0].metamask_address) {
            // If voter is registered, send their details to the frontend
            return res.json({ registered: true, voterDetails: user[0] });
        } else {
            // If voter is not registered, send 'registered' as false
            return res.json({ registered: false });
        }
    } catch (error) {
        console.error('Error fetching voter status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// POST route to handle voter registration
router.post('/voter', async (req, res) => {
    const { idCard, walletAddress } = req.body;

    // Retrieve the user ID from the session
    const userId = req.session.user ? req.session.user.id : null;

    if (!idCard || !walletAddress) {
        return res.status(400).json({ message: 'ID card number and wallet address are required.' });
    }

    if (!userId) {
        return res.status(403).json({ message: 'User not authenticated' });
    }

    try {
        // Check if the NID or MetaMask wallet address is already registered for a different user
        const [existingUser] = await db.promise().query(
            'SELECT id FROM users WHERE (NID = ? OR metamask_address = ?) AND id != ?',
            [idCard, walletAddress, userId]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'The ID card number or MetaMask wallet address is already linked to another user.' });
        }

        // Update the user's information in the database using their ID from the session
        await db.promise().query(
            'UPDATE users SET NID = ?, metamask_address = ? WHERE id = ?',
            [idCard, walletAddress, userId]
        );

        res.status(200).json({ message: 'Voter registered successfully' });
    } catch (error) {
        console.error('Error registering voter:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
