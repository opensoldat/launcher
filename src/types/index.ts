// This file is for global interface, type and enum definitions.

export enum GameModes {
  CaptureTheFlag = 3,
  DeathMatch = 0,
  HoldTheFlag = 6,
  Infiltration = 5,
  PointMatch = 1,
  RamboMatch = 4,
  TeamDeathMatch = 2,
}

// Internally, we use hex representations for colors (#RRGGBB format).
export type HexColor = string;

export type Resolution = {
  width: number;
  height: number;
};

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
  Jet = "+jet",

  Fire = "+fire",
  Reload = "+reload",
  ChangeWeapon = "+changeweapon",
  ThrowGrenade = "+throwgrenade",
  DropWeapon = "+dropweapon",

  Cmd = "+cmd",
  Chat = "+chat",
  TeamChat = "+teamchat",
  Radio = "+radio",

  StatsMenu = "+statsmenu",
  GameStats = "+gamestats",
  MiniMap = "+minimap",
  FragsList = "+fragslist",
  SniperLine = "+sniperline",
  RecordDemo = "+recorddemo",
  Screenshot = "screenshot",
  ThrowFlag = "+flagthrow",
  WeaponsMenu = "+weapons",

  SwitchCameraToRedFlag = "switchcamflag 1",
  SwitchCameraToBlueFlag = "switchcamflag 2",
  SwitchCameraToYellowFlag = "switchcamflag 3",

  SwitchCameraToPlayer1 = "switchcam 1",
  SwitchCameraToPlayer2 = "switchcam 2",
  SwitchCameraToPlayer3 = "switchcam 3",
  SwitchCameraToPlayer4 = "switchcam 4",
  SwitchCameraToPlayer5 = "switchcam 5",
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

// Couldn't be bothered to go through react-select's
// code to find the correct type for this, so we just use
// our own, which is compatible with react-select's type.
export interface SelectOption {
  label: string;
  value: string;
}
