@echo off
echo ========================================
echo UCAEP Website - Running on Different Ports
echo ========================================
echo.
echo Backend Server: http://localhost:5001
echo Frontend Client: http://localhost:3002
echo.
echo Starting both servers...
echo.

REM Set environment variables for different ports
set SERVER_PORT=5001
set CLIENT_PORT=3002
set REACT_APP_API_URL=http://localhost:5001/api

REM Start server on port 5001
start "UCAEP Server (Port 5001)" cmd /k "cd /d %~dp0server && set PORT=5001 && set FRONTEND_URL=http://localhost:3002 && set CORS_ORIGIN=http://localhost:3002,http://localhost:3000 && npm run dev"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Start client on port 3002
start "UCAEP Client (Port 3002)" cmd /k "cd /d %~dp0client && set PORT=3002 && set REACT_APP_API_URL=http://localhost:5001/api && npm start"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo.
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3002
echo.
echo Press any key to close this window (servers will continue running)
pause >nul

