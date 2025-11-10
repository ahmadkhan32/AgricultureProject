@echo off
title UCAEP Project Startup
color 0A

echo ========================================
echo    UCAEP Project Startup Script
echo ========================================
echo.

:: Check if .env file exists in server
if not exist "server\.env" (
    echo [STEP 1/5] Creating server .env file...
    if exist "server\src\env.example" (
        copy "server\src\env.example" "server\.env" >nul
        echo ✅ .env file created from template
    ) else (
        echo Creating .env file...
        (
            echo DB_HOST=localhost
            echo DB_PORT=3306
            echo DB_USER=root
            echo DB_PASSWORD=
            echo DB_NAME=ucaep_db
            echo PORT=5000
            echo NODE_ENV=development
            echo JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_change_this_in_production
        ) > "server\.env"
        echo ✅ .env file created
    )
) else (
    echo ✅ Server .env file exists
)

echo.
echo [STEP 2/5] Checking MySQL/XAMPP...
echo ⚠️  Please make sure XAMPP MySQL is running!
echo    If not running, start it now from XAMPP Control Panel
timeout /t 3 /nobreak >nul

echo.
echo [STEP 3/5] Installing dependencies (if needed)...
if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install server dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
) else (
    echo ✅ Server dependencies installed
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install client dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
) else (
    echo ✅ Client dependencies installed
)

echo.
echo [STEP 4/5] Checking database...
echo Please verify:
echo   - MySQL is running in XAMPP
echo   - Database 'ucaep_db' exists (create it in phpMyAdmin if not)
echo   - Status column added to 'news' table (run database/add_status_column_simple.sql)
echo.
timeout /t 2 /nobreak >nul

echo.
echo [STEP 5/5] Starting project...
echo.
echo ========================================
echo Starting Server and Client...
echo ========================================
echo.
echo Server will run on: http://localhost:5000
echo Client will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

:: Start both server and client concurrently
start "UCAEP Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
start "UCAEP Client" cmd /k "cd client && npm start"

echo.
echo ✅ Project started!
echo.
echo Both server and client should be starting in separate windows.
echo Check the windows for any errors.
echo.
pause

