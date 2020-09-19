import fs from "fs";
import shortid from "shortid";
import unionBy from "lodash/unionBy";

import { CommonKeyBinding, ControlsSettings, KeyBinding } from "src/types";
import defaultControlsSettings from "src/constants/defaultControlsSettings";

import { configToFileData, parseConfigFileData, SoldatConfig } from "../../configs/parser";
import { soldatPaths } from "../../paths";
import { loadCustomBindings, saveCustomBindings } from "./customBindings";

// Names of properties depend on Soldat, so we're ok with disabling eslint for this.
/* eslint-disable @typescript-eslint/camelcase */

interface ControlsConfig extends SoldatConfig {
    // We expect the common bindings in controls.cfg file.
    bindings: CommonKeyBinding[];
    cvars: {
        cl_sensitivity: string;
    };
}

const loadControlsSettings = (): Promise<ControlsSettings> => {
    return new Promise<ControlsSettings>((resolve) => {
        fs.promises.readFile(soldatPaths.clientControlsConfigFile, { encoding: "utf8" })
        .then((fileData) => {
            const controlsConfig = parseConfigFileData(fileData) as ControlsConfig;
            const settings: ControlsSettings = {
                commonBindings: unionBy(
                    controlsConfig.bindings,
                    defaultControlsSettings.commonBindings,
                    "command"
                ).map(binding => {
                    return {
                        id: shortid.generate(),
                        ...binding
                    }
                }),
                customBindings: [],
                mouseSensitivity: controlsConfig.cvars.cl_sensitivity == null
                    ? defaultControlsSettings.mouseSensitivity
                    : Number(controlsConfig.cvars.cl_sensitivity) * 100.0
            };
            resolve(settings);
        })
        .catch((error) => {
            console.warn("An error occurred when reading controls config file: ", error);
            resolve(defaultControlsSettings);
        });
    });
}

const loadSettings = (): Promise<ControlsSettings> => {
    return new Promise<ControlsSettings>((resolve) => {
        // Merge the outcomes of controls.cfg and bindings.cfg.
        Promise.all([loadControlsSettings(), loadCustomBindings()])
        .then(results => {
            const controlsSettings = results[0] as ControlsSettings;
            const customBindings = results[1] as KeyBinding[];

            controlsSettings.customBindings = customBindings;
            resolve(controlsSettings);
        });
    });
}

const saveSettings = (controlsSettings: ControlsSettings): Promise<void> => {
    const controlsConfig: ControlsConfig = {
        bindings: unionBy(controlsSettings.commonBindings, defaultControlsSettings.commonBindings, "command"),
        cvars: {
            cl_sensitivity: (Number(
                controlsSettings.mouseSensitivity == null
                ? defaultControlsSettings.mouseSensitivity
                : controlsSettings.mouseSensitivity
            ) / 100.0).toString()
        }
    };
    
    const writeControlsConfig = new Promise<void>((resolve, reject) => {
        fs.promises.writeFile(soldatPaths.clientControlsConfigFile, configToFileData(controlsConfig))
        .then(resolve)
        .catch((error) => {
            console.error(error);
            reject(error.message as string);
        });
    });

    return new Promise<void>((resolve, reject) => {
        Promise.all([writeControlsConfig, saveCustomBindings(controlsSettings.customBindings)])
        .then(() => resolve())
        .catch((errorMessage: string) => reject(errorMessage))
    });
}

export { loadSettings, saveSettings };
