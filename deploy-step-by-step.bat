@echo off
echo ========================================
echo UCAEP Website - Step-by-Step Deployment
echo ========================================
echo.

echo This script will guide you through deploying your application.
echo Please follow each step carefully.
echo.

echo ========================================
echo Step 1: Prepare Your Code
echo ========================================
echo.
echo 1. Make sure all changes are committed:
git status
echo.
echo 2. If you have uncommitted changes, commit them:
echo    git add .
echo    git commit -m "Fix deployment configuration"
echo    git push origin main
echo.
echo Press any key to continue...
pause

echo ========================================
echo Step 2: Deploy Backend to Railway
echo ========================================
echo.
echo 1. Go to: https://railway.app
echo 2. Sign in with your GitHub account
echo 3. Click "New Project"
echo 4. Select "Deploy from GitHub repo"
echo 5. Choose your repository
echo.
echo 6. Set these environment variables in Railway:
echo    SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
echo    SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM
echo    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
echo    JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
echo    NODE_ENV=production
echo    PORT=5000
echo.
echo 7. Wait for Railway deployment to complete
echo 8. Copy your Railway URL (e.g., https://your-project.railway.app)
echo.
echo Press any key to continue...
pause

echo ========================================
echo Step 3: Test Backend
echo ========================================
echo.
echo Test your Railway backend:
echo 1. Go to: https://your-railway-url.railway.app/api/health
echo 2. You should see: {"status": "OK", "message": "UCAEP Server is running"}
echo.
echo If you see an error, check Railway build logs for issues.
echo.
echo Press any key to continue...
pause

echo ========================================
echo Step 4: Update Vercel Configuration
echo ========================================
echo.
echo 1. Open vercel.json in your project
echo 2. Update the REACT_APP_API_URL with your Railway URL:
echo    "REACT_APP_API_URL": "https://your-actual-railway-url.railway.app/api"
echo.
echo 3. Save the file
echo 4. Commit and push changes:
echo    git add vercel.json
echo    git commit -m "Update vercel.json with Railway URL"
echo    git push origin main
echo.
echo Press any key to continue...
pause

echo ========================================
echo Step 5: Deploy Frontend to Vercel
echo ========================================
echo.
echo 1. Go to: https://vercel.com
echo 2. Sign in with your GitHub account
echo 3. Click "New Project"
echo 4. Import your GitHub repository
echo 5. Vercel will use your vercel.json configuration
echo 6. Wait for deployment to complete
echo 7. Copy your Vercel URL (e.g., https://your-project.vercel.app)
echo.
echo Press any key to continue...
pause

echo ========================================
echo Step 6: Update CORS Configuration
echo ========================================
echo.
echo 1. Go back to Railway dashboard
echo 2. Add this environment variable:
echo    FRONTEND_URL=https://your-vercel-url.vercel.app
echo 3. Trigger a new deployment in Railway
echo 4. Wait for deployment to complete
echo.
echo Press any key to continue...
pause

echo ========================================
echo Step 7: Test Integration
echo ========================================
echo.
echo 1. Open your Vercel URL in browser
echo 2. Open Developer Tools (F12)
echo 3. Check Console tab for errors
echo 4. Check Network tab for API calls
echo 5. Test navigation between pages
echo.
echo Expected results:
echo - No JavaScript errors in console
echo - No CORS errors
echo - API calls return 200 status
echo - All pages load correctly
echo.
echo Press any key to continue...
pause

echo ========================================
echo Step 8: Final Verification
echo ========================================
echo.
echo Test these endpoints:
echo.
echo 1. Backend Health Check:
echo    https://your-railway-url.railway.app/api/health
echo.
echo 2. Backend API Endpoints:
echo    https://your-railway-url.railway.app/api/news
echo    https://your-railway-url.railway.app/api/producers
echo    https://your-railway-url.railway.app/api/services
echo.
echo 3. Frontend:
echo    https://your-vercel-url.vercel.app
echo.
echo 4. Test CORS:
echo    Open browser console and check for CORS errors
echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo If all tests pass, your deployment is successful!
echo If you encounter issues, check the troubleshooting guides:
echo - DEPLOYMENT_CONFIGURATION_FIX.md
echo - TROUBLESHOOTING_GUIDE.md
echo.

pause
