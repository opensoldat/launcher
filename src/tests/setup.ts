import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { useStaticRendering } from "mobx-react";

import {
    loadSettings as loadControlsSettings,
    saveSettings as saveControlsSettings
} from "../api/soldat/settings/client/controls";

import {
    loadSettings as loadPlayerSettings,
    saveSettings as savePlayerSettings
} from "../api/soldat/settings/client/player";

import {
    loadSettings as loadGraphicsSettings,
    saveSettings as saveGraphicsSettings
} from "../api/soldat/settings/client/graphics";

import {
    loadSettings as loadSoundSettings,
    saveSettings as saveSoundSettings
} from "../api/soldat/settings/client/sound";

import {
    loadSettings as loadServerSettings,
    saveSettings as saveServerSettings
} from "../api/soldat/settings/server";

import {
    start as startServer,
    stop as stopServer
} from "../api/soldat/server";

import {
    start as startClient,
    stop as stopClient
} from "../api/soldat/client";
 
configure({ adapter: new Adapter() });
useStaticRendering(true);

/* We provide the same apis that we have when running the app with Electron. */
window.soldat = {
    client: {
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

    server: {
        loadSettings: loadServerSettings,
        saveSettings: saveServerSettings,

        start: startServer,
        stop: stopServer
    }
}