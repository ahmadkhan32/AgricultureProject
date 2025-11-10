const express = require('express');
const router = express.Router();
const partnershipController = require('../controllers/partnershipController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', partnershipController.getAll);
router.get('/:id', partnershipController.getById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, partnershipController.create);
router.put('/:id', authenticateToken, requireAdmin, partnershipController.update);
router.delete('/:id', authenticateToken, requireAdmin, partnershipController.delete);
router.get('/admin/all', authenticateToken, requireAdmin, partnershipController.getAllForAdmin);

module.exports = router;

