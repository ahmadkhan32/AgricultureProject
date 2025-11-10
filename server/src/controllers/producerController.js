const Producer = require('../models/Producer');
const User = require('../models/User');
const { Op } = require('sequelize');
const Joi = require('joi');

// Validation schema
const producerSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  businessName: Joi.string().min(2).max(200).required(),
  businessType: Joi.string().valid('agriculture', 'livestock', 'fisheries', 'mixed').required(),
  description: Joi.string().min(20).max(1000).optional(),
  location: Joi.string().min(5).max(200).required(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  region: Joi.string().min(2).max(100).required(),
  products: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional(),
  contactEmail: Joi.string().email().optional(),
  contactPhone: Joi.string().optional(),
  website: Joi.string().uri().optional(),
  socialMedia: Joi.object().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  image: Joi.string().uri().optional(),
  status: Joi.string().valid('pending', 'approved', 'rejected').optional()
});

// Get all approved producers
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, region, businessType, search } = req.query;
    const offset = (page - 1) * limit;

    const where = { status: 'approved' };

    if (region) {
      where.region = region;
    }

    if (businessType) {
      where.businessType = businessType;
    }

    if (search) {
      where[Op.or] = [
        { businessName: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Producer.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Ensure image URLs are absolute URLs
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const producersWithAbsoluteUrls = rows.map(producer => {
      const producerData = producer.toJSON();
      if (producerData.image && producerData.image.startsWith('/uploads/')) {
        producerData.image = `${baseUrl}${producerData.image}`;
      }
      return producerData;
    });

    res.json({
      producers: producersWithAbsoluteUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get producers error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get single producer
exports.getById = async (req, res) => {
  try {
    const producer = await Producer.findOne({
      where: { id: req.params.id, status: 'approved' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    if (!producer) {
      return res.status(404).json({ message: 'Producer not found' });
    }

    // Ensure image URL is absolute
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const producerData = producer.toJSON();
    if (producerData.image && producerData.image.startsWith('/uploads/')) {
      producerData.image = `${baseUrl}${producerData.image}`;
    }

    res.json(producerData);
  } catch (error) {
    console.error('Get producer error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create producer
exports.create = async (req, res) => {
  try {
    const { error, value } = producerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Handle image URL - convert relative URLs to full URLs if needed
    if (value.image && value.image.startsWith('/uploads/')) {
      const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      value.image = `${baseUrl}${value.image}`;
    }

    // Check if user already has a producer profile
    if (req.user && req.user.userId) {
      const existingProducer = await Producer.findOne({
        where: { userId: req.user.userId }
      });

      if (existingProducer) {
        return res.status(400).json({ message: 'Producer profile already exists' });
      }

      value.userId = req.user.userId;
    }

    if (!value.status) {
      value.status = 'pending';
    }

    const producer = await Producer.create(value);

    res.status(201).json(producer);
  } catch (error) {
    console.error('Create producer error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update producer
exports.update = async (req, res) => {
  try {
    const { error, value } = producerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const producer = await Producer.findByPk(req.params.id);
    if (!producer) {
      return res.status(404).json({ message: 'Producer not found' });
    }

    // Check if user owns this producer or is admin
    if (req.user && req.user.role !== 'admin' && producer.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Handle image URL - convert relative URLs to full URLs if needed
    if (value.image && value.image.startsWith('/uploads/')) {
      const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      value.image = `${baseUrl}${value.image}`;
    }

    await producer.update(value);

    res.json(producer);
  } catch (error) {
    console.error('Update producer error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete producer
exports.delete = async (req, res) => {
  try {
    const producer = await Producer.findByPk(req.params.id);
    if (!producer) {
      return res.status(404).json({ message: 'Producer not found' });
    }

    // Check if user owns this producer or is admin
    if (req.user && req.user.role !== 'admin' && producer.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await producer.destroy();

    res.json({ message: 'Producer deleted successfully' });
  } catch (error) {
    console.error('Delete producer error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get user's own producer profile
exports.getMyProfile = async (req, res) => {
  try {
    const producer = await Producer.findOne({
      where: { userId: req.user.userId }
    });

    res.json(producer || null);
  } catch (error) {
    console.error('Get user producer profile error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all producers for admin
exports.getAllForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, region, businessType } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (region) {
      where.region = region;
    }

    if (businessType) {
      where.businessType = businessType;
    }

    const { count, rows } = await Producer.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      producers: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get admin producers error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update producer status (Admin only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const producer = await Producer.findByPk(req.params.id);
    if (!producer) {
      return res.status(404).json({ message: 'Producer not found' });
    }

    await producer.update({ status });

    res.json(producer);
  } catch (error) {
    console.error('Update producer status error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

