const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const newsSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(50).required(),
  excerpt: Joi.string().max(500).optional(),
  image_url: Joi.string().uri().optional(),
  category: Joi.string().valid('news', 'press_release', 'event', 'announcement').default('news'),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft')
});

// Get all published news
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('news')
      .select(`
        *,
        author:profiles(first_name, last_name)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch news' });
    }

    res.json({
      news: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single news article
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        author:profiles(first_name, last_name)
      `)
      .eq('id', req.params.id)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'News article not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get news article error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create news article (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = newsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newsData = {
      ...value,
      author_id: req.user.user.id,
      published_at: value.status === 'published' ? new Date().toISOString() : null
    };

    const { data, error: insertError } = await supabase
      .from('news')
      .insert(newsData)
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ message: 'Failed to create news article' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update news article (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = newsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updateData = {
      ...value,
      published_at: value.status === 'published' ? new Date().toISOString() : null
    };

    const { data, error: updateError } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ message: 'Failed to update news article' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete news article (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete news article' });
    }

    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all news for admin dashboard
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('news')
      .select(`
        *,
        author:profiles(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch news' });
    }

    res.json({
      news: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get admin news error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
