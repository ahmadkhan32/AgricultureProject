# 🚨 FIX: MySQL Shutdown Unexpectedly in XAMPP

## ❌ **Error Message:**
```
Error: MySQL shutdown unexpectedly.
This may be due to a blocked port, missing dependencies, 
improper privileges, a crash, or a shutdown by another method.
```

---

## ✅ **Quick Fix Solutions (Try in Order)**

### **Solution 1: Check Port 3306 Conflict (Most Common)**

**Step 1: Check if Port 3306 is in Use**
```powershell
# Open PowerShell and run:
netstat -ano | findstr :3306
```

**If you see output, port 3306 is in use. Continue below.**

**Step 2: Stop Conflicting Services**

**Option A: Stop Skype (Common Culprit)**
- Close Skype completely
- Or go to: Skype → Tools → Options → Advanced → Connection
- Uncheck "Use port 80 and 443 for additional incoming connections"
- Restart XAMPP MySQL

**Option B: Stop Other MySQL Services**
```powershell
# Check for MySQL services
Get-Service | Where-Object {$_.DisplayName -like "*MySQL*"}

# Stop MySQL service if found (replace "MySQL" with actual service name)
Stop-Service -Name "MySQL" -Force
```

**Option C: Stop Process Using Port 3306**
```powershell
# Find process ID (PID) from netstat output above
# Then kill the process (replace 1234 with actual PID):
taskkill /F /PID 1234
```

**Step 3: Restart XAMPP MySQL**
- Open XAMPP Control Panel
- Click "Stop" for MySQL (if running)
- Wait 5 seconds
- Click "Start" for MySQL
- Check if it starts successfully

---

### **Solution 2: Fix MySQL Data Directory Issues**

**Step 1: Backup Your Data (Important!)**
- Navigate to: `C:\xampp\mysql\data\`
- Copy the entire `data` folder to a safe location

**Step 2: Check MySQL Error Log**
1. Open XAMPP Control Panel
2. Click "Logs" button next to MySQL
3. Look for error messages like:
   - "InnoDB: Unable to lock"
   - "Table doesn't exist"
   - "Corrupted database"

**Step 3: Check for Corrupted InnoDB Files**
- Navigate to: `C:\xampp\mysql\data\`
- Look for files ending in `.ibd` or `.ibdata`
- If you see errors about InnoDB in logs, try:

```powershell
# Stop MySQL in XAMPP
# Delete these files (backup first!):
# - ibdata1
# - ib_logfile0
# - ib_logfile1
# Then restart MySQL
```

**⚠️ WARNING:** This will delete your databases. Only do this if you have backups!

---

### **Solution 3: Repair MySQL Installation**

**Step 1: Stop MySQL**
- In XAMPP Control Panel, click "Stop" for MySQL

**Step 2: Run MySQL as Administrator**
1. Right-click XAMPP Control Panel
2. Select "Run as administrator"
3. Try starting MySQL again

**Step 3: Check Windows Event Viewer**
1. Press `Windows Key + R`
2. Type: `eventvwr.msc`
3. Go to: Windows Logs → Application
4. Look for MySQL errors
5. Note the error details

---

### **Solution 4: Reinstall MySQL in XAMPP**

**⚠️ WARNING: This will delete all your databases!**

**Step 1: Backup Your Data**
```powershell
# Copy entire data folder
xcopy "C:\xampp\mysql\data" "C:\xampp_backup\mysql\data\" /E /I /H /Y
```

**Step 2: Uninstall MySQL from XAMPP**
1. Open XAMPP Control Panel
2. Click "Stop" for MySQL
3. Click "Uninstall" for MySQL (if available)
4. Or manually delete: `C:\xampp\mysql\`

**Step 3: Reinstall MySQL**
1. Download XAMPP again
2. Run installer
3. Select only MySQL component
4. Install to same location

**Step 4: Restore Your Data**
- Copy your backed-up `data` folder back to `C:\xampp\mysql\`
- Restart MySQL

---

### **Solution 5: Change MySQL Port (Alternative)**

**If port 3306 is permanently blocked:**

**Step 1: Edit MySQL Configuration**
1. Navigate to: `C:\xampp\mysql\bin\`
2. Open `my.ini` (or `my.cnf`) in a text editor
3. Find the line: `port=3306`
4. Change to: `port=3307`
5. Save the file

**Step 2: Update .env File**
Edit `server/.env`:
```env
DB_HOST=localhost
DB_PORT=3307  # Changed from 3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ucaep_db
```

**Step 3: Restart MySQL**
- Start MySQL in XAMPP Control Panel
- It should now use port 3307

---

## 🔍 **Diagnostic Steps**

### **Step 1: Check MySQL Service Status**
```powershell
Get-Service | Where-Object {$_.DisplayName -like "*MySQL*" -or $_.Name -like "*mysql*"}
```

### **Step 2: Test Port 3306**
```powershell
Test-NetConnection -ComputerName localhost -Port 3306
```

**If it says "TcpTestSucceeded: True"** → Port is in use
**If it says "TcpTestSucceeded: False"** → Port is free (good)

### **Step 3: Check MySQL Logs**
1. Open XAMPP Control Panel
2. Click "Logs" button next to MySQL
3. Look for:
   - Error messages
   - Port conflicts
   - Permission errors
   - Corrupted files

### **Step 4: Check Windows Firewall**
```powershell
# Check if firewall is blocking MySQL
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*MySQL*"}
```

---

## 🛠️ **Advanced Troubleshooting**

### **Issue: MySQL Starts Then Immediately Stops**

**Possible Causes:**
1. Corrupted `my.ini` configuration file
2. Missing or corrupted data files
3. Incompatible Windows version

**Solution:**
1. Check `C:\xampp\mysql\bin\my.ini` for syntax errors
2. Verify all required files exist in `C:\xampp\mysql\data\`
3. Try running MySQL in console mode:
   ```powershell
   cd C:\xampp\mysql\bin
   .\mysqld.exe --console
   ```
   This will show detailed error messages

### **Issue: "Access Denied" or Permission Errors**

**Solution:**
1. Right-click XAMPP folder
2. Properties → Security
3. Ensure your user has "Full Control"
4. Apply to all subfolders

### **Issue: Antivirus Blocking MySQL**

**Solution:**
1. Add XAMPP folder to antivirus exclusions:
   - `C:\xampp\mysql\`
   - `C:\xampp\apache\`
2. Temporarily disable antivirus to test

---

## ✅ **Step-by-Step Recovery Process**

### **If MySQL Won't Start at All:**

1. **Stop MySQL** (if running)
   - XAMPP Control Panel → Stop MySQL

2. **Check Logs**
   - Click "Logs" button next to MySQL
   - Copy error message

3. **Check Port**
   ```powershell
   netstat -ano | findstr :3306
   ```

4. **Kill Conflicting Process** (if found)
   ```powershell
   taskkill /F /PID [PID_NUMBER]
   ```

5. **Try Starting Again**
   - XAMPP Control Panel → Start MySQL

6. **If Still Fails:**
   - Check Windows Event Viewer
   - Try running MySQL as Administrator
   - Check antivirus/firewall settings

7. **Last Resort:**
   - Backup data folder
   - Reinstall MySQL component
   - Restore data

---

## 📋 **Quick Command Reference**

```powershell
# Check if port 3306 is in use
netstat -ano | findstr :3306

# Test port connection
Test-NetConnection -ComputerName localhost -Port 3306

# Check MySQL services
Get-Service | Where-Object {$_.DisplayName -like "*MySQL*"}

# Kill process on port 3306 (replace PID)
taskkill /F /PID [PID_NUMBER]

# Check MySQL logs
# Open: C:\xampp\mysql\data\*.err
```

---

## 🎯 **Most Common Fixes (Priority Order)**

1. ✅ **Port 3306 conflict** → Stop Skype/other MySQL services
2. ✅ **Run as Administrator** → Right-click XAMPP → Run as admin
3. ✅ **Corrupted data** → Check MySQL error logs
4. ✅ **Firewall blocking** → Add XAMPP to firewall exceptions
5. ✅ **Wrong permissions** → Fix folder permissions

---

## 📞 **Still Not Working?**

If none of the above solutions work:

1. **Check XAMPP Forums:**
   - https://community.apachefriends.org/

2. **Check Error Logs:**
   - `C:\xampp\mysql\data\*.err`

3. **Windows Event Viewer:**
   - Look for MySQL errors in Application log

4. **Try MySQL Alternative:**
   - Use MySQL installer instead of XAMPP
   - Or use MariaDB (XAMPP alternative)

---

## ✅ **Verification Checklist**

After fixing, verify:

- [ ] MySQL starts in XAMPP Control Panel (green status)
- [ ] Port 3306 (or alternate port) is shown
- [ ] Can access phpMyAdmin: `http://localhost/phpmyadmin`
- [ ] Database `ucaep_db` exists
- [ ] Node.js server can connect to MySQL
- [ ] No errors in server console

---

**Last Updated:** 2024

