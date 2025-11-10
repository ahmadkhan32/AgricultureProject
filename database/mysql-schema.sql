-- UCAEP MySQL Database Schema
-- Use this file to create tables in phpMyAdmin
-- Make sure to create the database first: CREATE DATABASE ucaep_db;

USE ucaep_db;

-- Users Table
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

-- Producers Table
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

-- News Table
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
  INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
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

-- Partnerships Table
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

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INT,
  category ENUM('document', 'form', 'report', 'law', 'statistics', 'guide') NOT NULL,
  tags JSON,
  download_count INT DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_created_by (created_by),
  INDEX idx_category (category),
  INDEX idx_download_count (download_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages (Contact) Table
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
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123 - CHANGE THIS!)
-- Password hash is for 'admin123' - Generated using bcrypt.hashSync('admin123', 10)
-- Make sure to change this in production!
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@ucaep.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Note: The password hash above is temporary. After first login, change the admin password!
-- You can generate a new hash using: bcrypt.hashSync('yourpassword', 10)

