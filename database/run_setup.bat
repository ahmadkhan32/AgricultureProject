@echo off
echo ========================================
echo UCAEP Database Setup
echo ========================================
echo.
echo This will setup your MySQL database
echo.
echo Make sure XAMPP MySQL is running!
echo.
pause

cd /d "%~dp0"

echo.
echo Step 1: Connecting to MySQL...
echo.
echo Please enter MySQL root password (or press Enter if no password):
echo.

mysql -u root -p < setup_database.sql

if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database setup completed!
    echo ========================================
    echo.
    echo You can now:
    echo 1. Open phpMyAdmin: http://localhost/phpmyadmin
    echo 2. Select database: ucaep_db
    echo 3. View your tables and data
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR! Setup failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. XAMPP MySQL is running
    echo 2. MySQL root password is correct
    echo 3. Database folder path is correct
    echo.
    echo Try running manually in phpMyAdmin instead!
    echo.
)

pause

