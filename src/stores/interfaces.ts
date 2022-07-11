import { action, computed, observable, makeObservable } from "mobx";
import ClientLaunchSettingsStore from "./launcher/clientLaunchSettings";
import { SelectOption } from "src/types";

class InterfacesStore {
    readonly clientLaunchSettingsStore: ClientLaunchSettingsStore;

    /* Interfaces can come from 3 places:
    * 1) Archive files with .sint extension in custom-interfaces directory.
    * 2) Subdirectories in custom-interfaces directory (when local mount is enabled).
    * 3) Directories in soldat.smod (when local mount is disabled).
    * 
    * Our apis cover 1) and 2). For 3rd case, we rely on hard-coded strings,
    * since soldat.smod is meant to be static, and it's not supposed to be edited
    * by users.
    */
    @observable interfaceArchivesNames: string[];
    @observable interfaceDirectoriesNames: string[];
    readonly defaultInterfacesNames = [
        "cabbage",
        "classic",
        "lacey-v2",
        "micro1",
        "military",
        "predator",
        "soldat style",
        "storm",
        "tech",
        "text"
    ];

    @observable isLoading = false;

    constructor(clientLaunchSettingsStore: ClientLaunchSettingsStore) {
        makeObservable(this);
        this.clientLaunchSettingsStore = clientLaunchSettingsStore;
    }

    @computed get gotInterfaces(): boolean {
        return this.interfaceArchivesNames != null &&
            this.interfaceDirectoriesNames != null;
    }

    @action loadInterfaces(): void {
        this.isLoading = true;

        Promise.all([
            window.soldat.interfaces.listArchivesNames(),
            window.soldat.interfaces.listDirectoriesNames()
        ])
        .then(
            action(([archivesNames, directoriesNames]) => {
                this.interfaceArchivesNames = archivesNames;
                this.interfaceDirectoriesNames = directoriesNames;
                this.isLoading = false;
            })
        );
    }

    @computed get selectOptions(): SelectOption[] {
        let interfacesNames = this.interfaceArchivesNames.slice();
        if (this.clientLaunchSettingsStore.localMount) {
            interfacesNames = interfacesNames.concat(this.interfaceDirectoriesNames.slice());
        } else {
            interfacesNames = interfacesNames.concat(this.defaultInterfacesNames);
        }
        interfacesNames.sort();

        return ["Default"].concat(interfacesNames)
            .map(interfaceName => {
                return {
                    label: interfaceName,
                    value: interfaceName
                };
            });
    }
}

export default InterfacesStore;