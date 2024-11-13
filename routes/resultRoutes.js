const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {checkAuth} = require("../middlewares/authMiddleware");
const {join} = require("path");  // Your database configuration

router.get('/results', checkAuth, (req, res) => {
    res.sendFile('results.html', { root: join(__dirname, '../views') });
})

// Route to get election results for voters
router.get('/election-results', async (req, res) => {
    try {
        const currentDate = new Date();  // Get the current date

        // Fetch all ongoing elections (current elections where the end_date hasn't passed)
        const [currentElections] = await db.promise().query(`
            SELECT id, name 
            FROM election 
            WHERE end_date > ?
        `, [currentDate]);

        // Fetch all past elections (where end_date has passed)
        const [pastElections] = await db.promise().query(`
            SELECT id, name 
            FROM election 
            WHERE end_date <= ?
        `, [currentDate]);

        let currentElectionResults = [];
        let pastElectionResults = [];

        // Loop through current elections and fetch results
        for (let election of currentElections) {
            const [candidates] = await db.promise().query(`
                SELECT c.id, c.name, c.party, c.qualification
                FROM candidates c 
                JOIN candidate_election ce ON c.id = ce.candidate_id 
                WHERE ce.election_id = ?
            `, [election.id]);

            let candidatesWithVotes = [];

            for (let candidate of candidates) {
                const [votes] = await db.promise().query(`
                    SELECT COUNT(voter_address) as voteCount 
                    FROM voting_result 
                    WHERE candidate_id = ? AND election_id = ?
                `, [candidate.id, election.id]);

                candidatesWithVotes.push({
                    candidateName: candidate.name,
                    candidateParty: candidate.party,
                    candidateQualification: candidate.qualification,
                    voteCount: votes[0].voteCount
                });
            }

            currentElectionResults.push({
                electionName: election.name,
                candidates: candidatesWithVotes
            });
        }

        // Loop through past elections and fetch results
        for (let election of pastElections) {
            const [candidates] = await db.promise().query(`
                SELECT c.id, c.name, c.party, c.qualification
                FROM candidates c 
                JOIN candidate_election ce ON c.id = ce.candidate_id 
                WHERE ce.election_id = ?
            `, [election.id]);

            let candidatesWithVotes = [];

            for (let candidate of candidates) {
                const [votes] = await db.promise().query(`
                    SELECT COUNT(voter_address) as voteCount 
                    FROM voting_result 
                    WHERE candidate_id = ? AND election_id = ?
                `, [candidate.id, election.id]);

                candidatesWithVotes.push({
                    candidateName: candidate.name,
                    candidateParty: candidate.party,
                    candidateQualification: candidate.qualification,
                    voteCount: votes[0].voteCount
                });
            }

            pastElectionResults.push({
                electionName: election.name,
                candidates: candidatesWithVotes
            });
        }

        res.json({
            currentElectionResults,
            pastElectionResults
        });
    } catch (error) {
        console.error('Error fetching election results:', error);
        res.status(500).json({ message: 'Server error fetching election results' });
    }
});

module.exports = router;
