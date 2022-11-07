import net from "net";
import GameVault from "../gameVault";

class ConnectionClosedHandler {
  private readonly gameVault: GameVault;

  constructor(gameVault: GameVault) {
    this.gameVault = gameVault;
  }

  handleConnectionClosed(socket: net.Socket) {
    const gameInstance = this.gameVault.getBySocket(socket);
    if (!gameInstance) {
      return;
    }

    if (gameInstance.childProcess) {
      // If we have the process, there is no need to remove the game instance
      // from the game vault - it will be removed when process terminates.
      gameInstance.ipcSocket = null;
    } else {
      this.gameVault.removeInstance(gameInstance);
    }
  }
}

export default ConnectionClosedHandler;
