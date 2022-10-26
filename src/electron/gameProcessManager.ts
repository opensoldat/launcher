import { ChildProcess, spawn } from "child_process";
import { WebContents } from "electron";
import { isIPv4 } from "net";

import { ElectronIpcChannels } from "src/electronIpcMessages";
import GameProcessTypes from "src/gameProcessTypes";
import { gamePaths } from "./gamePaths";
import GameVault from "./gameVault";
import { GameInstance } from "./gameInstance";

class GameProcessManager {
    private readonly gameVault: GameVault;
    private readonly mainWindow: WebContents;

    constructor(gameVault: GameVault, mainWindow: WebContents) {
        this.gameVault = gameVault;
        this.mainWindow = mainWindow;
    }

    spawnClient(
        ip: string,
        port: number,
        password: string,
        launchArguments: string,
        detached: boolean
    ): GameInstance {
        if (!isIPv4(ip)) {
            throw Error("Invalid IP address passed to client launcher.");
        }
        
        if (typeof(port) !== "number" || !isFinite(port) || Math.round(port) !== port) {
            throw Error("Invalid port parameter passed to client launcher.");
        }
    
        let joinArguments = "-join " + ip + " " + port.toString();
        if (password && password.length > 0) {
            joinArguments += " " + password;
        }
    
        const process = spawn(gamePaths.clientExecutable, [
            "-fs_portable 1",
            "-launcher_ipc_enable 1",
            joinArguments,
            launchArguments
        ], { detached });
        const gameInstance = new GameInstance(GameProcessTypes.Client, process);
        this.gameVault.addInstance(gameInstance);
        this.handleProcessLifecycle(process, gameInstance.id);
        return gameInstance;
    }

    spawnServer(launchArguments: string): GameInstance {
        const process = spawn(gamePaths.serverExecutable, [
            "-launcher_ipc_enable 1",
            launchArguments
        ]);
        const gameInstance = new GameInstance(GameProcessTypes.Server, process);
        this.gameVault.addInstance(gameInstance);
        this.handleProcessLifecycle(process, gameInstance.id);
        return gameInstance;
    }

    private handleProcessLifecycle(process: ChildProcess, gameInstanceId: string) {
        process.on("error", err => {
            this.sendProcessFailedMessage(gameInstanceId, err.message);
            const instance = this.gameVault.getById(gameInstanceId);
            this.gameVault.removeInstance(instance);
        });

        process.on("spawn", () => {
            this.mainWindow.send(ElectronIpcChannels.GameProcessSpawned, {
                gameInstanceId
            });
        });

        process.stderr.setEncoding("utf-8");
        process.stderr.on("data", (output: string) => {
            const gameInstance = this.gameVault.getById(gameInstanceId);
            gameInstance.stderr += output;
        });

        process.on("close", exitCode => {
            // TODO: I think game could be more consistent when errors occur.
            // With current implementation the server terminates cleanly when it fails
            // to bind socket - not sure if that's expected.
            // I feel like stderr gets populated when segmentation faults occur,
            // but not when we catch that something went wrong.
            const gameInstance = this.gameVault.getById(gameInstanceId);
            if (gameInstance.stderr && gameInstance.stderr.length > 0) {
                this.sendProcessFailedMessage(gameInstanceId, gameInstance.stderr);
            } else {
                // exitCode seems to be 1 when we kill server process from task manager,
                // but we don't really want to raise an error in that case.
                if (exitCode && exitCode > 1) {
                    this.sendProcessFailedMessage(
                        gameInstanceId,
                        `Process terminated with exit code: ${exitCode}`
                    );
                }
            }

            this.gameVault.removeInstance(gameInstance);
        })
    }

    private sendProcessFailedMessage(gameInstanceId: string, errorMessage: string) {
        this.mainWindow.send(ElectronIpcChannels.GameProcessFailed, {
            gameInstanceId,
            errorMessage
        });
    }
}

export default GameProcessManager;