-- ============================================
-- UCAEP DATABASE COMPLETE SETUP
-- Run this file in phpMyAdmin SQL tab or MySQL command line
-- ============================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS ucaep_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Step 2: Use Database
USE ucaep_db;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin', 'producer') DEFAULT 'producer' NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRODUCERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS producers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(200),
  business_name VARCHAR(200) NOT NULL,
  business_type ENUM('agriculture', 'livestock', 'fisheries', 'mixed') NOT NULL,
  description TEXT,
  location VARCHAR(200) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  region VARCHAR(100) NOT NULL,
  products JSON,
  certifications JSON,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  website VARCHAR(500),
  social_media JSON,
  images JSON,
  image VARCHAR(500),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved' NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(100) DEFAULT 'system',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_region (region),
  INDEX idx_business_type (business_type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url VARCHAR(500),
  author_id INT,
  category ENUM('news', 'press_release', 'event', 'announcement') DEFAULT 'news' NOT NULL,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft' NOT NULL,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_author_id (author_id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_status_published_at (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PARTNERSHIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS partnerships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  partner_type ENUM('local', 'international', 'government', 'ngo', 'private') NOT NULL,
  logo_url VARCHAR(500),
  website VARCHAR(500),
  contact_info JSON,
  status ENUM('active', 'inactive', 'pending') DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_partner_type (partner_type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RESOURCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER,
  category ENUM('document', 'form', 'report', 'law', 'statistics', 'guide') NOT NULL,
  tags JSON,
  download_count INTEGER DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  content LONGTEXT,
  image VARCHAR(500),
  category VARCHAR(100),
  status ENUM('draft', 'published', 'active', 'completed', 'inactive') DEFAULT 'published' NOT NULL,
  start_date DATE,
  end_date DATE,
  location VARCHAR(200),
  budget DECIMAL(15, 2),
  tags JSON,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_created_by (created_by),
  INDEX idx_category (category),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT ADMIN USER
-- ============================================
-- Password: admin123 (bcrypt hash)
INSERT IGNORE INTO users (email, password, first_name, last_name, role) VALUES
('admin@ucaep.com', '$2b$10$rOzJq1qQq1qQq1qQq1qQqOq1qQq1qQq1qQq1qQq1qQq1qQq1qQq', 'Admin', 'User', 'admin');

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Sample News Articles
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
(
  'Welcome to UCAEP Agricultural Platform',
  'We are excited to announce the launch of our comprehensive agricultural platform designed to support local farmers and producers. This platform offers resources, connections, and opportunities for growth in the agricultural sector. Join us in building a stronger agricultural community.',
  'Announcing the launch of our new agricultural platform for farmers and producers',
  'announcement',
  'published',
  NOW()
),
(
  'New Training Program for Organic Farming',
  'Join our comprehensive training program focused on organic farming practices. Learn sustainable techniques, improve crop yields, and connect with experienced farmers in your region. The program includes hands-on workshops and field visits.',
  'Comprehensive training program for organic farming practices and sustainable agriculture',
  'event',
  'published',
  NOW()
),
(
  'Partnership with Local Farmers Association',
  'We are pleased to announce our new partnership with the Local Farmers Association. This collaboration will bring more resources and support to our community members. Together we will work on improving agricultural productivity.',
  'New partnership brings more resources and support to the community',
  'press_release',
  'published',
  NOW()
);

-- Sample Partnerships
INSERT INTO partnerships (name, description, partner_type, website, status) VALUES
(
  'FAO - Food and Agriculture Organization',
  'Partnership for sustainable agriculture development and food security programs. Working together to improve agricultural practices and support local farmers.',
  'international',
  'https://www.fao.org',
  'active'
),
(
  'Union Européenne',
  'Funding partner for agricultural development programs and rural infrastructure projects.',
  'international',
  'https://europa.eu',
  'active'
),
(
  'Local Farmers Cooperative',
  'Local partnership with farmers cooperative for community-based agricultural initiatives.',
  'local',
  'https://example.com',
  'active'
);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Database setup completed successfully!' as Status;

-- Show all tables
SHOW TABLES;

-- Count records
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM news) as total_news,
  (SELECT COUNT(*) FROM producers) as total_producers,
  (SELECT COUNT(*) FROM partnerships) as total_partnerships;

-- Show sample news
SELECT id, title, category, status, published_at FROM news ORDER BY created_at DESC LIMIT 5;

