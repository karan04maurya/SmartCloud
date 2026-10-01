const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../config/db');

// Register User
exports.register = async (req, res) => {
    try {
        const { full_name, email, student_id, college_name, course, password } = req.body;

        // Check if user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, student_id, college_name, course, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [full_name, email, student_id, college_name, course, hashedPassword, 'student']
        );

        // Generate JWT
        const payload = {
            user: {
                id: result.insertId,
                role: 'student'
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Log Activity
        await db.query('INSERT INTO activity_logs (user_id, action, target_type, target_id) VALUES (?, ?, ?, ?)', 
            [result.insertId, 'REGISTER', 'USER', result.insertId]);

        res.status(201).json({ token, user: { id: result.insertId, full_name, email, role: 'student' } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Log Activity
        await db.query('INSERT INTO activity_logs (user_id, action, target_type, target_id) VALUES (?, ?, ?, ?)', 
            [user.id, 'LOGIN', 'USER', user.id]);

        res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Current User Profile
exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, full_name, email, student_id, college_name, course, role, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Generate reset token (using JWT for simplicity, no DB schema change needed)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this if you use another provider
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `http://localhost:5173/reset-password/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset - SmartCloud',
            text: `You requested a password reset for your SmartCloud account.\n\n` +
                  `Please click on the following link to reset your password. This link is valid for 15 minutes:\n\n` +
                  `${resetUrl}\n\n` +
                  `If you did not request this, please ignore this email.\n`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset email sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error sending email. Please make sure EMAIL_USER and EMAIL_PASS are set in backend/.env' });
    }
};
