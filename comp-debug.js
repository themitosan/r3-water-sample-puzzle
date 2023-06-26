/*
	R3 Water Sample Puzzle
	comp-debug.js
*/

// Get compiler
var COMPILER = require('./compile.js');

// Set JS data
COMPILER.jsScriptsBeforeMain = ['systemjs.js', 'named-register.min.js'];
COMPILER.mainJsFile = 'app.js';

// Set minifier data
COMPILER.cssMinifyLevel = 2;

// Set NW.js data 
COMPILER.nwVersion = '0.77.0';
COMPILER.nwFlavor = 'sdk';

// Start process
COMPILER.run();