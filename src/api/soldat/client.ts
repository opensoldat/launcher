import { ChildProcess, spawn } from "child_process";
import { isIPv4 } from "net";
import shortid from "shortid";

import { soldatPaths } from "./paths";

// Every client will be assigned a unique string identifier.
const clients = new Map<string, ChildProcess>();

/* At first glance, it doesn't seem like Soldat supports connecting
 * by hostname anymore, so we only accept ip address.
 *
 * "detachedProcess" parameter is passed to spawn() call. In short,
 * if it's true, the client process will be detached from our app, meaning
 * it will not get killed when our app closes. This is intended for
 * online games.
 * In case of local game, we have to kill the server process (otherwise user
 * would have to kill it on his own from task manager), so we might as well
 * kill the client connected to it. In this case, we pass false for "detachedProcess".
 * 
 * This function returns the unique identifier of the client being launched.
 */
const start = (
    ip: string,
    port: number,
    password: string,
    launchArguments: string,
    onFailed: (clientId: string, error: Error) => void,
    onTerminated: (clientId: string) => void,
    detachedProcess: boolean
 ): string => {
    if (!isIPv4(ip)) {
        throw Error("Invalid IP address passed to client launcher.");
    }
    
    if (typeof(port) !== "number" || !isFinite(port) || Math.round(port) !== port) {
        throw Error("Invalid port parameter passed to client launcher.");
    }

    const clientId = shortid.generate();
    let joinArguments = "-join " + ip + " " + port.toString();
    if (password && password.length > 0) {
        joinArguments += " " + password;
    }

    const clientProcess = spawn(soldatPaths.clientExecutable, [
        joinArguments,
        launchArguments
    ], { detached: detachedProcess });

    clientProcess.on("close", () => {
        onTerminated(clientId);
    });

    clientProcess.on("error", (error) => {
        onFailed(clientId, error);
    });

    clients.set(clientId, clientProcess);
    return clientId;
}

const stop = (clientId: string): void => {
    if (clientId == null || !clients.has(clientId)) {
        return;
    }

    const clientProcess = clients.get(clientId);
    if (!clientProcess.killed) {
        clientProcess.kill();
    }

    clients.delete(clientId);
}

export { start, stop };