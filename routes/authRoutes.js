const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController');

// Route to serve login.html
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: path.join(__dirname, '../views') });
});

// POST route to handle login
router.post('/login', authController.login);

// Route to serve register.html
router.get('/register', (req, res) => {
    res.sendFile('register.html', { root: path.join(__dirname, '../views') });
});

// POST route to handle signup
router.post('/signup', authController.signup);

// GET route to handle logout
router.get('/logout', authController.logout);

module.exports = router;
