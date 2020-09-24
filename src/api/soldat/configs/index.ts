import fs from "fs";
import { soldatPaths } from "../paths";
import { ControlsConfig, GraphicsConfig, PlayerConfig, ServerConfig, SoundConfig } from "./types";
import { configToFileData, parseConfigFileData, SoldatConfig } from "./parser";

const loadConfig = <T extends SoldatConfig>(configFilePath: string): Promise<T> => {
    return fs.promises.readFile(configFilePath, { encoding: "utf8" })
        .then(fileData => {
            return parseConfigFileData(fileData) as T;
        })
        .catch((error) => {
            console.warn("An error occurred when reading a config file: ", error);
            return null;
        });
}

const saveConfig = (configFilePath: string, config: SoldatConfig): Promise<void> => {
    return fs.promises.writeFile(configFilePath, configToFileData(config))
        .catch(error => Promise.reject(error.message));
}

const loadControlsConfig = (): Promise<ControlsConfig> => {
    return loadConfig<ControlsConfig>(soldatPaths.clientControlsConfigFile);
}
const saveControlsConfig = (config: ControlsConfig): Promise<void> => {
    return saveConfig(soldatPaths.clientControlsConfigFile, config);
}

const loadCustomBindingsConfig = (): Promise<SoldatConfig> => {
    return loadConfig<SoldatConfig>(soldatPaths.clientCustomBindingsConfigFile);
}
const saveCustomBindingsConfig = (config: SoldatConfig): Promise<void> => {
    return saveConfig(soldatPaths.clientCustomBindingsConfigFile, config);
}

const loadGraphicsConfig = (): Promise<GraphicsConfig> => {
    return loadConfig<GraphicsConfig>(soldatPaths.clientGraphicsConfigFile);
}
const saveGraphicsConfig = (config: GraphicsConfig): Promise<void> => {
    return saveConfig(soldatPaths.clientGraphicsConfigFile, config);
}

const loadPlayerConfig = (): Promise<PlayerConfig> => {
    return loadConfig<PlayerConfig>(soldatPaths.clientPlayerConfigFile);
}
const savePlayerConfig = (config: PlayerConfig): Promise<void> => {
    return saveConfig(soldatPaths.clientPlayerConfigFile, config);
}

const loadSoundConfig = (): Promise<SoundConfig> => {
    return loadConfig<SoundConfig>(soldatPaths.clientSoundConfigFile);
}
const saveSoundConfig = (config: SoundConfig): Promise<void> => {
    return saveConfig(soldatPaths.clientSoundConfigFile, config);
}

const loadServerConfig = (): Promise<ServerConfig> => {
    return loadConfig<ServerConfig>(soldatPaths.serverConfigFile);
}
const saveServerConfig = (config: ServerConfig): Promise<void> => {
    return saveConfig(soldatPaths.serverConfigFile, config);
}
const loadServerMapsList = (): Promise<string[]> => {
    return fs.promises.readFile(soldatPaths.serverMapsList, { encoding: "utf8" })
        .then(fileData => {
            return fileData.split(/\r?\n/).filter(mapName => mapName.length > 0);
        })
        .catch(error => {
            console.warn("An error occurred when reading server's maps list file: ", error);
            return null;
        })
}
const saveServerMapsList = (mapsNames: string[]): Promise<void> => {
    let fileData = "";
    mapsNames.forEach(mapName => {
        if (mapName.length > 0) {
            fileData += mapName + "\r\n";
        }
    });

    return fs.promises.writeFile(soldatPaths.serverMapsList, fileData)
        .catch(error => Promise.reject(error.message));
}

export {
    loadControlsConfig,
    saveControlsConfig,

    loadCustomBindingsConfig,
    saveCustomBindingsConfig,

    loadGraphicsConfig,
    saveGraphicsConfig,

    loadPlayerConfig,
    savePlayerConfig,

    loadSoundConfig,
    saveSoundConfig,

    loadServerConfig,
    saveServerConfig,
    loadServerMapsList,
    saveServerMapsList
}