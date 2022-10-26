import GameProcessTypes from "./gameProcessTypes";

enum ElectronIpcChannels {
    // From renderer to main process.
    Commands = "COMMANDS",
    StartLocalGame = "START_LOCAL_GAME",
    StopLocalGame = "STOP_LOCAL_GAME",
    
    // From main to renderer process.
    AddedGameInstance = "ADDED_GAME_INSTANCE",
    RemovedGameInstance = "REMOVED_GAME_INSTANCE",
    GameProcessFailed = "PROCESS_FAILED",
    GameProcessSpawned = "PROCESS_SPAWNED",
    LocalGameStarted = "LOCAL_GAME_STARTED",
    LocalGameStartTimeout = "LOCAL_GAME_START_TIMEOUT",
    LocalGameStopped = "LOCAL_GAME_STOPPED"
}

enum CommandTarget {
    Client,
    Server,
    All
}



// From renderer to main process.
type CommandsMessage = {
    commands: string[];
    target: CommandTarget;
};

type StartLocalGameMessage = {
    clientLaunchArguments: string;
    serverLaunchArguments: string;
    serverPort: number;
}



// From main to renderer process.

type AddedGameInstanceMessage = {
    gameInstanceId: string;
    processType: GameProcessTypes;
}

type RemovedGameInstanceMessage = {
    gameInstanceId: string;
}

type GameProcessSpawned = {
    gameInstanceId: string;
}

type GameProcessFailed = {
    gameInstanceId: string;
    errorMessage: string;
}



export {
    ElectronIpcChannels,
    CommandsMessage,
    StartLocalGameMessage,
    GameProcessFailed,
    GameProcessSpawned,
    AddedGameInstanceMessage,
    RemovedGameInstanceMessage
};