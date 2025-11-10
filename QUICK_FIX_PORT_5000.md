# ⚡ Quick Fix: Port 5000 Already in Use

## 🔧 One Command Fix

**Run this in CMD:**
```cmd
taskkill /F /IM node.exe
```

**Wait 2 seconds, then:**
```cmd
npm run dev
```

**That's it! ✅**

---

## 📋 Detailed Steps

### Step 1: Kill All Node Processes
```cmd
taskkill /F /IM node.exe
```

### Step 2: Verify Port is Free
```cmd
netstat -ano | findstr :5000
```
**If no output, port is free!**

### Step 3: Start Server
```cmd
cd "D:\New folder\Agriculturee website"
npm run dev
```

---

## 🎯 Alternative: Find Specific Process

### Find what's using port 5000:
```cmd
netstat -ano | findstr :5000
```

You'll see something like:
```
TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       12345
```

### Kill that specific process:
```cmd
taskkill /PID 12345 /F
```

Replace `12345` with the actual PID number.

---

## ✅ Success

After fixing, you should see:
```
✅ MySQL Database connection established successfully.
🚀 UCAEP Server running on port 5000
```

---

## 📝 Prevention

Always stop server properly:
- Press `Ctrl + C` in CMD
- Type `Y` if prompted
- Don't just close the CMD window

---

**Quick Command:**
```cmd
taskkill /F /IM node.exe && timeout /t 2 && npm run dev
```

