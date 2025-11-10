# 📚 Complete Database Setup Guide

## 🎯 Quick Start (Choose One Method)

### ✅ Method 1: phpMyAdmin (Recommended - Easiest)

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL**

2. **Open phpMyAdmin**
   - Browser: `http://localhost/phpmyadmin`
   - Login: `root` / (no password or your password)

3. **Run Setup Script**
   - Click **SQL** tab (top menu)
   - Open file: `database/setup_database.sql`
   - Copy ALL content and paste
   - Click **Go** button
   - ✅ Done! Your database is ready!

---

### ✅ Method 2: Command Prompt

1. **Open CMD/PowerShell**
   - Press `Win + R`
   - Type `cmd`, press Enter

2. **Navigate to Database Folder**
   ```cmd
   cd "D:\New folder\Agriculturee website\database"
   ```

3. **Run Setup Script**
   ```cmd
   cd C:\xampp\mysql\bin
   mysql -u root -p < "D:\New folder\Agriculturee website\database\setup_database.sql"
   ```
   (Enter MySQL password when prompted)

---

### ✅ Method 3: Batch File (Windows Only)

1. **Double-click**: `database/run_setup.bat`
2. **Enter MySQL password** (or press Enter if none)
3. ✅ Done!

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `setup_database.sql` | **Main setup file** - Creates all tables + sample data |
| `MYSQL_COMMANDS_GUIDE.md` | Complete command reference with examples |
| `QUICK_REFERENCE.md` | Quick reference card for daily use |
| `run_setup.bat` | Windows batch file for easy setup |

---

## 🔧 What Gets Created

### Tables:
- ✅ `users` - User accounts (admin/producer)
- ✅ `producers` - Producer profiles
- ✅ `news` - News articles
- ✅ `partnerships` - Partnership information
- ✅ `resources` - Document resources
- ✅ `projects` - Project information
- ✅ `messages` - Contact messages

### Sample Data:
- ✅ Admin user: `admin@ucaep.com` / `admin123`
- ✅ 3 Sample news articles (published)
- ✅ 3 Sample partnerships

---

## 📝 Daily Operations

### Insert News Article
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Article Title', 'Full content here...', 'Short description', 'news', 'published', NOW());
```

### View All Published News
```sql
USE ucaep_db;
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;
```

### Update News Status
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

## 📖 Documentation Files

1. **`MYSQL_COMMANDS_GUIDE.md`** - Complete guide with:
   - Step-by-step instructions
   - All CRUD operations
   - Examples for each table
   - Troubleshooting tips

2. **`QUICK_REFERENCE.md`** - Quick reference with:
   - Essential commands
   - Common queries
   - One-liner commands
   - Status values reference

3. **`setup_database.sql`** - Executable SQL file:
   - Creates all tables
   - Inserts admin user
   - Adds sample data
   - Ready to run!

---

## 🎯 Verification

After setup, verify everything works:

```sql
USE ucaep_db;

-- Check tables exist
SHOW TABLES;

-- Check data
SELECT COUNT(*) FROM news;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM partnerships;

-- View sample data
SELECT * FROM news LIMIT 5;
```

---

## 🆘 Troubleshooting

### Problem: "Table doesn't exist"
**Solution:** Run `setup_database.sql` again

### Problem: "Access denied"
**Solution:** 
- Check MySQL is running in XAMPP
- Verify username/password
- Try: `mysql -u root` (no password)

### Problem: "Foreign key constraint"
**Solution:**
- Make sure users table has data first
- Check referenced ID exists
- Use `INSERT IGNORE` instead of `INSERT`

### Problem: "Column doesn't exist"
**Solution:**
- Run migration files from `database/migrations/` folder
- Or manually add column using `ALTER TABLE`

---

## 💡 Pro Tips

1. **Always backup** before deleting data
2. **Test in phpMyAdmin** before using in code
3. **Use transactions** for multiple operations
4. **Check status values** match exactly (case-sensitive)
5. **Use `USE ucaep_db;`** first in every session

---

## 📞 Need Help?

Check these files:
- `MYSQL_COMMANDS_GUIDE.md` - Full documentation
- `QUICK_REFERENCE.md` - Quick commands
- `database/migrations/` - Migration files

---

## ✅ Success Checklist

- [ ] XAMPP MySQL is running
- [ ] Database `ucaep_db` created
- [ ] All tables created
- [ ] Admin user exists
- [ ] Sample data inserted
- [ ] Can view data in phpMyAdmin
- [ ] Frontend can connect to database

---

**You're all set! 🎉**

Now your database is ready and data will show in the frontend!

