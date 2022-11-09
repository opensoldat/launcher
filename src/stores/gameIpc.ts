import { ClientJoinedServer } from "src/electronIpcMessages";
import GameVaultStore from "./gameVault";

class GameIpcStore {
  private readonly gameVaultStore: GameVaultStore;

  constructor(gameVaultStore: GameVaultStore) {
    this.gameVaultStore = gameVaultStore;

    this.handleClientJoinedServer = this.handleClientJoinedServer.bind(this);
    window.gameIpc.onClientJoinedServer(this.handleClientJoinedServer);
  }

  private handleClientJoinedServer(message: ClientJoinedServer) {
    const client = this.gameVaultStore.getClientById(message.gameInstanceId);
    if (!client) {
      return;
    }
    client.setServer(message.ip, message.port);
  }
}

export default GameIpcStore;
