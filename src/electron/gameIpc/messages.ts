import GameProcessTypes from "src/gameProcessTypes";

// These are the actual messages we exchange through game IPC.

enum GameMessageIds {
  // Messages we send to game:
  Commands = "COMMANDS",
  // Messages we receive from game:
  Identity = "IDENTITY",
  JoinedServer = "JOIN_SERVER",
  ServerReadyForClients = "READY_FOR_CLIENTS",
  ShowSettings = "SHOW_SETTINGS",
}

interface CommandsMessage extends GameMessage {
  commands: string[];
}

interface GameMessage {
  id: string;
}

interface IdentityMessage extends GameMessage {
  processId: number;
  processType: GameProcessTypes;
}

interface JoinedServerMessage extends GameMessage {
  ip: string;
  port: number;
}

export {
  CommandsMessage,
  GameMessageIds,
  GameMessage,
  IdentityMessage,
  JoinedServerMessage,
};
