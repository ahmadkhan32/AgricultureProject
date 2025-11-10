# 🚀 How to Run UCAEP Project - Step by Step Guide (English)

## 📋 Prerequisites

Before running the project, make sure you have:

1. ✅ **Node.js** installed (v14 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. ✅ **XAMPP** installed and MySQL running
   - Download: https://www.apachefriends.org/
   - Start MySQL from XAMPP Control Panel

3. ✅ **Database** created in phpMyAdmin
   - Database name: `ucaep_db`
   - Import: `database/mysql-schema.sql`

---

## 🎯 Step 1: Open Command Prompt (CMD)

1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Or search "Command Prompt" in Windows

---

## 🎯 Step 2: Navigate to Project Folder

```cmd
cd "D:\New folder\Agriculturee website"
```

**Or if your project is in a different location:**
```cmd
cd "C:\path\to\your\project"
```

**Verify you're in the right folder:**
```cmd
dir
```

You should see folders: `client`, `server`, `database`, etc.

---

## 🎯 Step 3: Install Dependencies (First Time Only)

**Install root dependencies:**
```cmd
npm install
```

**Install server dependencies:**
```cmd
cd server
npm install
cd ..
```

**Install client dependencies:**
```cmd
cd client
npm install
cd ..
```

**Note:** You only need to do this once, or when `package.json` changes.

---

## 🎯 Step 4: Setup Database (One Time Setup)

### 4.1 Start XAMPP MySQL

1. Open **XAMPP Control Panel**
2. Click **Start** for **MySQL**
3. Wait until it shows "Running" (green)

### 4.2 Create Database

1. Open browser: `http://localhost/phpmyadmin`
2. Click **"New"** in left sidebar
3. Database name: `ucaep_db`
4. Collation: `utf8mb4_unicode_ci`
5. Click **"Create"**

### 4.3 Import Schema

1. Select `ucaep_db` database
2. Click **"Import"** tab
3. Choose file: `database/mysql-schema.sql`
4. Click **"Go"**

**Verify:** You should see 7 tables created.

---

## 🎯 Step 5: Configure Environment Variables

**Check if .env file exists in server folder:**
```cmd
cd server
dir .env
```

**If .env doesn't exist, create it:**
```cmd
copy src\env.example .env
```

**Edit .env file with Notepad:**
```cmd
notepad .env
```

**Make sure these values are correct:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ucaep_db
PORT=5000
```

**Save and close** (Ctrl+S, then Alt+F4)

---

## 🎯 Step 6: Run the Project

### Option A: Run Both Frontend + Backend Together (Recommended)

**In the project root folder:**
```cmd
npm run dev
```

This will:
- ✅ Start backend server on `http://localhost:5000`
- ✅ Start frontend on `http://localhost:3000`

**You'll see two outputs:**
- `[0]` = Backend server logs
- `[1]` = Frontend React app logs

---

### Option B: Run Backend Only

**In server folder:**
```cmd
cd server
npm run dev
```

Backend will run on: `http://localhost:5000/api`

---

### Option C: Run Frontend Only

**In client folder:**
```cmd
cd client
npm start
```

Frontend will run on: `http://localhost:3000`

---

## 🎯 Step 7: Verify Everything is Working

### Check Backend:

Open new CMD window and run:
```cmd
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "UCAEP Server is running",
  "database": "MySQL"
}
```

**Or open in browser:**
```
http://localhost:5000/api/health
```

### Check Frontend:

Open browser:
```
http://localhost:3000
```

You should see the UCAEP website homepage.

---

## 🎯 Step 8: Stop the Server

**In the CMD window where server is running:**
- Press `Ctrl + C`
- Type `Y` and press Enter (if prompted)

**Or close the CMD window.**

---

## 📝 Complete Commands Summary

### Quick Start (All in One):
```cmd
REM 1. Navigate to project
cd "D:\New folder\Agriculturee website"

REM 2. Make sure MySQL is running in XAMPP

REM 3. Run project
npm run dev
```

### Full Setup (First Time):
```cmd
REM 1. Navigate to project
cd "D:\New folder\Agriculturee website"

REM 2. Install dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

REM 3. Setup database (in phpMyAdmin)
REM - Create database: ucaep_db
REM - Import: database/mysql-schema.sql

REM 4. Create .env file
cd server
copy src\env.example .env
notepad .env
cd ..

REM 5. Start XAMPP MySQL

REM 6. Run project
npm run dev
```

---

## 🔧 Troubleshooting

### Problem: "Cannot find module 'sequelize'"

**Solution:**
```cmd
cd server
npm install sequelize mysql2
cd ..
```

### Problem: "Port 5000 already in use"

**Solution 1: Kill process using port 5000**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Solution 2: Change port in .env**
```cmd
cd server
notepad .env
REM Change PORT=5000 to PORT=5001
```

### Problem: "Database connection failed"

**Solution:**
1. Check XAMPP MySQL is running
2. Verify database `ucaep_db` exists
3. Check `.env` file has correct credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=ucaep_db
   ```

### Problem: "Cannot find module" errors

**Solution:**
```cmd
REM Delete node_modules and reinstall
cd server
rmdir /s /q node_modules
del package-lock.json
npm install
cd ..
```

---

## ✅ Success Indicators

When everything is working, you should see:

**Backend:**
```
✅ MySQL Database connection established successfully.
🚀 UCAEP Server running on port 5000
📊 Environment: development
🗄️  Database: MySQL
🌐 API URL: http://localhost:5000/api
```

**Frontend:**
```
Compiled successfully!
You can now view ucaeep-client in the browser.
  Local:            http://localhost:3000
```

---

## 📚 Additional Commands

### Check if ports are in use:
```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

### Check Node.js version:
```cmd
node --version
npm --version
```

### Clear npm cache (if needed):
```cmd
npm cache clean --force
```

### Install specific package:
```cmd
cd server
npm install package-name
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Navigate to project | `cd "D:\New folder\Agriculturee website"` |
| Install dependencies | `npm install` |
| Run full project | `npm run dev` |
| Run backend only | `cd server && npm run dev` |
| Run frontend only | `cd client && npm start` |
| Check backend | `curl http://localhost:5000/api/health` |
| Stop server | `Ctrl + C` |

---

## 🎉 You're All Set!

Once you see:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ No errors in console

**Your project is ready to use!**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Health:** http://localhost:5000/api/health

---

**Need help?** Check the error messages in CMD and refer to Troubleshooting section above.

