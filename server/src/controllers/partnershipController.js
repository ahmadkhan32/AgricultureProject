const Partnership = require('../models/Partnership');
const { Op } = require('sequelize');
const Joi = require('joi');

// Validation schema
const partnershipSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(20).max(1000).required(),
  partnerType: Joi.string().valid('local', 'international', 'government', 'ngo', 'private').required(),
  logoUrl: Joi.string().uri().optional(),
  website: Joi.string().uri().optional(),
  contactInfo: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    contactPerson: Joi.string().optional()
  }).optional(),
  status: Joi.string().valid('active', 'inactive', 'pending').default('active')
});

// Get all active partnerships
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 12, partnerType } = req.query;
    const offset = (page - 1) * limit;

    const where = { status: 'active' };

    if (partnerType) {
      where.partnerType = partnerType;
    }

    const { count, rows } = await Partnership.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      partnerships: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get partnerships error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get single partnership
exports.getById = async (req, res) => {
  try {
    const partnership = await Partnership.findOne({
      where: { id: req.params.id, status: 'active' }
    });

    if (!partnership) {
      return res.status(404).json({ message: 'Partnership not found' });
    }

    res.json(partnership);
  } catch (error) {
    console.error('Get partnership error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create partnership
exports.create = async (req, res) => {
  try {
    const { error, value } = partnershipSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const partnership = await Partnership.create(value);

    res.status(201).json(partnership);
  } catch (error) {
    console.error('Create partnership error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update partnership
exports.update = async (req, res) => {
  try {
    const { error, value } = partnershipSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const partnership = await Partnership.findByPk(req.params.id);
    if (!partnership) {
      return res.status(404).json({ message: 'Partnership not found' });
    }

    await partnership.update(value);

    res.json(partnership);
  } catch (error) {
    console.error('Update partnership error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete partnership
exports.delete = async (req, res) => {
  try {
    const partnership = await Partnership.findByPk(req.params.id);
    if (!partnership) {
      return res.status(404).json({ message: 'Partnership not found' });
    }

    await partnership.destroy();

    res.json({ message: 'Partnership deleted successfully' });
  } catch (error) {
    console.error('Delete partnership error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all partnerships for admin
exports.getAllForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, partnerType } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (partnerType) {
      where.partnerType = partnerType;
    }

    const { count, rows } = await Partnership.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      partnerships: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get admin partnerships error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

