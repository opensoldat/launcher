import fs from "fs";
import { spawn } from "child_process";
import { soldatPaths } from "./paths";

const loadFileNames = function(): Promise<string[]> {
    const demoFileExtension = ".sdm";

    return fs.promises.readdir(soldatPaths.demosDirectory, { withFileTypes: true })
        .then(entries => {
            return entries
                .filter(entry => {
                    return entry.isFile() && entry.name.endsWith(demoFileExtension)
                })
                .map(entry => entry.name.slice(0, -demoFileExtension.length));
        })
        .catch(() => {
            return [];
        });
}

const play = function(fileName: string, onFailed: (error: Error) => void): void {
    /* Maybe consider validating fileName? Worst case I can imagine is trying to play
     * demo from parent directory, which doesn't seem to pose a real threat...
     * Unless Soldat itself has some problems.
     */
    const joinArguments = `-join ${fileName} 0`;
    const clientProcess = spawn(
        soldatPaths.clientExecutable,
        [ joinArguments ],
        { detached: true }
    );
    clientProcess.on("error", onFailed);
}

export { loadFileNames, play };