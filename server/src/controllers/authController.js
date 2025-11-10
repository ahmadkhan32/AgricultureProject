const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  phone: Joi.string().allow('', null).optional().default(null),
  role: Joi.string().valid('producer', 'admin').default('producer')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let { email, password, firstName, lastName, phone, role } = value;

    // Normalize email (lowercase + trim) for consistency
    email = email.toLowerCase().trim();
    
    // Normalize phone: convert empty strings to null
    phone = phone && phone.trim() ? phone.trim() : null;

    // Check if user already exists (case-insensitive) - multiple methods
    let existingUser;
    
    // Method 1: Exact match (most common since we normalize)
    existingUser = await User.unscoped().findOne({ 
      where: { 
        email: email
      }
    });
    
    // Method 2: Raw query for case-insensitive (if still not found)
    if (!existingUser) {
      try {
        const [results] = await sequelize.query(
          'SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
          {
            replacements: [email],
            type: QueryTypes.SELECT
          }
        );
        if (results && results.length > 0) {
          existingUser = { id: results[0].id, email: results[0].email };
        }
      } catch (queryError) {
        console.error('Raw query error:', queryError);
        // Continue, don't block registration
      }
    }
    
    if (existingUser) {
      const existingEmail = existingUser.getDataValue ? existingUser.getDataValue('email') : existingUser.email;
      console.log(`❌ Registration failed: User already exists with email: ${email}`);
      console.log(`📧 Found existing user ID: ${existingUser.id}, Email: ${existingEmail}`);
      return res.status(400).json({ 
        message: 'An account with this email already exists. Please use a different email or try logging in.',
        error: 'EMAIL_EXISTS',
        field: 'email'
      });
    }

    // Create user with normalized email
    const user = await User.create({
      email, // Normalized email
      password, // Will be hashed by the model setter
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone, // Already normalized above
      role: role || 'producer'
    });

    console.log(`✅ User registered successfully: ${email} (ID: ${user.id})`);

    // Return user data (excluding password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('═══════════════════════════════════════');
    console.error('❌ REGISTRATION ERROR:');
    console.error('═══════════════════════════════════════');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Request Body:', req.body);
    console.error('═══════════════════════════════════════');
    
    // Pass error to error handler middleware
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    // Normalize email (trim and lowercase for consistency)
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find user with password included - use unscoped() to bypass defaultScope
    // Use case-insensitive search - try exact match first, then LIKE fallback
    let user;
    try {
      // Try exact match first (most efficient - should work since we normalize email in registration)
      user = await User.unscoped().findOne({ 
        where: { 
          email: normalizedEmail 
        }
      });
      
    } catch (dbError) {
      console.error('❌ Database query error:', dbError);
      console.error('Error details:', dbError.message, dbError.stack);
      throw dbError; // Re-throw to be caught by error handler
    }

    if (!user) {
      console.log(`❌ Login attempt failed: User not found with email: ${normalizedEmail}`);
      console.log(`💡 Searched for: "${normalizedEmail}"`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Get raw password from database
    const storedPassword = user.getDataValue('password');
    
    // Debug logging
    console.log(`🔍 Login attempt for: ${normalizedEmail}`);
    console.log(`📝 User found: ID ${user.id}, Role: ${user.role}`);
    console.log(`📝 Password field exists: ${!!storedPassword}`);
    
    if (!storedPassword) {
      console.log(`❌ Login attempt failed: No password found for user: ${normalizedEmail}`);
      console.log(`📝 User object keys:`, Object.keys(user.dataValues || {}));
      console.log(`📝 Available fields:`, user.dataValues);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password using bcrypt
    console.log(`📝 Password hash length: ${storedPassword.length}`);
    console.log(`📝 Password hash starts with $2: ${storedPassword.startsWith('$2')}`);
    
    const isPasswordValid = bcrypt.compareSync(password, storedPassword);
    
    console.log(`📝 Password comparison result: ${isPasswordValid ? '✅ VALID' : '❌ INVALID'}`);

    if (!isPasswordValid) {
      console.log(`❌ Login attempt failed: Invalid password for user: ${normalizedEmail}`);
      console.log(`💡 Tip: Run 'node src/scripts/testLogin.js' to verify password hash`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`✅ Login successful for: ${normalizedEmail}`);

    // Validate JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ Login successful for user: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('═══════════════════════════════════════');
    console.error('❌ LOGIN ERROR:');
    console.error('═══════════════════════════════════════');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Request Body:', req.body);
    console.error('═══════════════════════════════════════');
    next(error);
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatarUrl } = req.body;
    const userId = req.user.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      avatarUrl: avatarUrl || user.avatarUrl
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};

