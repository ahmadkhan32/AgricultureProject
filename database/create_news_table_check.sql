-- ============================================
-- NEWS TABLE VERIFICATION & FIX SCRIPT
-- ============================================
-- Use this if table already exists but needs fixes
-- ============================================

USE ucaep_db;

-- Check if table exists
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'Table exists ✓'
        ELSE 'Table does NOT exist ✗'
    END AS table_status
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
  AND table_name = 'news';

-- Check if required columns exist
SELECT 
    CASE 
        WHEN COUNT(*) = 11 THEN 'All columns exist ✓'
        ELSE CONCAT('Missing columns! Expected 11, found ', COUNT(*), ' ✗')
    END AS columns_status
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news';

-- Add missing columns if needed
-- (Only add what's missing, won't duplicate if exists)

-- Add image_url if missing
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'news' 
    AND COLUMN_NAME = 'image_url'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE news ADD COLUMN image_url VARCHAR(500) AFTER excerpt',
    'SELECT "image_url column already exists" AS status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add status if missing
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'news' 
    AND COLUMN_NAME = 'status'
);

SET @sql = IF(@col_exists = 0,
    "ALTER TABLE news ADD COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'draft' NOT NULL AFTER category",
    'SELECT "status column already exists" AS status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add published_at if missing
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'news' 
    AND COLUMN_NAME = 'published_at'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE news ADD COLUMN published_at TIMESTAMP NULL AFTER status',
    'SELECT "published_at column already exists" AS status'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify final structure
DESCRIBE news;

SELECT 'News table verification complete!' AS status;

