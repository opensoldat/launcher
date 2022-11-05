import { ChildProcess, spawn } from "child_process";
import { WebContents } from "electron";
import { isIPv4 } from "net";

import { ElectronIpcChannels } from "src/electronIpcMessages";
import { gamePaths } from "./gamePaths";
import GameVault from "./gameVault";
import GameInstance from "./gameInstance";
import logger from "./logger";

class GameProcessManager {
  private readonly gameVault: GameVault;
  private readonly mainWindow: WebContents;

  constructor(gameVault: GameVault, mainWindow: WebContents) {
    this.gameVault = gameVault;
    this.mainWindow = mainWindow;
  }

  spawnClient(
    ip: string,
    port: number,
    password: string,
    launchArguments: string,
    detached: boolean
  ): ChildProcess {
    logger.info("[GameProcessManager] Spawning a client...");

    // TODO: think how to make such validation work with the new way of launching game.
    // Do we want a toast in UI in such cases? This is a somewhat special case, because
    // game instance hasn't been created yet. As of now we're not catching those
    // exceptions...
    if (!isIPv4(ip)) {
      throw Error("Invalid IP address passed to client launcher.");
    }

    if (
      typeof port !== "number" ||
      !isFinite(port) ||
      Math.round(port) !== port
    ) {
      throw Error("Invalid port parameter passed to client launcher.");
    }

    let joinArguments = "-join " + ip + " " + port.toString();
    if (password && password.length > 0) {
      joinArguments += " " + password;
    }

    const process = spawn(
      gamePaths.clientExecutable,
      [
        "-fs_portable 1",
        "-launcher_ipc_enable 1",
        joinArguments,
        launchArguments,
      ],
      { detached }
    );

    this.handleProcessLifecycle(process);
    return process;
  }

  spawnServer(launchArguments: string): ChildProcess {
    logger.info("[GameProcessManager] Spawning a server...");

    const process = spawn(gamePaths.serverExecutable, [
      "-launcher_ipc_enable 1",
      launchArguments,
    ]);

    this.handleProcessLifecycle(process);
    return process;
  }

  private handleProcessLifecycle(process: ChildProcess) {
    process.on("error", (err) => {
      const gameInstance = this.gameVault.getByProcess(process);
      this.handleProcessFailed(gameInstance, err.message);
    });

    process.on("spawn", () => {
      const gameInstance = this.gameVault.getByProcess(process);
      logger.info(
        `[GameProcessManager] Game process spawned (instance id: ${gameInstance.id}, ` +
          `process id: ${process.pid})`
      );

      this.mainWindow.send(ElectronIpcChannels.GameProcessSpawned, {
        gameInstanceId: gameInstance.id,
      });
    });

    process.stderr.setEncoding("utf-8");
    process.stderr.on("data", (output: string) => {
      const gameInstance = this.gameVault.getByProcess(process);
      gameInstance.stderr += output;
    });

    process.on("close", (exitCode) => {
      // TODO: I think game could be more consistent when errors occur.
      // With current implementation the server terminates cleanly when it fails
      // to bind socket - not sure if that's expected.
      // I feel like stderr gets populated when segmentation faults occur,
      // but not when we catch that something went wrong.
      const gameInstance = this.gameVault.getByProcess(process);
      if (gameInstance.stderr && gameInstance.stderr.length > 0) {
        this.handleProcessFailed(gameInstance, gameInstance.stderr);
        return;
      }

      // exitCode seems to be 1 when we kill server process from task manager,
      // but we don't really want to raise an error in that case.
      if (exitCode && exitCode > 1) {
        this.handleProcessFailed(
          gameInstance,
          `Process terminated with exit code: ${exitCode}`
        );
        return;
      }

      logger.info(
        `[GameProcessManager] Game process terminated (instance id: ${gameInstance.id})`
      );
      this.gameVault.removeInstance(gameInstance);
    });
  }

  private handleProcessFailed(
    gameInstance: GameInstance,
    errorMessage: string
  ) {
    errorMessage = errorMessage.trim();
    logger.warn(
      `[GameProcessManager] Game process failed (instance id: ` +
        `${gameInstance.id}, error: ${errorMessage})`
    );

    this.mainWindow.send(ElectronIpcChannels.GameProcessFailed, {
      gameInstanceId: gameInstance.id,
      errorMessage,
    });

    this.gameVault.removeInstance(gameInstance);
  }
}

export default GameProcessManager;
