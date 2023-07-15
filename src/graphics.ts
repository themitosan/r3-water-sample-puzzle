/*
    R3 Water Sample Puzzle
    graphics.js
*/

// Import TS modules
import * as TMS from './TMS';
import { currentPuzzle, rowState } from './puzzle';

/*
    Functions
*/

// Update active row icon
export function updateActiveRowGUI(cRow:string = 'A', skipAddClass:boolean = !1){
    
    const rowList = ['A', 'B', 'C'];
    rowList.forEach(function(remRow){
        TMS.removeClass(`ROW_ACTIVE_ICON_${remRow}`, 'ROW_ACTIVE_ICON_ON');
    });

    // Set current row active
    if (skipAddClass !== !0){
        TMS.addClass(`ROW_ACTIVE_ICON_${cRow}`, 'ROW_ACTIVE_ICON_ON');
    }

}

// Render puzzle
export function renderPuzzle(){

    // Render rows
    Object.keys(rowState).forEach(function(cRow:string){

        // Render bars
        rowState[cRow].forEach(function(cBar:string, cIndex:string){

            // Get bar state
            var barHeight = 0;
            if (rowState[cRow][cIndex] === !0){
                barHeight = 7;
            }

            // Update row and bar state
            TMS.css(`ROW_LINE_${cRow}_BAR_${cIndex}`, {'height': `${barHeight}px`});

        });

    });

    // Render sample
    currentPuzzle.forEach(function(cSize:number, cIndex:number){
        TMS.css(`ROW_SAMPLE_BAR_${cIndex}`, {'height': `${cSize}px`});
    });

}

// Render result
export function renderResult(state: number[]){

    // Process bars
    state.forEach(function(cBar:number, cIndex:number){
        TMS.css(`ROW_RESULT_BAR_${cIndex}`, {'height': `${cBar}px`});
    });

}

// Export module
export * from './graphics';