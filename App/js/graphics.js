export function updateActiveRow(cRow, skipAddClass) {
    const rowList = ['A', 'B', 'C'];
    rowList.forEach(function (remRow) {
        TMS.removeClass(`ROW_ACTIVE_ICON_${remRow}`, 'ROW_ACTIVE_ICON_ON');
    });
    if (skipAddClass !== !0) {
        TMS.addClass(`ROW_ACTIVE_ICON_${cRow}`, 'ROW_ACTIVE_ICON_ON');
    }
}
export function renderPuzzle() {
    Object.keys(APP.puzzle.rowState).forEach(function (cRow) {
        APP.puzzle.rowState[cRow].forEach(function (cBar, cIndex) {
            var barHeight = 0;
            if (APP.puzzle.rowState[cRow][cIndex] === !0) {
                barHeight = 7;
            }
            TMS.css(`ROW_LINE_${cRow}_BAR_${cIndex}`, { 'height': `${barHeight}px` });
        });
    });
    APP.puzzle.currentPuzzle.forEach(function (cSize, cIndex) {
        TMS.css(`ROW_SAMPLE_BAR_${cIndex}`, { 'height': `${cSize}px` });
    });
}
export function renderResult(state) {
    state.forEach(function (cBar, cIndex) {
        TMS.css(`ROW_RESULT_BAR_${cIndex}`, { 'height': `${cBar}px` });
    });
}
export * from './graphics.js';
