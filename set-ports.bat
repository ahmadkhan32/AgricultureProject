@echo off
echo ========================================
echo UCAEP Website - Quick Port Setup
echo ========================================
echo.
echo Choose a port configuration:
echo.
echo 1. Default Ports (Backend: 5000, Frontend: 3000)
echo 2. Alternative Ports (Backend: 5001, Frontend: 3001) - Current
echo 3. Custom Ports (You specify)
echo.
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" (
    set BACKEND_PORT=5000
    set FRONTEND_PORT=3000
    goto :update
)
if "%choice%"=="2" (
    set BACKEND_PORT=5001
    set FRONTEND_PORT=3001
    goto :update
)
if "%choice%"=="3" (
    set /p BACKEND_PORT="Enter Backend Port: "
    set /p FRONTEND_PORT="Enter Frontend Port: "
    goto :update
)

echo Invalid choice!
pause
exit

:update
echo.
echo ========================================
echo Updating to:
echo   Backend: %BACKEND_PORT%
echo   Frontend: %FRONTEND_PORT%
echo ========================================
echo.

REM Update client/package.json proxy
echo [1/3] Updating client/package.json...
powershell -Command "(Get-Content 'client\package.json') -replace '\"proxy\": \"http://localhost:[0-9]+\"', '\"proxy\": \"http://localhost:%BACKEND_PORT%\"' | Set-Content 'client\package.json'"

REM Update run-different-ports.bat
echo [2/3] Updating run-different-ports.bat...
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

REM Update package.json scripts
echo [3/3] Updating package.json scripts...
powershell -Command "$json = Get-Content 'package.json' -Raw | ConvertFrom-Json; $json.scripts.'server:5001' = $json.scripts.'server:5001' -replace '5001', '%BACKEND_PORT%' -replace '3001', '%FRONTEND_PORT%'; $json.scripts.'client:3001' = $json.scripts.'client:3001' -replace '5001', '%BACKEND_PORT%' -replace '3001', '%FRONTEND_PORT%'; $json.scripts.'dev:ports' = $json.scripts.'dev:ports' -replace '5001', '%BACKEND_PORT%' -replace '3001', '%FRONTEND_PORT%'; $json | ConvertTo-Json -Depth 10 | Set-Content 'package.json'"

echo.
echo ========================================
echo Port configuration updated!
echo ========================================
echo.
echo Backend: http://localhost:%BACKEND_PORT%
echo Frontend: http://localhost:%FRONTEND_PORT%
echo.
echo To start the project, run: run-different-ports.bat
echo.
echo Note: You may also need to create/update:
echo   - server/.env with PORT=%BACKEND_PORT%
echo   - client/.env with PORT=%FRONTEND_PORT% and REACT_APP_API_URL=http://localhost:%BACKEND_PORT%/api
echo.
pause

