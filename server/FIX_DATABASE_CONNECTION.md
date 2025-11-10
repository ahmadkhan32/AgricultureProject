# 🔧 Fix Database Connection Error

## Error Message
```
❌ Unable to connect to MySQL database
❌ Database connection failed. Please check your MySQL configuration.
```

## Quick Fixes

### Step 1: Check if MySQL/XAMPP is Running

**Windows:**
1. Open XAMPP Control Panel
2. Check if MySQL is running (green status)
3. If not running, click "Start" button for MySQL

**Or check in Services:**
```powershell
Get-Service -Name "*mysql*"
```

### Step 2: Verify Database Configuration

Check your `.env` file in `server/` directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # Leave empty if no password set
DB_NAME=ucaep_db
```

### Step 3: Check if Database Exists

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Check if `ucaep_db` database exists
3. If not, create it:
   ```sql
   CREATE DATABASE ucaep_db;
   ```

### Step 4: Test MySQL Connection Manually

```powershell
# Test if MySQL is accepting connections
Test-NetConnection -ComputerName localhost -Port 3306
```

Or using MySQL client:
```bash
mysql -u root -p -h localhost -P 3306
```

### Step 5: Check Common Issues

#### Issue 1: MySQL Not Running
**Solution:** Start MySQL in XAMPP

#### Issue 2: Wrong Password
**Solution:** Update `.env` file with correct password

#### Issue 3: Database Doesn't Exist
**Solution:** Create database `ucaep_db` in phpMyAdmin

#### Issue 4: Port Already in Use
**Solution:** Check if port 3306 is used by another service

#### Issue 5: Firewall Blocking
**Solution:** Check Windows Firewall settings

## Detailed Troubleshooting

### 1. Check MySQL Service Status

```powershell
# Check if MySQL service exists
Get-Service -Name "*mysql*" | Format-Table

# Start MySQL service (if XAMPP)
# Or check XAMPP Control Panel
```

### 2. Test Connection with Node.js

Create a test file `server/test-db-connection.js`:

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const test = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ucaep_db'
    });
    
    console.log('✅ Connection successful!');
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
};

test();
```

Run it:
```bash
node test-db-connection.js
```

### 3. Create .env File if Missing

If `.env` file doesn't exist in `server/` directory:

```bash
cd server
copy src\env.example .env
```

Then edit `.env` with correct values.

### 4. Reset MySQL Password (if needed)

If you forgot MySQL password:

1. Stop MySQL in XAMPP
2. Start MySQL with skip-grant-tables option
3. Reset password
4. Restart MySQL normally

## Expected Behavior

After fixing, you should see:
```
✅ MySQL Database connection established successfully.
🔄 Syncing database models...
✅ Database models synced successfully.
🚀 UCAEP Server running on port 5000
```

## Still Not Working?

1. **Check server console** for detailed error messages
2. **Verify MySQL is running** in XAMPP Control Panel
3. **Test connection manually** using MySQL client
4. **Check firewall** settings
5. **Restart XAMPP** completely

---

**Quick Command to Start MySQL (if using XAMPP):**
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Wait for green status
4. Restart Node.js server

