const Service = require('../models/Service');
const User = require('../models/User');
const { Op } = require('sequelize');
const Joi = require('joi');

// Validation schema
const serviceSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).max(1000).required(),
  content: Joi.string().min(50).optional().allow(''),
  category: Joi.string().valid('support', 'training', 'assistance', 'project').default('support'),
  icon: Joi.string().max(100).optional().allow(''),
  imageUrl: Joi.string().uri().max(500).optional().allow(''),
  status: Joi.string().valid('active', 'inactive').default('active'),
  tags: Joi.array().items(Joi.string()).optional()
});

// Get all active services (public)
exports.getAll = async (req, res) => {
  try {
    console.log('🔍 GET /api/services - Request received');
    console.log('Query params:', req.query);
    
    const { page = 1, limit = 12, category, search } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const offset = (pageNum - 1) * limitNum;

    const where = {
      status: 'active'
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    console.log('📊 Query where clause:', JSON.stringify(where, null, 2));

    // Query services - try with User include first, fallback to simple query if it fails
    let result;
    try {
      console.log('🔄 Attempting query with User include...');
      // First try with User include
      result = await Service.findAndCountAll({
        where,
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }],
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset: offset
      });
      console.log('✅ Query with User include successful');
    } catch (includeError) {
      console.warn('⚠️ Query with User include failed:', includeError.message);
      console.warn('Error name:', includeError.name);
      console.warn('Error stack:', includeError.stack);
      // Fallback to simple query without User include
      console.log('🔄 Trying query without User include...');
      result = await Service.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset: offset
      });
      console.log('✅ Query without User include successful');
    }

    const { count, rows } = result;
    console.log(`📦 Found ${count} services, returning ${rows.length} rows`);

    res.json({
      services: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    console.error('❌ Get services error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    if (error.original) {
      console.error('❌ Original error:', error.original);
      console.error('❌ Original error message:', error.original?.message);
    }
    
    // Check for specific Sequelize errors
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error.name === 'SequelizeDatabaseError') {
      if (error.message && error.message.includes("doesn't exist")) {
        errorMessage = 'Services table does not exist. Please run the database migration script.';
        statusCode = 503; // Service Unavailable
      } else if (error.message && error.message.includes("Unknown column")) {
        errorMessage = 'Database schema mismatch. Please update the services table structure.';
      }
    } else if (error.name === 'SequelizeConnectionError') {
      errorMessage = 'Database connection failed. Please check your database configuration.';
      statusCode = 503;
    }
    
    res.status(statusCode).json({ 
      message: errorMessage, 
      error: error.message,
      errorType: error.name,
      originalError: error.original?.message || error.original,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get single service (public)
exports.getById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName'],
        required: false
      }]
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Only return active services for non-admin users
    if (service.status !== 'active' && req.user?.role !== 'admin') {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create service (Admin only)
exports.create = async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const serviceData = {
      ...value,
      createdBy: req.user.userId
    };

    const service = await Service.create(serviceData);

    res.status(201).json({ service, message: 'Service created successfully' });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update service (Admin only)
exports.update = async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.update(value);

    res.json({ service, message: 'Service updated successfully' });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete service (Admin only)
exports.delete = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.destroy();

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all services for admin (includes inactive)
exports.getAllForAdmin = async (req, res) => {
  try {
    console.log('🔍 GET /api/services/admin/all - Admin request received');
    console.log('Query params:', req.query);
    console.log('User:', req.user?.userId, req.user?.role);
    
    const { page = 1, limit = 20, category, status, search } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    const where = {};

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    console.log('📊 Admin query where clause:', JSON.stringify(where, null, 2));

    // Query services - try with User include first, fallback to simple query if it fails
    let result;
    try {
      console.log('🔄 Attempting admin query with User include...');
      result = await Service.findAndCountAll({
        where,
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }],
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset: offset
      });
      console.log('✅ Admin query with User include successful');
    } catch (includeError) {
      console.warn('⚠️ Admin query with User include failed:', includeError.message);
      console.warn('Error name:', includeError.name);
      console.warn('Error stack:', includeError.stack);
      // Fallback to simple query without User include
      console.log('🔄 Trying admin query without User include...');
      result = await Service.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset: offset
      });
      console.log('✅ Admin query without User include successful');
    }

    const { count, rows } = result;
    console.log(`📦 Admin found ${count} services, returning ${rows.length} rows`);

    res.json({
      services: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    console.error('❌ Get admin services error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    if (error.original) {
      console.error('❌ Original error:', error.original);
      console.error('❌ Original error message:', error.original?.message);
    }
    
    // Check for specific Sequelize errors
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error.name === 'SequelizeDatabaseError') {
      if (error.message && error.message.includes("doesn't exist")) {
        errorMessage = 'Services table does not exist. Please run the database migration script.';
        statusCode = 503; // Service Unavailable
      } else if (error.message && error.message.includes("Unknown column")) {
        errorMessage = 'Database schema mismatch. Please update the services table structure.';
      }
    } else if (error.name === 'SequelizeConnectionError') {
      errorMessage = 'Database connection failed. Please check your database configuration.';
      statusCode = 503;
    }
    
    res.status(statusCode).json({ 
      message: errorMessage, 
      error: error.message,
      errorType: error.name,
      originalError: error.original?.message || error.original,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

