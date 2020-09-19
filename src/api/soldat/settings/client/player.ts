import fs from "fs";

import {
    ChainStyles,
    HairStyles,
    HeadStyles,
    PlayerSettings,
    SecondaryWeapons
} from "src/types";
import defaultPlayerSettings from "src/constants/defaultPlayerSettings";

import { soldatPaths } from "../../paths";
import { configToFileData, parseConfigFileData, SoldatConfig } from "../../configs/parser";
import { castFromString, castToString, hexColorToSoldat, soldatColorToHex } from "../../configs/cast";

// Names of properties depend on Soldat, so we're ok with disabling eslint for this.
/* eslint-disable @typescript-eslint/camelcase */

interface PlayerConfig extends SoldatConfig {
    cvars: {
        cl_player_name: string;
        cl_player_hair: string;
        cl_player_skin: string;
        cl_player_shirt: string;
        cl_player_pants: string;
        cl_player_jet: string;

        cl_player_hairstyle: string;
        cl_player_headstyle: string;
        cl_player_chainstyle: string;
        cl_player_secwep: string;
    };
}

const loadSettings = (): Promise<PlayerSettings> => {
    return new Promise<PlayerSettings>((resolve) => {
        fs.promises.readFile(soldatPaths.clientPlayerConfigFile, { encoding: "utf8" })
        .then((fileData) => {
            const playerConfig = parseConfigFileData(fileData) as PlayerConfig;

            const settings: PlayerSettings = {
                nickname: playerConfig.cvars.cl_player_name || defaultPlayerSettings.nickname,
                
                hairColor: soldatColorToHex(playerConfig.cvars.cl_player_hair, defaultPlayerSettings.hairColor),
                shirtColor: soldatColorToHex(playerConfig.cvars.cl_player_shirt, defaultPlayerSettings.shirtColor),
                skinColor: soldatColorToHex(playerConfig.cvars.cl_player_skin, defaultPlayerSettings.skinColor),
                pantsColor: soldatColorToHex(playerConfig.cvars.cl_player_pants, defaultPlayerSettings.pantsColor),
                jetColor: soldatColorToHex(playerConfig.cvars.cl_player_jet, defaultPlayerSettings.jetColor),

                headStyle: castFromString(playerConfig.cvars.cl_player_headstyle, defaultPlayerSettings.headStyle) as HeadStyles,
                hairStyle: castFromString(playerConfig.cvars.cl_player_hairstyle, defaultPlayerSettings.hairStyle) as HairStyles,
                chainStyle: castFromString(playerConfig.cvars.cl_player_chainstyle, defaultPlayerSettings.chainStyle) as ChainStyles,
                secondaryWeapon: castFromString(playerConfig.cvars.cl_player_secwep, defaultPlayerSettings.secondaryWeapon) as SecondaryWeapons
            };
            resolve(settings);
        })
        .catch((error) => {
            console.warn("An error occurred when reading player config file: ", error);
            resolve(defaultPlayerSettings);
        });
    });
};

const saveSettings = (player: PlayerSettings): Promise<void> => {
    const playerConfig: PlayerConfig = {
        bindings: null,
        cvars: {
            cl_player_name: player.nickname || defaultPlayerSettings.nickname,
            
            cl_player_hair: hexColorToSoldat(player.hairColor, hexColorToSoldat(defaultPlayerSettings.hairColor)),
            cl_player_skin: hexColorToSoldat(player.skinColor, hexColorToSoldat(defaultPlayerSettings.skinColor)),
            cl_player_shirt: hexColorToSoldat(player.shirtColor, hexColorToSoldat(defaultPlayerSettings.shirtColor)),
            cl_player_pants: hexColorToSoldat(player.pantsColor, hexColorToSoldat(defaultPlayerSettings.pantsColor)),
            cl_player_jet: hexColorToSoldat(player.jetColor, hexColorToSoldat(defaultPlayerSettings.jetColor)),

            cl_player_hairstyle: castToString(player.hairStyle, defaultPlayerSettings.hairStyle),
            cl_player_headstyle: castToString(player.headStyle, defaultPlayerSettings.headStyle),
            cl_player_chainstyle: castToString(player.chainStyle, defaultPlayerSettings.chainStyle),
            cl_player_secwep: castToString(player.secondaryWeapon, defaultPlayerSettings.secondaryWeapon)
        }
    };

    return new Promise<void>((resolve, reject) => {
        fs.promises.writeFile(soldatPaths.clientPlayerConfigFile, configToFileData(playerConfig))
        .then(resolve)
        .catch((error) => {
            console.error(error);
            reject(error.message as string);
        });
    });
};

export { loadSettings, saveSettings };