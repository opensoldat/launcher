import GameProcessTypes from "./gameProcessTypes";

enum ElectronIpcChannels {
  // From renderer to main process.
  Commands = "COMMANDS",
  StartClient = "START_CLIENT",
  StopClient = "STOP_CLIENT",
  StartLocalGame = "START_LOCAL_GAME",
  StopLocalGame = "STOP_LOCAL_GAME",

  // From main to renderer process.
  AddedGameInstance = "ADDED_GAME_INSTANCE",
  RemovedGameInstance = "REMOVED_GAME_INSTANCE",
  GameProcessFailed = "PROCESS_FAILED",
  GameProcessSpawned = "PROCESS_SPAWNED",
  LocalGameStarted = "LOCAL_GAME_STARTED",
  LocalGameStartTimeout = "LOCAL_GAME_START_TIMEOUT",
  LocalGameStopped = "LOCAL_GAME_STOPPED",
  ClientJoinedServer = "CLIENT_JOINED_SERVER",
}

enum CommandTarget {
  Client,
  Server,
  All,
}

// From renderer to main process.
type CommandsMessage = {
  commands: string[];
  target: CommandTarget;
};

type StartClientMessage = {
  gameInstanceId: string;
  ip: string;
  port: number;
  password: string;
  launchArguments: string;
};

type StopClientMessage = {
  gameInstanceId: string;
};

type StartLocalGameMessage = {
  clientLaunchArguments: string;
  serverLaunchArguments: string;
  serverPort: number;
};

// From main to renderer process.

type AddedGameInstanceMessage = {
  gameInstanceId: string;
  processType: GameProcessTypes;
};

type RemovedGameInstanceMessage = {
  gameInstanceId: string;
};

type GameProcessSpawned = {
  gameInstanceId: string;
};

type GameProcessFailed = {
  gameInstanceId: string;
  errorMessage: string;
};

type ClientJoinedServer = {
  gameInstanceId: string;
  ip: string;
  port: number;
};

export {
  ClientJoinedServer,
  CommandsMessage,
  ElectronIpcChannels,
  GameProcessFailed,
  GameProcessSpawned,
  StartClientMessage,
  StopClientMessage,
  StartLocalGameMessage,
  AddedGameInstanceMessage,
  RemovedGameInstanceMessage,
};
