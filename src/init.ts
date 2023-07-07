/*
    R3 Water Sample Puzzle
    init.ts
*/

declare global {
    interface Window {
        APP: any;
    }
}

import * as APP from './main';
window.APP = APP;