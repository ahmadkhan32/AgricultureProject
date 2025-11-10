-- Quick Test Queries for News CRUD
-- Use these queries to quickly test the News table

USE ucaep_db;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- 1. Check if news table exists
SHOW TABLES LIKE 'news';

-- 2. View table structure
DESCRIBE news;

-- 3. Check current news count
SELECT COUNT(*) as total_news FROM news;

-- 4. Check news by status
SELECT status, COUNT(*) as count 
FROM news 
GROUP BY status;

-- ============================================
-- INSERT TEST DATA
-- ============================================

-- Insert a test published news article
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
(
  'Test News Article',
  'This is a comprehensive test article with at least 50 characters to meet validation requirements. It demonstrates the news functionality.',
  'A test article to verify news CRUD operations',
  'news',
  'published',
  NOW()
);

-- Insert a draft article
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
(
  'Draft Article Example',
  'This is a draft article that should not be visible to the public. It demonstrates the draft status functionality.',
  'Example of a draft article',
  'news',
  'draft',
  NULL
);

-- Insert an announcement
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
(
  'Important Announcement',
  'This is an important announcement for all platform users. Please read carefully as it contains crucial information.',
  'Read this important announcement',
  'announcement',
  'published',
  NOW()
);

-- ============================================
-- READ OPERATIONS
-- ============================================

-- Get all published news (what public users see)
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;

-- Get all news including drafts (admin view)
SELECT * FROM news ORDER BY created_at DESC;

-- Get news by category
SELECT * FROM news WHERE category = 'news' AND status = 'published';

-- Get single news by ID
SELECT * FROM news WHERE id = 1;

-- Search in title
SELECT * FROM news 
WHERE title LIKE '%test%' AND status = 'published';

-- Get recent news (last 5 articles)
SELECT * FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC 
LIMIT 5;

-- ============================================
-- UPDATE OPERATIONS
-- ============================================

-- Update news status to published
UPDATE news 
SET status = 'published', published_at = NOW() 
WHERE id = 1;

-- Update news title and content
UPDATE news 
SET 
    title = 'Updated Title',
    content = 'This is the updated content with sufficient length',
    updated_at = NOW()
WHERE id = 1;

-- Archive old news
UPDATE news 
SET status = 'archived' 
WHERE published_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- ============================================
-- DELETE OPERATIONS
-- ============================================

-- Delete a specific news article (use with caution!)
-- DELETE FROM news WHERE id = 1;

-- Delete all draft articles older than 30 days (use with caution!)
-- DELETE FROM news 
-- WHERE status = 'draft' 
--   AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- ============================================
-- STATISTICS & ANALYTICS
-- ============================================

-- Count news by category
SELECT 
    category, 
    COUNT(*) as count,
    SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_count
FROM news 
GROUP BY category;

-- Count news by status
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM news), 2) as percentage
FROM news 
GROUP BY status;

-- Get news with author information
SELECT 
    n.id,
    n.title,
    n.category,
    n.status,
    n.published_at,
    CONCAT(u.first_name, ' ', u.last_name) as author_name
FROM news n
LEFT JOIN users u ON n.author_id = u.id
ORDER BY n.created_at DESC;

-- Most recent news per category
SELECT 
    n1.category,
    n1.title,
    n1.published_at
FROM news n1
INNER JOIN (
    SELECT category, MAX(published_at) as max_date
    FROM news
    WHERE status = 'published'
    GROUP BY category
) n2 ON n1.category = n2.category AND n1.published_at = n2.max_date
WHERE n1.status = 'published'
ORDER BY n1.published_at DESC;

-- ============================================
-- CLEANUP (Use with Caution!)
-- ============================================

-- Remove all test data
-- DELETE FROM news WHERE title LIKE '%Test%' OR title LIKE '%Draft%' OR title LIKE '%Example%';

-- Reset table completely (DANGEROUS - use only if you want to start over!)
-- TRUNCATE TABLE news;

-- ============================================
-- FINAL VERIFICATION
-- ============================================

-- Show final state
SELECT 
    'News Table Status' as info,
    COUNT(*) as total_articles,
    SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
    SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts,
    SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived
FROM news;

-- Show last 5 news articles
SELECT 
    id,
    title,
    category,
    status,
    DATE(created_at) as created,
    DATE(published_at) as published
FROM news 
ORDER BY created_at DESC 
LIMIT 5;

