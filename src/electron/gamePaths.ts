import path from "path";
import { isProduction } from "src/environment";

const gamePaths = {
    clientDirectory: isProduction ? path.resolve(process.resourcesPath, "opensoldat") : "./opensoldat",
    serverDirectory: isProduction ? path.resolve(process.resourcesPath, "opensoldat") : "./opensoldat",

    get clientExecutable(): string {
        let clientExecutableFilename = "opensoldat";
        if (process.platform === "win32") {
            clientExecutableFilename += ".exe";
        }

        return path.join(this.clientDirectory, clientExecutableFilename);
    },

    get clientConfigsDirectory(): string {
        return path.join(this.clientDirectory, "configs");
    },

    get clientControlsConfigFile(): string {
        return path.join(this.clientConfigsDirectory, "controls.cfg");
    },

    get clientCustomBindingsConfigFile(): string {
        return path.join(this.clientConfigsDirectory, "bindings.cfg");
    },

    get clientGameConfigFile(): string {
        return path.join(this.clientConfigsDirectory, "game.cfg");
    },

    get clientGraphicsConfigFile(): string {
        return path.join(this.clientConfigsDirectory, "graphics.cfg");
    },

    get clientPlayerConfigFile(): string {
        return path.join(this.clientConfigsDirectory, "player.cfg");
    },

    get clientSoundConfigFile(): string {
        return path.join(this.clientConfigsDirectory, "sound.cfg");
    },

    get customInterfacesDirectory(): string {
        return path.join(this.clientDirectory, "custom-interfaces");
    },

    get demosDirectory(): string {
        return path.join(this.clientDirectory, "demos");
    },

    get mapsDirectory(): string {
        // We only list maps in server's directory (in case server and client aren't in same folder).
        return path.join(this.serverDirectory, "maps");
    },

    get modsDirectory(): string {
        return path.join(this.clientDirectory, "mods");
    },

    get serverConfigsDirectory(): string {
        return path.join(this.serverDirectory, "configs");
    },

    get serverConfigFile(): string {
        return path.join(this.serverConfigsDirectory, "server.cfg");
    },

    get serverExecutable(): string {
        let serverExecutableFilename = "opensoldatserver";
        if (process.platform === "win32") {
            serverExecutableFilename += ".exe";
        }

        return path.join(this.serverDirectory, serverExecutableFilename);
    },

    get serverMapsList(): string {
        return path.join(this.serverConfigsDirectory, "mapslist.txt");
    }
};

export { gamePaths };