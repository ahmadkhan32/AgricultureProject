# 🔍 Debugging Internal Server Errors

This guide helps you diagnose and fix internal server errors in the UCAEP backend.

## ✅ Recent Improvements

The following improvements have been made to help debug errors:

1. **Enhanced Error Logging**: Detailed error information in development mode
2. **Environment Variable Validation**: Server checks for required variables on startup
3. **Better Error Messages**: More specific error messages for common issues
4. **Global Error Handlers**: Catches unhandled promise rejections and exceptions

## 🔎 Common Causes of Internal Server Errors

### 1. Database Connection Issues

**Symptoms:**
- Error message: "Database connection failed"
- 503 status code

**Solutions:**
1. Check if MySQL/XAMPP is running
2. Verify `.env` file has correct database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ucaep_db
   ```
3. Test connection manually:
   ```bash
   mysql -u root -p -h localhost -P 3306 ucaep_db
   ```

### 2. Missing JWT_SECRET

**Symptoms:**
- Error during login/authentication
- "Server configuration error" message

**Solutions:**
1. Check `.env` file in `server/` directory
2. Ensure `JWT_SECRET` is set:
   ```
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_change_this_in_production
   ```
3. Restart the server after updating `.env`

### 3. Missing Environment Variables

**Symptoms:**
- Server won't start
- Error on startup about missing variables

**Solutions:**
1. Copy `server/src/env.example` to `server/.env`
2. Fill in all required values
3. Required variables:
   - `JWT_SECRET`
   - `DB_NAME`
   - `DB_HOST`
   - `DB_USER`

### 4. Model/Database Schema Mismatch

**Symptoms:**
- Sequelize validation errors
- "Table doesn't exist" errors

**Solutions:**
1. Run database migrations/sync (development only):
   ```bash
   cd server
   npm run db:sync
   ```
2. Check if all tables exist in phpMyAdmin
3. Verify models match database schema

### 5. Missing Dependencies

**Symptoms:**
- "Cannot find module" errors
- Import errors

**Solutions:**
1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

## 🛠️ How to Debug

### Step 1: Check Server Logs

When an error occurs, check the console output. In development mode, you'll see detailed error information:

```
═══════════════════════════════════════
❌ ERROR DETAILS:
═══════════════════════════════════════
Error Name: SequelizeConnectionError
Error Message: connect ECONNREFUSED
Error Stack: [full stack trace]
Request URL: POST /api/auth/login
Request Body: { email: "...", password: "..." }
═══════════════════════════════════════
```

### Step 2: Test the Health Endpoint

Check if the server is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "UCAEP Server is running",
  "database": "MySQL",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Step 3: Check Database Connection

Test database connection:
```bash
# Windows PowerShell
cd server
node -e "require('./src/config/db').testConnection().then(r => console.log(r ? '✅ Connected' : '❌ Failed'))"
```

### Step 4: Verify Environment Variables

Check if `.env` file exists and has correct values:
```bash
cd server
cat .env  # Linux/Mac
type .env  # Windows CMD
Get-Content .env  # Windows PowerShell
```

### Step 5: Check Specific Endpoints

Test individual endpoints to isolate the issue:

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@ucaep.com\",\"password\":\"admin123\"}"

# Test health endpoint
curl http://localhost:5000/api/health
```

## 📝 Error Response Format

When an error occurs, the server returns:

```json
{
  "message": "Error description",
  "error": {
    "name": "ErrorType",
    "message": "Detailed error message",
    "stack": "Stack trace (development only)"
  }
}
```

## 🔧 Quick Fixes

### Restart Server
```bash
# Stop server (Ctrl+C)
# Then restart
cd server
npm run dev
```

### Reset Database Connection
1. Stop server
2. Restart MySQL/XAMPP
3. Start server again

### Clear Node Modules
```bash
cd server
rm -rf node_modules
npm install
```

### Check Port Conflicts
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

## 📞 Getting Help

If errors persist:
1. Copy the full error message from console
2. Note which endpoint was called
3. Check server logs in development mode
4. Verify all environment variables are set

## 🎯 Prevention

1. **Always run in development mode during development**:
   ```bash
   NODE_ENV=development npm run dev
   ```

2. **Keep `.env` file secure** - Never commit it to git

3. **Check logs regularly** - Errors are logged with details

4. **Validate inputs** - Use the validation schemas provided

5. **Test database connection** before starting server

---

**Last Updated:** 2024-01-01
**Server Version:** 1.0.0

