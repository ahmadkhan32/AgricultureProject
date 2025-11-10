# 🚨 Quick Fix: MySQL Connection Error

## Problem
```
❌ Unable to connect to MySQL database
❌ Database connection failed
```

## ✅ Solution: Start MySQL

### Step 1: Start XAMPP MySQL

1. **Open XAMPP Control Panel**
   - Search for "XAMPP Control Panel" in Start Menu
   - Or navigate to: `C:\xampp\xampp-control.exe`

2. **Start MySQL Service**
   - Find "MySQL" in the list
   - Click **"Start"** button
   - Wait for status to turn **GREEN** ✅

3. **Verify MySQL is Running**
   - Status should show "Running" in green
   - Port 3306 should be listed

### Step 2: Verify Database Exists

1. **Open phpMyAdmin**
   - Click "Admin" button next to MySQL in XAMPP
   - Or open: `http://localhost/phpmyadmin`

2. **Check Database**
   - Look for `ucaep_db` in left sidebar
   - If it doesn't exist, create it:
     ```sql
     CREATE DATABASE ucaep_db;
     ```

### Step 3: Restart Node.js Server

After MySQL is running:
```bash
cd server
npm run dev
```

You should see:
```
✅ MySQL Database connection established successfully.
🚀 UCAEP Server running on port 5000
```

## Alternative: Test Connection Manually

Run this command to test:
```bash
cd server
node test-db-connection.js
```

This will show you exactly what's wrong.

## Common Issues

### Issue: MySQL won't start in XAMPP
- **Port 3306 might be in use**
- **Solution:** Stop other MySQL services or change port

### Issue: Database doesn't exist
- **Solution:** Create `ucaep_db` in phpMyAdmin

### Issue: Wrong password
- **Solution:** Check `.env` file in `server/` directory
- Default: empty password for root user

## Still Not Working?

1. Check if MySQL service is running:
   ```powershell
   Get-Service -Name "*mysql*"
   ```

2. Test port 3306:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 3306
   ```

3. Check XAMPP logs:
   - Open XAMPP Control Panel
   - Click "Logs" button next to MySQL

---

**Quick Command:**
1. Open XAMPP Control Panel
2. Click "Start" for MySQL
3. Wait for green status
4. Restart Node.js server: `npm run dev`

