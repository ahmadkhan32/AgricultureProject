@echo off
echo ========================================
echo UCAEP Website - Port Configuration Tool
echo ========================================
echo.
echo Current Configuration:
echo   Backend Server: Port 5001
echo   Frontend Client: Port 3001
echo.
echo ========================================
echo.

set /p BACKEND_PORT="Enter Backend Port (default: 5001): "
if "%BACKEND_PORT%"=="" set BACKEND_PORT=5001

set /p FRONTEND_PORT="Enter Frontend Port (default: 3001): "
if "%FRONTEND_PORT%"=="" set FRONTEND_PORT=3001

echo.
echo ========================================
echo New Configuration:
echo   Backend Server: Port %BACKEND_PORT%
echo   Frontend Client: Port %FRONTEND_PORT%
echo ========================================
echo.

REM Update client/package.json proxy
echo Updating client/package.json proxy...
powershell -Command "(Get-Content 'client\package.json') -replace '\"proxy\": \"http://localhost:[0-9]+\"', '\"proxy\": \"http://localhost:%BACKEND_PORT%\"' | Set-Content 'client\package.json'"

REM Update package.json scripts
echo Updating package.json scripts...
powershell -Command "$content = Get-Content 'package.json' -Raw; $content = $content -replace 'server:5001', 'server:%BACKEND_PORT%'; $content = $content -replace 'client:3001', 'client:%FRONTEND_PORT%'; $content = $content -replace 'PORT=5001', 'PORT=%BACKEND_PORT%'; $content = $content -replace 'PORT=3001', 'PORT=%FRONTEND_PORT%'; $content = $content -replace 'localhost:5001', 'localhost:%BACKEND_PORT%'; $content = $content -replace 'localhost:3001', 'localhost:%FRONTEND_PORT%'; Set-Content 'package.json' -Value $content"

REM Update run-different-ports.bat
echo Updating run-different-ports.bat...
powershell -Command "$content = Get-Content 'run-different-ports.bat' -Raw; $content = $content -replace 'SERVER_PORT=5001', 'SERVER_PORT=%BACKEND_PORT%'; $content = $content -replace 'CLIENT_PORT=3001', 'CLIENT_PORT=%FRONTEND_PORT%'; $content = $content -replace 'PORT=5001', 'PORT=%BACKEND_PORT%'; $content = $content -replace 'PORT=3001', 'PORT=%FRONTEND_PORT%'; $content = $content -replace 'localhost:5001', 'localhost:%BACKEND_PORT%'; $content = $content -replace 'localhost:3001', 'localhost:%FRONTEND_PORT%'; Set-Content 'run-different-ports.bat' -Value $content"

echo.
echo ========================================
echo Port configuration updated successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Create server/.env with PORT=%BACKEND_PORT%
echo 2. Create client/.env with PORT=%FRONTEND_PORT% and REACT_APP_API_URL=http://localhost:%BACKEND_PORT%/api
echo 3. Run: run-different-ports.bat
echo.
pause

