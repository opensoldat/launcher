import { observable, action, makeObservable } from "mobx";
import { StartLocalGameMessage } from "src/electronIpcMessages";
import ClientLaunchSettingsStore from "./launcher/clientLaunchSettings";
import ServerLaunchSettingsStore from "./launcher/serverLaunchSettings";

class LocalGameStore {
  @observable isStarting = false;
  @observable isRunning = false;

  readonly clientLaunchSettingsStore: ClientLaunchSettingsStore;
  readonly serverLaunchSettingsStore: ServerLaunchSettingsStore;

  constructor(
    clientLaunchSettingsStore: ClientLaunchSettingsStore,
    serverLaunchSettingsStore: ServerLaunchSettingsStore
  ) {
    makeObservable(this);
    this.clientLaunchSettingsStore = clientLaunchSettingsStore;
    this.serverLaunchSettingsStore = serverLaunchSettingsStore;

    this.handleStarted = this.handleStarted.bind(this);
    this.handleStopped = this.handleStopped.bind(this);

    window.localGame.onStarted(this.handleStarted);
    window.localGame.onStopped(this.handleStopped);
  }

  @action startLocalGame(serverPort: number): void {
    this.isStarting = true;

    const message: StartLocalGameMessage = {
      clientLaunchArguments: this.clientLaunchSettingsStore.launchArguments,
      serverLaunchArguments: this.serverLaunchSettingsStore.launchArguments,
      serverPort,
    };
    window.localGame.sendStartMessage(message);
  }

  stopLocalGame(): void {
    window.localGame.sendStopMessage();
  }

  @action private handleStarted() {
    this.isStarting = false;
    this.isRunning = true;
  }

  @action private handleStopped() {
    this.isStarting = false;
    this.isRunning = false;
  }
}

export default LocalGameStore;
