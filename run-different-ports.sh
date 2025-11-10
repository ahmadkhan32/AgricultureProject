#!/bin/bash

echo "========================================"
echo "UCAEP Website - Running on Different Ports"
echo "========================================"
echo ""
echo "Backend Server: http://localhost:5001"
echo "Frontend Client: http://localhost:3001"
echo ""
echo "Starting both servers..."
echo ""

# Set environment variables for different ports
export SERVER_PORT=5001
export CLIENT_PORT=3001
export REACT_APP_API_URL=http://localhost:5001/api

# Start server on port 5001 in background
cd server
PORT=5001 FRONTEND_URL=http://localhost:3001 CORS_ORIGIN=http://localhost:3001,http://localhost:3000 npm run dev &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 3

# Start client on port 3001 in background
cd client
PORT=3001 REACT_APP_API_URL=http://localhost:5001/api npm start &
CLIENT_PID=$!
cd ..

echo ""
echo "========================================"
echo "Both servers are starting..."
echo "========================================"
echo ""
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "kill $SERVER_PID $CLIENT_PID; exit" INT TERM
wait

