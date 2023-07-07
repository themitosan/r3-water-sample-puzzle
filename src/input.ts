/*
    R3 Water Sample Puzzle
    input.ts
*/

// Import TS modules
import { about } from './main';
import { getRandomPuzzle, updateRow, currentRow, updateActiveRow } from './puzzle';

/*
    Variables
*/

const actionList = Object.freeze(Object.seal({

    // Face buttons
    ACTION_0: function(){getRandomPuzzle(!0, !0);}, // Get random puzzle
    ACTION_1: function(){about();},                 // Show about screen

    // Arrow list
    ARROW_UP: function(){updateSelectedRow('up');},
    ARROW_DOWN: function(){updateSelectedRow('down');},
    ARROW_LEFT: function(){updateRow(currentRow, 'left');},
    ARROW_RIGHT: function(){updateRow(currentRow, 'right');}

}));

/*
    Functions
*/

// Update current row
function updateSelectedRow(direction:string){

    var rowList = ['A', 'B', 'C'],
        index = rowList.indexOf(currentRow);

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

// Start input
export function startInput(){

    // Set start row
    updateSelectedRow('down');

    // Init keyboard
    document.addEventListener('keyup', function(evt){
        
        // Prevent tab key
        if (evt.key === 'Tab'){
            evt.preventDefault();
        }

        // Switch keys
        switch (evt.key){

            case 'ArrowUp':
                actionList.ARROW_UP();
                break;

            case 'ArrowDown':
                actionList.ARROW_DOWN();
                break;

            case 'ArrowLeft':
                actionList.ARROW_LEFT();
                break;

            case 'ArrowRight':
                actionList.ARROW_RIGHT();
                break;

            case 'F5':
                actionList.ACTION_0();
                break;

            case 'F1':
                actionList.ACTION_1();
                break;

        }

        // Switch common keys
        switch (evt.key.toLowerCase()){

            case 'w':
                actionList.ARROW_UP();
                break;

            case 's':
                actionList.ARROW_DOWN();
                break;

            case 'a':
                actionList.ARROW_LEFT();
                break;

            case 'd':
                actionList.ARROW_RIGHT();
                break;

        }

    });

    /*
        Gamepad
    */

    // Set variables
    var req:any,
        gPadButtons:any = {},
        gPadIndex: number = 0,
        gPadAxesBindings: any = [];

    // Handle gamepad input
    const handleGamepad = function(){

        // Get current gamepad
        const gPad = navigator.getGamepads()[gPadIndex];

        //console.info(gPad?.axes);

        // Process buttons
        gPad?.buttons.forEach(function(a, cIndex){
            
            const cButtonReg = gPadButtons[cIndex],
                cButtonJoy = gPad.buttons[cIndex];

            switch (cButtonJoy.pressed){

                case !0:
                    cButtonReg.current++;
                    //console.info(`INFO - Button ${cIndex} is pressed!`);
                    break;

                case !1:
                    if (cButtonReg.current >= cButtonReg.rTime){
                        cButtonReg.current = 0;
                        cButtonReg.action();
                    }
                    break;

            }

        });

        // Process axes
        if (gPadAxesBindings.length !== 0){

            gPadAxesBindings.forEach(function(cActionData:any, cActionIndex:number){
                gPad?.axes.forEach(function(cAxe, cAxeIndex:number){
                    if (cAxeIndex === cActionData.id){

                        var checkList = [cAxe >= cActionData.rangeMin, cAxe <= cActionData.rangeMax];
                        
                        // Check if ranges are negative
                        if (cActionData.rangeMin < 0 && cActionData.rangeMax < 0){
                            checkList = [cAxe <= cActionData.rangeMin, cAxe >= cActionData.rangeMax];
                        }

                        if (checkList.indexOf(!1) === -1){
                            gPadAxesBindings[cActionIndex].current++;
                        } else {

                            if (cActionData.current > cActionData.rTime){
                                gPadAxesBindings[cActionIndex].current = 0;
                                gPadAxesBindings[cActionIndex].action();
                            }

                        }

                    }
                });
            });

        }

        // End
        req = window.requestAnimationFrame(handleGamepad);

    },

    /**
        * 
        * @param number axe id
        * @param rangeMin range start of trigger
        * @param rangeMax range end of trigger
        * @param action function to be executed
        * @param timeout time required to action
    */
    setGamepadAxesAction = function(id: number, rangeMin: number, rangeMax:number, action: Function, timeout: number = 1){
        
        // Fix input
        if (timeout < 1){
            timeout = 1;
        }
        if (rangeMin < -1){
            rangeMin = -1;
        }
        if (rangeMax > 1){
            rangeMax = 1;
        }

        // Check if current binding
        const newBinding = {id: id, rangeMin: rangeMin, rangeMax: rangeMax, action: action, current: 0, rTime: timeout};
        if (gPadAxesBindings.indexOf(newBinding) === -1){
            gPadAxesBindings.push(newBinding);
        }

    },
    
    /**
        * Set gamepad button action
        * @param id button id
        * @param action function to be executed
        * @param timeout time pressed required to button take action 
    */
    setGamepadButtonAction = function(id: number, action: Function, timeout: number = 1){
        if (timeout < 1){
            timeout = 1;
        }
        if (gPadButtons[id] !== void 0){
            gPadButtons[id] = {rTime: timeout, current: 0, action: action};
        }
    },

    /**
        * Set default bindings
        * @param gPad Gamepad
    */
    setDefaultBindings = function(gPad:Gamepad | null){

        // Get gamepad id
        switch (gPad!.id){

            // Sony Dualsense
            case 'Sony Interactive Entertainment Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)':
                
                // Buttons
                setGamepadButtonAction(1, actionList.ACTION_0);       // Circle:      Get random puzzle
                setGamepadButtonAction(3, actionList.ACTION_1);       // Triangle:    Show about

                // Arrow buttons
                setGamepadButtonAction(12, actionList.ARROW_UP);
                setGamepadButtonAction(13, actionList.ARROW_DOWN);
                setGamepadButtonAction(14, actionList.ARROW_LEFT);
                setGamepadButtonAction(15, actionList.ARROW_RIGHT);

                // Axes
                setGamepadAxesAction(1, -0.8, -1, actionList.ARROW_UP);
                setGamepadAxesAction(1, 0.8, 1, actionList.ARROW_DOWN);
                setGamepadAxesAction(0, -0.8, -1, actionList.ARROW_LEFT);
                setGamepadAxesAction(0, 0.8, 1, actionList.ARROW_RIGHT);
                break;

            // DualShock 4
            case 'Sony Computer Entertainment Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)':

                // Buttons
                setGamepadButtonAction(1, actionList.ACTION_0);       // Circle:      Get random puzzle
                setGamepadButtonAction(3, actionList.ACTION_1);       // Triangle:    Show about

                // Arrow buttons
                setGamepadButtonAction(12, actionList.ARROW_UP);
                setGamepadButtonAction(13, actionList.ARROW_DOWN);
                setGamepadButtonAction(14, actionList.ARROW_LEFT);
                setGamepadButtonAction(15, actionList.ARROW_RIGHT);

                // Axes
                setGamepadAxesAction(1, -0.8, -1, actionList.ARROW_UP);
                setGamepadAxesAction(1, 0.8, 1, actionList.ARROW_DOWN);
                setGamepadAxesAction(0, -0.8, -1, actionList.ARROW_LEFT);
                setGamepadAxesAction(0, 0.8, 1, actionList.ARROW_RIGHT);
                break;

            // GameSir X2 USB-C
            case 'GAMESIR Gamesir-X2 Type-C (Vendor: 05ac Product: 3b06)':

                // Buttons
                setGamepadButtonAction(0, actionList.ACTION_0);       // Circle:      Get random puzzle
                setGamepadButtonAction(3, actionList.ACTION_1);       // Triangle:    Show about

                /*
                    Axes
                */

                // Arrows
                setGamepadAxesAction(7, -0.8, -1, actionList.ARROW_UP);
                setGamepadAxesAction(7, 0.8, 1, actionList.ARROW_DOWN);
                setGamepadAxesAction(6, -0.8, -1, actionList.ARROW_LEFT);
                setGamepadAxesAction(6, 0.8, 1, actionList.ARROW_RIGHT);

                // Analog
                setGamepadAxesAction(1, -0.8, -1, actionList.ARROW_UP);
                setGamepadAxesAction(1, 0.8, 1, actionList.ARROW_DOWN);
                setGamepadAxesAction(0, -0.8, -1, actionList.ARROW_LEFT);
                setGamepadAxesAction(0, 0.8, 1, actionList.ARROW_RIGHT);
                break;

            // Playstation 3 Controller
            case 'Sony PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)':

                // Buttons
                setGamepadButtonAction(1, actionList.ACTION_0);       // Circle:      Get random puzzle
                setGamepadButtonAction(3, actionList.ACTION_1);       // Triangle:    Show about

                // Arrow buttons
                setGamepadButtonAction(12, actionList.ARROW_UP);
                setGamepadButtonAction(13, actionList.ARROW_DOWN);
                setGamepadButtonAction(14, actionList.ARROW_LEFT);
                setGamepadButtonAction(15, actionList.ARROW_RIGHT);

                // Analog
                setGamepadAxesAction(1, -0.8, -1, actionList.ARROW_UP);
                setGamepadAxesAction(1, 0.8, 1, actionList.ARROW_DOWN);
                setGamepadAxesAction(0, -0.8, -1, actionList.ARROW_LEFT);
                setGamepadAxesAction(0, 0.8, 1, actionList.ARROW_RIGHT);
                break;

            // Generic SNES USB controller
            case 'USB gamepad            (Vendor: 081f Product: e401)':
            
                // Buttons
                setGamepadButtonAction(1, actionList.ACTION_0);       // Circle:      Get random puzzle
                setGamepadButtonAction(0, actionList.ACTION_1);       // Triangle:    Show about

                // Axes
                setGamepadAxesAction(1, -0.8, -1, actionList.ARROW_UP);
                setGamepadAxesAction(1, 0.8, 1, actionList.ARROW_DOWN);
                setGamepadAxesAction(0, -0.8, -1, actionList.ARROW_LEFT);
                setGamepadAxesAction(0, 0.8, 1, actionList.ARROW_RIGHT);
                break; 

            // Default case (Using DS)
            default:

                // Buttons
                setGamepadButtonAction(1, actionList.ACTION_0);       // Circle:      Get random puzzle
                setGamepadButtonAction(3, actionList.ACTION_1);       // Triangle:    Show about

                // Arrow buttons
                setGamepadButtonAction(12, actionList.ARROW_UP);
                setGamepadButtonAction(13, actionList.ARROW_DOWN);
                setGamepadButtonAction(14, actionList.ARROW_LEFT);
                setGamepadButtonAction(15, actionList.ARROW_RIGHT);

                // Axes
                setGamepadAxesAction(1, -0.8, -1, actionList.ARROW_UP);
                setGamepadAxesAction(1, 0.8, 1, actionList.ARROW_DOWN);
                setGamepadAxesAction(0, -0.8, -1, actionList.ARROW_LEFT);
                setGamepadAxesAction(0, 0.8, 1, actionList.ARROW_RIGHT);
                break;

        }

    };

    // Init gamepad
    window.addEventListener('gamepadconnected', function(data){
        
        // Set current index and data
        gPadIndex = data.gamepad.index;
        const gPad = navigator.getGamepads()[gPadIndex];
        
        // Set buttons
        gPad?.buttons.forEach(function(a, cIndex:number){
            gPadButtons[cIndex] = {rTime: 1, current: 0, action: function(){return;}};
        });

        // Set default bindings
        setDefaultBindings(gPad);

        // Log status
        console.info('--- Gamepad connected ---');
        console.info(gPad);

        // Start gamepad loop
        handleGamepad();

    });

    // Stop gamepad
    window.addEventListener('gamepaddisconnected', function(data){

        // Stop action frame
        window.cancelAnimationFrame(req);

        // Log status
        console.info('--- Gamepad disconnected ---');
        console.info(data);

        // Reset vars
        gPadButtons = {};
        gPadAxesBindings = [];

    });

}

// Export module
export * from './input';