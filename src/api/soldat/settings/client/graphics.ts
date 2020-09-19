import fs from "fs";

import { DisplayModes, GraphicsSettings } from "src/types";
import defaultSettings from "src/constants/defaultGraphicsSettings";

import {
    castFromString,
    castToString,
    hexColorToSoldat,
    SoldatColorFormats,
    soldatColorToHex
} from "../../configs/cast";
import { configToFileData, parseConfigFileData, SoldatConfig } from "../../configs/parser";
import { soldatPaths } from "../../paths";

// Names of properties depend on Soldat, so we're ok with disabling eslint for this.
/* eslint-disable @typescript-eslint/camelcase */

interface GraphicsConfig extends SoldatConfig {
    cvars: {
        r_fullscreen: string;
        r_renderwidth: string;
        r_renderheight: string;
        r_screenwidth: string;
        r_screenheight: string;

        r_fpslimit: string;
        r_maxfps: string;

        r_renderbackground: string;
        r_forcebg: string;
        r_forcebg_color1: string;
        r_forcebg_color2: string;

        r_smoothedges: string;
        r_weathereffects: string;

        r_scaleinterface: string;
        ui_playerindicator: string;
        ui_killconsole: string;

        r_swapeffect: string;
        r_dithering: string;
    };
}

const loadSettings = (): Promise<GraphicsSettings> => {
    return new Promise<GraphicsSettings>((resolve) => {
        fs.promises.readFile(soldatPaths.clientGraphicsConfigFile, { encoding: "utf8" })
        .then((fileData) => {
            const config = parseConfigFileData(fileData) as GraphicsConfig;
            const settings: GraphicsSettings = {
                displayMode: castFromString(
                    config.cvars.r_fullscreen,
                    defaultSettings.displayMode
                ) as DisplayModes,
                resolution: {
                    width: castFromString(
                        config.cvars.r_screenwidth,
                        defaultSettings.resolution.width
                    ) as number,
                    height: castFromString(
                        config.cvars.r_screenheight,
                        defaultSettings.resolution.height
                    ) as number,
                },

                backgroundSceneries: castFromString(config.cvars.r_renderbackground, defaultSettings.backgroundSceneries) as boolean,
                forceBackground: castFromString(config.cvars.r_forcebg, defaultSettings.forceBackground) as boolean,
                forcedBackgroundBottomColor: soldatColorToHex(
                    config.cvars.r_forcebg_color2,
                    defaultSettings.forcedBackgroundBottomColor,
                    SoldatColorFormats.ABGR
                ),
                forcedBackgroundTopColor: soldatColorToHex(
                    config.cvars.r_forcebg_color1,
                    defaultSettings.forcedBackgroundTopColor,
                    SoldatColorFormats.ABGR
                ),

                limitFPS: castFromString(config.cvars.r_fpslimit, defaultSettings.limitFPS) as boolean,
                maxFPS: castFromString(config.cvars.r_maxfps, defaultSettings.maxFPS) as number,
                weatherEffects: castFromString(config.cvars.r_weathereffects, defaultSettings.weatherEffects) as boolean,
                smoothEdges: castFromString(config.cvars.r_smoothedges, defaultSettings.smoothEdges) as boolean,
                
                scaleInterface: castFromString(config.cvars.r_scaleinterface, defaultSettings.scaleInterface) as boolean,
                playerIndicator: castFromString(config.cvars.ui_playerindicator, defaultSettings.playerIndicator) as boolean,
                killsList: castFromString(config.cvars.ui_killconsole, defaultSettings.killsList) as boolean,

                verticalSync: castFromString(config.cvars.r_swapeffect, defaultSettings.verticalSync) as boolean,
                dithering: castFromString(config.cvars.r_dithering, defaultSettings.dithering) as boolean
            };
            resolve(settings);
        })
        .catch((error) => {
            console.warn("An error occurred when reading graphics config file: ", error);
            resolve(defaultSettings);
        });
    });
};

const saveSettings = (graphics: GraphicsSettings): Promise<void> => {
    const graphicsConfig: GraphicsConfig = {
        bindings: null,
        cvars: {
            r_fullscreen: castToString(graphics.displayMode, defaultSettings.displayMode),
            r_renderwidth: "0",
            r_renderheight: "0",
            r_screenwidth: castToString(graphics.resolution?.width, defaultSettings.resolution.width),
            r_screenheight: castToString(graphics.resolution?.height, defaultSettings.resolution.height),

            r_fpslimit: castToString(graphics.limitFPS, defaultSettings.limitFPS),
            r_maxfps: castToString(graphics.maxFPS, defaultSettings.maxFPS),

            r_renderbackground: castToString(graphics.backgroundSceneries, defaultSettings.backgroundSceneries),
            r_forcebg: castToString(graphics.forceBackground, defaultSettings.forceBackground),
            r_forcebg_color1: hexColorToSoldat(
                graphics.forcedBackgroundTopColor,
                hexColorToSoldat(defaultSettings.forcedBackgroundTopColor),
                SoldatColorFormats.ABGR
            ),
            r_forcebg_color2: hexColorToSoldat(
                graphics.forcedBackgroundBottomColor,
                hexColorToSoldat(defaultSettings.forcedBackgroundBottomColor),
                SoldatColorFormats.ABGR
            ),
            r_weathereffects: castToString(graphics.weatherEffects, defaultSettings.weatherEffects),
            r_smoothedges: castToString(graphics.smoothEdges, defaultSettings.smoothEdges),

            r_scaleinterface: castToString(graphics.scaleInterface, defaultSettings.scaleInterface),
            ui_playerindicator: castToString(graphics.playerIndicator, defaultSettings.playerIndicator),
            ui_killconsole: castToString(graphics.killsList, defaultSettings.killsList),

            r_swapeffect: castToString(graphics.verticalSync, defaultSettings.verticalSync),
            r_dithering: castToString(graphics.dithering, defaultSettings.dithering)
        }
    };

    return new Promise<void>((resolve, reject) => {
        fs.promises.writeFile(soldatPaths.clientGraphicsConfigFile, configToFileData(graphicsConfig))
        .then(resolve)
        .catch((error) => {
            console.error(error);
            reject(error.message as string);
        });
    });
};

export { loadSettings, saveSettings };