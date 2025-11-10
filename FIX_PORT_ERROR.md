# 🔧 Fix Port 5000 Already in Use Error

## Problem
```
Error: listen EADDRINUSE: address already in use :::5000
```

This means another process is already using port 5000.

---

## ✅ Quick Fix (CMD Commands)

### Method 1: Kill All Node Processes
```cmd
taskkill /F /IM node.exe
```

Wait 2 seconds, then run:
```cmd
npm run dev
```

---

### Method 2: Find and Kill Specific Process on Port 5000

**Step 1: Find process using port 5000**
```cmd
netstat -ano | findstr :5000
```

You'll see output like:
```
TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       12345
```

**Step 2: Kill the process (use the PID from above)**
```cmd
taskkill /PID 12345 /F
```

**Step 3: Start server again**
```cmd
npm run dev
```

---

### Method 3: Change Port to 5001

**Step 1: Edit .env file**
```cmd
cd server
notepad .env
```

**Step 2: Change PORT**
```env
PORT=5001
```

**Step 3: Save and close (Ctrl+S, Alt+F4)**

**Step 4: Start server**
```cmd
cd ..
npm run dev
```

**Note:** If you change port, also update frontend API URL to use port 5001.

---

## 🎯 Complete Solution Steps

### Step 1: Open Command Prompt

### Step 2: Kill All Node Processes
```cmd
taskkill /F /IM node.exe
```

### Step 3: Wait 2-3 seconds

### Step 4: Navigate to Project
```cmd
cd "D:\New folder\Agriculturee website"
```

### Step 5: Verify Port is Free
```cmd
netstat -ano | findstr :5000
```

**If no output, port is free!**

### Step 6: Start Server
```cmd
npm run dev
```

---

## 🔍 Check What's Using Port 5000

```cmd
netstat -ano | findstr :5000
```

This shows which process (PID) is using port 5000.

---

## ✅ Verify Port is Free

```cmd
netstat -ano | findstr :5000
```

**If no output appears, the port is free!**

---

## 🚀 After Fixing, Start Server

```cmd
cd "D:\New folder\Agriculturee website"
npm run dev
```

---

## 📝 Prevention Tips

1. **Always stop server properly:** Press `Ctrl + C` before closing CMD
2. **Check if running:** Use `netstat -ano | findstr :5000` before starting
3. **Kill processes:** Use `taskkill /F /IM node.exe` if needed

---

## ✅ Success Indicators

When port is fixed, you should see:
```
✅ MySQL Database connection established successfully.
🚀 UCAEP Server running on port 5000
📊 Environment: development
🗄️  Database: MySQL
🌐 API URL: http://localhost:5000/api
```

---

**Quick Fix Command:**
```cmd
taskkill /F /IM node.exe
```
**Wait 2 seconds, then:**
```cmd
npm run dev
```

