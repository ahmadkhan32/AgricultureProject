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
      `);

    // Try to filter by status, but handle if column doesn't exist
    try {
      query = query.eq('status', 'published');
    } catch (e) {
      // Status column might not exist, continue without filter
      console.warn('Status column not available, showing all news');
    }

    query = query.order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Get news error:', error);
      
      // If status column is missing, try query without status filter
      if (error.message && (error.message.includes('status') || error.message.includes('schema cache'))) {
        let fallbackQuery = supabase
          .from('news')
          .select(`
            *,
            author:profiles(first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
        
        if (category) {
          fallbackQuery = fallbackQuery.eq('category', category);
        }
        
        if (search) {
          fallbackQuery = fallbackQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
        }
        
        const { data: fallbackData, error: fallbackError, count: fallbackCount } = await fallbackQuery;
        
        if (fallbackError) {
          return res.status(500).json({ 
            message: 'Database schema error: status column missing from news table. Please run the migration script at database/fix_news_status.sql in your Supabase SQL Editor.',
            error: fallbackError.message,
            fix: 'Run the SQL script: database/fix_news_status.sql'
          });
        }
        
        return res.json({
          news: fallbackData,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: fallbackCount,
            pages: Math.ceil(fallbackCount / limit)
          },
          warning: 'Status column missing - showing all news articles'
        });
      }
      
      return res.status(500).json({ 
        message: 'Failed to fetch news',
        error: error.message 
      });
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
    let query = supabase
      .from('news')
      .select(`
        *,
        author:profiles(first_name, last_name)
      `)
      .eq('id', req.params.id);
    
    // Try to filter by status, handle gracefully if column doesn't exist
    try {
      query = query.eq('status', 'published');
    } catch (e) {
      // Status column might not exist, continue without filter
    }
    
    const { data, error } = await query.single();

    if (error) {
      console.error('Supabase error:', error);
      
      // If status column is missing, try query without status filter
      if (error.message && (error.message.includes('status') || error.message.includes('schema cache'))) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('news')
          .select(`
            *,
            author:profiles(first_name, last_name)
          `)
          .eq('id', req.params.id)
          .single();
        
        if (fallbackError) {
          return res.status(500).json({ 
            message: 'Database schema error: status column missing from news table. Please run the migration script at database/fix_news_status.sql in your Supabase SQL Editor.',
            error: fallbackError.message,
            fix: 'Run the SQL script: database/fix_news_status.sql'
          });
        }
        
        if (!fallbackData) {
          return res.status(404).json({ message: 'News article not found' });
        }
        
        return res.json(fallbackData);
      }
      
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      return res.status(500).json({ 
        message: 'Failed to fetch news article',
        error: error.message 
      });
    }

    if (!data) {
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

    // Prepare news data - handle status column gracefully
    const newsData = {
      title: value.title,
      content: value.content,
      excerpt: value.excerpt,
      image_url: value.image_url,
      category: value.category || 'news',
      author_id: req.user.user.id,
      published_at: value.status === 'published' ? new Date().toISOString() : null
    };

    // Only include status if the column exists (try-catch will handle it)
    // If status column doesn't exist, we'll get an error and handle it
    try {
      newsData.status = value.status || 'draft';
    } catch (e) {
      // Status column might not exist, continue without it
    }

    const { data, error: insertError } = await supabase
      .from('news')
      .insert(newsData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Check if error is about missing status column
      if (insertError.message && (insertError.message.includes('status') || insertError.message.includes('schema cache'))) {
        // Try again without status column
        delete newsData.status;
        const { data: retryData, error: retryError } = await supabase
          .from('news')
          .insert(newsData)
          .select()
          .single();
        
        if (retryError) {
          return res.status(500).json({ 
            message: 'Database schema error: status column missing from news table. Please run the migration script at database/fix_news_status.sql in your Supabase SQL Editor.',
            error: retryError.message,
            fix: 'Run the SQL script: database/fix_news_status.sql'
          });
        }
        
        return res.status(201).json(retryData);
      }
      
      return res.status(500).json({ 
        message: 'Failed to create news article',
        error: insertError.message 
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update news article (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, value } = newsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Prepare update data
    const updateData = {
      title: value.title,
      content: value.content,
      excerpt: value.excerpt,
      image_url: value.image_url,
      category: value.category,
      published_at: value.status === 'published' ? new Date().toISOString() : null
    };

    // Include status if provided
    if (value.status) {
      updateData.status = value.status;
    }

    const { data, error: updateError } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      
      // Check if error is about missing status column
      if (updateError.message && (updateError.message.includes('status') || updateError.message.includes('schema cache'))) {
        // Try again without status column
        delete updateData.status;
        const { data: retryData, error: retryError } = await supabase
          .from('news')
          .update(updateData)
          .eq('id', req.params.id)
          .select()
          .single();
        
        if (retryError) {
          return res.status(500).json({ 
            message: 'Database schema error: status column missing from news table. Please run the migration script at database/fix_news_status.sql in your Supabase SQL Editor.',
            error: retryError.message,
            fix: 'Run the SQL script: database/fix_news_status.sql'
          });
        }
        
        return res.json(retryData);
      }
      
      return res.status(500).json({ 
        message: 'Failed to update news article',
        error: updateError.message 
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete news article (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error, data } = await supabase
      .from('news')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      console.error('Delete error:', error);
      
      // Check if error is related to schema
      if (error.message && (error.message.includes('status') || error.message.includes('schema cache'))) {
        return res.status(500).json({ 
          message: 'Database schema error: status column missing from news table. Please run the migration script at database/fix_news_status.sql in your Supabase SQL Editor.',
          error: error.message,
          fix: 'Run the SQL script: database/fix_news_status.sql'
        });
      }
      
      return res.status(500).json({ 
        message: 'Failed to delete news article',
        error: error.message 
      });
    }

    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
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

    // Only filter by status if status column exists and status is provided
    if (status) {
      try {
        query = query.eq('status', status);
      } catch (e) {
        console.warn('Status column not available, ignoring status filter');
      }
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      if (error.message && (error.message.includes('status') || error.message.includes('schema cache'))) {
        return res.status(500).json({ 
          message: 'Database schema error: status column missing from news table. Please run the migration script at database/fix_news_status.sql in your Supabase SQL Editor.',
          error: error.message,
          fix: 'Run the SQL script: database/fix_news_status.sql'
        });
      }
      return res.status(500).json({ 
        message: 'Failed to fetch news',
        error: error.message 
      });
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
