const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {join} = require("path");
const authMiddleware = require("../middlewares/authMiddleware");

router.get('/voting', authMiddleware.checkAuth, (req, res) => {
    res.sendFile('voting.html', { root: join(__dirname, '../views') });
})

router.post('/voting', authMiddleware.checkAuth, async (req, res) => {
    const { candidateId, voterAddress } = req.body;

    try {
        // Retrieve the logged-in user's ID from the session
        const userId = req.session.user ? req.session.user.id : null;

        if (!userId) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        // Fetch the current election
        const [election] = await db.promise().query('SELECT id FROM election WHERE phase = "voting" LIMIT 1');

        if (election.length === 0) {
            return res.status(400).json({ message: 'No active election found' });
        }

        const electionId = election[0].id;

        // First, validate if the logged-in user has a valid metamask address and NID
        const [voter] = await db.promise().query(
            'SELECT * FROM users WHERE id = ? AND metamask_address IS NOT NULL AND NID IS NOT NULL',
            [userId]
        );

        if (voter.length === 0) {
            return res.status(400).json({ message: 'Your wallet address or ID number is not registered in the system. Please register first.' });
        }

        // After validating the user, check if they have already voted in this election
        const [existingVote] = await db.promise().query(
            'SELECT * FROM voting_result WHERE voter_address = ? AND election_id = ?',
            [voterAddress, electionId]
        );

        if (existingVote.length > 0) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }

        // Save the vote in the database
        await db.promise().query(
            'INSERT INTO voting_result (election_id, candidate_id, voter_address) VALUES (?, ?, ?)',
            [electionId, candidateId, voterAddress]
        );

        res.status(200).json({ message: 'Vote recorded in the database' });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// GET route to fetch candidates for the current active election
router.get('/voting/current-election-candidates', async (req, res) => {
    try {
        // Step 1: Fetch the current election where phase is 'voting'
        const [election] = await db.promise().query('SELECT id FROM election WHERE phase = "voting" LIMIT 1');

        if (election.length === 0) {
            return res.status(204).json({ message: 'No active election found' });
        }

        const electionId = election[0].id;

        // Step 2: Fetch candidates for the current election
        const [candidates] = await db.promise().query(`
            SELECT c.id, c.name, c.party 
            FROM candidates c
            JOIN candidate_election ce ON c.id = ce.candidate_id
            WHERE ce.election_id = ?
        `, [electionId]);

        // Step 3: Send the list of candidates as the response
        res.status(200).json(candidates);

    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
