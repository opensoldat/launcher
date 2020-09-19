import fs from "fs";
import shortid from "shortid";

import { BotDifficulties, ServerSettings, GameModes, Map } from "src/types";
import { castFromString, castToString } from "../configs/cast";

import { configToFileData, parseConfigFileData, SoldatConfig } from "../configs/parser";
import { soldatPaths } from "../paths";

/* eslint-disable @typescript-eslint/camelcase */

interface ServerConfig extends SoldatConfig {
    cvars: {
        sv_gamemode: string;
        sv_timelimit: string;
        //sv_maxgrenades: number;
        sv_bullettime: string;
        sv_friendlyfire: string;
        sv_sniperline: string;

        sv_survivalmode: string;
        sv_survivalmode_clearweapons: string;
        sv_realisticmode: string;
        sv_advancemode: string;
        sv_advancemode_amount: string;

        //sv_respawntime: number;
        //sv_respawntime_minwave: number;
        //sv_respawntime_maxwave: number;

        //sv_gravity: number;
    
        sv_ctf_limit: string;
        sv_dm_limit: string;
        sv_pm_limit: string;
        sv_tm_limit: string;
        sv_rm_limit: string;
        sv_htf_limit: string;
        //sv_htf_pointstime: number;
        sv_inf_limit: string;
        //sv_inf_bluelimit: number;

        bots_random_noteam: string;
        bots_random_alpha: string;
        bots_random_bravo: string;
        bots_random_charlie: string;
        bots_random_delta: string;
        bots_difficulty: string;
        bots_chat: string;
    };
}

const defaultServerSettings: ServerSettings = {
    gameplay: {
        mode: GameModes.CaptureTheFlag,
        styles: {
            realisticEnabled: false,
            
            survivalEnabled: false,
            survivalDestroyWeaponsAfterRound: false,

            advanceEnabled: false,
            advanceAmount: 2
        },

        timeLimit: 15,
        pointsLimits: {
            captureTheFlag: 10,
            deathMatch: 30,
            holdTheFlag: 80,
            infiltration: 90,
            pointMatch: 30,
            ramboMatch: 30,
            teamDeathMatch: 60
        },

        bulletTime: false,
        friendlyFire: false,
        sniperLine: false
    },
    maps: {
        selected: []
    },
    bots: {
        noTeam: 4,
        alpha: 4,
        bravo: 4,
        charlie: 4,
        delta: 4,

        difficulty: BotDifficulties.Normal,
        chat: true
    }
};

const defaultMapsList: Map[] = [
    {
        id: shortid.generate(),
        name: "ctf_Ash"
    }    
];

const readServerConfig = (): Promise<ServerSettings> => {
    return new Promise<ServerSettings>((resolve) => {
        fs.promises.readFile(soldatPaths.serverConfigFile, { encoding: "utf8" })
        .then((fileData) => {
            const serverConfig = parseConfigFileData(fileData) as ServerConfig;
            const serverSettings: ServerSettings = {
                gameplay: {
                    mode: castFromString(serverConfig.cvars.sv_gamemode, defaultServerSettings.gameplay.mode) as GameModes,
                    styles: {
                        realisticEnabled: castFromString(
                            serverConfig.cvars.sv_realisticmode,
                            defaultServerSettings.gameplay.styles.realisticEnabled
                        ) as boolean,

                        survivalEnabled: castFromString(
                            serverConfig.cvars.sv_survivalmode,
                            defaultServerSettings.gameplay.styles.survivalEnabled
                        ) as boolean,
                        survivalDestroyWeaponsAfterRound: castFromString(
                            serverConfig.cvars.sv_survivalmode_clearweapons,
                            defaultServerSettings.gameplay.styles.survivalDestroyWeaponsAfterRound
                        ) as boolean,

                        advanceEnabled: castFromString(
                            serverConfig.cvars.sv_advancemode,
                            defaultServerSettings.gameplay.styles.advanceEnabled
                        ) as boolean,
                        advanceAmount: castFromString(
                            serverConfig.cvars.sv_advancemode_amount,
                            defaultServerSettings.gameplay.styles.advanceAmount
                        ) as number
                    },

                    timeLimit: serverConfig.cvars.sv_timelimit == null
                        ? defaultServerSettings.gameplay.timeLimit
                        : Math.floor(Number(serverConfig.cvars.sv_timelimit) / 3600),
                    pointsLimits: {
                        captureTheFlag: castFromString(
                            serverConfig.cvars.sv_ctf_limit,
                            defaultServerSettings.gameplay.pointsLimits.captureTheFlag
                        ) as number,
                        deathMatch: castFromString(
                            serverConfig.cvars.sv_dm_limit,
                            defaultServerSettings.gameplay.pointsLimits.deathMatch
                        ) as number,
                        holdTheFlag: castFromString(
                            serverConfig.cvars.sv_htf_limit,
                            defaultServerSettings.gameplay.pointsLimits.holdTheFlag
                        ) as number,
                        infiltration: castFromString(
                            serverConfig.cvars.sv_inf_limit,
                            defaultServerSettings.gameplay.pointsLimits.infiltration
                        ) as number,
                        pointMatch: castFromString(
                            serverConfig.cvars.sv_pm_limit,
                            defaultServerSettings.gameplay.pointsLimits.pointMatch
                        ) as number,
                        ramboMatch: castFromString(
                            serverConfig.cvars.sv_rm_limit,
                            defaultServerSettings.gameplay.pointsLimits.ramboMatch
                        ) as number,
                        teamDeathMatch: castFromString(
                            serverConfig.cvars.sv_tm_limit,
                            defaultServerSettings.gameplay.pointsLimits.teamDeathMatch
                        ) as number
                    },

                    bulletTime: castFromString(
                        serverConfig.cvars.sv_bullettime,
                        defaultServerSettings.gameplay.bulletTime
                    ) as boolean,

                    friendlyFire: castFromString(
                        serverConfig.cvars.sv_friendlyfire,
                        defaultServerSettings.gameplay.friendlyFire
                    ) as boolean,
                    
                    sniperLine: castFromString(
                        serverConfig.cvars.sv_sniperline,
                        defaultServerSettings.gameplay.sniperLine
                    ) as boolean
                },
                maps: {
                    selected: []
                },
                bots: {
                    noTeam: castFromString(
                        serverConfig.cvars.bots_random_noteam,
                        defaultServerSettings.bots.noTeam
                    ) as number,
                    alpha: castFromString(
                        serverConfig.cvars.bots_random_alpha,
                        defaultServerSettings.bots.alpha
                    ) as number,
                    bravo: castFromString(
                        serverConfig.cvars.bots_random_bravo,
                        defaultServerSettings.bots.bravo
                    ) as number,
                    charlie: castFromString(
                        serverConfig.cvars.bots_random_charlie,
                        defaultServerSettings.bots.charlie
                    ) as number,
                    delta: castFromString(
                        serverConfig.cvars.bots_random_delta,
                        defaultServerSettings.bots.delta
                    ) as number,

                    difficulty: castFromString(
                        serverConfig.cvars.bots_difficulty,
                        defaultServerSettings.bots.difficulty
                    ) as BotDifficulties,
                    chat: castFromString(
                        serverConfig.cvars.bots_chat,
                        defaultServerSettings.bots.chat
                    ) as boolean
                }
            };

            resolve(serverSettings);
        })
        .catch((error) => {
            console.warn("An error occurred when reading server config file: ", error);
            resolve(defaultServerSettings);
        });
    });
};

const readMapsList = (): Promise<Map[]> => {
    return new Promise<Map[]>((resolve) => {
        fs.promises.readFile(soldatPaths.serverMapsList, { encoding: "utf8" })
        .then((fileData) => {
            const mapsList: Map[] = [];

            const mapsNames = fileData.split(/\r?\n/);
            mapsNames.forEach((mapName: string) => {
                // Ignore empty lines.
                if (mapName.length === 0) {
                    return;
                }

                mapsList.push({
                    id: shortid.generate(),
                    name: mapName
                });
            });

            resolve(mapsList);
        })
        .catch((error) => {
            console.warn("An error occurred when reading server mapslist file: ", error);
            resolve(defaultMapsList);
        });
    });
}

const loadSettings = (): Promise<ServerSettings> => {
    return new Promise<ServerSettings>((resolve) => {
        // Merge the outcomes of server.cfg and mapslist.txt.
        Promise.all([readServerConfig(), readMapsList()])
        .then(results => {
            const serverSettings = results[0] as ServerSettings;
            const mapsList = results[1] as Map[];

            serverSettings.maps.selected = mapsList;
            resolve(serverSettings);
        });
    });
};

const saveSettings = (serverSettings: ServerSettings): Promise<void> => {
    const serverConfig: ServerConfig = {
        bindings: null,
        cvars: {
            sv_gamemode: castToString(serverSettings.gameplay.mode, defaultServerSettings.gameplay.mode),
            sv_timelimit: (serverSettings.gameplay.timeLimit * 3600).toString(),

            sv_advancemode: castToString(
                serverSettings.gameplay.styles.advanceEnabled,
                defaultServerSettings.gameplay.styles.advanceEnabled
            ),
            sv_advancemode_amount: castToString(
                serverSettings.gameplay.styles.advanceAmount,
                defaultServerSettings.gameplay.styles.advanceAmount
            ),
            sv_realisticmode: castToString(
                serverSettings.gameplay.styles.realisticEnabled,
                defaultServerSettings.gameplay.styles.realisticEnabled
            ),
            sv_survivalmode: castToString(
                serverSettings.gameplay.styles.survivalEnabled,
                defaultServerSettings.gameplay.styles.survivalEnabled
            ),
            sv_survivalmode_clearweapons: castToString(
                serverSettings.gameplay.styles.survivalDestroyWeaponsAfterRound,
                defaultServerSettings.gameplay.styles.survivalDestroyWeaponsAfterRound
            ),

            sv_ctf_limit: castToString(
                serverSettings.gameplay.pointsLimits.captureTheFlag,
                defaultServerSettings.gameplay.pointsLimits.captureTheFlag
            ),
            sv_dm_limit: castToString(
                serverSettings.gameplay.pointsLimits.deathMatch,
                defaultServerSettings.gameplay.pointsLimits.deathMatch
            ),
            sv_htf_limit: castToString(
                serverSettings.gameplay.pointsLimits.holdTheFlag,
                defaultServerSettings.gameplay.pointsLimits.holdTheFlag
            ),
            sv_inf_limit: castToString(
                serverSettings.gameplay.pointsLimits.infiltration,
                defaultServerSettings.gameplay.pointsLimits.infiltration
            ),
            sv_pm_limit: castToString(
                serverSettings.gameplay.pointsLimits.pointMatch,
                defaultServerSettings.gameplay.pointsLimits.pointMatch
            ),
            sv_rm_limit: castToString(
                serverSettings.gameplay.pointsLimits.ramboMatch,
                defaultServerSettings.gameplay.pointsLimits.ramboMatch
            ),
            sv_tm_limit: castToString(
                serverSettings.gameplay.pointsLimits.teamDeathMatch,
                defaultServerSettings.gameplay.pointsLimits.teamDeathMatch
            ),

            sv_bullettime: castToString(
                serverSettings.gameplay.bulletTime,
                defaultServerSettings.gameplay.bulletTime
            ),
            sv_friendlyfire: castToString(
                serverSettings.gameplay.friendlyFire,
                defaultServerSettings.gameplay.friendlyFire
            ),
            sv_sniperline: castToString(
                serverSettings.gameplay.sniperLine,
                defaultServerSettings.gameplay.sniperLine
            ),

            bots_random_alpha: castToString(
                serverSettings.bots.alpha,
                defaultServerSettings.bots.alpha
            ),
            bots_random_bravo: castToString(
                serverSettings.bots.bravo,
                defaultServerSettings.bots.bravo
            ),
            bots_random_charlie: castToString(
                serverSettings.bots.charlie,
                defaultServerSettings.bots.charlie
            ),
            bots_random_delta: castToString(
                serverSettings.bots.delta,
                defaultServerSettings.bots.delta
            ),
            bots_random_noteam: castToString(
                serverSettings.bots.noTeam,
                defaultServerSettings.bots.noTeam
            ),
            bots_difficulty: castToString(
                serverSettings.bots.difficulty,
                defaultServerSettings.bots.difficulty
            ),
            bots_chat: castToString(
                serverSettings.bots.chat,
                defaultServerSettings.bots.chat
            )
        }
    };

    const writeServerConfig = new Promise<void>((resolve, reject) => {
        fs.promises.writeFile(soldatPaths.serverConfigFile, configToFileData(serverConfig))
        .then(resolve)
        .catch((error) => {
            console.error(error);
            reject("Writing server config file failed.\n" + error.message);
        });
    });

    let mapsListFileData = "";
    serverSettings.maps.selected.forEach((map) => {
        mapsListFileData += map.name + "\r\n";
    });

    const writeMapsList = new Promise<void>((resolve, reject) => {
        fs.promises.writeFile(soldatPaths.serverMapsList, mapsListFileData)
        .then(resolve)
        .catch((error) => {
            console.error(error);
            reject("Writing maps list file failed.\n" + error.message);
        });
    });

    return new Promise<void>((resolve, reject) => {
        Promise.all([writeServerConfig, writeMapsList])
        .then(() => resolve())
        .catch(reject);
    });
};

export { loadSettings, saveSettings };