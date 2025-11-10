# Quick Fix: Server Won't Start (Exit Code 1)

## Problem
Your server is exiting with code 1 because it's missing required configuration.

## Quick Fix (5 Minutes)

### Step 1: Create .env File

1. **Navigate to server folder:**
   ```bash
   cd server
   ```

2. **Create .env file:**
   
   **Windows (PowerShell):**
   ```powershell
   copy src\env.example .env
   ```
   
   **Or manually create:**
   - Create a new file named `.env` in the `server` folder
   - Copy the content below:

### Step 2: Add This to .env File

Create `server/.env` with this content:

```env
# Database Configuration
DB_NAME=ucaep_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# JWT Secret (IMPORTANT: Change this to a random string!)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration (Optional)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Step 3: Start MySQL (XAMPP)

1. Open **XAMPP Control Panel**
2. Start **MySQL** service ✅
3. Wait until MySQL is running (green status)

### Step 4: Verify Database Exists

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Check if database `ucaep_db` exists
3. If not, create it:
   ```sql
   CREATE DATABASE ucaep_db;
   ```

### Step 5: Start Server

**From project root:**
```bash
npm run server
```

**Or from server folder:**
```bash
cd server
npm run dev
```

## Common Errors & Solutions

### Error: "Missing required environment variables"

**Solution:** Make sure `.env` file exists in `server/` folder with `JWT_SECRET` and `DB_NAME`

### Error: "Database connection failed"

**Solutions:**
1. ✅ Make sure XAMPP MySQL is running
2. ✅ Check database name in `.env` matches your database
3. ✅ Verify MySQL username/password (default is `root` with no password)
4. ✅ Check MySQL port (default is 3306)

### Error: "Port 5000 is already in use"

**Solution:**
1. Find the process using port 5000:
   ```bash
   netstat -ano | findstr :5000
   ```
2. Kill it:
   ```bash
   taskkill /PID <PID_NUMBER> /F
   ```
3. Or change PORT in `.env` to another port (e.g., 5001)

### Error: "Cannot find module"

**Solution:**
```bash
cd server
npm install
```

## Verify Server is Running

Once started, you should see:
```
✅ MySQL Database connection established successfully.
🚀 UCAEP Server running on port 5000
📊 Environment: development
🗄️  Database: MySQL
🌐 API URL: http://localhost:5000/api
```

Test it:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"OK","message":"UCAEP Server is running"}`

## Complete Setup Checklist

- [ ] `.env` file created in `server/` folder
- [ ] `JWT_SECRET` set in `.env`
- [ ] `DB_NAME` set in `.env` (e.g., `ucaep_db`)
- [ ] `DB_USER` set (usually `root`)
- [ ] `DB_PASSWORD` set (usually empty for XAMPP)
- [ ] XAMPP MySQL is running
- [ ] Database `ucaep_db` exists in MySQL
- [ ] Server dependencies installed (`npm install` in server folder)
- [ ] Port 5000 is available

---

**After fixing, restart the server and try creating a news article again!**

