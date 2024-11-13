const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require("express-session");
const app = express();
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const voterRoutes = require('./routes/voterRoute');
const adminRoutes = require('./routes/adminRoutes');
const votingRoutes = require('./routes/votingRoutes');
const resultRoutes = require('./routes/resultRoutes');

app.use(morgan('dev'));

// Middleware for parsing JSON and URL-encoded data (useful for forms)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware setup
app.use(session({
    secret: 'Harry_Potter',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Serve static files (CSS, JS, Images) from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Home page route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'views') });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(voterRoutes);
app.use(adminRoutes);
app.use(votingRoutes);
app.use(resultRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
