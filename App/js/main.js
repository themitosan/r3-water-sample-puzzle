import * as Puzzle from './puzzle.js';
import * as Graphics from './graphics.js';
const manifest = nw.App.manifest;
export const puzzle = Puzzle, graphics = Graphics;
export function about() {
    window.alert(`${manifest.appName} - Version: ${manifest.version}\nCreated by ${manifest.author}\nBuild Hash: ${manifest.hash}\n\nExternal plugins used on this project:\nTMS.js - Created by TheMitoSan`);
}
export function init() {
    if (manifest.hash === '') {
        manifest.hash = 'DIRTY';
    }
    Object.freeze(Object.seal(manifest));
    const name = `${manifest.appName} - Version: ${manifest.version} [${manifest.hash}]`;
    document.title = name;
    console.info(name);
    TMS.css('DIV_BTNS', { 'height': '26px', 'filter': 'blur(0px)' });
    document.addEventListener('keyup', function (evt) {
        if (evt.key === 'Tab') {
            evt.preventDefault();
        }
    });
    APP.puzzle.getRandomPuzzle();
}
export * from './main.js';
