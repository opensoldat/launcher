import { ipcMain, IpcMainEvent } from "electron";
import {
  ElectronIpcChannels,
  StartClientMessage,
  StopClientMessage,
} from "src/electronIpcMessages";
import GameProcessTypes from "src/gameProcessTypes";
import GameInstanceBuilder from "./gameInstanceBuilder";
import GameProcessManager from "./gameProcessManager";
import GameVault from "./gameVault";
import logger from "./logger";

/**
 * Handles spawning and killing of game clients, as requested from renderer process.
 * It's intended for online clients, and clients that play demos.
 */
class GameClientsManager {
  private readonly gameVault: GameVault;
  private readonly gameProcessManager: GameProcessManager;

  constructor(gameVault: GameVault, gameProcessManager: GameProcessManager) {
    this.gameVault = gameVault;
    this.gameProcessManager = gameProcessManager;

    ipcMain.on(
      ElectronIpcChannels.StartClient,
      (event: IpcMainEvent, message: StartClientMessage) => {
        this.handleStartClientMessage(message);
      }
    );

    ipcMain.on(
      ElectronIpcChannels.StopClient,
      (event, message: StopClientMessage) => {
        this.handleStopClientMessage(message);
      }
    );
  }

  private handleStartClientMessage(message: StartClientMessage) {
    logger.info(
      `[GameClientsManager] Renderer requested to start client (${message.ip}:${message.port})`
    );

    const clientProcess = this.gameProcessManager.spawnClient(
      message.ip,
      message.port,
      message.password,
      message.launchArguments,
      true
    );
    const gameInstanceBuilder = new GameInstanceBuilder();
    const gameInstance = gameInstanceBuilder
      .withId(message.gameInstanceId)
      .withProcess(clientProcess)
      .withProcessType(GameProcessTypes.Client)
      .build();
    this.gameVault.addInstance(gameInstance);
  }

  private handleStopClientMessage(message: StopClientMessage) {
    logger.info(
      `[GameClientsManager] Renderer requested to stop client with id: ${message.gameInstanceId}`
    );

    const gameInstance = this.gameVault.getById(message.gameInstanceId);
    if (!gameInstance || gameInstance.processType !== GameProcessTypes.Client) {
      logger.warn(
        "[GameClientsManager] Couldn't find requested client instance."
      );
      return;
    }

    if (gameInstance.childProcess) {
      gameInstance.childProcess.kill();
    } else if (gameInstance.ipcSocket) {
      // TODO: send /shutdown command to this client
    } else {
      logger.error("[GameClientsManager] Couldn't stop client.");
      return;
    }
  }
}

export default GameClientsManager;
