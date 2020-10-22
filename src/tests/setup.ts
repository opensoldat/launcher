import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { useStaticRendering } from "mobx-react";

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

import {
    loadArchiveNames,
    loadDirectoryNames
} from "src/api/soldat/interfaces";
 
configure({ adapter: new Adapter() });
useStaticRendering(true);

/* We provide the same apis that we have when running the app with Electron. */
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

    interfaces: {
        loadArchiveNames,
        loadDirectoryNames
    }
}