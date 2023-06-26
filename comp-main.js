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

// Set NW.js data 
COMPILER.nwVersion = '0.77.0';
COMPILER.nwFlavor = 'normal';

// Start process
COMPILER.run();