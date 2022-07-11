import { action, observable, makeObservable } from "mobx";
import { computedFn } from "mobx-utils";
import ClientLaunchSettingsStore from "./launcher/clientLaunchSettings";

interface Client {
    // Unique identifier, so that we know which client terminated.
    id: string;

    serverIp: string;
    serverPort: number;

    onError: (errorMessage: string) => void;
}

class OnlineGamesStore {
    @observable readonly clients: Client[] = [];
    readonly clientLaunchSettingsStore: ClientLaunchSettingsStore;

    constructor(clientLaunchSettingsStore?: ClientLaunchSettingsStore) {
        makeObservable(this);
        this.clientLaunchSettingsStore = clientLaunchSettingsStore;
    }

    @action connect = (
        ip: string,
        port: number,
        password: string,
        onError: (errorMessage: string) => void    
    ): void => {
        try {
            const clientId = window.soldat.client.start(
                ip, port, password,
                this.clientLaunchSettingsStore?.launchArguments,
                this.onClientFailed,
                this.onClientTerminated,
                true
            );

            this.clients.push({
                id: clientId,
                serverIp: ip,
                serverPort: port,
                onError
            });
        } catch (error) {
            onError(error.message);
        }
    }

    disconnect = (ip: string, port: number): void => {
        const client = this.getClient(ip, port);
        if (!client) {
            return;
        }

        window.soldat.client.stop(client.id);

        // We don't remove client from clients list yet;
        // it will be handled when client actually terminates,
        // and the related callback gets called.
    }

    getClient = computedFn((serverIp: string, serverPort: number): Client => {
        return this.clients.find(
            client => client.serverIp === serverIp && client.serverPort === serverPort
        );
    });

    getClientById = (clientId: string): Client => {
        return this.clients.find(
            client => client.id === clientId
        );
    }

    private onClientFailed = (clientId: string, error: Error): void => {
        if (error) {
            this.getClientById(clientId).onError(error.message);
        }
        this.removeClient(clientId);
    }

    private onClientTerminated = (clientId: string): void => {
        this.removeClient(clientId);
    }

    @action private removeClient = (clientId: string): void => {
        const clientIndex = this.clients.findIndex(client => client.id === clientId);
        if (clientIndex === -1) {
            return;
        }
        this.clients.splice(clientIndex, 1);
    }
}

export default OnlineGamesStore;