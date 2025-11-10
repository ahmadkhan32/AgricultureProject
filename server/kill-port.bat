@echo off
REM Kill process using port 5000
echo ========================================
echo   Kill Process on Port 5000
echo ========================================
echo.
echo Checking for processes on port 5000...

set PORT=5000
if not "%1"=="" set PORT=%1

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo.
    echo Found process %%a using port %PORT%
    taskkill /PID %%a /F
    if errorlevel 1 (
        echo ERROR: Failed to kill process %%a
    ) else (
        echo Success: Process %%a terminated
    )
)

echo.
echo Done! Port %PORT% should now be free.
echo.
pause

