import { observable, computed } from "mobx";

class ConnectFormStore {
    @observable ip = "127.0.0.1";
    @observable port = "23073";
    @observable password = "";

    @computed get ipError(): string {
        if (!this.ip || this.ip.length === 0) {
            return "Can not be empty";
        }

        // Can't use isIPv4 from "net" directly here due to Node.js integration being turned off.
        if (!(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.ip))) {
            return "Invalid IP address";
        }

        return null;
    }

    @computed get portError(): string {
        if (!this.port || this.port.length === 0) {
            return "Can not be empty";
        }

        if (!/^\d+$/.test(this.port)) {
            return "Must only contain digits";
        }

        const portNumber = Number(this.port);
        if (isNaN(portNumber)) {
            return "Invalid port";
        }

        if (portNumber <= 0 || portNumber > 99999) {
            return "Must be in range [1, 99999]";
        }

        return null;
    }

    isValid(): boolean {
        return !this.ipError && !this.portError;
    }
}

export default ConnectFormStore;