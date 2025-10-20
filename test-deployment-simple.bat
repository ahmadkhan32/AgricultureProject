@echo off
echo ========================================
echo UCAEP Website - Simple Deployment Test
echo ========================================
echo.

echo This script will help you test your deployed application.
echo Please have your deployment URLs ready.
echo.

echo ========================================
echo Step 1: Test Backend Health
echo ========================================
echo.
echo Open your browser and go to:
echo https://your-railway-url.railway.app/api/health
echo.
echo Expected result: JSON response with status "OK"
echo.
echo If you see an error, check:
echo 1. Is your Railway backend deployed?
echo 2. Are the environment variables set correctly?
echo 3. Is the server running?
echo.

echo ========================================
echo Step 2: Test Backend API Endpoints
echo ========================================
echo.
echo Test these URLs in your browser:
echo.
echo 1. News API:
echo    https://your-railway-url.railway.app/api/news
echo.
echo 2. Producers API:
echo    https://your-railway-url.railway.app/api/producers
echo.
echo 3. Services API:
echo    https://your-railway-url.railway.app/api/services
echo.
echo Expected result: JSON arrays (may be empty)
echo.

echo ========================================
echo Step 3: Test Frontend
echo ========================================
echo.
echo 1. Open your Vercel frontend URL in browser
echo    https://your-vercel-url.vercel.app
echo.
echo 2. Open Developer Tools (F12)
echo.
echo 3. Check Console tab for errors:
echo    - No JavaScript errors
echo    - No CORS errors
echo    - No network errors
echo.
echo 4. Check Network tab:
echo    - API calls are made to backend
echo    - API calls return 200 status
echo    - No failed requests
echo.

echo ========================================
echo Step 4: Test Page Navigation
echo ========================================
echo.
echo Test these pages:
echo.
echo 1. Home page - loads correctly
echo 2. News page - loads and shows content
echo 3. Producers page - loads and shows content
echo 4. Services page - loads and shows content
echo 5. About page - loads correctly
echo 6. Contact page - loads and form works
echo.

echo ========================================
echo Step 5: Test Responsive Design
echo ========================================
echo.
echo 1. Resize browser window to mobile size
echo 2. Check if layout adapts properly
echo 3. Test navigation on mobile
echo 4. Test on actual mobile device
echo.

echo ========================================
echo Step 6: Test Performance
echo ========================================
echo.
echo 1. Open Chrome DevTools
echo 2. Go to Lighthouse tab
echo 3. Run Performance audit
echo 4. Check for performance issues
echo.

echo ========================================
echo Step 7: Test Forms and Interactions
echo ========================================
echo.
echo 1. Go to Contact page
echo 2. Fill out contact form
echo 3. Submit form
echo 4. Check if submission works
echo 5. Test other interactive elements
echo.

echo ========================================
echo Testing Complete!
echo ========================================
echo.
echo If all tests pass, your deployment is successful!
echo If you encounter issues, check the MANUAL_TESTING_CHECKLIST.md for solutions.
echo.

pause
