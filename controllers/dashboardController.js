const path = require('path');

exports.dashboard = (req, res) => {
    // You can load dynamic data here; for now, we're just rendering the HTML
    res.sendFile('dashboard.html', { root: path.join(__dirname, '../views') });
};

exports.adminDashboard = (req, res) => {
    res.sendFile('adminDashboard.html', { root: path.join(__dirname, '../views') });
}