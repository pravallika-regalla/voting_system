exports.checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    next(); // If logged in, continue to the next middlewares/controller
};
