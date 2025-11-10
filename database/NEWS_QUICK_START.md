# 🚀 News Database - Quick Start Guide

## ⚡ Setup in 3 Steps

### Step 1: Start XAMPP
- Start **Apache** and **MySQL** in XAMPP Control Panel

### Step 2: Run Database Setup (if not done)
```sql
-- In phpMyAdmin SQL tab
-- File: database/setup_database.sql
```

### Step 3: Insert Sample News
```sql
-- In phpMyAdmin SQL tab
-- File: database/insert_sample_news.sql
```

**OR** Copy-paste this in phpMyAdmin:
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES
(
  'Test Article',
  'This is a complete article content that is long enough to pass validation. It must be at least 50 characters to meet the backend validation requirements.',
  'Short description of the article',
  'news',
  'published',
  NOW(),
  1
);
```

---

## 📝 Essential Commands

### Always Start With:
```sql
USE ucaep_db;
```

### Create News Article
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES
('Title Here', 'Full content here (min 50 chars)...', 'Short description', 'news', 'published', NOW(), 1);
```

### View Published News
```sql
USE ucaep_db;
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;
```

### Update News
```sql
USE ucaep_db;
UPDATE news SET title = 'New Title', content = 'New content...' WHERE id = 1;
```

### Publish Draft
```sql
USE ucaep_db;
UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;
```

### Delete News
```sql
USE ucaep_db;
DELETE FROM news WHERE id = 1;
```

---

## 🎯 How Frontend Works

### News.js Page
- **URL**: `http://localhost:3000/news`
- **API**: `GET /api/news?status=published`
- **Shows**: All articles with `status = 'published'`
- **Database Query**: `SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC`

### NewsDetail.js Page
- **URL**: `http://localhost:3000/news/:id`
- **API**: `GET /api/news/:id`
- **Shows**: Single article details
- **Database Query**: `SELECT * FROM news WHERE id = :id AND status = 'published'`

### Admin Panel (NewsManagement.js)
- **URL**: `http://localhost:3000/admin/news`
- **API**: `GET /api/news/admin/all`
- **Shows**: All articles (draft, published, archived)

---

## ✅ Verification

After inserting news, check:

1. **In phpMyAdmin:**
   ```sql
   USE ucaep_db;
   SELECT COUNT(*) FROM news WHERE status = 'published';
   ```

2. **In Browser:**
   - Frontend: `http://localhost:3000/news`
   - Should show your articles!

3. **Check API directly:**
   - `http://localhost:5000/api/news`
   - Should return JSON with your articles

---

## 🔧 Common Issues

### Articles Not Showing?
```sql
-- Check status
SELECT id, title, status FROM news WHERE id = 1;

-- Fix: Publish it
UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;
```

### Getting 404 Error?
```sql
-- Check if article exists and is published
SELECT * FROM news WHERE id = 1 AND status = 'published';
```

### Content Too Short Error?
- Content must be **at least 50 characters**
- Title must be **at least 5 characters**

---

## 📚 Column Names Reference

| What You See | Database Column |
|--------------|----------------|
| imageUrl | image_url |
| authorId | author_id |
| publishedAt | published_at |
| createdAt | created_at |
| updatedAt | updated_at |

**Always use snake_case in SQL!**

---

## 🎯 Status Values

- `draft` - Hidden from frontend
- `published` - **Visible on frontend**
- `archived` - Hidden from frontend

**Only `published` articles show on News.js!**

---

## 🚀 Ready-to-Use Files

1. **`database/setup_database.sql`** - Creates all tables
2. **`database/insert_sample_news.sql`** - Inserts 8 sample articles
3. **`database/NEWS_CRUD_COMMANDS.md`** - Complete command reference
4. **`database/ALL_COMMANDS.sql`** - All CRUD commands

---

**After setup, visit `http://localhost:3000/news` to see your articles!** 🎉

