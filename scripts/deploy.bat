@echo off
REM UCAEP Website Deployment Script for Windows
REM This script automates the deployment process

echo 🚀 Starting UCAEP Website Deployment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v16 or higher.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm.
    exit /b 1
)

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed. Please install Git.
    exit /b 1
)

echo [SUCCESS] All requirements are met!

echo [INFO] Installing dependencies...

REM Install root dependencies
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies
    exit /b 1
)

REM Install server dependencies
cd server
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install server dependencies
    exit /b 1
)
cd ..

REM Install client dependencies
cd client
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install client dependencies
    exit /b 1
)
cd ..

echo [SUCCESS] Dependencies installed successfully!

echo [INFO] Building application...

REM Build client
cd client
npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build client
    exit /b 1
)
cd ..

echo [SUCCESS] Application built successfully!

REM Check environment files
if not exist "server\.env" (
    echo [WARNING] server\.env not found. Please create it from server\env.example
    echo [INFO] Copy server\env.example to server\.env and edit with your values
)

if not exist "client\.env" (
    echo [WARNING] client\.env not found. Please create it from client\env.example
    echo [INFO] Copy client\env.example to client\.env and edit with your values
)

echo.
echo Select deployment target:
echo 1) Vercel (Frontend only)
echo 2) Netlify (Frontend only)
echo 3) Heroku (Backend only)
echo 4) Railway (Backend only)
echo 5) All (Vercel + Railway)
echo 6) All (Netlify + Heroku)
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto deploy_netlify
if "%choice%"=="3" goto deploy_heroku
if "%choice%"=="4" goto deploy_railway
if "%choice%"=="5" goto deploy_all_vercel
if "%choice%"=="6" goto deploy_all_netlify
echo [ERROR] Invalid choice. Please run the script again.
exit /b 1

:deploy_vercel
echo [INFO] Deploying to Vercel...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Vercel CLI is not installed. Please install it with: npm i -g vercel
    exit /b 1
)
cd client
vercel --prod
cd ..
echo [SUCCESS] Deployed to Vercel!
goto end

:deploy_netlify
echo [INFO] Deploying to Netlify...
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Netlify CLI is not installed. Please install it with: npm i -g netlify-cli
    exit /b 1
)
cd client
netlify deploy --prod --dir=build
cd ..
echo [SUCCESS] Deployed to Netlify!
goto end

:deploy_heroku
echo [INFO] Deploying to Heroku...
heroku --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Heroku CLI is not installed. Please install it from https://devcenter.heroku.com/articles/heroku-cli
    exit /b 1
)
heroku apps:info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No Heroku app found. Please create one first with: heroku create your-app-name
    exit /b 1
)
git push heroku main
echo [SUCCESS] Deployed to Heroku!
goto end

:deploy_railway
echo [INFO] Deploying to Railway...
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Railway CLI is not installed. Please install it with: npm i -g @railway/cli
    exit /b 1
)
railway up
echo [SUCCESS] Deployed to Railway!
goto end

:deploy_all_vercel
call :deploy_vercel
call :deploy_railway
goto end

:deploy_all_netlify
call :deploy_netlify
call :deploy_heroku
goto end

:end
echo.
echo [SUCCESS] 🎉 Deployment completed successfully!
echo.
echo Next steps:
echo 1. Update your CORS settings in the backend
echo 2. Configure your Supabase authentication URLs
echo 3. Test your live website
echo 4. Set up your admin user in Supabase
echo.
echo For detailed instructions, see SETUP.md
pause
