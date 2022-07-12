import OnlineGamesStore from "./onlineGames";
import { EventEmitter } from "events";
import child_process from "child_process";

test("Adds new client on successful connect", () => {
    const clientChildProcess = new EventEmitter() as child_process.ChildProcess;
    jest.spyOn(child_process, "spawn").mockImplementationOnce(() => {
        return clientChildProcess;
    })

    const store = new OnlineGamesStore();
    const errorCallback = jest.fn();
    store.connect("127.0.0.1", 23073, "", errorCallback);
    expect(store.clients).toHaveLength(1);
    expect(errorCallback).not.toBeCalled();
});

test("Removes client on disconnect", () => {
    class ChildProcessMock extends EventEmitter {
        public killed = false;

        public kill = (): boolean => {
            // Simulate successful close.
            this.killed = true;
            this.emit("close");
            return true;
        }
    }

    const clientChildProcess = new ChildProcessMock() as child_process.ChildProcess;
    jest.spyOn(child_process, "spawn").mockImplementationOnce(() => {
        return clientChildProcess;
    });

    const store = new OnlineGamesStore();
    const ip = "127.0.0.1";
    const port = 23073;

    const errorCallback = jest.fn();
    store.connect(ip, port, "", errorCallback);
    expect(errorCallback).not.toBeCalled();
    expect(store.clients).toHaveLength(1);

    store.disconnect(ip, port);
    expect(store.clients).toHaveLength(0);
});

test("Removes client on client process error (crashes, for instance)", () => {
    const clientChildProcess = new EventEmitter() as child_process.ChildProcess;
    jest.spyOn(child_process, "spawn").mockImplementationOnce(() => {
        return clientChildProcess;
    });

    const store = new OnlineGamesStore();
    const errorCallback = jest.fn();
    store.connect("127.0.0.1", 23073, "", errorCallback);
    expect(store.clients).toHaveLength(1);

    clientChildProcess.emit("error", new Error("Test"));

    expect(errorCallback).toBeCalledWith("Test");
    expect(store.clients).toHaveLength(0);
});