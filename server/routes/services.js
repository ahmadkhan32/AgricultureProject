const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const serviceSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).max(500).required(),
  content: Joi.string().min(50).optional(),
  icon: Joi.string().optional(),
  image_url: Joi.string().uri().optional(),
  category: Joi.string().valid('support', 'training', 'assistance', 'project').default('support'),
  status: Joi.string().valid('active', 'inactive').default('active')
});

// Get all active services
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch services' });
    }

    res.json({
      services: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', req.params.id)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create service (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { data, error: insertError } = await supabase
      .from('services')
      .insert(value)
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ message: 'Failed to create service' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update service (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = serviceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { data, error: updateError } = await supabase
      .from('services')
      .update(value)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ message: 'Failed to update service' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete service (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete service' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all services for admin dashboard
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('services')
      .select('*')
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
      return res.status(500).json({ message: 'Failed to fetch services' });
    }

    res.json({
      services: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get admin services error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
