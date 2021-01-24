import { defaults } from "lodash";
import { observable, computed, action } from "mobx";
import validateNumber from "src/validation/number";

export interface ConnectFormData {
    ip: string;
    port: string;
    password: string;
}

const defaultData: ConnectFormData = {
    ip: "127.0.0.1",
    port: "23073",
    password: ""
};

class ConnectFormStore implements ConnectFormData {
    @observable ip: string;
    @observable port: string;
    @observable password: string;

    getData(): ConnectFormData {
        return {
            ip: this.ip,
            port: this.port,
            password: this.password
        };
    }
    
    @action setData(data: ConnectFormData): void {
        this.ip = data?.ip;
        this.port = data?.port;
        this.password = data?.password;

        defaults(this, defaultData);
    }

    @action setFromSoldatLink(soldatLink: string): void {
        const SOLDAT_PROTOCOL = "soldat://";
        if (!soldatLink || !soldatLink.startsWith(SOLDAT_PROTOCOL)) {
            return;
        }

        const link = soldatLink.slice(SOLDAT_PROTOCOL.length);
        const portSeparator = ":", passSeparator = "/";
        const portSeparatorIdx = link.indexOf(portSeparator);
        const passSeparatorIdx = link.indexOf(passSeparator);

        let ip = "";
        if (portSeparatorIdx >= 0) {
            ip = link.substring(0, portSeparatorIdx);
        } else {
            if (passSeparatorIdx >= 0) {
                ip = link.substring(0, passSeparatorIdx);
            } else {
                ip = link;
            }
        }

        let port = "";
        if (portSeparatorIdx >= 0) {
            if (passSeparatorIdx >= 0) {
                port = link.substring(portSeparatorIdx + 1, passSeparatorIdx);
            } else {
                port = link.substring(portSeparatorIdx + 1)
            }
        }

        let pass = "";
        if (passSeparatorIdx >= 0) {
            pass = link.substring(passSeparatorIdx + 1);
        }

        if (ip.length > 0) {
            this.ip = ip;
        }
        if (port.length > 0) {
            this.port = port;
        }
        if (pass.length > 0) {
            this.password = pass;
        }
    }

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
        return validateNumber(this.port, 1, 65535);
    }

    isValid(): boolean {
        return !this.ipError && !this.portError;
    }
}

export default ConnectFormStore;