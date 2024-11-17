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
app.get('/technology', (req, res) => {
    res.sendFile('technology.html', { root: path.join(__dirname, 'views') });
});
app.get('/customerandretail', (req, res) => {
    res.sendFile('customerandretail.html', { root: path.join(__dirname, 'views') });
});
// Route for Infrastructure page
app.get('/infrastructure', (req, res) => {
    res.sendFile('infrastructure.html', { root: path.join(__dirname, 'views') });
});

app.get('/financial-services', (req, res) => {
    res.sendFile('financial-services.html', { root: path.join(__dirname, 'views') });
});

app.get('/tourism-and-travel', (req, res) => {
    res.sendFile('tourism-and-travel.html', { root: path.join(__dirname, 'views') });
});

app.get('/telecom-and-media', (req, res) => {
    res.sendFile('telecom-and-media.html', { root: path.join(__dirname, 'views') });
});
// Route for Health page
app.get('/health', (req, res) => {
    res.sendFile('health.html', { root: path.join(__dirname, 'views') });
});

// Route for Education page
app.get('/education', (req, res) => {
    res.sendFile('education.html', { root: path.join(__dirname, 'views') });
});

// Route for Empowerment page
app.get('/empowerment', (req, res) => {
    res.sendFile('empowerment.html', { root: path.join(__dirname, 'views') });
});

// Route for Environment page
app.get('/environment', (req, res) => {
    res.sendFile('environment.html', { root: path.join(__dirname, 'views') });
});
// Route for E-Vote page
app.get('/e-vote', (req, res) => {
    res.sendFile('e-vote.html', { root: path.join(__dirname, 'views') });
});

// Route for Life at E-Vote page
app.get('/life-at-e-vote', (req, res) => {
    res.sendFile('life-at-e-vote.html', { root: path.join(__dirname, 'views') });
});

// Route for Leadership page
app.get('/leadership', (req, res) => {
    res.sendFile('leadership.html', { root: path.join(__dirname, 'views') });
});

// Route for Sustainability page
app.get('/sustainability', (req, res) => {
    res.sendFile('sustainability.html', { root: path.join(__dirname, 'views') });
});

// Route for Innovation page
app.get('/innovation', (req, res) => {
    res.sendFile('innovation.html', { root: path.join(__dirname, 'views') });
});

// Route for Code of Conduct page
app.get('/code-of-conduct', (req, res) => {
    res.sendFile('code-of-conduct.html', { root: path.join(__dirname, 'views') });
});
// Route for Jobs page
app.get('/jobs', (req, res) => {
    res.sendFile('jobs.html', { root: path.join(__dirname, 'views') });
});

// Route for Newsroom page
app.get('/newsroom', (req, res) => {
    res.sendFile('newsroom.html', { root: path.join(__dirname, 'views') });
});

// Route for Career page
app.get('/career', (req, res) => {
    res.sendFile('career.html', { root: path.join(__dirname, 'views') });
});

// Route for Learnings page
app.get('/learnings', (req, res) => {
    res.sendFile('learnings.html', { root: path.join(__dirname, 'views') });
});

// Route for Opportunities page
app.get('/opportunities', (req, res) => {
    res.sendFile('opportunities.html', { root: path.join(__dirname, 'views') });
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
