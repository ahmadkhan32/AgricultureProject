# 📰 News CRUD Database Setup Guide

Complete guide for setting up the News table and CRUD functionality in your database.

## 📋 Overview

This guide will help you create the News table in your MySQL database and set up all the necessary components for full CRUD (Create, Read, Update, Delete) operations on news articles.

---

## 🗄️ Database Table Structure

### News Table Schema

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | INT | Primary key | Auto increment |
| `title` | VARCHAR(200) | News article title | NOT NULL |
| `content` | TEXT | Full article content | NOT NULL |
| `excerpt` | TEXT | Short summary | NULL allowed |
| `image_url` | VARCHAR(500) | Article image URL | NULL allowed |
| `author_id` | INT | Author user ID | Foreign key → users.id |
| `category` | ENUM | Article category | 'news', 'press_release', 'event', 'announcement' |
| `status` | ENUM | Publication status | 'draft', 'published', 'archived' |
| `published_at` | TIMESTAMP | Publication date | NULL allowed |
| `created_at` | TIMESTAMP | Creation date | Auto-set |
| `updated_at` | TIMESTAMP | Last update | Auto-update |

---

## 🚀 Setup Instructions

### Option 1: Using phpMyAdmin (Recommended for Beginners)

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL servers

2. **Open phpMyAdmin**
   - Navigate to: `http://localhost/phpmyadmin`

3. **Select Database**
   - Click on `ucaep_db` in the left sidebar

4. **Open SQL Tab**
   - Click on the "SQL" tab at the top

5. **Run Migration**
   - Open `database/migrations/create_news_table.sql`
   - Copy ALL the content
   - Paste into the SQL text area
   - Click "Go" button

6. **Verify**
   - Check the "news" table appears in the left sidebar
   - Click on the table to view structure

---

### Option 2: Using MySQL Command Line

```bash
# Navigate to your project directory
cd "D:\New folder\Agriculturee website"

# Login to MySQL
mysql -u root -p

# In MySQL prompt:
USE ucaep_db;
SOURCE database/migrations/create_news_table.sql;

# Exit MySQL
EXIT;
```

---

### Option 3: Using Existing Schema

If you already have the schema imported, the news table should already exist! Verify with:

```sql
USE ucaep_db;
DESCRIBE news;
```

If the table is missing columns, run the appropriate fix:
- `database/fix_news_status_mysql.sql` - Adds status column

---

## ✅ Verification Checklist

After running the migration, verify:

- [ ] News table exists in database
- [ ] All columns are created correctly
- [ ] All indexes are created
- [ ] Foreign key constraint exists
- [ ] Default values are set correctly

### Quick Verification Query

```sql
-- Check table structure
DESCRIBE news;

-- Check all indexes
SHOW INDEX FROM news;

-- Check foreign keys
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'news'
  AND TABLE_SCHEMA = DATABASE();
```

---

## 🔧 Backend Code Structure

### Already Implemented

✅ **Model**: `server/src/models/News.js`
- Complete Sequelize model definition
- All fields with proper types
- Associations configured

✅ **Controller**: `server/src/controllers/newsController.js`
- `getAll()` - Get all published news
- `getById()` - Get single news article
- `create()` - Create new news article
- `update()` - Update existing news article
- `delete()` - Delete news article
- `getAllForAdmin()` - Get all news for admin dashboard

✅ **Routes**: `server/src/routes/newsRoutes.js`
- Public: GET `/api/news` - Get all published
- Public: GET `/api/news/:id` - Get single article
- Admin: POST `/api/news` - Create article
- Admin: PUT `/api/news/:id` - Update article
- Admin: DELETE `/api/news/:id` - Delete article
- Admin: GET `/api/news/admin/all` - Get all (with drafts)

✅ **Associations**: `server/src/models/index.js`
- News belongs to User (author)
- User has many News

---

## 🧪 Testing the CRUD Operations

### 1. Create News Article (Admin Required)

```bash
POST http://localhost:5000/api/news
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Test News Article",
  "content": "This is a full length article content with at least 50 characters to pass validation.",
  "excerpt": "Short summary of the article",
  "imageUrl": "https://example.com/image.jpg",
  "category": "news",
  "status": "published"
}
```

### 2. Get All Published News

```bash
GET http://localhost:5000/api/news?page=1&limit=10&category=news
```

### 3. Get Single News Article

```bash
GET http://localhost:5000/api/news/1
```

### 4. Update News Article (Admin Required)

```bash
PUT http://localhost:5000/api/news/1
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content with at least 50 characters",
  "status": "published"
}
```

### 5. Delete News Article (Admin Required)

```bash
DELETE http://localhost:5000/api/news/1
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### 6. Get All News for Admin Dashboard

```bash
GET http://localhost:5000/api/news/admin/all?status=draft&page=1&limit=20
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 📊 Sample Data Queries

### Insert Sample News Article

```sql
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
(
  'Welcome to Our Platform',
  'We are excited to announce the launch of our comprehensive agricultural platform designed to support local farmers and producers throughout the region. This platform offers extensive resources, valuable connections, and numerous opportunities for growth in the agricultural sector.',
  'Announcing the launch of our new agricultural platform',
  'announcement',
  'published',
  NOW()
);
```

### Get All Published News

```sql
SELECT 
    n.id,
    n.title,
    n.excerpt,
    n.category,
    n.status,
    n.published_at,
    CONCAT(u.first_name, ' ', u.last_name) as author_name
FROM news n
LEFT JOIN users u ON n.author_id = u.id
WHERE n.status = 'published'
ORDER BY n.published_at DESC;
```

### Get News Statistics

```sql
SELECT 
    status,
    COUNT(*) as count
FROM news
GROUP BY status;
```

### Search News by Title/Content

```sql
SELECT * 
FROM news 
WHERE status = 'published' 
  AND (title LIKE '%agriculture%' OR content LIKE '%agriculture%')
ORDER BY published_at DESC;
```

---

## 🔒 Security Features

### Authentication & Authorization

- ✅ Public routes only show `published` news
- ✅ Admin-only routes for create/update/delete
- ✅ JWT token authentication required for admin operations
- ✅ User ID automatically set from JWT token on create

### Data Validation

- ✅ Title: minimum 5 characters, maximum 200
- ✅ Content: minimum 50 characters
- ✅ Excerpt: maximum 500 characters
- ✅ ImageUrl: must be valid URI
- ✅ Category: must match ENUM values
- ✅ Status: must match ENUM values

### Foreign Key Constraints

- ✅ `author_id` references `users.id`
- ✅ ON DELETE SET NULL (preserves article if user deleted)

---

## 🐛 Troubleshooting

### Problem: "Table 'news' doesn't exist"

**Solution:**
```sql
-- Run the migration file
SOURCE database/migrations/create_news_table.sql;
```

### Problem: "Column 'status' not found"

**Solution:**
```sql
-- Add the status column
ALTER TABLE news 
ADD COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'draft' NOT NULL;
```

### Problem: "Foreign key constraint fails"

**Solution:**
```sql
-- Verify users table exists and has data
SELECT * FROM users;

-- If users table is empty, create admin user first
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@ucaep.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'admin');
```

### Problem: "Validation error: content must be at least 50 characters"

**Solution:** Provide more detailed article content

### Problem: "401 Unauthorized"

**Solution:** 
- Make sure you're logged in as admin
- Check your JWT token is valid
- Verify you're sending `Authorization: Bearer YOUR_TOKEN` header

---

## 📚 Related Documentation

- **Model Definition**: `server/src/models/News.js`
- **Controller**: `server/src/controllers/newsController.js`
- **Routes**: `server/src/routes/newsRoutes.js`
- **Main Schema**: `database/mysql-schema.sql`
- **Status Fix**: `database/fix_news_status_mysql.sql`

---

## ✨ Features

### Status Management
- **Draft**: Work in progress, not visible to public
- **Published**: Visible to all users on the website
- **Archived**: Historical content, hidden from main feed

### Categories
- **news**: Regular news articles
- **press_release**: Official press releases
- **event**: Upcoming or past events
- **announcement**: Important announcements

### Pagination
- All list endpoints support pagination
- Query params: `?page=1&limit=10`

### Filtering
- Filter by category: `?category=news`
- Filter by status (admin): `?status=draft`
- Search by title/content: `?search=agriculture`

---

## 🎯 Next Steps

1. ✅ Database table created
2. ✅ Backend API working
3. 📝 Test all CRUD operations
4. 🎨 Connect to frontend
5. 🚀 Deploy to production

---

**Need Help?** Check the main troubleshooting guide: `TROUBLESHOOTING_GUIDE.md`
