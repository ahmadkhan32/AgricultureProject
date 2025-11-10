# 🚀 Complete Producers CRUD Setup Guide

## 📋 Table of Contents
1. [XAMPP MySQL Setup](#1-xampp-mysql-setup)
2. [Database Setup](#2-database-setup)
3. [Backend Setup](#3-backend-setup)
4. [Frontend Setup](#4-frontend-setup)
5. [Testing](#5-testing)

---

## 1. XAMPP MySQL Setup

### Step 1: Install and Start XAMPP

1. **Download XAMPP** (if not installed)
   - Visit: https://www.apachefriends.org/
   - Download for Windows
   - Install in default location: `C:\xampp`

2. **Start XAMPP Control Panel**
   - Open XAMPP Control Panel
   - Click **Start** button for **Apache** (for phpMyAdmin)
   - Click **Start** button for **MySQL**

3. **Verify MySQL is Running**
   - Check that MySQL shows **"Running"** in green
   - If you see errors, check the error log

### Step 2: Access phpMyAdmin

1. Open browser and go to: `http://localhost/phpmyadmin`
2. You should see the phpMyAdmin interface

---

## 2. Database Setup

### Method 1: Using phpMyAdmin (GUI - Recommended)

#### Step 1: Create Database
1. In phpMyAdmin, click **"New"** in left sidebar
2. Database name: `ucaep_db`
3. Collation: `utf8mb4_unicode_ci`
4. Click **"Create"**

#### Step 2: Import SQL Script
1. Select `ucaep_db` database from left sidebar
2. Click **"Import"** tab at top
3. Click **"Choose File"**
4. Navigate to: `database/producers-table-xampp.sql`
5. Click **"Go"** button at bottom
6. You should see: **"Import has been successfully finished"**

#### Step 3: Verify Tables Created
1. In left sidebar, expand `ucaep_db`
2. You should see:
   - ✅ `users` table
   - ✅ `producers` table
3. Click on `producers` table
4. Click **"Browse"** tab - you should see 3 sample records

### Method 2: Using MySQL Command Line

1. **Open Command Prompt (CMD)**
   - Press `Win + R`
   - Type `cmd` and press Enter

2. **Navigate to MySQL**
   ```cmd
   cd C:\xampp\mysql\bin
   ```

3. **Login to MySQL**
   ```cmd
   mysql -u root
   ```
   (No password by default in XAMPP)

4. **Run SQL Commands**
   ```sql
   CREATE DATABASE IF NOT EXISTS ucaep_db;
   USE ucaep_db;
   ```

5. **Import SQL File**
   - Copy contents of `database/producers-table-xampp.sql`
   - Paste in MySQL command line
   - Press Enter

6. **Verify**
   ```sql
   SHOW TABLES;
   SELECT * FROM producers LIMIT 5;
   ```

---

## 3. Backend Setup

### Step 1: Configure Database Connection

1. **Navigate to Backend Folder**
   ```cmd
   cd "D:\New folder\Agriculturee website\server"
   ```

2. **Create/Edit `.env` file**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=ucaep_db
   JWT_SECRET=your-secret-key-here-change-in-production
   PORT=5000
   NODE_ENV=development
   ```

3. **Save the file**

### Step 2: Install Dependencies

```cmd
cd server
npm install
```

### Step 3: Start Backend Server

```cmd
npm run dev
```

**Expected Output:**
```
✅ MySQL Database connection established successfully.
🚀 UCAEP Server running on port 5000
📊 Environment: development
🗄️  Database: MySQL
🌐 API URL: http://localhost:5000/api
```

**Keep this terminal window open!**

---

## 4. Frontend Setup

### Step 1: Verify Frontend is Running

1. **Open new terminal/CMD**
2. **Navigate to project root**
   ```cmd
   cd "D:\New folder\Agriculturee website"
   ```

3. **Check if frontend is running**
   - If not running:
     ```cmd
     npm run dev
     ```
   - Frontend should be at: `http://localhost:3000`

### Step 2: Verify API Connection

1. Open browser: `http://localhost:3000`
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. You should **NOT** see connection errors

---

## 5. Testing

### Test 1: View Producers (Frontend)

1. Go to: `http://localhost:3000/producers`
2. You should see:
   - 3 sample producers displayed
   - Search functionality working
   - Filter by region/type working

### Test 2: Admin Dashboard - Add Producer

1. **Login as Admin**
   - URL: `http://localhost:3000/login`
   - Email: `admin@ucaep.com`
   - Password: `admin123`

2. **Navigate to Producers Management**
   - Click **"Producers"** in sidebar
   - Or go to: `http://localhost:3000/admin/producers`

3. **Add New Producer**
   - Click **"Add New Producer"** button (top right)
   - Fill in the form:
     - Business Name: `Test Farm`
     - Business Type: `Agriculture`
     - Description: `A test farm for demonstration`
     - Location: `Moroni`
     - Region: `Grande Comore`
     - Add products: Click "Add" after typing product name
     - Contact Email: `test@example.com`
     - Contact Phone: `+269 333 9999`
   - Click **"Create Producer"**

4. **Verify Producer Created**
   - Producer should appear in the table
   - Status should be "Approved" (or "Pending" if created by non-admin)

### Test 3: Edit Producer

1. In Producers Management table, click **Edit** icon (pencil)
2. Modify any field
3. Click **"Update Producer"**
4. Verify changes saved

### Test 4: Delete Producer

1. Click **Delete** icon (trash) on any producer
2. Confirm deletion
3. Producer should be removed from table

### Test 5: View on Frontend

1. Go to: `http://localhost:3000/producers`
2. Your newly created producer should appear in the list
3. Only **approved** producers are visible on frontend

---

## 📝 API Endpoints Reference

### Public Endpoints (No Auth Required)
```
GET  /api/producers              - Get all approved producers
GET  /api/producers/:id          - Get single producer by ID
```

### Authenticated Endpoints (Login Required)
```
POST   /api/producers            - Create new producer
PUT    /api/producers/:id        - Update producer
DELETE /api/producers/:id       - Delete producer
GET    /api/producers/profile/me - Get current user's producer profile
```

### Admin Endpoints (Admin Role Required)
```
GET    /api/producers/admin/all  - Get all producers (including pending/rejected)
PATCH  /api/producers/:id/status - Update producer status
```

---

## 🛠️ Troubleshooting

### Problem: "Cannot connect to MySQL"

**Solution:**
1. Check XAMPP Control Panel - MySQL should be "Running"
2. Check MySQL port in `.env` file (should be `3306`)
3. Try restarting MySQL in XAMPP

### Problem: "Access denied for user 'root'"

**Solution:**
1. Check `.env` file - `DB_PASSWORD` should be empty (for default XAMPP)
2. Or set password if you configured one

### Problem: "Table 'producers' doesn't exist"

**Solution:**
1. Go to phpMyAdmin
2. Select `ucaep_db` database
3. Import `database/producers-table-xampp.sql` again

### Problem: "Cannot connect to server" (Frontend)

**Solution:**
1. Check backend is running: `http://localhost:5000/api`
2. Check backend terminal for errors
3. Verify `.env` file has correct database credentials

### Problem: "Failed to fetch" in Browser

**Solution:**
1. Make sure backend server is running on port 5000
2. Check `http://localhost:5000/api/producers` in browser
3. Should return JSON data
4. If CORS error, check `server/src/app.js` has CORS middleware enabled

---

## ✅ Verification Checklist

- [ ] XAMPP MySQL is running
- [ ] Database `ucaep_db` created
- [ ] Tables `users` and `producers` exist
- [ ] Sample data inserted (3 producers)
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login to admin dashboard
- [ ] Can create new producer from admin
- [ ] Can edit producer
- [ ] Can delete producer
- [ ] Can view producers on frontend page

---

## 🎉 Success!

If all checks pass, your Producers CRUD is fully functional! 

**Next Steps:**
- Add more producers through admin dashboard
- Customize producer fields if needed
- Add image upload functionality (currently uses URLs)

---

## 📞 Quick Reference Commands

```cmd
# Start XAMPP MySQL
# Use XAMPP Control Panel GUI

# Start Backend
cd "D:\New folder\Agriculturee website\server"
npm run dev

# Start Frontend (in another terminal)
cd "D:\New folder\Agriculturee website"
npm run dev

# Access phpMyAdmin
http://localhost/phpmyadmin

# Access Frontend
http://localhost:3000

# Access Admin Dashboard
http://localhost:3000/admin
```

---

**Need Help?** Check error messages in:
- Backend terminal
- Browser console (F12)
- XAMPP error logs

