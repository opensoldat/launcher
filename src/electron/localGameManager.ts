import { ipcMain, IpcMainEvent, WebContents } from "electron";
import {
  ElectronIpcChannels,
  StartLocalGameMessage,
} from "src/electronIpcMessages";
import GameProcessTypes from "src/gameProcessTypes";
import GameInstanceBuilder from "./gameInstanceBuilder";
import { GameIpcEventIds, ServerReadyForClientsEvent } from "./gameIpc/events";
import GameIpcServer from "./gameIpc/server";
import GameProcessManager from "./gameProcessManager";
import GameVault from "./gameVault";
import logger from "./logger";

class LocalGameManager {
  private readonly gameProcessManager: GameProcessManager;
  private readonly gameVault: GameVault;
  private readonly mainWindow: WebContents;

  private clientLaunchArguments: string;
  private serverPort: number;
  private clientInstanceId: string;
  private serverInstanceId: string;
  private startTimeout: NodeJS.Timeout;
  private started: boolean;

  constructor(
    gameIpcServer: GameIpcServer,
    gameProcessManager: GameProcessManager,
    gameVault: GameVault,
    mainWindow: WebContents
  ) {
    this.gameProcessManager = gameProcessManager;
    this.gameVault = gameVault;
    this.mainWindow = mainWindow;
    this.started = false;

    this.handleStartLocalGameMessage =
      this.handleStartLocalGameMessage.bind(this);
    this.handleStartTimeout = this.handleStartTimeout.bind(this);
    this.handleStopLocalGameMessage =
      this.handleStopLocalGameMessage.bind(this);
    this.handleServerReadyForClientsEvent =
      this.handleServerReadyForClientsEvent.bind(this);
    this.handleClientSpawned = this.handleClientSpawned.bind(this);
    this.stopLocalGame = this.stopLocalGame.bind(this);

    ipcMain.on(
      ElectronIpcChannels.StartLocalGame,
      this.handleStartLocalGameMessage
    );
    ipcMain.on(
      ElectronIpcChannels.StopLocalGame,
      this.handleStopLocalGameMessage
    );
    gameIpcServer.on(
      GameIpcEventIds.ServerReadyForClients,
      this.handleServerReadyForClientsEvent
    );
  }

  private handleStartLocalGameMessage(
    event: IpcMainEvent,
    message: StartLocalGameMessage
  ) {
    logger.info("[LocalGameManager] Starting local game...");

    this.clientLaunchArguments = message.clientLaunchArguments;
    this.serverPort = message.serverPort;
    this.started = true;

    const serverProcess = this.gameProcessManager.spawnServer(
      message.serverLaunchArguments
    );
    serverProcess.on("error", this.stopLocalGame);
    serverProcess.on("close", this.stopLocalGame);

    const gameInstanceBuilder = new GameInstanceBuilder();
    const gameInstance = gameInstanceBuilder
      .withProcessType(GameProcessTypes.Server)
      .withProcess(serverProcess)
      .build();
    this.gameVault.addInstance(gameInstance);
    this.serverInstanceId = gameInstance.id;

    // This is so that we never wait forever for local game to start.
    // Such scenario could occur when local server can't connect to our IPC
    // server, for whatever reason.
    this.startTimeout = setTimeout(this.handleStartTimeout, 5000);
  }

  private handleServerReadyForClientsEvent(event: ServerReadyForClientsEvent) {
    // Make sure the message came from the local server we just started.
    // This is for cases where you start a server manually, without using launcher.
    if (!this.started) {
      logger.warn(
        "[LocalGameManager] A local server is ready for connections, but we're not starting a local game."
      );
      return;
    }
    const senderGameInstance = this.gameVault.getBySocket(event.socket);
    if (senderGameInstance.id !== this.serverInstanceId) {
      return;
    }

    // I don't think we can hang the launching of local game beyond this
    // point, so it should be safe to clear the timer.
    this.clearStartTimeout();

    const clientProcess = this.gameProcessManager.spawnClient(
      "127.0.0.1",
      this.serverPort,
      null,
      this.clientLaunchArguments,
      false
    );
    clientProcess.on("error", this.stopLocalGame);
    clientProcess.on("close", this.stopLocalGame);
    clientProcess.on("spawn", this.handleClientSpawned);

    const gameInstanceBuilder = new GameInstanceBuilder();
    const gameInstance = gameInstanceBuilder
      .withProcessType(GameProcessTypes.Client)
      .withProcess(clientProcess)
      .build();
    this.gameVault.addInstance(gameInstance);
    this.clientInstanceId = gameInstance.id;
  }

  private handleClientSpawned() {
    logger.info("[LocalGameManager] Local game started");
    this.mainWindow.send(ElectronIpcChannels.LocalGameStarted);
  }

  private handleStopLocalGameMessage() {
    this.stopLocalGame();
  }

  private stopLocalGame() {
    if (!this.started) {
      return;
    }

    const clientInstance = this.gameVault.getById(this.clientInstanceId);
    if (clientInstance?.childProcess && !clientInstance.childProcess.killed) {
      clientInstance.childProcess.kill();
    }
    const serverInstance = this.gameVault.getById(this.serverInstanceId);
    if (serverInstance?.childProcess && !serverInstance.childProcess.killed) {
      serverInstance.childProcess.kill();
    }

    this.clearStartTimeout();

    this.started = false;
    this.mainWindow.send(ElectronIpcChannels.LocalGameStopped);
    logger.info("[LocalGameManager] Local game stopped");
  }

  private clearStartTimeout() {
    if (this.startTimeout) {
      clearTimeout(this.startTimeout);
      this.startTimeout = null;
    }
  }

  private handleStartTimeout() {
    this.startTimeout = null;
    this.mainWindow.send(ElectronIpcChannels.LocalGameStartTimeout);
    this.stopLocalGame();
  }
}

export default LocalGameManager;
