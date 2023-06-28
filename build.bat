@echo off
cls 
echo.
echo Running compiler - please wait...
echo.
echo IMPORTANT: Make sure to have node.js installed before running this script!
echo You can get it here: https://nodejs.org/
echo.
node comp-prepFiles.js
node comp-main.js
echo.
exit