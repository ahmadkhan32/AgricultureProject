-- Add image_url column to services table
-- Run this in phpMyAdmin SQL tab

USE ucaep_db;

-- Add the missing image_url column
ALTER TABLE `services` 
ADD COLUMN `image_url` VARCHAR(500) NULL AFTER `icon`;

-- Verify the column was added
DESCRIBE `services`;

