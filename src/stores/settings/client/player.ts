import { action, observable, makeObservable } from "mobx";
import PlayerSettings from "../../../settings/client/player";

class PlayerSettingsStore {
    @observable settings: PlayerSettings;
    @observable isLoading = false;
    @observable isSaving = false;

    constructor() {
        makeObservable(this);
    }

    @action loadSettings(): void {
        this.isLoading = true;

        window.soldat.client.loadPlayerConfig()
        .then(
            action(config => {
                this.settings = new PlayerSettings(config);
                this.isLoading = false;
            })
        );
    }

    @action saveSettings(): Promise<void> {
        if (this.settings.nicknameError && this.settings.nicknameError.length > 0) {
            return Promise.reject(this.settings.nicknameError);
        }

        this.isSaving = true;
        return window.soldat.client.savePlayerConfig(this.settings.toConfig())
            .finally(
                action(() => {
                    this.isSaving = false;
                })
            );
    }

    @action restoreDefaultSettings(): void {
        this.settings = new PlayerSettings();
    }
}

export default PlayerSettingsStore;