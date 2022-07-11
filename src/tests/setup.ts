import { enableStaticRendering } from "mobx-react";

import {
    start as startServer,
    stop as stopServer
} from "../api/soldat/server";

import {
    start as startClient,
    stop as stopClient
} from "../api/soldat/client";
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
} from "src/api/soldat/configs";

import { play as playDemo } from "src/api/soldat/demos";
import { listFilesNames, listSubdirectoriesNames } from "src/api/directoryListing";
import { soldatPaths } from "src/api/soldat/paths";
 
enableStaticRendering(true);

/* We provide the same apis that we have when running the app with Electron.
 * You can mock them in individual tests. */
window.soldat = {
    client: {
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

    server: {
        loadConfig: loadServerConfig,
        saveConfig: saveServerConfig,
        loadMapsList: loadServerMapsList,
        saveMapsList: saveServerMapsList,

        start: startServer,
        stop: stopServer
    },

    demos: {
        listFilesNames: (): Promise<string[]> => listFilesNames(soldatPaths.demosDirectory, ".sdm"),
        play: playDemo
    },

    interfaces: {
        listArchivesNames: (): Promise<string[]> => listFilesNames(soldatPaths.customInterfacesDirectory, ".sint"),
        listDirectoriesNames: (): Promise<string[]> => listSubdirectoriesNames(soldatPaths.customInterfacesDirectory)
    },

    maps: {
        listArchivesNames: (): Promise<string[]> => listFilesNames(soldatPaths.mapsDirectory, ".smap")
    },

    mods: {
        listArchivesNames: (): Promise<string[]> => listFilesNames(soldatPaths.modsDirectory, ".smod")
    }
}