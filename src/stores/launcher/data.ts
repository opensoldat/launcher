import { action, observable, makeObservable } from "mobx";
import ConnectFormStore, { ConnectFormData } from "./connectForm";
import ClientLaunchSettingsStore, { ClientLaunchSettings } from "./clientLaunchSettings";
import ServerLaunchSettingsStore, { ServerLaunchSettings } from "./serverLaunchSettings";

interface LauncherData {
    connectForm: ConnectFormData;
    clientLaunchSettings: ClientLaunchSettings;
    serverLaunchSettings: ServerLaunchSettings;
}

class LauncherDataStore {
    connectFormStore = new ConnectFormStore();
    clientLaunchSettingsStore = new ClientLaunchSettingsStore();
    serverLaunchSettingsStore = new ServerLaunchSettingsStore();

    @observable isLoading = false;
    @observable gotData = false;

    constructor() {
        makeObservable(this);
    }

    @action loadData(): void {
        this.isLoading = true;

        window.launcher.loadData()
        .then(fileContent => {
            let data: LauncherData;
            try {
                data = JSON.parse(fileContent);
            } catch (error) {
                console.warn("Could not parse launcher's data");
            }
            return data;
        })
        .then(launcherData => {
            this.connectFormStore.setData(launcherData?.connectForm);
            this.clientLaunchSettingsStore.setSettings(launcherData?.clientLaunchSettings);
            this.serverLaunchSettingsStore.setSettings(launcherData?.serverLaunchSettings);
        })
        .finally(
            action(() => {
                this.isLoading = false;
                this.gotData = true;
            })
        );
    }

    saveData(): Promise<void> {
        const data: LauncherData = {
            connectForm: this.connectFormStore.getData(),
            clientLaunchSettings: this.clientLaunchSettingsStore.getSettings(),
            serverLaunchSettings: this.serverLaunchSettingsStore.getSettings()
        };

        return window.launcher.saveData(JSON.stringify(data));
    }
}

export default LauncherDataStore;