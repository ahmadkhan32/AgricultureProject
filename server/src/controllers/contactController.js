const Message = require('../models/Message');
const { Op } = require('sequelize');
const Joi = require('joi');

// Validation schema
const messageSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  subject: Joi.string().min(5).max(200).required(),
  message: Joi.string().min(20).required()
});

// Create contact message
exports.create = async (req, res) => {
  try {
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const message = await Message.create({
      ...value,
      status: 'new'
    });

    res.status(201).json({
      message: 'Contact message sent successfully',
      id: message.id
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all messages (Admin only)
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
        { message: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Message.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      messages: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get single message (Admin only)
exports.getById = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Mark as read if status is new
    if (message.status === 'new') {
      await message.update({ status: 'read' });
    }

    res.json(message);
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update message status (Admin only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.update({ status });

    res.json(message);
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete message (Admin only)
exports.delete = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.destroy();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get message statistics (Admin only)
exports.getStats = async (req, res) => {
  try {
    const totalMessages = await Message.count();
    const newMessages = await Message.count({ where: { status: 'new' } });
    const readMessages = await Message.count({ where: { status: 'read' } });
    const repliedMessages = await Message.count({ where: { status: 'replied' } });
    const archivedMessages = await Message.count({ where: { status: 'archived' } });

    res.json({
      total: totalMessages,
      new: newMessages,
      read: readMessages,
      replied: repliedMessages,
      archived: archivedMessages
    });
  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

