# MySQL Quick Reference Card
## Essential Commands for Daily Use

---

## 🚀 QUICK START

### Method 1: phpMyAdmin (Easiest)
1. Open: `http://localhost/phpmyadmin`
2. Select database: `ucaep_db`
3. Click **SQL** tab
4. Paste command → Click **Go**

### Method 2: Command Prompt
```cmd
cd C:\xampp\mysql\bin
mysql -u root -p
USE ucaep_db;
```

---

## 📝 ESSENTIAL COMMANDS

### Database
```sql
USE ucaep_db;                    -- Select database
SHOW DATABASES;                  -- List all databases
SHOW TABLES;                     -- List all tables
DESCRIBE news;                   -- Show table structure
```

---

## ➕ INSERT (Create Data)

### Insert News
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Article Title', 'Full content text here...', 'Short description', 'news', 'published', NOW());
```

### Insert Producer
```sql
USE ucaep_db;

INSERT INTO producers (user_id, business_name, business_type, location, region, status) VALUES
(1, 'Farm Name', 'agriculture', 'City', 'Region', 'approved');
```

### Insert Partnership
```sql
USE ucaep_db;

INSERT INTO partnerships (name, description, partner_type, status) VALUES
('Partner Name', 'Description here...', 'international', 'active');
```

---

## 🔍 SELECT (Read/View Data)

### View All Published News
```sql
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;
```

### View All News (Admin)
```sql
SELECT id, title, category, status, published_at FROM news ORDER BY created_at DESC;
```

### Search News
```sql
SELECT * FROM news WHERE title LIKE '%keyword%' AND status = 'published';
```

### View Producers
```sql
SELECT * FROM producers WHERE status = 'approved' ORDER BY created_at DESC;
```

### Count Records
```sql
SELECT COUNT(*) FROM news;
SELECT status, COUNT(*) FROM news GROUP BY status;
```

---

## ✏️ UPDATE (Edit Data)

### Publish News
```sql
UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;
```

### Update News Content
```sql
UPDATE news SET title = 'New Title', content = 'New content...' WHERE id = 1;
```

### Approve Producer
```sql
UPDATE producers SET status = 'approved' WHERE id = 1;
```

---

## 🗑️ DELETE

### Delete News
```sql
DELETE FROM news WHERE id = 1;
```

### Delete Drafts Older than 30 Days
```sql
DELETE FROM news WHERE status = 'draft' AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

---

## 📊 COMMON QUERIES

### Get Latest 5 News
```sql
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC LIMIT 5;
```

### News by Category
```sql
SELECT * FROM news WHERE category = 'event' AND status = 'published';
```

### Statistics
```sql
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
  SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts
FROM news;
```

---

## ⚡ ONE-LINER COMMANDS

```sql
-- Quick insert
INSERT INTO news (title, content, category, status, published_at) VALUES ('Title', 'Content', 'news', 'published', NOW());

-- Quick update
UPDATE news SET status = 'published' WHERE id = 1;

-- Quick delete
DELETE FROM news WHERE id = 1;

-- Quick view
SELECT * FROM news WHERE status = 'published' LIMIT 10;

-- Quick count
SELECT COUNT(*) FROM news WHERE status = 'published';
```

---

## ✅ STATUS VALUES

**News:** `draft`, `published`, `archived`  
**Producers:** `pending`, `approved`, `rejected`  
**Partnerships:** `active`, `inactive`, `pending`

---

## 🎯 TYPICAL WORKFLOW

### Create & Publish Article
```sql
-- 1. Insert as draft
INSERT INTO news (title, content, category, status) VALUES ('Title', 'Content', 'news', 'draft');

-- 2. Publish it (note the ID from step 1)
UPDATE news SET status = 'published', published_at = NOW() WHERE id = LAST_INSERT_ID();
```

### Bulk Insert
```sql
INSERT INTO news (title, content, category, status, published_at) VALUES
('Title 1', 'Content 1', 'news', 'published', NOW()),
('Title 2', 'Content 2', 'event', 'published', NOW()),
('Title 3', 'Content 3', 'announcement', 'published', NOW());
```

---

## 🆘 TROUBLESHOOTING

**Table doesn't exist?**
```sql
SHOW TABLES LIKE 'news';
```

**Foreign key error?**
```sql
SELECT id FROM users WHERE id = 1;  -- Check if referenced record exists
```

**Column doesn't exist?**
```sql
DESCRIBE news;  -- Check table structure
```

---

**💡 Tip:** Always use `USE ucaep_db;` first!

