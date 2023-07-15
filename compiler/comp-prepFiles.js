/*
	R3 Water Sample Puzzle
	prepFiles.js
*/

// Get compiler
const COMPILER = require('./prepare-files.js');

function rep(str){
	var res = str;
	const repList = {
		'!0': !0,
		'!1': !1,
		'true': !0,
		'false': !1,
		'--mainJs=': '',
		'--copyFolders=': '',
		'--jsBeforeMain=': '',
		'--exportJsSample=': '',
		'--cssMinifyLevel=': ''
	}
	Object.keys(repList).forEach(function(cArg){
		res = res.replace(cArg, repList[cArg]);
	});
	return res;
}

var argCounter = 0;

// Process flags
process.argv.forEach(function(cArg){

	// Main JS file
	if (cArg.indexOf('--mainJs=') !== -1){
		COMPILER.mainJsFile = rep(cArg);
		argCounter++;
	}

	// Copy folders
	if (cArg.indexOf('--copyFolders=') !== -1){
		COMPILER.copyFolders = rep(cArg).split(',');
		argCounter++;
	}

	// JS files before main script
	if (cArg.indexOf('--jsBeforeMain=') !== -1){
		COMPILER.jsScriptsBeforeMain = rep(cArg).split(',');
		argCounter++;
	}

	// CSS Minify Level
	if (cArg.indexOf('--cssMinifyLevel=') !== -1){
		COMPILER.cssMinifyLevel = Number(rep(cArg));
		argCounter++;
	}

});

// Start process
if (argCounter > 3){
	COMPILER.prepareFiles();
} else {
	throw 'Unable to start nw build process since it\'s missing args!';
}