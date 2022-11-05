import { StartClientMessage, StopClientMessage } from "src/electronIpcMessages";
import ClientInstance from "./clientInstance";
import GameVaultStore from "./gameVault";
import ClientLaunchSettingsStore from "./launcher/clientLaunchSettings";

class OnlineGamesStore {
  readonly clientLaunchSettingsStore: ClientLaunchSettingsStore;
  readonly gameVaultStore: GameVaultStore;

  constructor(
    clientLaunchSettingsStore: ClientLaunchSettingsStore,
    gameVaultStore: GameVaultStore
  ) {
    this.clientLaunchSettingsStore = clientLaunchSettingsStore;
    this.gameVaultStore = gameVaultStore;
  }

  connect(ip: string, port: number, password: string): void {
    const clientInstance = new ClientInstance();
    clientInstance.ip = ip;
    clientInstance.port = port;
    this.gameVaultStore.addClient(clientInstance);

    const startMessage: StartClientMessage = {
      gameInstanceId: clientInstance.id,
      ip,
      port,
      password,
      launchArguments: this.clientLaunchSettingsStore.launchArguments,
    };
    window.gameClients.sendStartMessage(startMessage);
  }

  // Note that if there are multiple clients for the same ip/port pair, then we
  // only disconnect the first one we find.
  disconnect(ip: string, port: number): void {
    const clientInstance = this.gameVaultStore.getClient(ip, port);
    if (!clientInstance) {
      return;
    }

    const stopMessage: StopClientMessage = {
      gameInstanceId: clientInstance.id,
    };
    window.gameClients.sendStopMessage(stopMessage);
  }
}

export default OnlineGamesStore;
