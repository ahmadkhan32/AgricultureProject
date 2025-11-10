const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public route
router.post('/', contactController.create);

// Admin routes
router.get('/', authenticateToken, requireAdmin, contactController.getAll);
router.get('/stats', authenticateToken, requireAdmin, contactController.getStats);
router.get('/:id', authenticateToken, requireAdmin, contactController.getById);
router.patch('/:id/status', authenticateToken, requireAdmin, contactController.updateStatus);
router.delete('/:id', authenticateToken, requireAdmin, contactController.delete);

module.exports = router;

