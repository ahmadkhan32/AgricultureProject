@echo off
echo ========================================
echo UCAEP Backend Server Startup
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Checking if .env file exists...
if not exist .env (
    echo WARNING: .env file not found!
    echo Copying from src/env.example...
    copy src\env.example .env >nul
    echo Please edit .env file with your MySQL credentials.
    pause
)

echo.
echo Installing dependencies...
call npm install

if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting server...
echo ========================================
echo.
echo Make sure:
echo 1. XAMPP MySQL is running
echo 2. Database 'ucaep_db' exists in phpMyAdmin
echo 3. Tables are created (run mysql-schema.sql in phpMyAdmin)
echo.

npm run dev

pause

