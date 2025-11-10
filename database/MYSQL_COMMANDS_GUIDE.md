# MySQL Commands Guide for XAMPP phpMyAdmin
## Complete CRUD Operations for UCAEP Database

---

## 📋 Table of Contents
1. [Initial Setup](#initial-setup)
2. [Database Creation](#database-creation)
3. [Table Creation](#table-creation)
4. [INSERT (Create) Operations](#insert-create-operations)
5. [SELECT (Read) Operations](#select-read-operations)
6. [UPDATE (Edit) Operations](#update-edit-operations)
7. [DELETE Operations](#delete-operations)
8. [Command Prompt Usage](#command-prompt-usage)
9. [Quick Reference](#quick-reference)

---

## 🚀 Initial Setup

### Step 1: Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache** (for phpMyAdmin)
3. Start **MySQL** (database server)

### Step 2: Access phpMyAdmin
1. Open browser: `http://localhost/phpmyadmin`
2. Default credentials:
   - **Username**: `root`
   - **Password**: (leave empty) or `your_password`

---

## 💾 Database Creation

### Option A: Using phpMyAdmin GUI
1. Click **"New"** in left sidebar
2. Database name: `ucaep_db`
3. Collation: `utf8mb4_unicode_ci`
4. Click **"Create"**

### Option B: Using SQL Command (Recommended)
```sql
CREATE DATABASE IF NOT EXISTS ucaep_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE ucaep_db;
```

---

## 📊 Table Creation

### Step 1: Create All Tables
**Copy and paste this entire section in phpMyAdmin SQL tab:**

```sql
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
```

---

## ➕ INSERT (Create) Operations

### Insert Admin User
```sql
USE ucaep_db;

-- Create admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@ucaep.com', '$2b$10$rOzJq1qQq1qQq1qQq1qQqOq1qQq1qQq1qQq1qQq1qQq1qQq1qQq', 'Admin', 'User', 'admin');
```

### Insert News Article
```sql
USE ucaep_db;

-- Insert published news article
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
(
  'Welcome to UCAEP Platform',
  'We are excited to announce the launch of our comprehensive agricultural platform designed to support local farmers and producers. This platform offers resources, connections, and opportunities for growth in the agricultural sector.',
  'Announcing the launch of our new agricultural platform',
  'announcement',
  'published',
  NOW()
);

-- Insert draft article
INSERT INTO news (title, content, excerpt, category, status) VALUES
(
  'Future Projects Preview',
  'This is a draft article about future projects and initiatives. It will be published after final review.',
  'Preview of upcoming projects',
  'news',
  'draft'
);
```

### Insert Producer
```sql
USE ucaep_db;

-- First, get a user_id from users table
SELECT id FROM users WHERE email = 'admin@ucaep.com';

-- Then insert producer (replace USER_ID with actual ID)
INSERT INTO producers (user_id, business_name, business_type, location, region, description, status) VALUES
(
  1, -- Replace with actual user_id
  'Green Farm Co.',
  'agriculture',
  'Moroni, Grande Comore',
  'Grande Comore',
  'Organic farming specializing in fruits and vegetables',
  'approved'
);
```

### Insert Partnership
```sql
USE ucaep_db;

INSERT INTO partnerships (name, description, partner_type, website, status) VALUES
(
  'FAO - Food and Agriculture Organization',
  'Partnership for sustainable agriculture development and food security programs',
  'international',
  'https://www.fao.org',
  'active'
);
```

---

## 🔍 SELECT (Read) Operations

### View All News (Published)
```sql
USE ucaep_db;

SELECT * FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC;
```

### View All News (Including Drafts - Admin View)
```sql
USE ucaep_db;

SELECT id, title, category, status, published_at, created_at 
FROM news 
ORDER BY created_at DESC;
```

### Search News by Title
```sql
USE ucaep_db;

SELECT * FROM news 
WHERE title LIKE '%agriculture%' 
AND status = 'published';
```

### Get News by Category
```sql
USE ucaep_db;

SELECT * FROM news 
WHERE category = 'news' 
AND status = 'published' 
ORDER BY published_at DESC;
```

### Get Single News Article
```sql
USE ucaep_db;

SELECT * FROM news WHERE id = 1;
```

### View All Producers
```sql
USE ucaep_db;

SELECT 
  p.id,
  p.business_name,
  p.business_type,
  p.region,
  p.status,
  u.email,
  u.first_name,
  u.last_name
FROM producers p
LEFT JOIN users u ON p.user_id = u.id
WHERE p.status = 'approved'
ORDER BY p.created_at DESC;
```

### View All Partnerships
```sql
USE ucaep_db;

SELECT * FROM partnerships 
WHERE status = 'active' 
ORDER BY created_at DESC;
```

### Count Records
```sql
USE ucaep_db;

-- Count total news articles
SELECT COUNT(*) as total_news FROM news;

-- Count by status
SELECT status, COUNT(*) as count 
FROM news 
GROUP BY status;

-- Count by category
SELECT category, COUNT(*) as count 
FROM news 
GROUP BY category;
```

---

## ✏️ UPDATE (Edit) Operations

### Update News Status to Published
```sql
USE ucaep_db;

UPDATE news 
SET 
  status = 'published',
  published_at = NOW()
WHERE id = 1;
```

### Update News Content
```sql
USE ucaep_db;

UPDATE news 
SET 
  title = 'Updated Article Title',
  content = 'This is the updated content with more information.',
  excerpt = 'Updated excerpt',
  updated_at = NOW()
WHERE id = 1;
```

### Update Producer Status
```sql
USE ucaep_db;

-- Approve a producer
UPDATE producers 
SET status = 'approved' 
WHERE id = 1;

-- Reject a producer
UPDATE producers 
SET status = 'rejected' 
WHERE id = 2;
```

### Update Producer Information
```sql
USE ucaep_db;

UPDATE producers 
SET 
  business_name = 'Updated Business Name',
  description = 'Updated description',
  location = 'New Location',
  updated_at = NOW()
WHERE id = 1;
```

### Archive Old News
```sql
USE ucaep_db;

UPDATE news 
SET status = 'archived' 
WHERE published_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

---

## 🗑️ DELETE Operations

### Delete Single News Article
```sql
USE ucaep_db;

DELETE FROM news WHERE id = 1;
```

### Delete Draft Articles (Older than 30 days)
```sql
USE ucaep_db;

DELETE FROM news 
WHERE status = 'draft' 
AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### Delete Producer
```sql
USE ucaep_db;

DELETE FROM producers WHERE id = 1;
```

### Delete Partnership
```sql
USE ucaep_db;

DELETE FROM partnerships WHERE id = 1;
```

### Clear All Data from Table (DANGEROUS!)
```sql
USE ucaep_db;

-- TRUNCATE removes all data but keeps table structure
TRUNCATE TABLE news;

-- DROP removes table completely (use with extreme caution!)
-- DROP TABLE news;
```

---

## 💻 Command Prompt Usage

### Step 1: Open Command Prompt (CMD) or PowerShell
Press `Win + R`, type `cmd`, press Enter

### Step 2: Navigate to MySQL Bin Directory
```cmd
cd C:\xampp\mysql\bin
```

### Step 3: Connect to MySQL
```cmd
mysql -u root -p
```
(Press Enter if no password, or enter your MySQL password)

### Step 4: Run SQL Commands
```sql
USE ucaep_db;

SHOW TABLES;

SELECT * FROM news;
```

### Step 5: Import SQL File from Command Line
```cmd
mysql -u root -p ucaep_db < "D:\New folder\Agriculturee website\database\mysql-schema.sql"
```

### Step 6: Export Database
```cmd
mysqldump -u root -p ucaep_db > "D:\backup_ucaep_db.sql"
```

---

## 📝 Quick Reference

### Essential Commands

```sql
-- Select database
USE ucaep_db;

-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE news;
DESCRIBE producers;
DESCRIBE partnerships;

-- View all data
SELECT * FROM news;
SELECT * FROM producers;
SELECT * FROM partnerships;

-- Count records
SELECT COUNT(*) FROM news;
SELECT COUNT(*) FROM producers;

-- View with pagination
SELECT * FROM news LIMIT 10 OFFSET 0;  -- First 10
SELECT * FROM news LIMIT 10 OFFSET 10; -- Next 10

-- Get latest records
SELECT * FROM news ORDER BY created_at DESC LIMIT 5;
```

### Status Values Reference

**News Status:**
- `draft` - Not visible to public
- `published` - Visible on frontend
- `archived` - Old/archived articles

**Producer Status:**
- `pending` - Awaiting approval
- `approved` - Visible on frontend
- `rejected` - Not approved

**Partnership Status:**
- `active` - Visible on frontend
- `inactive` - Hidden
- `pending` - Awaiting approval

---

## ✅ Verification Steps

### 1. Check Database Exists
```sql
SHOW DATABASES LIKE 'ucaep_db';
```

### 2. Check Tables Exist
```sql
USE ucaep_db;
SHOW TABLES;
```

### 3. Check Table Structure
```sql
USE ucaep_db;
DESCRIBE news;
DESCRIBE producers;
```

### 4. Test Data Insertion
```sql
USE ucaep_db;

-- Insert test news
INSERT INTO news (title, content, category, status, published_at) 
VALUES ('Test Article', 'This is a test article content', 'news', 'published', NOW());

-- Verify it was inserted
SELECT * FROM news WHERE title = 'Test Article';

-- Delete test data
DELETE FROM news WHERE title = 'Test Article';
```

---

## 🎯 Common Use Cases

### Use Case 1: Create and Publish News Article
```sql
USE ucaep_db;

-- Step 1: Create as draft
INSERT INTO news (title, content, excerpt, category, status) VALUES
('New Training Program', 'Full content here...', 'Short description', 'event', 'draft');

-- Step 2: Get the ID (note the ID from output)
SELECT id FROM news WHERE title = 'New Training Program';

-- Step 3: Publish it
UPDATE news 
SET status = 'published', published_at = NOW() 
WHERE id = LAST_INSERT_ID();
```

### Use Case 2: Bulk Import News Articles
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Article 1', 'Content 1...', 'Excerpt 1', 'news', 'published', NOW()),
('Article 2', 'Content 2...', 'Excerpt 2', 'event', 'published', NOW()),
('Article 3', 'Content 3...', 'Excerpt 3', 'announcement', 'published', NOW());
```

### Use Case 3: Update Multiple Records
```sql
USE ucaep_db;

-- Update all draft articles to published
UPDATE news 
SET status = 'published', published_at = NOW() 
WHERE status = 'draft' AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

---

## 📚 Additional Resources

- Full Schema: `database/mysql-schema.sql`
- News Migration: `database/migrations/create_news_table.sql`
- Quick Test: `database/migrations/news_quick_test.sql`

---

## ⚠️ Important Notes

1. **Always backup** before running DELETE or DROP commands
2. **Test in development** before production
3. **Use transactions** for critical operations
4. **Check foreign keys** before deleting referenced records
5. **Status must match** ENUM values exactly (case-sensitive)

---

## 🆘 Troubleshooting

### Error: Table doesn't exist
```sql
-- Check if table exists
SHOW TABLES LIKE 'news';

-- If not, run CREATE TABLE command
```

### Error: Foreign key constraint
```sql
-- Check referenced records exist
SELECT id FROM users WHERE id = 1;

-- Or disable foreign key checks (use carefully!)
SET FOREIGN_KEY_CHECKS = 0;
-- Your operations here
SET FOREIGN_KEY_CHECKS = 1;
```

### Error: Column doesn't exist
```sql
-- Check table structure
DESCRIBE news;

-- Add missing column
ALTER TABLE news ADD COLUMN your_column VARCHAR(255);
```

---

**Happy Database Management! 🎉**

