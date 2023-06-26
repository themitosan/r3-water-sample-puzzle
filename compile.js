/*
	R3 Water Sample Puzzle
	compile.js

	This script was based on another top-secret-project™ from TheMitoSan.
*/

module.exports = {

	/*
		Compiler variables
	*/

	// NW.js variables
	nwFlavor: void 0,
	nwVersion: void 0,

	// JS variables
	mainJsFile: void 0,
	jsScriptsBeforeMain: [],

	// CSS variables
	cssMinifyLevel: 1,

	// HTML variables
	htmlMinifyOptions: {
		removeComments: !0,
		useShortDoctype: !0,
		collapseWhitespace: !0,
		removeAttributeQuotes: !0
	},

	/*
		Compiler Data
	*/

	// Get JSON file
	packageJson: require('./package.json'),

	// Require modules
	cleanCss: require('clean-css'),
	uglifyJs: require('uglify-js'),
	nwBuilder: require('nw-builder'),
	htmlMinify: require('html-minifier').minify,

	// Start compiler
	run: async function(){

		// Get main data
		var buildHash = '',
			date = new Date,
			fs = require('fs'),
			uglify = this.uglifyJs,
			mainJsFile = this.mainJsFile,
			packageJson = this.packageJson,
			jsScriptsBeforeMain = this.jsScriptsBeforeMain;
		
		// Check if hash.inc exists
		if (fs.existsSync('./hash.inc') !== !0){
			fs.writeFileSync('./hash.inc', '', 'utf8');
		}
		buildHash = fs.readFileSync('./hash.inc', 'utf8');

		/*
			Create tempApp dir
		*/

		// Check if tempApp folder exists
		if (fs.existsSync('./tempApp') !== !0){
			await fs.mkdirSync('./tempApp');
		}

		// Copy img dir
		await fs.cp('./App/img', './tempApp/img', { recursive: !0, force: !0 }, function(err){
			if (err) { console.error(err); }
		});

		// Check if node_modules dir exists
		if (fs.existsSync('./App/node_modules') === !0){
			await fs.cp('./App/node_modules', './tempApp/node_modules', { recursive: !0, force: !0 }, function(err){
				if (err) { console.error(err); }
			});
		}

		/*
			Update package.json
		*/

		// Get run data
		nwFlavor = this.nwFlavor;
		nwVersion = this.nwVersion;

		// Update package.json
		if (buildHash.length !== 0){
			packageJson.hash = buildHash.slice(0, 6);
		}
		packageJson.scripts = void 0;
		packageJson.main = 'index.htm';
		packageJson.dependencies = void 0;
		packageJson.devDependencies = void 0;
		packageJson.window.icon = 'img/icon.png';

		// Update package.json and remove inc file
		await fs.writeFileSync('./tempApp/package.json', JSON.stringify(packageJson), 'utf8');
		await fs.unlinkSync('hash.inc');

		/*
			Minify files
		*/

		/*
			JS
		*/

		// Process JS
		var tempJsScripts = '<div class="none" id="APP_SCRIPT_LIST">',
			mainHtmlFile = fs.readFileSync(`./App/index.htm`, 'utf8'),
			readAppJsFile = fs.readFileSync(`./App/js/${mainJsFile}`, 'utf8');

		// Get main HTML file
		const jsHtmlStart = mainHtmlFile.slice(0, mainHtmlFile.indexOf('<!-- APP_SCRIPT_START -->')),
			jsHtmlEnd = mainHtmlFile.slice((mainHtmlFile.indexOf('<!-- APP_SCRIPT_END -->') + 23));
		
		// Process scripts before main module
		jsScriptsBeforeMain.forEach(function(cFile){
			tempJsScripts = `${tempJsScripts}<script type="text/javascript">${fs.readFileSync(`./App/js/${cFile}`, 'utf8')}</script>`;
		});

		// Add main module and start script
		tempJsScripts = `${tempJsScripts}<script type="module">${uglify.minify(readAppJsFile).code}</script>`;

		// Wrap JS section
		mainHtmlFile = `${jsHtmlStart}\n${tempJsScripts}</div>${jsHtmlEnd}`;

		/*
			CSS
		*/

		// Minify css
		const cleanCssData = new this.cleanCss({ level: this.cssMinifyLevel }).minify(fs.readFileSync('./App/css/style.css', 'utf8'));
		
		// Update HTML
		mainHtmlFile = mainHtmlFile.replace('<link rel="stylesheet" type="text/css" href="css/style.css">', `<style type="text/css">${cleanCssData.styles}</style>`);

		/*
			HTML
		*/

		// Minify HTML file
		mainHtmlFile = this.htmlMinify(mainHtmlFile, this.htmlMinifyOptions);

		// Write new index file
		await fs.writeFileSync('./tempApp/index.htm', mainHtmlFile, 'utf8');

		/*
			Setup nw-builder
		*/

		// Log data before builder setup
		console.info(`INFO - Running compiler\n\nVersion: ${this.nwVersion}\nFlavor: ${this.nwFlavor}`);

		// Setup nw-builder
		const compileData = new this.nwBuilder({

			// Main metadata
			appName: packageJson.name,
			appVersion: packageJson.version,

			// Running mode
			zip: !0,
			arch: 'x64',
			mode: 'build',
			ourDir: './Build/',
			srcDir: './tempApp',
			platforms: ['win64'],
			files: './tempApp/**/*',

			// Set flavor and version
			flavor: nwFlavor,
			version: nwVersion,

			// Windows settings
			winIco: './App/img/icon.ico',
			winVersionString: {
				'CompanyName': packageJson.author,
				'ProductName': packageJson.appName,
				'ProductShortName': packageJson.name,
				'CompanyShortName': packageJson.author,
				'FileDescription': packageJson.description,
				'FileVersion': `Ver. ${packageJson.version}, nwjs: ${nwVersion}`,
				'LegalCopyright': `2023, ${date.getFullYear()} - ${packageJson.author}`
			}

		});

		try {

			// Create new hash file
			fs.writeFileSync('hash.inc', '', 'utf8');
			
			// Run nw-builder
			compileData.build().then(function(){
			
				// Copy required files to build dir
				fs.writeFileSync('./version.txt', `Version: ${packageJson.version}`, 'utf8');
				fs.writeFileSync(`./build/${packageJson.name}/win64/version.txt`, `Version: ${packageJson.version}`, 'utf8');

				// Remove tempApp dir
				fs.rmSync('./tempApp', { force: !0, recursive: !0 });

			});

		} catch (err) {

			// Display error
			throw new Error(err);

		}

	}

};