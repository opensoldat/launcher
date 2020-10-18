import { action, observable } from "mobx";
import ConnectFormStore, { ConnectFormData } from "./connectForm";
import LaunchArgumentsStore, { LaunchArguments } from "./launchArguments";

interface LauncherData {
    connectForm: ConnectFormData;
    launchArguments: LaunchArguments;
}

class LauncherDataStore {
    connectFormStore = new ConnectFormStore();
    launchArgumentsStore = new LaunchArgumentsStore();

    @observable isLoading = false;
    @observable gotData = false;

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
            this.launchArgumentsStore.setArguments(launcherData?.launchArguments);
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
            launchArguments: this.launchArgumentsStore.getArguments()
        };

        return window.launcher.saveData(JSON.stringify(data));
    }
}

export default LauncherDataStore;