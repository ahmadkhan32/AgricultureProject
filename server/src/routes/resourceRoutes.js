const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', resourceController.getAll);

// Admin routes (must be defined before /:id to avoid route conflicts)
router.get('/admin/all', authenticateToken, requireAdmin, resourceController.getAllForAdmin);
router.get('/admin/stats', authenticateToken, requireAdmin, resourceController.getStats);
router.post('/', authenticateToken, requireAdmin, resourceController.create);
router.put('/:id', authenticateToken, requireAdmin, resourceController.update);
router.delete('/:id', authenticateToken, requireAdmin, resourceController.delete);

// Public routes (must be after admin routes to avoid conflicts)
router.get('/:id', resourceController.getById);

module.exports = router;

