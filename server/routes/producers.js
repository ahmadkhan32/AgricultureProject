const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const producerSchema = Joi.object({
  business_name: Joi.string().min(2).max(200).required(),
  business_type: Joi.string().valid('agriculture', 'livestock', 'fisheries', 'mixed').required(),
  description: Joi.string().min(20).max(1000).optional(),
  location: Joi.string().min(5).max(200).required(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  region: Joi.string().min(2).max(100).required(),
  products: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional(),
  contact_email: Joi.string().email().optional(),
  contact_phone: Joi.string().optional(),
  website: Joi.string().uri().optional(),
  social_media: Joi.object().optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

// Get all approved producers
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, region, business_type, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('producers')
      .select(`
        *,
        user:profiles(first_name, last_name, email)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (region) {
      query = query.eq('region', region);
    }

    if (business_type) {
      query = query.eq('business_type', business_type);
    }

    if (search) {
      query = query.or(`business_name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch producers' });
    }

    res.json({
      producers: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get producers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single producer
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('producers')
      .select(`
        *,
        user:profiles(first_name, last_name, email)
      `)
      .eq('id', req.params.id)
      .eq('status', 'approved')
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Producer not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get producer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create producer profile
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = producerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already has a producer profile
    const { data: existingProducer } = await supabase
      .from('producers')
      .select('id')
      .eq('user_id', req.user.user.id)
      .single();

    if (existingProducer) {
      return res.status(400).json({ message: 'Producer profile already exists' });
    }

    const producerData = {
      ...value,
      user_id: req.user.user.id,
      status: 'pending'
    };

    const { data, error: insertError } = await supabase
      .from('producers')
      .insert(producerData)
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ message: 'Failed to create producer profile' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create producer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update producer profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { error, value } = producerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user owns this producer profile or is admin
    const { data: producer } = await supabase
      .from('producers')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (!producer) {
      return res.status(404).json({ message: 'Producer profile not found' });
    }

    // Check if user is admin or owns the profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.user.id)
      .single();

    if (profile.role !== 'admin' && producer.user_id !== req.user.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { data, error: updateError } = await supabase
      .from('producers')
      .update(value)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ message: 'Failed to update producer profile' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update producer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's own producer profile
router.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('producers')
      .select('*')
      .eq('user_id', req.user.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ message: 'Failed to fetch producer profile' });
    }

    res.json(data || null);
  } catch (error) {
    console.error('Get user producer profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get producers by region for map
router.get('/map/regions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('producers')
      .select('region, business_type, latitude, longitude, business_name, id')
      .eq('status', 'approved')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch producer locations' });
    }

    // Group by region
    const regions = data.reduce((acc, producer) => {
      if (!acc[producer.region]) {
        acc[producer.region] = [];
      }
      acc[producer.region].push(producer);
      return acc;
    }, {});

    res.json(regions);
  } catch (error) {
    console.error('Get producer regions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin routes
// Get all producers for admin dashboard
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, region, business_type } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('producers')
      .select(`
        *,
        user:profiles(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (region) {
      query = query.eq('region', region);
    }

    if (business_type) {
      query = query.eq('business_type', business_type);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch producers' });
    }

    res.json({
      producers: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get admin producers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update producer status (Admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('producers')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update producer status' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update producer status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
