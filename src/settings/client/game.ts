import { defaults } from "lodash";
import { observable, makeObservable } from "mobx";
import { GameConfig } from "src/api/soldat/configs/types";
import { toBool, toString } from "../convertUtils";

// Looking at Soldat's code, language setting might not work.
// I didn't dig too deep, but at first glance it seems to expect
// files with .mo extension, which seem to be missing.

// actionSnap is commented out because I'm not really sure what it's
// supposed to achieve, and don't really feel like going through
// Soldat's code now... at first glance it looks like yet another
// screenshot feature.

interface GameSettingsData {
//    language: string;
//    actionSnap: boolean;
    screenShake: boolean;
    screenshotAfterRound: boolean;
    allowServerMods: boolean;
}

const defaultGameSettings: GameSettingsData = {
//    actionSnap: false,
    allowServerMods: true,
//    language: "en",
    screenShake: true,
    screenshotAfterRound: false
}

class GameSettings implements GameSettingsData {
//    @observable language;
//    @observable actionSnap;
    @observable screenShake: boolean;
    @observable screenshotAfterRound: boolean;
    @observable allowServerMods: boolean;

    constructor(config?: GameConfig) {
        makeObservable(this);
        //        this.language = config.cvars.cl_lang;
        //        this.actionSnap = toBool(config.cvars.cl_actionsnap);
        this.allowServerMods = toBool(config?.cvars.cl_servermods);
        this.screenShake = toBool(config?.cvars.cl_screenshake);
        this.screenshotAfterRound = toBool(config?.cvars.cl_endscreenshot);

        defaults(this, defaultGameSettings);
    }

    toConfig(): GameConfig {
        return {
            bindings: null,
            cvars: {
//                cl_lang: toString(this.language),
//                cl_actionsnap: toString(this.actionSnap),
                cl_endscreenshot: toString(this.screenshotAfterRound),
                cl_screenshake: toString(this.screenShake),
                cl_servermods: toString(this.allowServerMods)
            }
        }
    }
}

export default GameSettings;