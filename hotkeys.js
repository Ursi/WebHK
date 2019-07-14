const up = {};
const down = {};
const hotkeys = Object.create(new Proxy({}, {
    get(targ, prop, rec) {
        if (down.hasOwnProperty(prop)) {
            return down[prop];
        } else if (up.hasOwnProperty(prop)) {
            return up[prop];
        }
    },
}));

Object.defineProperties(hotkeys, {
    actionToEvent: {
        value: function(action) {
            switch (action) {
                case 'down':
                    return 'keydown';
                case 'up':
                    return 'keyup';
            }
        },
    },
    active: {
        value: true,
        writable: true,
    },
    add: {
        value: function(hotkey, func, options = {}) {
            const this0 = this;
            options = Object.assign({
                action: 'down',
                on: true,
                context: ()=> true,
                defaultPrevented: true,
                func: func,
                scope: window,
            }, options)

            Object.defineProperties(options, {
                action: {
                    value: options.action,
                    enumerable: true,
                },
                active: {
                    get: function(){
                        return this.on && this.context();
                    },
                    enumerable: true,
                },
                event: {
                    get: function(){
                        return this0.actionToEvent(this.action)
                    },
                    enumerable: true,
                },
            });

            hotkey = String(hotkey);
            let {action, event, scope} = options;
            if (hotkey.length === 1 || this.specialKeys.includes(hotkey)) {
                if (this.listeners.findIndex(l => l.elem == scope && l.event == event) < 0) {
                    this.listeners.add(scope, action);
                }
            }

            this[action][hotkey] = options;
            return options;
        },
    },
    addWith: {
        value: function(options, ...hotkeyList) {
            for (let hotkey of hotkeyList) {
                if (hotkey[2]) {
                    Object.assign(hotkey[2], options);
                } else {
                    hotkey[2] = options;
                }

                this.add.apply(this, hotkey);
            }
        },
    },
    down: {
        value: down,
    },
    listeners: {
        value: (()=>{
            return Object.assign([], {
                add(elem, action) {
                    function listener(e) {
                        if (hotkeys.active) {
                            let hotkey = hotkeys[action][e.code];
                            if (!hotkey) hotkey = hotkeys[action][e.key];
                            if (hotkey && hotkey.active) {
                                if (hotkey.defaultPrevented) e.preventDefault();
                                hotkey.func(e);
                            }
                        }
                    }

                    let event = hotkeys.actionToEvent(action);
                    elem.addEventListener(event, listener);
                    this.push({
                        elem: elem,
                        event: event,
                        listener: listener, //used in hotkeys.remove
                    })
                },
            });
        })(),
    },
    names: {
        value: [
            ' ',
            '!',
            '"',
            '#',
            '$',
            '%',
            '&',
            '\'',
            '(',
            ')',
            '*',
            '+',
            ',',
            '-',
            '.',
            '/',
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            ':',
            ';',
            '<',
            '=',
            '>',
            '?',
            '@',
            'A',
            'Alt',
            'AltLeft',
            'AltRight',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'AudioVolumeDown',
            'AudioVolumeMute',
            'AudioVolumeUp',
            'B',
            'Backquote',
            'Backslash',
            'Backspace',
            'BracketLeft',
            'BracketRight',
            'C',
            'CapsLock',
            'Clear',
            'Comma',
            'ContextMenu',
            'Control',
            'ControlLeft',
            'ControlRight',
            'D',
            'Delete',
            'Digit0',
            'Digit1',
            'Digit2',
            'Digit3',
            'Digit4',
            'Digit5',
            'Digit6',
            'Digit7',
            'Digit8',
            'Digit9',
            'E',
            'End',
            'Enter',
            'Equal',
            'Escape',
            'F',
            'F1',
            'F10',
            'F11',
            'F12',
            'F2',
            'F3',
            'F4',
            'F5',
            'F6',
            'F7',
            'F8',
            'F9',
            'G',
            'H',
            'Home',
            'I',
            'Insert',
            'J',
            'K',
            'KeyA',
            'KeyB',
            'KeyC',
            'KeyD',
            'KeyE',
            'KeyF',
            'KeyG',
            'KeyH',
            'KeyI',
            'KeyJ',
            'KeyK',
            'KeyL',
            'KeyM',
            'KeyN',
            'KeyO',
            'KeyP',
            'KeyQ',
            'KeyR',
            'KeyS',
            'KeyT',
            'KeyU',
            'KeyV',
            'KeyW',
            'KeyX',
            'KeyY',
            'KeyZ',
            'L',
            'M',
            'MediaPlayPause',
            'MediaStop',
            'MediaTrackNext',
            'MediaTrackPrevious',
            'Meta',
            'MetaLeft',
            'MetaRight',
            'Minus',
            'N',
            'NumLock',
            'Numpad0',
            'Numpad1',
            'Numpad2',
            'Numpad3',
            'Numpad4',
            'Numpad5',
            'Numpad6',
            'Numpad7',
            'Numpad8',
            'Numpad9',
            'NumpadAdd',
            'NumpadDecimal',
            'NumpadDivide',
            'NumpadEnter',
            'NumpadMultiply',
            'NumpadSubtract',
            'O',
            'OS',
            'OSLeft',
            'OSRight',
            'P',
            'PageDown',
            'PageUp',
            'Pause',
            'Period',
            'Q',
            'Quote',
            'R',
            'S',
            'ScrollLock',
            'Semicolon',
            'Shift',
            'ShiftLeft',
            'ShiftRight',
            'Slash',
            'Space',
            'T',
            'Tab',
            'U',
            'V',
            'VolumeDown',
            'VolumeMute',
            'VolumeUp',
            'W',
            'X',
            'Y',
            'Z',
            '[',
            '\\',
            ']',
            '^',
            '_',
            '`',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
            '{',
            '|',
            '}',
            '~',
        ],
    },
    parse: {
        value: function(hkName) {
            /*
            ^ - crt,
            ! - alt,
            + - shift,
            A B[ C[ ...]] - A and B together,
            */
            hkName = String(hkName);
            const errorMsg = 'invalid key name';
            if (/^((  )|\S+ )(\S+ )*\S+$/.test(hkName)) {//multi-key syntax
                let keyNames = hkName.trim().split(' ');
                if (hkName.slice(0, 2) == '  ') keyNames.unshift(' ');
                if (keyNames.every(name => this.names.includes(name))) {
                    return {
                        type: 'multi',
                        keyNames: keyNames,
                    };
                } else {
                    throw errorMsg;
                }
            } else if (/^(\^|!|\+){0,3}.+/.test(hkName)) {
                let modifiers = new Set;
                let keyStart = 0;
                while (
                    keyStart < Math.min(3, hkName.length - 1) &&
                    hkName[keyStart].match(/\^|!|\+/)
                ) {
                    let key;
                    switch (hkName[keyStart]) {
                        case '^':
                            key = 'ctrl'; break;
                        case '!':
                            key = 'alt'; break;
                        case '+':
                            key = 'shift'; break;
                    }

                    if (modifiers.has(key)) {
                        throw errorMsg;
                    } else {
                        modifiers.add(key);
                    }

                    keyStart++;
                }

                let keyName = hkName.slice(keyStart);
                if (this.names.includes(keyName)) {
                    return {
                        type: 'single',
                        modifiers: modifiers,
                        keyName: keyName,
                    };
                } else {
                    throw errorMsg;
                }
            } else {
                throw errorMsg;
            }
        },
    },
    remove: {
        value: function(hkName, action = 'down') {
            try {
                let hotkey = this[action][hkName];
                if (Object.keys(this[action]).length === 1) {
                    let event = this.actionToEvent(action);
                    hotkey.scope.removeEventListener(event, this.listeners.find(l =>
                        l.elem == hotkey.scope &&
                        l.event == event
                    ).listener)
                }

                delete this[action][hkName]
            } catch(error) {
                console.error(error);
            }
        }
    },
    specialKeys: {
        value: [
            'Alt',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'AudioVolumeDown',
            'AudioVolumeMute',
            'AudioVolumeUp',
            'Backspace',
            'CapsLock',
            'Clear',
            'ContextMenu',
            'Control',
            'Delete',
            'End',
            'Enter',
            'Escape',
            'F1',
            'F2',
            'F3',
            'F4',
            'F5',
            'F6',
            'F7',
            'F8',
            'F9',
            'F10',
            'F11',
            'F12',
            'Home',
            'Insert',
            'MediaPlayPause',
            'MediaTrackPrevious',
            'NumLock',
            'PageDown',
            'PageUp',
            'Pause',
            'ScrollLock',
            'Shift',
            'Tab',
        ]
    },
    up: {
        value: up,
    },
});

Object.defineProperty(hotkeys, 'state', {
    value: (function(){
        let state = {}
        for (let key of hotkeys.names) {
            state[key] = 'up';
        }

        window.addEventListener('keydown', function(e) {
            hotkeys.state[e.key] = 'down';
            hotkeys.state[e.code] = 'down';
        });

        window.addEventListener('keyup', function(e) {
            hotkeys.state[e.key] = 'up';
            hotkeys.state[e.code] = 'up';
        });

        return state;
    })(),
});

export default hotkeys;

/*
let firefox = [
    ['AltLeft', 'Alt'],
    ['AltRight', 'Alt'],
    ['ArrowDown', 'ArrowDown'],
    ['ArrowLeft', 'ArrowLeft'],
    ['ArrowRight', 'ArrowRight'],
    ['ArrowUp', 'ArrowUp'],
    ['Backquote', '`'],
    ['Backquote', '~'],
    ['Backslash', '\\'],
    ['Backslash', '|'],
    ['Backspace', 'Backspace'],
    ['BracketLeft', '['],
    ['BracketLeft', '{'],
    ['BracketRight', ']'],
    ['BracketRight', '}'],
    ['CapsLock', 'CapsLock'],
    ['Comma', ','],
    ['Comma', '<'],
    ['ContextMenu', 'ContextMenu'],
    ['ControlLeft', 'Control'],
    ['ControlRight', 'Control'],
    ['Delete', 'Delete'],
    ['Digit0', ')'],
    ['Digit0', '0'],
    ['Digit1', '!'],
    ['Digit1', '1'],
    ['Digit2', '2'],
    ['Digit2', '@'],
    ['Digit3', '#'],
    ['Digit3', '3'],
    ['Digit4', '$'],
    ['Digit4', '4'],
    ['Digit5', '%'],
    ['Digit5', '5'],
    ['Digit6', '6'],
    ['Digit6', '^'],
    ['Digit7', '&'],
    ['Digit7', '7'],
    ['Digit8', '*'],
    ['Digit8', '8'],
    ['Digit9', '('],
    ['Digit9', '9'],
    ['End', 'End'],
    ['Enter', 'Enter'],
    ['Equal', '+'],
    ['Equal', '='],
    ['Escape', 'Escape'],
    ['F1', 'F1'],
    ['F10', 'F10'],
    ['F11', 'F11'],
    ['F12', 'F12'],
    ['F2', 'F2'],
    ['F3', 'F3'],
    ['F4', 'F4'],
    ['F5', 'F5'],
    ['F6', 'F6'],
    ['F7', 'F7'],
    ['F8', 'F8'],
    ['F9', 'F9'],
    ['Home', 'Home'],
    ['Insert', 'Insert'],
    ['KeyA', 'A'],
    ['KeyA', 'a'],
    ['KeyB', 'B'],
    ['KeyB', 'b'],
    ['KeyC', 'C'],
    ['KeyC', 'c'],
    ['KeyD', 'D'],
    ['KeyD', 'd'],
    ['KeyE', 'E'],
    ['KeyE', 'e'],
    ['KeyF', 'F'],
    ['KeyF', 'f'],
    ['KeyG', 'G'],
    ['KeyG', 'g'],
    ['KeyH', 'H'],
    ['KeyH', 'h'],
    ['KeyI', 'I'],
    ['KeyI', 'i'],
    ['KeyJ', 'J'],
    ['KeyJ', 'j'],
    ['KeyK', 'K'],
    ['KeyK', 'k'],
    ['KeyL', 'L'],
    ['KeyL', 'l'],
    ['KeyM', 'M'],
    ['KeyM', 'm'],
    ['KeyN', 'N'],
    ['KeyN', 'n'],
    ['KeyO', 'O'],
    ['KeyO', 'o'],
    ['KeyP', 'P'],
    ['KeyP', 'p'],
    ['KeyQ', 'Q'],
    ['KeyQ', 'q'],
    ['KeyR', 'R'],
    ['KeyR', 'r'],
    ['KeyS', 'S'],
    ['KeyS', 's'],
    ['KeyT', 'T'],
    ['KeyT', 't'],
    ['KeyU', 'U'],
    ['KeyU', 'u'],
    ['KeyV', 'V'],
    ['KeyV', 'v'],
    ['KeyW', 'W'],
    ['KeyW', 'w'],
    ['KeyX', 'X'],
    ['KeyX', 'x'],
    ['KeyY', 'Y'],
    ['KeyY', 'y'],
    ['KeyZ', 'Z'],
    ['KeyZ', 'z'],
    ['MediaPlayPause', 'MediaPlayPause'],
    ['MediaStop', 'MediaStop'],
    ['MediaTrackNext', 'MediaTrackNext'],
    ['MediaTrackPrevious', 'MediaTrackPrevious'],
    ['Minus', '-'],
    ['Minus', '_'],
    ['NumLock', 'NumLock'],
    ['Numpad0', '0'],
    ['Numpad0', 'Insert'],
    ['Numpad1', '1'],
    ['Numpad1', 'End'],
    ['Numpad2', '2'],
    ['Numpad2', 'ArrowDown'],
    ['Numpad3', '3'],
    ['Numpad3', 'PageDown'],
    ['Numpad4', '4'],
    ['Numpad4', 'ArrowLeft'],
    ['Numpad5', '5'],
    ['Numpad5', 'Clear'],
    ['Numpad6', '6'],
    ['Numpad6', 'ArrowRight'],
    ['Numpad7', '7'],
    ['Numpad7', 'Home'],
    ['Numpad8', '8'],
    ['Numpad8', 'ArrowUp'],
    ['Numpad9', '9'],
    ['Numpad9', 'PageUp'],
    ['NumpadAdd', '+'],
    ['NumpadDecimal', '.'],
    ['NumpadDecimal', 'Delete'],
    ['NumpadDivide', '/'],
    ['NumpadEnter', 'Enter'],
    ['NumpadMultiply', '*'],
    ['NumpadSubtract', '-'],
    ['OSLeft', 'OS'],
    ['OSRight', 'OS'],
    ['PageDown', 'PageDown'],
    ['PageUp', 'PageUp'],
    ['Pause', 'Pause'],
    ['Period', '.'],
    ['Period', '>'],
    ['Quote', '"'],
    ['Quote', "'"],
    ['ScrollLock', 'ScrollLock'],
    ['Semicolon', ':'],
    ['Semicolon', ';'],
    ['ShiftLeft', 'Shift'],
    ['ShiftRight', 'Shift'],
    ['Slash', '/'],
    ['Slash', '?'],
    ['Space', ' '],
    ['Tab', 'Tab'],
    ['VolumeDown', 'AudioVolumeDown'],
    ['VolumeMute', 'AudioVolumeMute'],
    ['VolumeUp', 'AudioVolumeUp'],
]

let chrome_ = [
    ['', 'AudioVolumeDown'],
    ['', 'AudioVolumeMute'],
    ['', 'AudioVolumeUp'],
    ['', 'MediaPlayPause'],
    ['', 'MediaStop'],
    ['', 'MediaTrackNext'],
    ['', 'MediaTrackPrevious'],
    ['AltLeft', 'Alt'],
    ['AltRight', 'Alt'],
    ['ArrowDown', 'ArrowDown'],
    ['ArrowLeft', 'ArrowLeft'],
    ['ArrowRight', 'ArrowRight'],
    ['ArrowUp', 'ArrowUp'],
    ['Backquote', '`'],
    ['Backquote', '~'],
    ['Backslash', '\\'],
    ['Backslash', '|'],
    ['Backspace', 'Backspace'],
    ['BracketLeft', '['],
    ['BracketLeft', '{'],
    ['BracketRight', ']'],
    ['BracketRight', '}'],
    ['CapsLock', 'CapsLock'],
    ['Comma', ','],
    ['Comma', '<'],
    ['ContextMenu', 'ContextMenu'],
    ['ControlLeft', 'Control'],
    ['ControlRight', 'Control'],
    ['Delete', 'Delete'],
    ['Digit0', ')'],
    ['Digit0', '0'],
    ['Digit1', '!'],
    ['Digit1', '1'],
    ['Digit2', '2'],
    ['Digit2', '@'],
    ['Digit3', '#'],
    ['Digit3', '3'],
    ['Digit4', '$'],
    ['Digit4', '4'],
    ['Digit5', '%'],
    ['Digit5', '5'],
    ['Digit6', '6'],
    ['Digit6', '^'],
    ['Digit7', '&'],
    ['Digit7', '7'],
    ['Digit8', '*'],
    ['Digit8', '8'],
    ['Digit9', '('],
    ['Digit9', '9'],
    ['End', 'End'],
    ['Enter', 'Enter'],
    ['Equal', '+'],
    ['Equal', '='],
    ['Escape', 'Escape'],
    ['F1', 'F1'],
    ['F10', 'F10'],
    ['F11', 'F11'],
    ['F12', 'F12'],
    ['F2', 'F2'],
    ['F3', 'F3'],
    ['F4', 'F4'],
    ['F5', 'F5'],
    ['F6', 'F6'],
    ['F7', 'F7'],
    ['F8', 'F8'],
    ['F9', 'F9'],
    ['Home', 'Home'],
    ['Insert', 'Insert'],
    ['KeyA', 'A'],
    ['KeyA', 'a'],
    ['KeyB', 'B'],
    ['KeyB', 'b'],
    ['KeyC', 'C'],
    ['KeyC', 'c'],
    ['KeyD', 'D'],
    ['KeyD', 'd'],
    ['KeyE', 'E'],
    ['KeyE', 'e'],
    ['KeyF', 'F'],
    ['KeyF', 'f'],
    ['KeyG', 'G'],
    ['KeyG', 'g'],
    ['KeyH', 'H'],
    ['KeyH', 'h'],
    ['KeyI', 'I'],
    ['KeyI', 'i'],
    ['KeyJ', 'J'],
    ['KeyJ', 'j'],
    ['KeyK', 'K'],
    ['KeyK', 'k'],
    ['KeyL', 'L'],
    ['KeyL', 'l'],
    ['KeyM', 'M'],
    ['KeyM', 'm'],
    ['KeyN', 'N'],
    ['KeyN', 'n'],
    ['KeyO', 'O'],
    ['KeyO', 'o'],
    ['KeyP', 'P'],
    ['KeyP', 'p'],
    ['KeyQ', 'Q'],
    ['KeyQ', 'q'],
    ['KeyR', 'R'],
    ['KeyR', 'r'],
    ['KeyS', 'S'],
    ['KeyS', 's'],
    ['KeyT', 'T'],
    ['KeyT', 't'],
    ['KeyU', 'U'],
    ['KeyU', 'u'],
    ['KeyV', 'V'],
    ['KeyV', 'v'],
    ['KeyW', 'W'],
    ['KeyW', 'w'],
    ['KeyX', 'X'],
    ['KeyX', 'x'],
    ['KeyY', 'Y'],
    ['KeyY', 'y'],
    ['KeyZ', 'Z'],
    ['KeyZ', 'z'],
    ['MetaLeft', 'Meta'],
    ['MetaRight', 'Meta'],
    ['Minus', '-'],
    ['Minus', '_'],
    ['NumLock', 'NumLock'],
    ['Numpad0', '0'],
    ['Numpad0', 'Insert'],
    ['Numpad1', '1'],
    ['Numpad1', 'End'],
    ['Numpad2', '2'],
    ['Numpad2', 'ArrowDown'],
    ['Numpad3', '3'],
    ['Numpad3', 'PageDown'],
    ['Numpad4', '4'],
    ['Numpad4', 'ArrowLeft'],
    ['Numpad5', '5'],
    ['Numpad5', 'Clear'],
    ['Numpad6', '6'],
    ['Numpad6', 'ArrowRight'],
    ['Numpad7', '7'],
    ['Numpad7', 'Home'],
    ['Numpad8', '8'],
    ['Numpad8', 'ArrowUp'],
    ['Numpad9', '9'],
    ['Numpad9', 'PageUp'],
    ['NumpadAdd', '+'],
    ['NumpadDecimal', '.'],
    ['NumpadDecimal', 'Delete'],
    ['NumpadDivide', '/'],
    ['NumpadEnter', 'Enter'],
    ['NumpadMultiply', '*'],
    ['NumpadSubtract', '-'],
    ['PageDown', 'PageDown'],
    ['PageUp', 'PageUp'],
    ['Pause', 'Pause'],
    ['Period', '.'],
    ['Period', '>'],
    ['Quote', '"'],
    ['Quote', "'"],
    ['ScrollLock', 'ScrollLock'],
    ['Semicolon', ':'],
    ['Semicolon', ';'],
    ['ShiftLeft', 'Shift'],
    ['ShiftRight', 'Shift'],
    ['Slash', '/'],
    ['Slash', '?'],
    ['Space', ' '],
    ['Tab', 'Tab'],
]
*/
[
    / /,
    /!/,
    /"/,
    /#/,
    /\$/,
    /%/,
    /&/,
    /'/,
    /\(/,
    /\)/,
    /\*/,
    /\+/,
    /,/,
    /-/,
    /\./,
    /\//,
    /0/,
    /1/,
    /2/,
    /3/,
    /4/,
    /5/,
    /6/,
    /7/,
    /8/,
    /9/,
    /:/,
    /;/,
    /</,
    /=/,
    />/,
    /\?/,
    /@/,
    /A/,
    /Alt/,
    /AltLeft/,
    /AltRight/,
    /ArrowDown/,
    /ArrowLeft/,
    /ArrowRight/,
    /ArrowUp/,
    /AudioVolumeDown/,
    /AudioVolumeMute/,
    /AudioVolumeUp/,
    /B/,
    /Backquote/,
    /Backslash/,
    /Backspace/,
    /BracketLeft/,
    /BracketRight/,
    /C/,
    /CapsLock/,
    /Clear/,
    /Comma/,
    /ContextMenu/,
    /Control/,
    /ControlLeft/,
    /ControlRight/,
    /D/,
    /Delete/,
    /Digit0/,
    /Digit1/,
    /Digit2/,
    /Digit3/,
    /Digit4/,
    /Digit5/,
    /Digit6/,
    /Digit7/,
    /Digit8/,
    /Digit9/,
    /E/,
    /End/,
    /Enter/,
    /Equal/,
    /Escape/,
    /F/,
    /F1/,
    /F10/,
    /F11/,
    /F12/,
    /F2/,
    /F3/,
    /F4/,
    /F5/,
    /F6/,
    /F7/,
    /F8/,
    /F9/,
    /G/,
    /H/,
    /Home/,
    /I/,
    /Insert/,
    /J/,
    /K/,
    /KeyA/,
    /KeyB/,
    /KeyC/,
    /KeyD/,
    /KeyE/,
    /KeyF/,
    /KeyG/,
    /KeyH/,
    /KeyI/,
    /KeyJ/,
    /KeyK/,
    /KeyL/,
    /KeyM/,
    /KeyN/,
    /KeyO/,
    /KeyP/,
    /KeyQ/,
    /KeyR/,
    /KeyS/,
    /KeyT/,
    /KeyU/,
    /KeyV/,
    /KeyW/,
    /KeyX/,
    /KeyY/,
    /KeyZ/,
    /L/,
    /M/,
    /MediaPlayPause/,
    /MediaStop/,
    /MediaTrackNext/,
    /MediaTrackPrevious/,
    /Minus/,
    /N/,
    /NumLock/,
    /Numpad0/,
    /Numpad1/,
    /Numpad2/,
    /Numpad3/,
    /Numpad4/,
    /Numpad5/,
    /Numpad6/,
    /Numpad7/,
    /Numpad8/,
    /Numpad9/,
    /NumpadAdd/,
    /NumpadDecimal/,
    /NumpadDivide/,
    /NumpadEnter/,
    /NumpadMultiply/,
    /NumpadSubtract/,
    /O/,
    /OS/,
    /OSLeft/,
    /OSRight/,
    /P/,
    /PageDown/,
    /PageUp/,
    /Pause/,
    /Period/,
    /Q/,
    /Quote/,
    /R/,
    /S/,
    /ScrollLock/,
    /Semicolon/,
    /Shift/,
    /ShiftLeft/,
    /ShiftRight/,
    /Slash/,
    /Space/,
    /T/,
    /Tab/,
    /U/,
    /V/,
    /VolumeDown/,
    /VolumeMute/,
    /VolumeUp/,
    /W/,
    /X/,
    /Y/,
    /Z/,
    /\[/,
    /\\/,
    /\]/,
    /\^/,
    /_/,
    /`/,
    /a/,
    /b/,
    /c/,
    /d/,
    /e/,
    /f/,
    /g/,
    /h/,
    /i/,
    /j/,
    /k/,
    /l/,
    /m/,
    /n/,
    /o/,
    /p/,
    /q/,
    /r/,
    /s/,
    /t/,
    /u/,
    /v/,
    /w/,
    /x/,
    /y/,
    /z/,
    /{/,
    /|/,
    /\}/,
    /~/,
]
/*
 ["MetaLeft","Meta"] chrome
 ["MetaRight","Meta"] chrome

 ["OSLeft","OS"] firefox
 ["OSRight","OS"] firefox
*/
