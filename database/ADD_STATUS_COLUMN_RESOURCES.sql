-- Quick Fix: Add Status Column to Resources Table
-- Run this if you're getting "status column missing" error
-- This is a simple script that just adds the missing column

USE ucaep_db;

-- Add status column if it doesn't exist
ALTER TABLE `resources` 
ADD COLUMN IF NOT EXISTS `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' AFTER `category`;

-- Update all existing records to have active status
UPDATE `resources` SET `status` = 'active' WHERE `status` IS NULL OR `status` = '';

-- Verify the column was added
DESCRIBE `resources`;

-- Show current resources count
SELECT COUNT(*) as total_resources, 
       SUM(CASE WHEN `status` = 'active' THEN 1 ELSE 0 END) as active_resources,
       SUM(CASE WHEN `status` = 'inactive' THEN 1 ELSE 0 END) as inactive_resources
FROM `resources`;

