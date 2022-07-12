import { defaults } from "lodash";
import { computed, observable, makeObservable } from "mobx";

import { HexColor } from "src/types";
import { PlayerConfig } from "src/api/soldat/configs/types";
import { toHexColor, toNumber, toSoldatColor, toString } from "../convertUtils";

export enum ChainStyles {
    None = 0,
    DogTags,
    Gold
}

export enum HairStyles {
    Army,
    Dreadlocks,
    Punk,
    MrT,
    Normal
}

export enum HeadStyles {
    None = 0,
    Helmet = 34,
    Hat = 124
}

export enum SecondaryWeapons {
    Ussocom = 0,
    CombatKnife,
    Chainsaw,
    M72Law,
}

interface PlayerSettingsData {
    nickname: string;
    
    hairColor: HexColor;
    shirtColor: HexColor;
    pantsColor: HexColor;
    skinColor: HexColor;
    jetColor: HexColor;

    headStyle: HeadStyles;
    hairStyle: HairStyles;
    chainStyle: ChainStyles;

    secondaryWeapon: SecondaryWeapons;
}

const defaultPlayerSettings: PlayerSettingsData = {
    nickname: "Major",
    hairColor: "#000000",
    shirtColor: "#8f8f8f",
    skinColor: "#8f8f8f",
    pantsColor: "#8f8f8f",
    jetColor: "#8f8f8f",
    headStyle: HeadStyles.Helmet,
    hairStyle: HairStyles.Dreadlocks,
    chainStyle: ChainStyles.Gold,
    secondaryWeapon: SecondaryWeapons.Ussocom
}

class PlayerSettings implements PlayerSettingsData {
    @observable nickname: string;
    
    @observable hairColor: HexColor;
    @observable shirtColor: HexColor;
    @observable pantsColor: HexColor;
    @observable skinColor: HexColor;
    @observable jetColor: HexColor;

    @observable headStyle: HeadStyles;
    @observable hairStyle: HairStyles;
    @observable chainStyle: ChainStyles;

    @observable secondaryWeapon: SecondaryWeapons;

    constructor(config?: PlayerConfig) {
        makeObservable(this);
        this.nickname = config?.cvars.cl_player_name;
        this.hairColor = toHexColor(config?.cvars.cl_player_hair),
        this.shirtColor = toHexColor(config?.cvars.cl_player_shirt),
        this.skinColor = toHexColor(config?.cvars.cl_player_skin),
        this.pantsColor = toHexColor(config?.cvars.cl_player_pants),
        this.jetColor = toHexColor(config?.cvars.cl_player_jet),

        this.headStyle = toNumber(config?.cvars.cl_player_headstyle) as HeadStyles,
        this.hairStyle = toNumber(config?.cvars.cl_player_hairstyle) as HairStyles,
        this.chainStyle = toNumber(config?.cvars.cl_player_chainstyle) as ChainStyles,
        this.secondaryWeapon = toNumber(config?.cvars.cl_player_secwep) as SecondaryWeapons

        defaults(this, defaultPlayerSettings);
    }

    toConfig(): PlayerConfig {
        // We don't do any validation when converting to config.
        // Theoretically Soldat should handle such scenarios just fine.
        return {
            bindings: null,
            cvars: {
                cl_player_name: this.nickname,
                
                cl_player_hair: toSoldatColor(this.hairColor),
                cl_player_skin: toSoldatColor(this.skinColor),
                cl_player_shirt: toSoldatColor(this.shirtColor),
                cl_player_pants: toSoldatColor(this.pantsColor),
                cl_player_jet: toSoldatColor(this.jetColor),

                cl_player_hairstyle: toString(this.hairStyle),
                cl_player_headstyle: toString(this.headStyle),
                cl_player_chainstyle: toString(this.chainStyle),
                cl_player_secwep: toString(this.secondaryWeapon)
            }
        }
    }

    @computed get nicknameError(): string {
        if (this.nickname.length == 0) {
            return "Nickname can't be empty";
        }
        else if (this.nickname.length > 24) {
            return "Nickname is too long";
        }
        return "";
    }
}

export default PlayerSettings;