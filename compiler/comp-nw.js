/*
	R3 Water Sample Puzzle
	comp-nw.js
*/

// Get nw-builder compiler
const BUILDER = require('./nwBuilder.js');

function rep(str){
	var res = str;
	const repList = {
		'!0': !0,
		'!1': !1,
		'true': !0,
		'false': !1,
		'--flavor=': '',
		'--platform=': '',
		'--nwVersion=': ''
	}
	Object.keys(repList).forEach(function(cArg){
		res = res.replace(cArg, repList[cArg]);
	});
	return res;
}

// Prepare build flags
process.argv.forEach(function(cArg){

	// Build platform
	if (cArg.indexOf('--platform=') !== -1){
		BUILDER.nwPlatforms = rep(cArg).split(',');
	}

	// NW.js version
	if (cArg.indexOf('--nwVersion=') !== -1){
		BUILDER.nwVersion = rep(cArg);
	}

	// Build flavor
	if (cArg.indexOf('--flavor=') !== -1){
		BUILDER.nwFlavor = rep(cArg);
	}

});

// Check if can start build process
if ([BUILDER.nwFlavor, BUILDER.nwVersion, BUILDER.nwPlatforms].indexOf(void 0) === -1){
	BUILDER.start();
} else {
	throw 'Unable to start nw build process since it\'s missing args!';
}