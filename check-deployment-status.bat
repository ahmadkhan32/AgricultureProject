@echo off
echo ========================================
echo UCAEP Website - Deployment Status Checker
echo ========================================
echo.

echo This script will help you check the status of your deployments.
echo Please have your deployment URLs ready.
echo.

echo ========================================
echo Step 1: Check Railway Backend Status
echo ========================================
echo.
echo 1. Go to: https://railway.app
echo 2. Sign in with your GitHub account
echo 3. Find your project in the dashboard
echo 4. Check deployment status:
echo    - Green = Success
echo    - Red = Failed
echo    - Yellow = In Progress
echo.
echo 5. Test your backend URL:
echo    https://your-railway-url.railway.app/api/health
echo.
echo Expected result: JSON response with status "OK"
echo.

echo ========================================
echo Step 2: Check Vercel Frontend Status
echo ========================================
echo.
echo 1. Go to: https://vercel.com
echo 2. Sign in with your GitHub account
echo 3. Find your project in the dashboard
echo 4. Check deployment status:
echo    - Ready = Success
echo    - Failed = Failed
echo    - Building = In Progress
echo.
echo 5. Test your frontend URL:
echo    https://your-vercel-url.vercel.app
echo.
echo Expected result: Website loads without errors
echo.

echo ========================================
echo Step 3: Check Integration
echo ========================================
echo.
echo 1. Open your Vercel URL in browser
echo 2. Open Developer Tools (F12)
echo 3. Check Console tab:
echo    - No JavaScript errors
echo    - No CORS errors
echo    - No network errors
echo.
echo 4. Check Network tab:
echo    - API calls are made to Railway backend
echo    - API calls return 200 status
echo    - No failed requests
echo.

echo ========================================
echo Step 4: Common Issues and Solutions
echo ========================================
echo.

echo Issue 1: Railway Backend Not Working
echo ----------------------------------------
echo Symptoms:
echo - Health check returns 404 or error
echo - API endpoints don't respond
echo - Build failed in Railway dashboard
echo.
echo Solutions:
echo 1. Check Railway build logs for errors
echo 2. Verify environment variables are set
echo 3. Check if all dependencies are in package.json
echo 4. Try redeploying from Railway dashboard
echo.

echo Issue 2: Vercel Frontend Not Working
echo ----------------------------------------
echo Symptoms:
echo - Frontend URL shows 404 or error
echo - Build failed in Vercel dashboard
echo - Pages don't load correctly
echo.
echo Solutions:
echo 1. Check Vercel build logs for errors
echo 2. Verify vercel.json configuration
echo 3. Check if all dependencies are in package.json
echo 4. Try redeploying from Vercel dashboard
echo.

echo Issue 3: Integration Problems
echo ----------------------------------------
echo Symptoms:
echo - CORS errors in browser console
echo - API calls fail
echo - Frontend can't connect to backend
echo.
echo Solutions:
echo 1. Check CORS configuration in server
echo 2. Verify API URL is correct in vercel.json
echo 3. Check if both services are running
echo 4. Test API endpoints directly
echo.

echo ========================================
echo Step 5: Quick Fix Commands
echo ========================================
echo.

echo If you need to fix issues:
echo.
echo 1. Check if your code is committed:
echo    git status
echo.
echo 2. Commit any changes:
echo    git add .
echo    git commit -m "Fix deployment issues"
echo    git push origin main
echo.
echo 3. Check deployment platforms:
echo    - Railway: https://railway.app
echo    - Vercel: https://vercel.com
echo.
echo 4. Test endpoints:
echo    - Backend: https://your-railway-url.railway.app/api/health
echo    - Frontend: https://your-vercel-url.vercel.app
echo.

echo ========================================
echo Status Check Complete!
echo ========================================
echo.
echo If you find any issues, check the DEPLOYMENT_STATUS_CHECKER.md for detailed solutions.
echo.

pause
