import { ChildProcess } from "child_process";
import net from "net";
import GameProcessTypes from "src/gameProcessTypes";

/**
 * This class represents a running game process (client or server).
 * Use the GameInstanceBuilder class to create new instances.
 *
 * Note that we also keep track of games that weren't spawned from launcher;
 * in such cases, the game connects to our IPC server, and that's the only
 * channel we have to control it.
 *
 * Also note that we only store data needed by the main process - renderer will
 * store its own info when receiving messages through IPC.
 */
class GameInstance {
  /* Process id is not enough to uniquely identify our game instances,
   * since there can be errors on spawn - in such cases process id is
   * undefined, and UI can't tell which process failed. */
  id: string;

  childProcess?: ChildProcess;
  processType: GameProcessTypes;
  ipcSocket?: net.Socket;

  stderr: string = "";
}

export default GameInstance;
