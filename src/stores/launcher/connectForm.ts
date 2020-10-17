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