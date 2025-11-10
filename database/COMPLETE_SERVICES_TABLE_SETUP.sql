-- Complete Services Table Setup
-- This script will:
-- 1. Create the services table if it doesn't exist
-- 2. Add missing columns if the table exists but is incomplete
-- Run this in phpMyAdmin SQL tab

USE ucaep_db;

-- Step 1: Create the services table if it doesn't exist
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `content` TEXT NULL,
  `category` ENUM('support', 'training', 'assistance', 'project') NOT NULL DEFAULT 'support',
  `icon` VARCHAR(100) NULL,
  `image_url` VARCHAR(500) NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `tags` JSON NULL,
  `created_by` INT(11) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_by` (`created_by`),
  CONSTRAINT `fk_services_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 2: Add missing columns if they don't exist (for existing tables)
-- Check and add image_url if missing
SET @dbname = DATABASE();
SET @tablename = 'services';
SET @columnname = 'image_url';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1', -- Column exists, do nothing
  CONCAT('ALTER TABLE `', @tablename, '` ADD COLUMN `', @columnname, '` VARCHAR(500) NULL AFTER `icon`;')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 3: Verify the table structure
DESCRIBE `services`;

-- Step 4: Insert sample data (optional - only if table is empty)
INSERT IGNORE INTO `services` (`title`, `description`, `content`, `category`, `status`, `tags`) VALUES
('Soutien aux producteurs agricoles', 'Des programmes d\'appui technique et logistique pour aider les agriculteurs à adopter des pratiques durables et à améliorer leur productivité.', 'Contenu détaillé du service de soutien aux producteurs...', 'support', 'active', '["agriculture", "soutien", "producteurs"]'),
('Développement de la pêche', 'Renforcement du secteur halieutique à travers la modernisation des équipements, la formation des pêcheurs et la protection des ressources marines.', 'Contenu détaillé du service de développement de la pêche...', 'training', 'active', '["pêche", "formation", "développement"]'),
('Appui à l\'élevage', 'Des initiatives pour la santé animale, la nutrition du bétail et l\'amélioration génétique afin d\'assurer une production durable.', 'Contenu détaillé du service d\'appui à l\'élevage...', 'assistance', 'active', '["élevage", "santé animale", "nutrition"]'),
('Formations et programmes d\'appui', 'Des sessions de formation et des ateliers destinés à renforcer les compétences des producteurs dans les domaines agricoles et maritimes.', 'Contenu détaillé des formations et programmes d\'appui...', 'training', 'active', '["formation", "ateliers", "compétences"]');

-- Step 5: Verify data
SELECT COUNT(*) as total_services FROM `services`;

