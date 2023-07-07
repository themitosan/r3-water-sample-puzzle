/*
	R3 Water Sample Puzzle
	nwBuilder.js
*/

module.exports = {

    /*
        Variables
    */
    nwFlavor: void 0,
    nwVersion: void 0,
	nwPlatforms: void 0,
        
    // Modules
    nwBuilder: require('nw-builder'),

	// Get JSON file
	packageJson: require('../package.json'),

	// Start nw-builder
	start: function(){

		// Update process location
		process.cwd('../');

        // Get modules
        const date = new Date,
            fs = require('fs'),
            pJson = this.packageJson,
            cPlatforms = this.nwPlatforms;

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
			files: './tempApp/**/*',

			// Set flavor, version and platforms
			flavor: this.nwFlavor,
			platforms: cPlatforms,
			version: this.nwVersion,

			// Windows settings
			winIco: './tempApp/img/icon.ico',
			winVersionString: {
				'CompanyName': pJson.author,
				'ProductName': pJson.appName,
				'ProductShortName': pJson.name,
				'CompanyShortName': pJson.author,
				'FileDescription': pJson.description,
				'FileVersion': `Ver. ${pJson.version}, nwjs: ${this.nwVersion}`,
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
				cPlatforms.forEach(function(cBuildDir){
					fs.writeFileSync(`./build/${pJson.name}/${cBuildDir}/version.txt`, `Version: ${pJson.version}`, 'utf8');
				});

                // Log status
				console.info('INFO - Process Complete!');

			});

		} catch (err) {

			// Display error
			throw new Error(err);

		}

	}

}