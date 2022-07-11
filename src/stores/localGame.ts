import { observable, action, makeObservable } from "mobx";
import ClientLaunchSettingsStore from "./launcher/clientLaunchSettings";
import ServerLaunchSettingsStore from "./launcher/serverLaunchSettings";

class LocalGameStore {
    @observable isStarting = false;
    @observable isRunning = false;

    readonly clientLaunchSettingsStore: ClientLaunchSettingsStore;
    readonly serverLaunchSettingsStore: ServerLaunchSettingsStore;

    private localClientId: string;
    private localServerPort: number;
    private errorCallback: (errorMessage: string) => void;

    constructor(
        clientLaunchSettingsStore: ClientLaunchSettingsStore,
        serverLaunchSettingsStore: ServerLaunchSettingsStore) {
        makeObservable(this);
        this.clientLaunchSettingsStore = clientLaunchSettingsStore;
        this.serverLaunchSettingsStore = serverLaunchSettingsStore;
    }

    @action startLocalGame(serverPort: number, onError: (errorMessage: string) => void): void {
        this.errorCallback = onError;
        this.isStarting = true;
        this.localServerPort = serverPort;

        window.soldat.server.start(
            this.serverLaunchSettingsStore.launchArguments,
            this.onServerReady.bind(this),
            this.onServerFailed.bind(this),
            this.onServerTerminated.bind(this)
        );
    }

    @action stopLocalGame(): void {
        window.soldat.client.stop(this.localClientId);
        window.soldat.server.stop();

        this.isRunning = false;
        this.isStarting = false;
    }

    private onServerReady(): void {
        console.log("Server is ready.");

        try {
            this.localClientId = window.soldat.client.start(
                "127.0.0.1",
                this.localServerPort,
                null,
                this.clientLaunchSettingsStore.launchArguments,
                this.onLocalClientFailed.bind(this),
                this.onLocalClientTerminated.bind(this),
                false
            );
            
            this.isStarting = false;
            this.isRunning = true;
        } catch (error) {
            this.errorCallback(error.message);
        }
    }

    private onServerFailed(error: Error): void {
        this.isStarting = false;
        this.errorCallback(error.message);
    }

    private onServerTerminated(exitCode: number, stderr: string): void {
        console.log("Server terminated.");
        this.stopLocalGame();

        if (stderr && stderr.length > 0) {
            console.error(stderr);
            this.errorCallback("Problem with local server:\n" + stderr);
            return;
        }

        // exitCode seems to be 1 when we kill server process from task manager,
        // but we don't really want to raise an error in that case.
        if (exitCode && exitCode > 1) {
            this.errorCallback("Problem with local server.");
        }
    }

    private onLocalClientFailed(clientId: string, error: Error): void {
        this.stopLocalGame();

        if (error) {
            console.error(error);
            this.errorCallback("Problem with client:\n" + error);
        }
    }

    private onLocalClientTerminated(): void {
        this.stopLocalGame();
    }
}

export default LocalGameStore;