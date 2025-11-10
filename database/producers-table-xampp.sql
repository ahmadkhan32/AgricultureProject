-- ============================================
-- PRODUCERS TABLE SQL SCRIPT FOR XAMPP
-- ============================================
-- Use this script in phpMyAdmin or MySQL command line
-- Make sure you have XAMPP MySQL running

-- Step 1: Create database (if not exists)
CREATE DATABASE IF NOT EXISTS ucaep_db;
USE ucaep_db;

-- Step 2: Create users table (required for foreign key)
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

-- Step 3: Create producers table
CREATE TABLE IF NOT EXISTS producers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  name VARCHAR(200) NULL,
  business_name VARCHAR(200) NOT NULL,
  business_type ENUM('agriculture', 'livestock', 'fisheries', 'mixed') NOT NULL,
  description TEXT NULL,
  location VARCHAR(200) NOT NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  region VARCHAR(100) NOT NULL,
  products JSON NULL,
  certifications JSON NULL,
  contact_email VARCHAR(255) NULL,
  contact_phone VARCHAR(20) NULL,
  website VARCHAR(500) NULL,
  social_media JSON NULL,
  images JSON NULL,
  image VARCHAR(500) NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved' NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_by VARCHAR(100) DEFAULT 'system',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_region (region),
  INDEX idx_business_type (business_type),
  INDEX idx_status (status),
  INDEX idx_business_name (business_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 4: Insert sample data (optional)
INSERT INTO producers 
(business_name, business_type, description, location, region, products, contact_email, contact_phone, status) 
VALUES
('Ahmed Ali Farm', 'agriculture', 'Producteur expérimenté spécialisé dans la culture de vanille et de bananes biologiques.', 'Moroni', 'Grande Comore', '["Vanille", "Banane", "Clous de girofle"]', 'ahmed.ali@example.com', '+269 333 1234', 'approved'),
('Fatima Said Fisheries', 'fisheries', 'Pêcheuse professionnelle avec plus de 15 ans d''expérience dans la pêche traditionnelle.', 'Mutsamudu', 'Anjouan', '["Thon", "Poisson frais", "Crustacés"]', 'fatima.said@example.com', '+269 334 5678', 'approved'),
('Omar Abdallah Livestock', 'livestock', 'Éleveur passionné pratiquant l''élevage durable et respectueux de l''environnement.', 'Fomboni', 'Mohéli', '["Bovins", "Volaille", "Lait frais"]', 'omar.abdallah@example.com', '+269 335 9012', 'approved');

-- Verify table creation
SELECT * FROM producers LIMIT 5;

