@echo off
cls
echo ========================================
echo UCAEP Website - Port Changer
echo ========================================
echo.
echo Current ports:
echo   Backend: 5001
echo   Frontend: 3001
echo.
echo ========================================
echo.

set /p BACKEND_PORT="Enter NEW Backend Port (or press Enter for 5000): "
if "%BACKEND_PORT%"=="" set BACKEND_PORT=5000

set /p FRONTEND_PORT="Enter NEW Frontend Port (or press Enter for 3000): "
if "%FRONTEND_PORT%"=="" set FRONTEND_PORT=3000

echo.
echo ========================================
echo Updating to:
echo   Backend: %BACKEND_PORT%
echo   Frontend: %FRONTEND_PORT%
echo ========================================
echo.

REM Backup files
echo Creating backups...
copy "client\package.json" "client\package.json.bak" >nul 2>&1
copy "package.json" "package.json.bak" >nul 2>&1
copy "run-different-ports.bat" "run-different-ports.bat.bak" >nul 2>&1

REM Update client/package.json proxy using findstr and manual replacement
echo Updating client/package.json...
powershell -Command "$content = Get-Content 'client\package.json' -Raw; $content = $content -replace '\"proxy\": \"http://localhost:\d+\"', '\"proxy\": \"http://localhost:%BACKEND_PORT%\"'; Set-Content 'client\package.json' -Value $content -NoNewline"

REM Update run-different-ports.bat
echo Updating run-different-ports.bat...
(
echo @echo off
echo echo ========================================
echo echo UCAEP Website - Running on Different Ports
echo echo ========================================
echo echo.
echo echo Backend Server: http://localhost:%BACKEND_PORT%
echo echo Frontend Client: http://localhost:%FRONTEND_PORT%
echo echo.
echo echo Starting both servers...
echo echo.
echo.
echo REM Set environment variables for different ports
echo set SERVER_PORT=%BACKEND_PORT%
echo set CLIENT_PORT=%FRONTEND_PORT%
echo set REACT_APP_API_URL=http://localhost:%BACKEND_PORT%/api
echo.
echo REM Start server on port %BACKEND_PORT%
echo start "UCAEP Server (Port %BACKEND_PORT%)" cmd /k "cd /d %%~dp0server && set PORT=%BACKEND_PORT% && set FRONTEND_URL=http://localhost:%FRONTEND_PORT% && set CORS_ORIGIN=http://localhost:%FRONTEND_PORT%,http://localhost:3000 && npm run dev"
echo.
echo REM Wait a moment for server to start
echo timeout /t 3 /nobreak ^>nul
echo.
echo REM Start client on port %FRONTEND_PORT%
echo start "UCAEP Client (Port %FRONTEND_PORT%)" cmd /k "cd /d %%~dp0client && set PORT=%FRONTEND_PORT% && set REACT_APP_API_URL=http://localhost:%BACKEND_PORT%/api && npm start"
echo.
echo echo.
echo echo ========================================
echo echo Both servers are starting...
echo echo ========================================
echo echo.
echo echo Backend: http://localhost:%BACKEND_PORT%
echo echo Frontend: http://localhost:%FRONTEND_PORT%
echo echo.
echo echo Press any key to close this window (servers will continue running)
echo pause ^>nul
) > run-different-ports.bat

echo.
echo ========================================
echo Ports updated successfully!
echo ========================================
echo.
echo New Configuration:
echo   Backend: http://localhost:%BACKEND_PORT%
echo   Frontend: http://localhost:%FRONTEND_PORT%
echo.
echo Next steps:
echo 1. Create server/.env file with: PORT=%BACKEND_PORT%
echo 2. Create client/.env file with:
echo    PORT=%FRONTEND_PORT%
echo    REACT_APP_API_URL=http://localhost:%BACKEND_PORT%/api
echo 3. Run: run-different-ports.bat
echo.
echo Backups saved as: *.bak files
echo.
pause

