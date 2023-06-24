/*
    R3 Water Sample Puzzle
    main.ts
*/

declare var nw: any;
declare var APP: any;
declare var TMS: any;

// Import modules
import * as Puzzle from './puzzle.js';
import * as Graphics from './graphics.js';

/*
    Variables
*/
const manifest = nw.App.manifest;

/*
    Import modules
*/
export const puzzle = Puzzle,
    graphics = Graphics;

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

    // Prevent tab key
    document.addEventListener('keyup', function(evt){
        if (evt.key === 'Tab'){
            evt.preventDefault();
        }
    });

    // Init variables
    APP.puzzle.getRandomPuzzle();

}

// Export
export * from './main.js';