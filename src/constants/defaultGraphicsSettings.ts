import { DisplayModes, GraphicsSettings } from "../types";

const defaultGraphicsSettings: GraphicsSettings = {
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

    playerIndicator: true,
    scaleInterface: true,
    killsList: true,

    verticalSync: false,
    dithering: false
};

export default defaultGraphicsSettings;