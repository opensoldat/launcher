import { defaults } from "lodash";
import { action, computed, observable } from "mobx";

export interface ClientLaunchSettings {
    localMount: boolean;
    // mod: string;
    // TODO: consider allowing users to specify paths (fs_userpath, fs_basepath).
    customArguments: string;
}

const defaultLaunchSettings: ClientLaunchSettings = {
    localMount: false,
    customArguments: ""
};

class ClientLaunchSettingsStore implements ClientLaunchSettings {
    @observable localMount: boolean;
    @observable customArguments: string;

    getSettings(): ClientLaunchSettings {
        return {
            localMount: this.localMount,
            customArguments: this.customArguments
        };
    }

    @action setSettings(settings: ClientLaunchSettings): void {
        this.localMount = settings?.localMount;
        this.customArguments = settings?.customArguments;

        defaults(this, defaultLaunchSettings);
    }

    @computed get launchArguments(): string {
        let result = this.customArguments;
        if (this.localMount) {
            result += " -fs_localmount 1";
        }
        return result;
    }
}

export default ClientLaunchSettingsStore;