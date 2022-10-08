import { contextBridge, ipcRenderer } from "electron";

import { loadData, saveData } from "./api/launcher/data";

import { start as startServer, stop as stopServer } from "./api/soldat/server";

import { start as startClient, stop as stopClient } from "./api/soldat/client";

import {
  ControlsConfig,
  GameConfig,
  GraphicsConfig,
  PlayerConfig,
  ServerConfig,
  SoldatConfig,
  SoundConfig,
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
  saveServerMapsList,
} from "./api/soldat/configs";

import { play as playDemo } from "./api/soldat/demos";

import {
  listFilesNames,
  listSubdirectoriesNames,
} from "./api/directoryListing";
import { soldatPaths } from "./api/soldat/paths";

declare global {
  interface Window {
    electron: {
      forceClose: () => void;
      interceptCloseRequest: (handleClose: () => void) => void;
      onSoldatLink: (handleSoldatLink: (soldatLink: string) => void) => void;
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

      demos: {
        listFilesNames: () => Promise<string[]>;
        play: (fileName: string, onFailed: (error: Error) => void) => void;
      };

      interfaces: {
        listArchivesNames: () => Promise<string[]>;
        listDirectoriesNames: () => Promise<string[]>;
      };

      maps: {
        listArchivesNames: () => Promise<string[]>;
      };

      mods: {
        listArchivesNames: () => Promise<string[]>;
      };
    };
  }
}

contextBridge.exposeInMainWorld("electron", {
  forceClose: (): void => {
    ipcRenderer.send("forceClose");
  },
  interceptCloseRequest: (handleClose: () => void): void => {
    ipcRenderer.send("interceptClose");
    ipcRenderer.on("closeRequested", () => {
      handleClose();
    });
  },
  onSoldatLink: (handleSoldatLink: (soldatLink: string) => void): void => {
    ipcRenderer.on("soldatLink", (event, link) => {
      handleSoldatLink(link);
    });
  },
});

contextBridge.exposeInMainWorld("launcher", {
  loadData,
  saveData,
});

contextBridge.exposeInMainWorld("soldat", {
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
    stop: stopClient,
  },

  server: {
    loadConfig: loadServerConfig,
    saveConfig: saveServerConfig,

    loadMapsList: loadServerMapsList,
    saveMapsList: saveServerMapsList,

    start: startServer,
    stop: stopServer,
  },

  demos: {
    listFilesNames: (): Promise<string[]> =>
      listFilesNames(soldatPaths.demosDirectory, ".sdm"),
    play: playDemo,
  },

  interfaces: {
    listArchivesNames: (): Promise<string[]> =>
      listFilesNames(soldatPaths.customInterfacesDirectory, ".sint"),
    listDirectoriesNames: (): Promise<string[]> =>
      listSubdirectoriesNames(soldatPaths.customInterfacesDirectory),
  },

  maps: {
    listArchivesNames: (): Promise<string[]> =>
      listFilesNames(soldatPaths.mapsDirectory, ".smap"),
  },

  mods: {
    listArchivesNames: (): Promise<string[]> =>
      listFilesNames(soldatPaths.modsDirectory, ".smod"),
  },
});
