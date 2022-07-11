import { action, computed, observable, makeObservable } from "mobx";
import ServerSettings from "src/settings/server";
import ServerMapsList from "src/settings/server/mapsList";

class ServerSettingsStore {
    @observable settings: ServerSettings;
    @observable mapsList: ServerMapsList;

    @observable isLoading = false;
    @observable isSaving = false;

    constructor() {
        makeObservable(this);
    }

    @computed get gotData(): boolean {
        return this.settings != null && this.mapsList != null;
    }

    @action loadAll(): void {
        this.isLoading = true;

        const loadServerConfig = window.soldat.server.loadConfig();
        const loadMapsList = window.soldat.server.loadMapsList();

        Promise.all([loadServerConfig, loadMapsList])
            .then(
                action(([serverConfig, mapsNames]) => {
                    this.settings = new ServerSettings(serverConfig);
                    this.mapsList = new ServerMapsList(mapsNames);

                    this.isLoading = false;
                })
            );
    }

    // TODO: we might want to implement functionality for checking
    // if server settings changed, so that we avoid unnecessary saves.
    @action saveAll(): Promise<void> {
        if (this.settings.botsCountError) {
            return Promise.reject(this.settings.botsCountError);
        }

        if (this.settings.network.portError) {
            return Promise.reject("Invalid port. " + this.settings.network.portError);
        }

        this.isSaving = true;

        const saveServerConfig = window.soldat.server.saveConfig(this.settings.toConfig());
        const saveMapsList = window.soldat.server.saveMapsList(this.mapsList.mapsNames);

        return Promise.all([saveServerConfig, saveMapsList])
            .then(() => Promise.resolve())
            .finally(
                action(() => this.isSaving = false)
            )
    }
}

export default ServerSettingsStore;