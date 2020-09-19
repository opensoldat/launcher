import { action, computed, observable, toJS } from "mobx";
import defaultPlayerSettings from "../../constants/defaultPlayerSettings";
import { PlayerSettings } from "../../types";

class PlayerSettingsStore {
    @observable settings: PlayerSettings;
    @observable isLoading = false;
    @observable isSaving = false;

    @action loadSettings(): void {
        this.isLoading = true;

        window.soldat.client.loadPlayerSettings()
        .then(
            action(playerSettings => {
                this.settings = playerSettings;
                this.isLoading = false;
            })
        );
    }

    @action saveSettings = (): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            if (this.nicknameError && this.nicknameError.length > 0) {
                reject(this.nicknameError);
            }

            this.isSaving = true;

            window.soldat.client.savePlayerSettings(toJS(this.settings))
            .then(resolve)
            .catch(reject)
            .finally(
                action(() => {
                    this.isSaving = false;
                })
            );
        });
    }

    @computed get nicknameError(): string {
        if (this.settings.nickname.length == 0) {
            return "Nickname can't be empty";
        }
        else if (this.settings.nickname.length > 24) {
            return "Nickname is too long";
        }
        return "";
    }

    @action restoreDefaultSettings = (): void => {
        this.settings = defaultPlayerSettings;
    }
}

export default PlayerSettingsStore;