import { WebContents } from "electron";
import net from "net";
import {
  ClientJoinedServer,
  ElectronIpcChannels,
} from "src/electronIpcMessages";
import GameVault from "../gameVault";
import { JoinedServerMessage } from "./messages";

class JoinedServerHandler {
  private readonly gameVault: GameVault;
  private readonly mainWindow: WebContents;

  constructor(gameVault: GameVault, mainWindow: WebContents) {
    this.gameVault = gameVault;
    this.mainWindow = mainWindow;
  }

  handleMessage(message: JoinedServerMessage, socket: net.Socket) {
    const gameInstance = this.gameVault.getBySocket(socket);
    if (!gameInstance) {
      return;
    }

    const msg: ClientJoinedServer = {
      gameInstanceId: gameInstance.id,
      ip: message.ip,
      port: message.port,
    };
    this.mainWindow.send(ElectronIpcChannels.ClientJoinedServer, msg);
  }
}

export default JoinedServerHandler;
