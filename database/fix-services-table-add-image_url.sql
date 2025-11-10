-- Fix Services Table - Add missing image_url column
-- Run this SQL in phpMyAdmin if you get "Unknown column 'image_url' in 'field list'" error

USE ucaep_db;

-- Check if column exists first (for MySQL 8.0+)
-- If your MySQL version doesn't support IF NOT EXISTS, just run the ALTER TABLE without it

-- Add image_url column
ALTER TABLE `services` 
ADD COLUMN `image_url` VARCHAR(500) NULL AFTER `icon`;

-- Verify the column was added
DESCRIBE `services`;
