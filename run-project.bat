@echo off
echo ========================================
echo Starting UCAEP Website Project
echo ========================================
echo.

echo Step 1: Checking dependencies...
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
)

if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    cd ..
)

echo.
echo Step 2: Starting servers...
echo.
echo Client will run on: http://localhost:3000
echo Server will run on: http://localhost:5000
echo.
echo Press CTRL+C to stop both servers
echo.

start "UCAEP Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
start "UCAEP Client" cmd /k "cd client && npm start"

echo.
echo ========================================
echo Both servers are starting in separate windows
echo ========================================
echo.
echo Check the opened windows for status
echo.
pause

