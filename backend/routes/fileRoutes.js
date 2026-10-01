const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { authMiddleware } = require('../middleware/auth');
const multer = require('multer');

// Configure Multer for memory storage (file will be passed as buffer to Firebase)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    }
});

// @route   POST /api/files/upload
// @desc    Upload a file
// @access  Private
router.post('/upload', authMiddleware, upload.single('file'), fileController.uploadFile);

// @route   GET /api/files
// @desc    Get all files for logged-in user
// @access  Private
router.get('/', authMiddleware, fileController.getFiles);

// @route   DELETE /api/files/:id
// @desc    Delete a file (Move to recycle bin or permanent)
// @access  Private
router.delete('/:id', authMiddleware, fileController.deleteFile);

// @route   PUT /api/files/:id
// @desc    Rename/update a file
// @access  Private
router.put('/:id', authMiddleware, fileController.updateFile);

module.exports = router;
