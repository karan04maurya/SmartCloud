const db = require('../config/db');

// Get all users
exports.getUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const [users] = await db.query('SELECT id, full_name, email, student_id, college_name, course, role, created_at FROM users');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const { id } = req.params;
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        
        // Log Activity
        await db.query('INSERT INTO activity_logs (user_id, action, target_type, target_id) VALUES (?, ?, ?, ?)', 
            [req.user.id, 'DELETE_USER', 'USER', id]);

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Admin Stats
exports.getStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }

        const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users WHERE role = "student"');
        const [[{ totalFiles }]] = await db.query('SELECT COUNT(*) as totalFiles FROM files');
        const [[{ storageUsed }]] = await db.query('SELECT SUM(file_size) as storageUsed FROM files');
        const [[{ activeUsers }]] = await db.query('SELECT COUNT(DISTINCT user_id) as activeUsers FROM activity_logs WHERE created_at >= NOW() - INTERVAL 30 DAY');

        res.json({
            totalStudents: totalUsers || 0,
            totalFiles: totalFiles || 0,
            storageUsed: storageUsed || 0,
            activeUsers: activeUsers || 0
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
