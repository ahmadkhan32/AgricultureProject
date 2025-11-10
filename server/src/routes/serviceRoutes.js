const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', serviceController.getAll);

// Admin routes (must be defined before /:id to avoid route conflicts)
router.get('/admin/all', authenticateToken, requireAdmin, serviceController.getAllForAdmin);
router.post('/', authenticateToken, requireAdmin, serviceController.create);
router.put('/:id', authenticateToken, requireAdmin, serviceController.update);
router.delete('/:id', authenticateToken, requireAdmin, serviceController.delete);

// Public routes (must be after admin routes to avoid conflicts)
router.get('/:id', serviceController.getById);

module.exports = router;

