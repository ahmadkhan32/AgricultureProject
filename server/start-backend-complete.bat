@echo off
title UCAEP Backend Server - Complete Setup
color 0A
echo.
echo ========================================
echo    UCAEP BACKEND SERVER - COMPLETE SETUP
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Checking prerequisites...
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js installed

REM Check if .env exists
if not exist .env (
    echo [INFO] Creating .env file from template...
    copy src\env.example .env >nul
    echo [OK] .env file created
    echo [WARNING] Please edit .env with your MySQL credentials if needed
) else (
    echo [OK] .env file exists
)

echo.
echo [2/5] Installing dependencies...
echo.
call npm install

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo [3/5] Checking MySQL connection...
echo.
echo [INFO] Make sure XAMPP MySQL is running!
echo [INFO] Database should be: ucaep_db
echo [INFO] Check phpMyAdmin: http://localhost/phpmyadmin
echo.

REM Check if port 5000 is in use
netstat -ano | findstr ":5000" >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Port 5000 is already in use!
    echo [INFO] Server might already be running, or another process is using port 5000
    echo.
    choice /C YN /M "Do you want to continue anyway"
    if errorlevel 2 exit /b 0
)

echo.
echo [4/5] Starting server...
echo.
echo ========================================
echo    SERVER STARTING...
echo ========================================
echo.
echo [INFO] Server will run on: http://localhost:5000
echo [INFO] API Base URL: http://localhost:5000/api
echo [INFO] Health Check: http://localhost:5000/api/health
echo.
echo [INFO] Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

REM Start the server
npm run dev

echo.
echo [5/5] Server stopped
echo.
pause

