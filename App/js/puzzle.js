const puzzleList = [
    [20, 0, 10, 0, 30, 20, 20, 0, 30, 20, 20, 0, 10, 0, 20, 10],
    [30, 10, 10, 0, 20, 10, 20, 0, 10, 0, 20, 10, 30, 10, 20, 10],
    [20, 10, 10, 30, 0, 0, 20, 0, 20, 10, 30, 10, 10, 0, 20, 10],
    [30, 0, 20, 10, 30, 10, 10, 10, 20, 10, 30, 0, 0, 0, 20, 10],
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
];
export var playerData = {
    score: 0,
    puzzleId: 0,
    resetSample: 0
}, currentPuzzle = [], rowState = {
    A: [!0, !1, !1, !1, !0, !0, !0, !1, !1, !1, !0, !0, !0, !1, !0, !0],
    B: [!0, !0, !1, !1, !0, !1, !1, !1, !1, !1, !0, !1, !0, !1, !0, !1],
    C: [!1, !1, !0, !1, !0, !1, !1, !1, !0, !0, !1, !1, !0, !1, !0, !1]
};
export function getRandomPuzzle(resetScore, resetSample) {
    const getRandPuzzle = function () {
        const nextPuzzle = Math.floor(Math.random() * puzzleList.length);
        currentPuzzle = puzzleList[nextPuzzle];
        if (playerData.puzzleId === nextPuzzle) {
            getRandPuzzle();
        }
        else {
            playerData.puzzleId = nextPuzzle;
        }
    };
    getRandPuzzle();
    if (resetScore === !0) {
        playerData.score = 0;
    }
    if (resetSample === !0) {
        playerData.resetSample++;
    }
    document.getElementById('LABEL_playerScore').innerHTML = playerData.score.toString();
    document.getElementById('LABEL_currentSample').innerHTML = playerData.puzzleId.toString();
    document.getElementById('LABEL_resetSample').innerHTML = playerData.resetSample.toString();
    APP.graphics.renderPuzzle();
    APP.puzzle.checkPuzzleState();
}
export function updateRow(row, direction) {
    APP.graphics.updateActiveRow(row);
    var moveBar;
    switch (direction) {
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
    APP.graphics.renderPuzzle();
    APP.puzzle.checkPuzzleState();
}
export function checkPuzzleState() {
    var finalArray = [], barList = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
    };
    Object.keys(APP.puzzle.rowState).forEach(function (cRow) {
        APP.puzzle.rowState[cRow].forEach(function (cState, cIndex) {
            var state = 0;
            if (cState === !0) {
                state = 10;
            }
            barList[cIndex] = (barList[cIndex] + state);
        });
    });
    Object.keys(barList).forEach(function (cBar, cIndex) {
        finalArray.push(barList[cIndex]);
    });
    APP.graphics.renderResult(finalArray);
    if (finalArray.toString() === currentPuzzle.toString()) {
        playerVictory();
    }
}
function playerVictory() {
    rowState = {
        A: [!1, !0, !0, !1, !1, !1, !0, !0, !0, !1, !1, !1, !0, !0, !0, !0],
        B: [!1, !1, !0, !0, !1, !0, !0, !0, !0, !0, !1, !0, !1, !0, !1, !0],
        C: [!1, !1, !0, !1, !0, !1, !1, !1, !0, !0, !1, !1, !0, !1, !0, !1]
    };
    APP.graphics.updateActiveRow(!0);
    APP.puzzle.playerData.score++;
    window.alert('Yaay - You did it!\nCongratulations!');
    APP.puzzle.getRandomPuzzle();
}
export * from './puzzle.js';
