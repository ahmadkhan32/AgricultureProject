# 💻 MySQL Commands for Windows CMD
## Step-by-Step Command Prompt Guide

---

## 🚀 STEP 1: Open Command Prompt

**Method 1:**
- Press `Win + R`
- Type `cmd`
- Press `Enter`

**Method 2:**
- Press `Win + X`
- Select **"Windows PowerShell"** or **"Command Prompt"**

**Method 3:**
- Type `cmd` in Windows search
- Click **"Command Prompt"**

---

## 📍 STEP 2: Navigate to MySQL Bin Folder

```cmd
cd C:\xampp\mysql\bin
```

**OR if MySQL is installed separately:**

```cmd
cd C:\Program Files\MySQL\MySQL Server 8.0\bin
```

**Check if MySQL is accessible:**
```cmd
mysql --version
```

If you see version number, MySQL is ready!

---

## 🔐 STEP 3: Connect to MySQL

### Connect Without Password (XAMPP default)
```cmd
mysql -u root
```

### Connect With Password
```cmd
mysql -u root -p
```
(Press Enter, then enter your password when prompted)

### Connect to Specific Database
```cmd
mysql -u root -p ucaep_db
```

---

## ✅ STEP 4: Select Database

After connecting, you'll see `mysql>` prompt. Type:

```sql
USE ucaep_db;
```

**Verify connection:**
```sql
SHOW TABLES;
```

Should show: `news`, `users`, `producers`, etc.

---

## 📝 STEP 5: Run SQL Commands

### Method A: Run Commands Directly

Once connected and in `ucaep_db`, type SQL commands:

```sql
-- View all news
SELECT * FROM news WHERE status = 'published';

-- Create news article
INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) 
VALUES ('Title', 'Content...', 'Excerpt', 'news', 'published', NOW(), 1);

-- Update news
UPDATE news SET title = 'New Title' WHERE id = 1;

-- Delete news
DELETE FROM news WHERE id = 1;
```

### Method B: Run SQL File from CMD

**Exit MySQL first:**
```sql
EXIT;
```

**Then from CMD:**
```cmd
mysql -u root -p ucaep_db < "D:\New folder\Agriculturee website\database\setup_database.sql"
```

**OR using full path:**
```cmd
cd "D:\New folder\Agriculturee website\database"
mysql -u root -p ucaep_db < setup_database.sql
```

---

## 🎯 Complete Examples

### Example 1: Setup Database from CMD

```cmd
REM Step 1: Navigate to project folder
cd "D:\New folder\Agriculturee website\database"

REM Step 2: Run setup script (enter password when prompted)
mysql -u root -p ucaep_db < setup_database.sql

REM Step 3: Insert sample news
mysql -u root -p ucaep_db < insert_sample_news.sql
```

### Example 2: Connect and Run Commands

```cmd
REM Step 1: Go to MySQL bin
cd C:\xampp\mysql\bin

REM Step 2: Connect to database
mysql -u root -p ucaep_db

REM Step 3: Now you're in MySQL, run SQL commands:
```

**Then in MySQL prompt:**
```sql
USE ucaep_db;

-- View news
SELECT * FROM news;

-- Create article
INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) 
VALUES ('Test Article', 'This is test content with more than 50 characters to pass validation', 'Test excerpt', 'news', 'published', NOW(), 1);

-- Exit when done
EXIT;
```

### Example 3: Insert News Article (One Command)

```cmd
cd C:\xampp\mysql\bin

mysql -u root -p ucaep_db -e "INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES ('Article Title', 'Full content here...', 'Excerpt', 'news', 'published', NOW(), 1);"
```

---

## 📋 Quick Reference Commands

### Essential CMD Commands

```cmd
REM Navigate to MySQL
cd C:\xampp\mysql\bin

REM Connect to MySQL
mysql -u root

REM Connect to specific database
mysql -u root -p ucaep_db

REM Run SQL file
mysql -u root -p ucaep_db < filename.sql

REM Run SQL command directly
mysql -u root -p ucaep_db -e "SELECT * FROM news;"
```

### Essential SQL Commands (After Connecting)

```sql
REM Use database
USE ucaep_db;

REM View tables
SHOW TABLES;

REM View news articles
SELECT * FROM news WHERE status = 'published';

REM Count articles
SELECT COUNT(*) FROM news WHERE status = 'published';

REM Create article
INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) 
VALUES ('Title', 'Content...', 'Excerpt', 'news', 'published', NOW(), 1);

REM Update article
UPDATE news SET title = 'New Title' WHERE id = 1;

REM Delete article
DELETE FROM news WHERE id = 1;

REM Exit MySQL
EXIT;
```

---

## 🔧 Common Issues & Solutions

### Problem 1: "mysql is not recognized"

**Solution:**
- MySQL not in PATH
- Use full path: `C:\xampp\mysql\bin\mysql.exe -u root`

**OR add to PATH:**
```cmd
SET PATH=%PATH%;C:\xampp\mysql\bin
```

### Problem 2: "Access Denied"

**Solution:**
```cmd
mysql -u root -p
```
Enter password when prompted

**OR if no password set:**
```cmd
mysql -u root
```

### Problem 3: "Database doesn't exist"

**Solution:**
```sql
-- Create database first
CREATE DATABASE ucaep_db;
USE ucaep_db;
```

### Problem 4: "Table doesn't exist"

**Solution:**
Run setup script:
```cmd
mysql -u root -p ucaep_db < "D:\New folder\Agriculturee website\database\setup_database.sql"
```

---

## 🎯 Complete Workflow Example

### Full Setup from CMD

```cmd
REM ============================================
REM COMPLETE SETUP - Copy All Commands Below
REM ============================================

REM Step 1: Open CMD and navigate to project
cd "D:\New folder\Agriculturee website\database"

REM Step 2: Connect to MySQL and create database
C:\xampp\mysql\bin\mysql.exe -u root -p -e "CREATE DATABASE IF NOT EXISTS ucaep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

REM Step 3: Run setup script
C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db < setup_database.sql

REM Step 4: Insert sample news
C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db < insert_sample_news.sql

REM Step 5: Verify
C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db -e "SELECT COUNT(*) as total_news FROM news WHERE status = 'published';"
```

---

## 📝 Step-by-Step: Insert News Article from CMD

### Method 1: Interactive (Recommended)

```cmd
REM Step 1: Connect to MySQL
cd C:\xampp\mysql\bin
mysql -u root -p ucaep_db
```

**Then in MySQL prompt:**
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES
(
  'Nouvel Article depuis CMD',
  'Ceci est le contenu complet de mon article créé depuis la ligne de commande. Il contient suffisamment de texte pour passer la validation.',
  'Description de l''article',
  'news',
  'published',
  NOW(),
  1
);

SELECT * FROM news WHERE id = LAST_INSERT_ID();

EXIT;
```

### Method 2: Single Command

```cmd
cd C:\xampp\mysql\bin

mysql -u root -p ucaep_db -e "INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES ('Title', 'Content with more than 50 characters...', 'Excerpt', 'news', 'published', NOW(), 1); SELECT * FROM news WHERE id = LAST_INSERT_ID();"
```

---

## 🔍 View Data from CMD

```cmd
cd C:\xampp\mysql\bin

REM View all published news
mysql -u root -p ucaep_db -e "SELECT id, title, category, status, published_at FROM news WHERE status = 'published' ORDER BY published_at DESC;"

REM Count articles
mysql -u root -p ucaep_db -e "SELECT COUNT(*) as total FROM news WHERE status = 'published';"

REM View single article
mysql -u root -p ucaep_db -e "SELECT * FROM news WHERE id = 1;"
```

---

## ✏️ Update Data from CMD

```cmd
cd C:\xampp\mysql\bin

REM Update article
mysql -u root -p ucaep_db -e "UPDATE news SET title = 'Titre Mis à Jour', content = 'Nouveau contenu...' WHERE id = 1;"

REM Publish draft
mysql -u root -p ucaep_db -e "UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;"
```

---

## 🗑️ Delete Data from CMD

```cmd
cd C:\xampp\mysql\bin

REM Delete article
mysql -u root -p ucaep_db -e "DELETE FROM news WHERE id = 1;"

REM Delete all drafts
mysql -u root -p ucaep_db -e "DELETE FROM news WHERE status = 'draft';"
```

---

## 📄 Run SQL File from CMD

### Step-by-Step

```cmd
REM Step 1: Navigate to database folder
cd "D:\New folder\Agriculturee website\database"

REM Step 2: Run SQL file
C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db < setup_database.sql

REM OR if MySQL is in PATH
mysql -u root -p ucaep_db < setup_database.sql
```

### Available SQL Files

```cmd
REM Setup database (creates tables)
mysql -u root -p ucaep_db < setup_database.sql

REM Insert sample news (8 articles)
mysql -u root -p ucaep_db < insert_sample_news.sql

REM View all commands
mysql -u root -p ucaep_db < ALL_COMMANDS.sql
```

---

## ✅ Verification Commands

```cmd
cd C:\xampp\mysql\bin

REM Check database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'ucaep_db';"

REM Check tables exist
mysql -u root -p ucaep_db -e "SHOW TABLES;"

REM Check news count
mysql -u root -p ucaep_db -e "SELECT COUNT(*) as total FROM news;"

REM Check published news
mysql -u root -p ucaep_db -e "SELECT COUNT(*) as published FROM news WHERE status = 'published';"
```

---

## 🎯 Quick Command Templates

### Template 1: Connect to MySQL
```cmd
cd C:\xampp\mysql\bin
mysql -u root -p ucaep_db
```

### Template 2: Run SQL File
```cmd
cd "D:\New folder\Agriculturee website\database"
C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db < filename.sql
```

### Template 3: Run Single SQL Command
```cmd
cd C:\xampp\mysql\bin
mysql -u root -p ucaep_db -e "YOUR_SQL_COMMAND_HERE;"
```

### Template 4: Create and Insert Article
```cmd
cd C:\xampp\mysql\bin
mysql -u root -p ucaep_db -e "INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES ('Title', 'Content...', 'Excerpt', 'news', 'published', NOW(), 1);"
```

---

## 🚀 Most Common Use Cases

### Use Case 1: Quick Setup
```cmd
cd "D:\New folder\Agriculturee website\database"
C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db < setup_database.sql
C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db < insert_sample_news.sql
```

### Use Case 2: View All News
```cmd
cd C:\xampp\mysql\bin
mysql -u root -p ucaep_db -e "SELECT id, title, status, published_at FROM news ORDER BY published_at DESC;"
```

### Use Case 3: Insert Article
```cmd
cd C:\xampp\mysql\bin
mysql -u root -p ucaep_db
```
Then type SQL:
```sql
USE ucaep_db;
INSERT INTO news (title, content, excerpt, category, status, published_at, author_id) VALUES ('Title', 'Content...', 'Excerpt', 'news', 'published', NOW(), 1);
```

### Use Case 4: Update Article
```cmd
cd C:\xampp\mysql\bin
mysql -u root -p ucaep_db -e "UPDATE news SET title = 'New Title' WHERE id = 1;"
```

---

## 📚 Additional Tips

### Tip 1: Save MySQL Password (Optional)

Create file `C:\xampp\mysql\bin\my.cnf`:
```ini
[client]
user=root
password=your_password
```

Then you can use:
```cmd
mysql ucaep_db
```
(without -u and -p)

### Tip 2: Use Batch File

Create `run_mysql.bat`:
```batch
@echo off
cd C:\xampp\mysql\bin
mysql -u root -p ucaep_db
```

Double-click to run!

### Tip 3: Output to File

```cmd
mysql -u root -p ucaep_db -e "SELECT * FROM news;" > output.txt
```

---

## 🎉 You're Ready!

**Most Common Commands:**

1. **Connect:** `cd C:\xampp\mysql\bin` then `mysql -u root -p ucaep_db`
2. **Run File:** `mysql -u root -p ucaep_db < filename.sql`
3. **Run Command:** `mysql -u root -p ucaep_db -e "SQL_COMMAND;"`

**Start with:**
```cmd
cd "D:\New folder\Agriculturee website\database"
C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db < setup_database.sql
```

**Then check frontend:** `http://localhost:3000/news` 🚀

