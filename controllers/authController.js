const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Signup Controller
exports.signup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validate if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Check if the email already exists
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await db.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        // Return success message and redirect flag
        res.status(201).json({ message: 'User registered successfully', redirectTo: '/login' });
    } catch (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate if both email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Both email and password are required' });
    }

    try {
        // Fetch the user from the database based on the provided email
        const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        // Check if user exists
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];

        // Compare the hashed password with the user's input password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Store user info in session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        if (user.role === 'admin') {
            res.status(200).json({ message: 'Login successful', redirectTo: '/admin/dashboard' });
        } else if (user.role === 'voter') {
            res.status(200).json({ message: 'Login successful', redirectTo: '/dashboard' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout Controller
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Unable to log out');
        }
        res.redirect('/'); // Redirect to homepage after logout
    });
};

