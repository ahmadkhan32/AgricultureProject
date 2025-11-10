@echo off
echo ========================================
echo UCAEP Website - Vercel Deployment
echo ========================================
echo.
echo This script will help you deploy to Vercel
echo.
echo Step 1: Make sure you're logged in to Vercel
echo Step 2: Navigate to client directory
echo Step 3: Deploy
echo.
echo ========================================
echo.

REM Check if vercel CLI is installed
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    echo.
)

echo Navigating to client directory...
cd client

echo.
echo ========================================
echo Deploying to Vercel...
echo ========================================
echo.
echo Choose deployment option:
echo 1. Preview deployment (test)
echo 2. Production deployment
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Deploying preview...
    vercel
) else if "%choice%"=="2" (
    echo.
    echo Deploying to production...
    vercel --prod
) else (
    echo Invalid choice!
    pause
    exit
)

echo.
echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to Vercel dashboard to configure environment variables
echo 2. Set REACT_APP_API_URL to your backend URL
echo 3. Verify deployment is working
echo.
pause
