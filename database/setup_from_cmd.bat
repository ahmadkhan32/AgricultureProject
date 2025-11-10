@echo off
REM ============================================
REM Setup Database from Command Prompt
REM Run this file to setup database and insert sample data
REM ============================================

echo.
echo ========================================
echo   Setting up UCAEP Database
echo ========================================
echo.

REM Change to database folder
cd /d "%~dp0"

REM Check if MySQL exists
if not exist "C:\xampp\mysql\bin\mysql.exe" (
    echo ERROR: MySQL not found at C:\xampp\mysql\bin
    echo Please check your XAMPP installation path
    pause
    exit
)

REM Check if SQL files exist
if not exist "setup_database.sql" (
    echo ERROR: setup_database.sql not found
    echo Make sure you run this file from the database folder
    pause
    exit
)

echo Step 1: Creating database and tables...
C:\xampp\mysql\bin\mysql.exe -u root -p -e "CREATE DATABASE IF NOT EXISTS ucaep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 (
    echo ERROR: Failed to create database
    pause
    exit
)

echo Step 2: Running setup_database.sql...
C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db < setup_database.sql
if errorlevel 1 (
    echo ERROR: Failed to run setup_database.sql
    pause
    exit
)

echo Step 3: Inserting sample news articles...
if exist "insert_sample_news.sql" (
    C:\xampp\mysql\bin\mysql.exe -u root -p ucaep_db < insert_sample_news.sql
    if errorlevel 1 (
        echo WARNING: Failed to insert sample news (file might not exist)
    ) else (
        echo Sample news articles inserted successfully!
    )
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Check frontend: http://localhost:3000/news
echo 2. Check API: http://localhost:5000/api/news
echo.
pause

