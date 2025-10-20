@echo off
echo ========================================
echo UCAEP Website - Deployment Testing
echo ========================================
echo.

echo Please provide your deployment URLs:
echo.
set /p FRONTEND_URL="Enter your Vercel frontend URL (e.g., https://your-app.vercel.app): "
set /p BACKEND_URL="Enter your Railway backend URL (e.g., https://your-app.railway.app): "
echo.

echo ========================================
echo Testing Backend Health Check
echo ========================================
echo.
echo Testing: %BACKEND_URL%/api/health
curl -s -o nul -w "HTTP Status: %%{http_code}\nResponse Time: %%{time_total}s\n" "%BACKEND_URL%/api/health"
echo.

echo ========================================
echo Testing Backend API Endpoints
echo ========================================
echo.
echo Testing News API...
curl -s -o nul -w "News API - HTTP Status: %%{http_code}\n" "%BACKEND_URL%/api/news"
echo.

echo Testing Producers API...
curl -s -o nul -w "Producers API - HTTP Status: %%{http_code}\n" "%BACKEND_URL%/api/producers"
echo.

echo Testing Services API...
curl -s -o nul -w "Services API - HTTP Status: %%{http_code}\n" "%BACKEND_URL%/api/services"
echo.

echo ========================================
echo Testing CORS Configuration
echo ========================================
echo.
echo Testing CORS preflight request...
curl -s -o nul -w "CORS Preflight - HTTP Status: %%{http_code}\n" -X OPTIONS "%BACKEND_URL%/api/health" -H "Origin: %FRONTEND_URL%" -H "Access-Control-Request-Method: GET"
echo.

echo ========================================
echo Frontend Testing Instructions
echo ========================================
echo.
echo 1. Open your browser and go to: %FRONTEND_URL%
echo.
echo 2. Open Developer Tools (F12) and check:
echo    - Console tab for any JavaScript errors
echo    - Network tab for failed API calls
echo    - Application tab for local storage
echo.
echo 3. Test the following pages:
echo    - Home page loads correctly
echo    - Navigation works between pages
echo    - News page loads and displays content
echo    - Producers page loads and displays content
echo    - Services page loads and displays content
echo    - Contact page loads and form works
echo.
echo 4. Test responsive design:
echo    - Resize browser window
echo    - Test on mobile device or mobile view
echo.
echo 5. Test API integration:
echo    - Check if data loads from backend
echo    - Test form submissions
echo    - Verify no CORS errors in console
echo.

echo ========================================
echo Performance Testing
echo ========================================
echo.
echo Open your browser and go to: %FRONTEND_URL%
echo.
echo Use these tools for performance testing:
echo 1. Chrome DevTools Lighthouse tab
echo 2. GTmetrix.com - Test URL: %FRONTEND_URL%
echo 3. WebPageTest.org - Test URL: %FRONTEND_URL%
echo.

echo ========================================
echo Security Testing
echo ========================================
echo.
echo Test the following security aspects:
echo 1. HTTPS is enabled on both frontend and backend
echo 2. No sensitive data in browser console
echo 3. CORS is properly configured
echo 4. API endpoints require proper authentication (if applicable)
echo.

echo ========================================
echo Testing Complete!
echo ========================================
echo.
echo If all tests pass, your deployment is successful!
echo If you encounter issues, check the TESTING_GUIDE.md for solutions.
echo.

pause
