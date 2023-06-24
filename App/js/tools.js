var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function solveHex(hex) {
    var res = '';
    if (hex !== void 0) {
        res = hex.toLowerCase().replace(RegExp(' ', 'gi'), '');
    }
    return res;
}
export function unsolveHex(hex) {
    var res = '';
    if (hex !== void 0) {
        res = hex.toUpperCase().match(/.{2,2}/g).toString().replace(RegExp(',', 'gi'), ' ');
    }
    return res;
}
export function parseEndian(hex) {
    return hex.match(/.{2,2}/g).reverse().toString().replace(RegExp(',', 'gi'), '');
}
export function convertHexToUft8(hex) {
    var textValue = '';
    if (hex !== '') {
        textValue = decodeURIComponent('%' + hex.match(/.{2,2}/g).join('%'));
    }
    return textValue;
}
export function parsePercentage(current, maximum) {
    var res = 0;
    if (current !== void 0 && maximum !== void 0) {
        res = Math.floor((current / maximum) * 100);
    }
    return res;
}
export function parsePositive(n) {
    var res = ((n - n) - n);
    if (res < 0) {
        res = ((res - res) - res);
    }
    return res;
}
export function parseNegative(n) {
    var res = ((n - n) - n);
    if (res > -1) {
        res = ((res - res) - res);
    }
    return res;
}
export function fixPath(path) {
    var res = '';
    if (path !== '') {
        res = path.replace(RegExp('\\\\', 'gi'), '/');
    }
    return res;
}
export function removeHTML(str) {
    if (str !== void 0 && str !== '') {
        return str.replace(/(<([^>]+)>)/gi, '');
    }
}
export function convertArrayToString(str) {
    var res = '';
    if (str !== '') {
        res = str.toString().replace(RegExp(',', 'gi'), '\n');
    }
    return res;
}
export function cleanString(str, arr) {
    var res = str;
    arr.forEach(function (rep) {
        res = res.replace(RegExp(rep, 'gi'), '');
    });
    return res;
}
export function fixVars(input, size = 2, filler = '0') {
    if (input.length < size) {
        while (input.length !== size) {
            input = filler + input;
        }
    }
    else {
        if (input.length !== size && input.toString().length > size) {
            input = input.slice(0, size);
        }
    }
    return input;
}
export function fixJson(data) {
    return data.replace(RegExp("'", 'gi'), '"');
}
export function cleanFn(fnStr) {
    return fnStr.replace(RegExp('\n', 'gi'), ' ').replace(RegExp('	', 'gi'), '');
}
export function winMsg(msg) {
    return new Promise(function (resolve, reject) {
        var res = window.prompt(msg), errorReason = [], pushError = function (errData) {
            errorReason.push(errData);
        };
        if (res === null) {
            pushError('User canceled action');
        }
        if (res === '') {
            pushError('User didn\'t provided any data on textbox');
        }
        if (errorReason.length !== 0) {
            resolve(res);
        }
        else {
            reject(errorReason.toString().replace(RegExp(',', 'gi'), '\n'));
        }
    });
}
export function confirm(msg) {
    return new Promise(function (resolve, reject) {
        var res = window.confirm(msg), errorReason = [], pushError = function (errData) {
            errorReason.push(errData);
        };
        if (res === null) {
            pushError('User canceled action');
        }
        if (errorReason.length !== 0) {
            resolve(res);
        }
        else {
            reject(errorReason.toString().replace(RegExp(',', 'gi'), '\n'));
        }
    });
}
export function getDirFiles(dir) {
    var res = [], fixPath = APP.tools.fixPath;
    const gFileProcess = function (path) {
        const module_fs = require('fs'), module_path = require('path');
        module_fs.readdirSync(fixPath(path)).forEach(function (cFile) {
            var ret, abs = module_path.join(path, cFile);
            if (module_fs.statSync(abs).isDirectory()) {
                ret = gFileProcess(abs);
            }
            else {
                ret = res.push(fixPath(abs));
            }
            return ret;
        });
    };
    gFileProcess(dir);
    return res;
}
export function checkOnlineStatus(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (url === void 0 || url === '') {
                url = 'https://google.com/';
            }
            var fetchTest = yield fetch(url);
            return Number(fetchTest.status) > 199 && Number(fetchTest.status) < 300;
        }
        catch (err) {
            return !1;
        }
    });
}
export function parsePolarity(value) {
    return value - value - value;
}
export function processCheckbox(domName, callback) {
    var res = !1, domCheckbox = document.getElementById(domName);
    if (domCheckbox.checked === !1) {
        res = !0;
    }
    domCheckbox.checked = res;
    if (typeof callback === 'function') {
        callback();
    }
}
export function fixDomNumber(data) {
    if (document.getElementById(data.domName) !== null) {
        const cDom = document.getElementById(data.domName), cValue = cDom.value;
        if (data.maxLength < 0) {
            data.maxLength = cDom.value.length;
        }
        if (Number.isNaN(cValue) === !0) {
            cDom.value = Number(data.def).toString();
        }
        if (Number(cValue) < data.min) {
            cDom.value = Number(data.min).toString();
        }
        if (Number(cValue) > data.max) {
            cDom.value = Number(data.max).toString();
        }
        if (cDom.value.length > data.maxLength) {
            cDom.value = cDom.value.slice(0, data.maxLength);
        }
    }
}
export function callColorPicker(data) {
    if (typeof data === 'object') {
        var fs = require('fs'), errorReason = [];
        const addError = function (msg) {
            errorReason.push(msg);
        };
        if (data.title === void 0) {
            data.title = '';
        }
        if (typeof require === 'undefined') {
            addError('This function is only available on node.js enabled platforms');
        }
        if (typeof data.location !== 'object') {
            addError('User didn\'t specified spawn location data');
        }
        if (typeof data.onApply !== 'function') {
            addError('User didn\'t specified onApply action');
        }
        if (document.getElementById('TMS_COLOR_PICKER') !== null) {
            addError('Color picker is already opened!');
        }
        if (document.getElementById(data.location.spawnLocation) === null) {
            addError('Unable to locate spawn location!');
        }
        if (typeof require !== 'undefined' && fs.existsSync(`${nw.__dirname}/${APP.pathPrefix}/tools/color-picker.htm`) !== !0) {
            addError('Unable to locate color picker form');
        }
        if (errorReason.length === 0) {
            var updateMode = 'number', xPos = data.location.x, yPos = data.location.y, htmlData = APP.fs.readFileSync(`${nw.__dirname}/${APP.pathPrefix}/tools/color-picker.htm`, 'utf8');
            if (typeof data.location.x !== 'string') {
                xPos = '10px';
            }
            if (typeof data.location.y !== 'string') {
                yPos = '10px';
            }
            if (typeof data.outputMode === void 0) {
                data.outputMode = 'hex';
            }
            TMS.append(data.location.spawnLocation, htmlData);
            TMS.css('TMS_COLOR_PICKER', { 'top': `${yPos}`, 'left': `${xPos}` });
            if (data.title !== '') {
                document.getElementById('DIV_TMS_COLOR_PICKER_TOP_LABEL').innerHTML = data.title;
                TMS.css('DIV_TMS_COLOR_PICKER_TOP_LABEL', { 'display': 'block' });
            }
            switch (data.outputMode.toLowerCase()) {
                case 'rgb':
                    const colors = data.color.replace('rgb(', '').replace(')', '').split(' ');
                    document.getElementById('TMS_COLOR_PICKER_NUMBER_R').value = colors[0];
                    document.getElementById('TMS_COLOR_PICKER_NUMBER_G').value = colors[1];
                    document.getElementById('TMS_COLOR_PICKER_NUMBER_B').value = colors[2];
                    break;
                case 'hex':
                    var dataColor = data.color.replace(RegExp('#', 'gi'), '');
                    if (dataColor.length === 6) {
                        dataColor = dataColor + 'ff';
                    }
                    document.getElementById('TMS_COLOR_PICKER_HEX').value = dataColor;
                    updateMode = 'hex';
                    break;
            }
            document.getElementById('BTN_TMS_COLOR_PICKER_CANCEL').onclick = function () {
                TMS.removeDOM('TMS_COLOR_PICKER');
                if (typeof data.onCancel === 'function') {
                    data.onCancel();
                }
            };
            document.getElementById('BTN_TMS_COLOR_PICKER_APPLY').onclick = function () {
                var colorR = document.getElementById('TMS_COLOR_PICKER_NUMBER_R').value, colorG = document.getElementById('TMS_COLOR_PICKER_NUMBER_G').value, colorB = document.getElementById('TMS_COLOR_PICKER_NUMBER_B').value, colorA = document.getElementById('TMS_COLOR_PICKER_NUMBER_A').value, colorHex = document.getElementById('TMS_COLOR_PICKER_HEX').value, colorData = '';
                if (colorHex.length !== 8 || colorHex === '') {
                    colorHex = `#${APP.tools.fixVars(parseInt(colorR, 16))}${APP.tools.fixVars(parseInt(colorG, 16))}${APP.tools.fixVars(parseInt(colorB, 16))}${APP.tools.fixVars(parseInt(colorA, 16))}`;
                }
                switch (data.outputMode.toLowerCase()) {
                    case 'rgb':
                        colorData = `rgb(${colorR} ${colorG} ${colorB} / ${APP.tools.parsePercentage(colorA, 255)})`;
                        break;
                    case 'hex':
                        colorData = colorHex.toUpperCase();
                        break;
                }
                data.onApply(colorData);
                TMS.removeDOM('TMS_COLOR_PICKER');
            };
            APP.tools.updateColorPicker(updateMode);
            if (typeof data.onOpen === 'function') {
                data.onOpen();
            }
        }
        else {
            const errMsg = `ERROR - Unable to open color picker!\nReason: ${errorReason.toString().replace(RegExp(',', 'gi'), '\n')}`;
            console.error(errMsg);
            window.alert(errMsg);
        }
    }
}
export function updateColorPicker(inputSource) {
    if (document.getElementById('TMS_COLOR_PICKER') !== null) {
        if (typeof inputSource !== 'string') {
            inputSource = 'hex';
        }
        var colorR, colorG, colorB, colorA, bgColor = '000';
        switch (inputSource) {
            case 'number':
                APP.tools.fixDomNumber({ def: 0, min: 0, max: 255, maxLength: 3, domName: 'TMS_COLOR_PICKER_NUMBER_R' });
                APP.tools.fixDomNumber({ def: 0, min: 0, max: 255, maxLength: 3, domName: 'TMS_COLOR_PICKER_NUMBER_G' });
                APP.tools.fixDomNumber({ def: 0, min: 0, max: 255, maxLength: 3, domName: 'TMS_COLOR_PICKER_NUMBER_B' });
                APP.tools.fixDomNumber({ def: 0, min: 0, max: 255, maxLength: 3, domName: 'TMS_COLOR_PICKER_NUMBER_A' });
                colorR = document.getElementById('TMS_COLOR_PICKER_NUMBER_R').value;
                colorG = document.getElementById('TMS_COLOR_PICKER_NUMBER_G').value;
                colorB = document.getElementById('TMS_COLOR_PICKER_NUMBER_B').value;
                colorA = document.getElementById('TMS_COLOR_PICKER_NUMBER_A').value;
                document.getElementById('TMS_COLOR_PICKER_RANGE_R').value = colorR;
                document.getElementById('TMS_COLOR_PICKER_RANGE_G').value = colorG;
                document.getElementById('TMS_COLOR_PICKER_RANGE_B').value = colorB;
                document.getElementById('TMS_COLOR_PICKER_RANGE_A').value = colorA;
                bgColor = APP.tools.fixVars(parseInt(colorR, 16)) + APP.tools.fixVars(parseInt(colorG, 16)) + APP.tools.fixVars(parseInt(colorB, 16)) + APP.tools.fixVars(parseInt(colorA, 16));
                document.getElementById('TMS_COLOR_PICKER_HEX').value = bgColor;
                break;
            case 'range':
                colorR = document.getElementById('TMS_COLOR_PICKER_RANGE_R').value;
                colorG = document.getElementById('TMS_COLOR_PICKER_RANGE_G').value;
                colorB = document.getElementById('TMS_COLOR_PICKER_RANGE_B').value;
                colorA = document.getElementById('TMS_COLOR_PICKER_RANGE_A').value;
                document.getElementById('TMS_COLOR_PICKER_NUMBER_R').value = colorR;
                document.getElementById('TMS_COLOR_PICKER_NUMBER_G').value = colorG;
                document.getElementById('TMS_COLOR_PICKER_NUMBER_B').value = colorB;
                document.getElementById('TMS_COLOR_PICKER_NUMBER_A').value = colorA;
                bgColor = APP.tools.fixVars(parseInt(colorR, 16)) + APP.tools.fixVars(parseInt(colorG, 16)) + APP.tools.fixVars(parseInt(colorB, 16)) + APP.tools.fixVars(parseInt(colorA, 16));
                document.getElementById('TMS_COLOR_PICKER_HEX').value = bgColor;
                break;
            case 'hex':
                const rawData = document.getElementById('TMS_COLOR_PICKER_HEX').value.replace(RegExp('#', 'gi'), '');
                if (rawData.length === 8) {
                    const hexColors = rawData.match(/.{2,2}/g);
                    colorR = hexColors[0];
                    colorG = hexColors[1];
                    colorB = hexColors[2];
                    colorA = hexColors[3];
                    bgColor = rawData;
                    document.getElementById('TMS_COLOR_PICKER_RANGE_R').value = parseInt(hexColors[0], 16).toString();
                    document.getElementById('TMS_COLOR_PICKER_RANGE_G').value = parseInt(hexColors[1], 16).toString();
                    document.getElementById('TMS_COLOR_PICKER_RANGE_B').value = parseInt(hexColors[2], 16).toString();
                    document.getElementById('TMS_COLOR_PICKER_RANGE_A').value = parseInt(hexColors[3], 16).toString();
                    document.getElementById('TMS_COLOR_PICKER_NUMBER_R').value = parseInt(hexColors[0], 16).toString();
                    document.getElementById('TMS_COLOR_PICKER_NUMBER_G').value = parseInt(hexColors[1], 16).toString();
                    document.getElementById('TMS_COLOR_PICKER_NUMBER_B').value = parseInt(hexColors[2], 16).toString();
                    document.getElementById('TMS_COLOR_PICKER_NUMBER_A').value = parseInt(hexColors[3], 16).toString();
                }
                break;
        }
        TMS.css('DIV_TMS_COLOR_PICKER_PREVIEW', { 'background-color': `#${bgColor}` });
    }
}
export function closeColorPicker() {
    if (document.getElementById('TMS_COLOR_PICKER') !== null) {
        TMS.triggerClick('BTN_TMS_COLOR_PICKER_CANCEL');
    }
}
export function createTimeout(name, action, timeout = 1000) {
    if (APP.timeoutDatabase[name] !== void 0) {
        clearTimeout(APP.timeoutDatabase[name]);
        delete APP.timeoutDatabase[name];
    }
    APP.timeoutDatabase[name] = setTimeout(function () {
        if (typeof action === 'function') {
            action();
        }
        delete APP.timeoutDatabase[name];
    }, timeout);
}
export function clearTimeoutList(timeoutList) {
    switch (typeof timeoutList) {
        case 'string':
            if (APP.timeoutDatabase[timeoutList] !== void 0) {
                clearTimeout(APP.timeoutDatabase[timeoutList]);
            }
            break;
        case 'object':
            timeoutList.forEach(function (cTimeout) {
                if (APP.timeoutDatabase[cTimeout] !== void 0) {
                    clearTimeout(APP.timeoutDatabase[cTimeout]);
                }
            });
            break;
    }
}
export function createInterval(name, action, interval = 1000) {
    if (APP.intervalDatabase[name] !== void 0) {
        clearInterval(APP.intervalDatabase[name]);
        delete APP.intervalDatabase[name];
    }
    APP.intervalDatabase[name] = setInterval(action, interval);
}
export * from './tools.js';
