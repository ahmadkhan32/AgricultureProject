const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  // Validate JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not configured in environment variables');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user exists in database
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(403).json({ message: 'Invalid token - user not found' });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin
};

