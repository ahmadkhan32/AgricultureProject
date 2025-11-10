@echo off
echo ============================================
echo MySQL Shutdown Error Fix Script
echo ============================================
echo.

echo [1/6] Checking if port 3306 is in use...
netstat -ano | findstr :3306
if %errorlevel% == 0 (
    echo WARNING: Port 3306 is in use!
    echo Please check the output above for the process ID (PID)
    echo.
    echo To kill the process, run:
    echo taskkill /F /PID [PID_NUMBER]
    echo.
    pause
) else (
    echo Port 3306 is free - OK
)
echo.

echo [2/6] Checking MySQL services...
Get-Service | Where-Object {$_.DisplayName -like "*MySQL*"} | Format-Table
echo.

echo [3/6] Testing MySQL port connection...
powershell -Command "Test-NetConnection -ComputerName localhost -Port 3306"
echo.

echo [4/6] Checking XAMPP MySQL installation...
if exist "C:\xampp\mysql\bin\mysqld.exe" (
    echo MySQL executable found - OK
) else (
    echo ERROR: MySQL not found in C:\xampp\mysql\bin\
    echo Please check your XAMPP installation
)
echo.

echo [5/6] Checking MySQL data directory...
if exist "C:\xampp\mysql\data" (
    echo MySQL data directory exists - OK
) else (
    echo ERROR: MySQL data directory not found
)
echo.

echo [6/6] Checking MySQL error log...
if exist "C:\xampp\mysql\data\*.err" (
    echo MySQL error log found
    echo Please check: C:\xampp\mysql\data\*.err
) else (
    echo No error log found (this is normal if MySQL hasn't started)
)
echo.

echo ============================================
echo Next Steps:
echo ============================================
echo 1. Open XAMPP Control Panel
echo 2. Try starting MySQL
echo 3. If it fails, check the Logs button
echo 4. Review the error messages above
echo.
echo For detailed solutions, see: FIX_MYSQL_SHUTDOWN_ERROR.md
echo.
pause

