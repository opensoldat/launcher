import { defaultsDeep } from "lodash";
import { computed, observable, makeObservable } from "mobx";
import { ServerConfig } from "src/api/soldat/configs/types";
import validateNumber from "src/validation/number";

interface NetworkSettingsData {
    port: string;
}

const defaultNetworkSettings: NetworkSettingsData = {
    port: "23074"
};

class NetworkSettings implements NetworkSettingsData {
    @observable port: string;

    constructor(config?: ServerConfig) {
        makeObservable(this);
        this.port = config?.cvars.net_port;

        defaultsDeep(this, defaultNetworkSettings);
    }

    @computed get portError(): string {
        return validateNumber(this.port, 1, 65535);
    }
}

export default NetworkSettings;