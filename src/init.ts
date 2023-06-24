/*
    R3 Water Sample Puzzle
    init.ts
*/

declare global {
    interface Window {
        APP: any;
    }
}

import * as APP from './main.js';
window.APP = APP;
window.onload = APP.init;