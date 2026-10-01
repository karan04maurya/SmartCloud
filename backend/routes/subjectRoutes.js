const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/subjects
// @desc    Get all subjects
// @access  Private
router.get('/', authMiddleware, subjectController.getAllSubjects);

// @route   POST /api/subjects
// @desc    Create a subject
// @access  Private
router.post('/', authMiddleware, subjectController.createSubject);

// @route   DELETE /api/subjects/:id
// @desc    Delete a subject
// @access  Private
router.delete('/:id', authMiddleware, subjectController.deleteSubject);

module.exports = router;
