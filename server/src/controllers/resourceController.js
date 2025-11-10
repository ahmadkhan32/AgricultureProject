const Resource = require('../models/Resource');
const User = require('../models/User');
const { Op } = require('sequelize');
const Joi = require('joi');

// Validation schema
const resourceSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).max(1000).optional().allow(''),
  fileUrl: Joi.string().uri().max(500).required(),
  fileType: Joi.string().max(50).required(),
  fileSize: Joi.number().positive().optional().allow(null),
  category: Joi.string().valid('reports', 'guidelines', 'forms', 'documents', 'others').required(),
  status: Joi.string().valid('active', 'inactive').default('active'),
  tags: Joi.array().items(Joi.string()).optional()
});

// Get all resources (public - only active)
exports.getAll = async (req, res) => {
  try {
    console.log('🔍 GET /api/resources - Request received');
    const { page = 1, limit = 12, category, search } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const offset = (pageNum - 1) * limitNum;

    const where = {
      status: 'active' // Only show active resources to public
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

    // Try with User include, fallback if it fails
    let result;
    try {
      result = await Resource.findAndCountAll({
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
    } catch (includeError) {
      console.warn('⚠️ Query with User include failed:', includeError.message);
      try {
        // Try with status filter but without User include
        result = await Resource.findAndCountAll({
          where,
          order: [['createdAt', 'DESC']],
          limit: limitNum,
          offset: offset
        });
      } catch (statusError) {
        console.warn('⚠️ Status filter failed, checking error type...');
        console.warn('Error name:', statusError.name);
        console.warn('Error message:', statusError.message);
        const originalMsg = statusError.original?.message || statusError.message || '';
        
        // Check if it's a status column error
        if (statusError.name === 'SequelizeDatabaseError' && 
            (originalMsg.includes('status') || originalMsg.includes('Unknown column'))) {
          console.warn('⚠️ Status column not found, trying without status filter...');
          const whereWithoutStatus = { ...where };
          delete whereWithoutStatus.status;
          result = await Resource.findAndCountAll({
            where: whereWithoutStatus,
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset: offset
          });
        } else {
          // Re-throw if it's a different error
          throw statusError;
        }
      }
    }

    const { count, rows } = result;
    console.log(`📦 Found ${count} resources, returning ${rows.length} rows`);

    res.json({
      resources: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    console.error('❌ Get resources error:', error);
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
        errorMessage = 'Resources table does not exist. Please run the database migration script.';
        statusCode = 503; // Service Unavailable
      } else if (error.message && error.message.includes("Unknown column")) {
        if (error.message.includes('status')) {
          errorMessage = 'Resources table is missing the status column. Please run the database migration script.';
        } else {
          errorMessage = 'Database schema mismatch. Please update the resources table structure.';
        }
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
      hint: 'Check database/resources-table-setup.sql for the resources table schema',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get single resource (public)
exports.getById = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName'],
        required: false
      }]
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Only return active resources for non-admin users
    if (resource.status !== 'active' && req.user?.role !== 'admin') {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment download count
    await resource.increment('downloadCount');

    res.json({ resource });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create resource (Admin only)
exports.create = async (req, res) => {
  try {
    const { error, value } = resourceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const resourceData = {
      ...value,
      createdBy: req.user.userId
    };

    const resource = await Resource.create(resourceData);

    res.status(201).json({ resource, message: 'Resource created successfully' });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update resource (Admin only)
exports.update = async (req, res) => {
  try {
    const { error, value } = resourceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.update(value);

    res.json({ resource, message: 'Resource updated successfully' });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete resource
exports.delete = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.destroy();

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all resources for admin (includes inactive)
exports.getAllForAdmin = async (req, res) => {
  try {
    console.log('🔍 GET /api/resources/admin/all - Admin request received');
    const { page = 1, limit = 20, category, status, search } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    const where = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    console.log('📊 Admin query where clause:', JSON.stringify(where, null, 2));

    // Try with User include, fallback if it fails
    let result;
    try {
      result = await Resource.findAndCountAll({
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
    } catch (includeError) {
      console.warn('⚠️ Admin query with User include failed, trying without...');
      result = await Resource.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: limitNum,
        offset: offset
      });
    }

    const { count, rows } = result;
    console.log(`📦 Admin found ${count} resources, returning ${rows.length} rows`);

    res.json({
      resources: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    console.error('❌ Get admin resources error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get resource statistics
exports.getStats = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      attributes: ['category', 'downloadCount']
    });

    const stats = {
      totalResources: resources.length,
      totalDownloads: resources.reduce((sum, resource) => sum + (resource.downloadCount || 0), 0),
      byCategory: {},
      topDownloads: []
    };

    // Calculate by category
    resources.forEach(resource => {
      const cat = resource.category;
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    });

    // Top downloads
    stats.topDownloads = resources
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, 10)
      .map(r => ({
        id: r.id,
        title: r.title,
        downloadCount: r.downloadCount || 0,
        category: r.category
      }));

    res.json(stats);
  } catch (error) {
    console.error('Get resource stats error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

