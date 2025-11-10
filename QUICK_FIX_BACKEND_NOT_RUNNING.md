# 🚨 Quick Fix: Backend Server Not Running

## ❌ Error You're Seeing:
```
ERR_CONNECTION_REFUSED on :5000/api/auth/register
Failed to fetch
```

## ✅ Solution: Start the Backend Server

### Step 1: Open a Terminal
- Windows: PowerShell or Command Prompt
- Mac/Linux: Terminal

### Step 2: Navigate to Project Root
```bash
cd "D:\New folder\Agriculturee website"
```

### Step 3: Start the Backend Server
**Option A: From project root (recommended)**
```bash
npm run server
```

**Option B: From server directory**
```bash
cd server
npm run dev
```

### Step 4: Wait for Success Message
You should see:
```
🚀 UCAEP Server running on port 5000
📊 Environment: development
🗄️  Database: MySQL
🌐 API URL: http://localhost:5000/api
```

### Step 5: Verify Backend is Running
Open your browser and visit:
```
http://localhost:5000/api/health
```

You should see: `{"status":"OK","message":"UCAEP Server is running",...}`

### Step 6: Try Registration Again
Once the backend is running, go back to your registration page and try again.

---

## 🔧 Additional Troubleshooting

### Port 5000 Already in Use?
If you see "Port 5000 is already in use":
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or use the included script
cd server
node kill-port.js 5000
```

### Database Connection Issues?
Make sure your `.env` file in the `server` directory has:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ucaep_db
```

### Still Having Issues?
1. Check if MySQL is running
2. Verify your `.env` file exists in `server/` directory
3. Make sure you have `node_modules` installed:
   ```bash
   cd server
   npm install
   ```

---

## 📝 Quick Reference Commands

```bash
# Start both frontend and backend together
npm run dev

# Start backend only
npm run server

# Start frontend only  
npm run client

# Check backend health
curl http://localhost:5000/api/health
```

