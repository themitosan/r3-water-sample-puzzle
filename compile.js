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

	// Folder options
	copyFolders: [],

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
	fs: require('fs'),
	util: require('util'),
	cleanCss: require('clean-css'),
	uglifyJs: require('uglify-js'),
	htmlMinify: require('html-minifier').minify,

	/*
		Step processor
	*/

	// Start compiler
	prepareFiles: async function(cb){

		console.clear();

		// Get main data
		var fs = this.fs,
			buildHash = '',
			uglify = this.uglifyJs,
			mainJsFile = this.mainJsFile,
			packageJson = this.packageJson,
			jsScriptsBeforeMain = this.jsScriptsBeforeMain;

		/*
			Enhance fs
		*/
		const wFileSync = this.util.promisify(fs.writeFile),
			mkDir = this.util.promisify(fs.mkdir),
			copyFolder = this.util.promisify(fs.cp),
			rmDir = this.util.promisify(fs.rm);

		// Check if hash.inc exists
		if (fs.existsSync('./hash.inc') !== !0){
			await wFileSync('./hash.inc', '', 'utf8');
		}
		buildHash = fs.readFileSync('./hash.inc', 'utf8');

		/*
			Create tempApp dir
		*/

		// Check if tempApp folder exists
		if (fs.existsSync('./tempApp') === !0){
			console.info('INFO - Removing previous temp folder...');
			await rmDir('./tempApp', { force: !0, recursive: !0 });
		}
		await mkDir('./tempApp');

		// Copy folders
		this.copyFolders.forEach(async function(cFolder){
			
			// Check if folder exists
			if (fs.existsSync(`./App/${cFolder}`) === !0){

				console.info(`INFO - Copying folder "${cFolder}" to temp path...`);

				await copyFolder(`./App/${cFolder}`, `./tempApp/${cFolder}`, { recursive: !0, force: !0 }, function(err){
					if (err) { console.error(err); }
				});

			} else {
				console.warn(`WARN - Unable to find "${cFolder}" on project (./App) files!`);
			}

		});

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
		fs.writeFileSync('./tempApp/package.json', JSON.stringify(packageJson), 'utf8');
		fs.unlinkSync('hash.inc');

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
		fs.writeFileSync('./tempApp/index.htm', mainHtmlFile, 'utf8');

		if (typeof cb === 'function'){
			cb();
		}

	}

};