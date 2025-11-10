const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Async error wrapper to catch promise rejections
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/me', authenticateToken, asyncHandler(authController.getMe));
router.put('/profile', authenticateToken, asyncHandler(authController.updateProfile));

module.exports = router;

