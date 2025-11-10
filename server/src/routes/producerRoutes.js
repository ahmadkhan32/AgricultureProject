const express = require('express');
const router = express.Router();
const producerController = require('../controllers/producerController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', producerController.getAll);
router.get('/:id', producerController.getById);

// Authenticated routes
router.post('/', authenticateToken, producerController.create);
router.put('/:id', authenticateToken, producerController.update);
router.delete('/:id', authenticateToken, producerController.delete);
router.get('/profile/me', authenticateToken, producerController.getMyProfile);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, producerController.getAllForAdmin);
router.patch('/:id/status', authenticateToken, requireAdmin, producerController.updateStatus);

module.exports = router;

