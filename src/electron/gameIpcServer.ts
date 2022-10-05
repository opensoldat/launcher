import { CommandsMessage, ElectronIpcChannels } from "src/electronIpcMessages";
import net from "net";
import { ipcMain, IpcMainEvent, WebContents } from "electron";

interface GameIpcConnection {
    socket: net.Socket;
}

class GameIpcServer {
    private connections: GameIpcConnection[];
    private ipcServer: net.Server;
    private readonly mainWindow: WebContents;

    constructor(mainWindow: WebContents) {
        this.connections = [];
        this.mainWindow = mainWindow;

        ipcMain.on(ElectronIpcChannels.Commands, this.handleCommandsMessage);

        this.handleGameIpc = this.handleGameIpc.bind(this);
    }

    start(port: number) {
        this.ipcServer = net.createServer(this.handleGameIpc);
        this.ipcServer.listen(port);
    }

    private handleCommandsMessage(event: IpcMainEvent, message: CommandsMessage) {
        
    }

    private handleGameIpc(socket: net.Socket) {
        console.log("[GameIPC] New connection from game");

        socket.setEncoding("utf-8");
        this.connections.push({ socket });
    
        socket.on("data", (data: string) => {
            // TODO: handle incomplete messages.
            console.log("[GameIPC] Received message:", data);

            let message;
            try {
                message = JSON.parse(data);
            } catch (e) {
                console.log("[GameIPC] Could not parse received message as JSON");
                return;
            }

            if (!message?.id) {
                console.log("[GameIPC] Received message doesn't have an id");
                return;
            }

            switch (message.id) {

            }

            socket.write('{"id":"COMMANDS", "commands": ["sv_lobby 0", "sv_radio 1"]}');
        });
        socket.on("end", () => {
            console.log("[GameIPC] Game disconnected");
        });
    }
}

export default GameIpcServer;