import { action, computed, observable, makeObservable } from "mobx";
import ControlsSettings from "src/settings/client/controls";
import CustomBindings from "src/settings/client/customBindings";
import { KeyBinding } from "src/types";

class ControlsWrapperStore {
    @observable controlsSettings: ControlsSettings;
    @observable customBindings: CustomBindings;

    @observable isLoading = false;
    @observable isSaving = false;

    constructor() {
        makeObservable(this);
    }

    @computed get gotData(): boolean {
        return this.controlsSettings != null && this.customBindings != null
    }

    @action loadAll(): void {
        this.isLoading = true;

        const loadSettings = window.soldat.client.loadControlsConfig()
            .then(
                action(config => {
                    this.controlsSettings = new ControlsSettings(config);
                })
            );
        const loadCustomBindings = window.soldat.client.loadCustomBindingsConfig()
            .then(
                action(config => {
                    this.customBindings = new CustomBindings(config);
                })
            )

        Promise.all([loadSettings, loadCustomBindings])
            .finally(
                action(() => this.isLoading = false)
            )
    }

    @action restoreDefaults(): void {
        this.controlsSettings = new ControlsSettings();
        this.customBindings = new CustomBindings();
    }

    @action saveAll(): Promise<void> {
        this.isSaving = true;

        const saveSettings = window.soldat.client.saveControlsConfig(this.controlsSettings.toConfig())
        const saveCustomBindings = window.soldat.client.saveCustomBindingsConfig(this.customBindings.toConfig())

        return Promise.all([saveSettings, saveCustomBindings])
            .then(() => Promise.resolve())
            .finally(
                action(() => this.isSaving = false)
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

            this.controlsSettings.bindings.forEach(clearDuplicateKeys);
            this.customBindings.bindings.forEach(clearDuplicateKeys);
        }

        const binding =
            this.controlsSettings.getBindingById(bindingId) ||
            this.customBindings.getById(bindingId);
        if (binding != null) {
            binding.key = newKey;
        }
    }
}

export default ControlsWrapperStore;