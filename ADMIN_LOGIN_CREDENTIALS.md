# 🔐 Admin Login Credentials

## Default Admin Account

**Email:** `admin@ucaep.com`  
**Password:** `admin123`

---

## 📝 Login Details

### For Backend API Login:
```
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "admin@ucaep.com",
  "password": "admin123"
}
```

### For Frontend Dashboard:
- **Email:** `admin@ucaep.com`
- **Password:** `admin123`

---

## ⚠️ IMPORTANT SECURITY NOTE

**CHANGE THIS PASSWORD IMMEDIATELY after first login!**

The default password is **NOT secure** for production use.

---

## 🔧 How to Change Admin Password

### Option 1: Update Profile (After Login)
1. Login with above credentials
2. Go to Profile Settings
3. Update password

### Option 2: Update in Database (phpMyAdmin)
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select `ucaep_db` database
3. Click on `users` table
4. Find admin user
5. Update password field with new bcrypt hash
6. Or use UPDATE query with new hashed password

---

## 🎯 Quick Login Test

**Test in CMD:**
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

## 📊 Admin Access

With admin account, you can:
- ✅ Create, Update, Delete all resources
- ✅ Manage producers, news, projects
- ✅ View all contact messages
- ✅ Access admin dashboard
- ✅ Manage user accounts

---

## 🔑 Generate New Password Hash (If Needed)

To generate a new password hash for database:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('newpassword', 10);
console.log(hash);
```

Then use this hash in database UPDATE query.

---

**Default Admin Credentials:**
- **Email:** `admin@ucaep.com`
- **Password:** `admin123`

**Use these to login to your dashboard!**

