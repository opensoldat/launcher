import { action, observable, makeObservable } from "mobx";
import SoundSettings from "src/settings/client/sound";

class SoundSettingsStore {
    @observable settings: SoundSettings;
    @observable isLoading = false;
    @observable isSaving = false;

    constructor() {
        makeObservable(this);
    }

    @action loadSettings(): void {
        this.isLoading = true;

        window.soldat.client.loadSoundConfig()
        .then(
            action(config => {
                this.settings = new SoundSettings(config);
                this.isLoading = false;
            })
        );
    }

    @action saveSettings = (): Promise<void> => {
        this.isSaving = true;

        return window.soldat.client.saveSoundConfig(this.settings.toConfig())
        .finally(
            action(() => {
                this.isSaving = false;
            })
        );
    }

    @action restoreDefaultSettings = (): void => {
        this.settings = new SoundSettings();
    }
}

export default SoundSettingsStore;