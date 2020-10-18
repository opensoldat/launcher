import { defaults } from "lodash";
import { action, observable } from "mobx";

export interface LaunchArguments {
    client: string;
    server: string;
}

const defaultLaunchArguments: LaunchArguments = {
    client: "",
    server: ""
};

class LaunchArgumentsStore implements LaunchArguments {
    @observable client: string;
    @observable server: string;

    getArguments(): LaunchArguments {
        return {
            client: this.client,
            server: this.server
        };
    }

    @action setArguments(launchArguments: LaunchArguments): void {
        this.client = launchArguments?.client;
        this.server = launchArguments?.server;

        defaults(this, defaultLaunchArguments);
    }
}

export default LaunchArgumentsStore;