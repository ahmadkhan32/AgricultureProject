const News = require('../models/News');
const User = require('../models/User');
const { Op } = require('sequelize');
const Joi = require('joi');

// Validation schema
const newsSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(50).required(),
  excerpt: Joi.string().max(500).optional(),
  imageUrl: Joi.string().optional().allow('', null), // Allow empty strings, null, URIs, and relative paths
  category: Joi.string().valid('news', 'press_release', 'event', 'announcement').default('news'),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft')
});

// Get all published news
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    const where = { status: 'published' };

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await News.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Ensure image URLs are absolute URLs
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const newsWithAbsoluteUrls = rows.map(newsItem => {
      const newsData = newsItem.toJSON();
      if (newsData.imageUrl && newsData.imageUrl.startsWith('/uploads/')) {
        newsData.imageUrl = `${baseUrl}${newsData.imageUrl}`;
      }
      return newsData;
    });

    res.json({
      news: newsWithAbsoluteUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get single news article
exports.getById = async (req, res) => {
  try {
    const news = await News.findOne({
      where: { id: req.params.id, status: 'published' },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Ensure image URL is absolute
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const newsData = news.toJSON();
    if (newsData.imageUrl && newsData.imageUrl.startsWith('/uploads/')) {
      newsData.imageUrl = `${baseUrl}${newsData.imageUrl}`;
    }

    res.json(newsData);
  } catch (error) {
    console.error('Get news article error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create news article
exports.create = async (req, res) => {
  try {
    const { error, value } = newsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Handle image URL - convert relative URLs to full URLs if needed
    if (value.imageUrl && value.imageUrl.startsWith('/uploads/')) {
      const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      value.imageUrl = `${baseUrl}${value.imageUrl}`;
    } else if (!value.imageUrl || value.imageUrl.trim() === '') {
      value.imageUrl = null; // Set to null if empty
    }

    const newsData = {
      ...value,
      authorId: req.user.userId,
      publishedAt: value.status === 'published' ? new Date() : null
    };

    const news = await News.create(newsData);

    res.status(201).json(news);
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update news article
exports.update = async (req, res) => {
  try {
    const { error, value } = newsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Handle image URL - convert relative URLs to full URLs if needed
    if (value.imageUrl && value.imageUrl.startsWith('/uploads/')) {
      const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      value.imageUrl = `${baseUrl}${value.imageUrl}`;
    } else if (value.imageUrl === '' || value.imageUrl === null) {
      value.imageUrl = null; // Set to null if empty
    }

    const updateData = {
      ...value,
      publishedAt: value.status === 'published' && !news.publishedAt ? new Date() : news.publishedAt
    };

    await news.update(updateData);

    res.json(news);
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete news article
exports.delete = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    await news.destroy();

    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all news for admin dashboard
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

    const { count, rows } = await News.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Ensure image URLs are absolute URLs
    const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const newsWithAbsoluteUrls = rows.map(newsItem => {
      const newsData = newsItem.toJSON();
      if (newsData.imageUrl && newsData.imageUrl.startsWith('/uploads/')) {
        newsData.imageUrl = `${baseUrl}${newsData.imageUrl}`;
      }
      return newsData;
    });

    res.json({
      news: newsWithAbsoluteUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get admin news error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

