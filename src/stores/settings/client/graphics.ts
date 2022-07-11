import { action, observable, makeObservable } from "mobx";
import GraphicsSettings from "src/settings/client/graphics";

class GraphicsSettingsStore {
    @observable settings: GraphicsSettings;
    @observable isLoading = false;
    @observable isSaving = false;

    @action loadSettings = (): void => {
        this.isLoading = true;

        window.soldat.client.loadGraphicsConfig()
        .then(
            action(config => {
                this.settings = new GraphicsSettings(config);
                this.isLoading = false;
            })
        );
    }

    @action saveSettings = (): Promise<void> => {
        this.isSaving = true;

        return window.soldat.client.saveGraphicsConfig(this.settings.toConfig())
            .finally(
                action(() => {
                    this.isSaving = false;
                })
            );
    }

    @action restoreDefaultSettings = (): void => {
        this.settings = new GraphicsSettings();
    }

    constructor() {
        makeObservable(this);
    }
}

export default GraphicsSettingsStore;