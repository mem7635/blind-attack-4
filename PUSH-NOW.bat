@echo off
echo ========================================
echo PUSHING TO GITHUB
echo ========================================
echo.
echo Repository: github.com/mem7635/blind-attack-4
echo.
echo When prompted:
echo   Username: mem7635
echo   Password: [Use Personal Access Token or password]
echo.
echo If you don't have a token:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Name: Blind Attack 4
echo 4. Check: repo (full control)
echo 5. Generate and COPY the token
echo 6. Use that token as your password
echo.
pause
echo.
echo Pushing to GitHub...
echo.
git push -u origin main
echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Code pushed to GitHub!
    echo.
    echo NEXT STEPS:
    echo 1. Go to: https://github.com/mem7635/blind-attack-4/settings/pages
    echo 2. Under "Source", select "Deploy from a branch"
    echo 3. Select branch: main
    echo 4. Select folder: / (root^)
    echo 5. Click Save
    echo 6. Wait 1-2 minutes
    echo 7. Visit: https://mem7635.github.io/blind-attack-4
    echo.
) else (
    echo.
    echo FAILED! Check your credentials.
    echo See FIX-AUTH.md for help.
    echo.
)
pause

