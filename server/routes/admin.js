const express = require('express');
const supabase = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get counts for different entities
    const [
      { count: totalUsers },
      { count: totalProducers },
      { count: approvedProducers },
      { count: pendingProducers },
      { count: totalNews },
      { count: publishedNews },
      { count: totalServices },
      { count: totalPartnerships },
      { count: totalResources },
      { count: totalEvents },
      { count: newContactMessages }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('producers').select('*', { count: 'exact', head: true }),
      supabase.from('producers').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('producers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('news').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('partnerships').select('*', { count: 'exact', head: true }),
      supabase.from('resources').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new')
    ]);

    // Get recent activity
    const { data: recentNews } = await supabase
      .from('news')
      .select('title, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentProducers } = await supabase
      .from('producers')
      .select('business_name, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentMessages } = await supabase
      .from('contact_messages')
      .select('name, subject, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get producer statistics by region
    const { data: producerRegions } = await supabase
      .from('producers')
      .select('region, status')
      .eq('status', 'approved');

    const regionStats = producerRegions.reduce((acc, producer) => {
      acc[producer.region] = (acc[producer.region] || 0) + 1;
      return acc;
    }, {});

    // Get producer statistics by business type
    const { data: producerTypes } = await supabase
      .from('producers')
      .select('business_type, status')
      .eq('status', 'approved');

    const typeStats = producerTypes.reduce((acc, producer) => {
      acc[producer.business_type] = (acc[producer.business_type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      overview: {
        totalUsers,
        totalProducers,
        approvedProducers,
        pendingProducers,
        totalNews,
        publishedNews,
        totalServices,
        totalPartnerships,
        totalResources,
        totalEvents,
        newContactMessages
      },
      recentActivity: {
        news: recentNews,
        producers: recentProducers,
        messages: recentMessages
      },
      statistics: {
        producersByRegion: regionStats,
        producersByType: typeStats
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch users' });
    }

    res.json({
      users: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['admin', 'producer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update user role' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get contact messages
router.get('/contact-messages', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch contact messages' });
    }

    res.json({
      messages: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update contact message status
router.patch('/contact-messages/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update message status' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get events
router.get('/events', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('events')
      .select(`
        *,
        creator:profiles(first_name, last_name)
      `)
      .order('event_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch events' });
    }

    res.json({
      events: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create event
router.post('/events', async (req, res) => {
  try {
    const { title, description, event_date, end_date, location, image_url, registration_url, max_attendees } = req.body;

    const eventData = {
      title,
      description,
      event_date,
      end_date,
      location,
      image_url,
      registration_url,
      max_attendees,
      created_by: req.user.user.id
    };

    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to create event' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update event
router.put('/events/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to update event' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete event
router.delete('/events/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ message: 'Failed to delete event' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
