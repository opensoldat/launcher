import { action, observable, toJS } from "mobx";
import shortid from "shortid";
import defaultControlsSettings from "../../constants/defaultControlsSettings";
import { ControlsSettings, CommonGameCommands, CommonKeyBinding, KeyBinding } from "../../types";

class ControlsSettingsStore {
    @observable settings: ControlsSettings;
    @observable isLoading = false;
    @observable isSaving = false;

    @action addCustomBinding = (): void => {
        this.settings.customBindings.unshift({
            id: shortid.generate(),
            command: "",
            key: ""
        });
    }

    @action deleteCustomBinding = (bindingId: string): void => {
        const index = this.settings.customBindings.findIndex(
            binding => binding.id === bindingId
        );

        if (index !== -1) {
            this.settings.customBindings.splice(index, 1);
        }
    }

    getAnyBinding = (bindingId: string): KeyBinding => {
        const findById = (binding: KeyBinding): boolean => binding.id === bindingId;

        return (
            this.settings.commonBindings.find(findById) ||
            this.settings.customBindings.find(findById)
        );
    }

    getCommonBinding = (command: CommonGameCommands): CommonKeyBinding => {
        return this.settings?.commonBindings.find(
            commonBinding => commonBinding.command === command
        );
    }

    getCustomBinding = (bindingId: string): KeyBinding => {
        return this.settings.customBindings.find(
            binding => binding.id === bindingId
        );
    }

    @action setBindingKey = (bindingId: string, newKey: string): void => {
        if (newKey && newKey.length > 0) {
            // We clear out all bindings that previously used the new key, so that
            // we don't have multiple bindings with same key.
            const clearDuplicateKeys = action((binding: KeyBinding): void => {
                if (binding.key === newKey && binding.id !== bindingId) {
                    binding.key = "";
                }
            });

            this.settings.commonBindings.forEach(clearDuplicateKeys);
            this.settings.customBindings.forEach(clearDuplicateKeys);
        }

        this.getAnyBinding(bindingId).key = newKey;
    }

    @action setCustomBindingCommand = (bindingId: string, newCommand: string): void => {
        this.getCustomBinding(bindingId).command = newCommand;
    }

    @action loadSettings = (): void => {
        this.isLoading = true;

        window.soldat.client.loadControlsSettings()
        .then(
            action(controlsSettings => {
                this.settings = controlsSettings;
                this.isLoading = false;
            })
        );
    }

    @action saveSettings = (): Promise<void> => {
        this.isSaving = true;

        return window.soldat.client.saveControlsSettings(toJS(this.settings))
        .finally(
            action(() => {
                this.isSaving = false;
            })
        );
    }

    @action restoreDefaultSettings = (): void => {
        this.settings = defaultControlsSettings;
    }
}

export default ControlsSettingsStore;