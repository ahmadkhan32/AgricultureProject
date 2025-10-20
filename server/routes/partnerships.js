const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const partnershipSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(20).max(1000).required(),
  partner_type: Joi.string().valid('local', 'international', 'government', 'ngo', 'private').required(),
  logo_url: Joi.string().uri().optional(),
  website: Joi.string().uri().optional(),
  contact_info: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    contact_person: Joi.string().optional()
  }).optional(),
  status: Joi.string().valid('active', 'inactive', 'pending').default('active')
});

// Get all active partnerships
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, partner_type } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('partnerships')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (partner_type) {
      query = query.eq('partner_type', partner_type);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch partnerships' });
    }

    res.json({
      partnerships: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get partnerships error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single partnership
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .eq('id', req.params.id)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Partnership not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get partnership error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create partnership (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = partnershipSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { data, error: insertError } = await supabase
      .from('partnerships')
      .insert(value)
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ message: 'Failed to create partnership' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create partnership error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update partnership (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = partnershipSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { data, error: updateError } = await supabase
      .from('partnerships')
      .update(value)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ message: 'Failed to update partnership' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update partnership error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete partnership (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('partnerships')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete partnership' });
    }

    res.json({ message: 'Partnership deleted successfully' });
  } catch (error) {
    console.error('Delete partnership error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all partnerships for admin dashboard
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, partner_type } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('partnerships')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (partner_type) {
      query = query.eq('partner_type', partner_type);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch partnerships' });
    }

    res.json({
      partnerships: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get admin partnerships error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
