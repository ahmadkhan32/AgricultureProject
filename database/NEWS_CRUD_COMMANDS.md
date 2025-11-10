# 📰 News CRUD Commands - Complete Guide
## MySQL Commands for News Articles (Working with Frontend)

---

## 🎯 Quick Setup First

### Step 1: Run Database Setup
1. Open **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Click **"SQL"** tab
3. Click **"Choose File"**
4. Select: `database/setup_database.sql`
5. Click **"Go"**

OR use Command Prompt:
```cmd
cd "D:\New folder\Agriculturee website\database"
mysql -u root -p ucaep_db < setup_database.sql
```

---

## 📋 IMPORTANT: Column Names in Database

Your backend uses **camelCase** in code, but database uses **snake_case**:

| Code (Backend) | Database Column |
|----------------|-----------------|
| `imageUrl` | `image_url` |
| `authorId` | `author_id` |
| `publishedAt` | `published_at` |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |

**Always use snake_case in SQL commands!**

---

## ➕ INSERT - Create News Articles

### Always Start With:
```sql
USE ucaep_db;
```

### Insert Single Published Article
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES
(
  'Nouvelle Initiative d''Agriculture Durable aux Comores',
  'L''Union des Chambres d''Agriculture, d''Élevage et de Pêche (UCAEP) annonce le lancement d''un nouveau programme visant à promouvoir l''agriculture durable à travers toutes les îles des Comores. Ce programme inclut des formations, des subventions pour l''équipement, et un accompagnement technique pour les producteurs locaux. Les bénéficiaires auront accès à des ressources et à un réseau de soutien pour développer leurs activités agricoles de manière durable et rentable.',
  'Lancement d''un nouveau programme d''agriculture durable avec formations et subventions pour les producteurs comoriens',
  'news',
  'published',
  NOW(),
  1
);
```

### Insert Multiple Articles at Once
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES
(
  'Programme de Formation en Pêche Durable',
  'Le Département des Pêches de l''UCAEP organise une série de formations sur les techniques de pêche durable et la gestion des ressources halieutiques. Ces formations s''adressent aux pêcheurs locaux et visent à améliorer leurs pratiques tout en préservant les écosystèmes marins. Les participants apprendront les meilleures pratiques, les réglementations en vigueur, et recevront des certificats à la fin du programme.',
  'Formations gratuites sur les techniques de pêche durable pour les pêcheurs locaux',
  'event',
  'published',
  NOW(),
  1
),
(
  'Nouveau Partenariat avec la FAO',
  'L''UCAEP a signé un partenariat stratégique avec l''Organisation des Nations Unies pour l''Alimentation et l''Agriculture (FAO). Ce partenariat permettra de renforcer les capacités des producteurs agricoles et d''améliorer la sécurité alimentaire aux Comores. Les projets incluront des formations, du financement et un partage d''expertise technique.',
  'Signature d''un partenariat stratégique avec la FAO pour le développement agricole',
  'press_release',
  'published',
  NOW(),
  1
),
(
  'Appel à Candidatures: Programme de Financement 2025',
  'L''UCAEP lance un appel à candidatures pour son programme de financement annuel destiné aux producteurs agricoles, éleveurs et pêcheurs. Ce programme offre des subventions et des prêts à taux préférentiel pour le développement de projets durables. Les candidatures sont ouvertes jusqu''au 31 décembre 2025. Tous les producteurs éligibles sont encouragés à postuler.',
  'Programme de financement 2025: Subventions et prêts pour les producteurs',
  'announcement',
  'published',
  NOW(),
  1
);
```

### Insert Draft Article (Will NOT show on frontend)
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, author_id) VALUES
(
  'Article en Cours de Rédaction',
  'Ceci est un article brouillon qui ne sera pas visible sur le site public jusqu''à publication.',
  'Description du brouillon',
  'news',
  'draft',
  1
);
```

### Get Author ID (if needed)
```sql
USE ucaep_db;

-- Get admin user ID
SELECT id FROM users WHERE email = 'admin@ucaep.com';

-- Or get any user ID
SELECT id, email, first_name, last_name FROM users;
```

---

## 👁️ SELECT - View News Articles

### View ALL Published Articles (What Frontend Shows)
```sql
USE ucaep_db;

SELECT 
  id,
  title,
  excerpt,
  category,
  status,
  DATE(published_at) as published_date,
  created_at
FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC;
```

### View All Articles with Full Content
```sql
USE ucaep_db;

SELECT 
  id,
  title,
  content,
  excerpt,
  image_url,
  category,
  status,
  published_at,
  author_id,
  created_at
FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC;
```

### View Single Article by ID
```sql
USE ucaep_db;

SELECT 
  n.*,
  u.first_name,
  u.last_name,
  u.email as author_email
FROM news n
LEFT JOIN users u ON n.author_id = u.id
WHERE n.id = 1;
```

### View Articles by Category
```sql
USE ucaep_db;

-- View all 'event' articles
SELECT * FROM news 
WHERE category = 'event' 
AND status = 'published' 
ORDER BY published_at DESC;

-- View all 'news' articles
SELECT * FROM news 
WHERE category = 'news' 
AND status = 'published' 
ORDER BY published_at DESC;

-- View all 'press_release' articles
SELECT * FROM news 
WHERE category = 'press_release' 
AND status = 'published' 
ORDER BY published_at DESC;
```

### Search Articles by Keyword
```sql
USE ucaep_db;

SELECT * FROM news 
WHERE status = 'published' 
AND (
  title LIKE '%agriculture%' 
  OR content LIKE '%agriculture%'
)
ORDER BY published_at DESC;
```

### View Latest 10 Articles
```sql
USE ucaep_db;

SELECT * FROM news 
WHERE status = 'published' 
ORDER BY published_at DESC 
LIMIT 10;
```

### View All Articles Including Drafts (Admin View)
```sql
USE ucaep_db;

SELECT 
  id,
  title,
  category,
  status,
  CASE 
    WHEN status = 'published' THEN 'Yes'
    ELSE 'No'
  END as is_visible,
  published_at,
  created_at
FROM news 
ORDER BY created_at DESC;
```

### Count Articles
```sql
USE ucaep_db;

-- Total count
SELECT COUNT(*) as total FROM news;

-- Count by status
SELECT status, COUNT(*) as count 
FROM news 
GROUP BY status;

-- Count by category
SELECT category, COUNT(*) as count 
FROM news 
WHERE status = 'published'
GROUP BY category;
```

---

## ✏️ UPDATE - Edit News Articles

### Publish a Draft Article
```sql
USE ucaep_db;

-- Make sure to set published_at when publishing
UPDATE news 
SET 
  status = 'published',
  published_at = NOW()
WHERE id = 1;
```

### Update Article Content
```sql
USE ucaep_db;

UPDATE news 
SET 
  title = 'Titre Mis à Jour',
  content = 'Nouveau contenu complet de l''article avec toutes les informations mises à jour. Assurez-vous que le contenu est suffisamment long pour passer la validation du backend.',
  excerpt = 'Nouvelle description courte mise à jour',
  updated_at = NOW()
WHERE id = 1;
```

### Update Article with Image URL
```sql
USE ucaep_db;

UPDATE news 
SET 
  image_url = 'https://example.com/images/news-article.jpg',
  updated_at = NOW()
WHERE id = 1;
```

### Change Article Category
```sql
USE ucaep_db;

UPDATE news 
SET 
  category = 'event',
  updated_at = NOW()
WHERE id = 1;
```

### Archive an Article (Hide from frontend)
```sql
USE ucaep_db;

UPDATE news 
SET 
  status = 'archived',
  updated_at = NOW()
WHERE id = 1;
```

### Unpublish (Change to Draft)
```sql
USE ucaep_db;

UPDATE news 
SET 
  status = 'draft',
  published_at = NULL,
  updated_at = NOW()
WHERE id = 1;
```

### Publish All Drafts Older Than 7 Days
```sql
USE ucaep_db;

UPDATE news 
SET 
  status = 'published',
  published_at = NOW(),
  updated_at = NOW()
WHERE status = 'draft' 
AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

---

## 🗑️ DELETE - Remove News Articles

### Delete Single Article
```sql
USE ucaep_db;

DELETE FROM news WHERE id = 1;
```

### Delete Multiple Articles
```sql
USE ucaep_db;

DELETE FROM news WHERE id IN (1, 2, 3);
```

### Delete All Draft Articles
```sql
USE ucaep_db;

DELETE FROM news WHERE status = 'draft';
```

### Delete Archived Articles Older Than 1 Year
```sql
USE ucaep_db;

DELETE FROM news 
WHERE status = 'archived' 
AND created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### Delete Test Articles
```sql
USE ucaep_db;

DELETE FROM news WHERE title LIKE '%Test%' OR title LIKE '%test%';
```

---

## 🎯 Complete Workflow Examples

### Example 1: Create and Publish Article (Step by Step)
```sql
USE ucaep_db;

-- Step 1: Create as draft
INSERT INTO news (title, content, excerpt, category, status, author_id) VALUES
(
  'Nouvel Article de Test',
  'Contenu complet de l''article avec toutes les informations nécessaires pour passer la validation. Le contenu doit faire au moins 50 caractères.',
  'Description courte de l''article',
  'news',
  'draft',
  1
);

-- Step 2: Get the new ID
SELECT LAST_INSERT_ID() as new_article_id;

-- Step 3: Publish it (replace NEW_ID with actual ID from Step 2)
UPDATE news 
SET 
  status = 'published',
  published_at = NOW()
WHERE id = LAST_INSERT_ID();

-- Step 4: Verify it's published and visible
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC LIMIT 5;
```

### Example 2: Update Existing Article
```sql
USE ucaep_db;

-- Step 1: View current article
SELECT * FROM news WHERE id = 1;

-- Step 2: Update it
UPDATE news 
SET 
  title = 'Titre Mis à Jour avec Succès',
  content = 'Nouveau contenu complet avec toutes les informations mises à jour. Cet article a été modifié et est maintenant prêt pour publication.',
  excerpt = 'Description mise à jour',
  category = 'news',
  status = 'published',
  published_at = NOW(),
  updated_at = NOW()
WHERE id = 1;

-- Step 3: Verify update
SELECT * FROM news WHERE id = 1;
```

### Example 3: Bulk Insert 5 Articles
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES
('Article 1', 'Contenu complet de l''article 1...', 'Description 1', 'news', 'published', NOW(), 1),
('Article 2', 'Contenu complet de l''article 2...', 'Description 2', 'event', 'published', NOW(), 1),
('Article 3', 'Contenu complet de l''article 3...', 'Description 3', 'announcement', 'published', NOW(), 1),
('Article 4', 'Contenu complet de l''article 4...', 'Description 4', 'press_release', 'published', NOW(), 1),
('Article 5', 'Contenu complet de l''article 5...', 'Description 5', 'news', 'published', NOW(), 1);

-- Verify all were created
SELECT COUNT(*) as total_published FROM news WHERE status = 'published';
```

---

## ✅ Verification Queries

### Check Frontend Will Show Articles
```sql
USE ucaep_db;

-- This query matches what the frontend API uses
SELECT 
  id,
  title,
  excerpt,
  image_url,
  category,
  status,
  published_at,
  created_at
FROM news 
WHERE status = 'published' 
AND published_at IS NOT NULL
ORDER BY published_at DESC;
```

### Check Database Structure
```sql
USE ucaep_db;

-- View table structure
DESCRIBE news;

-- View all columns
SHOW COLUMNS FROM news;
```

### Check Article Counts
```sql
USE ucaep_db;

SELECT 
  'Total Articles' as type,
  COUNT(*) as count
FROM news
UNION ALL
SELECT 
  'Published Articles',
  COUNT(*)
FROM news
WHERE status = 'published'
UNION ALL
SELECT 
  'Draft Articles',
  COUNT(*)
FROM news
WHERE status = 'draft'
UNION ALL
SELECT 
  'Archived Articles',
  COUNT(*)
FROM news
WHERE status = 'archived';
```

---

## 📱 How Frontend Displays Data

### News.js Page
- Fetches from: `GET /api/news?status=published`
- Shows: All articles with `status = 'published'`
- Displays: Title, excerpt, category, date, image
- Click: Navigates to `/news/:id`

### NewsDetail.js Page
- Fetches from: `GET /api/news/:id`
- Shows: Full article content
- Requires: Article must be `published`

### Admin NewsManagement.js
- Fetches from: `GET /api/news/admin/all`
- Shows: All articles (draft, published, archived)
- Allows: Create, Edit, Delete operations

---

## 🔧 Troubleshooting

### Problem: Articles Not Showing on Frontend
```sql
-- Check if articles are published
SELECT id, title, status, published_at FROM news WHERE id = 1;

-- Fix: Publish the article
UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;
```

### Problem: Frontend Shows Error 404
```sql
-- Check if article exists
SELECT * FROM news WHERE id = 1;

-- Check if article is published
SELECT * FROM news WHERE id = 1 AND status = 'published';
```

### Problem: Content Too Short (Validation Error)
```sql
-- Articles need at least 50 characters in content
-- Check content length
SELECT id, title, LENGTH(content) as content_length 
FROM news 
WHERE LENGTH(content) < 50;
```

---

## 🚀 Quick Command Reference

### One-Line Commands
```sql
-- View published news
USE ucaep_db; SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;

-- Create published article
USE ucaep_db; INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES ('Title', 'Content...', 'Excerpt', 'news', 'published', NOW(), 1);

-- Update article
USE ucaep_db; UPDATE news SET title = 'New Title', content = 'New Content...' WHERE id = 1;

-- Delete article
USE ucaep_db; DELETE FROM news WHERE id = 1;

-- Publish draft
USE ucaep_db; UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;
```

---

## 📝 Notes

1. **Status Values**: `draft`, `published`, `archived` (case-sensitive!)
2. **Categories**: `news`, `press_release`, `event`, `announcement`
3. **Frontend Only Shows**: Articles with `status = 'published'`
4. **Required Fields**: `title` (min 5 chars), `content` (min 50 chars)
5. **Always Use**: `NOW()` for current timestamp
6. **Column Names**: Use snake_case (`image_url`, not `imageUrl`)

---

**After running these commands, refresh your frontend at `http://localhost:3000/news` to see the articles!** 🎉

