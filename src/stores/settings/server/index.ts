import { action, observable } from "mobx";
import ServerSettings from "src/settings/server";

class ServerSettingsStore {
    @observable settings: ServerSettings;

    @observable isLoading = false;
    @observable isSaving = false;

    @action loadSettings(): void {
        this.isLoading = true;

        window.soldat.server.loadConfig()
            .then(
                action(config => {
                    this.settings = new ServerSettings(config);
                    this.isLoading = false;
                })
            )
    }

    // TODO: we might want to implement functionality for checking
    // if server settings changed, so that we avoid unnecessary saves.
    @action saveSettings(): Promise<void> {
        if (this.settings.botsCountError) {
            return Promise.reject(this.settings.botsCountError);
        }

        this.isSaving = true;
        return window.soldat.server.saveConfig(this.settings.toConfig())
            .finally(
                action(() => this.isSaving = false)
            );
    }
}

export default ServerSettingsStore;