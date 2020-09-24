import { defaults, unionBy } from "lodash";
import { observable, toJS } from "mobx";
import shortid from "shortid";

import { CommonGameCommands, CommonKeyBinding } from "src/types";
import { ControlsConfig } from "src/api/soldat/configs/types";
import { toNumber, toString } from "../convertUtils";

interface ControlsSettingsData {
    bindings: CommonKeyBinding[];

    // Range [0, 100]
    mouseSensitivity: number;
}

const defaultControls: ControlsSettingsData = {
    mouseSensitivity: 80,

    bindings: [
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
    })
}

class ControlsSettings implements ControlsSettingsData {
    @observable bindings: CommonKeyBinding[];
    @observable mouseSensitivity: number;

    constructor(config?: ControlsConfig) {
        this.bindings = unionBy(
            config?.bindings,
            defaultControls.bindings,
            "command"
        ).map(binding => {
            return {
                id: shortid.generate(),
                ...binding
            }
        });

        this.mouseSensitivity = toNumber(config?.cvars.cl_sensitivity);
        if (this.mouseSensitivity !== undefined) {
            this.mouseSensitivity *= 100.0;
        }

        defaults(this, defaultControls);
    };

    toConfig(): ControlsConfig {
        return {
            bindings: toJS(this.bindings),
            cvars: {
                cl_sensitivity: toString(this.mouseSensitivity / 100.0)
            }
        }
    };

    getBindingByCommand(command: CommonGameCommands): CommonKeyBinding {
        return this.bindings.find(
            binding => binding.command === command
        );
    }

    getBindingById(id: string): CommonKeyBinding {
        return this.bindings.find(
            binding => binding.id === id
        );
    }
}

export default ControlsSettings;