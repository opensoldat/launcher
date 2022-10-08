# OpenSoldat Launcher

Launcher for [OpenSoldat](https://github.com/opensoldat/opensoldat) game, a replacement for the old GUI that was removed in version 1.8.

It's an Electron app, written in Typescript with [React](https://reactjs.org/) and [MobX](https://mobx.js.org).

## Available features

- List, sort and filter available servers, and join online games from _Lobby_ tab
- Configure and start a new local game from _Local_ tab
- List and play recorded demos from _Demos_ tab
- Configure client settings from _Settings_ tab

## Screenshots

<p>
    <img src="https://i.imgur.com/Qve2H0I.png" width="200">
    <img src="https://i.imgur.com/JFiXxDw.png" width="200">
    <img src="https://i.imgur.com/wRmHF8Q.png" width="200">
    <img src="https://i.imgur.com/BwxTSfi.png" width="200">
    <img src="https://i.imgur.com/YAb0PCU.png" width="200">
</p>

## Installation and usage

To run the app, you will need [Node.js](https://nodejs.org).

To install dependencies, run this command from project's root directory:

```sh
npm install
```

Afterwards, you can run following commands:

```sh
# Starts the app in development mode.
npm start

# Builds binaries. The output will be in out/ directory.
npm run make

# Runs tests.
npm test

# Runs ESLint.
npm run lint
```

This project is meant to be used together with OpenSoldat binaries. By default, the launcher will expect to find a directory called `opensoldat` at the root of this project. It should contain all files that OpenSoldat needs to operate (binaries for both server and client, dynamic libraries, soldat.smod file and font for the client). When making a release build (with `npm run make`), this `opensoldat` directory will be copied to Electron's resources folder.

When running the app with `npm start`, you can type `rs` in the same terminal to quickly restart it.

## License

The launcher is licensed under [MIT](./LICENSE) license.

Files in the `assets` directory were taken from [OpenSoldat's base repository](https://github.com/opensoldat/base) and are licensed under [CC BY 4.0](https://github.com/opensoldat/base/blob/master/LICENSE.txt). Their original author is Michał Marcinkowski. No changes were made to the files.
