# 🔐 Login Troubleshooting Guide

## Current Status

✅ **Database Check**: Admin user exists and password is correctly hashed
✅ **Password Test**: Password comparison works correctly in test script

## Common Issues & Solutions

### 1. "Invalid email or password" Error

**Check server console logs** - Detailed logs will show:
- ✅ User found or not found
- ✅ Password hash exists or not
- ✅ Password comparison result

### 2. Email Case Sensitivity

The login now normalizes email to lowercase. Make sure you're using:
```
admin@ucaep.com
```

NOT:
```
Admin@Ucaep.com
admin@UCAEP.com
```

### 3. Password Issues

**Test password directly:**
```bash
node src/scripts/testLogin.js
```

This will verify:
- User exists in database
- Password hash is correct
- Password comparison works

### 4. Reset Admin Password

If password doesn't work, reset it:
```bash
node src/scripts/createAdminDirect.js
```

### 5. Check Server Logs

When you try to login, check server console for:
```
🔍 Login attempt for: admin@ucaep.com
📝 User found: ID X, Role: admin
📝 Password field exists: true/false
📝 Password hash length: 60
📝 Password comparison result: ✅ VALID or ❌ INVALID
```

## Quick Fixes

### Option 1: Reset Admin User
```bash
cd server
node src/scripts/createAdminDirect.js
```

### Option 2: Test Login Directly
```bash
node src/scripts/testLogin.js
```

### Option 3: Check Database Directly
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Select `ucaep_db` database
3. Open `users` table
4. Check if admin@ucaep.com exists
5. Verify password field has a hash (starts with $2)

## Expected Behavior

When login is successful, you should see:
```
✅ Login successful for: admin@ucaep.com
```

And receive a response with:
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

## Still Not Working?

1. **Check server logs** - Look for detailed error messages
2. **Verify credentials** - Use exactly: `admin@ucaep.com` / `admin123`
3. **Test with script** - Run `node src/scripts/testLogin.js`
4. **Reset admin** - Run `node src/scripts/createAdminDirect.js`
5. **Check database** - Verify user exists in phpMyAdmin

---

**Credentials:**
- Email: `admin@ucaep.com`
- Password: `admin123`

