const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected route for dashboard
router.get('/dashboard', authMiddleware.checkAuth, dashboardController.dashboard);

router.get('/Admin/dashboard',authMiddleware.checkAuth, dashboardController.adminDashboard);

module.exports = router;

// API route to send session data
router.get('/session-data', (req, res) => {
    if (req.session && req.session.user) {
        // Send user data as JSON
        res.json({ user: req.session.user });
    } else {
        // Send empty response if no user session exists
        res.json({ user: null });
    }
});
