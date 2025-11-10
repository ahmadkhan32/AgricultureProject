# Running Project on Different Ports

This guide explains how to run the UCAEP website on different ports (Backend: 5001, Frontend: 3001) instead of the default ports (5000 and 3000).

## Quick Start (Windows)

### Option 1: Using Batch File (Recommended)
Simply double-click or run:
```bash
run-different-ports.bat
```

This will automatically start:
- **Backend Server** on `http://localhost:5001`
- **Frontend Client** on `http://localhost:3001`

### Option 2: Using NPM Script
```bash
npm run dev:ports
```

## Manual Setup

### Step 1: Create Server .env File

Create a file named `.env` in the `server` folder with the following content:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ucaep_db

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_change_this_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001

# Admin Email (for notifications)
ADMIN_EMAIL=admin@ucaep.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

### Step 2: Create Client .env File

Create a file named `.env` in the `client` folder with the following content:

```env
# React App Configuration
REACT_APP_API_URL=http://localhost:5001/api

# Port Configuration
PORT=3001
```

### Step 3: Update client/package.json

The `proxy` field in `client/package.json` has already been updated to:
```json
"proxy": "http://localhost:5001"
```

### Step 4: Run the Project

**Option A: Run both servers together**
```bash
npm run dev:ports
```

**Option B: Run servers separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

## Port Configuration Summary

| Service | Default Port | New Port |
|---------|-------------|----------|
| Backend Server | 5000 | **5001** |
| Frontend Client | 3000 | **3001** |

## Access URLs

After starting the servers:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5001/api
- **Backend Health Check**: http://localhost:5001/api/health

## Troubleshooting

### Port Already in Use

If you get an error that port 5001 or 3001 is already in use:

**Windows:**
```bash
# Find process using port 5001
netstat -ano | findstr :5001

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find process using port 5001
lsof -i :5001

# Kill the process (replace <PID> with actual process ID)
kill -9 <PID>
```

### CORS Errors

If you encounter CORS errors, make sure:
1. The `CORS_ORIGIN` in server `.env` includes `http://localhost:3001`
2. The `FRONTEND_URL` in server `.env` is set to `http://localhost:3001`
3. The `REACT_APP_API_URL` in client `.env` is set to `http://localhost:5001/api`

### API Connection Issues

If the frontend can't connect to the backend:
1. Verify backend is running on port 5001
2. Check `REACT_APP_API_URL` in client `.env`
3. Verify `proxy` in `client/package.json` points to `http://localhost:5001`
4. Check browser console for specific error messages

## Reverting to Default Ports

To revert back to default ports (5000 and 3000):

1. Remove or update `.env` files to use default ports
2. Update `client/package.json` proxy back to `http://localhost:5000`
3. Run `npm run dev` instead of `npm run dev:ports`

## Notes

- The batch file (`run-different-ports.bat`) sets environment variables automatically
- Environment variables set in `.env` files take precedence
- The `proxy` field in `package.json` is used by React's development server for API calls

