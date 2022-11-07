import net from "net";

// Events are only emitted internally, so that other classes from the main process
// can react on their own.

enum GameIpcEventIds {
  ServerReadyForClients = "SERVER_READY_FOR_CLIENTS",
}

interface ServerReadyForClientsEvent {
  socket: net.Socket;
}

type GameIpcEvents = {
  [GameIpcEventIds.ServerReadyForClients]: (
    event: ServerReadyForClientsEvent
  ) => void;
};

export { GameIpcEventIds, GameIpcEvents, ServerReadyForClientsEvent };
