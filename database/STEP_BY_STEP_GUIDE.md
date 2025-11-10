# 📋 Step-by-Step MySQL Setup Guide
## Complete Guide for XAMPP phpMyAdmin & Command Prompt

---

## 🎯 PART 1: SETUP IN phpMyAdmin (EASIEST METHOD)

### Step 1: Start XAMPP
1. Open **XAMPP Control Panel**
2. Click **Start** button for **Apache**
3. Click **Start** button for **MySQL**
4. ✅ Both should show green "Running"

### Step 2: Open phpMyAdmin
1. Open browser: `http://localhost/phpmyadmin`
2. **Username**: `root`
3. **Password**: (leave empty) or enter your MySQL password
4. Click **Go**

### Step 3: Create Database
**Option A: Using GUI**
- Click **"New"** in left sidebar
- Database name: `ucaep_db`
- Collation: `utf8mb4_unicode_ci`
- Click **"Create"**

**Option B: Using SQL Tab**
1. Click **"SQL"** tab (top menu)
2. Paste this:
```sql
CREATE DATABASE IF NOT EXISTS ucaep_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```
3. Click **"Go"**
4. ✅ Database created!

### Step 4: Run Setup File
1. Click **"SQL"** tab again
2. Click **"Choose File"** button
3. Select file: `database/setup_database.sql`
4. Click **"Go"**
5. ✅ All tables created!

### Step 5: Verify
1. Click **"SQL"** tab
2. Run this:
```sql
USE ucaep_db;
SHOW TABLES;
```
3. Should show: users, producers, news, partnerships, resources, projects, messages

---

## 💻 PART 2: COMMAND PROMPT METHOD

### Step 1: Open Command Prompt
- Press `Win + R`
- Type `cmd`
- Press `Enter`

### Step 2: Navigate to MySQL
```cmd
cd C:\xampp\mysql\bin
```

### Step 3: Connect to MySQL
```cmd
mysql -u root -p
```
(Enter password or press Enter if no password)

### Step 4: Create Database
```sql
CREATE DATABASE IF NOT EXISTS ucaep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ucaep_db;
```

### Step 5: Import Setup File
**Option A: From Command Prompt (while in mysql)**
```sql
source D:\New folder\Agriculturee website\database\setup_database.sql;
```

**Option B: From Windows CMD (exit mysql first)**
```cmd
cd "D:\New folder\Agriculturee website\database"
mysql -u root -p ucaep_db < setup_database.sql
```

---

## 📝 PART 3: CRUD OPERATIONS - EXACT COMMANDS

### 🔹 STEP 1: Always Start With This
```sql
USE ucaep_db;
```

---

### ➕ INSERT (Create Data)

#### Insert News Article
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
(
  'Nouvelle Formation en Agriculture Biologique',
  'L''UCAEP organise une nouvelle formation complète sur les techniques d''agriculture biologique. Cette formation d''une durée de deux semaines couvrira les méthodes de fertilisation naturelle, la lutte biologique contre les parasites, et les pratiques de rotation des cultures pour améliorer la productivité tout en préservant l''environnement.',
  'Formation complète sur les techniques d''agriculture biologique et les pratiques durables',
  'event',
  'published',
  NOW()
);
```

#### Insert Multiple News Articles at Once
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Article 1', 'Content 1 with sufficient length for validation...', 'Excerpt 1', 'news', 'published', NOW()),
('Article 2', 'Content 2 with sufficient length for validation...', 'Excerpt 2', 'event', 'published', NOW()),
('Article 3', 'Content 3 with sufficient length for validation...', 'announcement', 'announcement', 'published', NOW());
```

#### Insert Producer Profile
```sql
USE ucaep_db;

-- First, check if user exists
SELECT id FROM users WHERE email = 'admin@ucaep.com';

-- Then insert producer (replace 1 with actual user_id)
INSERT INTO producers (user_id, business_name, business_type, location, region, description, status) VALUES
(
  1,
  'Ferme Agricole Moderne',
  'agriculture',
  'Moroni, Grande Comore',
  'Grande Comore',
  'Ferme spécialisée dans la production de fruits et légumes biologiques',
  'approved'
);
```

#### Insert Partnership
```sql
USE ucaep_db;

INSERT INTO partnerships (name, description, partner_type, website, status) VALUES
(
  'FAO - Organisation des Nations Unies',
  'Partenariat stratégique pour le développement de l''agriculture durable et la sécurité alimentaire aux Comores',
  'international',
  'https://www.fao.org',
  'active'
);
```

---

### 🔍 SELECT (Read/View Data)

#### View All Published News (What Frontend Shows)
```sql
USE ucaep_db;

SELECT * FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC;
```

#### View All News Including Drafts (Admin View)
```sql
USE ucaep_db;

SELECT id, title, category, status, published_at, created_at 
FROM news 
ORDER BY created_at DESC;
```

#### View Latest 10 Published News
```sql
USE ucaep_db;

SELECT id, title, excerpt, category, published_at 
FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC 
LIMIT 10;
```

#### Search News by Keyword
```sql
USE ucaep_db;

SELECT * FROM news 
WHERE (title LIKE '%agriculture%' OR content LIKE '%agriculture%') 
AND status = 'published';
```

#### View News by Category
```sql
USE ucaep_db;

SELECT * FROM news 
WHERE category = 'event' 
AND status = 'published' 
ORDER BY published_at DESC;
```

#### View Single News Article
```sql
USE ucaep_db;

SELECT * FROM news WHERE id = 1;
```

#### Count News Articles
```sql
USE ucaep_db;

-- Total count
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

#### View Producers
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

#### View Partnerships
```sql
USE ucaep_db;

SELECT * FROM partnerships 
WHERE status = 'active' 
ORDER BY created_at DESC;
```

---

### ✏️ UPDATE (Edit Data)

#### Publish a Draft News Article
```sql
USE ucaep_db;

UPDATE news 
SET 
  status = 'published',
  published_at = NOW()
WHERE id = 1;
```

#### Update News Title and Content
```sql
USE ucaep_db;

UPDATE news 
SET 
  title = 'Titre Mis à Jour',
  content = 'Contenu mis à jour avec toutes les informations nécessaires...',
  excerpt = 'Description mise à jour',
  updated_at = NOW()
WHERE id = 1;
```

#### Change News Status
```sql
USE ucaep_db;

-- Archive an article
UPDATE news 
SET status = 'archived' 
WHERE id = 2;

-- Change back to draft
UPDATE news 
SET status = 'draft', published_at = NULL 
WHERE id = 2;
```

#### Update News Category
```sql
USE ucaep_db;

UPDATE news 
SET category = 'event' 
WHERE id = 1;
```

#### Update Producer Status
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

#### Update Producer Information
```sql
USE ucaep_db;

UPDATE producers 
SET 
  business_name = 'Nouveau Nom de l''Entreprise',
  description = 'Nouvelle description de l''entreprise',
  location = 'Nouvelle Localisation',
  updated_at = NOW()
WHERE id = 1;
```

#### Update Partnership Status
```sql
USE ucaep_db;

UPDATE partnerships 
SET status = 'inactive' 
WHERE id = 1;
```

---

### 🗑️ DELETE (Remove Data)

#### Delete Single News Article
```sql
USE ucaep_db;

DELETE FROM news WHERE id = 1;
```

#### Delete Multiple News Articles
```sql
USE ucaep_db;

DELETE FROM news WHERE id IN (1, 2, 3);
```

#### Delete Draft Articles Older than 30 Days
```sql
USE ucaep_db;

DELETE FROM news 
WHERE status = 'draft' 
AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

#### Delete Producer
```sql
USE ucaep_db;

DELETE FROM producers WHERE id = 1;
```

#### Delete Partnership
```sql
USE ucaep_db;

DELETE FROM partnerships WHERE id = 1;
```

#### Clear All Test Data
```sql
USE ucaep_db;

-- Delete all test news (use with caution!)
DELETE FROM news WHERE title LIKE '%Test%' OR title LIKE '%test%';
```

---

## 🎯 PART 4: COMPLETE WORKFLOW EXAMPLES

### Example 1: Create and Publish News Article
```sql
USE ucaep_db;

-- Step 1: Insert as draft
INSERT INTO news (title, content, excerpt, category, status) VALUES
(
  'Nouveau Programme de Financement Agricole',
  'L''UCAEP annonce un nouveau programme de financement pour soutenir les petits producteurs agricoles. Ce programme offrira des subventions et des prêts à taux préférentiel pour l''achat d''équipements et l''amélioration des infrastructures agricoles.',
  'Nouveau programme de financement pour les producteurs agricoles',
  'announcement',
  'draft'
);

-- Step 2: Get the ID (note it from the result, let's say it's ID 5)
-- Or use LAST_INSERT_ID()
SELECT LAST_INSERT_ID() as new_article_id;

-- Step 3: Publish it (replace 5 with actual ID)
UPDATE news 
SET status = 'published', published_at = NOW() 
WHERE id = 5;

-- Step 4: Verify it's published
SELECT * FROM news WHERE id = 5;
```

### Example 2: Update Existing Article
```sql
USE ucaep_db;

-- Step 1: View current article
SELECT * FROM news WHERE id = 1;

-- Step 2: Update it
UPDATE news 
SET 
  title = 'Titre Modifié',
  content = 'Nouveau contenu complet de l''article avec toutes les informations mises à jour...',
  excerpt = 'Nouvelle description',
  category = 'news',
  status = 'published',
  published_at = NOW(),
  updated_at = NOW()
WHERE id = 1;

-- Step 3: Verify update
SELECT * FROM news WHERE id = 1;
```

### Example 3: Bulk Operations
```sql
USE ucaep_db;

-- Insert 5 articles at once
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Article 1', 'Content 1...', 'Excerpt 1', 'news', 'published', NOW()),
('Article 2', 'Content 2...', 'Excerpt 2', 'event', 'published', NOW()),
('Article 3', 'Content 3...', 'Excerpt 3', 'announcement', 'published', NOW()),
('Article 4', 'Content 4...', 'Excerpt 4', 'press_release', 'published', NOW()),
('Article 5', 'Content 5...', 'Excerpt 5', 'news', 'published', NOW());

-- Publish all drafts
UPDATE news 
SET status = 'published', published_at = NOW() 
WHERE status = 'draft' AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

---

## 📊 PART 5: VERIFICATION QUERIES

### Check Database Setup
```sql
USE ucaep_db;

-- Show all tables
SHOW TABLES;

-- Count records in each table
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'producers', COUNT(*) FROM producers
UNION ALL
SELECT 'news', COUNT(*) FROM news
UNION ALL
SELECT 'partnerships', COUNT(*) FROM partnerships;
```

### Check News Status
```sql
USE ucaep_db;

-- Count by status
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM news), 2) as percentage
FROM news 
GROUP BY status;
```

### Check Published News (What Frontend Shows)
```sql
USE ucaep_db;

SELECT 
  id,
  title,
  category,
  status,
  DATE(published_at) as publish_date,
  DATE(created_at) as created_date
FROM news 
WHERE status = 'published'
ORDER BY published_at DESC;
```

---

## 🚀 QUICK COMMAND REFERENCE

### One-Line Commands (Copy & Paste)

```sql
-- View all published news
USE ucaep_db; SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;

-- Insert news
USE ucaep_db; INSERT INTO news (title, content, category, status, published_at) VALUES ('Title', 'Content...', 'news', 'published', NOW());

-- Publish draft
USE ucaep_db; UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;

-- Delete news
USE ucaep_db; DELETE FROM news WHERE id = 1;

-- Count news
USE ucaep_db; SELECT COUNT(*) FROM news WHERE status = 'published';
```

---

## ✅ CHECKLIST: Test Your Setup

Run these commands to verify everything works:

```sql
USE ucaep_db;

-- 1. Check tables exist
SHOW TABLES;
-- Should show: users, producers, news, partnerships, resources, projects, messages

-- 2. Check admin user exists
SELECT * FROM users WHERE email = 'admin@ucaep.com';
-- Should show admin user

-- 3. Insert test news
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Test Article', 'This is a test article content with sufficient length', 'Test excerpt', 'news', 'published', NOW());

-- 4. Verify it appears
SELECT * FROM news WHERE title = 'Test Article';

-- 5. Check frontend URL (in browser)
-- http://localhost:3000/news
-- Should show the article!

-- 6. Clean up test data (optional)
DELETE FROM news WHERE title = 'Test Article';
```

---

## 🎯 IMPORTANT NOTES

### Status Values (Case-Sensitive!)
- News: `draft`, `published`, `archived`
- Producers: `pending`, `approved`, `rejected`
- Partnerships: `active`, `inactive`, `pending`

### Categories
- News: `news`, `press_release`, `event`, `announcement`
- Producers: `agriculture`, `livestock`, `fisheries`, `mixed`
- Partnerships: `local`, `international`, `government`, `ngo`, `private`

### Always Remember:
1. Start with `USE ucaep_db;`
2. Published articles appear on frontend
3. Draft articles are hidden from public
4. Use `NOW()` for current timestamp

---

## 🔗 Files to Use

1. **`database/setup_database.sql`** - Complete setup (tables + sample data)
2. **`database/mysql-schema.sql`** - Full schema file
3. **`database/migrations/create_news_table.sql`** - News table only
4. **`database/migrations/news_quick_test.sql`** - Test queries

---

## 🆘 Troubleshooting

### Problem: "Table doesn't exist"
```sql
USE ucaep_db;
SHOW TABLES;
-- If empty, run setup_database.sql
```

### Problem: "Data not showing in frontend"
```sql
-- Check status is 'published'
SELECT * FROM news WHERE status = 'published';

-- Check published_at is not NULL
SELECT * FROM news WHERE status = 'published' AND published_at IS NOT NULL;
```

### Problem: "Cannot connect to MySQL"
- Check XAMPP MySQL is running
- Check port 3306 is not blocked
- Try: `mysql -u root` (no password)

---

**You're ready! Now create, update, and manage your data! 🎉**

