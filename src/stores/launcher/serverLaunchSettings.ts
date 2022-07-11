import { defaults } from "lodash";
import { action, computed, observable, makeObservable } from "mobx";

export interface ServerLaunchSettings {
    // TODO: consider allowing users to specify paths (fs_userpath, fs_basepath).
    customArguments: string;
}

const defaultLaunchSettings: ServerLaunchSettings = {
    customArguments: ""
};

class ServerLaunchSettingsStore implements ServerLaunchSettings {
    @observable customArguments: string;

    constructor() {
        makeObservable(this);
    }

    getSettings(): ServerLaunchSettings {
        return {
            customArguments: this.customArguments
        }
    }

    @action setSettings(settings: ServerLaunchSettings): void {
        this.customArguments = settings?.customArguments;

        defaults(this, defaultLaunchSettings);
    }

    @computed get launchArguments(): string {
        return this.customArguments;
    }
}

export default ServerLaunchSettingsStore;