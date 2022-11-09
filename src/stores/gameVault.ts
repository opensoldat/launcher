import { action, makeObservable, observable } from "mobx";
import {
  AddedGameInstanceMessage,
  RemovedGameInstanceMessage,
} from "src/electronIpcMessages";
import GameProcessTypes from "src/gameProcessTypes";
import ClientInstance from "./clientInstance";

class GameVaultStore {
  @observable clients: ClientInstance[];

  constructor() {
    makeObservable(this);

    this.clients = [];
    this.handleAddedInstance = this.handleAddedInstance.bind(this);
    this.handleRemovedInstance = this.handleRemovedInstance.bind(this);

    window.gameVault.onAddedInstance(this.handleAddedInstance);
    window.gameVault.onRemovedInstance(this.handleRemovedInstance);
  }

  @action addClient(client: ClientInstance) {
    this.clients.push(client);
  }

  // TODO: computedFn?
  getClient(ip: string, port: number): ClientInstance {
    return this.clients.find(
      (clientInstance) =>
        clientInstance.ip === ip && clientInstance.port === port
    );
  }

  getClientById(id: string): ClientInstance {
    return this.clients.find((clientInstance) => clientInstance.id === id);
  }

  @action private handleAddedInstance(message: AddedGameInstanceMessage) {
    // We don't keep track of server instances, since they don't appear anywhere in UI.
    if (message.processType !== GameProcessTypes.Client) {
      return;
    }

    // Ignore if we already have this instance. This is for online client instances -
    // in this case renderer process creates a new instance on its own.
    if (this.getClientById(message.gameInstanceId)) {
      return;
    }

    const clientInstance = new ClientInstance();
    clientInstance.id = message.gameInstanceId;
    this.addClient(clientInstance);
  }

  @action private handleRemovedInstance(message: RemovedGameInstanceMessage) {
    const clientInstance = this.getClientById(message.gameInstanceId);
    if (!clientInstance) {
      return;
    }

    const index = this.clients.indexOf(clientInstance);
    this.clients.splice(index, 1);
  }
}

export default GameVaultStore;
