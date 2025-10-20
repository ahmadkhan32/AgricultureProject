@echo off
REM UCAEP Website Vercel Deployment Script for Windows
echo 🚀 Starting UCAEP Website Deployment to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI is not installed. Installing now...
    npm install -g vercel
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please log in to Vercel:
    vercel login
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install-all

REM Build the client
echo 🔨 Building the client...
cd client
call npm run build
cd ..

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🌐 Your website is now live on Vercel!
echo 📋 Next steps:
echo    1. Set up your backend API (Railway/Heroku)
echo    2. Update CORS settings in your backend
echo    3. Configure environment variables in Vercel dashboard
echo    4. Test your deployed application

pause
