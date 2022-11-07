import net from "net";
import GameInstanceBuilder from "../gameInstanceBuilder";
import GameVault from "../gameVault";
import { IdentityMessage } from "./messages";

class GameIdentityHandler {
  private readonly gameVault: GameVault;

  constructor(gameVault: GameVault) {
    this.gameVault = gameVault;
  }

  handleMessage(message: IdentityMessage, socket: net.Socket) {
    let gameInstance = this.gameVault.getByProcessId(message.processId);
    if (gameInstance) {
      gameInstance.ipcSocket = socket;
    } else {
      const gameInstanceBuilder = new GameInstanceBuilder();
      gameInstance = gameInstanceBuilder
        .withProcessType(message.processType)
        .withIpcSocket(socket)
        .build();
      this.gameVault.addInstance(gameInstance);
    }
  }
}

export default GameIdentityHandler;
