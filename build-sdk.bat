::===================================::
::									 ::
::  R3 Water Sample Puzzle			 ::
::  build-sdk.bat				 	 ::
::									 ::
::  Build file for windows 		  	 ::
::									 ::
::===================================::
@echo off
cls
title Running compiler - Please wait... 
echo.
echo Running compiler - Please wait...
echo Flavor: sdk
echo.
echo IMPORTANT: Make sure to have Node.js (20.x) installed before running this script!
echo You can get it here: https://nodejs.org/
echo.
node ./compiler/comp-prepFiles.js --mainJs=app.js --copyFolders=img,tools,forms,node_modules --exportJsSample=!1 --cssMinifyLevel=2 --jsBeforeMain=systemjs.js,named-register.min.js
node ./compiler/comp-nw.js --platform=win64 --flavor=sdk --nwVersion=0.77.0
title Process complete!
echo.
pause
exit