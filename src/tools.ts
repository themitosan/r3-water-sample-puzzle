/*
	R3 Auto Map Gen.
	tools.js
*/

declare var nw: any;
declare var TMS: any;
declare var APP: any;

// Solve Hex
export function solveHex(hex:string){
	var res = '';
	if (hex !== void 0){
		res = hex.toLowerCase().replace(RegExp(' ', 'gi'), '');
	}
	return res;
}

// Unsolve Hex
export function unsolveHex(hex:string){
	var res = '';
	if (hex !== void 0){
		res = hex.toUpperCase().match(/.{2,2}/g)!.toString().replace(RegExp(',', 'gi'), ' ')
	}
	return res;
}

// Parse endian values
export function parseEndian(hex:string){
	return hex.match(/.{2,2}/g)!.reverse().toString().replace(RegExp(',', 'gi'), '');
}

// Convert Hex values to UTF-8 string
export function convertHexToUft8(hex:string){

	var textValue = '';
	if (hex !== ''){
		textValue = decodeURIComponent('%' + hex.match(/.{2,2}/g)!.join('%'));
	}

	return textValue;

}

// Parse percentage
export function parsePercentage(current:number, maximum:number){

	var res = 0;
	if (current !== void 0 && maximum !== void 0){
		res = Math.floor((current / maximum) * 100);
	}

	return res;

}

// Parse positive
export function parsePositive(n:number){

	var res = ((n - n) - n);
	if (res < 0){
		res = ((res - res) - res);
	}
	return res;

}

// Parse negative
export function parseNegative(n:number){

	var res = ((n - n) - n);
	if (res > -1){
		res = ((res - res) - res);
	}

	return res;

}

// Fix paths
export function fixPath(path:string){
	var res = '';
	if (path !== ''){
		res = path.replace(RegExp('\\\\', 'gi'), '/');
	}
	return res;
}

/*
	Remove HTML from string
	Original regex: https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/
*/
export function removeHTML(str:string){
	if (str !== void 0 && str !== ''){
		return str.replace(/(<([^>]+)>)/gi, '');
	}
}

// Convert array to string breaking lines
export function convertArrayToString(str:string){
	var res = '';
	if (str !== ''){
		res = str.toString().replace(RegExp(',', 'gi'), '\n');
	}
	return res;
}

// Remove values from string
export function cleanString(str:string, arr:string[]){

	var res = str;
	arr.forEach(function(rep){
		res = res.replace(RegExp(rep, 'gi'), '');
	});
	return res;

}

/*
	Fix vars [NEEDS TESTING]
	This function was obtained from R3V2 API

	https://github.com/themitosan/R3ditor-v2
*/
export function fixVars(input:string, size:number = 2, filler:string = '0'){

	if (input.length < size){

		while (input.length !== size){
			input = filler + input;
		}

	} else {

		if (input.length !== size && input.toString().length > size){
			input = input.slice(0, size);
		}

	}

	return input;

}

// Fix JSON quotes
export function fixJson(data:string){
	return data.replace(RegExp("'", 'gi'), '"');
}

// Clean function
export function cleanFn(fnStr:string){
	return fnStr.replace(RegExp('\n', 'gi'), ' ').replace(RegExp('	', 'gi'), '');
}

// Prompt - a simple way to handle window.prompt call
export function winMsg(msg:string){

	return new Promise(function(resolve, reject){

		var res = window.prompt(msg),
			errorReason: string[] = [],
			pushError = function(errData: string){
				errorReason.push(errData);
			};

		if (res === null){
			pushError('User canceled action');
		}

		if (res === ''){
			pushError('User didn\'t provided any data on textbox');
		}

		if (errorReason.length !== 0){
			resolve(res);
		} else {
			reject(errorReason.toString().replace(RegExp(',', 'gi'), '\n'));
		}

	});

}

// Confirm - a simple way to handle window.confirm call
export function confirm(msg:string){

	return new Promise(function(resolve, reject){

		var res = window.confirm(msg),
			errorReason: string[] = [],
			pushError = function(errData: string){
				errorReason.push(errData);
			};

		if (res === null){
			pushError('User canceled action');
		}

		if (errorReason.length !== 0){
			resolve(res);
		} else {
			reject(errorReason.toString().replace(RegExp(',', 'gi'), '\n'));
		}

	});

}

// Get all files from dir / subdir (require node.js) 
export function getDirFiles(dir:string){

	// Variables
    var res: string[] = [],
    	fixPath = APP.tools.fixPath;

    // Main process
    const gFileProcess = function(path:string){

    	/*
    		Require modules individually.
    		They will not be linked to main object due compat with other softwares
    	*/
    	const module_fs = require('fs'),
    		module_path = require('path');

    	// Read dir
    	module_fs.readdirSync(fixPath(path)).forEach(function(cFile:string){

		    var ret,
		    	abs = module_path.join(path, cFile);

		    if (module_fs.statSync(abs).isDirectory()){
		        ret = gFileProcess(abs);
		    } else {
		        ret = res.push(fixPath(abs));
		    }

			return ret;

		});

    }

    // Run process
    gFileProcess(dir);

    // End
    return res;

}

// Check online status
export async function checkOnlineStatus(url:string){

	try {

		if (url === void 0 || url === ''){
			url = 'https://google.com/';
		}

		var fetchTest = await fetch(url);
		return Number(fetchTest.status) > 199 && Number(fetchTest.status) < 300;

	} catch (err){
		return !1;
	}

}

// Parse value polarity
export function parsePolarity(value:number){
	return value - value - value;
}

// Process checkbox status
export function processCheckbox(domName:string, callback:Function){

	var res = !1,
		domCheckbox = (<HTMLInputElement>document.getElementById(domName));

	if (domCheckbox.checked === !1){
		res = !0;
	}

	domCheckbox.checked = res;

	if (typeof callback === 'function'){
		callback();
	}

}

/*
	 Fix DOM number

	 data: Object
	 	domName: 	String 	- DOM ID name
	 	def: 		Number 	- Default number if data is invalid
	 	min: 		Number 	- Default number if data is lower than allowed
	 	max: 		Number 	- Default number if data is higher than allowed
	 	maxLength 	Number 	- Max characters allowed on input field
*/
export function fixDomNumber(data: { domName:string, def:number, min:number, max:number, maxLength:number }){

	if (document.getElementById(data.domName) !== null){

		const cDom = document.getElementById(data.domName) as HTMLInputElement,
			cValue = cDom.value;
	
		if (data.maxLength < 0){
			data.maxLength = cDom.value.length;
		}

		if (Number.isNaN(cValue) === !0){
			cDom.value = Number(data.def).toString();
		}
		if (Number(cValue) < data.min){
			cDom.value = Number(data.min).toString();
		}
		if (Number(cValue) > data.max){
			cDom.value = Number(data.max).toString();
		}
		if (cDom.value.length > data.maxLength){
			cDom.value = cDom.value.slice(0, data.maxLength);
		}

	}

}

/*
	TMS Color Picker

	data: Object

		location: 			Object 		- Define where it should spawn
			spawnLocation: 	String 		- DOM ID of where it should spawn
			x: 				Number 		- X Coords of where it should spawn
			y: 				Number 		- Y Coords of where it should spawn

		title 				String 		- Text to be displayed at top
		outputMode: 		String 		- Select how it will output data ['rgb' or 'hex']
		color: 				String 		- Display current color on preview [hex: 00FF00 rgb: rgb(0 255 0)]
		onOpen: 			Function 	- Action after Color picker is spawned
		onCancel: 			Function 	- Action if user cancel
		onApply: 			Function 	- Action if user apply
*/
export function callColorPicker(data: {
	location: {
			spawnLocation: string,
			x:string,
			y:string,
		},
		title:string,
		outputMode:string,
		color:string,
		onOpen:Function,
		onCancel:Function,
		onApply:Function,
}){

	if (typeof data === 'object'){

		// Process error reason
		var fs = require('fs'),
			errorReason: string[] = [];

		const addError = function(msg:string){
			errorReason.push(msg);
		}

		if (data.title === void 0){
			data.title = '';
		}

		// Check if require is available
		if (typeof require === 'undefined'){
			addError('This function is only available on node.js enabled platforms');
		}

		// Check if user added location
		if (typeof data.location !== 'object'){
			addError('User didn\'t specified spawn location data');
		}

		// Check if apply action was provided
		if (typeof data.onApply !== 'function'){
			addError('User didn\'t specified onApply action');
		}

		// Check if color picker is already active
		if (document.getElementById('TMS_COLOR_PICKER') !== null){
			addError('Color picker is already opened!');
		}

		// Check if spawn location exists
		if (document.getElementById(data.location.spawnLocation) === null){
			addError('Unable to locate spawn location!');
		}

		// Check if color picker form exists
		if (typeof require !== 'undefined' && fs.existsSync(`${nw.__dirname}/${APP.pathPrefix}/tools/color-picker.htm`) !== !0){
			addError('Unable to locate color picker form');
		}

		/*
			Check if can continue
		*/
		if (errorReason.length === 0){

			// Set variables
			var updateMode = 'number',
				xPos = data.location.x,
				yPos = data.location.y,
				htmlData = APP.fs.readFileSync(`${nw.__dirname}/${APP.pathPrefix}/tools/color-picker.htm`, 'utf8');

			if (typeof data.location.x !== 'string'){
				xPos = '10px';
			}
			if (typeof data.location.y !== 'string'){
				yPos = '10px';
			}
			if (typeof data.outputMode === void 0){
				data.outputMode = 'hex';
			}

			// Append form
			TMS.append(data.location.spawnLocation, htmlData);
			TMS.css('TMS_COLOR_PICKER', {'top': `${yPos}`, 'left': `${xPos}`});

			// Update title
			if (data.title !== ''){
				document.getElementById('DIV_TMS_COLOR_PICKER_TOP_LABEL')!.innerHTML = data.title;
				TMS.css('DIV_TMS_COLOR_PICKER_TOP_LABEL', {'display': 'block'});
			}

			// Set input data
			switch (data.outputMode.toLowerCase()){

				// TODO: Fix alpha
				case 'rgb':
					const colors = data.color.replace('rgb(', '').replace(')', '').split(' ');
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_R')).value = colors[0];
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_G')).value = colors[1];
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_B')).value = colors[2];
					break;

				case 'hex':
					var dataColor = data.color.replace(RegExp('#', 'gi'), '');
					if (dataColor.length === 6){
						dataColor = dataColor + 'ff';
					}
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_HEX')).value = dataColor;
					updateMode = 'hex';
					break;

			}

			// Set cancel action
			document.getElementById('BTN_TMS_COLOR_PICKER_CANCEL')!.onclick = function(){
				
				// Remove color picker
				TMS.removeDOM('TMS_COLOR_PICKER');

				// Execute onCancel action
				if (typeof data.onCancel === 'function'){
					data.onCancel();
				}

			}

			// Set onApply action
			document.getElementById('BTN_TMS_COLOR_PICKER_APPLY')!.onclick = function(){

				// Get variables
				var colorR = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_R')).value,
					colorG = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_G')).value,
					colorB = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_B')).value,
					colorA = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_A')).value,
					colorHex = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_HEX')).value,
					colorData = '';

				// Check input
				if (colorHex.length !== 8 || colorHex === ''){
					colorHex = `#${APP.tools.fixVars(parseInt(colorR, 16))}${APP.tools.fixVars(parseInt(colorG, 16))}${APP.tools.fixVars(parseInt(colorB, 16))}${APP.tools.fixVars(parseInt(colorA, 16))}`;
				}

				switch(data.outputMode.toLowerCase()){

					case 'rgb':
						colorData = `rgb(${colorR} ${colorG} ${colorB} / ${APP.tools.parsePercentage(colorA, 255)})`;
						break;

					case 'hex':
						colorData = colorHex.toUpperCase();
						break;
				
				}

				// Output value
				data.onApply(colorData);

				// Remove color picker
				TMS.removeDOM('TMS_COLOR_PICKER');

			}

			// Update color
			APP.tools.updateColorPicker(updateMode);

			// Execute onOpen action
			if (typeof data.onOpen === 'function'){
				data.onOpen();
			}

		} else {
			const errMsg = `ERROR - Unable to open color picker!\nReason: ${errorReason.toString().replace(RegExp(',', 'gi'), '\n')}`;
			console.error(errMsg);
			window.alert(errMsg);
		}

	}

}

// Update selected color
export function updateColorPicker(inputSource:string){

	if (document.getElementById('TMS_COLOR_PICKER') !== null){

		if (typeof inputSource !== 'string'){
			inputSource = 'hex';
		}

		var colorR,	colorG,	colorB, colorA,
			bgColor = '000';

		switch (inputSource){

			case 'number':
				
				// Fix input field
				APP.tools.fixDomNumber({ def: 0, min: 0, max: 255, maxLength: 3, domName: 'TMS_COLOR_PICKER_NUMBER_R' });
				APP.tools.fixDomNumber({ def: 0, min: 0, max: 255, maxLength: 3, domName: 'TMS_COLOR_PICKER_NUMBER_G' });
				APP.tools.fixDomNumber({ def: 0, min: 0, max: 255, maxLength: 3, domName: 'TMS_COLOR_PICKER_NUMBER_B' });
				APP.tools.fixDomNumber({ def: 0, min: 0, max: 255, maxLength: 3, domName: 'TMS_COLOR_PICKER_NUMBER_A' });

				colorR = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_R')).value;
				colorG = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_G')).value;
				colorB = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_B')).value;
				colorA = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_A')).value;
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_R'))!.value = colorR;
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_G'))!.value = colorG;
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_B'))!.value = colorB;
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_A'))!.value = colorA;
				bgColor = APP.tools.fixVars(parseInt(colorR, 16)) + APP.tools.fixVars(parseInt(colorG, 16)) + APP.tools.fixVars(parseInt(colorB, 16)) + APP.tools.fixVars(parseInt(colorA, 16));
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_HEX'))!.value = bgColor;
				break;

			case 'range':
				colorR = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_R'))!.value;
				colorG = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_G'))!.value;
				colorB = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_B'))!.value;
				colorA = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_A'))!.value;
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_R')).value = colorR;
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_G')).value = colorG;
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_B')).value = colorB;
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_A')).value = colorA;
				bgColor = APP.tools.fixVars(parseInt(colorR, 16)) + APP.tools.fixVars(parseInt(colorG, 16)) + APP.tools.fixVars(parseInt(colorB, 16)) + APP.tools.fixVars(parseInt(colorA, 16));
				(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_HEX'))!.value = bgColor;
				break;

			case 'hex':

				// Convert colors from hex to int
				const rawData = (<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_HEX'))!.value.replace(RegExp('#', 'gi'), '');

				if (rawData.length === 8){

					const hexColors = rawData.match(/.{2,2}/g)!;
					colorR = hexColors[0];
					colorG = hexColors[1];
					colorB = hexColors[2];
					colorA = hexColors[3];
					bgColor = rawData;

					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_R'))!.value = parseInt(hexColors[0], 16).toString();
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_G'))!.value = parseInt(hexColors[1], 16).toString();
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_B'))!.value = parseInt(hexColors[2], 16).toString();
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_RANGE_A'))!.value = parseInt(hexColors[3], 16).toString();
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_R'))!.value = parseInt(hexColors[0], 16).toString();
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_G'))!.value = parseInt(hexColors[1], 16).toString();
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_B'))!.value = parseInt(hexColors[2], 16).toString();
					(<HTMLInputElement>document.getElementById('TMS_COLOR_PICKER_NUMBER_A'))!.value = parseInt(hexColors[3], 16).toString();

				}
				break;

		}

		// Update BG
		TMS.css('DIV_TMS_COLOR_PICKER_PREVIEW', {'background-color': `#${bgColor}`});

	}

}

// Cancel Color Picker
export function closeColorPicker(){
	if (document.getElementById('TMS_COLOR_PICKER') !== null){
		TMS.triggerClick('BTN_TMS_COLOR_PICKER_CANCEL');
	}
}

// Create setTimeout function with more control
export function createTimeout(name:string, action:Function, timeout:number = 1000){

	// Check if current timeout exists on database
	if (APP.timeoutDatabase[name] !== void 0){
		clearTimeout(APP.timeoutDatabase[name]);
		delete APP.timeoutDatabase[name];
	}

	// Set timeout
	APP.timeoutDatabase[name] = setTimeout(function(){
		
		// Execute action
		if (typeof action === 'function'){
			action();
		}

		// Remove timeout from database
		delete APP.timeoutDatabase[name];

	}, timeout);

}

/*
	Clear timeout
		timeoutList: 	String | Boolean 	Timeout name or list to be cleared
*/
export function clearTimeoutList(timeoutList:string | string[]){

	switch (typeof timeoutList){

		case 'string':
			if (APP.timeoutDatabase[timeoutList] !== void 0){
				clearTimeout(APP.timeoutDatabase[timeoutList]);
			}
			break;

		case 'object':
			timeoutList.forEach(function(cTimeout){
				if (APP.timeoutDatabase[cTimeout] !== void 0){
					clearTimeout(APP.timeoutDatabase[cTimeout]);
				}
			});
			break;

	}

}

// Create setInterval function with more control
export function createInterval(name:string, action:Function, interval:number = 1000){

	// Check if current interval exists on database
	if (APP.intervalDatabase[name] !== void 0){
		clearInterval(APP.intervalDatabase[name]);
		delete APP.intervalDatabase[name];
	}

	// Set timeout
	APP.intervalDatabase[name] = setInterval(action, interval);

}

/*
	Export everything
*/
export * from './tools.js';