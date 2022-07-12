import { defaultsDeep } from "lodash";
import { computed, observable, makeObservable } from "mobx";
import { ServerConfig } from "src/api/soldat/configs/types";
import { GameModes } from "src/types";
import { toBool, toNumber, toString } from "../convertUtils";
import NetworkSettings from "./network";

export interface GameStylesSettings {
    realisticEnabled: boolean;

    survivalEnabled: boolean;
    survivalDestroyWeaponsAfterRound: boolean;

    advanceEnabled: boolean;
    advanceAmount: number;
}

export enum BotDifficulties {
    Stupid = 300,
    Poor = 200,
    Normal = 100,
    Hard = 50,
    Impossible = 10
}

export interface BotsSettings {
    noTeam: number;
    alpha: number;
    bravo: number;
    charlie: number;
    delta: number;
    
    difficulty: BotDifficulties;
    chat: boolean;
}

export interface PointsLimits {
    captureTheFlag: number;
    deathMatch: number;
    holdTheFlag: number;
    infiltration: number;
    pointMatch: number;
    ramboMatch: number;
    teamDeathMatch: number;
}

export interface GameplaySettings {
    mode: GameModes;
    styles: GameStylesSettings;

    // We store time limit in minutes, but it must be multiplied
    // by 3600 for Soldat to understand it.
    timeLimit: number;
    pointsLimits: PointsLimits;

    // We store the times in seconds, whereas Soldat operates on
    // ticks. 1 second = 60 ticks.
    respawnTime: number;
    minWaveRespawnTime: number;
    maxWaveRespawnTime: number;

    bulletTime: boolean;
    friendlyFire: boolean;
    sniperLine: boolean;
}

export enum BonusFrequencies {
    Never,
    VeryRare,
    Rare,
    Average,
    Frequent,
    VeryFrequent
}

export interface BonusesSettings {
    frequency: BonusFrequencies;

    berserker: boolean;
    cluster: boolean;
    flamer: boolean;
    predator: boolean;
    vest: boolean;
}

interface ServerSettingsData {
    gameplay: GameplaySettings;
    bots: BotsSettings;
    bonuses: BonusesSettings;
}

const defaultServerSettings: ServerSettingsData = {
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

        respawnTime: 6,
        minWaveRespawnTime: 2,
        maxWaveRespawnTime: 4,

        bulletTime: false,
        friendlyFire: false,
        sniperLine: false
    },
    bots: {
        noTeam: 4,
        alpha: 4,
        bravo: 4,
        charlie: 0,
        delta: 0,

        difficulty: BotDifficulties.Normal,
        chat: true
    },
    bonuses: {
        frequency: BonusFrequencies.Never,
        berserker: false,
        cluster: false,
        flamer: false,
        predator: false,
        vest: false
    }
};

class ServerSettings implements ServerSettingsData {
    @observable gameplay: GameplaySettings;
    @observable bots: BotsSettings;
    @observable bonuses: BonusesSettings;
    @observable network: NetworkSettings;

    constructor(config?: ServerConfig) {
        makeObservable(this);
        this.gameplay = {
            mode: toNumber(config?.cvars.sv_gamemode),
            styles: {
                realisticEnabled: toBool(config?.cvars.sv_realisticmode),

                survivalEnabled: toBool(config?.cvars.sv_survivalmode),
                survivalDestroyWeaponsAfterRound: toBool(config?.cvars.sv_survivalmode_clearweapons),

                advanceEnabled: toBool(config?.cvars.sv_advancemode),
                advanceAmount: toNumber(config?.cvars.sv_advancemode_amount)
            },

            timeLimit: toNumber(config?.cvars.sv_timelimit),
            pointsLimits: {
                captureTheFlag: toNumber(config?.cvars.sv_ctf_limit),
                deathMatch: toNumber(config?.cvars.sv_dm_limit),
                holdTheFlag: toNumber(config?.cvars.sv_htf_limit),
                infiltration: toNumber(config?.cvars.sv_inf_limit),
                pointMatch: toNumber(config?.cvars.sv_pm_limit),
                ramboMatch: toNumber(config?.cvars.sv_rm_limit),
                teamDeathMatch: toNumber(config?.cvars.sv_tm_limit)
            },

            respawnTime: toNumber(config?.cvars.sv_respawntime),
            minWaveRespawnTime: toNumber(config?.cvars.sv_respawntime_minwave),
            maxWaveRespawnTime: toNumber(config?.cvars.sv_respawntime_maxwave),

            bulletTime: toBool(config?.cvars.sv_bullettime),
            friendlyFire: toBool(config?.cvars.sv_friendlyfire),
            sniperLine: toBool(config?.cvars.sv_sniperline),
        };

        this.bots = {
            noTeam: toNumber(config?.cvars.bots_random_noteam),
            alpha: toNumber(config?.cvars.bots_random_alpha),
            bravo: toNumber(config?.cvars.bots_random_bravo),
            charlie: toNumber(config?.cvars.bots_random_charlie),
            delta: toNumber(config?.cvars.bots_random_delta),

            difficulty: toNumber(config?.cvars.bots_difficulty),
            chat: toBool(config?.cvars.bots_chat)
        }

        this.bonuses = {
            frequency: toNumber(config?.cvars.sv_bonus_frequency),

            berserker: toBool(config?.cvars.sv_bonus_berserker),
            cluster: toBool(config?.cvars.sv_bonus_cluster),
            flamer: toBool(config?.cvars.sv_bonus_flamer),
            predator: toBool(config?.cvars.sv_bonus_predator),
            vest: toBool(config?.cvars.sv_bonus_vest)
        }

        // Apply conversions, in case we don't operate on the
        // same units of measurement as Soldat.
        if (this.gameplay.timeLimit !== undefined) {
            this.gameplay.timeLimit = Math.floor(this.gameplay.timeLimit / 3600);
        }

        if (this.gameplay.respawnTime != null) {
            this.gameplay.respawnTime = Math.round(this.gameplay.respawnTime / 60);
        }

        if (this.gameplay.minWaveRespawnTime != null) {
            this.gameplay.minWaveRespawnTime = Math.round(this.gameplay.minWaveRespawnTime / 60);
        }

        if (this.gameplay.maxWaveRespawnTime != null) {
            this.gameplay.maxWaveRespawnTime = Math.round(this.gameplay.maxWaveRespawnTime / 60);
        }

        this.network = new NetworkSettings(config);

        defaultsDeep(this, defaultServerSettings);
    }

    toConfig(): ServerConfig {
        return {
            bindings: null,
            cvars: {
                sv_gamemode: toString(this.gameplay.mode),
                sv_timelimit: toString(this.gameplay.timeLimit * 3600),
    
                sv_advancemode: toString(this.gameplay.styles.advanceEnabled),
                sv_advancemode_amount: toString(this.gameplay.styles.advanceAmount),
                sv_realisticmode: toString(this.gameplay.styles.realisticEnabled),
                sv_survivalmode: toString(this.gameplay.styles.survivalEnabled),
                sv_survivalmode_clearweapons: toString(this.gameplay.styles.survivalDestroyWeaponsAfterRound),
    
                sv_ctf_limit: toString(this.gameplay.pointsLimits.captureTheFlag),
                sv_dm_limit: toString(this.gameplay.pointsLimits.deathMatch),
                sv_htf_limit: toString(this.gameplay.pointsLimits.holdTheFlag),
                sv_inf_limit: toString(this.gameplay.pointsLimits.infiltration),
                sv_pm_limit: toString(this.gameplay.pointsLimits.pointMatch),
                sv_rm_limit: toString(this.gameplay.pointsLimits.ramboMatch),
                sv_tm_limit: toString(this.gameplay.pointsLimits.teamDeathMatch),

                sv_respawntime: toString(this.gameplay.respawnTime * 60),
                sv_respawntime_minwave: toString(this.gameplay.minWaveRespawnTime * 60),
                sv_respawntime_maxwave: toString(this.gameplay.maxWaveRespawnTime * 60),
    
                sv_bullettime: toString(this.gameplay.bulletTime),
                sv_friendlyfire: toString(this.gameplay.friendlyFire),
                sv_sniperline: toString(this.gameplay.sniperLine),
    
                bots_random_alpha: toString(this.bots.alpha),
                bots_random_bravo: toString(this.bots.bravo),
                bots_random_charlie: toString(this.bots.charlie),
                bots_random_delta: toString(this.bots.delta),
                bots_random_noteam: toString(this.bots.noTeam),

                bots_difficulty: toString(this.bots.difficulty),
                bots_chat: toString(this.bots.chat),

                sv_bonus_frequency: toString(this.bonuses.frequency),
                sv_bonus_berserker: toString(this.bonuses.berserker),
                sv_bonus_cluster: toString(this.bonuses.cluster),
                sv_bonus_flamer: toString(this.bonuses.flamer),
                sv_bonus_predator: toString(this.bonuses.predator),
                sv_bonus_vest: toString(this.bonuses.vest),

                net_port: this.network.port
            }
        }
    }

    @computed get botsCountError(): string {
        if (this.botsCount > 30) {
            return "Too many bots. At most 30 bots are allowed.";
        }

        return null;
    }

    private get botsCount(): number {
        const gameMode = this.gameplay.mode;
        if (gameMode === GameModes.DeathMatch ||
            gameMode === GameModes.PointMatch ||
            gameMode === GameModes.RamboMatch) {
            return this.bots.noTeam;
        }
        
        if (gameMode === GameModes.CaptureTheFlag ||
            gameMode === GameModes.HoldTheFlag || 
            gameMode === GameModes.Infiltration) {
            return this.bots.alpha + this.bots.bravo;
        }

        return this.bots.alpha +
            this.bots.bravo +
            this.bots.charlie +
            this.bots.delta;
    }

    @computed get isTeamGameMode(): boolean {
        return (
            this.gameplay.mode === GameModes.CaptureTheFlag ||
            this.gameplay.mode === GameModes.HoldTheFlag ||
            this.gameplay.mode === GameModes.Infiltration ||
            this.gameplay.mode === GameModes.TeamDeathMatch
        );
    }
}

export default ServerSettings;