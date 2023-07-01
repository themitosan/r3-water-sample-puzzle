/*
    R3 Water Sample Puzzle
    puzzle.ts
*/

declare var APP: any;

/*
    Variables
*/

// Puzzle list
const puzzleList = [

    // Original puzzles
    [20, 0, 10, 0, 30, 20, 20, 0, 30, 20, 20, 0, 10, 0, 20, 10],
    [30, 10, 10, 0, 20, 10, 20, 0, 10, 0, 20, 10, 30, 10, 20, 10],
    [20, 10, 10, 30, 0, 0, 20, 0, 20, 10, 30, 10, 10, 0, 20, 10],
    [30, 0, 20, 10, 30, 10, 10, 10, 20, 10, 30, 0, 0, 0, 20, 10],

    // New ones
    [10, 30, 10, 10, 10, 30, 10, 0, 0, 20, 10, 30, 0, 10, 0, 30],
    [0, 30, 10, 20, 0, 30, 10, 30, 10, 0, 0, 30, 20, 10, 0, 10],
    [20, 10, 10, 20, 30, 0, 0, 10, 10, 20, 20, 0, 10, 10, 20, 20],
    [10, 0, 0, 30, 20, 10, 0, 20, 10, 30, 0, 10, 0, 30, 10, 30],
    [0, 30, 10, 10, 0, 10, 10, 20, 10, 30, 0, 30, 10, 20, 10, 10],
    [20, 0, 0, 20, 20, 20, 0, 0, 10, 20, 20, 20, 0, 20, 20, 20],
    [30, 10, 10, 10, 10, 10, 10, 10, 20, 10, 10, 10, 10, 20, 20, 10],
    [20, 10, 10, 0, 20, 0, 30, 10, 20, 0, 30, 30, 10, 0, 20, 0],
    [20, 10, 20, 0, 10, 10, 10, 10, 30, 0, 30, 10, 20, 0, 20, 10],
    [10, 30, 10, 10, 10, 20, 10, 30, 0, 0, 0, 20, 10, 30, 0, 20],
    [20, 0, 10, 10, 10, 10, 30, 0, 30, 10, 20, 0, 20, 10, 20, 10],
    [10, 10, 0, 10, 10, 20, 10, 30, 0, 30, 10, 20, 10, 10, 0, 30],
    [30, 0, 0, 0, 20, 20, 20, 0, 30, 10, 30, 0, 10, 10, 20, 10],
    [10, 20, 10, 20, 0, 0, 10, 20, 30, 10, 10, 20, 20, 30, 0, 0],
    [10, 20, 0, 20, 20, 10, 10, 20, 10, 0, 10, 20, 10, 20, 10, 20]

]

// Current puzzle
export var playerData = {
        score: 0,
        puzzleId: 0,
        resetSample: 0
    },
    currentPuzzle: number[] = [],
    rowState:any = {
        A: [!0, !1, !1, !1, !0, !0, !0, !1, !1, !1, !0, !0, !0, !1, !0, !0],
        B: [!0, !0, !1, !1, !0, !1, !1, !1, !1, !1, !0, !1, !0, !1, !0, !1],
        C: [!1, !1, !0, !1, !0, !1, !1, !1, !0, !0, !1, !1, !0, !1, !0, !1]
    };

/*
    Functions
*/

// Get random puzzle
export function getRandomPuzzle(resetScore: boolean, resetSample:boolean){

    // Get random puzzle from list
    const getRandPuzzle = function(){
        const nextPuzzle = Math.floor(Math.random() * puzzleList.length);
        currentPuzzle = puzzleList[nextPuzzle];
        
        if (playerData.puzzleId === nextPuzzle){
            getRandPuzzle();
        } else {
            playerData.puzzleId = nextPuzzle;
        }

    }

    // Give it a shot!
    getRandPuzzle();

    // Check if needs to reset score
    if (resetScore === !0){
        playerData.score = 0;
    }

    // Check if needs to increase reset sample counter
    if (resetSample === !0){
        playerData.resetSample++;
    }

    // Update labels
    document.getElementById('LABEL_playerScore')!.innerHTML = playerData.score.toString();
    document.getElementById('LABEL_currentSample')!.innerHTML = playerData.puzzleId.toString();
    document.getElementById('LABEL_resetSample')!.innerHTML = playerData.resetSample.toString();

    // Render current puzzle
    APP.graphics.renderPuzzle();

    // Check puzzle state
    checkPuzzleState();

}

// Update row
export function updateRow(row:string, direction:string){

    // Update active row icon
    APP.graphics.updateActiveRow(row);

    // Get temp var for storing moving data
    var moveBar: boolean;

    // Update rowstate
    switch (direction){

        case 'left':
            moveBar = rowState[row][0];
            rowState[row].splice(0, 1);
            rowState[row].push(moveBar);
            break;

        case 'right':
            moveBar = rowState[row][rowState[row].length - 1];
            rowState[row].pop();
            rowState[row].splice(0, 0, moveBar);
            break;

    }

    // Render puzzle
    APP.graphics.renderPuzzle();

    // Check puzzle state
    checkPuzzleState();

}

// Check puzzle state
export function checkPuzzleState(){
    
    // Render result
    var finalArray: number[] = [],
        barList:any = {
            0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
        };
    
    // Process all rows
    Object.keys(APP.puzzle.rowState).forEach(function(cRow:string){
        
        APP.puzzle.rowState[cRow].forEach(function(cState:boolean, cIndex:number){
        
            var state = 0;
            if (cState === !0){
                state = 10;
            }

            barList[cIndex] = (barList[cIndex] + state);
        
        });

    });

    // Convert result to array
    Object.keys(barList).forEach(function(cBar:string, cIndex:number){
        finalArray.push(barList[cIndex]);
    });

    // Render result
    APP.graphics.renderResult(finalArray);

    // Check if is sample is correct
    if (finalArray.toString() === currentPuzzle.toString()){
        playerVictory();
    }

}

// Player won
function playerVictory(){

    // Reset rows
    rowState = {
        A: [!0, !1, !1, !1, !0, !0, !0, !1, !1, !1, !0, !0, !0, !1, !0, !0],
        B: [!0, !0, !1, !1, !0, !1, !1, !1, !1, !1, !0, !1, !0, !1, !0, !1],
        C: [!1, !1, !0, !1, !0, !1, !1, !1, !0, !0, !1, !1, !0, !1, !0, !1]
    };

    // Reset last row
    APP.graphics.updateActiveRow(!0);

    // Bump score
    playerData.score++;

    // Display message
    window.alert('Yaay - You did it!\nCongratulations!');

    // Get a new puzzle
    getRandomPuzzle(!1, !1);

}

/*
    Export data
*/
export * from './puzzle.js';
