import { WebContents } from "electron";
import net from "net";
import { ElectronIpcChannels } from "src/electronIpcMessages";
import { GameInstance } from "./gameInstance";

/**
 * This class is meant to be the only storage for GameInstances.
 * Any code that needs to access game instances' data (process or IPC socket)
 * must rely on the unique instance of GameVault to retrieve it. Other classes
 * must not store references to GameInstances. The reasoning is that GameInstances
 * can be added and removed at any time - by keeping a reference to a GameInstance,
 * the other classes wouldn't know if the instance is still alive or not.
 * 
 * The GameVault is designed to always be up-to-date when it comes to GameInstances.
 * As such, it has the responsibility of notifying the renderer process when instances
 * are added or removed.
 */
class GameVault {
    private gameInstances: GameInstance[];
    private readonly mainWindow: WebContents;

    constructor(mainWindow: WebContents) {
        this.gameInstances = [];
        this.mainWindow = mainWindow;
    }

    addInstance(gameInstance: GameInstance) {
        this.gameInstances.push(gameInstance);

        this.mainWindow.send(ElectronIpcChannels.AddedGameInstance, {
            gameInstanceId: gameInstance.id,
            processType: gameInstance.processType
        });
    }

    removeInstance(gameInstance: GameInstance) {
        const instanceId = gameInstance.id;

        const index = this.gameInstances.indexOf(gameInstance);
        if (index === -1) {
            console.warn("Trying to remove a game instance that doesn't exist!");
            return;
        }
        this.gameInstances.splice(index, 1);

        this.mainWindow.send(ElectronIpcChannels.RemovedGameInstance, {
            gameInstanceId: instanceId,
        });
    }

    getById(gameInstanceId: string): GameInstance {
        return this.gameInstances.find(instance => instance.id === gameInstanceId);
    }

    getByProcessId(processId: number) {
        return this.gameInstances.find(instance =>
            instance.childProcess && instance.childProcess.pid == processId);
    }

    getBySocket(socket: net.Socket) {
        return this.gameInstances.find(instance => instance.ipcSocket === socket);
    }
}

export default GameVault;