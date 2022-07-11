import { action, observable, makeObservable } from "mobx";
import GameSettings from "src/settings/client/game";

class GameSettingsStore {
    @observable settings: GameSettings;
    @observable isLoading = false;
    @observable isSaving = false;

    @action loadSettings = (): void => {
        this.isLoading = true;

        window.soldat.client.loadGameConfig()
        .then(
            action(config => {
                this.settings = new GameSettings(config);
                this.isLoading = false;
            })
        );
    }

    @action saveSettings = (): Promise<void> => {
        this.isSaving = true;

        return window.soldat.client.saveGameConfig(this.settings.toConfig())
            .finally(
                action(() => {
                    this.isSaving = false;
                })
            );
    }

    @action restoreDefaultSettings = (): void => {
        this.settings = new GameSettings();
    }

    constructor() {
        makeObservable(this);
    }
}

export default GameSettingsStore;