-- Resources Table Setup for UCAEP Database
-- Run this SQL in phpMyAdmin to create/update the resources table

USE ucaep_db;

-- Create the resources table if it doesn't exist
CREATE TABLE IF NOT EXISTS `resources` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `file_size` INT(11) NULL,
  `category` ENUM('reports', 'guidelines', 'forms', 'documents', 'others') NOT NULL DEFAULT 'documents',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `tags` JSON NULL,
  `download_count` INT(11) DEFAULT 0,
  `created_by` INT(11) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_by` (`created_by`),
  CONSTRAINT `fk_resources_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add status column if it doesn't exist (for existing tables)
SET @dbname = DATABASE();
SET @tablename = 'resources';
SET @columnname = 'status';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1', -- Column exists, do nothing
  CONCAT('ALTER TABLE `', @tablename, '` ADD COLUMN `', @columnname, '` ENUM(\'active\', \'inactive\') NOT NULL DEFAULT \'active\' AFTER `category`;')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update category enum if needed (for existing tables)
-- Note: This will only work if the table is empty or you manually update existing data first
-- ALTER TABLE `resources` MODIFY COLUMN `category` ENUM('reports', 'guidelines', 'forms', 'documents', 'others') NOT NULL DEFAULT 'documents';

-- Verify the table structure
DESCRIBE `resources`;

-- Sample data (optional - only if table is empty or has few records)
INSERT IGNORE INTO `resources` (`title`, `description`, `file_url`, `file_type`, `category`, `status`, `tags`) VALUES
('Agricultural Production Report 2024', 'Comprehensive report on agricultural production statistics and trends for 2024. This document provides detailed insights into crop yields, livestock production, and agricultural market analysis.', 'https://example.com/reports/agri-report-2024.pdf', 'PDF', 'reports', 'active', '["agriculture", "statistics", "2024", "production"]'),
('Farm Management Guidelines', 'Best practices guide for effective farm management and sustainable agriculture. Learn modern techniques for crop rotation, soil management, and resource optimization.', 'https://example.com/guidelines/farm-management.pdf', 'PDF', 'guidelines', 'active', '["farming", "management", "best-practices", "sustainability"]'),
('Producer Registration Form', 'Official form for registering as a UCAEP producer member. Complete this form to join our network of agricultural producers and access exclusive benefits.', 'https://example.com/forms/producer-registration.pdf', 'PDF', 'forms', 'active', '["registration", "producer", "form", "membership"]'),
('UCAEP Annual Report 2023', 'Annual report detailing UCAEP activities and achievements in 2023. Includes financial statements, project summaries, and impact assessments.', 'https://example.com/reports/annual-report-2023.pdf', 'PDF', 'documents', 'active', '["annual", "report", "2023", "activities"]'),
('Livestock Health Manual', 'Comprehensive manual on livestock health management, vaccination schedules, and disease prevention strategies for farmers.', 'https://example.com/guidelines/livestock-health.pdf', 'PDF', 'guidelines', 'active', '["livestock", "health", "veterinary", "management"]'),
('Agricultural Loan Application', 'Application form for agricultural loans and financial assistance programs available to registered producers.', 'https://example.com/forms/loan-application.pdf', 'PDF', 'forms', 'active', '["loan", "finance", "application", "assistance"]'),
('Market Analysis Report Q1 2024', 'Quarterly market analysis report for agricultural products, pricing trends, and market opportunities.', 'https://example.com/reports/market-analysis-q1-2024.pdf', 'PDF', 'reports', 'active', '["market", "analysis", "pricing", "Q1-2024"]'),
('Organic Farming Standards', 'Official standards and certification requirements for organic farming practices in the region.', 'https://example.com/guidelines/organic-standards.pdf', 'PDF', 'guidelines', 'active', '["organic", "certification", "standards", "farming"]');

-- Verify data
SELECT COUNT(*) as total_resources FROM `resources`;

