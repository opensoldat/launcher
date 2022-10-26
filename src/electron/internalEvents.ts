import net from "net";
import { IdentityMessage } from "./gameIpcMessages";

enum InternalEventIds {
    ReceivedGameIdentity = "GAME_IDENTITY",
    ServerReadyForClients = "SERVER_READY_FOR_CLIENTS"
}

interface GameIdentityEvent extends IdentityMessage {
    socket: net.Socket;
}

interface ServerReadyForClientsEvent {
    socket: net.Socket;
}

type InternalEvents = {
    [InternalEventIds.ReceivedGameIdentity]: (event: GameIdentityEvent) => void;
    [InternalEventIds.ServerReadyForClients]: (event: ServerReadyForClientsEvent) => void;
}

export { InternalEventIds, InternalEvents, GameIdentityEvent, ServerReadyForClientsEvent };