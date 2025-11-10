-- Simple Services Table Setup (for MySQL versions that don't support IF NOT EXISTS in ALTER TABLE)
-- Run this in phpMyAdmin SQL tab

USE ucaep_db;

-- Create the services table (drop existing if you want to start fresh)
-- WARNING: Uncomment the DROP line ONLY if you want to delete existing data
-- DROP TABLE IF EXISTS `services`;

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

-- Add image_url column if table exists but column is missing
-- This is safe to run multiple times - it will only add if column doesn't exist
ALTER TABLE `services` 
ADD COLUMN `image_url` VARCHAR(500) NULL AFTER `icon`;

-- If you get "Duplicate column name" error, that's OK - it means the column already exists
-- Just ignore that error and continue

-- Sample data (optional)
INSERT IGNORE INTO `services` (`title`, `description`, `content`, `category`, `status`, `tags`) VALUES
('Soutien aux producteurs agricoles', 'Des programmes d\'appui technique et logistique pour aider les agriculteurs à adopter des pratiques durables et à améliorer leur productivité.', 'Contenu détaillé du service de soutien aux producteurs...', 'support', 'active', '["agriculture", "soutien", "producteurs"]'),
('Développement de la pêche', 'Renforcement du secteur halieutique à travers la modernisation des équipements, la formation des pêcheurs et la protection des ressources marines.', 'Contenu détaillé du service de développement de la pêche...', 'training', 'active', '["pêche", "formation", "développement"]'),
('Appui à l\'élevage', 'Des initiatives pour la santé animale, la nutrition du bétail et l\'amélioration génétique afin d\'assurer une production durable.', 'Contenu détaillé du service d\'appui à l\'élevage...', 'assistance', 'active', '["élevage", "santé animale", "nutrition"]'),
('Formations et programmes d\'appui', 'Des sessions de formation et des ateliers destinés à renforcer les compétences des producteurs dans les domaines agricoles et maritimes.', 'Contenu détaillé des formations et programmes d\'appui...', 'training', 'active', '["formation", "ateliers", "compétences"]');

-- Verify
SELECT * FROM `services` LIMIT 5;

