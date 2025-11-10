# 📝 phpMyAdmin Setup Guide - News Table

## 🎯 Complete Step-by-Step Guide to Create News Table in phpMyAdmin

### **Step 1: Open phpMyAdmin**

1. Start your XAMPP/WAMP/MAMP server
2. Open browser and go to:
   - **XAMPP**: `http://localhost/phpmyadmin`
   - **WAMP**: `http://localhost/phpmyadmin`
   - **MAMP**: `http://localhost:8888/phpmyadmin` (or check MAMP settings)

### **Step 2: Login to phpMyAdmin**

- **Username**: `root` (default)
- **Password**: (leave empty if no password set, or enter your MySQL password)
- Click **"Go"** or press Enter

### **Step 3: Select or Create Database**

#### Option A: If Database Exists
1. In the left sidebar, find and click on your database name (e.g., `ucaep_db`)
2. You should see it highlighted

#### Option B: Create New Database
1. Click **"New"** in the left sidebar
2. Enter database name: `ucaep_db`
3. Select **Collation**: `utf8mb4_unicode_ci`
4. Click **"Create"**

### **Step 4: Create News Table**

1. Make sure your database is selected (highlighted in left sidebar)
2. Click on the **"SQL"** tab at the top
3. Copy and paste the following SQL code:

```sql
USE ucaep_db;

-- Create news table
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
```

4. Click the **"Go"** button (bottom right)

### **Step 5: Verify Table Creation**

After clicking "Go", you should see:
- ✅ **Success message**: "Query OK" or "Table created successfully"
- ✅ The `news` table appears in the left sidebar

### **Step 6: Check Table Structure**

1. Click on **"news"** table in the left sidebar
2. Click on **"Structure"** tab
3. You should see all columns listed:
   - `id` (Primary Key)
   - `title`
   - `content`
   - `excerpt`
   - `image_url`
   - `author_id`
   - `category`
   - `status`
   - `published_at`
   - `created_at`
   - `updated_at`

### **Step 7: Test the Table (Optional)**

In the SQL tab, run these queries:

```sql
-- Check table structure
DESCRIBE news;

-- Insert a test news article
INSERT INTO news (title, content, excerpt, category, status, published_at) 
VALUES (
  'Welcome to UCAEP News',
  'This is a test news article content. It must be at least 50 characters long to meet the validation requirements. The content should provide meaningful information about the news article.',
  'This is a test excerpt for the news article',
  'news',
  'published',
  NOW()
);

-- View all news
SELECT * FROM news;

-- View specific news
SELECT id, title, category, status, published_at FROM news;
```

### **Step 8: Common Issues & Solutions**

#### ❌ Issue 1: "Table already exists"
**Solution**: The table already exists. You can:
- **Option A**: Skip creation, just verify it exists
- **Option B**: Drop and recreate (⚠️ WARNING: This deletes all data!)
  ```sql
  DROP TABLE IF EXISTS news;
  -- Then run CREATE TABLE again
  ```

#### ❌ Issue 2: "Foreign key constraint fails"
**Solution**: The `users` table doesn't exist yet. Create it first:
```sql
-- Check if users table exists
SHOW TABLES LIKE 'users';

-- If not, you need to create users table first
-- Check your schema.sql or setup_database.sql file
```

#### ❌ Issue 3: "Column 'status' doesn't exist"
**Solution**: Add the missing column:
```sql
ALTER TABLE news 
ADD COLUMN status ENUM('draft', 'published', 'archived') 
DEFAULT 'draft' NOT NULL 
AFTER category;
```

#### ❌ Issue 4: "Column 'image_url' doesn't exist"
**Solution**: Add the missing column:
```sql
ALTER TABLE news 
ADD COLUMN image_url VARCHAR(500) 
AFTER excerpt;
```

### **Step 9: Verify Everything Works**

Run these verification queries:

```sql
-- 1. Check table exists
SHOW TABLES LIKE 'news';

-- 2. Check all columns
DESCRIBE news;

-- 3. Check indexes
SHOW INDEX FROM news;

-- 4. Check foreign key constraints
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'ucaep_db' 
  AND TABLE_NAME = 'news'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## 📋 Complete SQL for Manual Entry

If you prefer to create the table manually using phpMyAdmin interface:

1. Click your database in left sidebar
2. Click **"SQL"** tab
3. Copy and paste this complete SQL:

```sql
-- Complete News Table Creation Script
USE ucaep_db;

-- Drop existing table if you want to recreate (WARNING: Deletes all data!)
-- DROP TABLE IF EXISTS news;

CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT 'News article title',
  content TEXT NOT NULL COMMENT 'Full article content',
  excerpt TEXT COMMENT 'Short summary/excerpt',
  image_url VARCHAR(500) COMMENT 'URL to news article image',
  author_id INT COMMENT 'ID of user who created the article',
  category ENUM('news', 'press_release', 'event', 'announcement') DEFAULT 'news' NOT NULL COMMENT 'Article category',
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft' NOT NULL COMMENT 'Publication status',
  published_at TIMESTAMP NULL COMMENT 'When article was published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last update time',
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_author_id (author_id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  INDEX idx_status_published_at (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='News articles and press releases';

-- Verify creation
SELECT 'News table created successfully!' AS status;
DESCRIBE news;
```

## ✅ Success Indicators

After successful setup, you should see:

1. ✅ Table `news` appears in database list (left sidebar)
2. ✅ All 11 columns visible in Structure tab
3. ✅ Foreign key constraint to `users` table exists
4. ✅ All indexes created
5. ✅ Can insert test data successfully
6. ✅ Can query data without errors

## 🔗 Next Steps

After creating the table:

1. **Test the Backend**:
   ```bash
   # Start backend server
   npm run server
   
   # Test API endpoint
   curl http://localhost:5000/api/news
   ```

2. **Verify Controller Works**:
   - Controller now properly handles image URLs
   - URLs are converted to absolute format
   - All CRUD operations should work

## 📝 Database Schema Reference

```
Table: news
├── id (INT, PK, AUTO_INCREMENT)
├── title (VARCHAR(200), NOT NULL)
├── content (TEXT, NOT NULL)
├── excerpt (TEXT, NULLABLE)
├── image_url (VARCHAR(500), NULLABLE) ← Stores image URLs
├── author_id (INT, FK → users.id)
├── category (ENUM: news|press_release|event|announcement)
├── status (ENUM: draft|published|archived)
├── published_at (TIMESTAMP, NULLABLE)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

**✅ Setup Complete!** Your news table is now ready to use with the fixed controller.

