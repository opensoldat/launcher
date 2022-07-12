import { defaults } from "lodash";
import { observable, makeObservable } from "mobx";
import { SoundConfig } from "src/api/soldat/configs/types";
import { toBool, toNumber, toString } from "../convertUtils";

interface SoundSettingsData {
    volume: number;
    battleSoundEffects: boolean;
    explosionsSoundEffects: boolean;
}

const defaultSoundSettings: SoundSettingsData = {
    // [0, 100] range.
    volume: 50,
    battleSoundEffects: false,
    explosionsSoundEffects: false
}

class SoundSettings implements SoundSettingsData {
    @observable volume: number;
    @observable battleSoundEffects: boolean;
    @observable explosionsSoundEffects: boolean;

    constructor(config?: SoundConfig) {
        makeObservable(this);
        this.volume = toNumber(config?.cvars.snd_volume);
        this.battleSoundEffects = toBool(config?.cvars.snd_effects_battle);
        this.explosionsSoundEffects = toBool(config?.cvars.snd_effects_explosions);

        defaults(this, defaultSoundSettings);
    }

    toConfig(): SoundConfig {
        // We don't do any validation when converting to config.
        // Theoretically Soldat should handle such scenarios just fine.
        return {
            bindings: null,
            cvars: {
                snd_volume: toString(this.volume),
                snd_effects_battle: toString(this.battleSoundEffects),
                snd_effects_explosions: toString(this.explosionsSoundEffects)
            }
        }
    }
}

export default SoundSettings;