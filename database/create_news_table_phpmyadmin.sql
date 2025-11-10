-- ============================================
-- NEWS TABLE CREATION SCRIPT FOR PHPMYADMIN
-- ============================================
-- Instructions:
-- 1. Open phpMyAdmin: http://localhost/phpmyadmin
-- 2. Select your database (ucaep_db)
-- 3. Click "SQL" tab
-- 4. Copy and paste this entire file
-- 5. Click "Go"
-- ============================================

USE ucaep_db;

-- Check if users table exists (required for foreign key)
-- If this fails, create users table first
SET @users_exists = (
    SELECT COUNT(*) 
    FROM information_schema.tables 
    WHERE table_schema = DATABASE() 
    AND table_name = 'users'
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT 'News article title',
  content TEXT NOT NULL COMMENT 'Full article content (min 50 chars)',
  excerpt TEXT COMMENT 'Short summary/excerpt (max 500 chars)',
  image_url VARCHAR(500) COMMENT 'URL to news article image (supports /uploads/images/...)',
  author_id INT COMMENT 'ID of user who created the article',
  category ENUM('news', 'press_release', 'event', 'announcement') DEFAULT 'news' NOT NULL COMMENT 'Article category',
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft' NOT NULL COMMENT 'Publication status',
  published_at TIMESTAMP NULL COMMENT 'When article was published (auto-set when status=published)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last update time',
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_author_id (author_id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_status_published_at (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='News articles, press releases, events, and announcements';

-- ============================================
-- VERIFY TABLE CREATION
-- ============================================

-- Show table structure
DESCRIBE news;

-- Show all indexes
SHOW INDEX FROM news;

-- Check table exists
SELECT 
    'News table created successfully!' AS status,
    TABLE_NAME,
    ENGINE,
    TABLE_ROWS,
    CREATE_TIME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news';

-- ============================================
-- VERIFY COLUMNS
-- ============================================

SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news'
ORDER BY ORDINAL_POSITION;

