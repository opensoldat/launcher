import fs from "fs";
import defaultSoundSettings from "src/constants/defaultSoundSettings";
import { SoundSettings } from "src/types";

import { castFromString, castToString } from "../../configs/cast";
import { configToFileData, parseConfigFileData, SoldatConfig } from "../../configs/parser";
import { soldatPaths } from "../../paths";

/* eslint-disable @typescript-eslint/camelcase */

interface SoundConfig extends SoldatConfig {
    cvars: {
        snd_volume: string;
        snd_effects_battle: string;
        snd_effects_explosions: string;
    };
}

const loadSettings = (): Promise<SoundSettings> => {
    return new Promise<SoundSettings>((resolve) => {
        fs.promises.readFile(soldatPaths.clientSoundConfigFile, { encoding: "utf8" })
        .then((fileData) => {
            const config = parseConfigFileData(fileData) as SoundConfig;

            const settings: SoundSettings = {
                volume: castFromString(config.cvars.snd_volume, defaultSoundSettings.volume) as number,
                battleSoundEffects: castFromString(
                    config.cvars.snd_effects_battle,
                    defaultSoundSettings.battleSoundEffects
                ) as boolean,
                explosionsSoundEffects: castFromString(
                    config.cvars.snd_effects_explosions,
                    defaultSoundSettings.explosionsSoundEffects
                ) as boolean
            };
            resolve(settings);
        })
        .catch((error) => {
            console.warn("An error occurred when reading sound config file: ", error);
            resolve(defaultSoundSettings);
        });
    });
};

const saveSettings = (sound: SoundSettings): Promise<void> => {
    const soundConfig: SoundConfig = {
        bindings: null,
        cvars: {
            snd_volume: castToString(sound.volume, defaultSoundSettings.volume),
            snd_effects_battle: castToString(sound.battleSoundEffects, defaultSoundSettings.battleSoundEffects),
            snd_effects_explosions: castToString(sound.explosionsSoundEffects, defaultSoundSettings.explosionsSoundEffects)
        }
    };

    return new Promise<void>((resolve, reject) => {
        fs.promises.writeFile(soldatPaths.clientSoundConfigFile, configToFileData(soundConfig))
        .then(resolve)
        .catch((error) => {
            console.error(error);
            reject(error.message as string);
        });
    });
};

export { loadSettings, saveSettings };