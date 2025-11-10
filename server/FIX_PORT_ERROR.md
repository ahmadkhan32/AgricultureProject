# 🔧 Port 5000 Already in Use - Quick Fix Guide

Agar aapko yeh error aa raha hai:
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```

## ✅ Quick Solutions

### Option 1: Automatic Fix (Recommended)
```bash
node kill-port.js 5000
```

Yeh script automatically port use karne wale processes ko find karega aur kill karega.

### Option 2: Manual Fix

**Step 1: Find the process**
```powershell
netstat -ano | findstr :5000
```

**Step 2: Kill the process (PID ko replace karein)**
```powershell
taskkill /PID <PID> /F
```

### Option 3: Use Different Port

Agar aap port change karna chahte hain:

1. `.env` file mein PORT change karein:
   ```
   PORT=5001
   ```

2. Server restart karein

## 🛠️ What I've Improved

1. **Port Check Before Starting**: Server ab start hone se pehle port check karta hai
2. **Better Error Messages**: Clear error messages with solutions
3. **Helper Script**: `kill-port.js` script add kiya gaya hai
4. **Automatic Detection**: Server ab automatically batata hai agar port busy hai

## 📝 Prevention Tips

1. **Server ko properly stop karein**: Ctrl+C se server stop karein
2. **Multiple instances se bachain**: Ek hi waqt mein ek server instance chalaayein
3. **Port check script use karein**: `node kill-port.js` se port clean karein

## 🚀 After Fixing

Jab port free ho jaye, server restart karein:
```bash
npm run dev
```

---

**Note**: Agar problem persist kare, to server logs check karein aur error details dekhein.

