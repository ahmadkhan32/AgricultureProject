-- ============================================
-- SIMPLE SQL: Add Status Column to News Table
-- ============================================
-- Copy this ENTIRE code and paste in phpMyAdmin SQL tab
-- 
-- INSTRUCTIONS:
-- 1. Open http://localhost/phpmyadmin
-- 2. Select your database (ucaep_db)
-- 3. Click "SQL" tab
-- 4. Paste this code
-- 5. Click "Go"
-- ============================================

USE ucaep_db;

-- Add status column to news table
ALTER TABLE news 
ADD COLUMN status ENUM('draft', 'published', 'archived') 
DEFAULT 'draft' NOT NULL;

-- Update existing news records (if any)
UPDATE news 
SET status = 'published' 
WHERE status IS NULL;

-- Verify: Check if column was added
SELECT id, title, status 
FROM news 
LIMIT 5;

