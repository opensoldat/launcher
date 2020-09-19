import { action, observable, toJS } from "mobx";
import defaultGraphicsSettings from "../../constants/defaultGraphicsSettings";
import { GraphicsSettings } from "../../types";

class GraphicsSettingsStore {
    @observable settings: GraphicsSettings;
    @observable isLoading = false;
    @observable isSaving = false;

    @action loadSettings = (): void => {
        this.isLoading = true;

        window.soldat.client.loadGraphicsSettings()
        .then(
            action(graphicsSettings => {
                this.settings = graphicsSettings;
                this.isLoading = false;
            })
        );
    }

    @action saveSettings = (): Promise<void> => {
        this.isSaving = true;

        return window.soldat.client.saveGraphicsSettings(toJS(this.settings))
        .finally(
            action(() => {
                this.isSaving = false;
            })
        );
    }

    @action restoreDefaultSettings = (): void => {
        this.settings = defaultGraphicsSettings;
    }
}

export default GraphicsSettingsStore;