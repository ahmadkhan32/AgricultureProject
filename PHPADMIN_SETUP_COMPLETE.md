# 📊 phpMyAdmin Database Setup - Complete Guide

## 🎯 Step-by-Step Setup

### Step 1: Start XAMPP

1. Open **XAMPP Control Panel**
2. Click **Start** for **Apache**
3. Click **Start** for **MySQL**
4. Wait until both show green "Running" status

---

### Step 2: Open phpMyAdmin

1. Open browser
2. Go to: `http://localhost/phpmyadmin`
3. You should see phpMyAdmin interface

---

### Step 3: Create Database

1. Click on **"New"** in the left sidebar
2. **Database name:** `ucaep_db`
3. **Collation:** `utf8mb4_unicode_ci`
4. Click **"Create"**

---

### Step 4: Import Schema

**Method 1: Using Import Tab**

1. Select `ucaep_db` database (click on it in left sidebar)
2. Click **"Import"** tab at the top
3. Click **"Choose File"** button
4. Navigate to: `database/mysql-schema.sql`
5. Click **"Go"** button at bottom
6. Wait for success message: ✅ "Import has been successfully finished"

**Method 2: Using SQL Tab**

1. Select `ucaep_db` database
2. Click **"SQL"** tab at the top
3. Copy **ALL** content from `database/mysql-schema.sql`
4. Paste into the SQL text area
5. Click **"Go"** button
6. Wait for success message

---

### Step 5: Verify Tables Created

After import, you should see **7 tables** in left sidebar:

✅ `users` - User accounts  
✅ `producers` - Producer profiles  
✅ `news` - News articles  
✅ `projects` - Projects  
✅ `partnerships` - Partnerships  
✅ `resources` - Documents/Resources  
✅ `messages` - Contact messages  

---

### Step 6: Verify Default Admin User

1. Click on `users` table
2. Click **"Browse"** tab
3. You should see one row:
   - **Email:** `admin@ucaep.com`
   - **Role:** `admin`
   - **Password:** (hashed - not visible)

**Default Login:**
- Email: `admin@ucaep.com`
- Password: `admin123`

⚠️ **Change this password after first login!**

---

## 📋 Table Structure

### 1. **users**
- `id` (INT, Primary Key, Auto Increment)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `phone` (VARCHAR)
- `role` (ENUM: 'admin', 'producer')
- `avatar_url` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. **producers**
- `id` (INT, Primary Key)
- `user_id` (INT, Foreign Key → users.id)
- `business_name` (VARCHAR)
- `business_type` (ENUM)
- `location` (VARCHAR)
- `region` (VARCHAR)
- `status` (ENUM: 'pending', 'approved', 'rejected')
- ... and more

### 3. **news**
- `id` (INT, Primary Key)
- `author_id` (INT, Foreign Key → users.id)
- `title` (VARCHAR)
- `content` (TEXT)
- `category` (ENUM)
- `status` (ENUM: 'draft', 'published', 'archived')
- ... and more

### 4. **projects**
- `id` (INT, Primary Key)
- `created_by` (INT, Foreign Key → users.id)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (ENUM)
- ... and more

### 5. **partnerships**
- `id` (INT, Primary Key)
- `name` (VARCHAR)
- `partner_type` (ENUM)
- `status` (ENUM)
- ... and more

### 6. **resources**
- `id` (INT, Primary Key)
- `created_by` (INT, Foreign Key → users.id)
- `title` (VARCHAR)
- `file_url` (VARCHAR)
- `category` (ENUM)
- `download_count` (INT)
- ... and more

### 7. **messages**
- `id` (INT, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR)
- `subject` (VARCHAR)
- `message` (TEXT)
- `status` (ENUM: 'new', 'read', 'replied', 'archived')
- ... and more

---

## ✅ Verification Checklist

- [ ] XAMPP MySQL is running (green in control panel)
- [ ] phpMyAdmin opens at `http://localhost/phpmyadmin`
- [ ] Database `ucaep_db` exists
- [ ] All 7 tables are created
- [ ] Default admin user exists in `users` table
- [ ] Can browse all tables without errors

---

## 🔧 Troubleshooting

### Problem: "Database connection failed"

**Solution:**
1. Check XAMPP MySQL is running (green)
2. Verify MySQL port is 3306 (default)
3. Check `.env` file in `server/` directory:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=          (usually empty for XAMPP)
   DB_NAME=ucaep_db
   ```

### Problem: "Import failed"

**Solution:**
1. Make sure you selected `ucaep_db` database before import
2. Check SQL file syntax is correct
3. Try importing via SQL tab instead
4. Check phpMyAdmin error messages

### Problem: "Tables not showing"

**Solution:**
1. Refresh phpMyAdmin (F5)
2. Click on `ucaep_db` database in left sidebar
3. Check "Structure" tab

### Problem: "Can't connect to MySQL"

**Solution:**
1. Stop and restart MySQL in XAMPP
2. Check if port 3306 is available
3. Check Windows Firewall settings

---

## 📝 Manual Table Creation (If Import Fails)

If import doesn't work, you can manually create tables by running SQL commands in phpMyAdmin SQL tab.

The complete SQL is in: `database/mysql-schema.sql`

---

## ✅ Database Setup Complete!

Once all tables are created:

1. ✅ Start backend server: `npm run dev` (in server directory)
2. ✅ Backend will connect to MySQL automatically
3. ✅ All CRUD operations will work
4. ✅ Dashboard can insert, update, delete data

---

**Your database is ready for CRUD operations!** 🎉

