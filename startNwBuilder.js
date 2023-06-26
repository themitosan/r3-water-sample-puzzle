/*
	R3 Water Sample Puzzle
	startNwBuilder.js

	This script was based on another top-secret-project™ from TheMitoSan.
*/

module.exports = {

    /*
        Variables
    */
    nwFlavor: void 0,
    nwVersion: void 0,
        
    // Modules
    nwBuilder: require('nw-builder'),

	// Get JSON file
	packageJson: require('./package.json'),

	// Start nw-builder
	start: function(){

        // Get modules
        const date = new Date,
            fs = require('fs'),
            pJson = this.packageJson;

		/*
			Setup nw-builder
		*/

		// Log data before builder setup
		console.info(`INFO - Running nw-builder\nVersion: ${this.nwVersion}\nFlavor: ${this.nwFlavor}`);

		// Setup nw-builder
		const compileData = new this.nwBuilder({

			// Main metadata
			appName: pJson.name,
			appVersion: pJson.version,

			// Running mode
			zip: !0,
			arch: 'x64',
			mode: 'build',
			ourDir: './Build/',
			srcDir: './tempApp/',
			platforms: ['win64'],
			files: './tempApp/**/*',

			// Set flavor and version
			flavor: nwFlavor,
			version: nwVersion,

			// Windows settings
			winIco: './tempApp/img/icon.ico',
			winVersionString: {
				'CompanyName': pJson.author,
				'ProductName': pJson.appName,
				'ProductShortName': pJson.name,
				'CompanyShortName': pJson.author,
				'FileDescription': pJson.description,
				'FileVersion': `Ver. ${pJson.version}, nwjs: ${nwVersion}`,
				'LegalCopyright': `2023, ${date.getFullYear()} - ${pJson.author}`
			}

		});

		try {

			// Create new hash file
			fs.writeFileSync('./hash.inc', '', 'utf8');
			
			// Run nw-builder
			compileData.build().then(function(){

				// Copy required files to build dir
                console.info('INFO - Copying build version files...');
				fs.writeFileSync('./version.txt', `Version: ${pJson.version}`, 'utf8');
				fs.writeFileSync(`./build/${pJson.name}/win64/version.txt`, `Version: ${pJson.version}`, 'utf8');

                // Log status
				console.info('INFO - Process Complete!');

			});

		} catch (err) {

			// Display error
			throw new Error(err);

		}

	}

}