/*
    R3 Water Sample Puzzle
    input.ts
*/

// Import TS modules
import { playerVictory } from './puzzle';

/*
    Input variables
*/

var req:any,
    gPadButtons:any = {},
    gPadIndex: number = 0,
    lockInput: boolean = !0,
    gPadAxesBindings: any = [];

// Buttons actions
const actionList = {

    // Face buttons
    ACTION_0: function(){return;}, // Confirm
    ACTION_1: function(){return;}, // Cancel
    ACTION_2: function(){return;}, // Pause
    ACTION_3: function(){return;}, // Get random puzzle
    ACTION_4: function(){return;}, // Show about screen

    // Arrow list
    ARROW_UP: function(){return;},
    ARROW_DOWN: function(){return;},
    ARROW_LEFT: function(){return;},
    ARROW_RIGHT: function(){return;}

};

/*
    Input functions
*/

/**
    * Set if user can input
    * @param lockStatus Input lock status
*/
export function setInputLockStatus(lockStatus: boolean){
    lockInput = lockStatus;
}

/**
    * Set action function
    * @param actionName action where function will be binded (ACTION_0, ACTION_1, ARROW_UP...)
    * @param action Function to be executed
*/ 
export function setActionFunction(actionName:string, action:Function){
    actionList[actionName as keyof typeof actionList] = function(){
        if (lockInput === !1){
            action();
        }
    };
}

/**
    * Reset action list
*/
export function resetActionList(){
    Object.keys(actionList).forEach(function(cAction:string){
        actionList[cAction as keyof typeof actionList] = function(){return;}
    });
}

/**
    * Set gamepad button action
    * @param id button id
    * @param action actionlist to be executed
    * @param timeout time pressed required to button take action 
*/
export function setGamepadButtonAction(id: number, actionId: string, timeout: number = 1){
    if (timeout < 1){
        timeout = 1;
    }
    if (gPadButtons[id] !== void 0){
        gPadButtons[id] = {rTime: timeout, current: 0, actionId: actionId};
    }
}

/** 
    * Set gamepad axes action
    * @param number axe id
    * @param rangeMin range start of trigger
    * @param rangeMax range end of trigger
    * @param actionId action to be executed
    * @param timeout time required to action
*/
function setGamepadAxesAction(id: number, rangeMin: number, rangeMax:number, actionId: string, timeout: number = 1){

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

    // Create binding variable
    const newBinding = {id: id, rangeMin: rangeMin, rangeMax: rangeMax, current: 0, rTime: timeout, actionId: actionId};

    // Check if current binding exists
    if (gPadAxesBindings.indexOf(newBinding) === -1){
        gPadAxesBindings.push(newBinding);
    }

}

/**
    * Handle gamepad input
*/
function handleGamepad(){

    // Get current gamepad
    const gPad = navigator.getGamepads()[gPadIndex];

    // console.info(gPad?.axes);

    // Process buttons
    gPad?.buttons.forEach(function(_a, cIndex){

        const cButtonReg = gPadButtons[cIndex],
            cButtonJoy = gPad.buttons[cIndex];

        // Check if is available
        if (cButtonReg.current !== void 0){

            switch (cButtonJoy.pressed){

                case !0:
                    cButtonReg.current++;
                    // console.info(`INFO - Button ${cIndex} is pressed!`);
                    break;

                case !1:
                    if (cButtonReg.current >= cButtonReg.rTime){
                        cButtonReg.current = 0;
                        if (actionList[cButtonReg.actionId as keyof typeof actionList] !== void 0){
                            actionList[cButtonReg.actionId as keyof typeof actionList]();
                        }
                    }
                    break;

            }

        }

    });

    // console.info(gPadAxesBindings);

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
                        // console.info(`INFO - Gamepad Axe ${cAxeIndex} is active with value ${cAxe}!`);
                    } else {

                        if (cActionData.current > cActionData.rTime){
                            gPadAxesBindings[cActionIndex].current = 0;
                            actionList[gPadAxesBindings[cActionIndex].actionId as keyof typeof actionList]();
                        }

                    }

                }
            });
        });

    }

    // End
    req = window.requestAnimationFrame(handleGamepad);

}

/**
    * Set default bindings
    * @param gPad Gamepad
*/
function setDefaultBindings(gPad:Gamepad | null){

    // Switch gamepad id
    switch (gPad?.id){

        // Xbox 360 Controller (xinput default)
        case 'Xbox 360 Controller (XInput STANDARD GAMEPAD)':

            // Buttons
            setGamepadButtonAction(0, 'ACTION_0');
            setGamepadButtonAction(1, 'ACTION_1');
            setGamepadButtonAction(9, 'ACTION_2');
            setGamepadButtonAction(3, 'ACTION_3');
            setGamepadButtonAction(8, 'ACTION_4');

            // Arrow buttons
            setGamepadButtonAction(12, 'ARROW_UP');
            setGamepadButtonAction(13, 'ARROW_DOWN');
            setGamepadButtonAction(14, 'ARROW_LEFT');
            setGamepadButtonAction(15, 'ARROW_RIGHT');

            // Axes
            setGamepadAxesAction(1, -0.8, -1, 'ARROW_UP');
            setGamepadAxesAction(1, 0.8, 1, 'ARROW_DOWN');
            setGamepadAxesAction(0, -0.8, -1, 'ARROW_LEFT');
            setGamepadAxesAction(0, 0.8, 1, 'ARROW_RIGHT');
            break;

        // Sony Dualsense (Wired)
        case 'Sony Interactive Entertainment Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)':

            // Buttons
            setGamepadButtonAction(0, 'ACTION_0');
            setGamepadButtonAction(1, 'ACTION_1');
            setGamepadButtonAction(9, 'ACTION_2');
            setGamepadButtonAction(3, 'ACTION_3');
            setGamepadButtonAction(8, 'ACTION_4');

            // Arrow buttons
            setGamepadButtonAction(12, 'ARROW_UP');
            setGamepadButtonAction(13, 'ARROW_DOWN');
            setGamepadButtonAction(14, 'ARROW_LEFT');
            setGamepadButtonAction(15, 'ARROW_RIGHT');

            // Axes
            setGamepadAxesAction(1, -0.8, -1, 'ARROW_UP');
            setGamepadAxesAction(1, 0.8, 1, 'ARROW_DOWN');
            setGamepadAxesAction(0, -0.8, -1, 'ARROW_LEFT');
            setGamepadAxesAction(0, 0.8, 1, 'ARROW_RIGHT');
            break;

        // Sony Dualsense (Wireless)
        case 'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)':

            // Buttons
            setGamepadButtonAction(0, 'ACTION_0');
            setGamepadButtonAction(1, 'ACTION_1');
            setGamepadButtonAction(9, 'ACTION_2');
            setGamepadButtonAction(3, 'ACTION_3');
            setGamepadButtonAction(8, 'ACTION_4');

            // Arrow buttons
            setGamepadButtonAction(12, 'ARROW_UP');
            setGamepadButtonAction(13, 'ARROW_DOWN');
            setGamepadButtonAction(14, 'ARROW_LEFT');
            setGamepadButtonAction(15, 'ARROW_RIGHT');

            // Axes
            setGamepadAxesAction(1, -0.8, -1, 'ARROW_UP');
            setGamepadAxesAction(1, 0.8, 1, 'ARROW_DOWN');
            setGamepadAxesAction(0, -0.8, -1, 'ARROW_LEFT');
            setGamepadAxesAction(0, 0.8, 1, 'ARROW_RIGHT');
            break;

        // Sony DualShock 4 (Wired)
        case 'Sony Computer Entertainment Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)':

            // Buttons
            setGamepadButtonAction(0, 'ACTION_0');
            setGamepadButtonAction(1, 'ACTION_1');
            setGamepadButtonAction(9, 'ACTION_2');
            setGamepadButtonAction(3, 'ACTION_3');
            setGamepadButtonAction(8, 'ACTION_4');

            // Arrow buttons
            setGamepadButtonAction(12, 'ARROW_UP');
            setGamepadButtonAction(13, 'ARROW_DOWN');
            setGamepadButtonAction(14, 'ARROW_LEFT');
            setGamepadButtonAction(15, 'ARROW_RIGHT');

            // Axes
            setGamepadAxesAction(1, -0.8, -1, 'ARROW_UP');
            setGamepadAxesAction(1, 0.8, 1, 'ARROW_DOWN');
            setGamepadAxesAction(0, -0.8, -1, 'ARROW_LEFT');
            setGamepadAxesAction(0, 0.8, 1, 'ARROW_RIGHT');
            break;

        // Sony Playstation 3 Controller (Wired / Wireless)
        case 'Sony PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)':

            // Buttons
            setGamepadButtonAction(0, 'ACTION_0');
            setGamepadButtonAction(1, 'ACTION_1');
            setGamepadButtonAction(9, 'ACTION_2');
            setGamepadButtonAction(3, 'ACTION_3');
            setGamepadButtonAction(8, 'ACTION_4');

            // Arrow buttons
            setGamepadButtonAction(12, 'ARROW_UP');
            setGamepadButtonAction(13, 'ARROW_DOWN');
            setGamepadButtonAction(14, 'ARROW_LEFT');
            setGamepadButtonAction(15, 'ARROW_RIGHT');

            // Analog
            setGamepadAxesAction(1, -0.8, -1, 'ARROW_UP');
            setGamepadAxesAction(1, 0.8, 1, 'ARROW_DOWN');
            setGamepadAxesAction(0, -0.8, -1, 'ARROW_LEFT');
            setGamepadAxesAction(0, 0.8, 1, 'ARROW_RIGHT');
            break;

        // GameSir X2 USB-C
        case 'GAMESIR Gamesir-X2 Type-C (Vendor: 05ac Product: 3b06)':

            // Buttons
            setGamepadButtonAction(1, 'ACTION_0');
            setGamepadButtonAction(0, 'ACTION_1');
            setGamepadButtonAction(11, 'ACTION_2');
            setGamepadButtonAction(3, 'ACTION_3');
            setGamepadButtonAction(10, 'ACTION_4');

            // Arrows
            setGamepadAxesAction(7, -0.8, -1, 'ARROW_UP');
            setGamepadAxesAction(7, 0.8, 1, 'ARROW_DOWN');
            setGamepadAxesAction(6, -0.8, -1, 'ARROW_LEFT');
            setGamepadAxesAction(6, 0.8, 1, 'ARROW_RIGHT');

            // Analog
            setGamepadAxesAction(1, -0.8, -1, 'ARROW_UP');
            setGamepadAxesAction(1, 0.8, 1, 'ARROW_DOWN');
            setGamepadAxesAction(0, -0.8, -1, 'ARROW_LEFT');
            setGamepadAxesAction(0, 0.8, 1, 'ARROW_RIGHT');
            break;

        // Knup generic SNES USB controller
        case 'USB gamepad            (Vendor: 081f Product: e401)':
            
            // Buttons
            setGamepadButtonAction(2, 'ACTION_0');
            setGamepadButtonAction(1, 'ACTION_1');
            setGamepadButtonAction(9, 'ACTION_2');
            setGamepadButtonAction(0, 'ACTION_3');
            setGamepadButtonAction(8, 'ACTION_4');

            // Axes
            setGamepadAxesAction(1, -0.8, -1, 'ARROW_UP');
            setGamepadAxesAction(1, 0.8, 1, 'ARROW_DOWN');
            setGamepadAxesAction(0, -0.8, -1, 'ARROW_LEFT');
            setGamepadAxesAction(0, 0.8, 1, 'ARROW_RIGHT');
            break; 

        // Default case (Using DS)
        default:

            // Log gamepad vendor
            console.warn(`WARN - This controller vendor isn't recognized on this application... Yet! If possible, send the string below to main developer:`);
            console.warn(gPad?.id);

            // Buttons
            setGamepadButtonAction(0, 'ACTION_0');
            setGamepadButtonAction(1, 'ACTION_1');
            setGamepadButtonAction(2, 'ACTION_2');
            setGamepadButtonAction(3, 'ACTION_3');

            // Arrow buttons
            setGamepadButtonAction(12, 'ARROW_UP');
            setGamepadButtonAction(13, 'ARROW_DOWN');
            setGamepadButtonAction(14, 'ARROW_LEFT');
            setGamepadButtonAction(15, 'ARROW_RIGHT');

            // Axes
            setGamepadAxesAction(1, -0.8, -1, 'ARROW_UP');
            setGamepadAxesAction(1, 0.8, 1, 'ARROW_DOWN');
            setGamepadAxesAction(0, -0.8, -1, 'ARROW_LEFT');
            setGamepadAxesAction(0, 0.8, 1, 'ARROW_RIGHT');
            break;

    }

}

// Start input
export function startInput(){

    // Init keyboard
    document.addEventListener('keyup', function(evt){

        // Prevent default key list
        const preventList = [
            'Tab'
        ];

        // Prevent key list
        if (preventList.indexOf(evt.key) === -1){
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

            case 'Escape':
                actionList.ACTION_2();
                break;

            case 'F1':
                actionList.ACTION_4();
                break;

            case 'F4':
                playerVictory();
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

            case 'k':
                actionList.ACTION_0();
                break;

            case 'l':
                actionList.ACTION_1();
                break;

            case 'i':
                actionList.ACTION_3();
                break;

            case ' ':
                actionList.ACTION_2();
                break;

            case '5':
                actionList.ACTION_0();
                break;

            case '6':
                actionList.ACTION_1();
                break;

            case '0':
                actionList.ACTION_2();
                break;

            case '8':
                actionList.ACTION_3();
                break;

        }

    });

    /*
        Gamepad
    */

    // Init gamepad
    window.addEventListener('gamepadconnected', function(data){

        // Set current index and data
        gPadIndex = data.gamepad.index;
        const gPad = navigator.getGamepads()[gPadIndex];

        // Set buttons
        gPad?.buttons.forEach(function(a, cIndex:number){
            gPadButtons[cIndex] = {rTime: 1, current: 0, actionId: ''};
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