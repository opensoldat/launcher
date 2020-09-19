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

// Internally, we use hex representations for colors (#RRGGBB format).
export type HexColor = string;

export interface PlayerSettings {
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

export enum DisplayModes {
    Window = 0,
    Fullscreen,
    FullscreenWindow
}

export type Resolution = {
    width: number;
    height: number;
}

export interface GraphicsSettings {
    displayMode: DisplayModes;
    resolution: Resolution;

    backgroundSceneries: boolean;
    forceBackground: boolean;
    forcedBackgroundTopColor: HexColor;
    forcedBackgroundBottomColor: HexColor;

    limitFPS: boolean;
    maxFPS: number;

    weatherEffects: boolean;
    smoothEdges: boolean;

    scaleInterface: boolean;
    playerIndicator: boolean;
    killsList: boolean;

    verticalSync: boolean;
    dithering: boolean;
}

export interface SoundSettings {
    volume: number;
    battleSoundEffects: boolean;
    explosionsSoundEffects: boolean;
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
    WeaponsMenu = "+weaponsmenu"
}

export interface CommonKeyBinding extends KeyBinding {
    command: CommonGameCommands;
}

export interface ControlsSettings {
    /* I decided to split the bindings in 2 categories.
     * 
     * The "common" ones are basically a static list of
     * most commonly used actions/commands: as a user,
     * you can only change the hotkey.
     * 
     * The "custom" ones, instead, are a dynamic list; users
     * have full control of those bindings (i.e. they can change
     * both the command, as well as the assigned hotkey).
     * This list is used for defining taunts, cvar settings, etc...
     */
    commonBindings: CommonKeyBinding[];
    customBindings: KeyBinding[];

    // Range [0, 100]
    mouseSensitivity: number;
}

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

    bulletTime: boolean;
    friendlyFire: boolean;
    sniperLine: boolean;
}

export interface Map {
    // We need identifier for rendering lists with React.
    // "name" might not be unique.
    id: string;
    name: string;
}

export interface MapsSettings {
    selected: Map[];
}

export interface ServerSettings {
    gameplay: GameplaySettings;
    maps: MapsSettings;
    bots: BotsSettings;
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
