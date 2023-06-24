/*
    R3 Water Sample Puzzle
    graphics.js
*/

declare var TMS: any;
declare var APP: any;

/*
    Functions
*/

// Update active row icon
export function updateActiveRow(cRow:string, skipAddClass:boolean){
    
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
    Object.keys(APP.puzzle.rowState).forEach(function(cRow:string){

        // Render bars
        APP.puzzle.rowState[cRow].forEach(function(cBar:string, cIndex:string){

            // Get bar state
            var barHeight = 0;
            if (APP.puzzle.rowState[cRow][cIndex] === !0){
                barHeight = 7;
            }

            // Update row and bar state
            TMS.css(`ROW_LINE_${cRow}_BAR_${cIndex}`, {'height': `${barHeight}px`});

        });

    });

    // Render sample
    APP.puzzle.currentPuzzle.forEach(function(cSize:number, cIndex:number){
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

/*
    Export functions
*/
export * from './graphics.js';