-- ============================================
-- UCAEP DATABASE - ALL COMMANDS IN ONE FILE
-- Copy sections you need and paste in phpMyAdmin SQL tab
-- ============================================

-- ============================================
-- SETUP (Run First)
-- ============================================

USE ucaep_db;

-- ============================================
-- CREATE DATABASE (If doesn't exist)
-- ============================================

CREATE DATABASE IF NOT EXISTS ucaep_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE ucaep_db;

-- ============================================
-- INSERT NEWS ARTICLES (Create)
-- ============================================

USE ucaep_db;

-- Insert single published news
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
(
  'Titre de l''Article',
  'Contenu complet de l''article avec toutes les informations nécessaires. Le contenu doit être suffisamment long pour passer la validation.',
  'Description courte de l''article',
  'news',
  'published',
  NOW()
);

-- Insert multiple news at once
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Article 1', 'Contenu 1...', 'Description 1', 'news', 'published', NOW()),
('Article 2', 'Contenu 2...', 'Description 2', 'event', 'published', NOW()),
('Article 3', 'Contenu 3...', 'Description 3', 'announcement', 'published', NOW());

-- Insert draft (will not show on frontend)
INSERT INTO news (title, content, excerpt, category, status) VALUES
('Article Brouillon', 'Contenu...', 'Description', 'news', 'draft');

-- ============================================
-- VIEW NEWS ARTICLES (Read)
-- ============================================

USE ucaep_db;

-- View all published news (what frontend shows)
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;

-- View all news including drafts (admin view)
SELECT id, title, category, status, published_at FROM news ORDER BY created_at DESC;

-- View latest 10 published news
SELECT id, title, excerpt, category, published_at 
FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC 
LIMIT 10;

-- View single article
SELECT * FROM news WHERE id = 1;

-- Search news
SELECT * FROM news 
WHERE title LIKE '%agriculture%' 
AND status = 'published';

-- View by category
SELECT * FROM news 
WHERE category = 'event' 
AND status = 'published';

-- Count news
SELECT COUNT(*) FROM news WHERE status = 'published';

-- ============================================
-- UPDATE NEWS ARTICLES (Edit)
-- ============================================

USE ucaep_db;

-- Publish a draft article
UPDATE news 
SET status = 'published', published_at = NOW() 
WHERE id = 1;

-- Update news content
UPDATE news 
SET 
  title = 'Nouveau Titre',
  content = 'Nouveau contenu complet...',
  excerpt = 'Nouvelle description',
  updated_at = NOW()
WHERE id = 1;

-- Change status to archived
UPDATE news 
SET status = 'archived' 
WHERE id = 2;

-- Change back to draft
UPDATE news 
SET status = 'draft', published_at = NULL 
WHERE id = 2;

-- Update category
UPDATE news 
SET category = 'event' 
WHERE id = 1;

-- Publish all drafts older than 7 days
UPDATE news 
SET status = 'published', published_at = NOW() 
WHERE status = 'draft' 
AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- ============================================
-- DELETE NEWS ARTICLES (Remove)
-- ============================================

USE ucaep_db;

-- Delete single article
DELETE FROM news WHERE id = 1;

-- Delete multiple articles
DELETE FROM news WHERE id IN (1, 2, 3);

-- Delete old drafts (older than 30 days)
DELETE FROM news 
WHERE status = 'draft' 
AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Delete test articles
DELETE FROM news WHERE title LIKE '%Test%';

-- ============================================
-- INSERT PRODUCERS (Create)
-- ============================================

USE ucaep_db;

-- First get user_id
SELECT id FROM users WHERE email = 'admin@ucaep.com';

-- Insert producer (replace 1 with actual user_id)
INSERT INTO producers (user_id, business_name, business_type, location, region, description, status) VALUES
(
  1,
  'Nom de l''Entreprise',
  'agriculture',
  'Moroni, Grande Comore',
  'Grande Comore',
  'Description de l''entreprise agricole',
  'approved'
);

-- ============================================
-- VIEW PRODUCERS (Read)
-- ============================================

USE ucaep_db;

-- View all approved producers
SELECT * FROM producers WHERE status = 'approved' ORDER BY created_at DESC;

-- View producers with user info
SELECT 
  p.id, p.business_name, p.business_type, p.region, p.status,
  u.email, u.first_name, u.last_name
FROM producers p
LEFT JOIN users u ON p.user_id = u.id
WHERE p.status = 'approved';

-- ============================================
-- UPDATE PRODUCERS (Edit)
-- ============================================

USE ucaep_db;

-- Approve producer
UPDATE producers SET status = 'approved' WHERE id = 1;

-- Update producer info
UPDATE producers 
SET 
  business_name = 'Nouveau Nom',
  description = 'Nouvelle description',
  location = 'Nouvelle Location'
WHERE id = 1;

-- ============================================
-- DELETE PRODUCERS (Remove)
-- ============================================

USE ucaep_db;

DELETE FROM producers WHERE id = 1;

-- ============================================
-- INSERT PARTNERSHIPS (Create)
-- ============================================

USE ucaep_db;

INSERT INTO partnerships (name, description, partner_type, website, status) VALUES
(
  'Nom du Partenaire',
  'Description du partenariat',
  'international',
  'https://example.com',
  'active'
);

-- ============================================
-- VIEW PARTNERSHIPS (Read)
-- ============================================

USE ucaep_db;

SELECT * FROM partnerships WHERE status = 'active' ORDER BY created_at DESC;

-- ============================================
-- UPDATE PARTNERSHIPS (Edit)
-- ============================================

USE ucaep_db;

UPDATE partnerships 
SET status = 'inactive' 
WHERE id = 1;

-- ============================================
-- DELETE PARTNERSHIPS (Remove)
-- ============================================

USE ucaep_db;

DELETE FROM partnerships WHERE id = 1;

-- ============================================
-- USEFUL QUERIES (Statistics & Verification)
-- ============================================

USE ucaep_db;

-- Count all records
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM news) as total_news,
  (SELECT COUNT(*) FROM producers) as total_producers,
  (SELECT COUNT(*) FROM partnerships) as total_partnerships;

-- News by status
SELECT status, COUNT(*) as count 
FROM news 
GROUP BY status;

-- News by category
SELECT category, COUNT(*) as count 
FROM news 
GROUP BY category;

-- Show table structure
DESCRIBE news;
DESCRIBE producers;
DESCRIBE partnerships;

-- Show all tables
SHOW TABLES;

-- ============================================
-- COMPLETE EXAMPLE: Create & Publish News
-- ============================================

USE ucaep_db;

-- Step 1: Create as draft
INSERT INTO news (title, content, excerpt, category, status) VALUES
('Nouvel Article', 'Contenu complet...', 'Description', 'news', 'draft');

-- Step 2: Get the ID (note it from output)
SELECT LAST_INSERT_ID() as new_id;

-- Step 3: Publish it (replace NEW_ID with actual ID)
UPDATE news 
SET status = 'published', published_at = NOW() 
WHERE id = LAST_INSERT_ID();

-- Step 4: Verify
SELECT * FROM news WHERE id = LAST_INSERT_ID();

-- ============================================
-- END OF COMMANDS
-- ============================================

