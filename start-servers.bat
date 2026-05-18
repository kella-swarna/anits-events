@echo off
echo 🚀 Starting College Events System...
echo.

echo 📋 Step 1: Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node quick-start.js"

echo 📋 Step 2: Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo 📋 Step 3: Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npx live-server --port=3001"

echo.
echo ✅ Both servers should now be starting!
echo.
echo 📋 Access your application:
echo    Frontend: http://localhost:3001
echo    Backend:  http://localhost:3000
echo    Health:   http://localhost:3000/health
echo.
echo ⚠️  Make sure MongoDB is running!
echo    - Local: Start MongoDB service
echo    - Atlas: Check connection string in backend/.env
echo.
pause
