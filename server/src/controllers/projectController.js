const Project = require('../models/Project');
const User = require('../models/User');
const { Op } = require('sequelize');
const Joi = require('joi');

// Validation schema
const projectSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).required(),
  content: Joi.string().optional(),
  image: Joi.string().uri().optional(),
  category: Joi.string().optional(),
  status: Joi.string().valid('draft', 'published', 'active', 'completed', 'inactive').default('published'),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  location: Joi.string().optional(),
  budget: Joi.number().positive().optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

// Get all projects
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.status = status;
    } else {
      where.status = { [Op.in]: ['published', 'active'] };
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Project.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      projects: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get single project
exports.getById = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create project
exports.create = async (req, res) => {
  try {
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const projectData = {
      ...value,
      createdBy: req.user.userId
    };

    const project = await Project.create(projectData);

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update project
exports.update = async (req, res) => {
  try {
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin or creator
    if (req.user.role !== 'admin' && project.createdBy !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await project.update(value);

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete project
exports.delete = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin or creator
    if (req.user.role !== 'admin' && project.createdBy !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await project.destroy();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all projects for admin
exports.getAllForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const { count, rows } = await Project.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      projects: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get admin projects error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

