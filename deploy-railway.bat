@echo off
echo ========================================
echo UCAEP Backend Railway Deployment Helper
echo ========================================
echo.

echo Step 1: Ensure your code is committed to GitHub
echo.
git status
echo.
echo If you have uncommitted changes, please commit them first:
echo git add .
echo git commit -m "Prepare for Railway deployment"
echo git push origin main
echo.

echo Step 2: Go to Railway Dashboard
echo.
echo 1. Visit: https://railway.app
echo 2. Sign in with GitHub
echo 3. Click "New Project"
echo 4. Select "Deploy from GitHub repo"
echo 5. Choose your repository
echo.

echo Step 3: Configure Environment Variables
echo.
echo Add these environment variables in Railway:
echo.
echo SUPABASE_URL=https://nzsydskdetneulvvpqxn.supabase.co
echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM
echo SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
echo JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
echo NODE_ENV=production
echo PORT=5000
echo.

echo Step 4: Test Your Deployment
echo.
echo After deployment, test these URLs:
echo - Health Check: https://your-railway-url.railway.app/api/health
echo - News API: https://your-railway-url.railway.app/api/news
echo.

echo Step 5: Update Frontend
echo.
echo Update REACT_APP_API_URL in Vercel to your Railway backend URL
echo.

pause
