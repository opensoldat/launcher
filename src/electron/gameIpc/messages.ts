import GameProcessTypes from "src/gameProcessTypes";

// These are the actual messages we exchange through game IPC.

enum GameMessageIds {
  // Messages we send to game:
  Commands = "COMMANDS",
  // Messages we receive from game:
  Identity = "IDENTITY",
  ServerReadyForClients = "READY_FOR_CLIENTS",
  ShowSettings = "SHOW_SETTINGS",
}

interface GameMessage {
  id: string;
}

interface IdentityMessage extends GameMessage {
  processId: number;
  processType: GameProcessTypes;
}

export { GameMessageIds, GameMessage, IdentityMessage };
