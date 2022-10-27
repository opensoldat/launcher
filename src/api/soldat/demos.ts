import { spawn } from "child_process";
import { soldatPaths } from "./paths";

const play = function (
  fileName: string,
  onFailed: (error: Error) => void
): void {
  /* Maybe consider validating fileName? Worst case I can imagine is trying to play
   * demo from parent directory, which doesn't seem to pose a real threat...
   * Unless Soldat itself has some problems.
   */
  const joinArguments = `-join ${fileName} 0`;
  const clientProcess = spawn(soldatPaths.clientExecutable, [joinArguments], {
    detached: true,
  });
  clientProcess.on("error", onFailed);
};

export { play };
