const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

// Authenticated routes
router.post('/', authenticateToken, requireAdmin, projectController.create);
router.put('/:id', authenticateToken, requireAdmin, projectController.update);
router.delete('/:id', authenticateToken, requireAdmin, projectController.delete);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, projectController.getAllForAdmin);

module.exports = router;

