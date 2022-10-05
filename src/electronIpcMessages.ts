enum ElectronIpcChannels {
    Commands = "COMMANDS"
};

enum CommandTarget {
    Client,
    Server,
    All
};

type CommandsMessage = {
    commands: string[];
    target: CommandTarget;
};

export { CommandsMessage, ElectronIpcChannels };