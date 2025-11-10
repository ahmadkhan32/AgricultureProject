# 🔧 Fix Login Issue - Invalid Email or Password

## Problem
Login is showing "Invalid email or password" error.

## ✅ Solution Applied

### 1. Updated Frontend AuthContext
- ✅ Changed from Supabase authentication to Backend API authentication
- ✅ Now uses: `http://localhost:5000/api/auth/login`
- ✅ Stores JWT token in localStorage
- ✅ Verifies token on app load

### 2. Database Setup Required

**Make sure database tables are created:**

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select `ucaep_db` database
3. Import `database/mysql-schema.sql` if tables don't exist

**Or manually create admin user:**

Run this SQL in phpMyAdmin:
```sql
USE ucaep_db;

-- Make sure users table exists with correct structure
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin', 'producer') DEFAULT 'producer' NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert or update admin user
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@ucaep.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'admin')
ON DUPLICATE KEY UPDATE 
  password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  role = 'admin';
```

### 3. Create Admin User via Script

**Run this command in CMD:**
```cmd
cd server
node src/scripts/createAdmin.js
```

**Or create manually using this SQL:**
```sql
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@ucaep.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'admin');
```

---

## 📝 Admin Credentials

**Email:** `admin@ucaep.com`  
**Password:** `admin123`

---

## 🧪 Test Login

**Test via API (CMD):**
```cmd
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@ucaep.com\",\"password\":\"admin123\"}"
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@ucaep.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

---

## ✅ Steps to Fix

1. **Create Database Tables:**
   - Import `database/mysql-schema.sql` in phpMyAdmin
   - Or run SQL commands above

2. **Verify Admin User:**
   - Check `users` table in phpMyAdmin
   - Should have one row with email `admin@ucaep.com`

3. **Test Backend API:**
   - Run: `curl http://localhost:5000/api/health`
   - Should return: `{"status":"OK"}`

4. **Restart Frontend:**
   - Frontend should automatically use new backend API
   - Clear browser cache if needed

5. **Login:**
   - Email: `admin@ucaep.com`
   - Password: `admin123`

---

## 🔍 Troubleshooting

### Error: "Cannot connect to API"
- Make sure backend is running: `npm run dev` (in server folder)
- Check API URL: `http://localhost:5000/api`

### Error: "Invalid credentials"
- Verify admin user exists in database
- Check password hash is correct
- Try creating admin user again

### Error: Database connection failed
- Check XAMPP MySQL is running
- Verify database `ucaep_db` exists
- Check `.env` file has correct credentials

---

**Login should work now!** ✅

