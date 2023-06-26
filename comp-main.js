/*
	R3 Water Sample Puzzle
	comp-main.js
*/

// Get compiler
var COMPILER = require('./compile.js');

// Set folders to be transfered
COMPILER.copyFolders = ['img'];

// Set JS data
COMPILER.jsScriptsBeforeMain = ['systemjs.js', 'named-register.min.js'];
COMPILER.mainJsFile = 'app.js';

// Set minifier data
COMPILER.cssMinifyLevel = 2;

// Start process
COMPILER.prepareFiles(function(){

	// Get nw-builder compiler
	const BUILDER = require('./startNwBuilder.js');

	// Set NW.js data 
	BUILDER.nwVersion = '0.77.0';
	BUILDER.nwFlavor = 'normal';

	// Start nw-builder
	setTimeout(function(){
		BUILDER.start();
	}, 100);

});