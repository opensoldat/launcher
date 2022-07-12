import { CommonKeyBinding, KeyBinding } from "src/types";

export type ConfigKeyBinding = Pick<KeyBinding, "key" | "command">;

export interface SoldatConfig {
    bindings: ConfigKeyBinding[];
    cvars: {
        [key: string]: string;
    };
}

export interface ControlsConfig extends SoldatConfig {
    bindings: CommonKeyBinding[];
    cvars: {
        cl_sensitivity: string;
    };
}

export interface GameConfig extends SoldatConfig {
    cvars: {
//        cl_lang: string;
//        cl_actionsnap: string;
        cl_endscreenshot: string;
        cl_screenshake: string;
        cl_servermods: string;
    };
}

export interface GraphicsConfig extends SoldatConfig {
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

        ui_style: string;
        r_scaleinterface: string;
        ui_playerindicator: string;
        ui_killconsole: string;

        r_swapeffect: string;
        r_dithering: string;
    };
}

export interface PlayerConfig extends SoldatConfig {
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

export interface SoundConfig extends SoldatConfig {
    cvars: {
        snd_volume: string;
        snd_effects_battle: string;
        snd_effects_explosions: string;
    };
}

export interface ServerConfig extends SoldatConfig {
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

        sv_respawntime: string;
        sv_respawntime_minwave: string;
        sv_respawntime_maxwave: string;

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

        sv_bonus_frequency: string;
        sv_bonus_berserker: string;
        sv_bonus_cluster: string;
        sv_bonus_flamer: string;
        sv_bonus_predator: string;
        sv_bonus_vest: string;

        net_port: string;
    };
}