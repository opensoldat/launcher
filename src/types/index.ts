// This file is for global interface, type and enum definitions.

export enum GameModes {
    CaptureTheFlag = 3,
    DeathMatch = 0,
    HoldTheFlag = 6,
    Infiltration = 5,
    PointMatch = 1,
    RamboMatch = 4,
    TeamDeathMatch = 2
}

// Internally, we use hex representations for colors (#RRGGBB format).
export type HexColor = string;

export type Resolution = {
    width: number;
    height: number;
}

export interface KeyBinding {
    // "key" and "command" might not be enough to identify the bindings properly,
    // as we might have duplicates. So, we generate unique ids for bindings.
    id: string;

    key: string;
    command: string;
}

export enum CommonGameCommands {
    Left = "+left",
    Right = "+right",
    Jump = "+jump",
    Crouch = "+crouch",
    Prone = "+prone",
    Fire = "+fire",
    Jet = "+jet",
    Reload = "+reload",
    ChangeWeapon = "+changeweapon",
    ThrowGrenade = "+throwgrenade",
    DropWeapon = "+dropweapon",
    ThrowFlag = "+flagthrow",
    StatsMenu = "+statsmenu",
    GameStats = "+gamestats",
    MiniMap = "+minimap",
    FragsList = "+fragslist",
    SniperLine = "+sniperline",
    Radio = "+radio",
    RecordDemo = "+recorddemo",
    Cmd = "+cmd",
    Chat = "+chat",
    TeamChat = "+teamchat",
    WeaponsMenu = "+weapons"
}

export interface CommonKeyBinding extends KeyBinding {
    command: CommonGameCommands;
}

export interface Map {
    // We need identifier for rendering lists with React.
    // "name" might not be unique.
    id: string;
    name: string;
}

export interface Server {
    name: string;
    ip: string;
    port: number;
    hasPassword: boolean;

    numBots: number;
    numPlayers: number;
    maxPlayers: number;
    
    currentMap: string;
    gameMode: GameModes;
    advance: boolean;
    realistic: boolean;
    survival: boolean;
    customWeapons: boolean;

    country: string;
    info: string;
    version: string;
}
