import { defaultsDeep } from "lodash";
import { observable, makeObservable } from "mobx";

import { HexColor, Resolution } from "src/types";
import { GraphicsConfig } from "src/api/soldat/configs/types";
import {
    SoldatColorFormats,
    toBool,
    toHexColor,
    toNumber,
    toSoldatColor,
    toString
} from "../convertUtils";

export enum DisplayModes {
    Window = 0,
    Fullscreen,
    FullscreenWindow
}

interface GraphicsSettingsData {
    displayMode: DisplayModes;
    resolution: Resolution;

    backgroundSceneries: boolean;
    forceBackground: boolean;
    forcedBackgroundTopColor: HexColor;
    forcedBackgroundBottomColor: HexColor;

    limitFPS: boolean;
    maxFPS: number;

    weatherEffects: boolean;
    smoothEdges: boolean;

    interfaceStyle: string;
    scaleInterface: boolean;
    playerIndicator: boolean;
    killsList: boolean;

    verticalSync: boolean;
    dithering: boolean;
}

const defaultGraphicsSettings: GraphicsSettingsData = {
    displayMode: DisplayModes.Window,
    resolution: {
        // This means Soldat will try to match display's resolution.
        width: 0,
        height: 0
    },

    backgroundSceneries: true,
    forceBackground: false,
    forcedBackgroundBottomColor: "#0000FF",
    forcedBackgroundTopColor: "#0000FF",

    limitFPS: true,
    maxFPS: 60,

    weatherEffects: true,
    smoothEdges: false,

    interfaceStyle: "Default",
    playerIndicator: true,
    scaleInterface: true,
    killsList: true,

    verticalSync: false,
    dithering: false
}

class GraphicsSettings implements GraphicsSettingsData {
    @observable displayMode: DisplayModes;
    @observable resolution: Resolution;

    @observable backgroundSceneries: boolean;
    @observable forceBackground: boolean;
    @observable forcedBackgroundTopColor: HexColor;
    @observable forcedBackgroundBottomColor: HexColor;

    @observable limitFPS: boolean;
    @observable maxFPS: number;

    @observable weatherEffects: boolean;
    @observable smoothEdges: boolean;

    @observable interfaceStyle: string;
    @observable scaleInterface: boolean;
    @observable playerIndicator: boolean;
    @observable killsList: boolean;

    @observable verticalSync: boolean;
    @observable dithering: boolean;

    constructor(config?: GraphicsConfig) {
        makeObservable(this);
        this.displayMode = toNumber(config?.cvars.r_fullscreen);
        this.resolution = {
            width: toNumber(config?.cvars.r_screenwidth),
            height: toNumber(config?.cvars.r_screenheight)
        };

        this.backgroundSceneries = toBool(config?.cvars.r_renderbackground);
        this.forceBackground = toBool(config?.cvars.r_forcebg),
        this.forcedBackgroundBottomColor = toHexColor(
            config?.cvars.r_forcebg_color2,
            SoldatColorFormats.ABGR
        );
        this.forcedBackgroundTopColor = toHexColor(
            config?.cvars.r_forcebg_color1,
            SoldatColorFormats.ABGR
        );

        this.limitFPS = toBool(config?.cvars.r_fpslimit);
        this.maxFPS = toNumber(config?.cvars.r_maxfps);
        this.weatherEffects = toBool(config?.cvars.r_weathereffects);
        this.smoothEdges = toBool(config?.cvars.r_smoothedges);

        this.interfaceStyle = config?.cvars.ui_style;
        this.scaleInterface = toBool(config?.cvars.r_scaleinterface);
        this.playerIndicator = toBool(config?.cvars.ui_playerindicator);
        this.killsList = toBool(config?.cvars.ui_killconsole);

        this.verticalSync = toBool(config?.cvars.r_swapeffect);
        this.dithering = toBool(config?.cvars.r_dithering);

        defaultsDeep(this, defaultGraphicsSettings);
    }

    toConfig(): GraphicsConfig {
        // We don't do any validation when converting to config.
        // Theoretically Soldat should handle such scenarios just fine.
        return {
            bindings: null,
            cvars: {
                r_fullscreen: toString(this.displayMode),
                r_renderwidth: "0",
                r_renderheight: "0",
                r_screenwidth: toString(this.resolution?.width),
                r_screenheight: toString(this.resolution?.height),
    
                r_fpslimit: toString(this.limitFPS),
                r_maxfps: toString(this.maxFPS),
    
                r_renderbackground: toString(this.backgroundSceneries),
                r_forcebg: toString(this.forceBackground),
                r_forcebg_color1: toSoldatColor(
                    this.forcedBackgroundTopColor,
                    SoldatColorFormats.ABGR
                ),
                r_forcebg_color2: toSoldatColor(
                    this.forcedBackgroundBottomColor,
                    SoldatColorFormats.ABGR
                ),
                r_weathereffects: toString(this.weatherEffects),
                r_smoothedges: toString(this.smoothEdges),
    
                ui_style: this.interfaceStyle,
                r_scaleinterface: toString(this.scaleInterface),
                ui_playerindicator: toString(this.playerIndicator),
                ui_killconsole: toString(this.killsList),
    
                r_swapeffect: toString(this.verticalSync),
                r_dithering: toString(this.dithering)
            }
        }
    }
}

export default GraphicsSettings;