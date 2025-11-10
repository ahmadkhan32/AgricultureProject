const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', newsController.getAll);
router.get('/:id', newsController.getById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, newsController.create);
router.put('/:id', authenticateToken, requireAdmin, newsController.update);
router.delete('/:id', authenticateToken, requireAdmin, newsController.delete);
router.get('/admin/all', authenticateToken, requireAdmin, newsController.getAllForAdmin);

module.exports = router;

