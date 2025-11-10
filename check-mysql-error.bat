@echo off
echo ============================================
echo MySQL Error Log Viewer
echo ============================================
echo.

echo Checking for MySQL error log...
echo.

if exist "C:\xampp\mysql\data\*.err" (
    echo Found MySQL error log(s):
    echo.
    for %%f in ("C:\xampp\mysql\data\*.err") do (
        echo File: %%f
        echo --------------------------------------------
        powershell -Command "Get-Content '%%f' -Tail 30"
        echo.
        echo --------------------------------------------
        echo.
    )
) else (
    echo No error log found at C:\xampp\mysql\data\*.err
    echo.
    echo Please check:
    echo 1. XAMPP is installed at C:\xampp
    echo 2. MySQL has attempted to start at least once
    echo 3. Check XAMPP Control Panel - Logs button
)

echo.
echo ============================================
echo Checking Port 3306...
echo ============================================
echo.
netstat -ano | findstr :3306
if %errorlevel% == 0 (
    echo.
    echo WARNING: Port 3306 is in use!
    echo Find the PID (last number) and kill it with:
    echo taskkill /F /PID [PID_NUMBER]
) else (
    echo Port 3306 is free - OK
)

echo.
echo ============================================
echo Next Steps:
echo ============================================
echo 1. Review the error log above
echo 2. Check for port conflicts
echo 3. Try the fixes in QUICK_FIX_MYSQL_SHUTDOWN.md
echo.
pause

