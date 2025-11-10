-- MySQL Database Migration: Create News Table
-- This file creates the complete news table with all CRUD functionality
-- Run this in phpMyAdmin SQL tab or MySQL command line
--
-- INSTRUCTIONS:
-- 1. Open phpMyAdmin (http://localhost/phpmyadmin)
-- 2. Select your database (ucaep_db)
-- 3. Click on "SQL" tab at the top
-- 4. Copy and paste ALL the code below
-- 5. Click "Go" button
-- 6. Done! News table will be created

USE ucaep_db;

-- ============================================
-- CREATE NEWS TABLE
-- ============================================

-- Drop the table if it exists (use with caution in production!)
-- Uncomment the line below only if you want to recreate the table from scratch
-- DROP TABLE IF EXISTS news;

-- Create the news table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url VARCHAR(500),
  author_id INT,
  category ENUM('news', 'press_release', 'event', 'announcement') DEFAULT 'news' NOT NULL,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft' NOT NULL,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_author_id (author_id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_status_published_at (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VERIFY TABLE CREATION
-- ============================================

-- Show table structure
DESCRIBE news;

-- Show all indexes
SHOW INDEX FROM news;

-- Check if table was created successfully
SELECT 
    TABLE_NAME,
    ENGINE,
    TABLE_ROWS,
    CREATE_TIME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news';

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample news articles (only if users table has an admin user)
-- Uncomment the section below to insert sample data

/*
-- Insert sample published news
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
(
  'Welcome to Our Agricultural Platform',
  'We are excited to announce the launch of our comprehensive agricultural platform designed to support local farmers and producers. This platform offers resources, connections, and opportunities for growth in the agricultural sector.',
  'Announcing the launch of our new agricultural platform',
  'announcement',
  'published',
  NOW()
),
(
  'New Training Program for Organic Farming',
  'Join our comprehensive training program focused on organic farming practices. Learn sustainable techniques, improve crop yields, and connect with experienced farmers in your region.',
  'Comprehensive training program for organic farming practices',
  'event',
  'published',
  NOW()
),
(
  'Partnership with Local Farmers Association',
  'We are pleased to announce our new partnership with the Local Farmers Association. This collaboration will bring more resources and support to our community members.',
  'New partnership brings more resources to the community',
  'press_release',
  'published',
  NOW()
),
(
  'Upcoming Workshop: Modern Irrigation Techniques',
  'Register for our upcoming workshop on modern irrigation techniques. Learn about water-efficient systems, cost-effective solutions, and best practices from industry experts.',
  'Learn modern irrigation techniques in our upcoming workshop',
  'event',
  'published',
  DATE_ADD(NOW(), INTERVAL 7 DAY)
),
(
  'Draft Article: Future Projects Preview',
  'This is a draft article about future projects and initiatives. It will be published after final review.',
  'Preview of upcoming projects',
  'news',
  'draft',
  NULL
);

-- Verify sample data
SELECT 
    id, 
    title, 
    category, 
    status, 
    DATE(published_at) as publish_date,
    created_at
FROM news
ORDER BY created_at DESC;
*/

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get all published news
-- SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;

-- Get all draft news
-- SELECT * FROM news WHERE status = 'draft' ORDER BY created_at DESC;

-- Get news by category
-- SELECT * FROM news WHERE category = 'news' AND status = 'published' ORDER BY published_at DESC;

-- Update news status
-- UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;

-- Delete news (use with caution!)
-- DELETE FROM news WHERE id = 1;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

SELECT 'News table created successfully!' as Status;

