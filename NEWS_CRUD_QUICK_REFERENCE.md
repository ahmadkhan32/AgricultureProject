# 📰 News CRUD - Quick Reference Card

## ⚡ Quick Commands

### Create Table (if needed)
```sql
-- In phpMyAdmin: database/migrations/create_news_table.sql
-- Or from command line:
mysql -u root -p ucaep_db < database/migrations/create_news_table.sql
```

### Test Table Exists
```sql
USE ucaep_db;
DESCRIBE news;
SHOW INDEX FROM news;
```

### Insert Test Data
```sql
INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Test News', 'This is test content with sufficient length for validation.', 'Test excerpt', 'news', 'published', NOW());
```

---

## 🔌 API Endpoints (http://localhost:5000)

### Public (No Auth)
```bash
GET  /api/news                    # Get all published news
GET  /api/news/:id                # Get single article
```

### Admin (Auth Required)
```bash
POST   /api/news                  # Create news
PUT    /api/news/:id              # Update news
DELETE /api/news/:id              # Delete news
GET    /api/news/admin/all        # Get all (including drafts)
```

### Query Parameters
```bash
?page=1&limit=10                  # Pagination
?category=news                    # Filter by category
?status=draft                     # Filter by status (admin)
?search=agriculture               # Search in title/content
```

---

## 📊 Table Schema

```
news
├── id (PK, Auto Increment)
├── title (VARCHAR 200, NOT NULL)
├── content (TEXT, NOT NULL)
├── excerpt (TEXT)
├── image_url (VARCHAR 500)
├── author_id (FK → users.id)
├── category (ENUM: news, press_release, event, announcement)
├── status (ENUM: draft, published, archived)
├── published_at (TIMESTAMP)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## ✅ Validation Rules

| Field | Rules |
|-------|-------|
| `title` | min: 5, max: 200 chars |
| `content` | min: 50 chars |
| `excerpt` | max: 500 chars |
| `imageUrl` | valid URI |
| `category` | ENUM value |
| `status` | ENUM value |

---

## 🔑 Auth Example

```bash
# Login first
POST /api/auth/login
{
  "email": "admin@ucaep.com",
  "password": "admin123"
}

# Use token
curl http://localhost:5000/api/news \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Common SQL Queries

```sql
-- Get all published
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;

-- Get by category
SELECT * FROM news WHERE category = 'announcement' AND status = 'published';

-- Update status
UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;

-- Statistics
SELECT status, COUNT(*) FROM news GROUP BY status;
```

---

## 📁 Key Files

```
database/migrations/
├── create_news_table.sql         # Create table script
├── news_quick_test.sql           # Test queries
└── NEWS_CRUD_SETUP_GUIDE.md     # Full documentation

server/src/
├── models/News.js                # Sequelize model
├── controllers/newsController.js # CRUD logic
└── routes/newsRoutes.js          # API routes

NEWS_CRUD_COMPLETE_SETUP.md      # Complete guide
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Table doesn't exist | Run `create_news_table.sql` |
| Column 'status' missing | Run `fix_news_status_mysql.sql` |
| 401 Unauthorized | Login and include Bearer token |
| 400 Validation error | Check field length requirements |

---

## 📚 Full Documentation

- **Setup Guide**: `database/migrations/NEWS_CRUD_SETUP_GUIDE.md`
- **Complete Guide**: `NEWS_CRUD_COMPLETE_SETUP.md`
- **Test Queries**: `database/migrations/news_quick_test.sql`

