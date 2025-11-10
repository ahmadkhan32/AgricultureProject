@echo off
echo ========================================
echo Quick Fix: Server Startup Issues
echo ========================================
echo.

:: Check if .env file exists
if not exist "server\.env" (
    echo [1/4] Creating .env file...
    copy "server\src\env.example" "server\.env" >nul
    if exist "server\.env" (
        echo ✅ .env file created successfully!
    ) else (
        echo ❌ Failed to create .env file. Creating manually...
        echo.
        echo Creating server\.env file...
        (
            echo # MySQL Database Configuration
            echo DB_HOST=localhost
            echo DB_PORT=3306
            echo DB_USER=root
            echo DB_PASSWORD=
            echo DB_NAME=ucaep_db
            echo.
            echo # Server Configuration
            echo PORT=5000
            echo NODE_ENV=development
            echo.
            echo # JWT Configuration
            echo JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_change_this_in_production
            echo.
            echo # Frontend URL
            echo FRONTEND_URL=http://localhost:3000
        ) > "server\.env"
        echo ✅ .env file created manually!
    )
) else (
    echo ✅ .env file already exists
)

echo.
echo [2/4] Checking MySQL connection...
echo Please make sure XAMPP MySQL is running!
echo.

echo [3/4] Checking server dependencies...
cd server
if not exist "node_modules" (
    echo Installing server dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo ✅ Server dependencies installed
)
cd ..

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Make sure XAMPP MySQL is running
echo 2. Open phpMyAdmin and verify database 'ucaep_db' exists
echo 3. Run: npm run server
echo.
echo ========================================
pause

