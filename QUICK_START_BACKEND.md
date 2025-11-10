# 🚀 UCAEP Backend - Quick Start Guide

## ⚡ Fast Setup (5 Minutes)

### Step 1: Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL**

### Step 2: Create Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click "New" → Database name: `ucaep_db` → Create
3. Select `ucaep_db` database
4. Click "Import" tab
5. Choose file: `database/mysql-schema.sql`
6. Click "Go"

### Step 3: Configure Backend
```bash
cd server
npm install
copy src\env.example .env
```

Edit `.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # Usually empty for XAMPP
DB_NAME=ucaep_db
PORT=5000
JWT_SECRET=change_this_to_random_string
```

### Step 4: Start Server

**Option A: Using Batch File (Windows)**
```bash
start-backend.bat
```

**Option B: Manual**
```bash
npm run dev
```

### Step 5: Test
Open browser: `http://localhost:5000/api/health`

Should see:
```json
{"status":"OK","message":"UCAEP Server is running","database":"MySQL"}
```

## ✅ Done!

Your backend is now running on `http://localhost:5000`

## 📝 Default Admin Login

- **Email:** `admin@ucaep.com`
- **Password:** `admin123`

**⚠️ Change this password after first login!**

## 🔗 API Endpoints

Base URL: `http://localhost:5000/api`

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ucaep.com","password":"admin123"}'
```

### Create News (Admin only)
```bash
curl -X POST http://localhost:5000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test News",
    "content": "This is a test news article",
    "status": "published"
  }'
```

## 📚 Full Documentation

- `server/SETUP_GUIDE.md` - Detailed setup
- `server/README.md` - Quick reference
- `BACKEND_IMPLEMENTATION_COMPLETE.md` - Complete overview

## 🆘 Troubleshooting

**Database connection error?**
- Check XAMPP MySQL is running
- Verify database `ucaep_db` exists
- Check `.env` credentials

**Port already in use?**
- Change `PORT` in `.env`

**Module not found?**
```bash
npm install
```

---

**Ready to go! 🎉**

