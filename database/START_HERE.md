# 🚀 START HERE - MySQL Database Setup

## ⚡ Quick Setup (5 Minutes)

### Step 1: Start XAMPP
- Open **XAMPP Control Panel**
- Start **Apache** and **MySQL**

### Step 2: Open phpMyAdmin
- Go to: `http://localhost/phpmyadmin`
- Login: `root` / (no password or your password)

### Step 3: Run Setup
1. Click **"SQL"** tab
2. Click **"Choose File"**
3. Select: `database/setup_database.sql`
4. Click **"Go"**
5. ✅ **Done!**

---

## 📝 Quick Commands

### Always Start With:
```sql
USE ucaep_db;
```

### Insert News Article:
```sql
USE ucaep_db;

INSERT INTO news (title, content, excerpt, category, status, published_at) VALUES
('Article Title', 'Full content text...', 'Short description', 'news', 'published', NOW());
```

### View Published News:
```sql
USE ucaep_db;
SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC;
```

### Update News:
```sql
USE ucaep_db;
UPDATE news SET status = 'published', published_at = NOW() WHERE id = 1;
```

### Delete News:
```sql
USE ucaep_db;
DELETE FROM news WHERE id = 1;
```

---

## 📚 Documentation Files

1. **`START_HERE.md`** ← You are here!
2. **`setup_database.sql`** - Run this to create everything
3. **`ALL_COMMANDS.sql`** - All CRUD commands in one file
4. **`STEP_BY_STEP_GUIDE.md`** - Detailed step-by-step instructions
5. **`MYSQL_COMMANDS_GUIDE.md`** - Complete command reference
6. **`QUICK_REFERENCE.md`** - Quick command reference card

---

## ✅ What Gets Created

- ✅ Database: `ucaep_db`
- ✅ Tables: users, producers, news, partnerships, resources, projects, messages
- ✅ Admin user: `admin@ucaep.com` / `admin123`
- ✅ Sample data: 3 news articles, 3 partnerships

---

## 🎯 After Setup

1. **Test in phpMyAdmin:**
   ```sql
   USE ucaep_db;
   SELECT * FROM news;
   ```

2. **Check Frontend:**
   - Open: `http://localhost:3000/news`
   - Should show published articles!

3. **Admin Panel:**
   - Go to: `http://localhost:3000/admin/news`
   - Create/edit/delete articles!

---

## 💡 Tips

- **Always use `USE ucaep_db;` first**
- **Published articles** appear on frontend
- **Draft articles** are hidden
- **Use `NOW()`** for current timestamp

---

**Ready? Run `setup_database.sql` and you're done! 🎉**

