/*
    R3 Water Sample Puzzle
    main.ts
*/

declare var nw: any;

// Import modules
import * as TMS from './TMS';
import { initGUI } from './graphics';
import { startInput } from './input';
import { getRandomPuzzle } from './puzzle';

/*
    Variables
*/

var manifest:any = {
    hash: 'DIRTY',
    version: 'Unknown',
    author: 'TheMitoSan',
    appName: 'R3 Water Sample Puzzle'
};

/*
    Functions
*/

// Show about screen
export function about(){
    window.alert(`${manifest.appName} - Version: ${manifest.version}\nCreated by ${manifest.author}\nBuild Hash: ${manifest.hash}\n\nExternal plugins used on this project:\nTMS.js - Created by TheMitoSan`);
}

// Start app
export function init(){

    // Fix for non nw scenario
    if (typeof nw !== 'undefined'){
        manifest = nw.App.manifest;
    }

    // Fix hash data
    if (manifest.hash === ''){
        manifest.hash = 'DIRTY';
    }

    // Freeze and seal manifest
    Object.freeze(Object.seal(manifest));

    // Get App Name
    const name = `${manifest.appName} - Version: ${manifest.version} [${manifest.hash}]`;
    document.title = name;
    console.info(name);

    // Show top bar
    TMS.css('DIV_BTNS', {'height': '26px', 'filter': 'blur(0px)'});

    // Init variables
    getRandomPuzzle();

    // Assign GUI buttons
    initGUI();

    // Start input
    startInput();

}

// Export module
export * from './main';