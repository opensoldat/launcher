import { ChildProcess, spawn } from "child_process";
import { soldatPaths } from "./paths";

/* We only allow one server process to run at a time.
 * It's worth noting that we are responsible for
 * terminating the server process - we don't create
 * any window or shell for server, so users can't really
 * stop the server themselves (except for killing the process,
 * for example from task manager). Luckily for us, processes
 * that are started with spawn() will get killed once our app
 * closes, unless we pass "detached" option to spawn().
 */
let serverProcess: ChildProcess = undefined;

const start = (
    port: number,
    onReady: (port: number) => void,
    onFailed: (error: Error) => void,
    onTerminated: (exitCode: number, stderr: string) => void
): void => {
    if (typeof(port) !== "number" || !isFinite(port) || Math.round(port) !== port) {
        throw Error("Invalid port parameter passed to server launcher.");
    }

    serverProcess = spawn(soldatPaths.serverExecutable, [
        "-net_port " + port.toString()
    ]);

    // We collect output from stderr, so that we can know when
    // server terminated unexpectedly, and when it was intended.
    // On Windows, this doesn't seem too reliable when server crashes.
    // It works in most cases, but sometimes "close" event is raised
    // before we receive any output from stderr...
    // So, we'll rely on exit codes too.
    // Ideally the server would not crash probably :)
    let stderrOutput = "";
    serverProcess.stderr.setEncoding("utf8");
    serverProcess.stderr.on("data", (output: string) => {
        stderrOutput += output;
    });

    // For now this seems to get the job done, even though a proper
    // communication system might be better...
    serverProcess.stdout.setEncoding("utf8");
    serverProcess.stdout.on("data", (output: string) => {
        if (output.includes("[NET] Game networking initialized.")) {
            onReady(port);
        }
    });

    serverProcess.on("close", (exitCode: number) => {
        onTerminated(exitCode, stderrOutput);
    });

    // This should handle scenario when executable was not found,
    // and other errors that might occur on spawn.
    serverProcess.on("error", (error) => {
        onFailed(error);
    });
}

const stop = (): void => {
    if (serverProcess == null) {
        return;
    }

    if (serverProcess.killed) {
        serverProcess = undefined;
        return;
    }

    serverProcess.kill();
    serverProcess = undefined;
}

export { start, stop };