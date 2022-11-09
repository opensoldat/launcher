import { action, makeObservable, observable } from "mobx";
import { nanoid } from "nanoid/non-secure";

class ClientInstance {
  id: string;
  @observable ip: string;
  @observable port: number;

  constructor() {
    makeObservable(this);
    this.id = nanoid(8);
  }

  @action setServer(ip: string, port: number): void {
    this.ip = ip;
    this.port = port;
  }
}

export default ClientInstance;
