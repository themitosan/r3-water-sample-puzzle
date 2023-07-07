#===================================#
#									#
#  R3 Water Sample Puzzle			#
#  build-normal.sh					#
#									#
#  Build file for linux	distros		#
#									#
#===================================#
stty -echo
clear
echo 
echo Running compiler - Please wait...
echo Flavor: normal
echo 
echo IMPORTANT: Make sure to have Node.js \(20.x\) installed before running this script!
echo You can get it here: https://nodejs.org/
echo 
node ./compiler/comp-prepFiles.js --mainJs=app.js --copyFolders=img,tools,forms,node_modules --exportJsSample=!1 --cssMinifyLevel=2 --jsBeforeMain=systemjs.js,named-register.min.js
node ./compiler/comp-nw.js --platform=linux64 --flavor=normal --nwVersion=0.77.0
echo Process complete!
echo 
stty echo
exit