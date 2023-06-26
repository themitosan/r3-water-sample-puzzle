/*
	R3 Water Sample Puzzle
	prepFiles.js
*/

// Get compiler
var COMPILER = require('./compiler/prepare-files.js');

// Set folders to be transfered
COMPILER.copyFolders = ['img'];

// Set JS data
COMPILER.jsScriptsBeforeMain = ['systemjs.js', 'named-register.min.js'];
COMPILER.mainJsFile = 'app.js';

// Set minifier data
COMPILER.cssMinifyLevel = 2;

// Start process
COMPILER.prepareFiles();