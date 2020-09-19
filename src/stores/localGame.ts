import { observable, action } from "mobx";

class LocalGameStore {
    @observable isStarting = false;
    @observable isRunning = false;

    private localClientId: string = undefined;
    private errorCallback: (errorMessage: string) => void = undefined;

    @action startLocalGame(port: number, onError: (errorMessage: string) => void): void {
        this.errorCallback = onError;
        this.isStarting = true;

        try {
            window.soldat.server.start(port,
                this.onServerReady.bind(this),
                this.onServerFailed.bind(this),
                this.onServerTerminated.bind(this));
        } catch (error) {
            this.errorCallback(error.message);
        }
    }

    @action stopLocalGame(): void {
        window.soldat.client.stop(this.localClientId);
        this.localClientId = undefined;
        window.soldat.server.stop();

        this.isRunning = false;
        this.isStarting = false;
    }

    private onServerReady(port: number): void {
        console.log("Server is ready.");

        try {
            this.localClientId = window.soldat.client.start(
                "127.0.0.1",
                port,
                null,
                this.onLocalClientFailed.bind(this),
                this.onLocalClientTerminated.bind(this),
                false);
            
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