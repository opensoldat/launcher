import path from "path";
import { isProduction } from "src/environment";

const soldatPaths = {
    clientDirectory: isProduction ? path.resolve(process.resourcesPath, "soldat") : "./soldat",
    serverDirectory: isProduction ? path.resolve(process.resourcesPath, "soldat") : "./soldat",

    get clientExecutable(): string {
        let clientExecutableFilename = "soldat";
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

    get serverConfigsDirectory(): string {
        return path.join(this.serverDirectory, "configs");
    },

    get serverConfigFile(): string {
        return path.join(this.serverConfigsDirectory, "server.cfg");
    },

    get serverExecutable(): string {
        let serverExecutableFilename = "soldatserver";
        if (process.platform === "win32") {
            serverExecutableFilename += ".exe";
        }

        return path.join(this.serverDirectory, serverExecutableFilename);
    },

    get serverMapsList(): string {
        return path.join(this.serverConfigsDirectory, "mapslist.txt");
    }
};

export { soldatPaths };