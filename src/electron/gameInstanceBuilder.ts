import { ChildProcess } from "child_process";
import { nanoid } from "nanoid/non-secure";
import net from "net";

import GameProcessTypes from "src/gameProcessTypes";
import GameInstance from "./gameInstance";
import logger from "./logger";

class GameInstanceBuilder {
  private readonly gameInstance: GameInstance;

  constructor() {
    this.gameInstance = new GameInstance();
  }

  withId(id: string): GameInstanceBuilder {
    this.gameInstance.id = id;
    return this;
  }

  withProcessType(processType: GameProcessTypes): GameInstanceBuilder {
    this.gameInstance.processType = processType;
    return this;
  }

  withProcess(process: ChildProcess): GameInstanceBuilder {
    this.gameInstance.childProcess = process;
    return this;
  }

  withIpcSocket(ipcSocket: net.Socket): GameInstanceBuilder {
    this.gameInstance.ipcSocket = ipcSocket;
    return this;
  }

  build(): GameInstance {
    if (!this.gameInstance.id) {
      this.gameInstance.id = nanoid(8);
    }

    if (!this.gameInstance.processType) {
      logger.error(
        "[GameInstanceBuilder] Can't build instance without process type."
      );
      return null;
    }

    if (!this.gameInstance.childProcess && !this.gameInstance.ipcSocket) {
      logger.error(
        "[GameInstanceBuilder] Can't build instance; set either the child process, or the IPC socket."
      );
      return null;
    }

    return this.gameInstance;
  }
}

export default GameInstanceBuilder;
