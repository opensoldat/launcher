import fs from "fs";
import shortid from "shortid";

import { KeyBinding } from "src/types";
import defaultControlsSettings from "src/constants/defaultControlsSettings";

import { configToFileData, parseConfigFileData, SoldatConfig } from "../../configs/parser";
import { soldatPaths } from "../../paths";

const loadCustomBindings = (): Promise<KeyBinding[]> => {
    return new Promise<KeyBinding[]>((resolve) => {
        fs.promises.readFile(soldatPaths.clientCustomBindingsConfigFile, { encoding: "utf8" })
        .then((fileData) => {
            const bindingsConfig = parseConfigFileData(fileData);
            resolve(
                bindingsConfig.bindings.map(configBinding => {
                    return {
                        id: shortid.generate(),
                        ...configBinding
                    }
                })
            );
        })
        .catch((error) => {
            console.warn("An error occurred when reading bindings config file: ", error);
            resolve(defaultControlsSettings.customBindings);
        });
    });
};

const saveCustomBindings = (bindings: KeyBinding[]): Promise<void> => {
    const bindingsConfig: SoldatConfig = {
        bindings,
        cvars: null
    };

    return new Promise<void>((resolve, reject) => {
        fs.promises.writeFile(soldatPaths.clientCustomBindingsConfigFile, configToFileData(bindingsConfig))
        .then(resolve)
        .catch((error) => {
            console.error(error);
            reject(error.message as string);
        });
    });
};

export { loadCustomBindings, saveCustomBindings };