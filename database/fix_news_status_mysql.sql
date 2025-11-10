-- MySQL Fix: Add status column to news table
-- Run this in phpMyAdmin SQL tab
-- Database: ucaep_db (or your database name)
-- 
-- INSTRUCTIONS:
-- 1. Open phpMyAdmin (http://localhost/phpmyadmin)
-- 2. Select your database (ucaep_db)
-- 3. Click on "SQL" tab at the top
-- 4. Copy and paste ALL the code below
-- 5. Click "Go" button
-- 6. Done! Status column will be added

USE ucaep_db;

-- Step 1: Check if status column exists, if not add it
-- MySQL doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN directly
-- So we'll use a procedure or just run ALTER TABLE (it will error if column exists, which is fine)

-- First, check if the column exists
SELECT COUNT(*) as column_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news'
  AND COLUMN_NAME = 'status';

-- Step 2: Add the status column if it doesn't exist
-- If the column already exists, you'll get an error - that's okay, ignore it
ALTER TABLE news 
ADD COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'draft' NOT NULL;

-- Step 3: Update existing news records to have a default status (if any NULL values exist)
UPDATE news 
SET status = 'published' 
WHERE status IS NULL OR status = '';

-- Step 4: Create index for better query performance (if it doesn't exist)
CREATE INDEX idx_status ON news(status);
CREATE INDEX idx_status_published_at ON news(status, published_at);

-- Step 5: Verify the column was added successfully
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    COLUMN_TYPE,
    COLUMN_DEFAULT, 
    IS_NULLABLE,
    COLUMN_KEY
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'status';

-- Expected result should show:
-- status | enum | enum('draft','published','archived') | draft | NO | MUL

