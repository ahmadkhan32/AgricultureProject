@echo off
REM ============================================
REM MySQL Quick Access Batch File
REM Double-click to connect to MySQL
REM ============================================

echo.
echo ========================================
echo   Connecting to MySQL Database
echo ========================================
echo.

REM Navigate to MySQL bin folder
cd /d C:\xampp\mysql\bin

REM Check if MySQL exists
if not exist "mysql.exe" (
    echo ERROR: MySQL not found at C:\xampp\mysql\bin
    echo Please check your XAMPP installation path
    pause
    exit
)

REM Connect to ucaep_db database
mysql -u root -p ucaep_db

pause

