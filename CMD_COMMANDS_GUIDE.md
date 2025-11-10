# 💻 Complete CMD Commands Guide - UCAEP Project

## 🎯 Quick Start Commands

### Step 1: Open Command Prompt
- Press `Windows + R`
- Type `cmd` and press Enter
- Or search "Command Prompt" in Windows

### Step 2: Navigate to Project
```cmd
cd "D:\New folder\Agriculturee website"
```

### Step 3: Check Current Status
```cmd
REM Check if backend is running
curl http://localhost:5000/api/health

REM Check if frontend is running
curl http://localhost:3000
```

### Step 4: Run Full Project
```cmd
npm run dev
```

---

## 📋 Complete Step-by-Step Commands

### **SETUP (First Time Only)**

#### 1. Install All Dependencies
```cmd
REM Navigate to project root
cd "D:\New folder\Agriculturee website"

REM Install root dependencies
npm install

REM Install server dependencies
cd server
npm install
cd ..

REM Install client dependencies
cd client
npm install
cd ..
```

#### 2. Setup Database Configuration
```cmd
REM Go to server folder
cd server

REM Create .env file if it doesn't exist
if not exist .env copy src\env.example .env

REM Open .env file to edit (optional)
notepad .env

REM Go back to root
cd ..
```

#### 3. Verify Environment
```cmd
REM Check Node.js version
node --version

REM Check npm version
npm --version

REM Check if XAMPP MySQL is running (check XAMPP Control Panel manually)
```

---

### **DATABASE SETUP (phpMyAdmin)**

**These are manual steps in browser, not CMD commands:**

1. Open browser: `http://localhost/phpmyadmin`
2. Click "New" → Create database: `ucaep_db`
3. Select `ucaep_db` → Click "Import" → Select `database/mysql-schema.sql` → Click "Go"

**Verify in CMD (after setup):**
```cmd
REM Test database connection (backend must be running)
curl http://localhost:5000/api/health
```

---

### **RUNNING THE PROJECT**

#### Option 1: Run Everything Together (Recommended)
```cmd
cd "D:\New folder\Agriculturee website"
npm run dev
```

**This starts:**
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

#### Option 2: Run Backend Only
```cmd
cd "D:\New folder\Agriculturee website\server"
npm run dev
```

**Backend runs on:** `http://localhost:5000/api`

#### Option 3: Run Frontend Only
```cmd
cd "D:\New folder\Agriculturee website\client"
npm start
```

**Frontend runs on:** `http://localhost:3000`

---

### **STOPPING THE SERVER**

**In the CMD window where server is running:**
```
Press: Ctrl + C
Type: Y (if prompted)
Press: Enter
```

**Or kill all Node processes:**
```cmd
taskkill /F /IM node.exe
```

---

## 🔧 Troubleshooting Commands

### Check Port Status
```cmd
REM Check if port 5000 is in use
netstat -ano | findstr :5000

REM Check if port 3000 is in use
netstat -ano | findstr :3000

REM Kill process using port 5000
netstat -ano | findstr :5000
REM Note the PID (last number), then:
taskkill /PID <PID_NUMBER> /F
```

### Fix Module Not Found Errors
```cmd
cd server
npm install sequelize mysql2
npm install
cd ..
```

### Clear Cache and Reinstall
```cmd
cd server
rmdir /s /q node_modules
del package-lock.json
npm install
cd ..
```

### Check Database Connection
```cmd
REM Make sure XAMPP MySQL is running, then:
cd server
node -e "require('./src/config/db').testConnection()"
```

---

## ✅ Verification Commands

### Test Backend API
```cmd
REM Health check
curl http://localhost:5000/api/health

REM Test login (after creating admin user)
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@ucaep.com\",\"password\":\"admin123\"}"
```

### Test Frontend
```cmd
REM Open in browser (manual)
start http://localhost:3000
```

### Check Project Structure
```cmd
REM List all files and folders
dir

REM Check if .env exists
cd server
dir .env
cd ..
```

---

## 📝 Daily Use Commands

### Start Project (Every Time)
```cmd
cd "D:\New folder\Agriculturee website"
npm run dev
```

### Stop Project
```
Ctrl + C (in the CMD window running server)
```

### Restart Project
```cmd
REM Stop current server (Ctrl+C)
REM Then run again:
npm run dev
```

### View Logs
**Just look at the CMD window where `npm run dev` is running.**

You'll see:
- `[0]` = Backend logs
- `[1]` = Frontend logs

---

## 🎯 Complete Command Cheat Sheet

| What to Do | Command |
|------------|---------|
| **Navigate to project** | `cd "D:\New folder\Agriculturee website"` |
| **Install dependencies** | `npm install` (in project root) |
| **Run full project** | `npm run dev` |
| **Run backend only** | `cd server && npm run dev` |
| **Run frontend only** | `cd client && npm start` |
| **Stop server** | `Ctrl + C` |
| **Check backend** | `curl http://localhost:5000/api/health` |
| **Check Node version** | `node --version` |
| **Kill all Node processes** | `taskkill /F /IM node.exe` |
| **Check port 5000** | `netstat -ano \| findstr :5000` |
| **Open .env file** | `cd server && notepad .env` |

---

## 🚀 Quick Start Script

**Create a file: `start-project.bat`** in project root:

```batch
@echo off
echo Starting UCAEP Project...
cd /d "%~dp0"
echo.
echo Checking prerequisites...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo.
echo Starting backend and frontend...
npm run dev
pause
```

**Then just double-click `start-project.bat` to start everything!**

---

## 📊 Current Project Status

Based on your terminal, the project is currently:

✅ **Backend:** Running on port 5000
- URL: `http://localhost:5000/api`
- Health: `http://localhost:5000/api/health`
- Database: MySQL (Connected)

⚠️ **Frontend:** Check if it's running
- Expected URL: `http://localhost:3000`

---

## 🎯 Next Steps

1. **If backend is not running:**
   ```cmd
   cd "D:\New folder\Agriculturee website"
   npm run dev
   ```

2. **If you see "Port already in use" error:**
   ```cmd
   taskkill /F /IM node.exe
   REM Wait 2 seconds, then:
   npm run dev
   ```

3. **If you see "Cannot find module" errors:**
   ```cmd
   cd server
   npm install
   cd ..
   npm run dev
   ```

---

## ✅ Success Checklist

When everything works, you should see:

- [x] Backend running: `✅ MySQL Database connection established successfully.`
- [x] Backend URL: `🚀 UCAEP Server running on port 5000`
- [x] Frontend compiled: `Compiled successfully!`
- [x] Frontend URL: `http://localhost:3000`
- [x] No errors in CMD window

---

## 📚 Files to Read

1. **RUN_PROJECT_STEPS_ENGLISH.md** - Detailed step-by-step guide
2. **PHPADMIN_SETUP_COMPLETE.md** - Database setup guide
3. **COMPLETE_CRUD_API_GUIDE.md** - API documentation
4. **FINAL_SETUP_COMPLETE.md** - Complete setup overview

---

**All commands are ready to use! Just copy and paste in CMD!** 💻

