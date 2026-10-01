const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const { authMiddleware } = require('../middleware/auth');

// Note: getSharedFile does not require auth so anyone with the link can access it
router.post('/', authMiddleware, shareController.shareFile);
router.get('/', authMiddleware, shareController.getMyShares);
router.delete('/:id', authMiddleware, shareController.revokeShare);
router.get('/:token', shareController.getSharedFile);

module.exports = router;
