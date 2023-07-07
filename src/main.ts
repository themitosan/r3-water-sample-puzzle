/*
    R3 Water Sample Puzzle
    main.ts
*/

declare var nw: any;

// Import modules
import * as TMS from './TMS';
import { startInput } from './input';
import { getRandomPuzzle } from './puzzle';

/*
    Variables
*/
const manifest = nw.App.manifest;

/*
    Functions
*/

// Show about screen
export function about(){
    window.alert(`${manifest.appName} - Version: ${manifest.version}\nCreated by ${manifest.author}\nBuild Hash: ${manifest.hash}\n\nExternal plugins used on this project:\nTMS.js - Created by TheMitoSan`);
}

// Start app
export function init(){

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

    // Start input
    startInput();

}

// Export module
export * from './main';