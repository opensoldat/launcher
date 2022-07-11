import { defaults } from "lodash";
import { action, computed, observable, makeObservable } from "mobx";

export interface ClientLaunchSettings {
    localMount: boolean;
    mod: string;
    // TODO: consider allowing users to specify paths (fs_userpath, fs_basepath).
    customArguments: string;
}

const defaultLaunchSettings: ClientLaunchSettings = {
    localMount: false,
    mod: "",
    customArguments: ""
};

class ClientLaunchSettingsStore implements ClientLaunchSettings {
    @observable localMount: boolean;
    @observable mod: string;
    @observable customArguments: string;

    constructor() {
        makeObservable(this);
    }

    getSettings(): ClientLaunchSettings {
        return {
            localMount: this.localMount,
            mod: this.mod,
            customArguments: this.customArguments
        };
    }

    @action setSettings(settings: ClientLaunchSettings): void {
        this.localMount = settings?.localMount;
        this.mod = settings?.mod;
        this.customArguments = settings?.customArguments;

        defaults(this, defaultLaunchSettings);
    }

    @computed get launchArguments(): string {
        let result = this.customArguments;
        if (this.localMount) {
            result += " -fs_localmount 1";
        }
        if (this.mod && this.mod.length > 0) {
            result += ` -fs_mod "${this.mod}"`;
        }
        return result;
    }
}

export default ClientLaunchSettingsStore;