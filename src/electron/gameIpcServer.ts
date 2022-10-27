import { ipcMain, IpcMainEvent } from "electron";
import net from "net";

import { CommandsMessage, ElectronIpcChannels } from "src/electronIpcMessages";
import { GameMessage, GameMessageIds, IdentityMessage } from "./gameIpcMessages";
import InternalEventBus from "./internalEventBus";
import { InternalEventIds } from "./internalEvents";
import logger from "./logger";

class GameIpcServer {
    private readonly eventBus: InternalEventBus;
    private ipcServer: net.Server;

    constructor(eventBus: InternalEventBus) {
        this.eventBus = eventBus;

        ipcMain.on(ElectronIpcChannels.Commands, this.handleCommandsMessage);

        this.handleGameIpc = this.handleGameIpc.bind(this);
    }

    start(port: number) {
        this.ipcServer = net.createServer(this.handleGameIpc);
        this.ipcServer.listen(port);
    }

    private handleCommandsMessage(event: IpcMainEvent, message: CommandsMessage) {
        
    }

    private handleGameIpc(socket: net.Socket) {
        logger.info("[GameIPC] New connection from game");

        socket.setEncoding("utf-8");
    
        socket.on("data", (data: string) => {
            // TODO: handle incomplete messages. Note that every socket will need
            // its own buffering. We could store the received buffer in GameInstance.
            logger.info(`[GameIPC] Received message: ${data}`);

            let message;
            try {
                message = JSON.parse(data);
            } catch (e) {
                logger.warn("[GameIPC] Could not parse received message as JSON");
                return;
            }

            if (!message?.id) {
                logger.warn("[GameIPC] Received message doesn't have an id");
                return;
            }

            switch (message.id) {
                case GameMessageIds.Identity:
                    this.eventBus.emit(InternalEventIds.ReceivedGameIdentity, {
                        ...message as IdentityMessage,
                        socket
                    });
                    break;
                
                // Do we care about validation if message came from server/client?
                case GameMessageIds.ServerReadyForClients:
                    this.eventBus.emit(InternalEventIds.ServerReadyForClients, {
                        socket
                    });
                    break;
                
                case GameMessageIds.ShowSettings:
                    this.handleShowSettingsMessage(message as GameMessage);
                    break;
            }

            socket.write('{"id":"COMMANDS", "commands": ["sv_lobby 0", "sv_radio 1"]}');
        });

        socket.on("end", () => {
            //console.log("[GameIPC] Game disconnected");
        });

        socket.on("error", err => {
            logger.warn(`[GameIPC] Socket error: ${err.message}`);
        });

        socket.on("close", () => {
            logger.info("[GameIPC] Connection closed");
            // TODO: Raise event, so we can handle game instances without process
        })
    }

    private handleShowSettingsMessage(message: GameMessage) {
        // TODO: bring back main window to focus, and send message to renderer,
        // so it can update its state to show settings tab
    }
}

export default GameIpcServer;