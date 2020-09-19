import { action, observable, toJS } from "mobx";
import { ServerSettings } from "../../types";
import BotsValidationStore from "./botsValidation";

class ServerSettingsStore {
    @observable settings: ServerSettings;
    @observable isLoading = false;
    @observable isSaving = false;

    botsValidationStore = new BotsValidationStore(this);

    @action loadSettings = (): void => {
        this.isLoading = true;

        window.soldat.server.loadSettings()
        .then((serverSettings: ServerSettings) => {
            this.settings = serverSettings;
            this.isLoading = false;
        });
    }

    // TODO: we might want to implement functionality for checking
    // if server settings changed, so that we avoid unnecessary saves.
    @action saveSettings = (): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            if (this.botsValidationStore.countError) {
                reject(this.botsValidationStore.countError);
            }

            this.isSaving = true;

            window.soldat.server.saveSettings(toJS(this.settings))
            .then(() => {
                this.isSaving = false;
                resolve();
            })
            .catch((errorMessage: string) => {
                this.isSaving = false;
                reject(errorMessage);
            });
        });
    }
}

export default ServerSettingsStore;