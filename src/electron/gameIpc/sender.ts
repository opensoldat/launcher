import net from "net";
import { CommandsMessage, GameMessage, GameMessageIds } from "./messages";

class GameIpcSender {
  private sendMessage(ipcSocket: net.Socket, message: GameMessage) {
    const str = JSON.stringify(message);
    ipcSocket.write(str);
  }

  sendShutdownCommand(ipcSocket: net.Socket) {
    const message: CommandsMessage = {
      id: GameMessageIds.Commands,
      commands: ["shutdown"],
    };
    this.sendMessage(ipcSocket, message);
  }
}

export default GameIpcSender;
