@echo off
echo ========================================
echo UCAEP Website - Fix 404 Deployment Error
echo ========================================
echo.

echo This script will help you fix the 404 deployment error.
echo The main issue is that Vercel is trying to deploy the entire project
echo instead of just the client folder.
echo.

echo ========================================
echo Step 1: Test Client Build
echo ========================================
echo.
echo Testing if client builds successfully...
cd client
npm install
npm run build
echo.

if exist "build\index.html" (
    echo ✅ Client build successful!
    echo Build output exists in client/build
) else (
    echo ❌ Client build failed!
    echo Please check for errors above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Deploy to Vercel (Manual)
echo ========================================
echo.
echo Since the CLI approach isn't working, we'll use the web interface:
echo.
echo 1. Go to: https://vercel.com
echo 2. Sign in with your GitHub account
echo 3. Click "New Project"
echo 4. Import your repository: ahmadkhan32/AgricultureProject
echo 5. IMPORTANT: Set Root Directory to "client"
echo 6. Vercel will auto-detect React app
echo 7. Add these environment variables:
echo.
echo    REACT_APP_API_URL=http://localhost:5000/api
echo    REACT_APP_SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
echo    REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM
echo.
echo 8. Click "Deploy"
echo.

echo ========================================
echo Step 3: Alternative - Create Client Repository
echo ========================================
echo.
echo If the above doesn't work, create a separate repository for client:
echo.
echo 1. Create a new GitHub repository (e.g., "ucaeep-client")
echo 2. Copy the client folder to the new repository
echo 3. Deploy the new repository to Vercel
echo.

echo ========================================
echo Step 4: Test Deployment
echo ========================================
echo.
echo After deployment:
echo 1. Open your Vercel URL in browser
echo 2. Check if the website loads
echo 3. Open Developer Tools (F12)
echo 4. Check Console for errors
echo 5. Check Network tab for API calls
echo.

echo ========================================
echo Why This Fixes the 404 Error
echo ========================================
echo.
echo The 404 error occurs because:
echo 1. Vercel tries to deploy the entire project (client + server)
echo 2. It can't find the correct build output
echo 3. The vercel.json configuration is confusing Vercel
echo.
echo The fix:
echo 1. Deploy only the client folder
echo 2. Set root directory to "client"
echo 3. Let Vercel auto-detect React app
echo 4. This bypasses the problematic vercel.json
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Follow the steps above to deploy your project.
echo The 404 error should be resolved by deploying only the client folder.
echo.

pause
