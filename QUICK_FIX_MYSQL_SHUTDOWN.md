# 🚨 QUICK FIX: MySQL Shutdown Unexpectedly

## ⚡ **IMMEDIATE STEPS (Do These First)**

### **Step 1: Check MySQL Error Log**

1. **Open XAMPP Control Panel**
2. **Click the "Logs" button** next to MySQL
3. **Copy the LAST 20-30 lines** of the error log
4. **Look for these common errors:**

   - `Port 3306 is already in use` → Port conflict
   - `InnoDB: Unable to lock` → Database locked
   - `Table doesn't exist` → Corrupted database
   - `Access denied` → Permission issue
   - `Can't create/write to file` → Permission issue

### **Step 2: Check Port 3306**

**Open Command Prompt or PowerShell and run:**
```powershell
netstat -ano | findstr :3306
```

**If you see output:**
- Port 3306 is in use by another process
- Note the PID (Process ID) - it's the last number
- **Solution:** Close that process or change MySQL port

**Most Common Culprits:**
- **Skype** - Close Skype completely
- **Another MySQL instance** - Stop other MySQL services
- **Previous MySQL process** - Kill the stuck process

### **Step 3: Try These Fixes in Order**

---

## ✅ **FIX 1: Port Conflict (Most Common - 80% of cases)**

### **Option A: Close Skype**
1. Close Skype completely
2. Restart XAMPP MySQL
3. Try starting MySQL again

### **Option B: Stop Conflicting Process**
1. Find the PID from Step 2 above
2. Open Command Prompt as Administrator
3. Run: `taskkill /F /PID [PID_NUMBER]`
   - Replace `[PID_NUMBER]` with the actual PID
4. Restart MySQL in XAMPP

### **Option C: Change MySQL Port**
1. Navigate to: `C:\xampp\mysql\bin\`
2. Open `my.ini` in a text editor (as Administrator)
3. Find: `port=3306`
4. Change to: `port=3307`
5. Save the file
6. Update `server/.env`:
   ```env
   DB_PORT=3307
   ```
7. Restart MySQL in XAMPP

---

## ✅ **FIX 2: Run as Administrator**

1. **Close XAMPP Control Panel**
2. **Right-click XAMPP Control Panel**
3. **Select "Run as administrator"**
4. **Try starting MySQL again**

---

## ✅ **FIX 3: Check MySQL Data Directory**

1. **Navigate to:** `C:\xampp\mysql\data\`
2. **Check if these files exist:**
   - `ibdata1`
   - `ib_logfile0`
   - `ib_logfile1`
   - `mysql.err` (error log)

3. **If files are missing or corrupted:**
   - Backup the `data` folder first!
   - Delete corrupted files
   - Restart MySQL

---

## ✅ **FIX 4: Fix Permissions**

1. **Right-click** `C:\xampp\mysql\` folder
2. **Properties** → **Security** tab
3. **Click "Edit"**
4. **Select your user account**
5. **Check "Full Control"**
6. **Click "Apply"** → **"Apply to all subfolders"**
7. **Click "OK"**
8. **Restart MySQL**

---

## ✅ **FIX 5: Check Windows Event Viewer**

1. Press `Windows Key + R`
2. Type: `eventvwr.msc`
3. Press Enter
4. Go to: **Windows Logs** → **Application**
5. Look for **MySQL errors** (red X icon)
6. **Double-click** the error to see details
7. **Copy the error message**

---

## ✅ **FIX 6: Reset MySQL (Last Resort)**

⚠️ **WARNING: This will delete all your databases!**

1. **Stop MySQL** in XAMPP
2. **Backup** `C:\xampp\mysql\data\` folder
3. **Delete** these files from `C:\xampp\mysql\data\`:
   - `ibdata1`
   - `ib_logfile0`
   - `ib_logfile1`
   - `*.err` (error logs)
4. **DO NOT DELETE:** Your database folders (like `ucaep_db`)
5. **Start MySQL** again
6. **Recreate tables** if needed using SQL scripts

---

## 🔍 **DIAGNOSTIC COMMANDS**

### **Check Port 3306:**
```powershell
netstat -ano | findstr :3306
```

### **Test MySQL Port:**
```powershell
Test-NetConnection -ComputerName localhost -Port 3306
```

### **Check MySQL Services:**
```powershell
Get-Service | Where-Object {$_.DisplayName -like "*MySQL*"}
```

### **View MySQL Error Log:**
```powershell
Get-Content "C:\xampp\mysql\data\*.err" -Tail 50
```

### **Kill Process on Port 3306:**
```powershell
# First, find the PID
netstat -ano | findstr :3306

# Then kill it (replace 1234 with actual PID)
taskkill /F /PID 1234
```

---

## 📋 **STEP-BY-STEP RECOVERY**

### **If MySQL Won't Start:**

1. ✅ **Check Error Log** (XAMPP → Logs button)
2. ✅ **Check Port 3306** (run `netstat` command)
3. ✅ **Close Skype** (if running)
4. ✅ **Run XAMPP as Administrator**
5. ✅ **Try Starting MySQL Again**
6. ✅ **If Still Fails:** Check Windows Event Viewer
7. ✅ **If Still Fails:** Try changing port to 3307
8. ✅ **If Still Fails:** Check permissions on MySQL folder

---

## 🎯 **MOST COMMON SOLUTIONS (Priority Order)**

1. ✅ **Close Skype** (80% of cases)
2. ✅ **Run as Administrator** (10% of cases)
3. ✅ **Port conflict** (5% of cases)
4. ✅ **Permission issues** (3% of cases)
5. ✅ **Corrupted data** (2% of cases)

---

## 📞 **WHAT TO DO NEXT**

1. **Click "Logs" button** in XAMPP Control Panel
2. **Copy the error message** from the log
3. **Run the diagnostic commands** above
4. **Try the fixes** in order (Fix 1 → Fix 2 → Fix 3...)
5. **If still not working:** Share the error log content with me

---

## ✅ **VERIFICATION**

After fixing, verify MySQL is running:

- [ ] XAMPP shows MySQL status as **"Running"** (green)
- [ ] Port **3306** (or 3307) is shown
- [ ] Can access phpMyAdmin: `http://localhost/phpmyadmin`
- [ ] Node.js server connects successfully

---

**Quick Command to Test:**
```bash
cd server
npm run dev
```

**Expected Output:**
```
✅ MySQL Database connection established successfully.
🚀 UCAEP Server running on port 5000
```

---

**Good Luck! Start with Fix 1 (Close Skype) - that solves 80% of cases!** 🎯

