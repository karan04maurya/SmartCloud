const db = require('../config/db');

// Get all subjects
exports.getAllSubjects = async (req, res) => {
    try {
        const query = `
            SELECT s.*, COUNT(f.id) as files 
            FROM subjects s 
            LEFT JOIN files f ON s.id = f.subject_id 
            GROUP BY s.id 
            ORDER BY s.name ASC
        `;
        const [subjects] = await db.query(query);
        res.json(subjects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM subjects WHERE id = ?', [id]);
        res.json({ msg: 'Subject removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a subject
exports.createSubject = async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await db.query('INSERT INTO subjects (name) VALUES (?)', [name]);
        res.status(201).json({ id: result.insertId, name });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Subject already exists' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
