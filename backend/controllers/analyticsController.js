const db = require('../config/db');

exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. File Distribution Chart (by type)
        const [fileDistribution] = await db.query(
            'SELECT file_type as type, COUNT(*) as count FROM files WHERE user_id = ? GROUP BY file_type', 
            [userId]
        );

        // 2. Storage Usage (Total storage vs used)
        const [[{ storageUsed }]] = await db.query(
            'SELECT SUM(file_size) as storageUsed FROM files WHERE user_id = ?', 
            [userId]
        );

        // 3. Monthly Upload Chart (Last 6 months)
        const [monthlyUploads] = await db.query(`
            SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
            FROM files 
            WHERE user_id = ? AND created_at >= NOW() - INTERVAL 6 MONTH 
            GROUP BY month 
            ORDER BY month ASC
        `, [userId]);

        // 4. Activity Report (Recent activities)
        const [activities] = await db.query(`
            SELECT action, target_type, created_at 
            FROM activity_logs 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 10
        `, [userId]);

        res.json({
            fileDistribution,
            storageUsed: storageUsed || 0,
            monthlyUploads,
            activities
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
