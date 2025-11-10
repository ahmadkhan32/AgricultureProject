# 🚨 FIX: MySQL Connection Error

## ❌ **Current Error:**
```
❌ Unable to connect to MySQL database
❌ Database connection failed. Please check your MySQL configuration.
```

## ✅ **Root Cause:**
**MySQL service is NOT running!**

---

## 🔧 **Quick Fix (3 Steps)**

### **Step 1: Start MySQL in XAMPP**

1. **Open XAMPP Control Panel**
   - Press `Windows Key` + `R`
   - Type: `C:\xampp\xampp-control.exe`
   - Press Enter
   - OR search "XAMPP" in Start Menu

2. **Start MySQL Service**
   - Find "MySQL" in the XAMPP Control Panel
   - Click the **"Start"** button
   - Wait for status to turn **GREEN** ✅
   - You should see: **"Running"** in green color

3. **Verify MySQL is Running**
   - Status should show: **"Running"** (green)
   - Port should show: **3306**

**If MySQL won't start:**
- Check the "Logs" button next to MySQL
- Look for port conflicts (port 3306 might be in use)
- Try stopping other MySQL services

---

### **Step 2: Create Database (if needed)**

1. **Open phpMyAdmin**
   - In XAMPP Control Panel, click **"Admin"** button next to MySQL
   - OR open browser: `http://localhost/phpmyadmin`

2. **Check if Database Exists**
   - Look in left sidebar for `ucaep_db`
   - If it exists → Skip to Step 3 ✅
   - If it doesn't exist → Continue below

3. **Create Database**
   - Click **"New"** in left sidebar
   - Database name: `ucaep_db`
   - Collation: `utf8mb4_general_ci`
   - Click **"Create"** button

   **OR run SQL:**
   ```sql
   CREATE DATABASE ucaep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

---

### **Step 3: Restart Node.js Server**

After MySQL is running:

1. **Stop current server** (if running)
   - Press `Ctrl + C` in terminal

2. **Start server again:**
   ```bash
   cd server
   npm run dev
   ```

3. **Expected Output:**
   ```
   ✅ MySQL Database connection established successfully.
   🔄 Syncing database models...
   ✅ Database models synced successfully.
   🚀 UCAEP Server running on port 5000
   ```

---

## 🧪 **Test Connection**

Run this to verify MySQL is working:

```bash
cd server
node test-db-connection.js
```

**Expected Output:**
```
✅ MySQL server is accessible
✅ Database "ucaep_db" exists
✅ Successfully connected to database "ucaep_db"
```

---

## 🔍 **Troubleshooting**

### **Issue 1: MySQL Won't Start in XAMPP**

**Check if port 3306 is in use:**
```powershell
Test-NetConnection -ComputerName localhost -Port 3306
```

**If port is busy:**
1. Stop other MySQL services
2. Or change port in `.env`:
   ```env
   DB_PORT=3307
   ```

**Common solutions:**
- Stop Skype (uses port 3306 sometimes)
- Stop other MySQL services
- Restart XAMPP

---

### **Issue 2: "Access Denied" Error**

**If you set a MySQL password:**
1. Update `server/.env`:
   ```env
   DB_PASSWORD=your_mysql_password
   ```

**If no password (default XAMPP):**
- Leave `DB_PASSWORD=` empty in `.env`

---

### **Issue 3: Database Doesn't Exist**

**Create it manually:**
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click "New" → Database name: `ucaep_db`
3. Click "Create"

---

### **Issue 4: "Connection Refused"**

**Check MySQL service status:**
```powershell
Get-Service -Name "*mysql*"
```

**If service exists but not running:**
- Start it from XAMPP Control Panel

---

## ✅ **Verification Checklist**

Before starting server, verify:

- [ ] XAMPP Control Panel is open
- [ ] MySQL status is **"Running"** (green) ✅
- [ ] Port 3306 is shown next to MySQL
- [ ] Database `ucaep_db` exists in phpMyAdmin
- [ ] `.env` file exists in `server/` folder
- [ ] Server restarted after MySQL started

---

## 📋 **Quick Command Reference**

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

**Check MySQL Port (PowerShell):**
```powershell
Test-NetConnection -ComputerName localhost -Port 3306
```

**Check MySQL Service:**
```powershell
Get-Service -Name "*mysql*"
```

---

## 🎯 **Summary**

**The Problem:**
- ❌ MySQL service is not running

**The Solution:**
1. ✅ Start MySQL in XAMPP Control Panel
2. ✅ Create database `ucaep_db` (if needed)
3. ✅ Restart Node.js server

**That's it!** 🎉

Once MySQL is running, your server will start successfully!

---

## 📞 **Still Having Issues?**

1. **Check XAMPP Logs:**
   - Click "Logs" button next to MySQL in XAMPP
   - Look for error messages

2. **Run Test Script:**
   ```bash
   cd server
   node test-db-connection.js
   ```
   This shows exactly what's wrong!

3. **Verify .env File:**
   - Location: `server/.env`
   - Should contain: `DB_HOST=localhost`, `DB_PORT=3306`, `DB_USER=root`, `DB_PASSWORD=`, `DB_NAME=ucaep_db`

