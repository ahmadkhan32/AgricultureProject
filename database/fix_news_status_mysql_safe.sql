-- MySQL Safe Fix: Add status column to news table (Safe Version - No Errors)
-- Run this in phpMyAdmin SQL tab
-- This version checks first before adding column to avoid errors

USE ucaep_db;

-- Step 1: Add status column ONLY if it doesn't exist
-- This uses a stored procedure approach to avoid errors

DELIMITER $$

CREATE PROCEDURE AddStatusColumnIfNotExists()
BEGIN
    DECLARE column_exists INT DEFAULT 0;
    
    -- Check if column exists
    SELECT COUNT(*) INTO column_exists
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'news'
      AND COLUMN_NAME = 'status';
    
    -- Add column if it doesn't exist
    IF column_exists = 0 THEN
        ALTER TABLE news 
        ADD COLUMN status ENUM('draft', 'published', 'archived') 
        DEFAULT 'draft' NOT NULL AFTER category;
        
        SELECT 'Status column added successfully!' AS Result;
    ELSE
        SELECT 'Status column already exists!' AS Result;
    END IF;
END$$

DELIMITER ;

-- Execute the procedure
CALL AddStatusColumnIfNotExists();

-- Drop the procedure (cleanup)
DROP PROCEDURE IF EXISTS AddStatusColumnIfNotExists;

-- Step 2: Update existing news records (if any)
UPDATE news 
SET status = COALESCE(status, 'published') 
WHERE status IS NULL OR status = '';

-- Step 3: Create indexes if they don't exist
-- Note: CREATE INDEX IF NOT EXISTS is not supported in older MySQL versions
-- So we'll just create them (will error if exist, but that's okay)

-- Check if index exists before creating
SET @index_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'news'
      AND INDEX_NAME = 'idx_status'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX idx_status ON news(status)',
    'SELECT "Index idx_status already exists" AS Message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create composite index
SET @index_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'news'
      AND INDEX_NAME = 'idx_status_published_at'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX idx_status_published_at ON news(status, published_at)',
    'SELECT "Index idx_status_published_at already exists" AS Message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 4: Verify the column
SELECT 
    COLUMN_NAME AS 'Column Name', 
    DATA_TYPE AS 'Data Type',
    COLUMN_TYPE AS 'Full Type',
    COLUMN_DEFAULT AS 'Default Value', 
    IS_NULLABLE AS 'Nullable'
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'status';

