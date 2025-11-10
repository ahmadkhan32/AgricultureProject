-- Verify and Fix Services Table
-- This script checks the services table structure and adds any missing columns
-- Run this in phpMyAdmin SQL tab

USE ucaep_db;

-- Check current table structure
DESCRIBE `services`;

-- Add missing columns (run these if columns don't exist)
-- These are safe to run multiple times - they will fail gracefully if columns already exist

-- Add image_url if missing
ALTER TABLE `services` 
ADD COLUMN IF NOT EXISTS `image_url` VARCHAR(500) NULL AFTER `icon`;

-- If your MySQL version doesn't support IF NOT EXISTS, use this instead:
-- ALTER TABLE `services` ADD COLUMN `image_url` VARCHAR(500) NULL AFTER `icon`;

-- Verify all required columns exist
SELECT 
  COLUMN_NAME,
  DATA_TYPE,
  IS_NULLABLE,
  COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'ucaep_db' 
  AND TABLE_NAME = 'services'
ORDER BY ORDINAL_POSITION;

-- Expected columns:
-- id (INT, NOT NULL, AUTO_INCREMENT)
-- title (VARCHAR(200), NOT NULL)
-- description (TEXT, NOT NULL)
-- content (TEXT, NULL)
-- category (ENUM, NOT NULL)
-- icon (VARCHAR(100), NULL)
-- image_url (VARCHAR(500), NULL)  <-- This is the one that was missing
-- status (ENUM, NOT NULL)
-- tags (JSON, NULL)
-- created_by (INT, NULL)
-- created_at (TIMESTAMP, NOT NULL)
-- updated_at (TIMESTAMP, NOT NULL)

