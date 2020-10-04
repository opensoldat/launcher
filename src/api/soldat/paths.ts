import path from "path";

const isDev = process.env.NODE_ENV === "development";

const soldatPaths = {
    clientDirectory: isDev ? "./soldat" : path.resolve(process.resourcesPath, "soldat"),
    serverDirectory: isDev ? "./soldat" : path.resolve(process.resourcesPath, "soldat"),

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