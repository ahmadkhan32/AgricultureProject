@echo off
title UCAEP - Running Project
color 0B

echo.
echo ╔════════════════════════════════════════╗
echo ║     UCAEP Project - Quick Start       ║
echo ╚════════════════════════════════════════╝
echo.

:: Quick check for .env
if not exist "server\.env" (
    echo ⚠️  WARNING: .env file missing!
    echo Creating server\.env file...
    if exist "server\src\env.example" (
        copy "server\src\env.example" "server\.env" >nul
    ) else (
        (
            echo DB_HOST=localhost
            echo DB_PORT=3306
            echo DB_USER=root
            echo DB_PASSWORD=
            echo DB_NAME=ucaep_db
            echo PORT=5000
            echo NODE_ENV=development
            echo JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
        ) > "server\.env"
    )
    echo ✅ .env file created!
    echo.
)

echo 📋 Prerequisites Check:
echo.
echo ✓ Node.js installed
echo ✓ npm installed
echo.
echo ⚠️  IMPORTANT: Make sure these are running:
echo    • XAMPP MySQL Service
echo    • Port 5000 available (server)
echo    • Port 3000 available (client)
echo.

timeout /t 2 /nobreak >nul

echo.
echo 🚀 Starting Project...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

:: Use concurrently to run both
call npm run dev

pause
