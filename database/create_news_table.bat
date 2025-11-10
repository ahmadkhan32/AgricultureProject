@echo off
echo ============================================
echo NEWS TABLE CREATION SCRIPT
echo ============================================
echo.
echo This script will help you create the news table
echo Please make sure:
echo 1. MySQL/XAMPP is running
echo 2. Database 'ucaep_db' exists
echo 3. Users table exists
echo.
pause

echo.
echo Opening phpMyAdmin...
echo.
echo MANUAL STEPS:
echo 1. phpMyAdmin will open in your browser
echo 2. Select database: ucaep_db
echo 3. Click "SQL" tab
echo 4. Copy the SQL from: database\create_news_table_phpmyadmin.sql
echo 5. Paste into SQL tab
echo 6. Click "Go"
echo.
pause

start http://localhost/phpmyadmin

echo.
echo SQL file location: database\create_news_table_phpmyadmin.sql
echo.
pause

