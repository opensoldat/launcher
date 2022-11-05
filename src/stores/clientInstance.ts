import { makeObservable, observable } from "mobx";
import { nanoid } from "nanoid/non-secure";

class ClientInstance {
  id: string;
  @observable ip: string;
  @observable port: number;

  constructor() {
    makeObservable(this);
    this.id = nanoid(8);
  }
}

export default ClientInstance;
