/*
    R3 Water Sample Puzzle
    puzzle.ts
*/

// Import TS modules
import { about } from './main';
import { setActionFunction, resetActionList } from './input';
import { renderPuzzle, updateActiveRowGUI, renderResult } from './graphics';
import { hideMainMenu, displayMenuOptions, mainMenu, pauseMenu } from './gui';

/*
    Variables
*/

// Puzzle list
const puzzleList = [

    // Original puzzles
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

// Puzzle variables
export var playerData = {
        score: 0,
        puzzleId: 0,
        resetSample: 0
    },
    currentPuzzle: number[] = [],
    remainingPuzzles: number[] = [],
    rowState:any = {
        A: [!0, !1, !1, !1, !0, !0, !0, !1, !1, !1, !0, !0, !0, !1, !0, !0],
        B: [!0, !0, !1, !1, !0, !1, !1, !1, !1, !1, !0, !1, !0, !1, !0, !1],
        C: [!1, !1, !0, !1, !0, !1, !1, !1, !0, !0, !1, !1, !0, !1, !0, !1]
    },
    currentRow: string = '',
    currentGameMode: string = '';

/*
    Functions
*/

// (INPUT) Update current row
export function updateSelectedRow(direction:string){

    var rowList = ['A', 'B', 'C'],
        index = rowList.indexOf(currentRow);

    // Switch row direction
    switch (direction){

        case 'up':
            index--;
            break;

        case 'down':
            index++;
            break;

    }

    // Check if next index is valid
    if (index > -1 && index < rowList.length){
        updateActiveRow(rowList[index]);
    }

}

/**
    * Returns a random puzzle id
    * @returns a number between 0 and puzzle list length
*/
function getRandomPuzzleId():number{
    return Math.floor(Math.random() * puzzleList.length);
}

/**
    * Get random puzzle from list 
*/
function getRandPuzzleEndless(){

    // Get random puzzle id
    const nextPuzzle = getRandomPuzzleId();
    
    // Prevent selected puzzle being the same from previous one
    if (playerData.puzzleId === nextPuzzle){
        getRandPuzzleEndless();
    } else {
        playerData.puzzleId = nextPuzzle;
        currentPuzzle = puzzleList[nextPuzzle];
    }

}

/**
    * Generate random puzzle course
*/
function makeRandomCourse(){

    while (remainingPuzzles.length < (puzzleList.length - 1)){

        var nPuzzle = getRandomPuzzleId();

        if (remainingPuzzles.indexOf(nPuzzle) === -1){
            remainingPuzzles.push(nPuzzle);
        }

    }

    // Set current puzzle
    currentPuzzle = puzzleList[remainingPuzzles[0]];
}

/**
    * Create new game
*/
export function newGame(gameMode:string){

    // Reset variables
    updateActiveRow('A');
    remainingPuzzles = [];
    playerData.score = 0;
    playerData.resetSample = 0;

    // Switch game modes
    switch (gameMode){

        case 'marathon':
            puzzleList.forEach(function(_, cIndex){
                remainingPuzzles.push(cIndex);
            });
            currentPuzzle = puzzleList[remainingPuzzles[0]];
            break;

        case 'random':
            makeRandomCourse();
            break;

    }

    // Set game mode label
    document.getElementById('LABEL_gameMode')!.innerHTML = gameMode.slice(0, 1).toUpperCase() + gameMode.slice(1, gameMode.length);

    // Set game mode
    currentGameMode = gameMode;

    // Hide menu and display top GUI
    hideMainMenu();

    // Start this madness
    getNewPuzzle();

    // Set puzzle input actions
    setPuzzleInputActions();

}

/**
    * Set puzzle input actions
*/
export function setPuzzleInputActions(){
    
    // Reset all buttons
    resetActionList();

    // Pause menu and about screen
    setActionFunction('ACTION_2', function(){displayMenuOptions(pauseMenu);});
    setActionFunction('ACTION_4', function(){about();});

    // Set arrow button actions
    setActionFunction('ARROW_UP', function(){updateSelectedRow('up');});
    setActionFunction('ARROW_DOWN', function(){updateSelectedRow('down');});
    setActionFunction('ARROW_LEFT', function(){updateRow(currentRow, 'left');});
    setActionFunction('ARROW_RIGHT', function(){updateRow(currentRow, 'right');});

    // If is endless mode, add get random puzzle button
    if (currentGameMode === 'endless'){
        setActionFunction('ACTION_3', function(){getNewPuzzle(!0, !0);});
    }

}

/**
    * Get new puzzle
    * @param resetScore reset current player score
    * @param resetSample check if needs to increase reset sample counter
*/
export function getNewPuzzle(resetScore: boolean = !1, resetSample:boolean = !1){

    // Check if current mode isn't endless
    if (currentGameMode !== 'endless'){
        playerData.puzzleId = remainingPuzzles[0];
        currentPuzzle = puzzleList[playerData.puzzleId];
    } else {
        getRandPuzzleEndless();
    }

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
    renderPuzzle();

    // Check puzzle state
    checkPuzzleState();

}

/**
    * Update selected row
    * @param row new row
*/
export function updateActiveRow(row:string){
    currentRow = row;
    updateActiveRowGUI(row);
}

// Update row
export function updateRow(row:string, direction:string){

    // Update current row var and icon
    updateActiveRow(row);

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
    renderPuzzle();

    // Check puzzle state
    checkPuzzleState();

}

/**
    * Check puzzle state
*/
export function checkPuzzleState(){
    
    // Render result
    var finalArray: number[] = [],
        barList:any = {
            0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
        };
    
    // Process all rows
    Object.keys(rowState).forEach(function(cRow:string){

        rowState[cRow].forEach(function(cState:boolean, cIndex:number){

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
    renderResult(finalArray);

    // Check if is sample is correct
    if (finalArray.toString() === currentPuzzle.toString()){
        playerVictory();
    }

}

/**
    * Player won
*/
export function playerVictory(){

    var canGetNewPuzzle = !0;

    // Reset rows
    rowState = {
        A: [!0, !1, !1, !1, !0, !0, !0, !1, !1, !1, !0, !0, !0, !1, !0, !0],
        B: [!0, !0, !1, !1, !0, !1, !1, !1, !1, !1, !0, !1, !0, !1, !0, !1],
        C: [!1, !1, !0, !1, !0, !1, !1, !1, !0, !0, !1, !1, !0, !1, !0, !1]
    };

    // Reset last row
    updateActiveRowGUI('A', !0);

    // Bump score
    playerData.score++;

    // If current game mode isn't endless, move to next puzzle
    if (currentGameMode !== 'endless'){
        remainingPuzzles.splice(0, 1);
        if (remainingPuzzles.length === 0){
            canGetNewPuzzle = !1;
        }
    }

    // Get next puzzle
    if (canGetNewPuzzle === !0){
        window.alert('Yaay - You did it!\nCongratulations!');
        getNewPuzzle(!1, !1);
    } else {
        window.alert('It seems that you really like puzzle games!\nCongratz - you solved all puzzles!');
        displayMenuOptions(mainMenu);
    }

}

// Export module
export * from './puzzle';