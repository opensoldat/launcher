import { contextBridge, ipcRenderer } from "electron";

import {
    loadData,
    saveData
} from "./api/launcher/data";

import {
    start as startServer,
    stop as stopServer
} from "./api/soldat/server";

import {
    start as startClient,
    stop as stopClient
} from "./api/soldat/client";

import {
    ControlsConfig,
    GameConfig,
    GraphicsConfig,
    PlayerConfig,
    ServerConfig,
    SoldatConfig,
    SoundConfig
} from "./api/soldat/configs/types";

import {
    loadControlsConfig,
    saveControlsConfig,

    loadCustomBindingsConfig,
    saveCustomBindingsConfig,

    loadGameConfig,
    saveGameConfig,

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
} from "./api/soldat/configs";

import {
    loadArchiveNames as loadInterfaceArchiveNames,
    loadDirectoryNames as loadInterfaceDirectoryNames
} from "./api/soldat/interfaces";

import {
    loadArchiveNames as loadModArchiveNames
} from "./api/soldat/mods";

declare global {
    interface Window {
        electron: {
            forceClose: () => void;
            interceptCloseRequest: (handleClose: () => void) => void;
        };

        launcher: {
            loadData: () => Promise<string>;
            saveData: (fileContent: string) => Promise<void>;
        };

        soldat: {
            client: {
                loadControlsConfig: () => Promise<ControlsConfig>;
                saveControlsConfig: (config: ControlsConfig) => Promise<void>;

                loadCustomBindingsConfig: () => Promise<SoldatConfig>;
                saveCustomBindingsConfig: (config: SoldatConfig) => Promise<void>;

                loadGameConfig: () => Promise<GameConfig>;
                saveGameConfig: (config: GameConfig) => Promise<void>;

                loadGraphicsConfig: () => Promise<GraphicsConfig>;
                saveGraphicsConfig: (config: GraphicsConfig) => Promise<void>;

                loadPlayerConfig: () => Promise<PlayerConfig>;
                savePlayerConfig: (config: PlayerConfig) => Promise<void>;

                loadSoundConfig: () => Promise<SoundConfig>;
                saveSoundConfig: (config: SoundConfig) => Promise<void>;

                start: (
                    ip: string,
                    port: number,
                    password: string,
                    launchArguments: string,
                    onFailed: (clientId: string, error: Error) => void,
                    onTerminated: (clientId: string) => void,
                    detachedProcess: boolean
                ) => string;
                stop: (clientId: string) => void;
            };

            server: {
                loadConfig: () => Promise<ServerConfig>;
                saveConfig: (config: ServerConfig) => Promise<void>;

                loadMapsList: () => Promise<string[]>;
                saveMapsList: (mapsNames: string[]) => Promise<void>;

                start: (
                    launchArguments: string,
                    onReady: () => void,
                    onFailed: (error: Error) => void,
                    onTerminated: (exitCode: number, stderr: string) => void
                ) => void;
                stop: () => void;
            };

            interfaces: {
                loadArchiveNames: () => Promise<string[]>;
                loadDirectoryNames: () => Promise<string[]>;
            };

            mods: {
                loadArchiveNames: () => Promise<string[]>;
            };
        };
    }
}

contextBridge.exposeInMainWorld(
    "electron",
    {
        forceClose: (): void => {
            ipcRenderer.send("forceClose");
        },
        interceptCloseRequest: (handleClose: () => void): void => {
            ipcRenderer.send("interceptClose");
            ipcRenderer.on("closeRequested", () => {
                handleClose();
            });
        }
    }
)

contextBridge.exposeInMainWorld(
    "launcher",
    {
        loadData,
        saveData
    }
);

contextBridge.exposeInMainWorld(
    "soldat",
    {
        "client": {
            loadControlsConfig,
            saveControlsConfig,

            loadCustomBindingsConfig,
            saveCustomBindingsConfig,

            loadGameConfig,
            saveGameConfig,

            loadGraphicsConfig,
            saveGraphicsConfig,

            loadPlayerConfig,
            savePlayerConfig,

            loadSoundConfig,
            saveSoundConfig,

            start: startClient,
            stop: stopClient
        },

        "server": {
            loadConfig: loadServerConfig,
            saveConfig: saveServerConfig,

            loadMapsList: loadServerMapsList,
            saveMapsList: saveServerMapsList,

            start: startServer,
            stop: stopServer
        },

        "interfaces": {
            loadArchiveNames: loadInterfaceArchiveNames,
            loadDirectoryNames: loadInterfaceDirectoryNames
        },

        "mods": {
            loadArchiveNames: loadModArchiveNames
        }
    }
);