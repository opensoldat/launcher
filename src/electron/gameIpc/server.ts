import { ipcMain, IpcMainEvent } from "electron";
import { EventEmitter } from "events";
import net from "net";
import TypedEmitter from "typed-emitter";

import { CommandsMessage, ElectronIpcChannels } from "src/electronIpcMessages";
import { GameIpcEventIds, GameIpcEvents } from "./events";
import { GameMessageIds } from "./messages";
import ConnectionClosedHandler from "./connectionClosedHandler";
import GameIdentityHandler from "./gameIdentityHandler";
import JoinedServerHandler from "./joinedServerHandler";
import ShowSettingsHandler from "./showSettingsHandler";
import logger from "../logger";

class GameIpcServer extends (EventEmitter as new () => TypedEmitter<GameIpcEvents>) {
  private ipcServer: net.Server;

  private readonly connectionClosedHandler: ConnectionClosedHandler;
  private readonly gameIdentityHandler: GameIdentityHandler;
  private readonly joinedServerHandler: JoinedServerHandler;
  private readonly showSettingsHandler: ShowSettingsHandler;

  constructor(
    connectionClosedHandler: ConnectionClosedHandler,
    gameIdentityHandler: GameIdentityHandler,
    joinedServerHandler: JoinedServerHandler,
    showSettingsHandler: ShowSettingsHandler
  ) {
    super();

    this.connectionClosedHandler = connectionClosedHandler;
    this.gameIdentityHandler = gameIdentityHandler;
    this.joinedServerHandler = joinedServerHandler;
    this.showSettingsHandler = showSettingsHandler;

    ipcMain.on(ElectronIpcChannels.Commands, this.handleCommandsMessage);
    this.handleGameIpc = this.handleGameIpc.bind(this);
  }

  start(port: number) {
    this.ipcServer = net.createServer(this.handleGameIpc);
    this.ipcServer.listen(port);
  }

  private handleCommandsMessage(
    event: IpcMainEvent,
    message: CommandsMessage
  ) {}

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
          this.gameIdentityHandler.handleMessage(message, socket);
          break;

        case GameMessageIds.JoinedServer:
          this.joinedServerHandler.handleMessage(message, socket);
          break;

        // Do we care about validation if message came from server/client?
        case GameMessageIds.ServerReadyForClients:
          this.emit(GameIpcEventIds.ServerReadyForClients, {
            socket,
          });
          break;

        case GameMessageIds.ShowSettings:
          this.showSettingsHandler.handleMessage();
          break;
      }

      socket.write(
        '{"id":"COMMANDS", "commands": ["sv_lobby 0", "sv_radio 1"]}'
      );
    });

    socket.on("end", () => {
      //console.log("[GameIPC] Game disconnected");
    });

    socket.on("error", (err) => {
      logger.warn(`[GameIPC] Socket error: ${err.message}`);
    });

    socket.on("close", () => {
      logger.info("[GameIPC] Connection closed");

      this.connectionClosedHandler.handleConnectionClosed(socket);
    });
  }
}

export default GameIpcServer;
