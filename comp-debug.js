/*
	R3 Water Sample Puzzle
	comp-debug.js

	This script was based on another top-secret-project™ from TheMitoSan.
*/

// Get nw-builder compiler
const BUILDER = require('./compiler/nwBuilder.js');

// Set NW.js data 
BUILDER.nwPlatforms = ['win64', 'linux64'];
BUILDER.nwVersion = '0.77.0';
BUILDER.nwFlavor = 'sdk';

// Start nw-builder
BUILDER.start();