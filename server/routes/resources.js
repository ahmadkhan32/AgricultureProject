const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const resourceSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).max(500).optional(),
  file_url: Joi.string().uri().required(),
  file_type: Joi.string().required(),
  file_size: Joi.number().positive().optional(),
  category: Joi.string().valid('document', 'form', 'report', 'law', 'statistics', 'guide').required(),
  tags: Joi.array().items(Joi.string()).optional()
});

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch resources' });
    }

    res.json({
      resources: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment download count
    await supabase
      .from('resources')
      .update({ download_count: data.download_count + 1 })
      .eq('id', req.params.id);

    res.json(data);
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create resource (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = resourceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const resourceData = {
      ...value,
      created_by: req.user.user.id
    };

    const { data, error: insertError } = await supabase
      .from('resources')
      .insert(resourceData)
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ message: 'Failed to create resource' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update resource (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = resourceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { data, error: updateError } = await supabase
      .from('resources')
      .update(value)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ message: 'Failed to update resource' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete resource (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete resource' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all resources for admin dashboard
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('resources')
      .select(`
        *,
        creator:profiles(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch resources' });
    }

    res.json({
      resources: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get admin resources error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get resource statistics
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('category, download_count');

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch resource statistics' });
    }

    // Calculate statistics
    const stats = {
      totalResources: data.length,
      totalDownloads: data.reduce((sum, resource) => sum + resource.download_count, 0),
      byCategory: data.reduce((acc, resource) => {
        acc[resource.category] = (acc[resource.category] || 0) + 1;
        return acc;
      }, {}),
      topDownloads: data
        .sort((a, b) => b.download_count - a.download_count)
        .slice(0, 10)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get resource stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
