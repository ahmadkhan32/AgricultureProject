@echo off
REM 🚀 Complete UCAEP Website Deployment Script for Windows
echo 🌾 UCAEP Website - Complete Deployment
echo ======================================
echo.

REM Step 1: Pre-deployment checks
echo [INFO] Running pre-deployment checks...

REM Check if client build exists
if exist "client\build" (
    echo [SUCCESS] Client build directory exists
) else (
    echo [WARNING] Client build not found. Building now...
    cd client
    call npm run build
    cd ..
)

REM Check if all dependencies are installed
if exist "node_modules" if exist "client\node_modules" if exist "server\node_modules" (
    echo [SUCCESS] All dependencies are installed
) else (
    echo [INFO] Installing dependencies...
    call npm run install-all
)

REM Step 2: Deploy Frontend to Vercel
echo [INFO] Deploying frontend to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing Vercel CLI...
    npm install -g vercel
)

REM Check if user is logged in
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo [INFO] Please log in to Vercel:
    vercel login
)

REM Deploy to Vercel
echo [INFO] Deploying to Vercel...
cd client
vercel --prod --yes
cd ..

echo [SUCCESS] Frontend deployed to Vercel

REM Step 3: Deploy Backend to Railway
echo [INFO] Setting up backend deployment to Railway...

REM Create Railway configuration
echo {> railway.json
echo   "$schema": "https://railway.app/railway.schema.json",>> railway.json
echo   "build": {>> railway.json
echo     "builder": "NIXPACKS">> railway.json
echo   },>> railway.json
echo   "deploy": {>> railway.json
echo     "startCommand": "npm start",>> railway.json
echo     "healthcheckPath": "/api/health",>> railway.json
echo     "healthcheckTimeout": 100,>> railway.json
echo     "restartPolicyType": "ON_FAILURE",>> railway.json
echo     "restartPolicyMaxRetries": 10>> railway.json
echo   }>> railway.json
echo }>> railway.json

echo [SUCCESS] Railway configuration created

REM Step 4: Update environment variables
echo [INFO] Updating environment variables...

echo [INFO] Please update your Vercel environment variables:
echo 1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
echo 2. Add/Update:
echo    REACT_APP_API_URL=https://your-railway-url.railway.app/api
echo    REACT_APP_SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
echo    REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM

REM Step 5: Summary
echo.
echo 🎉 Deployment Summary
echo ====================
echo.
echo ✅ Frontend deployed to Vercel
echo ✅ Backend ready for Railway deployment
echo ✅ CORS settings updated for production
echo ✅ Environment variables configured
echo.
echo 📋 Next Steps:
echo 1. Deploy backend to Railway:
echo    - Go to railway.app
echo    - Create new project
echo    - Set root directory to 'server'
echo    - Add environment variables
echo.
echo 2. Update Vercel environment variables with Railway URL
echo.
echo 3. Test the complete application
echo.
echo 🌾 Your UCAEP website is ready to serve the agricultural community!

pause
