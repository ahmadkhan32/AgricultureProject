@echo off
echo ========================================
echo UCAEP Website - GitHub & Vercel Deploy
echo ========================================
echo.

echo Step 1: Checking Git Status...
git status
echo.

echo Step 2: Adding all files...
git add .
echo.

echo Step 3: Committing changes...
git commit -m "Prepare for deployment: Fix database schema and configuration"
echo.

echo Step 4: Do you want to push to GitHub?
echo Enter your GitHub repository URL (or press Enter to skip):
set /p GITHUB_URL=

if not "%GITHUB_URL%"=="" (
    echo Adding remote...
    git remote add origin %GITHUB_URL% 2>nul
    git remote set-url origin %GITHUB_URL%
    
    echo Pushing to GitHub...
    git push -u origin main
    echo.
    echo ✅ Code pushed to GitHub!
) else (
    echo Skipping GitHub push...
)

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Go to https://vercel.com
echo 2. Import your GitHub repository
echo 3. Configure:
echo    - Root Directory: client
echo    - Build: npm run build
echo    - Output: build
echo 4. Add Environment Variables:
echo    - REACT_APP_SUPABASE_URL
echo    - REACT_APP_SUPABASE_ANON_KEY
echo    - REACT_APP_API_URL
echo 5. Click Deploy
echo.
echo ========================================
echo Database Setup:
echo ========================================
echo 1. Go to Supabase Dashboard
echo 2. Open SQL Editor
echo 3. Run database/schema.sql
echo.
echo See QUICK_DEPLOY.md for detailed instructions
echo.
pause

