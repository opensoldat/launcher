import { contextBridge } from "electron";

import {
    ControlsSettings,
    PlayerSettings,
    GraphicsSettings,
    SoundSettings,
    ServerSettings,
} from "./types";

import {
    loadSettings as loadControlsSettings,
    saveSettings as saveControlsSettings
} from "./api/soldat/settings/client/controls";

import {
    loadSettings as loadGraphicsSettings,
    saveSettings as saveGraphicsSettings
} from "./api/soldat/settings/client/graphics";

import {
    loadSettings as loadPlayerSettings,
    saveSettings as savePlayerSettings
} from "./api/soldat/settings/client/player";

import {
    loadSettings as loadSoundSettings,
    saveSettings as saveSoundSettings
} from "./api/soldat/settings/client/sound";

import {
    loadSettings as loadServerSettings,
    saveSettings as saveServerSettings
} from "./api/soldat/settings/server";

import {
    start as startServer,
    stop as stopServer
} from "./api/soldat/server";

import {
    start as startClient,
    stop as stopClient
} from "./api/soldat/client";

declare global {
    interface Window {
        soldat: {
            client: {
                loadControlsSettings: () => Promise<ControlsSettings>;
                saveControlsSettings: (controlsSettings: ControlsSettings) => Promise<void>;

                loadGraphicsSettings: () => Promise<GraphicsSettings>;
                saveGraphicsSettings: (graphicsSettings: GraphicsSettings) => Promise<void>;

                loadPlayerSettings: () => Promise<PlayerSettings>;
                savePlayerSettings: (playerSettings: PlayerSettings) => Promise<void>;

                loadSoundSettings: () => Promise<SoundSettings>;
                saveSoundSettings: (soundSettings: SoundSettings) => Promise<void>;

                start: (
                    ip: string,
                    port: number,
                    password: string,
                    onStartupFailed: (clientId: string, error: Error) => void,
                    onTerminated: (clientId: string) => void,
                    detachedProcess: boolean
                ) => string;
                stop: (clientId: string) => void;
            };

            server: {
                loadSettings: () => Promise<ServerSettings>;
                saveSettings: (serverSettings: ServerSettings) => Promise<void>;

                start: (port: number,
                        onServerReady: (port: number) => void,
                        onServerStartupFailed: (error: Error) => void,
                        onServerTerminated: (exitCode: number, stderr: string) => void) => void;
                stop: () => void;
            };
        };
    }
}

contextBridge.exposeInMainWorld(
    "soldat",
    {
        "client": {
            loadControlsSettings,
            saveControlsSettings,

            loadGraphicsSettings,
            saveGraphicsSettings,

            loadPlayerSettings,
            savePlayerSettings,

            loadSoundSettings,
            saveSoundSettings,

            start: startClient,
            stop: stopClient
        },

        "server": {
            loadSettings: loadServerSettings,
            saveSettings: saveServerSettings,

            start: startServer,
            stop: stopServer
        }
    }
);