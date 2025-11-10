# 📰 News CRUD - Complete Database & Backend Setup

## ✅ Setup Complete!

Your News CRUD database and backend are already fully implemented and ready to use.

---

## 📁 Files Created

### Database Migrations
1. **`database/migrations/create_news_table.sql`**
   - Complete table creation script
   - Includes all indexes and foreign keys
   - Sample data queries included

2. **`database/migrations/news_quick_test.sql`**
   - Quick test queries
   - INSERT, UPDATE, DELETE examples
   - Statistics and analytics queries

3. **`database/migrations/NEWS_CRUD_SETUP_GUIDE.md`**
   - Complete setup documentation
   - Troubleshooting guide
   - Testing examples

### This Summary
4. **`NEWS_CRUD_COMPLETE_SETUP.md`** (this file)
   - Overview of all components
   - Quick start guide

---

## 🎯 What's Already Working

### ✅ Backend Components

```
server/src/
├── models/News.js          ✅ Sequelize model with all fields
├── controllers/
│   └── newsController.js   ✅ Full CRUD operations
├── routes/
│   └── newsRoutes.js       ✅ All API endpoints
└── models/index.js         ✅ Associations configured
```

### ✅ Database Components

```
database/
├── mysql-schema.sql                    ✅ Main schema (includes news)
├── migrations/
│   ├── create_news_table.sql          ✅ Standalone table creation
│   ├── news_quick_test.sql            ✅ Test queries
│   └── NEWS_CRUD_SETUP_GUIDE.md       ✅ Documentation
└── fix_news_status_mysql.sql          ✅ Status column fix
```

---

## 🚀 Quick Start

### Step 1: Verify Database Table Exists

```bash
# Open phpMyAdmin at http://localhost/phpmyadmin
# Or use MySQL command line:

mysql -u root -p
USE ucaep_db;
DESCRIBE news;
```

**Expected Result:** You should see all columns including:
- id, title, content, excerpt, image_url
- author_id, category, status, published_at
- created_at, updated_at

### Step 2: If Table Doesn't Exist, Create It

**Option A: Using Existing Schema**
```bash
# If you imported mysql-schema.sql, table should already exist
# Just verify it's there
```

**Option B: Create Standalone**
```sql
-- In phpMyAdmin SQL tab, run:
SOURCE database/migrations/create_news_table.sql;
```

### Step 3: Test the API

```bash
# Start backend server
cd server
npm start

# Test GET all news (should return empty array if no data)
curl http://localhost:5000/api/news

# Create test news (requires admin login token)
# Login first to get token, then:
curl -X POST http://localhost:5000/api/news \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "This is test content with at least 50 characters as required by validation rules.",
    "category": "news",
    "status": "published"
  }'
```

---

## 📊 Database Schema

### News Table Structure

```sql
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url VARCHAR(500),
  author_id INT,
  category ENUM('news', 'press_release', 'event', 'announcement') DEFAULT 'news',
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Key Features

| Feature | Implementation |
|---------|---------------|
| **Status Management** | draft, published, archived |
| **Categories** | news, press_release, event, announcement |
| **Author Tracking** | Foreign key to users table |
| **Auto Timestamps** | created_at, updated_at |
| **Soft Delete** | Via status (archived) or hard delete |
| **Indexes** | On author_id, category, status, published_at |

---

## 🔌 API Endpoints

### Public Endpoints (No Auth Required)

```bash
# Get all published news
GET /api/news
Query params:
  - page (default: 1)
  - limit (default: 10)
  - category (filter by category)
  - search (search in title/content)

# Get single news article
GET /api/news/:id
```

### Admin Endpoints (Auth Required)

```bash
# Create news article
POST /api/news
Headers: Authorization: Bearer TOKEN
Body: { title, content, excerpt?, imageUrl?, category, status }

# Update news article
PUT /api/news/:id
Headers: Authorization: Bearer TOKEN
Body: { title, content, excerpt?, imageUrl?, category, status }

# Delete news article
DELETE /api/news/:id
Headers: Authorization: Bearer TOKEN

# Get all news for admin (including drafts)
GET /api/news/admin/all
Headers: Authorization: Bearer TOKEN
Query params:
  - page, limit
  - status (filter by status)
  - category (filter by category)
```

---

## 🧪 Testing Examples

### 1. Using SQL (phpMyAdmin)

```sql
-- Insert test data
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Test Article', 'This is test content', 'Test excerpt', 'news', 'published', NOW());

-- Get all published
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;

-- Update status
UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;

-- View with author info
SELECT n.*, CONCAT(u.first_name, ' ', u.last_name) as author 
FROM news n 
LEFT JOIN users u ON n.author_id = u.id;
```

### 2. Using API (Postman/curl)

```bash
# Get all published news
curl http://localhost:5000/api/news

# Create news (need admin token first)
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/news \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Breaking News",
    "content": "This is a comprehensive news article with detailed information about the latest developments.",
    "excerpt": "Latest updates from our platform",
    "category": "news",
    "status": "published"
  }'

# Update news
curl -X PUT http://localhost:5000/api/news/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "archived"}'

# Delete news
curl -X DELETE http://localhost:5000/api/news/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔒 Security & Validation

### Authentication
- ✅ Public endpoints: Read-only access to published news
- ✅ Admin endpoints: JWT authentication required
- ✅ Author ID: Automatically set from JWT token

### Validation Rules
| Field | Rules |
|-------|-------|
| `title` | min: 5, max: 200 chars |
| `content` | min: 50 chars |
| `excerpt` | max: 500 chars |
| `imageUrl` | must be valid URI |
| `category` | must be ENUM value |
| `status` | must be ENUM value |

### Data Protection
- ✅ Foreign key constraints
- ✅ ON DELETE SET NULL (preserves articles)
- ✅ Input sanitization via Joi
- ✅ SQL injection prevention via Sequelize ORM

---

## 📈 Query Patterns

### Most Common Queries

```sql
-- Get recent published news
SELECT * FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC 
LIMIT 10;

-- Get news by category
SELECT * FROM news 
WHERE category = 'announcement' 
  AND status = 'published'
ORDER BY published_at DESC;

-- Get pending drafts for admin review
SELECT * FROM news 
WHERE status = 'draft' 
ORDER BY created_at DESC;

-- Archive old news (1 year+)
UPDATE news 
SET status = 'archived' 
WHERE published_at < DATE_SUB(NOW(), INTERVAL 1 YEAR) 
  AND status = 'published';

-- News statistics
SELECT 
    status,
    COUNT(*) as count
FROM news
GROUP BY status;
```

---

## 🔄 Workflow Example

### Typical News Publishing Workflow

1. **Create Draft** (Admin)
   ```json
   POST /api/news
   {
     "title": "New Article",
     "content": "Full article content...",
     "status": "draft"
   }
   ```

2. **Review Draft** (Admin Dashboard)
   ```
   GET /api/news/admin/all?status=draft
   ```

3. **Publish** (Admin)
   ```json
   PUT /api/news/:id
   {
     "status": "published"
   }
   ```
   Published news now visible to public at `/api/news`

4. **Archive Old Articles** (Admin)
   ```json
   PUT /api/news/:id
   {
     "status": "archived"
   }
   ```

---

## 🐛 Troubleshooting

### Problem: "Table 'news' doesn't exist"

**Solution:**
```sql
-- Run the migration
SOURCE database/migrations/create_news_table.sql;
```

### Problem: "Column 'status' not found"

**Solution:**
```sql
-- Add missing column
ALTER TABLE news 
ADD COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'draft' NOT NULL;
```

### Problem: "Foreign key constraint fails"

**Solution:**
```sql
-- Verify users table exists with data
SELECT * FROM users;

-- If empty, create admin user
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@ucaep.com', 
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
        'Admin', 'User', 'admin');
```

### Problem: "Validation error"

**Check:**
- Title: at least 5 characters
- Content: at least 50 characters
- Category: must be 'news', 'press_release', 'event', or 'announcement'
- Status: must be 'draft', 'published', or 'archived'

---

## 📚 Documentation Files

1. **`database/migrations/NEWS_CRUD_SETUP_GUIDE.md`**
   - Complete setup instructions
   - Detailed testing examples
   - Full troubleshooting guide

2. **`database/migrations/create_news_table.sql`**
   - Table creation script
   - Verification queries
   - Sample data inserts

3. **`database/migrations/news_quick_test.sql`**
   - Quick test queries
   - Statistics queries
   - Cleanup scripts

4. **`NEWS_CRUD_COMPLETE_SETUP.md`** (this file)
   - Overview and quick reference

---

## ✅ Verification Checklist

Before using in production:

- [ ] News table created with all columns
- [ ] Indexes created for performance
- [ ] Foreign key to users table working
- [ ] Default values set correctly
- [ ] Backend API endpoints tested
- [ ] Authentication working on admin routes
- [ ] Validation working correctly
- [ ] Sample data inserted and queried
- [ ] Frontend integration ready

---

## 🎉 You're Ready!

Everything is set up and ready to use. Your News CRUD system includes:

✅ Complete database schema  
✅ Full backend API  
✅ CRUD operations  
✅ Authentication & authorization  
✅ Data validation  
✅ Status management  
✅ Category filtering  
✅ Search functionality  
✅ Admin dashboard support  

**Need more help?** See `database/migrations/NEWS_CRUD_SETUP_GUIDE.md`

