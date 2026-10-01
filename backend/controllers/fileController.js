const db = require('../config/db');
const { bucket } = require('../config/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Helper to extract file extension
const getExtension = (filename) => {
    return path.extname(filename).toLowerCase();
};

// Map extensions to file types
const getFileType = (ext) => {
    const types = {
        '.pdf': 'PDF',
        '.doc': 'Document',
        '.docx': 'Document',
        '.ppt': 'Presentation',
        '.pptx': 'Presentation',
        '.jpg': 'Image',
        '.jpeg': 'Image',
        '.png': 'Image',
        '.zip': 'Archive',
        '.rar': 'Archive'
    };
    return types[ext] || 'Other';
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { subject_id, description } = req.body;
        const userId = req.user.id;
        const originalName = req.file.originalname;
        const ext = getExtension(originalName);
        const fileType = getFileType(ext);
        const fileSize = req.file.size;
        
        let fileUrl = '';

        // If Firebase bucket is initialized, upload to Firebase
        if (bucket) {
            const fileName = `users/${userId}/${uuidv4()}${ext}`;
            const fileUpload = bucket.file(fileName);
            
            await fileUpload.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype
                }
            });
            
            // Make public and get URL
            await fileUpload.makePublic();
            fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        } else {
            // Mock URL for local development if Firebase is not setup
            console.warn('Firebase bucket not initialized. Saving locally.');
            const fs = require('fs');
            const fileName = `${uuidv4()}${ext}`;
            const uploadPath = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadPath)) { fs.mkdirSync(uploadPath); }
            fs.writeFileSync(path.join(uploadPath, fileName), req.file.buffer);
            fileUrl = `http://localhost:5000/mock-uploads/${fileName}`;
        }

        // Save to Database
        const [result] = await db.query(
            'INSERT INTO files (user_id, subject_id, file_name, file_url, file_type, file_size, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, subject_id || null, originalName, fileUrl, fileType, fileSize, description || '']
        );

        // Log Activity
        await db.query('INSERT INTO activity_logs (user_id, action, target_type, target_id) VALUES (?, ?, ?, ?)', 
            [userId, 'UPLOAD_FILE', 'FILE', result.insertId]);

        res.status(201).json({
            id: result.insertId,
            file_name: originalName,
            file_url: fileUrl,
            file_type: fileType,
            file_size: fileSize
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Server error during upload' });
    }
};

exports.getFiles = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Filter out files that are in recycle bin
        const query = `
            SELECT f.*, s.name as subject_name 
            FROM files f 
            LEFT JOIN subjects s ON f.subject_id = s.id 
            WHERE f.user_id = ? AND f.id NOT IN (SELECT file_id FROM recycle_bin)
            ORDER BY f.created_at DESC
        `;
        
        const [files] = await db.query(query, [userId]);
        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching files' });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const userId = req.user.id;

        // Verify ownership
        const [files] = await db.query('SELECT * FROM files WHERE id = ? AND user_id = ?', [fileId, userId]);
        if (files.length === 0) {
            return res.status(404).json({ error: 'File not found or unauthorized' });
        }

        // Move to recycle bin instead of permanent delete
        await db.query('INSERT INTO recycle_bin (file_id) VALUES (?)', [fileId]);

        // Log Activity
        await db.query('INSERT INTO activity_logs (user_id, action, target_type, target_id) VALUES (?, ?, ?, ?)', 
            [userId, 'MOVE_TO_TRASH', 'FILE', fileId]);

        res.json({ message: 'File moved to recycle bin' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error deleting file' });
    }
};

exports.updateFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const userId = req.user.id;
        const { file_name, subject_id, description } = req.body;

        // Verify ownership
        const [files] = await db.query('SELECT * FROM files WHERE id = ? AND user_id = ?', [fileId, userId]);
        if (files.length === 0) {
            return res.status(404).json({ error: 'File not found or unauthorized' });
        }

        const updates = [];
        const params = [];
        
        if (file_name) { updates.push('file_name = ?'); params.push(file_name); }
        if (subject_id !== undefined) { updates.push('subject_id = ?'); params.push(subject_id); }
        if (description !== undefined) { updates.push('description = ?'); params.push(description); }

        if (updates.length > 0) {
            params.push(fileId);
            await db.query(`UPDATE files SET ${updates.join(', ')} WHERE id = ?`, params);
            
            // Log Activity
            await db.query('INSERT INTO activity_logs (user_id, action, target_type, target_id) VALUES (?, ?, ?, ?)', 
                [userId, 'RENAME_FILE', 'FILE', fileId]);
        }

        res.json({ message: 'File updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error updating file' });
    }
};
