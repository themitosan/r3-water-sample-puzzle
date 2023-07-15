/*
    R3 Water Sample Puzzle
    main.ts
*/

// Declare globals
declare var nw: any;
declare global {
    interface Window {
        init: any;
    }
}

// Import modules
import { initGui, fadeOutScreen } from './gui';
import { startInput, resetActionList, setInputLockStatus } from './input';

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

    // Assign GUI buttons
    initGui();

    // Start input
    startInput();

    // Request focus
    nw.Window.get().focus();

}

/**
    * Close app
*/
export function closeGame(){

    // Disable input and fade out screen
    setInputLockStatus(!0);
    resetActionList();
    fadeOutScreen();

    // Close app
    setTimeout(function(){
        nw.App.quit();
    }, 1010);

}

// Set init as a global function
window.init = init;