import React from "react";
import { observer, useLocalObservable } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import "./KeyInput.css";

type KeyInputProps = {
    id: string;
    assignedKey: string;
    onKeyChange: (bindingId: string, newKey: string) => void;
}

interface KeyModifiersState {
    alt: boolean;
    ctrl: boolean;
    shift: boolean;

    reset: () => void;
    stringify: () => string;
}

/* Key codes that we get from keyboard events do not match
 * with key names used by SDL, so we need to map them...
 * "code" argument expects a KeyboardEvent.code.
 * 
 * Soldat relies on SDL_GetScancodeFromName.
 * List of those scan code names can be found here:
 * https://github.com/spurious/SDL-mirror/blob/cbc4794cb89071cf83b67247254effd304a4cc5a/src/events/SDL_keyboard.c#L287
 * 
 * Javascript key codes, instead, can be found here:
 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
 */
const jsKeyCodeToSDLScanCodeName = (code: string): string => {
    switch (code) {
        case "KeyA": return "A";
        case "KeyB": return "B";
        case "KeyC": return "C";
        case "KeyD": return "D";
        case "KeyE": return "E";
        case "KeyF": return "F";
        case "KeyG": return "G";
        case "KeyH": return "H";
        case "KeyI": return "I";
        case "KeyJ": return "J";
        case "KeyK": return "K";
        case "KeyL": return "L";
        case "KeyM": return "M";
        case "KeyN": return "N";
        case "KeyO": return "O";
        case "KeyP": return "P";
        case "KeyQ": return "Q";
        case "KeyR": return "R";
        case "KeyS": return "S";
        case "KeyT": return "T";
        case "KeyU": return "U";
        case "KeyV": return "V";
        case "KeyW": return "W";
        case "KeyX": return "X";
        case "KeyY": return "Y";
        case "KeyZ": return "Z";

        case "Digit0": return "0";
        case "Digit1": return "1";
        case "Digit2": return "2";
        case "Digit3": return "3";
        case "Digit4": return "4";
        case "Digit5": return "5";
        case "Digit6": return "6";
        case "Digit7": return "7";
        case "Digit8": return "8";
        case "Digit9": return "9";

        case "F1": return "F1";
        case "F2": return "F2";
        case "F3": return "F3";
        case "F4": return "F4";
        case "F5": return "F5";
        case "F6": return "F6";
        case "F7": return "F7";
        case "F8": return "F8";
        case "F9": return "F9";
        case "F10": return "F10";
        case "F11": return "F11";
        case "F12": return "F12";

        case "Numpad0": return "Keypad 0";
        case "Numpad1": return "Keypad 1";
        case "Numpad2": return "Keypad 2";
        case "Numpad3": return "Keypad 3";
        case "Numpad4": return "Keypad 4";
        case "Numpad5": return "Keypad 5";
        case "Numpad6": return "Keypad 6";
        case "Numpad7": return "Keypad 7";
        case "Numpad8": return "Keypad 8";
        case "Numpad9": return "Keypad 9";
        case "NumpadDecimal": return "Keypad .";
        case "NumpadSubtract": return "Keypad -";
        case "NumpadAdd": return "Keypad +";
        case "NumpadMultiply": return "Keypad *";
        case "NumpadDivide": return "Keypad /";
        case "NumpadEnter": return "Keypad Enter";

        case "Minus": return "-";
        case "Equal": return "=";
        case "BracketLeft": return "[";
        case "BracketRight": return "]";
        case "Semicolon": return ";";
        case "Quote": return "'";
        case "Backquote": return "`";
        case "Backslash": return "\\";
        case "Comma": return ",";
        case "Period": return ".";
        case "Slash": return "/";

        case "Enter": return "Return";
        case "Space": return "Space";
        case "Tab": return "Tab";
        case "Backspace": return "Backspace";
        case "CapsLock": return "CapsLock";
        case "ScrollLock": return "ScrollLock";
        case "NumLock": return "Numlock";
        case "Pause": return "Pause";
        case "Insert": return "Insert";
        case "Delete": return "Delete";
        case "Home": return "Home";
        case "End": return "End";
        case "PageUp": return "PageUp";
        case "PageDown": return "PageDown";

        case "ArrowUp": return "Up";
        case "ArrowDown": return "Down";
        case "ArrowLeft": return "Left";
        case "ArrowRight": return "Right";

        default: return null;
    }
}

const KeyInput: React.FC<KeyInputProps> = props => {
    const [waitingForKey, setWaitingForKey] = React.useState(false);

    /* On keydown and keyup events, we receive a KeyboardEvent. Technically, it
     * contains properties for checking if alt, ctrl and shift keys were pressed,
     * but it doesn't seem reliable. For instance, with Polish keyboard settings,
     * pressing CTRL+ALT+S produces "ś" character, but the KeyboardEvent we receive
     * says that ctrl and alt keys were not pressed...
     * So, we keep track of modifiers ourselves (just setting booleans when ctrl/alt/shift
     * keys were pressed/released). Note, however, that we also want to render those
     * key modifiers in real time, to provide a better user experience. Storing
     * modifiers with React's state is not a great idea, as updates will be asynchronous,
     * and we might not get latest values when reading that state (we need precision when
     * setting the actual key binding; for rendering, we're totally ok with async state).
     * Without using React's state, this could probably also be achieved by storing
     * modifiers with useRef hook, but then we would not get reactivity when rendering,
     * and we would end up with additional logic to handle that.
     * So, instead, we are relying on MobX for this, so that we get both predictable,
     * synchronous state updates, while also maintaining reactivity for rendering.
     */
    const keyModifiers = useLocalObservable<KeyModifiersState>(
        () => ({
            alt: false,
            ctrl: false,
            shift: false,

            reset: (): void => {
                keyModifiers.alt = false;
                keyModifiers.ctrl = false;
                keyModifiers.shift = false;
            },

            stringify: (): string => {
                const result = [];
                if (keyModifiers.alt) {
                    result.push("ALT");
                }
                if (keyModifiers.ctrl) {
                    result.push("CTRL");
                }
                if (keyModifiers.shift) {
                    result.push("SHIFT");
                }
                return result.join("+");
            }
        })
    );

    const clearBinding = (): void => {
        props.onKeyChange(props.id, "");
        setWaitingForKey(false);
    }

    const setNewBinding = (newKey: string): void => {
        props.onKeyChange(props.id, newKey);

        keyModifiers.reset();
        setWaitingForKey(false);
    }

    const startWaitingForKey = (): void => {
        keyModifiers.reset();
        setWaitingForKey(true);
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
        // This provides minor quality of life improvement:
        // we don't scroll the page when setting up/down arrow keys, or space as binding.
        event.preventDefault();

        if (event.key === "Escape") {
            setWaitingForKey(false);
            return;
        }

        // We don't allow binding modifier keys on their own.
        // Soldat doesn't seem to support that as of now.
        if (event.key === "Control" ||
            event.key === "Alt" ||
            event.key === "AltGraph" ||
            event.key === "Shift") {
            if (event.repeat) {
                return;
            }

            /* The AltGr key is a weird case. Pressing it seems to spawn 2 events,
             * one regarding Control key being pressed, and another one about the
             * actual AltGraph key. Blocking the AltGr key entirely (as Soldat most
             * likely doesn't handle it anyway) would probably be ideal, but it's
             * tricky if we get 2 keydown events for this...
             * So, as of now, we go with the flow and follow what Javascript throws
             * at us...
             */
            switch (event.key) {
                case "Control":
                    keyModifiers.ctrl = true;
                    break;
                case "Alt":
                case "AltGraph":
                    keyModifiers.alt = true;
                    break;
                case "Shift":
                    keyModifiers.shift = true;
                    break;
            }
            return;
        }

        const newKey = jsKeyCodeToSDLScanCodeName(event.code);
        if (!newKey) {
            toast.warning("This key is not supported");
            setWaitingForKey(false);
            return;
        }

        const modifiers = keyModifiers.stringify();
        if (modifiers.length === 0) {
            setNewBinding(newKey);
        } else {
            setNewBinding(modifiers + "+" + newKey);
        }
    }

    const handleKeyUp = (event: KeyboardEvent): void => {
        switch (event.key) {
            case "Control":
                keyModifiers.ctrl = false;
                break;
            case "Alt":
                keyModifiers.alt = false;
                break;
            case "Shift":
                keyModifiers.shift = false;
                break;
        }
    }

    const handleMouseDown = (event: MouseEvent): void => {
        if (event.target instanceof Element) {
            // Ignore left mouse button click on the button for clearing binding.
            // In this case, we only want to clear the binding, without assigning
            // new keys.
            if (event.button === 0 && event.target.closest(".js-clear-key-button")) {
                return;
            }
        }

        // TODO: we potentially could also apply modifiers (ctrl/alt/shift) with mouse bindings.
        // This doesn't seem to be supported by Soldat for now, but I'm not sure if it was intentional,
        // or a bug, or something else...
        const newKey = "MOUSE" + (event.button + 1).toString();
        setNewBinding(newKey);
    }

    React.useEffect(() => {
        if (waitingForKey) {
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);
            document.addEventListener("mousedown", handleMouseDown);

            return (): void => {
                document.removeEventListener("keydown", handleKeyDown);
                document.removeEventListener("keyup", handleKeyUp);
                document.removeEventListener("mousedown", handleMouseDown);
            }
        }
    }, [waitingForKey])

    const stringifiedKeyModifiers = keyModifiers.stringify();
    return (
        <div
            className={"key-input" + (waitingForKey ? " waiting-for-key" : "")}
            onClick={startWaitingForKey}>
            <div className="key">
                {waitingForKey
                ? stringifiedKeyModifiers.length === 0 ? "ESC to cancel" : stringifiedKeyModifiers
                : props.assignedKey
                }
            </div>

            {waitingForKey &&
                <div
                    // The js-* class is not for styling, just for selector in Javascript code.
                    className="clear-button js-clear-key-button"
                    onClick={(event): void => {
                        event.stopPropagation();
                        clearBinding();
                    }}>
                    <FontAwesomeIcon icon={faTimesCircle} /> 
                </div>
            }
        </div>
    )
}

export default observer(KeyInput);