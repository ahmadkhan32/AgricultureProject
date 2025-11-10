# Port Configuration Guide

## Current Port Settings

- **Backend Server**: Port 5001
- **Frontend Client**: Port 3001

## How to Change Ports

### Option 1: Quick Change (Recommended)

Edit the `run-different-ports.bat` file and change these lines:

```batch
set SERVER_PORT=5001    ← Change this to your desired backend port
set CLIENT_PORT=3001    ← Change this to your desired frontend port
```

### Option 2: Using Environment Variables

Create or edit these files:

**server/.env**
```env
PORT=5001              ← Change to your desired backend port
FRONTEND_URL=http://localhost:3001    ← Update with your frontend port
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

**client/.env**
```env
PORT=3001              ← Change to your desired frontend port
REACT_APP_API_URL=http://localhost:5001/api    ← Update with your backend port
```

**client/package.json**
```json
"proxy": "http://localhost:5001"    ← Update with your backend port
```

### Option 3: Using NPM Scripts

Edit `package.json` and update the port numbers in these scripts:

```json
"server:5001": "cd server && set PORT=5001&& ..."    ← Change 5001
"client:3001": "cd client && set PORT=3001&& ..."    ← Change 3001
```

## Common Port Combinations

| Backend | Frontend | Use Case |
|---------|----------|----------|
| 5000 | 3000 | Default (original) |
| 5001 | 3001 | Alternative (current) |
| 8000 | 3000 | Alternative backend |
| 5000 | 8080 | Alternative frontend |
| 4000 | 3000 | Alternative backend |

## Important Notes

1. **Backend Port**: Must match in:
   - `server/.env` (PORT)
   - `client/.env` (REACT_APP_API_URL)
   - `client/package.json` (proxy)

2. **Frontend Port**: Must match in:
   - `client/.env` (PORT)
   - `server/.env` (FRONTEND_URL and CORS_ORIGIN)

3. **CORS**: Make sure the frontend URL is included in `CORS_ORIGIN` in server `.env`

## Quick Port Change Script

Run this to quickly change ports (edit the values first):

```batch
@echo off
set NEW_BACKEND_PORT=5001
set NEW_FRONTEND_PORT=3001

echo Updating ports to Backend: %NEW_BACKEND_PORT%, Frontend: %NEW_FRONTEND_PORT%
REM Add your update commands here
```

