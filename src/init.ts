/*
    R3 Water Sample Puzzle
    init.ts
*/

declare global {
    interface Window {
        APP: any;
        TMS: any;
    }
}

import * as APP from './main.js';
import * as TMS from './TMS.js';

window.TMS = TMS;
window.APP = APP;