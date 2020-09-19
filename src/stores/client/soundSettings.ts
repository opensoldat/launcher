import { action, observable, toJS } from "mobx";
import defaultSoundSettings from "../../constants/defaultSoundSettings";
import { SoundSettings } from "../../types";

class SoundSettingsStore {
    @observable settings: SoundSettings;
    @observable isLoading = false;
    @observable isSaving = false;

    @action loadSettings(): void {
        this.isLoading = true;

        window.soldat.client.loadSoundSettings()
        .then(
            action(soundSettings => {
                this.settings = soundSettings;
                this.isLoading = false;
            })
        );
    }

    @action saveSettings = (): Promise<void> => {
        this.isSaving = true;

        return window.soldat.client.saveSoundSettings(toJS(this.settings))
        .finally(
            action(() => {
                this.isSaving = false;
            })
        );
    }

    @action restoreDefaultSettings = (): void => {
        this.settings = defaultSoundSettings;
    }
}

export default SoundSettingsStore;