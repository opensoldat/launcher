import shortid from "shortid"
import { ControlsSettings, CommonGameCommands } from "../types"

const defaultControlsSettings: ControlsSettings = {
    mouseSensitivity: 80,

    commonBindings: [
        { key: "A", command: CommonGameCommands.Left },
        { key: "D", command: CommonGameCommands.Right },
        { key: "W", command: CommonGameCommands.Jump },
        { key: "S", command: CommonGameCommands.Crouch },
        { key: "X", command: CommonGameCommands.Prone },
        { key: "MOUSE1", command: CommonGameCommands.Fire },
        { key: "MOUSE3", command: CommonGameCommands.Jet },
        { key: "Q", command: CommonGameCommands.ChangeWeapon },
        { key: "R", command: CommonGameCommands.Reload },
        { key: "F", command: CommonGameCommands.DropWeapon },
        { key: "E", command: CommonGameCommands.ThrowGrenade },
        { key: "Space", command: CommonGameCommands.ThrowFlag },
        { key: "T", command: CommonGameCommands.Chat },
        { key: "Y", command: CommonGameCommands.TeamChat },
        { key: "/", command: CommonGameCommands.Cmd },
        { key: "V", command: CommonGameCommands.Radio },
        { key: "Tab", command: CommonGameCommands.WeaponsMenu },
        { key: "F1", command: CommonGameCommands.FragsList },
        { key: "F2", command: CommonGameCommands.StatsMenu },
        { key: "F3", command: CommonGameCommands.MiniMap },
        { key: "ALT+F3", command: CommonGameCommands.GameStats }
    ].map(binding => {
        return {
            id: shortid.generate(),
            ...binding
        }
    }),

    customBindings: [
        { key: "ALT+0", command: 'say "Stick around!"' },
        { key: "ALT+1", command: 'smoke' },
        { key: "ALT+2", command: 'tabac' },
        { key: "ALT+3", command: 'takeoff' },
        { key: "ALT+4", command: 'victory' },
        { key: "ALT+5", command: 'say "What the hell are you?"' },
        { key: "ALT+6", command: 'say "If it bleeds, we can kill it"' },
        { key: "ALT+7", command: 'say "I\'m gonna have me some fun!"' },
        { key: "ALT+8", command: 'say "Bleed, bastard."' },
        { key: "ALT+9", command: 'say "Medic!"' },
        { key: "ALT+A", command: 'say "Die!"' },
        { key: "ALT+B", command: 'say "Son of a bitch!"' },
        { key: "ALT+C", command: 'say "It\'s over Johnny"' },
        { key: "ALT+D", command: 'say "Anytime..."' },
        { key: "ALT+E", command: 'say "No!"' },
        { key: "ALT+F", command: 'say "Yes, Sir!"' },
        { key: "ALT+G", command: 'say "I\'ll be back!"' },
        { key: "ALT+H", command: 'say "Get the flag!"' },
        { key: "ALT+I", command: 'say "OK"' },
        { key: "ALT+J", command: 'say "Help!"' },
        { key: "ALT+K", command: 'say "Sniper!"' },
        { key: "ALT+L", command: 'say "Heavy Machine Gun ahead!"' },
        { key: "ALT+M", command: 'say "Take Cover!"' },
        { key: "ALT+N", command: 'say "I need backup!"' },
        { key: "ALT+O", command: 'say "Follow me!"' },
        { key: "ALT+P", command: 'say "Kiss the ground soldier!"' },
        { key: "ALT+Q", command: 'say "On your feet soldier!"' },
        { key: "ALT+R", command: 'say "Come on!"' },
        { key: "ALT+S", command: 'say "Yeah"' },
        { key: "ALT+T", command: 'say "Return the flag!"' },
        { key: "ALT+U", command: 'say "Hurraaaa!!!"' },
        { key: "ALT+V", command: 'say "I am the law!"' },
        { key: "ALT+W", command: 'say "Engage at will!!!"' },
        { key: "ALT+X", command: 'say "I ain\'t got time to bleed!"' },
        { key: "ALT+Y", command: 'say "You\'re one ugly mother fu**er!"' },
        { key: "ALT+Z", command: 'say "Got it!"' }
    ].map(binding => {
        return {
            id: shortid.generate(),
            ...binding
        }
    })
};

export default defaultControlsSettings;