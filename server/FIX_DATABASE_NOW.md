# 🚨 URGENT: Fix MySQL Connection Error

## Error You're Seeing:
```
⚠️  WARNING: Using default JWT_SECRET. Change this in production!
❌ Unable to connect to MySQL database:
❌ Database connection failed. Please check your MySQL configuration.
```

## ✅ **Quick Fix (3 Steps)**

### **Step 1: Create .env File**

**Location:** `server/.env`

Create this file with this content:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ucaep_db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_12345678901234567890

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**How to create:**
1. Navigate to `server/` folder
2. Create new file named `.env` (no extension)
3. Copy the content above
4. Save the file

---

### **Step 2: Start MySQL (XAMPP)**

1. **Open XAMPP Control Panel**
   - Search "XAMPP" in Start Menu
   - Or: `C:\xampp\xampp-control.exe`

2. **Start MySQL Service**
   - Click **"Start"** button next to MySQL
   - Wait for status to turn **GREEN** ✅
   - Port should show: **3306**

3. **Verify MySQL is Running**
   - Status = "Running" (green)
   - If red, check logs by clicking "Logs" button

---

### **Step 3: Create Database**

1. **Open phpMyAdmin**
   - Click **"Admin"** button next to MySQL in XAMPP
   - Or open: `http://localhost/phpmyadmin`

2. **Create Database**
   - Click **"New"** in left sidebar
   - Database name: `ucaep_db`
   - Collation: `utf8mb4_general_ci`
   - Click **"Create"**

   **OR run SQL:**
   ```sql
   CREATE DATABASE ucaep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

---

### **Step 4: Restart Server**

After MySQL is running and database exists:

```bash
# Stop server (Ctrl+C if running)
# Then start again:
cd server
npm run dev
```

**Expected Output:**
```
✅ MySQL Database connection established successfully.
🔄 Syncing database models...
✅ Database models synced successfully.
🚀 UCAEP Server running on port 5000
```

---

## 🔍 **Troubleshooting**

### **Issue 1: MySQL Won't Start**

**Check if port 3306 is in use:**
```powershell
Test-NetConnection -ComputerName localhost -Port 3306
```

**If port is busy:**
- Stop other MySQL services
- Or change port in `.env`: `DB_PORT=3307`

---

### **Issue 2: "Access Denied" Error**

**Check password:**
- If you set a password for MySQL root user, add it to `.env`:
  ```env
  DB_PASSWORD=your_mysql_password
  ```

**If no password (default XAMPP):**
- Leave `DB_PASSWORD=` empty in `.env`

---

### **Issue 3: Database Doesn't Exist**

**Create it manually:**
1. Open phpMyAdmin
2. Click "New" → Database name: `ucaep_db`
3. Click "Create"

---

### **Issue 4: Test Connection**

**Run test script:**
```bash
cd server
node test-db-connection.js
```

This will show you exactly what's wrong!

---

## ✅ **Verification Checklist**

- [ ] `.env` file exists in `server/` folder
- [ ] MySQL is running in XAMPP (green status)
- [ ] Database `ucaep_db` exists in phpMyAdmin
- [ ] Server restarted after MySQL started
- [ ] Connection successful (see ✅ message)

---

## 🎯 **Quick Command Reference**

**Test MySQL Connection:**
```bash
cd server
node test-db-connection.js
```

**Start Server:**
```bash
cd server
npm run dev
```

**Check MySQL Status (PowerShell):**
```powershell
Get-Service -Name "*mysql*"
```

**Test Port 3306:**
```powershell
Test-NetConnection -ComputerName localhost -Port 3306
```

---

## 📝 **Summary**

**The error happens because:**
1. ❌ MySQL service is not running
2. ❌ Database `ucaep_db` doesn't exist
3. ❌ `.env` file is missing or misconfigured

**Fix it:**
1. ✅ Create `server/.env` file
2. ✅ Start MySQL in XAMPP
3. ✅ Create `ucaep_db` database
4. ✅ Restart server

**That's it!** 🎉

