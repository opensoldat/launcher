import { action, computed, observable } from "mobx";
import ClientLaunchSettingsStore from "./launcher/clientLaunchSettings";
import { SelectOption } from "src/types";

class InterfacesStore {
    readonly clientLaunchSettingsStore: ClientLaunchSettingsStore;

    @observable archiveInterfaceNames: string[];
    @observable directoryInterfaceNames: string[];
    readonly defaultInterfaceNames = [
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
        this.clientLaunchSettingsStore = clientLaunchSettingsStore;
    }

    @computed get gotInterfaces(): boolean {
        return this.archiveInterfaceNames != null &&
            this.directoryInterfaceNames != null;
    }

    @action loadInterfaces(): void {
        this.isLoading = true;

        Promise.all([
            window.soldat.interfaces.loadArchiveNames(),
            window.soldat.interfaces.loadDirectoryNames()
        ])
        .then(
            action(([archiveNames, directoryNames]) => {
                this.archiveInterfaceNames = archiveNames;
                this.directoryInterfaceNames = directoryNames;
                this.isLoading = false;
            })
        );
    }

    @computed get selectOptions(): SelectOption[] {
        let interfaceNames = this.archiveInterfaceNames.slice();
        if (this.clientLaunchSettingsStore.localMount) {
            interfaceNames = interfaceNames.concat(this.directoryInterfaceNames.slice());
        } else {
            interfaceNames = interfaceNames.concat(this.defaultInterfaceNames);
        }
        interfaceNames.sort();

        return ["Default"].concat(interfaceNames)
            .map(interfaceName => {
                return {
                    label: interfaceName,
                    value: interfaceName
                };
            });
    }
}

export default InterfacesStore;