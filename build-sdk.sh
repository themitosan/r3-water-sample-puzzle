#===================================#
#									#
#  R3 Water Sample Puzzle			#
#  build-sdk.sh						#
#									#
#  Build file for linux	distros		#
#									#
#===================================#
stty -echo
clear
echo 
echo Running compiler - Please wait...
echo Flavor: sdk
echo 
echo IMPORTANT: Make sure to have Node.js \(20.x\) installed before running this script!
echo You can get it here: https://nodejs.org/
echo 
node ./compiler/comp-prepFiles.js --mainJs=app.js --copyFolders=img,tools,forms,node_modules --cssMinifyLevel=2 --jsBeforeMain=systemjs.js,named-register.min.js
node ./compiler/comp-nw.js --platform=linux64 --flavor=sdk --nwVersion=0.77.0
echo Process complete!
echo 
stty echo
exit