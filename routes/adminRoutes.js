// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const multer = require('multer');
// const path = require('path');

// const fs = require('fs');
// const uploadDir = path.join(__dirname, '../uploads/candidates/');

// // Create the directory if it doesn't exist
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/candidates/'); // Directory to save images
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// const upload = multer({ storage: storage });



// // GET route to fetch all candidates
// router.get('/admin/candidates', async (req, res) => {
//     try {
//         const [candidates] = await db.promise().query('SELECT id, name, party, age, qualification, photo, partyphoto FROM candidates');
//         res.json(candidates);
//     } catch (error) {
//         console.error('Error fetching candidates:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// GET route to fetch all candidates


// // POST route to add a new candidate
// // router.post('/admin/candidate', async (req, res) => {
// //     const { name, party, age, qualification } = req.body;

// //     try {
// //         await db.promise().query(
// //             'INSERT INTO candidates (name, party, age, qualification) VALUES (?, ?, ?, ?)',
// //             [name, party, age, qualification]
// //         );
// //         res.status(200).json({ message: 'Candidate added successfully' });
// //     } catch (error) {
// //         console.error('Error adding candidate:', error);
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // });


// router.post('/admin/candidate', upload.single('photo'), async (req, res) => {
//     const { name, party, age, qualification } = req.body;
//     const photo = req.file ? `/uploads/candidates/${req.file.filename}` : null;
//     const partyphoto = req.file ? `/uploads/candidates/${req.file.filename}` : null;

//     try {
//         await db.promise().query(
//             'INSERT INTO candidates (name, party, age, qualification, photo, partyphoto) VALUES (?, ?, ?, ?, ?, ?)',
//             [name, party, age, qualification, photo, partyphoto]
//         );
//         res.status(200).json({ message: 'Candidate added successfully' });
//     } catch (error) {
//         console.error('Error adding candidate:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });


const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');





// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/candidates/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save to 'uploads/candidates/'
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

// Routes
// Get all candidates
router.get('/admin/candidates', async (req, res) => {
    try {
        const [candidates] = await db.promise().query(
            'SELECT id, name, party, age, qualification, photo, partyphoto FROM candidates'
        );
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Error fetching candidates.' });
    }
});

router.get('/admin/get_candidates', async (req, res) => {
    try {
        const [candidates] = await db.promise().query('SELECT id, name, party, age, qualification FROM candidates');
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Add new candidate with two file uploads (photo and partyphoto)
router.post('/admin/candidate', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'partyphoto', maxCount: 1 }
]), async (req, res) => {
    const { name, party, age, qualification } = req.body;
    // const photo = req.files?.photo?.[0]?.path || null;
    // const partyphoto = req.files?.partyphoto?.[0]?.path || null;
    
    // const photo = req.file ? `/uploads/candidates/${req.file.filename}` : null;
    //  const partyphoto = req.file ? `/uploads/candidates/${req.file.filename}` : null;

    const photo = req.files?.photo?.[0]
            ? path.join('uploads/candidates', path.basename(req.files.photo[0].path))
            : null;
        const partyphoto = req.files?.partyphoto?.[0]
            ? path.join('uploads/candidates', path.basename(req.files.partyphoto[0].path))
            : null;

    try {
        await db.promise().query(
            'INSERT INTO candidates (name, party, age, qualification, photo, partyphoto) VALUES (?, ?, ?, ?, ?, ?)',
            [name, party, age, qualification, photo, partyphoto]
        );
        res.status(200).json({ message: 'Candidate added successfully!' });
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(500).json({ message: 'Error adding candidate.' });
    }
});

// Other endpoints remain unchanged...

module.exports = router;

// GET route to fetch all voters
router.get('/admin/voters', async (req, res) => {
    try {
        const [voters] = await db.promise().query('SELECT id, name, email, NID, metamask_address, is_active, role FROM users WHERE role = "voter"');
        res.json(voters);
    } catch (error) {
        console.error('Error fetching voters:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE route to delete a voter
router.delete('/admin/voter/:id', async (req, res) => {
    const voterId = req.params.id;

    try {
        // Delete the voter from the database using the voter ID
        const [result] = await db.promise().query('DELETE FROM users WHERE id = ?', [voterId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Voter deleted successfully' });
        } else {
            res.status(404).json({ message: 'Voter not found' });
        }
    } catch (error) {
        console.error('Error deleting voter:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// POST route to add a new voter
router.post('/admin/voter', async (req, res) => {
    const { idCard, walletAddress } = req.body;

    try {
        // Check if the NID or MetaMask wallet address is already registered
        const [existingUser] = await db.promise().query(
            'SELECT id FROM users WHERE NID = ? OR metamask_address = ?',
            [idCard, walletAddress]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'The ID card number or MetaMask wallet address is already linked to another user.' });
        }

        // Insert the new voter into the users table
        await db.promise().query(
            'INSERT INTO users (NID, metamask_address, role) VALUES (?, ?, ?)',
            [idCard, walletAddress, 'voter']  // The role is 'voter'
        );

        res.status(200).json({ message: 'Voter added successfully' });
    } catch (error) {
        console.error('Error adding voter:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET route to fetch all elections
router.get('/admin/elections', async (req, res) => {
    try {
        const [elections] = await db.promise().query('SELECT * FROM election');
        res.json(elections);
    } catch (error) {
        console.error('Error fetching elections:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET route to fetch all elections of phase registration
router.get('/admin/elections-reg', async (req, res) => {
    try {
        const [elections] = await db.promise().query("SELECT * FROM election WHERE phase = 'registration'");
        res.json(elections);
    } catch (error) {
        console.error('Error fetching elections:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// POST route to add a new election
router.post('/admin/election', async (req, res) => {
    const { name, startDate, endDate } = req.body;

    try {
        // Insert the new election into the database
        await db.promise().query(
            'INSERT INTO election (name, start_date, end_date, phase) VALUES (?, ?, ?, ?)',
            [name, startDate, endDate, 'registration']  // Default phase is 'registration'
        );

        res.status(200).json({ message: 'Election added successfully' });
    } catch (error) {
        console.error('Error adding election:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST route to change the phase of a selected election
router.post('/admin/change-phase', async (req, res) => {
    const { electionId, phase } = req.body;

    try {
        // Update the phase of the selected election in the database
        await db.promise().query(
            'UPDATE election SET phase = ? WHERE id = ?',
            [phase, electionId]
        );

        res.status(200).json({ message: 'Election phase changed successfully' });
    } catch (error) {
        console.error('Error changing election phase:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST route to assign a candidate to an election
router.post('/admin/candidate-election', async (req, res) => {
    const { candidateId, electionId } = req.body;

    try {
        // Check if the candidate is already linked to this election
        const [existingLink] = await db.promise().query(
            'SELECT * FROM candidate_election WHERE candidate_id = ? AND election_id = ?',
            [candidateId, electionId]
        );

        if (existingLink.length > 0) {
            return res.status(400).json({ message: 'Candidate is already linked to this election' });
        }

        // Insert the candidate-election link
        await db.promise().query(
            'INSERT INTO candidate_election (candidate_id, election_id) VALUES (?, ?)',
            [candidateId, electionId]
        );

        res.status(200).json({ message: 'Candidate linked to election successfully' });
    } catch (error) {
        console.error('Error linking candidate to election:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET route to fetch candidates linked to a specific election
router.get('/admin/election/:id/candidates', async (req, res) => {
    const electionId = req.params.id;

    try {
        const [candidates] = await db.promise().query(
            `SELECT candidates.* 
             FROM candidates 
             JOIN candidate_election ON candidates.id = candidate_election.candidate_id 
             WHERE candidate_election.election_id = ?`,
            [electionId]
        );
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates for election:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE route to remove a candidate from a specific election
router.delete('/admin/election/:electionId/candidate/:candidateId', async (req, res) => {
    const { electionId, candidateId } = req.params;

    try {
        // Delete the candidate-election link from the database
        const [result] = await db.promise().query(
            'DELETE FROM candidate_election WHERE candidate_id = ? AND election_id = ?',
            [candidateId, electionId]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Candidate removed from election successfully' });
        } else {
            res.status(404).json({ message: 'Candidate not found in this election' });
        }
    } catch (error) {
        console.error('Error removing candidate from election:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE route to delete a candidate from the candidates table
router.delete('/admin/candidate/:id', async (req, res) => {
    const candidateId = req.params.id;

    try {
        // Delete the candidate from the database
        const [result] = await db.promise().query('DELETE FROM candidates WHERE id = ?', [candidateId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Candidate deleted successfully' });
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE route to delete an election and its associated candidate data
router.delete('/admin/election/:id', async (req, res) => {
    const electionId = req.params.id;

    try {
        // First, delete all related candidate-election links
        await db.promise().query('DELETE FROM candidate_election WHERE election_id = ?', [electionId]);

        // Then, delete the election itself
        const [result] = await db.promise().query('DELETE FROM election WHERE id = ?', [electionId]);

        res.status(200).json({ message: 'Election and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting election and related data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to get election results
router.get('/admin/election-results', async (req, res) => {
    try {
        const currentDate = new Date();  // Get current date

        // Fetch all elections that are in the "result" phase (current elections)
        const [currentElections] = await db.promise().query(`
            SELECT id, name
            FROM election
            WHERE phase = 'voting'
        `);

        // Fetch all past elections where the end_date has passed
        const [pastElections] = await db.promise().query(`
            SELECT id, name
            FROM election
            WHERE phase = 'result'
        `,);

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
                `, [candidate.id,election.id]);

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
            let winner = null;
            let maxVotes = 0;

            for (let candidate of candidates) {
                const [votes] = await db.promise().query(`
                    SELECT COUNT(voter_address) as voteCount
                    FROM voting_result
                    WHERE candidate_id = ? AND election_id = ?
                `, [candidate.id, election.id]);

                const voteCount = votes[0].voteCount;

                candidatesWithVotes.push({
                    candidateName: candidate.name,
                    candidateParty: candidate.party,
                    candidateQualification: candidate.qualification,
                    voteCount: voteCount
                });

                // Determine the winner based on the highest vote count
                if (voteCount > maxVotes) {
                    maxVotes = voteCount;
                    winner = candidate.name;
                }
            }

            pastElectionResults.push({
                electionName: election.name,
                winner: winner,  // Winner of the election
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

// Route to check if admin has MetaMask address and NID
router.get('/admin/check-wallet-nid', async (req, res) => {
    const userId = req.query.userId || req.session.user?.id;  // Access the user ID from session

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const [adminData] = await db.promise().query("SELECT metamask_address, NID FROM users WHERE id = ? AND role = 'admin'", [userId]);

        const admin = adminData[0];

        if (admin.metamask_address !== '0' && admin.metamask_address !== '' && admin.NID !== 0 && admin.NID !== null) {
            return res.json({ adminData });
        } else {
            return res.json({ needsRegistration: true });
        }
    } catch (error) {
        console.error('Error checking admin wallet and NID:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Route to register MetaMask address and NID
router.post('/admin/register-wallet-nid', async (req, res) => {
    const userId = req.body.userId || req.session.user?.id;  // Access the user ID from session
    const { metamask_address, NID } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        await db.promise().query(
            "UPDATE users SET metamask_address = ?, NID = ? WHERE id = ? AND role = 'admin'",
            [metamask_address, NID, userId]
        );

        return res.json({ success: true, message: 'MetaMask and NID registered successfully' });
    } catch (error) {
        console.error('Error registering MetaMask and NID:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
