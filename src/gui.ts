/*
    R3 Water Sample Puzzle
    gui.ts
*/

// Import TS modules
import * as TMS from './TMS';
import { about, closeGame } from './main';
import { setInputLockStatus, setActionFunction, resetActionList } from './input';
import { updateRow, getNewPuzzle, newGame, currentGameMode, setPuzzleInputActions } from './puzzle';

/*
    General functions
*/

// Assign GUI button actions
export function initGui(){

    // Assign rows
    ['A', 'B', 'C'].forEach(function(cRow:string){
        (<HTMLInputElement>document.getElementById(`BTN_${cRow}_L`))!.onclick = function(){updateRow(cRow, 'left');};
        (<HTMLInputElement>document.getElementById(`BTN_${cRow}_R`))!.onclick = function(){updateRow(cRow, 'right');};
    });

    // Assign top buttons
    (<HTMLInputElement>document.getElementById('BTN_TOP_ABOUT'))!.onclick = function(){about();};
    (<HTMLInputElement>document.getElementById('BTN_TOP_GET_RAND_PUZZLE'))!.onclick = function(){getNewPuzzle(!0, !0);};

    // Display main menu
    displayMenuOptions(mainMenu);

}

/**
    * Hide main menu and display game interface
*/
export function hideMainMenu(){

    // Hide GUI
    TMS.css('DIV_MENU', {'display': 'none'});
    TMS.css('DIV_BTNS', {'height': '26px', 'filter': 'blur(0px)'});

    if (currentGameMode === 'endless'){
        TMS.css('DIV_LABEL_resetSample', {'display': 'inline'});
        TMS.css('BTN_TOP_GET_RAND_PUZZLE', {'display': 'block'});
    } else {
        TMS.css('DIV_LABEL_resetSample', {'display': 'none'});
        TMS.css('BTN_TOP_GET_RAND_PUZZLE', {'display': 'none'});
    }

    // Update menu top position
    setTimeout(function(){
        const getWindowHeight = TMS.getCoords('DIV_LABELS');
        TMS.css('DIV_LABELS', {'top': `${(window.innerHeight / 2) - (getWindowHeight?.H / 2)}px`});
    }, 20);

}

/*
    Menu interfaces
*/
interface selectMenuOptions {
    desc: string,
    label: string,
    action: Function
}
interface selectMenu {
    id: string,
    target: string,
    options: object[],
    mainFocus: number,
    backAction: number,
    selectMode: string
    labelTarget: string
}

/*
    Menu default variables
*/
const menuOptionsDefault: Pick<selectMenuOptions, 'label' | 'action' | 'desc'> = {
    label: 'ERROR',
    desc: 'NO INFO PROVIDED',
    action: function(){return;}
},
menuDefaults: Pick<selectMenu, 'mainFocus' | 'id' | 'options' | 'target' | 'selectMode' | 'labelTarget' | 'backAction'> = {
    id: 'MENU',
    mainFocus: 0,
    backAction: 0,
    selectMode: 'x',
    target: 'DIV_SELECT',
    options: [menuOptionsDefault],
    labelTarget: 'DIV_SELECT_LABEL'
}

/*
    Menu variables
*/

var cursorPos: number = 0,
    cursorLength: number = 1,
    cMenuData: any;

/*
    Menu consts
*/

// Menu list
export const mainMenu = {
    ...menuDefaults,
    backAction: 2,
    id: 'MAIN_MENU',
    selectMode: 'x',
    options: [
        {label: 'Start Game', desc: 'Start a new game', action: function(){displayMenuOptions(selectGameMode);}},
        {label: 'About', desc: 'Display about window', action: function(){about();}},
        {label: 'Exit', desc: 'Close this game', action: function(){closeGame();}}
    ]
},
selectGameMode = {
    ...menuDefaults,
    backAction: 3,
    id: 'GAME_MODE',
    selectMode: 'y',
    options: [
        {label: 'Marathon', desc: 'Solve all puzzles in sequence', action: function(){newGame('marathon');}},
        {label: 'Random', desc: 'Solve all puzzles randomly', action: function(){newGame('random');}},
        {label: 'Endless mode', desc: '...<u>why</u>?', action: function(){newGame('endless');}},
        {label: 'Back', desc: 'Return to previous menu', action: function(){displayMenuOptions(mainMenu);}}
    ]
},
pauseMenu = {
    ...menuDefaults,
    backAction: 0,
    id: 'PAUSE_MENU',
    selectMode: 'y',
    options: [
        {label: 'Return to game', desc: 'Keep on keeping on!', action: function(){returnToGame();}},
        {label: 'Give up', desc: 'Give up and return to main menu', action: function(){displayMenuOptions(mainMenu);}}
    ]
}

/*
    Menu functions
*/

/**
    * Return from pause menu
*/
function returnToGame(){

    // Hide menu
    TMS.css('DIV_MENU', {'display': 'none'});

    // Reset input
    setPuzzleInputActions();

}

/**
    * Display menu with selectable options
    * @param data menu options 
*/
export function displayMenuOptions(data:selectMenu){

    // Declare variables
    var htmlData = '';

    // Set variables
    cursorPos = 0;
    cMenuData = data;
    cursorLength = (cMenuData.options.length - 1);

    /*
        Menu functions
    */

    // Update cursor position
    const updateCursorPos = function(direction:string){
        
        switch (direction){

            case 'prev':
                cursorPos--;
                break;
            
            case 'next':
                cursorPos++;
                break;

        }

        // Fix cursor pos.
        if (cursorPos < 0){
            cursorPos = 0;
        }
        if (cursorPos > cursorLength){
            cursorPos = cursorLength;
        }

        // Update GUI
        cMenuData.options.forEach(function(_cOption:any, cIndex:number){
            TMS.removeClass(`DIV_${cMenuData.id}_${cIndex}`, 'DIV_SELECT_OPTION_ACTIVE');
        });
        TMS.addClass(`DIV_${cMenuData.id}_${cursorPos}`, 'DIV_SELECT_OPTION_ACTIVE');

        // Update label
        document.getElementById(cMenuData.labelTarget)!.innerHTML = getOptionsData(cursorPos).desc;

    },
    getOptionsData = function(optionsId: number){
        const mData: any = cMenuData.options[optionsId];
        return mData;
    };

    /*
        Start process
    */

    // Lock input and reset action list
    setInputLockStatus(!0);
    resetActionList();

    // Process options
    cMenuData.options.forEach(function(cOption:any, cIndex:number){
        var indexClass = '';
        if (cIndex === cMenuData.mainFocus){
            indexClass = ' DIV_SELECT_OPTION_ACTIVE';
        }
        htmlData = `${htmlData}<div class="DIV_SELECT_OPTION${indexClass}" id="DIV_${cMenuData.id}_${cIndex}">${cOption.label}</div>`;
    });

    // Set HTML data
    document.getElementById(cMenuData.target)!.innerHTML = htmlData;
    document.getElementById(cMenuData.labelTarget)!.innerHTML = getOptionsData(cMenuData.mainFocus).desc;

    // Set gamepad data
    switch (cMenuData.selectMode){
        
        case 'x':
            TMS.removeClass(cMenuData.target, 'DIV_SELECT_Y');
            setActionFunction('ARROW_LEFT', function(){updateCursorPos('prev');});
            setActionFunction('ARROW_RIGHT', function(){updateCursorPos('next');});
            break;
        
        case 'y':
            TMS.addClass(cMenuData.target, 'DIV_SELECT_Y');
            setActionFunction('ARROW_UP', function(){updateCursorPos('prev');});
            setActionFunction('ARROW_DOWN', function(){updateCursorPos('next');});
            break;
    
    }

    // Set face buttons actions
    setActionFunction('ACTION_0', function(){getOptionsData(cursorPos).action();});
    setActionFunction('ACTION_1', function(){getOptionsData(cMenuData.backAction).action();});

    // Release input
    setInputLockStatus(!1);

    // Display menu
    TMS.css('DIV_MENU', {'display': 'block'});

}

/*
    * Fade out screen
*/
export function fadeOutScreen(){
    TMS.css('body', {'background-image': 'none'});
    TMS.css('APP_CANVAS', {'opacity': '0'});
}

// Export module
export * from './gui';