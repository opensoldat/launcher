import path from "path";

const soldatPaths = {
    clientDirectory: "../client",
    serverDirectory: "../server",

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

    get clientGraphicsConfigFile(): string {
        return path.join(this.clientConfigsDirectory, "graphics.cfg");
    },

    get clientPlayerConfigFile(): string {
        return path.join(this.clientConfigsDirectory, "player.cfg");
    },

    get clientSoundConfigFile(): string {
        return path.join(this.clientConfigsDirectory, "sound.cfg");
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